import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { playgroundLanguages } from '@/data/playground'
import { getDictionary, localePath, asLocale, locales } from '@/data/i18n'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  return genPageMetadata({
    title: dict.nav.playground,
    description: dict.pg.intro,
    locale,
    path: '/playground/',
  })
}

export default async function Playground(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {dict.nav.playground}
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{dict.pg.intro}</p>
      </div>
      <div className="py-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playgroundLanguages.map((lang) => (
            <li key={lang.id}>
              <Link
                href={localePath(locale, `/playground/${lang.id}`)}
                className="group flex h-full flex-col rounded-md border border-gray-200 bg-white p-5 transition-[border-color,box-shadow] duration-150 hover:border-gray-900 hover:shadow-md focus-visible:border-gray-900 dark:border-gray-800 dark:bg-gray-950/40 dark:hover:border-gray-100 dark:focus-visible:border-gray-100"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {lang.name}
                  </h2>
                  <span className="rounded-full border border-gray-300 px-2 py-0.5 text-[11px] whitespace-nowrap text-gray-500 dark:border-gray-600 dark:text-gray-400">
                    {lang.runner === 'browser' ? dict.inBrowser : dict.compilerExplorer}
                  </span>
                </div>
                <pre className="mt-4 overflow-hidden rounded bg-gray-100 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <code>{lang.preview}</code>
                </pre>
                <p className="mt-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {lang.summary[locale]}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{lang.engine}</span>
                  <span
                    aria-hidden="true"
                    className="text-base text-gray-900 transition-transform duration-150 group-hover:translate-x-1 dark:text-gray-100"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">{dict.pg.privacy}</p>
      </div>
    </div>
  )
}
