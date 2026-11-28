import { parentKeys } from './categories'

/**
 * Collapsed parent categories in the sidebar, kept in localStorage across visits.
 *
 * The sidebar is server-rendered open. To avoid a flash of the open tree, a small script at the top of <body>
 * (collapseScript) copies the saved list onto <html data-collapsed-categories="dev hackathon"> before
 * the first paint, and collapseStyles hides those groups with CSS. React only keeps the attribute,
 * localStorage and aria-expanded in sync after that.
 */
export const COLLAPSE_STORAGE_KEY = 'sidebar-collapsed-categories'
export const COLLAPSE_ATTRIBUTE = 'data-collapsed-categories'

const isKey = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9-]+$/.test(value)

/** Runs before the first paint; keep it dependency-free */
export const collapseScript = `try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(
  COLLAPSE_STORAGE_KEY
)})||'[]');if(Array.isArray(v)){v=v.filter(function(k){return typeof k==='string'&&/^[a-z0-9-]+$/.test(k)});if(v.length)document.documentElement.setAttribute(${JSON.stringify(
  COLLAPSE_ATTRIBUTE
)},v.join(' '))}}catch(e){}`

/** One rule pair per parent: hide its children list and turn its chevron */
export const collapseStyles = parentKeys
  .map(
    (parent) =>
      `html[${COLLAPSE_ATTRIBUTE}~="${parent}"] [data-category-group="${parent}"] [data-category-children]{display:none}` +
      `html[${COLLAPSE_ATTRIBUTE}~="${parent}"] [data-category-group="${parent}"] [data-category-chevron]{transform:rotate(-90deg)}`
  )
  .join('')

/**
 * Collapsed parents as currently applied, read from the <html> attribute (set by collapseScript on load
 * and by writeCollapsed on toggle), so the React state matches what is hidden even when storage fails.
 */
export function readCollapsed(): string[] {
  const value = document.documentElement.getAttribute(COLLAPSE_ATTRIBUTE) ?? ''
  return value.split(' ').filter(isKey)
}

export function writeCollapsed(collapsed: string[]) {
  try {
    localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(collapsed))
  } catch {
    // Storage can be unavailable (private mode, quota); the attribute below still applies for this visit
  }
  if (collapsed.length) {
    document.documentElement.setAttribute(COLLAPSE_ATTRIBUTE, collapsed.join(' '))
  } else {
    document.documentElement.removeAttribute(COLLAPSE_ATTRIBUTE)
  }
}
