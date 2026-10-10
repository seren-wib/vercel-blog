import { allCoreContent } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import { getCategoryLabel, sortByChapter } from '@/data/categories'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const params = await props.params
  const label = getCategoryLabel(decodeURI(params.category))
  return genPageMetadata({
    title: label,
    description: `${siteMetadata.title} ${label} posts`,
  })
}

export const generateStaticParams = async () => {
  return Object.keys(categoryData).map((category) => ({ category: encodeURI(category) }))
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params
  const category = decodeURI(params.category)
  const filteredPosts = sortByChapter(
    allCoreContent(allBlogs.filter((post) => post.category === category))
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={getCategoryLabel(category)}
    />
  )
}
