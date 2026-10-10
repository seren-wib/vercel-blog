import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { getDictionary, locales, type Locale, asLocale } from '@/data/i18n'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 5

const postsFor = (locale: Locale) =>
  allCoreContent(sortPosts(allBlogs.filter((post) => post.locale === locale)))

export const generateStaticParams = async () =>
  locales.flatMap((locale) => {
    const totalPages = Math.ceil(postsFor(locale).length / POSTS_PER_PAGE)
    // Page 1 is the landing page itself (/<locale>/page/1 redirects to /<locale>)
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      locale,
      page: (i + 2).toString(),
    }))
  })

export async function generateMetadata(props: {
  params: Promise<{ locale: string; page: string }>
}) {
  const { locale: rawLocale, page } = await props.params
  const locale = asLocale(rawLocale)
  return genPageMetadata({ title: getDictionary(locale).allPosts, locale, path: `/page/${page}/` })
}

export default async function Page(props: { params: Promise<{ locale: string; page: string }> }) {
  const params = await props.params
  const posts = postsFor(asLocale(params.locale))
  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 1 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
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
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={getDictionary(asLocale(params.locale)).allPosts}
    />
  )
}
