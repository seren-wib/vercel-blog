'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<unknown>
    SqlPlayground?: {
      mount: (
        el: HTMLElement,
        opts: {
          initSqlJs: Window['initSqlJs']
          locateFile: (file: string) => string
          lang: 'kr' | 'en'
        }
      ) => void
    }
  }
}

const BASE = '/static/sqljs/'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-sqlpg="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded) resolve()
      else {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error(src)))
      }
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.dataset.sqlpg = src
    s.addEventListener('load', () => {
      s.dataset.loaded = '1'
      resolve()
    })
    s.addEventListener('error', () => reject(new Error(src)))
    document.body.appendChild(s)
  })
}

export default function SqlPlayground({ lang = 'kr' }: { lang?: 'kr' | 'en' }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    loadScript(BASE + 'sql-wasm.js')
      .then(() => loadScript(BASE + 'playground.js'))
      .then(() => {
        if (cancelled || !ref.current || !window.SqlPlayground) return
        window.SqlPlayground.mount(ref.current, {
          initSqlJs: window.initSqlJs,
          locateFile: (file) => BASE + file,
          lang,
        })
      })
      .catch(() => {
        if (ref.current)
          ref.current.textContent =
            lang === 'en' ? 'Could not load the SQL playground.' : 'SQL 실습을 불러오지 못했어.'
      })
    return () => {
      cancelled = true
    }
  }, [lang])

  return (
    <div ref={ref} className="not-prose">
      {lang === 'en' ? 'Loading SQLite…' : 'SQLite 불러오는 중…'}
    </div>
  )
}
