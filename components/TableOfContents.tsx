'use client'

import { useEffect, useState } from 'react'
import type { Toc } from 'pliny/mdx-plugins'
import { usePathname } from 'next/navigation'
import { getDictionary, localeFromPathname } from '@/data/i18n'

function useContentsLabel() {
  return getDictionary(localeFromPathname(usePathname())).contents
}

const MAX_DEPTH = 4

interface Props {
  toc: Toc
  className?: string
}

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string>()

  useEffect(() => {
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px' }
    )
    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

function TocList({ toc, activeId }: { toc: Toc; activeId?: string }) {
  const minDepth = Math.min(...toc.map((h) => h.depth))
  return (
    <ul className="space-y-1 text-sm">
      {toc.map((heading) => {
        const id = heading.url.replace(/^#/, '')
        const active = id === activeId
        return (
          <li key={heading.url} style={{ paddingLeft: `${(heading.depth - minDepth) * 0.75}rem` }}>
            <a
              href={heading.url}
              className={
                active
                  ? 'text-primary-500 font-semibold'
                  : 'hover:text-primary-500 dark:hover:text-primary-400 text-gray-500 dark:text-gray-400'
              }
            >
              {heading.value}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/** Sticky sidebar table of contents (xl and up). */
export function TocSidebar({ toc, className = '' }: Props) {
  const headings = toc.filter((h) => h.depth <= MAX_DEPTH)
  const [ids] = useState(() => headings.map((h) => h.url.replace(/^#/, '')))
  const activeId = useActiveHeading(ids)
  const label = useContentsLabel()
  if (headings.length === 0) return null

  return (
    <nav aria-label={label} className={className}>
      <h2 className="mb-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {label}
      </h2>
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <TocList toc={headings} activeId={activeId} />
      </div>
    </nav>
  )
}

/** Collapsible table of contents shown above the post (below xl). */
export function TocInline({ toc, className = '' }: Props) {
  const headings = toc.filter((h) => h.depth <= MAX_DEPTH)
  const label = useContentsLabel()
  if (headings.length === 0) return null

  return (
    <details
      className={`rounded-md border border-gray-200 px-4 py-3 dark:border-gray-700 ${className}`}
    >
      <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </summary>
      <div className="mt-3">
        <TocList toc={headings} />
      </div>
    </details>
  )
}
