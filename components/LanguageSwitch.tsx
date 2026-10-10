'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import translationData from 'app/translation-data.json'
import { getDictionary, localeInfo, locales, switchLocalePath, type Locale } from '@/data/i18n'

const available = translationData as Record<Locale, string[]>

/** Slug of the post on this page ('<category>/<file>'), or null when the page is not a post */
function postSlug(pathname: string) {
  const match = pathname.match(/^\/[^/]+\/blog\/(?!category\/)([^/]+\/[^/]+)\/?$/)
  return match ? decodeURI(match[1]) : null
}

export default function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const dict = getDictionary(locale)
  const slug = postSlug(pathname)

  return (
    <div
      role="group"
      aria-label={dict.switchLanguage}
      className="flex items-center rounded-md border border-gray-300 text-xs font-semibold dark:border-gray-600"
    >
      {locales.map((target) => {
        const label = localeInfo[target].label
        const base = 'px-2 py-1'
        if (target === locale) {
          return (
            <span
              key={target}
              aria-current="true"
              className={`${base} bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900`}
            >
              {label}
            </span>
          )
        }
        // Only a real post with no translation disables the switch (a 404 under /blog/ does not)
        if (slug && available[locale]?.includes(slug) && !available[target]?.includes(slug)) {
          return (
            <span
              key={target}
              title={dict.translationMissing}
              aria-disabled="true"
              className={`${base} cursor-not-allowed text-gray-300 dark:text-gray-600`}
            >
              {label}
            </span>
          )
        }
        return (
          <Link
            key={target}
            href={switchLocalePath(pathname, target)}
            hrefLang={localeInfo[target].hreflang}
            className={`${base} hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
