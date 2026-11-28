import type { Locale } from './i18n'
import tree from './categoryTree'

/**
 * Blog categories. A category is named by its path under data/blog/<locale>/:
 * '<parent>/<category>' (e.g. 'dev/git') or just '<category>' for one without a parent yet (e.g. 'hardware').
 * Labels and sidebar order come from data/categoryTree.js.
 *
 * URLs (after the locale prefix):
 * - parent page:   /blog/<parent>/
 * - category page: /blog/<parent>/<category>/, or /blog/category/<category>/ without a parent
 * - post:          /blog/<category path>/<file>/
 */
const { parents, topLevel, labels } = tree as {
  parents: Record<string, { label: Record<Locale, string>; children: string[] }>
  topLevel: string[]
  labels: Record<string, string>
}

export const parentKeys = Object.keys(parents)

/** 'dev/git' -> 'dev', 'hardware' -> '' */
export function parentOf(categoryPath: string) {
  const parts = categoryPath.split('/')
  return parts.length > 1 ? parts[0] : ''
}

/** Display name of a category path: 'dev/git' -> 'Git' */
export function getCategoryLabel(categoryPath: string) {
  const name = categoryPath.split('/').pop() ?? categoryPath
  return labels[name] ?? name
}

export function getParentLabel(parent: string, locale: Locale) {
  return parents[parent]?.label[locale] ?? parent
}

/** Site path of a category page, without the locale prefix */
export function categoryHref(categoryPath: string) {
  return parentOf(categoryPath) ? `/blog/${categoryPath}/` : `/blog/category/${categoryPath}/`
}

/** Site path of a parent page, without the locale prefix */
export function parentHref(parent: string) {
  return `/blog/${parent}/`
}

function rank(categoryPath: string) {
  const parent = parentOf(categoryPath)
  const name = categoryPath.split('/').pop() ?? categoryPath
  if (parent) {
    const p = parentKeys.indexOf(parent)
    const children = parents[parent]?.children ?? []
    const c = children.indexOf(name)
    return [p === -1 ? parentKeys.length : p, c === -1 ? children.length : c]
  }
  const t = topLevel.indexOf(name)
  return [parentKeys.length + 1, t === -1 ? topLevel.length : t]
}

/** Sidebar order: parents in tree order with their children, then categories without a parent */
export function sortCategories(keys: string[]) {
  return [...keys].sort((a, b) => {
    const [pa, ca] = rank(a)
    const [pb, cb] = rank(b)
    return pa - pb || ca - cb || a.localeCompare(b)
  })
}

/** Every category declared in data/categoryTree.js, as '<parent>/<category>' */
export const declaredCategories = Object.entries(parents).flatMap(([parent, { children }]) =>
  children.map((child) => `${parent}/${child}`)
)

/** Post counts with every declared category added at 0, so empty categories still get a page */
export function withDeclared(counts: Record<string, number>) {
  return { ...Object.fromEntries(declaredCategories.map((path) => [path, 0])), ...counts }
}

export type CategoryNode =
  | { kind: 'parent'; parent: string; count: number; children: { path: string; count: number }[] }
  | { kind: 'category'; path: string; count: number }

/** Sidebar tree from per-category post counts ({ 'dev/git': 2, hardware: 1 }) */
export function categoryTree(counts: Record<string, number>): CategoryNode[] {
  const nodes: CategoryNode[] = []
  for (const path of sortCategories(Object.keys(counts))) {
    const parent = parentOf(path)
    if (!parent) {
      nodes.push({ kind: 'category', path, count: counts[path] })
      continue
    }
    let node = nodes.find((n) => n.kind === 'parent' && n.parent === parent)
    if (!node) {
      node = { kind: 'parent', parent, count: 0, children: [] }
      nodes.push(node)
    }
    if (node.kind === 'parent') {
      node.children.push({ path, count: counts[path] })
      node.count += counts[path]
    }
  }
  return nodes
}

// Split a file name into text and number chunks: "ch10-mem" -> ["ch", 10, "-mem"]
function chunks(name: string) {
  return name.match(/\d+|\D+/g)?.map((c) => (/^\d+$/.test(c) ? Number(c) : c)) ?? []
}

function compareNatural(a: string, b: string) {
  const ca = chunks(a)
  const cb = chunks(b)
  for (let i = 0; i < Math.min(ca.length, cb.length); i++) {
    const x = ca[i]
    const y = cb[i]
    if (x === y) continue
    if (typeof x === 'number' && typeof y === 'number') return x - y
    if (typeof x === 'number') return -1
    if (typeof y === 'number') return 1
    return x < y ? -1 : 1
  }
  return ca.length - cb.length
}

/**
 * Chapter order inside a category, taken from the file name
 * (ch3 < ch4 < ch4a < ch10, 05-03 < 05-04 < 06-01, numbered files before unnumbered ones).
 */
export function sortByChapter<T extends { slug: string }>(posts: T[]) {
  const fileName = (post: T) => post.slug.split('/').pop() ?? post.slug
  return [...posts].sort((a, b) => compareNatural(fileName(a), fileName(b)))
}
