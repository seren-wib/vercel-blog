'use client'

import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Category from '@/components/Category'
import categoryData from 'app/category-data.json'
import { getCategoryLabel, sortCategories } from '@/data/categories'
import { getDictionary, localeInfo, localePath, type Locale } from '@/data/i18n'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  locale: Locale
  posts: CoreContent<Blog>[]
  title: string
  description?: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage, locale }: PaginationProps & { locale: Locale }) {
  const pathname = usePathname()
  const dict = getDictionary(locale)
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/\/?page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash, so the landing page becomes '/<locale>'
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            {dict.previous}
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `${basePath}/` : `${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            {dict.previous}
          </Link>
        )}
        <span>{dict.pageOf(currentPage, totalPages)}</span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            {dict.next}
          </button>
        )}
        {nextPage && (
          <Link href={`${basePath}/page/${currentPage + 1}`} rel="next">
            {dict.next}
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithCategories({
  locale,
  posts,
  title,
  description,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const dict = getDictionary(locale)
  const categoryCounts = (categoryData as Record<string, Record<string, number>>)[locale] ?? {}
  const sortedCategories = sortCategories(Object.keys(categoryCounts))
  const currentCategory = decodeURI(pathname.split('/blog/category/')[1] ?? '').split('/')[0]
  const home = localePath(locale)
  const isAllPosts = pathname.replace(/\/$/, '') === home || pathname.startsWith(`${home}/page/`)

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="border-primary-500 mt-2 rounded-sm border-l-4 bg-gray-50 px-6 py-5 text-base leading-7 text-gray-600 shadow-md sm:mt-0 dark:bg-gray-900/70 dark:text-gray-300 dark:shadow-gray-800/40">
              {description}
            </p>
          )}
          <nav aria-label={dict.categories} className="mt-4 flex flex-wrap gap-2 sm:hidden">
            {sortedCategories.map((c) => (
              <Link
                key={c}
                href={localePath(locale, `/blog/category/${c}`)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  c === currentCategory
                    ? 'border-primary-500 text-primary-500'
                    : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                {getCategoryLabel(c)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-gray-50 pt-5 shadow-md sm:flex dark:bg-gray-900/70 dark:shadow-gray-800/40">
            <div className="px-6 py-4">
              {isAllPosts ? (
                <h3 className="text-primary-500 font-bold uppercase">{dict.allPosts}</h3>
              ) : (
                <Link
                  href={home}
                  className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
                >
                  {dict.allPosts}
                </Link>
              )}
              <h3 className="mt-6 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {dict.categories}
              </h3>
              <ul>
                {sortedCategories.map((c) => (
                  <li key={c} className="my-3">
                    {c === currentCategory ? (
                      <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                        {`${getCategoryLabel(c)} (${categoryCounts[c]})`}
                      </h3>
                    ) : (
                      <Link
                        href={localePath(locale, `/blog/category/${c}`)}
                        className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                        aria-label={dict.viewCategoryPosts(getCategoryLabel(c))}
                      >
                        {`${getCategoryLabel(c)} (${categoryCounts[c]})`}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, category } = post
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">{dict.publishedOn}</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, localeInfo[locale].dateLocale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            <Category category={category} locale={locale} />
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                locale={locale}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
