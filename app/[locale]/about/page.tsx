import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { getDictionary, type Locale, asLocale, locales } from '@/data/i18n'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  return genPageMetadata({ title: getDictionary(locale).nav.about, locale, path: '/about/' })
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  // English profile is data/authors/default.mdx, Korean is data/authors/kr/default.mdx
  const author = (allAuthors.find((p) => p.slug === `${locale}/default`) ??
    allAuthors.find((p) => p.slug === 'default')) as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent} title={getDictionary(locale).nav.about}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
