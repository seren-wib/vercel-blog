import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { getDictionary, type Locale, asLocale, locales } from '@/data/i18n'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

const POSTS_PER_PAGE = 5

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const metadata = genPageMetadata({ title: siteMetadata.title, locale, path: '/' })
  return {
    ...metadata,
    title: { absolute: siteMetadata.title },
    openGraph: { ...metadata.openGraph, title: siteMetadata.title },
  }
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  const posts = allCoreContent(sortPosts(allBlogs.filter((post) => post.locale === locale)))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      locale={locale}
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={dict.allPosts}
      description={dict.description}
    />
  )
}
