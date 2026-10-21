import pyodidePackage from 'pyodide/package.json'

/** One line in the output panel. `sys` lines are notes from the runner or compiler, not the program. */
export type OutputLine = { kind: 'out' | 'err' | 'sys'; text: string }

/** A compiler message tied to a source position (1-based), used to mark the editor. */
export type Diagnostic = {
  line: number
  column: number
  severity: 'error' | 'warning' | 'info'
  message: string
}

export type RunCallbacks = {
  emit: (line: OutputLine) => void
  /** Called once when the program ends, fails or is stopped */
  done: (summary?: string) => void
  diagnostics?: (list: Diagnostic[]) => void
  /** The runtime is loaded and the program starts now */
  ready?: () => void
}

export type RunHandle = { stop: () => void }

const TIME_LIMIT_MS = 15_000

type WorkerMessage = { type: string; text?: string }

/**
 * Drives one run on a worker. With `ready` the clock starts now; otherwise it starts when the
 * worker posts 'ready'. Stop and the time limit always kill the worker.
 */
function drive(
  worker: Worker,
  message: unknown,
  cb: RunCallbacks,
  limitText: (s: number) => string,
  opts: { ready: boolean; kill: () => void }
): RunHandle {
  let finished = false
  let killed = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let startedAt = 0

  const finish = (summary?: string) => {
    if (finished) return
    finished = true
    cb.done(summary)
  }
  const kill = () => {
    if (killed) return
    killed = true
    clearTimeout(timer)
    worker.removeEventListener('message', onMessage)
    worker.removeEventListener('error', onError)
    opts.kill()
  }
  const start = () => {
    startedAt = performance.now()
    timer = setTimeout(() => {
      if (!finished) cb.emit({ kind: 'err', text: limitText(TIME_LIMIT_MS / 1000) })
      finish()
      kill()
    }, TIME_LIMIT_MS)
  }
  function onMessage(e: MessageEvent<WorkerMessage>) {
    const { type, text = '' } = e.data
    if (type === 'ready') {
      cb.ready?.()
      start()
    } else if (type === 'done') {
      if (!startedAt) {
        // The runtime failed to load: throw this worker away
        finish()
        kill()
        return
      }
      finish(`${Math.round(performance.now() - startedAt)} ms`)
    } else if (type === 'out' || type === 'err' || type === 'sys') {
      cb.emit({ kind: type, text })
    }
  }
  function onError(e: ErrorEvent) {
    e.preventDefault()
    cb.emit({ kind: 'err', text: e.message || 'Worker error' })
    finish()
    kill()
  }
  worker.addEventListener('message', onMessage)
  worker.addEventListener('error', onError)
  worker.postMessage(message)
  if (opts.ready) {
    cb.ready?.()
    start()
  }
  return {
    stop: () => {
      finish()
      kill()
    },
  }
}

/**
 * JavaScript gets a fresh worker per run. After the main body ends the worker stays until the
 * next run, Stop or the time limit, so output from timers still shows up.
 */
export function runJavaScript(code: string, cb: RunCallbacks, limitText: (s: number) => string) {
  const worker = new Worker('/static/playground/js-worker.js')
  return drive(worker, { code }, cb, limitText, { ready: true, kill: () => worker.terminate() })
}

/** Python keeps one warm worker between runs, since loading Pyodide takes a few seconds. */
let python: { worker: Worker; ready: boolean } | null = null

function pythonSession() {
  if (!python) {
    const worker = new Worker(`/static/playground/py-worker.mjs?v=${pyodidePackage.version}`, {
      type: 'module',
    })
    const session = { worker, ready: false }
    worker.addEventListener('message', (e: MessageEvent<WorkerMessage>) => {
      if (e.data.type === 'ready') session.ready = true
    })
    python = session
  }
  return python
}

/** Starts loading Pyodide before the first run */
export function warmPython() {
  pythonSession()
}

export function runPython(
  code: string,
  stdin: string,
  cb: RunCallbacks,
  limitText: (s: number) => string
) {
  const session = pythonSession()
  return drive(session.worker, { code, stdin }, cb, limitText, {
    ready: session.ready,
    kill: () => {
      session.worker.terminate()
      if (python === session) python = null
    },
  })
}

/** Compiler Explorer compiler ids (https://godbolt.org/api/compilers/c) */
const COMPILERS = {
  c: { id: 'cg152', args: '-O2 -Wall -std=gnu17 -fdiagnostics-color=never -lm' },
  cpp: { id: 'g152', args: '-O2 -Wall -std=c++20 -fdiagnostics-color=never' },
}

type GodboltLine = {
  text: string
  tag?: { line: number; column: number; text: string; severity: number }
}

type GodboltResult = {
  code: number
  didExecute: boolean
  timedOut?: boolean
  execTime?: number | string
  stdout: GodboltLine[]
  stderr: GodboltLine[]
  buildResult?: { code: number; stdout: GodboltLine[]; stderr: GodboltLine[] }
}

export type CompileTexts = {
  buildFailed: string
  timedOut: string
  network: string
  exitCode: (code: number) => string
}

/** Sends the code to Compiler Explorer, which compiles it and runs it with `stdin`. */
export function runCompiled(
  lang: 'c' | 'cpp',
  code: string,
  stdin: string,
  cb: RunCallbacks,
  t: CompileTexts
): RunHandle {
  const controller = new AbortController()
  const compiler = COMPILERS[lang]
  let finished = false
  const finish = (summary?: string) => {
    if (finished) return
    finished = true
    cb.done(summary)
  }

  fetch(`https://godbolt.org/api/compiler/${compiler.id}/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({
      source: code,
      options: {
        userArguments: compiler.args,
        executeParameters: { stdin },
        compilerOptions: { executorRequest: true },
        filters: { execute: true },
      },
      allowStoreCodeDebug: false,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<GodboltResult>
    })
    .then((r) => {
      if (finished) return
      const build = r.buildResult
      const compilerLines = [...(build?.stdout ?? []), ...(build?.stderr ?? [])]
      cb.diagnostics?.(
        compilerLines.flatMap(({ tag }) =>
          tag && tag.line > 0
            ? [
                {
                  line: tag.line,
                  column: tag.column,
                  severity:
                    tag.severity >= 3
                      ? ('error' as const)
                      : tag.severity === 2
                        ? ('warning' as const)
                        : ('info' as const),
                  message: tag.text,
                },
              ]
            : []
        )
      )
      compilerLines.forEach((l) => cb.emit({ kind: 'sys', text: l.text }))
      if (build && build.code !== 0) {
        cb.emit({ kind: 'err', text: t.buildFailed })
        finish()
        return
      }
      r.stdout.forEach((l) => cb.emit({ kind: 'out', text: l.text }))
      r.stderr
        .filter((l) => l.text && !(r.timedOut && /processing time exceeded|SIGKILL/.test(l.text)))
        .forEach((l) => cb.emit({ kind: 'err', text: l.text }))
      if (r.timedOut) cb.emit({ kind: 'err', text: t.timedOut })
      const ms = r.execTime !== undefined ? ` · ${r.execTime} ms` : ''
      finish(t.exitCode(r.code) + ms)
    })
    .catch((err: Error) => {
      if (finished || err.name === 'AbortError') return
      cb.emit({ kind: 'err', text: `${t.network} (${err.message})` })
      finish()
    })

  return {
    stop: () => {
      controller.abort()
      finish()
    },
  }
}
