// Copies the Pyodide runtime from node_modules into public/ so the Python playground
// loads it from this site. Runs before dev and build; the copy is git-ignored.
import { copyFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules', 'pyodide')
const dest = join(root, 'public', 'static', 'pyodide')
const files = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
]

mkdirSync(dest, { recursive: true })
for (const file of files) {
  const from = join(src, file)
  const to = join(dest, file)
  if (existsSync(to) && statSync(to).mtimeMs >= statSync(from).mtimeMs) continue
  copyFileSync(from, to)
}
console.log(`pyodide: ${files.length} files in public/static/pyodide`)
