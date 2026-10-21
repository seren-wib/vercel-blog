/*
 * Python playground runner (Pyodide). The page passes the Pyodide version as ?v=,
 * so extra packages (numpy, ...) come from the matching jsDelivr folder.
 * Messages out: { type: 'ready' | 'out' | 'err' | 'sys' | 'done', text }.
 */
import { loadPyodide } from '/static/pyodide/pyodide.mjs'

const version = new URL(self.location.href).searchParams.get('v')

const ready = loadPyodide({
  indexURL: '/static/pyodide/',
  packageBaseUrl: `https://cdn.jsdelivr.net/pyodide/v${version}/full/`,
}).then(
  (py) => {
    self.postMessage({ type: 'ready' })
    return py
  },
  (err) => {
    self.postMessage({ type: 'err', text: String(err) })
    self.postMessage({ type: 'done' })
    throw err
  }
)

self.onmessage = async (e) => {
  const py = await ready
  const { code, stdin } = e.data
  const lines = stdin ? stdin.replace(/\n$/, '').split('\n') : []
  let next = 0
  py.setStdout({ batched: (text) => self.postMessage({ type: 'out', text }) })
  py.setStderr({ batched: (text) => self.postMessage({ type: 'err', text }) })
  py.setStdin({ stdin: () => (next < lines.length ? lines[next++] + '\n' : undefined) })

  const globals = py.globals.get('dict')()
  globals.set('__name__', '__main__')
  try {
    await py.loadPackagesFromImports(code, {
      messageCallback: (text) => self.postMessage({ type: 'sys', text }),
      errorCallback: (text) => self.postMessage({ type: 'err', text }),
    })
    await py.runPythonAsync(code, { globals, filename: '<main>' })
  } catch (err) {
    self.postMessage({ type: 'err', text: String(err.message || err).trimEnd() })
  } finally {
    globals.destroy()
    self.postMessage({ type: 'done' })
  }
}
