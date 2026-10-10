import type { Dictionary } from './i18n'

/** Header links. `href` is the path after the locale prefix; `key` picks the label from the dictionary. */
const headerNavLinks: { href: string; key: keyof Dictionary['nav'] }[] = [
  { href: '/', key: 'blog' },
  { href: '/projects', key: 'projects' },
  { href: '/about', key: 'about' },
]

export default headerNavLinks
