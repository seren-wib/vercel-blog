import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import { getDictionary, type Locale, asLocale, locales } from '@/data/i18n'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  return genPageMetadata({ title: getDictionary(locale).nav.projects, locale, path: '/projects/' })
}

export default async function Projects(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {dict.nav.projects}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{dict.projectsIntro}</p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
