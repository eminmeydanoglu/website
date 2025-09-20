'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LanguageSwitch from './LanguageSwitch'
import { useTranslation } from '@/lib/LanguageContext'
import { TranslationKey } from '@/lib/i18n'

const Header = () => {
  const { t } = useTranslation()

  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="hidden items-center divide-x divide-gray-300 sm:flex dark:divide-gray-600">
          {headerNavLinks
            .filter((link) => link.title !== 'Home')
            .map((link) => {
              // Map original titles to translation keys
              const getTranslationKey = (title: string) => {
                switch (title) {
                  case 'check my mind':
                    return 'nav.check-my-mind'
                  case 'writings':
                    return 'nav.writings'
                  case 'projects':
                    return 'nav.projects'
                  case 'cv':
                    return 'nav.cv'
                  default:
                    return title
                }
              }

              const translationKey = getTranslationKey(link.title)
              const displayTitle = translationKey.startsWith('nav.')
                ? t(translationKey as TranslationKey)
                : link.title

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="hover:text-primary-500 dark:hover:text-primary-400 px-4 py-2 text-center font-medium text-gray-900 dark:text-gray-100"
                >
                  {displayTitle}
                </Link>
              )
            })}
        </div>
        <SearchButton />
        <LanguageSwitch />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
