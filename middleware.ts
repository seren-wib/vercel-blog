import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale } from '@/data/i18n'

/**
 * Every page lives under /<locale>/ (see docs/shared/pages.md).
 * - `/` goes to the default locale (temporary redirect, so the default can change later).
 * - Any other path without a locale prefix is an old URL from before /kr and /en: send it to /kr permanently.
 * Specific old post URLs are handled earlier by data/redirects.js.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]
  if (isLocale(first)) return NextResponse.next()

  const url = request.nextUrl.clone()
  if (pathname === '/') {
    url.pathname = `/${defaultLocale}/`
    return NextResponse.redirect(url, 307)
  }
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(url, 308)
}

export const config = {
  // Skip Next internals, API routes, static files and anything with a file extension (feeds, search index, sitemap)
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
}
