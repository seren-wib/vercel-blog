import { genPageMetadata } from 'app/seo'
import Glossary from '@/components/Glossary'
import glossary from '@/data/glossary/categories'
import { getDictionary, asLocale, locales } from '@/data/i18n'

// Letter sections in page order; must match scripts/glossary.mjs
const letters = ['0-9', ...'abcdefghijklmnopqrstuvwxyz']

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  return genPageMetadata({
    title: dict.nav.glossary,
    description: dict.glossaryIntro,
    locale,
    path: '/glossary/',
  })
}

export default async function GlossaryPage(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  return (
    <div>
      <h1 className="pt-6 text-3xl font-extrabold">{dict.nav.glossary}</h1>
      <p className="pt-2 text-gray-500 dark:text-gray-400">{dict.glossaryIntro}</p>
      <Glossary
        locale={locale}
        letters={letters}
        categoryLabels={glossary.glossaryCategories}
        searchLabel={dict.glossarySearch}
      />
    </div>
  )
}
