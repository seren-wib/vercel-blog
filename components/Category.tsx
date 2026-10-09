import Link from 'next/link'
import { getCategoryLabel } from '@/data/categories'

interface Props {
  category: string
}

const Category = ({ category }: Props) => {
  if (!category) return null
  return (
    <Link
      href={`/blog/category/${category}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {getCategoryLabel(category)}
    </Link>
  )
}

export default Category
