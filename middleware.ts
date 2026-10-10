import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, type Locale } from '@/data/i18n'

/**
 * Every page lives under /<locale>/ (see docs/shared/pages.md).
 * - `/` goes to /kr when the browser prefers Korean, otherwise /en (temporary redirect, it depends on the visitor).
 * - Any other path without a locale prefix is an old URL from before /kr and /en: send it to /kr permanently.
 * Specific old post URLs are handled earlier by data/redirects.js.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]
  if (isLocale(first)) return NextResponse.next()

  const url = request.nextUrl.clone()
  if (pathname === '/') {
    url.pathname = `/${preferredLocale(request.headers.get('accept-language'))}/`
    return NextResponse.redirect(url, 307)
  }
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(url, 308)
}

/** kr when Korean is among the browser's languages, otherwise en (crawlers usually send none) */
function preferredLocale(acceptLanguage: string | null): Locale {
  const languages = (acceptLanguage ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())
  return languages.some((lang) => lang === 'ko' || lang.startsWith('ko-')) ? 'kr' : 'en'
}

export const config = {
  // Skip Next internals, API routes, static files and anything with a file extension (feeds, search index, sitemap)
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
}
