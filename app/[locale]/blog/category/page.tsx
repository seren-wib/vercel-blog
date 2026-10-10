import Link from '@/components/Link'
import Category from '@/components/Category'
import categoryData from 'app/category-data.json'
import { getCategoryLabel, sortCategories } from '@/data/categories'
import { getDictionary, localePath, type Locale, asLocale, locales } from '@/data/i18n'
import { genPageMetadata } from 'app/seo'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  return genPageMetadata({
    title: getDictionary(locale).categories,
    locale,
    path: '/blog/category/',
  })
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  const categoryCounts = (categoryData as Record<string, Record<string, number>>)[locale] ?? {}
  const categoryKeys = sortCategories(Object.keys(categoryCounts))
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            {dict.categories}
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {categoryKeys.length === 0 && dict.noCategories}
          {categoryKeys.map((c) => {
            return (
              <div key={c} className="mt-2 mr-5 mb-2">
                <Category category={c} locale={locale} />
                <Link
                  href={localePath(locale, `/blog/category/${c}`)}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={dict.viewCategoryPosts(getCategoryLabel(c))}
                >
                  {` (${categoryCounts[c]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
