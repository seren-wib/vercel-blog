import projectsData, { type Project } from '@/data/projectsData'
import ProjectCard, { ProjectBrief } from '@/components/ProjectCard'
import { genPageMetadata } from 'app/seo'
import { getDictionary, type Locale, asLocale, locales } from '@/data/i18n'

export const generateStaticParams = () => locales.map((locale) => ({ locale }))

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  return genPageMetadata({ title: getDictionary(locale).nav.projects, locale, path: '/projects/' })
}

function Section({
  title,
  projects,
  locale,
}: {
  title: string
  projects: Project[]
  locale: Locale
}) {
  const cards = projects.filter((p) => p.size !== 'brief')
  const briefs = projects.filter((p) => p.size === 'brief')
  return (
    <section className="py-10">
      <h2 className="mb-6 text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="space-y-6">
        {cards.map((project) => (
          <ProjectCard key={project.title} project={project} locale={locale} />
        ))}
      </div>
      {briefs.length > 0 && (
        <ul className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
          {briefs.map((project) => (
            <ProjectBrief key={project.title} project={project} locale={locale} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default async function Projects(props: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await props.params).locale)
  const dict = getDictionary(locale)
  // Featured first, then the order in projectsData
  const bySize = (a: Project, b: Project) =>
    Number(b.size === 'featured') - Number(a.size === 'featured')
  const building = projectsData.filter((p) => p.status === 'building').sort(bySize)
  const shipped = projectsData.filter((p) => p.status === 'shipped').sort(bySize)
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {dict.nav.projects}
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{dict.projectsIntro}</p>
      </div>
      <Section title={dict.building} projects={building} locale={locale} />
      <Section title={dict.shipped} projects={shipped} locale={locale} />
    </div>
  )
}
