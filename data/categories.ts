/**
 * Blog categories. The key is the folder name under data/blog (and the URL segment),
 * the value is the label shown on the site. Order here is the order in the sidebar.
 * A folder that is missing here still works and is shown by its folder name.
 */
const categories: Record<string, string> = {
  'computer-systems': 'Computer Systems',
  'software-engineering': 'Software Engineering',
  'cloud-computing': 'Cloud Computing',
  network: 'Network',
  os: 'OS',
  ai: 'AI',
  unity: 'Unity',
  git: 'Git',
  sql: 'SQL',
}

export function getCategoryLabel(category: string) {
  return categories[category] ?? category
}

export function sortCategories(keys: string[]) {
  const order = Object.keys(categories)
  const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length)
  return [...keys].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
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

export default categories
