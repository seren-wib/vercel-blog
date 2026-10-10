import { allCoreContent } from 'pliny/utils/contentlayer'
import { getCategoryLabel, sortByChapter } from '@/data/categories'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { getDictionary, locales, type Locale, asLocale } from '@/data/i18n'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5
const counts = categoryData as Record<string, Record<string, number>>

export async function generateMetadata(props: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale: rawLocale, category: rawCategory } = await props.params
  const locale = asLocale(rawLocale)
  const category = decodeURI(rawCategory)
  const label = getCategoryLabel(category)
  return genPageMetadata({
    title: label,
    description: getDictionary(locale).categoryPosts(label),
    locale,
    path: `/blog/category/${category}/`,
    availableLocales: locales.filter((l) => counts[l]?.[category]),
  })
}

export const generateStaticParams = async () =>
  locales.flatMap((locale) =>
    Object.keys(counts[locale] ?? {}).map((category) => ({ locale, category: encodeURI(category) }))
  )

export default async function CategoryPage(props: {
  params: Promise<{ locale: string; category: string }>
}) {
  const params = await props.params
  const category = decodeURI(params.category)
  const filteredPosts = sortByChapter(
    allCoreContent(
      allBlogs.filter(
        (post) => post.locale === asLocale(params.locale) && post.category === category
      )
    )
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
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
