'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Category from '@/components/Category'
import categoryData from 'app/category-data.json'
import {
  categoryHref,
  categoryTree,
  getCategoryLabel,
  getParentLabel,
  parentHref,
} from '@/data/categories'
import { getDictionary, localeInfo, localePath, type Locale } from '@/data/i18n'
import { readCollapsed, writeCollapsed } from '@/data/sidebarCollapse'

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
  /** The parent and category this list belongs to, for highlighting in the sidebar */
  current?: { parent?: string; categoryPath?: string }
  /** Category links shown under the title of a parent page */
  subcategories?: { path: string; count: number }[]
}

const chipClass = (active: boolean) =>
  `rounded-full border px-3 py-1 text-sm ${
    active
      ? 'border-primary-500 text-primary-500'
      : 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300'
  }`

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

/** A sidebar entry: bold text when it is the current page, a link otherwise */
function SidebarLink({
  href,
  label,
  count,
  active,
  ariaLabel,
  strong = false,
}: {
  href: string
  label: string
  count: number
  active: boolean
  ariaLabel: string
  strong?: boolean
}) {
  const text = `${label} (${count})`
  if (active) {
    return (
      <h3 className="inline px-3 py-2 text-sm font-bold text-gray-950 uppercase dark:text-white">
        {text}
      </h3>
    )
  }
  return (
    <Link
      href={href}
      className={`hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm uppercase ${
        strong
          ? 'font-semibold text-gray-700 dark:text-gray-200'
          : 'font-medium text-gray-500 dark:text-gray-300'
      }`}
      aria-label={ariaLabel}
    >
      {text}
    </Link>
  )
}

export default function ListLayoutWithCategories({
  locale,
  posts,
  title,
  description,
  initialDisplayPosts = [],
  pagination,
  current = {},
  subcategories,
}: ListLayoutProps) {
  const pathname = usePathname()
  const dict = getDictionary(locale)
  const categoryCounts = (categoryData as Record<string, Record<string, number>>)[locale] ?? {}
  const tree = categoryTree(categoryCounts)
  const currentParentNode = tree.find(
    (node) => node.kind === 'parent' && node.parent === current.parent
  )
  const home = localePath(locale)
  // Collapsed parents; the head script already hid them before paint, this keeps aria-expanded in sync
  const [collapsed, setCollapsed] = useState<string[]>([])
  useEffect(() => setCollapsed(readCollapsed()), [])
  const toggle = (parent: string) => {
    const next = collapsed.includes(parent)
      ? collapsed.filter((p) => p !== parent)
      : [...collapsed, parent]
    writeCollapsed(next)
    setCollapsed(next)
  }
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
            <p className="mt-2 rounded-sm border-l-4 border-gray-900 bg-white px-6 py-5 text-base leading-7 text-gray-600 shadow-md ring-1 ring-gray-200 sm:mt-0 dark:border-gray-100 dark:bg-gray-950/60 dark:text-gray-300 dark:shadow-gray-800/40 dark:ring-gray-800">
              {description}
            </p>
          )}
          {subcategories && (
            <nav aria-label={dict.categories} className="mt-4 hidden flex-wrap gap-2 sm:flex">
              {subcategories.map((c) => (
                <Link
                  key={c.path}
                  href={localePath(locale, categoryHref(c.path))}
                  className={chipClass(false)}
                >
                  {`${getCategoryLabel(c.path)} (${c.count})`}
                </Link>
              ))}
            </nav>
          )}
          <nav aria-label={dict.categories} className="mt-4 flex flex-wrap gap-2 sm:hidden">
            {tree.map((node) =>
              node.kind === 'parent' ? (
                <Link
                  key={`parent:${node.parent}`}
                  href={localePath(locale, parentHref(node.parent))}
                  className={chipClass(node.parent === current.parent)}
                >
                  {getParentLabel(node.parent, locale)}
                </Link>
              ) : (
                <Link
                  key={node.path}
                  href={localePath(locale, categoryHref(node.path))}
                  className={chipClass(node.path === current.categoryPath)}
                >
                  {getCategoryLabel(node.path)}
                </Link>
              )
            )}
          </nav>
          {currentParentNode?.kind === 'parent' && (
            <nav aria-label={dict.categories} className="mt-2 flex flex-wrap gap-2 sm:hidden">
              {currentParentNode.children.map((c) => (
                <Link
                  key={c.path}
                  href={localePath(locale, categoryHref(c.path))}
                  className={chipClass(c.path === current.categoryPath)}
                >
                  {`${getCategoryLabel(c.path)} (${c.count})`}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm bg-white pt-5 shadow-md ring-1 ring-gray-200 sm:flex dark:bg-gray-950/60 dark:shadow-gray-800/40 dark:ring-gray-800">
            <div className="px-6 py-4">
              {isAllPosts ? (
                <h3 className="font-bold text-gray-950 uppercase dark:text-white">
                  {dict.allPosts}
                </h3>
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
                {tree.map((node) =>
                  node.kind === 'parent' ? (
                    <li
                      key={`parent:${node.parent}`}
                      className="my-3"
                      data-category-group={node.parent}
                    >
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => toggle(node.parent)}
                          aria-expanded={!collapsed.includes(node.parent)}
                          aria-controls={`category-children-${node.parent}`}
                          aria-label={dict.toggleCategory(getParentLabel(node.parent, locale))}
                          className="hover:text-primary-500 -ml-2 rounded p-1 text-gray-400 dark:text-gray-500"
                        >
                          <svg
                            data-category-chevron
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <SidebarLink
                          href={localePath(locale, parentHref(node.parent))}
                          label={getParentLabel(node.parent, locale)}
                          count={node.count}
                          active={node.parent === current.parent && !current.categoryPath}
                          ariaLabel={dict.viewCategoryPosts(getParentLabel(node.parent, locale))}
                          strong
                        />
                      </div>
                      <ul
                        id={`category-children-${node.parent}`}
                        data-category-children
                        className="mt-1 ml-3 border-l border-gray-200 dark:border-gray-700"
                      >
                        {node.children.map((c) => (
                          <li key={c.path} className="my-2">
                            <SidebarLink
                              href={localePath(locale, categoryHref(c.path))}
                              label={getCategoryLabel(c.path)}
                              count={c.count}
                              active={c.path === current.categoryPath}
                              ariaLabel={dict.viewCategoryPosts(getCategoryLabel(c.path))}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={node.path} className="my-3">
                      <SidebarLink
                        href={localePath(locale, categoryHref(node.path))}
                        label={getCategoryLabel(node.path)}
                        count={node.count}
                        active={node.path === current.categoryPath}
                        ariaLabel={dict.viewCategoryPosts(getCategoryLabel(node.path))}
                        strong
                      />
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, categoryPath, aiGenerated } = post
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
                            <Link
                              href={`/${path}`}
                              className="hover:text-primary-500 dark:hover:text-primary-400 inline-block origin-left text-gray-700 transition-transform duration-150 hover:scale-[1.03] dark:text-gray-300"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            <Category categoryPath={categoryPath} locale={locale} />
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {aiGenerated && (
                            <span className="mr-2 inline-block rounded border border-gray-300 px-1.5 py-0.5 align-middle text-xs font-medium text-gray-500 dark:border-gray-600 dark:text-gray-400">
                              {dict.aiGenerated}
                            </span>
                          )}
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
