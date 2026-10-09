import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import categoryData from 'app/category-data.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}/`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: route ? `${siteUrl}/${route}/` : `${siteUrl}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const categoryRoutes = Object.keys(categoryData).map((category) => ({
    url: `${siteUrl}/blog/category/${category}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...categoryRoutes, ...blogRoutes]
}
