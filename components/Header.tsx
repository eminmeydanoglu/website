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

  let headerClass = 'flex items-center w-full bg-paper dark:bg-paper-dark justify-between py-6'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="font-display hidden h-6 text-2xl font-semibold sm:block">
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
                  case 'agent blog':
                    return 'nav.agent-blog'
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
              const isAgentBlog = link.title === 'agent blog'

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`px-4 py-2 text-center font-mono text-sm text-gray-900 dark:text-gray-100 ${
                    isAgentBlog
                      ? 'rafiq-nav-link'
                      : 'hover:text-primary-500 dark:hover:text-primary-400'
                  }`}
                >
                  {displayTitle}
                </Link>
              )
            })}
        </div>
        <SearchButton />
        <LanguageSwitch />
        <ThemeSwitch />
        <Link href="/about" aria-label="Hakkımda / CV" title="Hakkımda / CV">
          <img
            src="/static/images/avatar.png"
            alt="Emin Meydanoğlu"
            className="ring-ink/30 dark:ring-ink-dark/30 h-9 w-9 rounded-full object-cover ring-1 transition-transform hover:scale-105"
          />
        </Link>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
