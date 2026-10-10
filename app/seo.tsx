import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getDictionary, localeInfo, localePath, locales, type Locale } from '@/data/i18n'

/** RSS feed path for a locale: kr keeps the original /feed.xml */
export const feedPath = (locale: Locale) => (locale === 'kr' ? '/feed.xml' : `/${locale}/feed.xml`)

/**
 * hreflang alternates for a path that exists in the given locales (all locales by default).
 * `path` is the part after the locale prefix, e.g. '/latest/' or '/blog/os/os-13-io/'.
 */
export function languageAlternates(path: string, available: readonly Locale[] = locales) {
  const languages: Record<string, string> = {}
  for (const locale of available) {
    languages[localeInfo[locale].hreflang] = localePath(locale, path)
  }
  if (available.includes('en')) {
    languages['x-default'] = localePath('en', path)
  }
  return languages
}

interface PageSEOProps {
  title: string
  locale: Locale
  /** Path after the locale prefix, used for hreflang alternates */
  path: string
  /** Locales this page exists in (all by default) */
  availableLocales?: readonly Locale[]
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({
  title,
  locale,
  path,
  availableLocales,
  description,
  image,
  ...rest
}: PageSEOProps): Metadata {
  const pageDescription = description || getDictionary(locale).description
  return {
    title,
    description: pageDescription,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: pageDescription,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: localeInfo[locale].ogLocale,
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    alternates: {
      canonical: './',
      languages: languageAlternates(path, availableLocales),
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}${feedPath(locale)}`,
      },
    },
    ...rest,
  }
}
