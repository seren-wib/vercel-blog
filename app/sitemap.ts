import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import categoryData from 'app/category-data.json'
import { locales, localeInfo, localePath, type Locale } from '@/data/i18n'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]
  const counts = categoryData as Record<string, Record<string, number>>
  const published = allBlogs.filter((post) => !post.draft)

  /** One entry per locale that has `path`, each pointing at the others as alternates */
  const entries = (path: string, available: readonly Locale[], lastModified: string) => {
    const languages = Object.fromEntries(
      available.map((l) => [localeInfo[l].hreflang, `${siteUrl}${localePath(l, path)}`])
    )
    return available.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      lastModified,
      alternates: available.length > 1 ? { languages } : undefined,
    }))
  }

  const routes = ['/', '/latest/', '/blog/category/', '/projects/', '/about/'].flatMap((path) =>
    entries(path, locales, today)
  )

  const categories = [...new Set(locales.flatMap((l) => Object.keys(counts[l] ?? {})))]
  const categoryRoutes = categories.flatMap((category) =>
    entries(
      `/blog/category/${category}/`,
      locales.filter((l) => counts[l]?.[category]),
      today
    )
  )

  const slugs = [...new Set(published.map((post) => post.slug))]
  const blogRoutes = slugs.flatMap((slug) => {
    const versions = published.filter((post) => post.slug === slug)
    const post = versions[0]
    return entries(
      `/blog/${slug}/`,
      locales.filter((l) => versions.some((v) => v.locale === l)),
      post.lastmod || post.date
    )
  })

  return [...routes, ...categoryRoutes, ...blogRoutes]
}
