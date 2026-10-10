import { allCoreContent } from 'pliny/utils/contentlayer'
import { getCategoryLabel, sortByChapter } from '@/data/categories'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const categoryCounts = categoryData as Record<string, number>
  return Object.keys(categoryCounts).flatMap((category) => {
    const totalPages = Math.max(1, Math.ceil(categoryCounts[category] / POSTS_PER_PAGE))
    return Array.from({ length: totalPages }, (_, i) => ({
      category: encodeURI(category),
      page: (i + 1).toString(),
    }))
  })
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string; page: string }>
}) {
  const params = await props.params
  const category = decodeURI(params.category)
  const pageNumber = parseInt(params.page)
  const filteredPosts = sortByChapter(
    allCoreContent(allBlogs.filter((post) => post.category === category))
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
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={getCategoryLabel(category)}
    />
  )
}
