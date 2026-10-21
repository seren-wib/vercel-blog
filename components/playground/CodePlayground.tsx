'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CodeEditor, { type EditorLanguage } from './CodeEditor'
import { examples } from './examples'
import {
  runCompiled,
  runJavaScript,
  runPython,
  warmPython,
  type Diagnostic,
  type OutputLine,
  type RunHandle,
} from './runners'
import { getDictionary, type Locale } from '@/data/i18n'

const FILE_NAMES: Record<EditorLanguage, string> = {
  html: 'index.html',
  javascript: 'main.js',
  python: 'main.py',
  c: 'main.c',
  cpp: 'main.cpp',
}

const MAX_LINES = 2000

/** Reads and writes are wrapped: storage can be blocked (private mode, previews) */
function load(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}
function save(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // not saved; the page still works
  }
}

/** Forwards console output and errors from the preview frame to the page */
const CONSOLE_BRIDGE = `<script>(function(){function f(a){return Array.prototype.map.call(a,function(x){if(typeof x==='string')return x;try{return JSON.stringify(x)}catch(e){return String(x)}}).join(' ')}function s(t,a){try{parent.postMessage({__playground:1,type:t,text:f(a)},'*')}catch(e){}}['log','info','debug'].forEach(function(k){console[k]=function(){s('out',arguments)}});['warn','error'].forEach(function(k){console[k]=function(){s('err',arguments)}});addEventListener('error',function(e){s('err',[e.message])});addEventListener('unhandledrejection',function(e){s('err',['Uncaught (in promise) '+(e.reason&&e.reason.message||e.reason)])})})()</script>`

function withBridge(code: string) {
  const head = code.match(/<head[^>]*>/i) ?? code.match(/<html[^>]*>/i)
  if (head && head.index !== undefined) {
    const at = head.index + head[0].length
    return code.slice(0, at) + CONSOLE_BRIDGE + code.slice(at)
  }
  return CONSOLE_BRIDGE + code
}

function Panel({
  title,
  aside,
  className = '',
  children,
}: {
  title: string
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700">
        <h2 className="font-mono font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
        {aside && <div className="truncate text-gray-500 dark:text-gray-400">{aside}</div>}
      </div>
      {children}
    </section>
  )
}

function OutputLines({ lines, empty }: { lines: OutputLine[]; empty: string | null }) {
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [lines])
  return (
    <div
      className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[13px] leading-relaxed"
      aria-live="polite"
    >
      {lines.length === 0 && empty && <p className="text-gray-400 dark:text-gray-500">{empty}</p>}
      {lines.map((line, i) => (
        <div
          key={i}
          className={`wrap-break-word whitespace-pre-wrap ${
            line.kind === 'err'
              ? 'text-red-600 dark:text-red-400'
              : line.kind === 'sys'
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {line.text || ' '}
        </div>
      ))}
      <div ref={end} />
    </div>
  )
}

type Status = 'idle' | 'loading' | 'running' | 'done'

export default function CodePlayground({
  language,
  locale,
}: {
  language: EditorLanguage
  locale: Locale
}) {
  const dict = getDictionary(locale)
  const t = dict.pg
  const example = examples[language]
  const usesStdin = language === 'python' || language === 'c' || language === 'cpp'
  const isHtml = language === 'html'
  const codeKey = `playground:${language}:code`
  const stdinKey = `playground:${language}:stdin`

  const [code, setCode] = useState(example.code)
  const [stdin, setStdin] = useState(example.stdin ?? '')
  const [lines, setLines] = useState<OutputLine[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [summary, setSummary] = useState<string>()
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [preview, setPreview] = useState({ html: '', key: 0 })
  const handle = useRef<RunHandle | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const buffer = useRef<OutputLine[]>([])
  const flushing = useRef(false)
  const codeRef = useRef(code)
  const stdinRef = useRef(stdin)
  codeRef.current = code
  stdinRef.current = stdin

  /** A fresh frame per update: changing srcdoc on a live frame does not always repaint it */
  const showPreview = useCallback(
    (html: string) => setPreview((p) => ({ html: withBridge(html), key: p.key + 1 })),
    []
  )

  // Restore saved code after hydration, so server and client render the same first frame
  useEffect(() => {
    const savedCode = load(codeKey)
    const savedStdin = load(stdinKey)
    if (savedCode !== null) setCode(savedCode)
    if (savedStdin !== null) setStdin(savedStdin)
    if (language === 'html') showPreview(savedCode ?? example.code)
    if (language === 'python') warmPython()
    return () => handle.current?.stop()
  }, [codeKey, stdinKey, language, example.code, showPreview])

  useEffect(() => {
    const id = setTimeout(() => save(codeKey, code), 400)
    return () => clearTimeout(id)
  }, [code, codeKey])
  useEffect(() => {
    const id = setTimeout(() => save(stdinKey, stdin), 400)
    return () => clearTimeout(id)
  }, [stdin, stdinKey])

  // Programs can print thousands of lines quickly; batch them into one render per frame
  const emit = useCallback((line: OutputLine) => {
    buffer.current.push(line)
    if (flushing.current) return
    flushing.current = true
    requestAnimationFrame(() => {
      flushing.current = false
      const batch = buffer.current
      buffer.current = []
      setLines((prev) => {
        if (prev.length >= MAX_LINES) return prev
        const next = prev.concat(batch)
        if (next.length < MAX_LINES) return next
        return next
          .slice(0, MAX_LINES)
          .concat({ kind: 'sys', text: `… ${MAX_LINES}+ lines, the rest is hidden` })
      })
    })
  }, [])

  const run = useCallback(() => {
    handle.current?.stop()
    buffer.current = []
    setLines([])
    setSummary(undefined)
    setDiagnostics([])

    if (language === 'html') {
      showPreview(codeRef.current)
      return
    }

    const callbacks = {
      emit,
      ready: () => setStatus('running'),
      diagnostics: setDiagnostics,
      done: (s?: string) => {
        setStatus('done')
        setSummary(s)
      },
    }
    if (language === 'javascript') {
      setStatus('running')
      handle.current = runJavaScript(codeRef.current, callbacks, t.timeLimit)
    } else if (language === 'python') {
      setStatus('loading')
      handle.current = runPython(codeRef.current, stdinRef.current, callbacks, t.timeLimit)
    } else {
      setStatus('running')
      handle.current = runCompiled(language, codeRef.current, stdinRef.current, callbacks, t)
    }
  }, [language, emit, t, showPreview])

  const stop = () => {
    handle.current?.stop()
    emit({ kind: 'sys', text: t.stopped })
  }

  const reset = () => {
    if (!window.confirm(t.resetConfirm)) return
    handle.current?.stop()
    setCode(example.code)
    setStdin(example.stdin ?? '')
    setLines([])
    setSummary(undefined)
    setDiagnostics([])
    setStatus('idle')
    if (isHtml) showPreview(example.code)
  }

  // HTML: refresh the preview shortly after typing stops
  useEffect(() => {
    if (!isHtml) return
    const id = setTimeout(() => {
      setLines([])
      showPreview(code)
    }, 600)
    return () => clearTimeout(id)
  }, [code, isHtml, showPreview])

  // HTML: console messages from the preview frame
  useEffect(() => {
    if (!isHtml) return
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || !e.data?.__playground) return
      emit({ kind: e.data.type === 'err' ? 'err' : 'out', text: String(e.data.text) })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [isHtml, emit])

  const busy = status === 'loading' || status === 'running'
  const statusText =
    status === 'loading'
      ? t.loadingPython
      : status === 'running'
        ? language === 'c' || language === 'cpp'
          ? t.compiling
          : t.running
        : summary

  const button =
    'rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100'

  return (
    <div className="[--pg-active:rgb(0_0_0/0.035)] [--pg-line:var(--color-gray-200)] [--pg-muted:var(--color-gray-400)] [--pg-panel:var(--color-white)] [--pg-selection:rgb(0_0_0/0.12)] dark:[--pg-active:rgb(255_255_255/0.04)] dark:[--pg-line:var(--color-gray-700)] dark:[--pg-muted:var(--color-gray-500)] dark:[--pg-panel:var(--color-gray-900)] dark:[--pg-selection:rgb(255_255_255/0.16)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          className={`${button} border-gray-900 bg-gray-900 text-white hover:bg-gray-700 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300`}
        >
          ▶ {dict.run}
        </button>
        {!isHtml && (
          <button
            type="button"
            onClick={stop}
            disabled={!busy}
            className={`${button} border-gray-300 text-gray-700 hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-100`}
          >
            ■ {dict.stop}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className={`${button} border-gray-300 text-gray-700 hover:border-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-100`}
        >
          {dict.reset}
        </button>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {isHtml ? t.htmlNote : t.shortcut}
        </span>
      </div>

      <div
        className={`grid gap-4 ${
          isHtml
            ? 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'
            : 'xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'
        }`}
      >
        <Panel title={FILE_NAMES[language]} className="h-[60vh] min-h-[420px] xl:h-[72vh]">
          <CodeEditor
            language={language}
            value={code}
            onChange={setCode}
            onRun={run}
            diagnostics={diagnostics}
            label={FILE_NAMES[language]}
          />
        </Panel>

        <div className="flex min-h-0 flex-col gap-4 xl:h-[72vh]">
          {usesStdin && (
            <Panel title={dict.stdin} aside={t.stdinHint}>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                spellCheck={false}
                aria-label={dict.stdin}
                className="h-28 w-full resize-y border-0 bg-transparent px-3 py-2 font-mono text-[13px] leading-relaxed text-gray-900 focus:ring-0 dark:text-gray-100"
              />
            </Panel>
          )}
          {isHtml && (
            <Panel title={dict.preview} className="h-[50vh] xl:h-auto xl:flex-1">
              <iframe
                ref={frame}
                title={dict.preview}
                key={preview.key}
                srcDoc={preview.html}
                sandbox="allow-scripts allow-modals allow-forms allow-popups"
                className="h-full w-full flex-1 bg-white"
              />
            </Panel>
          )}
          <Panel
            title={isHtml ? dict.console : dict.output}
            aside={statusText}
            className={isHtml ? 'h-44 shrink-0' : 'min-h-[260px] flex-1'}
          >
            <OutputLines
              lines={lines}
              empty={busy ? null : status === 'done' ? t.noOutput : isHtml ? null : t.idle}
            />
          </Panel>
        </div>
      </div>
    </div>
  )
}
