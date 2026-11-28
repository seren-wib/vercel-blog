import { notFound } from 'next/navigation'
import { parentOf } from '@/data/categories'
import { locales, asLocale } from '@/data/i18n'
import { BlogListPage, POSTS_PER_PAGE, categoryCounts, listMetadata } from 'app/blog-routes'

/** /<locale>/blog/category/<category>/page/<n>/ for a category without a parent */
const pageCount = (locale: string, category: string) =>
  parentOf(category) ? 0 : Math.ceil((categoryCounts[locale]?.[category] ?? 0) / POSTS_PER_PAGE)

export const generateStaticParams = async () =>
  locales.flatMap((locale) =>
    Object.keys(categoryCounts[locale] ?? {})
      .filter((category) => !parentOf(category))
      .flatMap((category) =>
        Array.from({ length: Math.max(1, pageCount(locale, category)) }, (_, i) => ({
          locale,
          category: encodeURI(category),
          page: (i + 1).toString(),
        }))
      )
  )

async function resolve(params: Promise<{ locale: string; category: string; page: string }>) {
  const { locale: rawLocale, category: rawCategory, page: rawPage } = await params
  const locale = asLocale(rawLocale)
  const category = decodeURI(rawCategory)
  const page = Number(rawPage)
  const valid = Number.isInteger(page) && page >= 1 && page <= pageCount(locale, category)
  return valid
    ? { locale, list: { kind: 'category' as const, categoryPath: category, page } }
    : null
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; category: string; page: string }>
}) {
  const route = await resolve(props.params)
  if (!route) return
  return listMetadata(route.locale, route.list)
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; category: string; page: string }>
}) {
  const route = await resolve(props.params)
  if (!route) return notFound()
  return <BlogListPage locale={route.locale} list={route.list} />
}
