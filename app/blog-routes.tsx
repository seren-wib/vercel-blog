import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import ListLayout from '@/layouts/ListLayoutWithCategories'
import {
  categoryHref,
  categoryTree,
  getCategoryLabel,
  getParentLabel,
  parentHref,
  parentOf,
  sortByChapter,
} from '@/data/categories'
import { getDictionary, locales, type Locale } from '@/data/i18n'
import { genPageMetadata } from 'app/seo'

export const POSTS_PER_PAGE = 5

/** Published post counts per locale and category path, written by contentlayer.config.ts */
export const categoryCounts = categoryData as Record<string, Record<string, number>>

/**
 * What a URL under /<locale>/blog/ shows (see data/categories.ts for the URL shapes).
 * - post:     the segments are a post slug
 * - parent:   <parent>/ or <parent>/page/<n>/
 * - category: <parent>/<category>/ or <parent>/<category>/page/<n>/, or a category without a parent
 *             (only reached from /blog/category/<category>/)
 */
export type BlogList =
  | { kind: 'parent'; parent: string; page: number }
  | { kind: 'category'; categoryPath: string; page: number }
export type BlogRoute = { kind: 'post'; slug: string } | BlogList

export const findPost = (locale: Locale, slug: string) =>
  allBlogs.find((p) => p.locale === locale && p.slug === slug)

const parentCount = (locale: Locale, parent: string) =>
  Object.entries(categoryCounts[locale] ?? {})
    .filter(([path]) => parentOf(path) === parent)
    .reduce((sum, [, count]) => sum + count, 0)

const listCount = (locale: Locale, list: BlogList) =>
  list.kind === 'parent'
    ? parentCount(locale, list.parent)
    : (categoryCounts[locale]?.[list.categoryPath] ?? 0)

const totalPages = (count: number) => Math.ceil(count / POSTS_PER_PAGE)

/** Resolve the segments after /<locale>/blog/ (catch-all route). Posts win over list pages. */
export function resolveBlogRoute(locale: Locale, segments: string[]): BlogRoute | null {
  const slug = segments.join('/')
  if (findPost(locale, slug)) return { kind: 'post', slug }

  let listSegments = segments
  let page = 1
  if (segments.length >= 3 && segments[segments.length - 2] === 'page') {
    listSegments = segments.slice(0, -2)
    page = Number(segments[segments.length - 1])
    if (!Number.isInteger(page)) return null
  }
  let list: BlogList | null = null
  if (listSegments.length === 1) {
    list = { kind: 'parent', parent: listSegments[0], page }
  } else if (listSegments.length === 2) {
    list = { kind: 'category', categoryPath: listSegments.join('/'), page }
  }
  if (!list) return null
  const pages = totalPages(listCount(locale, list))
  return page >= 1 && page <= pages ? list : null
}

/** Every list page of the catch-all route (parent and category pages, with their /page/<n>) */
export function listStaticParams() {
  return locales.flatMap((locale) => {
    const counts = categoryCounts[locale] ?? {}
    const paths = Object.keys(counts).filter((path) => parentOf(path))
    const parents = [...new Set(paths.map(parentOf))]
    const lists: [string[], number][] = [
      ...parents.map((parent): [string[], number] => [[parent], parentCount(locale, parent)]),
      ...paths.map((path): [string[], number] => [path.split('/'), counts[path]]),
    ]
    return lists.flatMap(([segments, count]) => [
      { locale, slug: segments },
      ...Array.from({ length: totalPages(count) }, (_, i) => ({
        locale,
        slug: [...segments, 'page', String(i + 1)],
      })),
    ])
  })
}

const listPath = (list: BlogList) => {
  const base = list.kind === 'parent' ? parentHref(list.parent) : categoryHref(list.categoryPath)
  return list.page > 1 ? `${base}page/${list.page}/` : base
}

const listTitle = (locale: Locale, list: BlogList) =>
  list.kind === 'parent' ? getParentLabel(list.parent, locale) : getCategoryLabel(list.categoryPath)

export function listMetadata(locale: Locale, list: BlogList) {
  const label = listTitle(locale, list)
  return genPageMetadata({
    title: label,
    description: getDictionary(locale).categoryPosts(label),
    locale,
    path: listPath(list),
    availableLocales: locales.filter((l) => totalPages(listCount(l, list)) >= list.page),
  })
}

/**
 * Parent page: every post of its categories, newest first, with links to the categories.
 * Category page: its posts in chapter order.
 */
export function BlogListPage({ locale, list }: { locale: Locale; list: BlogList }) {
  const posts =
    list.kind === 'parent'
      ? allCoreContent(
          sortPosts(allBlogs.filter((p) => p.locale === locale && p.parent === list.parent))
        )
      : sortByChapter(
          allCoreContent(
            allBlogs.filter((p) => p.locale === locale && p.categoryPath === list.categoryPath)
          )
        )
  const parent = list.kind === 'parent' ? list.parent : parentOf(list.categoryPath)
  const parentNode = categoryTree(categoryCounts[locale] ?? {}).find(
    (node) => node.kind === 'parent' && node.parent === parent
  )
  const subcategories = parentNode?.kind === 'parent' ? parentNode.children : undefined

  return (
    <ListLayout
      locale={locale}
      posts={posts}
      initialDisplayPosts={posts.slice(
        POSTS_PER_PAGE * (list.page - 1),
        POSTS_PER_PAGE * list.page
      )}
      pagination={{ currentPage: list.page, totalPages: totalPages(posts.length) }}
      title={listTitle(locale, list)}
      current={{
        parent: parent || undefined,
        categoryPath: list.kind === 'category' ? list.categoryPath : undefined,
      }}
      subcategories={list.kind === 'parent' ? subcategories : undefined}
    />
  )
}
