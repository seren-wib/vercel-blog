'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Locale } from '@/data/i18n'

type IndexRow = { term: string; slug: string; letter: string; categories: string[]; ko: string }
type Row = { term: string; slug: string; categories: string[]; text: string }

/**
 * Glossary page body. public/glossary/index.json (term names only) loads first for search and
 * #anchors; a letter's descriptions (public/glossary/<locale>/<letter>.json) load when it opens.
 */
export default function Glossary({
  locale,
  letters,
  categoryLabels,
  searchLabel,
}: {
  locale: Locale
  letters: string[]
  categoryLabels: Record<string, string>
  searchLabel: string
}) {
  const [index, setIndex] = useState<IndexRow[]>([])
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [rows, setRows] = useState<Record<string, Row[]>>({})
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetch('/glossary/index.json')
      .then((r) => r.json())
      .then(setIndex)
  }, [])

  const load = useCallback(
    (letter: string) => {
      if (rows[letter]) return Promise.resolve()
      return fetch(`/glossary/${locale}/${letter}.json`)
        .then((r) => r.json())
        .then((data: Row[]) => setRows((prev) => ({ ...prev, [letter]: data })))
    },
    [locale, rows]
  )

  const toggle = (letter: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(letter)) next.delete(letter)
      else {
        next.add(letter)
        load(letter)
      }
      return next
    })
  }

  // #<slug>: open that term's letter, load it, then scroll to it
  useEffect(() => {
    if (!index.length) return
    const go = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1))
      const hit = index.find((e) => e.slug === slug)
      if (!hit) return
      setOpen((prev) => new Set(prev).add(hit.letter))
      load(hit.letter).then(() =>
        requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView())
      )
    }
    go()
    window.addEventListener('hashchange', go)
    return () => window.removeEventListener('hashchange', go)
  }, [index, load])

  const q = query.trim().toLowerCase()
  const matches = useMemo(() => {
    const set = new Set<string>()
    for (const e of index) {
      if (category && !e.categories.includes(category)) continue
      if (q && !e.term.toLowerCase().includes(q) && !e.ko.toLowerCase().includes(q)) continue
      set.add(e.slug)
    }
    return set
  }, [index, q, category])
  const filtering = q !== '' || category !== ''

  // While filtering, open and load every letter that has a match
  useEffect(() => {
    if (!filtering) return
    for (const e of index) if (matches.has(e.slug)) load(e.letter)
  }, [filtering, matches, index, load])

  const usedCategories = useMemo(
    () => Object.keys(categoryLabels).filter((c) => index.some((e) => e.categories.includes(c))),
    [index, categoryLabels]
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2 py-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchLabel}
          aria-label={searchLabel}
          className="flex-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
          className="rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">All</option>
          {usedCategories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </div>
      {letters.map((letter) => {
        const count = index.filter((e) => e.letter === letter && matches.has(e.slug)).length
        if (!count) return null
        const isOpen = filtering || open.has(letter)
        return (
          <section key={letter} className="border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => toggle(letter)}
              aria-expanded={isOpen}
              className="w-full py-3 text-left text-xl font-bold"
            >
              {letter.toUpperCase()} <span className="text-sm text-gray-500">({count})</span>
            </button>
            {isOpen && (
              <dl className="pb-4">
                {(rows[letter] ?? [])
                  .filter((r) => matches.has(r.slug))
                  .map((r) => (
                    <div key={r.slug} id={r.slug} className="scroll-mt-32 py-2">
                      <dt className="font-semibold">
                        {r.term}{' '}
                        <span className="text-xs font-normal text-gray-500">
                          {r.categories.map((c) => categoryLabels[c] ?? c).join(', ')}
                        </span>
                      </dt>
                      <dd className="text-gray-700 dark:text-gray-300">{r.text}</dd>
                    </div>
                  ))}
              </dl>
            )}
          </section>
        )
      })}
    </div>
  )
}
