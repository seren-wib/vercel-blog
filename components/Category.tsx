import Link from 'next/link'
import {
  categoryHref,
  getCategoryLabel,
  getParentLabel,
  parentHref,
  parentOf,
} from '@/data/categories'
import { localePath, type Locale } from '@/data/i18n'

interface Props {
  /** '<parent>/<category>' or '<category>' */
  categoryPath: string
  locale: Locale
}

const linkClass =
  'hover:text-primary-500 dark:hover:text-primary-400 text-sm font-medium text-gray-500 uppercase dark:text-gray-400'

/** "Parent / Category" links, or just the category when it has no parent */
const Category = ({ categoryPath, locale }: Props) => {
  if (!categoryPath) return null
  const parent = parentOf(categoryPath)
  return (
    <span className="mr-3">
      {parent && (
        <>
          <Link href={localePath(locale, parentHref(parent))} className={linkClass}>
            {getParentLabel(parent, locale)}
          </Link>
          <span aria-hidden="true" className="mx-1.5 text-sm text-gray-400 dark:text-gray-500">
            /
          </span>
        </>
      )}
      <Link href={localePath(locale, categoryHref(categoryPath))} className={linkClass}>
        {getCategoryLabel(categoryPath)}
      </Link>
    </span>
  )
}

export default Category
