import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from 'app/theme-providers'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, localeInfo } from '@/data/i18n'
import { feedPath } from 'app/seo'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  if (!isLocale(locale)) return {}
  const { description } = getDictionary(locale)
  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
      default: siteMetadata.title,
      template: `%s | ${siteMetadata.title}`,
    },
    description,
    openGraph: {
      title: siteMetadata.title,
      description,
      url: './',
      siteName: siteMetadata.title,
      images: [siteMetadata.socialBanner],
      locale: localeInfo[locale].ogLocale,
      type: 'website',
    },
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}${feedPath(locale)}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      title: siteMetadata.title,
      card: 'summary_large_image',
      images: [siteMetadata.socialBanner],
    },
  }
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { children } = props
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const basePath = process.env.BASE_PATH || ''
  const searchConfig = {
    ...siteMetadata.search,
    kbarConfig: { searchDocumentsPath: `${basePath}/search-${locale}.json` },
  }

  return (
    <html
      lang={localeInfo[locale].htmlLang}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9188608147369332"
        crossOrigin="anonymous"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}${feedPath(locale)}`} />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={searchConfig as SearchConfig}>
              <Header locale={locale} />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer locale={locale} />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
