'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeEditor from '../playground/CodeEditor'
import {
  runCompiled,
  runPython,
  warmPython,
  type Diagnostic,
  type RunHandle,
} from '../playground/runners'
import { algorithms, type AlgorithmId, type VisualizerLanguage } from './algorithms'
import { parseTrace, type Frame, type Trace } from './trace'

const LANGUAGES: { id: VisualizerLanguage; label: string; ext: string }[] = [
  { id: 'c', label: 'C', ext: 'c' },
  { id: 'python', label: 'Python', ext: 'py' },
]
const SIZES = [8, 12, 16, 24, 32]
const SPEEDS = [0.5, 1, 2, 4]
const BASE_DELAY_MS = 420
const MIN_VALUE = 5
const MAX_VALUE = 99

const COMPILE_TEXTS = {
  buildFailed: 'Build failed.',
  timedOut: 'Stopped: the time limit was exceeded.',
  network: 'Could not reach Compiler Explorer.',
  exitCode: (code: number) => `Exit code ${code}`,
}

function randomInput(size: number) {
  return Array.from(
    { length: size },
    () => MIN_VALUE + Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1))
  )
}

function caption(frame: Frame, phases: Record<string, string>, size: number) {
  const stage = frame.phase ? (phases[frame.phase] ?? frame.phase) : null
  const h = frame.highlight
  const v = frame.values
  let step: string
  if (!h) step = `Random input, ${size} values`
  else if (h.kind === 'cmp') step = `Compare a[${h.i}]=${v[h.i]} with a[${h.j}]=${v[h.j!]}`
  else if (h.kind === 'swap') step = `Swap a[${h.i}] ↔ a[${h.j}]`
  else step = `a[${h.i}]=${v[h.i]} is in its final place`
  return stage ? `${stage} · ${step}` : step
}

function barClass(frame: Frame, k: number) {
  const h = frame.highlight
  if (h && (h.i === k || h.j === k)) {
    if (h.kind === 'swap') return 'bg-rose-500 dark:bg-rose-400'
    if (h.kind === 'cmp') return 'bg-sky-500 dark:bg-sky-400'
  }
  if (frame.sorted[k]) return 'bg-gray-900 dark:bg-gray-100'
  return 'bg-gray-300 dark:bg-gray-600'
}

function Bars({ frame }: { frame: Frame | null }) {
  if (!frame) {
    return (
      <div className="flex h-56 items-center justify-center rounded border border-dashed border-gray-300 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Press Run to sort a new random array.
      </div>
    )
  }
  const max = Math.max(...frame.values, 1)
  const showValues = frame.values.length <= 24
  return (
    <div
      className="flex h-56 items-end gap-[3px]"
      role="img"
      aria-label={`Array: ${frame.values.join(', ')}`}
    >
      {frame.values.map((value, k) => (
        <div key={k} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
          {showValues && (
            <span className="mb-1 font-mono text-[10px] leading-none text-gray-500 tabular-nums dark:text-gray-400">
              {value}
            </span>
          )}
          <div
            className={`w-full rounded-t-sm transition-[height,background-color] duration-200 ${barClass(frame, k)}`}
            style={{ height: `${(value / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  )
}

function Legend({ rest }: { rest: string }) {
  const item = (color: string, label: string) => (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-sm ${color}`} />
      {label}
    </span>
  )
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
      {item('bg-sky-500 dark:bg-sky-400', 'Compare')}
      {item('bg-rose-500 dark:bg-rose-400', 'Swap')}
      {item('bg-gray-900 dark:bg-gray-100', 'Sorted')}
      {item('bg-gray-300 dark:bg-gray-600', rest)}
    </div>
  )
}

type Status = 'idle' | 'loading' | 'running' | 'done' | 'error'

export default function SortVisualizer({ algorithm }: { algorithm: AlgorithmId }) {
  const algo = algorithms[algorithm]
  const [language, setLanguage] = useState<VisualizerLanguage>('c')
  const [code, setCode] = useState<Record<VisualizerLanguage, string>>({ ...algo.code })
  const [size, setSize] = useState(16)
  const [speed, setSpeed] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const [note, setNote] = useState<string>()
  const [errors, setErrors] = useState<string[]>([])
  const [stdout, setStdout] = useState('')
  const [trace, setTrace] = useState<Trace | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const handle = useRef<RunHandle | null>(null)

  useEffect(() => () => handle.current?.stop(), [])

  const pickLanguage = (id: VisualizerLanguage) => {
    setLanguage(id)
    setDiagnostics([])
    // Start downloading Pyodide as soon as Python is picked
    if (id === 'python') warmPython()
  }

  const run = useCallback(() => {
    handle.current?.stop()
    setPlaying(false)
    setErrors([])
    setDiagnostics([])
    setNote(undefined)

    const input = randomInput(size)
    const stdin = `${size}\n${input.join(' ')}\n`
    const out: string[] = []
    const err: string[] = []
    const compilerLog: string[] = []

    const callbacks = {
      emit: (line: { kind: 'out' | 'err' | 'sys'; text: string }) => {
        if (line.kind === 'out') out.push(line.text)
        else if (line.kind === 'err') err.push(line.text)
        else compilerLog.push(line.text)
      },
      ready: () => setStatus('running'),
      diagnostics: setDiagnostics,
      done: (summary?: string) => {
        const text = out.join('\n')
        setStdout(text)
        const parsed = parseTrace(text)
        const failed = err.length > 0 && parsed.frames.length === 0
        setErrors(failed ? [...compilerLog, ...err] : [...err, ...parsed.problems])
        setNote(summary)
        if (parsed.frames.length) {
          setTrace(parsed)
          setIndex(0)
          setPlaying(true)
          setStatus('done')
        } else {
          setStatus('error')
        }
      },
    }

    if (language === 'python') {
      setStatus('loading')
      handle.current = runPython(
        code.python,
        stdin,
        callbacks,
        (s) => `Stopped: did not finish within ${s} s.`
      )
    } else {
      setStatus('running')
      handle.current = runCompiled('c', code.c, stdin, callbacks, COMPILE_TEXTS)
    }
  }, [code, language, size])

  // Playback: one frame per tick until the end
  useEffect(() => {
    if (!playing || !trace) return
    if (index >= trace.frames.length - 1) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setIndex((i) => i + 1), BASE_DELAY_MS / speed)
    return () => clearTimeout(id)
  }, [playing, index, trace, speed])

  const frame = trace ? trace.frames[Math.min(index, trace.frames.length - 1)] : null
  const total = trace ? trace.frames.length : 0
  const atEnd = trace ? index >= total - 1 : false
  const counts = useMemo(() => {
    if (!trace) return null
    const upTo = trace.frames.slice(1, index + 1)
    return {
      cmp: upTo.filter((f) => f.highlight?.kind === 'cmp').length,
      swap: upTo.filter((f) => f.highlight?.kind === 'swap').length,
    }
  }, [trace, index])

  const busy = status === 'loading' || status === 'running'
  const statusText =
    status === 'loading'
      ? 'Loading Python… (about 10 MB, first time only)'
      : status === 'running'
        ? language === 'c'
          ? 'Compiling and running on Compiler Explorer…'
          : 'Running…'
        : note

  const button =
    'rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100'
  const ghost = `${button} border-gray-300 text-gray-700 hover:border-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-100`
  const select =
    'rounded-md border border-gray-300 bg-transparent py-1 pr-7 pl-2 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200 dark:[&>option]:bg-gray-900'
  const lang = LANGUAGES.find((l) => l.id === language)!
  const fileName = `${algorithm.replace(/-/g, '_')}.${lang.ext}`

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 [--pg-active:rgb(0_0_0/0.035)] [--pg-line:var(--color-gray-200)] [--pg-muted:var(--color-gray-400)] [--pg-panel:var(--color-white)] [--pg-selection:rgb(0_0_0/0.12)] dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:[--pg-active:rgb(255_255_255/0.04)] dark:[--pg-line:var(--color-gray-700)] dark:[--pg-muted:var(--color-gray-500)] dark:[--pg-panel:var(--color-gray-900)] dark:[--pg-selection:rgb(255_255_255/0.16)]">
      {/* Code */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-3 py-2 dark:border-gray-700">
        <div className="flex items-center gap-1" role="tablist" aria-label="Language">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={language === l.id}
              onClick={() => pickLanguage(l.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                language === l.id
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              }`}
            >
              {l.label}
            </button>
          ))}
          <span className="ml-2 font-mono text-xs text-gray-500 dark:text-gray-400">
            {fileName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCode((c) => ({ ...c, [language]: algo.code[language] }))}
          disabled={code[language] === algo.code[language]}
          className="text-xs text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Reset code
        </button>
      </div>
      <div className="h-[360px] border-b border-gray-200 dark:border-gray-700">
        <CodeEditor
          language={language}
          value={code[language]}
          onChange={(value) => setCode((c) => ({ ...c, [language]: value }))}
          onRun={run}
          diagnostics={diagnostics}
          label={fileName}
        />
      </div>

      {/* Run */}
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={run}
            disabled={busy}
            className={`${button} border-gray-900 bg-gray-900 text-white hover:bg-gray-700 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300`}
          >
            ▶ Run with random input
          </button>
          <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            Size
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className={select}
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            {statusText}
          </span>
        </div>

        <Bars frame={frame} />

        <p className="min-h-5 font-mono text-[13px] text-gray-700 dark:text-gray-300">
          {frame ? caption(frame, algo.phases, frame.values.length) : ' '}
        </p>

        {trace && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={ghost}
              onClick={() => {
                if (atEnd) setIndex(0)
                setPlaying((p) => !p || atEnd)
              }}
            >
              {playing ? '❚❚ Pause' : atEnd ? '↺ Replay' : '▶ Play'}
            </button>
            <button
              type="button"
              className={ghost}
              disabled={atEnd}
              onClick={() => {
                setPlaying(false)
                setIndex((i) => Math.min(i + 1, total - 1))
              }}
            >
              Step ›
            </button>
            <input
              type="range"
              min={0}
              max={total - 1}
              value={index}
              onChange={(e) => {
                setPlaying(false)
                setIndex(Number(e.target.value))
              }}
              aria-label="Step"
              className="min-w-32 flex-1 accent-gray-900 dark:accent-gray-100"
            />
            <span className="font-mono text-xs text-gray-500 tabular-nums dark:text-gray-400">
              {index} / {total - 1}
            </span>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              Speed
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className={select}
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>
                    {s}×
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {trace && <Legend rest={algo.unsortedLabel} />}

        {trace && counts && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs text-gray-600 dark:text-gray-300">
            <dt className="text-gray-500 dark:text-gray-400">Input</dt>
            <dd className="break-all">{trace.input.join(' ')}</dd>
            <dt className="text-gray-500 dark:text-gray-400">Output</dt>
            <dd className="break-all">{atEnd && trace.output ? trace.output.join(' ') : '…'}</dd>
            <dt className="text-gray-500 dark:text-gray-400">Steps</dt>
            <dd>
              {counts.cmp} compares, {counts.swap} swaps
            </dd>
          </dl>
        )}

        {errors.length > 0 && (
          <pre className="overflow-x-auto rounded bg-red-50 px-3 py-2 font-mono text-xs whitespace-pre-wrap text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {errors.join('\n')}
          </pre>
        )}

        {stdout && (
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-500 select-none hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Program output ({stdout.split('\n').length} lines)
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded bg-gray-100 px-3 py-2 font-mono text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {stdout}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
