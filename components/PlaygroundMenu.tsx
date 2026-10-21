import Link from './Link'
import { playgroundLanguages } from '@/data/playground'
import { getDictionary, localePath, type Locale } from '@/data/i18n'

/** Header "Playground" link. Hover or keyboard focus opens the language list below it. */
export default function PlaygroundMenu({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  return (
    <div className="group relative hidden sm:block">
      <Link
        href={localePath(locale, '/playground')}
        className="hover:text-primary-500 dark:hover:text-primary-400 m-1 inline-flex items-center gap-1 font-medium text-gray-600 dark:text-gray-300"
      >
        {dict.nav.playground}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-150 group-focus-within:rotate-180 group-hover:rotate-180"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
      {/* pt-2 bridges the gap so the menu stays open while the pointer moves down */}
      <div className="invisible absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="min-w-40 rounded-md border border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-950">
          {playgroundLanguages.map((lang) => (
            <li key={lang.id}>
              <Link
                href={localePath(locale, `/playground/${lang.id}`)}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
              >
                {lang.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
