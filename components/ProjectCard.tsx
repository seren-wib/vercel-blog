import { Fragment } from 'react'
import Link from './Link'
import type { Project } from '@/data/projectsData'
import { getDictionary, type Locale } from '@/data/i18n'

/** Renders `code` and **bold** spans in a project text; everything else stays plain. */
function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`'))
          return (
            <code
              key={i}
              className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              {part.slice(1, -1)}
            </code>
          )
        if (part.startsWith('**') && part.endsWith('**'))
          return (
            <strong key={i} className="font-semibold text-gray-900 dark:text-gray-100">
              {part.slice(2, -2)}
            </strong>
          )
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

function Title({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale)
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h3 className="text-xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {project.href ? (
          <Link href={project.href} className="hover:text-primary-500 dark:hover:text-primary-400">
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h3>
      {project.private && (
        <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
          {dict.privateRepo}
        </span>
      )}
      <span className="text-sm text-gray-500 dark:text-gray-400">{project.period[locale]}</span>
    </div>
  )
}

/** One-line entry for small side projects. */
export function ProjectBrief({ project, locale }: { project: Project; locale: Locale }) {
  return (
    <li className="py-3">
      <Title project={project} locale={locale} />
      <p className="mt-1 text-gray-600 dark:text-gray-300">{project.summary[locale]}</p>
    </li>
  )
}

export default function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale)
  const featured = project.size === 'featured'
  return (
    <article
      className={`rounded-md border p-6 ${
        featured
          ? 'border-gray-900 bg-gray-50 shadow-md dark:border-gray-100 dark:bg-gray-900/70 dark:shadow-gray-800/40'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {featured && (
        <div className="mb-2 text-xs font-bold tracking-wide text-gray-900 uppercase dark:text-gray-100">
          {dict.featuredProject}
        </div>
      )}
      <Title project={project} locale={locale} />
      {project.role && (
        <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
          {project.role[locale]}
        </p>
      )}
      <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">{project.summary[locale]}</p>
      {project.highlights && (
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[0.95rem] leading-7 text-gray-700 marker:text-gray-400 dark:text-gray-300">
          {project.highlights[locale].map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      )}
      {project.stack && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={dict.techStack}>
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
