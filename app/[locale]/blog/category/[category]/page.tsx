import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { parentOf } from '@/data/categories'
import { locales, asLocale } from '@/data/i18n'
import { BlogListPage, categoryCounts, listMetadata } from 'app/blog-routes'

/**
 * Category without a parent: /<locale>/blog/category/<category>/.
 * Categories under a parent live at /<locale>/blog/<parent>/<category>/ (catch-all route);
 * their old /blog/category/<category>/ URLs are redirected in data/redirects.js.
 */
const isTopLevel = (locale: string, category: string) =>
  !parentOf(category) && Boolean(categoryCounts[locale]?.[category])

export async function generateMetadata(props: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const locale = asLocale(params.locale)
  const category = decodeURI(params.category)
  if (!isTopLevel(locale, category)) return
  return listMetadata(locale, { kind: 'category', categoryPath: category, page: 1 })
}

export const generateStaticParams = async () =>
  locales.flatMap((locale) =>
    Object.keys(categoryCounts[locale] ?? {})
      .filter((category) => !parentOf(category))
      .map((category) => ({ locale, category: encodeURI(category) }))
  )

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; category: string }>
}) {
  const params = await props.params
  const locale = asLocale(params.locale)
  const category = decodeURI(params.category)
  if (!isTopLevel(locale, category)) return notFound()
  return (
    <BlogListPage locale={locale} list={{ kind: 'category', categoryPath: category, page: 1 }} />
  )
}
