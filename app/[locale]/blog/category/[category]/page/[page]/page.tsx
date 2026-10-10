import { allCoreContent } from 'pliny/utils/contentlayer'
import { getCategoryLabel, sortByChapter } from '@/data/categories'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import { getDictionary, locales, type Locale, asLocale } from '@/data/i18n'

const POSTS_PER_PAGE = 5
const counts = categoryData as Record<string, Record<string, number>>

export const generateStaticParams = async () =>
  locales.flatMap((locale) => {
    const categoryCounts = counts[locale] ?? {}
    return Object.keys(categoryCounts).flatMap((category) => {
      const totalPages = Math.max(1, Math.ceil(categoryCounts[category] / POSTS_PER_PAGE))
      return Array.from({ length: totalPages }, (_, i) => ({
        locale,
        category: encodeURI(category),
        page: (i + 1).toString(),
      }))
    })
  })

export async function generateMetadata(props: {
  params: Promise<{ locale: string; category: string; page: string }>
}) {
  const { locale: rawLocale, category: rawCategory, page } = await props.params
  const locale = asLocale(rawLocale)
  const category = decodeURI(rawCategory)
  const label = getCategoryLabel(category)
  return genPageMetadata({
    title: label,
    description: getDictionary(locale).categoryPosts(label),
    locale,
    path: `/blog/category/${category}/page/${page}/`,
    availableLocales: locales.filter(
      (l) => Math.ceil((counts[l]?.[category] ?? 0) / POSTS_PER_PAGE) >= parseInt(page)
    ),
  })
}

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; category: string; page: string }>
}) {
  const params = await props.params
  const category = decodeURI(params.category)
  const pageNumber = parseInt(params.page)
  const filteredPosts = sortByChapter(
    allCoreContent(
      allBlogs.filter(
        (post) => post.locale === asLocale(params.locale) && post.category === category
      )
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = filteredPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      locale={asLocale(params.locale)}
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={getCategoryLabel(category)}
    />
  )
}
