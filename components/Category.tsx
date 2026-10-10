import Link from 'next/link'
import { getCategoryLabel } from '@/data/categories'
import { localePath, type Locale } from '@/data/i18n'

interface Props {
  category: string
  locale: Locale
}

const Category = ({ category, locale }: Props) => {
  if (!category) return null
  return (
    <Link
      href={localePath(locale, `/blog/category/${category}`)}
      className="hover:text-primary-500 dark:hover:text-primary-400 mr-3 text-sm font-medium text-gray-500 uppercase dark:text-gray-400"
    >
      {getCategoryLabel(category)}
    </Link>
  )
}

export default Category
