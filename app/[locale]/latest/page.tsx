import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { getDictionary, type Locale, asLocale, locales } from '@/data/i18n'
import Main from '../Main'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  return genPageMetadata({ title: getDictionary(locale).latest, locale, path: '/latest/' })
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const sortedPosts = sortPosts(allBlogs.filter((post) => post.locale === locale))
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} locale={locale} />
}
