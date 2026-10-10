import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import { localePath, type Locale } from '@/data/i18n'

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer>
      <div className="mt-16 mb-8 flex flex-col items-center">
        <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href={localePath(locale)}>{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
