import { notFound } from 'next/navigation'
import Link from '@/components/Link'
import SqlPlayground from '@/components/SqlPlayground'
import CodePlayground from '@/components/playground/CodePlayground'
import { genPageMetadata } from 'app/seo'
import { findPlaygroundLanguage, playgroundLanguages } from '@/data/playground'
import { getDictionary, localePath, asLocale, locales } from '@/data/i18n'

type Params = Promise<{ locale: string; lang: string }>

export const dynamicParams = false

export const generateStaticParams = () =>
  locales.flatMap((locale) => playgroundLanguages.map((lang) => ({ locale, lang: lang.id })))

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params
  const locale = asLocale(params.locale)
  const lang = findPlaygroundLanguage(params.lang)
  if (!lang) return {}
  return genPageMetadata({
    title: `${lang.name} ${getDictionary(locale).nav.playground}`,
    description: lang.summary[locale],
    locale,
    path: `/playground/${lang.id}/`,
  })
}

export default async function PlaygroundLanguagePage(props: { params: Params }) {
  const params = await props.params
  const locale = asLocale(params.locale)
  const lang = findPlaygroundLanguage(params.lang)
  if (!lang) notFound()
  const dict = getDictionary(locale)

  return (
    <div className="pt-6 pb-10">
      <Link
        href={localePath(locale, '/playground')}
        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        ← {dict.nav.playground}
      </Link>
      <div className="mt-3 mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 dark:text-gray-100">
            {lang.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{lang.engine}</p>
        </div>
        <nav aria-label={dict.nav.playground} className="flex flex-wrap gap-1.5">
          {playgroundLanguages.map((other) => (
            <Link
              key={other.id}
              href={localePath(locale, `/playground/${other.id}`)}
              aria-current={other.id === lang.id ? 'page' : undefined}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                other.id === lang.id
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                  : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-100 dark:hover:text-gray-100'
              }`}
            >
              {other.name}
            </Link>
          ))}
        </nav>
      </div>

      {lang.id === 'sql' ? (
        <>
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            {dict.pg.sqlNote}{' '}
            <Link
              href={localePath(locale, '/blog/database-systems/database-systems-ch3-sql/')}
              className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {dict.pg.sqlPost}
            </Link>
          </p>
          <div className="[&_.sqlpg]:mt-0 [&_.sqlpg_textarea]:min-h-[45vh]">
            <SqlPlayground lang={locale} />
          </div>
        </>
      ) : (
        <CodePlayground language={lang.id} locale={locale} />
      )}

      {lang.runner === 'compiler-explorer' && (
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">{dict.pg.privacy}</p>
      )}
    </div>
  )
}
