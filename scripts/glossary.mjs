/**
 * Glossary build: data/glossary/<letter>.jsonl -> public/glossary/*.json
 *
 * Source rows are appended by hand (one JSON object per line: term, categories, ko, en) and never sorted.
 * This script merges rows whose terms differ only in case (first row wins, categories are unioned),
 * sorts each letter, and writes:
 *   public/glossary/index.json           [{ term, slug, letter, categories, ko }] for search and #anchors
 *   public/glossary/<locale>/<letter>.json  [{ term, slug, categories, text }] loaded when a letter opens
 * It also checks that every [Term](glossary:<slug>) link in data/blog points at a term that exists
 * (plugins/remark-glossary-links.ts turns them into /<locale>/glossary/#<slug> at build time).
 * Any error fails the build.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, statSync } from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { slug } from 'github-slugger'

const require = createRequire(import.meta.url)
const { glossaryCategories } = require('../data/glossary/categories.js')

const root = process.cwd()
const srcDir = path.join(root, 'data/glossary')
const outDir = path.join(root, 'public/glossary')
export const letters = ['0-9', ...'abcdefghijklmnopqrstuvwxyz']
const locales = { kr: 'ko', en: 'en' }

export function letterOf(term) {
  const c = term.trim()[0]?.toLowerCase() ?? ''
  if (/[0-9]/.test(c)) return '0-9'
  if (/[a-z]/.test(c)) return c
  return null
}

export function loadGlossary() {
  const errors = []
  const bySlug = new Map()
  for (const letter of letters) {
    const file = path.join(srcDir, `${letter}.jsonl`)
    let raw = ''
    try {
      raw = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    raw.split(/\r?\n/).forEach((line, i) => {
      if (!line.trim()) return
      const where = `data/glossary/${letter}.jsonl:${i + 1}`
      let row
      try {
        row = JSON.parse(line)
      } catch (e) {
        errors.push(`${where}: invalid JSON (${e.message})`)
        return
      }
      const { term, categories, ko, en } = row
      if (typeof term !== 'string' || !term.trim()) return errors.push(`${where}: missing term`)
      if (typeof ko !== 'string' || !ko.trim()) errors.push(`${where}: missing ko`)
      if (typeof en !== 'string' || !en.trim()) errors.push(`${where}: missing en`)
      if (!Array.isArray(categories) || categories.length === 0)
        errors.push(`${where}: categories must be a non-empty list`)
      for (const c of categories ?? []) {
        if (!glossaryCategories[c])
          errors.push(`${where}: unknown category "${c}" (add it to data/glossary/categories.js)`)
      }
      if (letterOf(term) !== letter)
        errors.push(`${where}: "${term}" belongs in ${letterOf(term) ?? '?'}.jsonl`)
      const s = slug(term.trim())
      const prev = bySlug.get(s)
      if (prev) {
        // Same term in another case: keep the first row, add its categories
        for (const c of categories ?? []) if (!prev.categories.includes(c)) prev.categories.push(c)
        return
      }
      bySlug.set(s, {
        term: term.trim(),
        slug: s,
        letter,
        categories: [...(categories ?? [])],
        ko,
        en,
      })
    })
  }
  const entries = [...bySlug.values()].sort((a, b) =>
    a.term.localeCompare(b.term, 'en', { sensitivity: 'base', numeric: true })
  )
  return { entries, errors }
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.mdx')) out.push(p)
  }
  return out
}

export function checkLinks(entries) {
  const known = new Set(entries.map((e) => e.slug))
  const errors = []
  let links = 0
  const re = /\]\(glossary:([^)\s]*)\)/g
  const localeLink = /\]\(\/(kr|en)\/glossary\/#/g
  for (const file of walk(path.join(root, 'data/blog'))) {
    const text = readFileSync(file, 'utf8')
    if (localeLink.test(text))
      errors.push(`${path.relative(root, file)}: write glossary links as (glossary:<slug>)`)
    localeLink.lastIndex = 0
    for (const m of text.matchAll(re)) {
      links++
      const anchor = decodeURIComponent(m[1])
      if (anchor && !known.has(anchor))
        errors.push(`${path.relative(root, file)}: glossary link glossary:${anchor} has no entry`)
    }
  }
  return { links, errors }
}

function build() {
  const { entries, errors } = loadGlossary()
  const linkCheck = checkLinks(entries)
  const all = [...errors, ...linkCheck.errors]
  if (all.length) {
    console.error(`Glossary: ${all.length} error(s)`)
    for (const e of all.slice(0, 50)) console.error('  ' + e)
    process.exit(1)
  }
  rmSync(outDir, { recursive: true, force: true })
  for (const locale of Object.keys(locales))
    mkdirSync(path.join(outDir, locale), { recursive: true })
  const index = entries.map(({ term, slug, letter, categories, ko }) => ({
    term,
    slug,
    letter,
    categories,
    // Korean name before the first period, so Korean words are searchable too
    ko: ko.split(/[.。]/)[0].slice(0, 40),
  }))
  writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index))
  for (const locale of Object.keys(locales)) {
    for (const letter of letters) {
      const rows = entries
        .filter((e) => e.letter === letter)
        .map(({ term, slug, categories, ko, en }) => ({
          term,
          slug,
          categories,
          text: locale === 'kr' ? ko : en,
        }))
      writeFileSync(path.join(outDir, locale, `${letter}.json`), JSON.stringify(rows))
    }
  }
  console.log(`Glossary: ${entries.length} terms, ${linkCheck.links} links in posts`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build()
}
