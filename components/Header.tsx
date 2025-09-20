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
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.title !== 'Home')
            .map((link, index) => {
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
                <div key={link.title} className="flex items-center">
                  <Link
                    href={link.href}
                    className="hover:text-primary-500 dark:hover:text-primary-400 m-1 text-center font-medium text-gray-900 dark:text-gray-100"
                  >
                    {displayTitle}
                  </Link>
                  {index < headerNavLinks.filter((link) => link.title !== 'Home').length - 1 && (
                    <div className="mx-2 h-6 border-l border-gray-300 dark:border-gray-600"></div>
                  )}
                </div>
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
