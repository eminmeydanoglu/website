'use client'

import Link from '@/components/Link'
import { useTranslation } from '@/lib/LanguageContext'

interface PostNavLink {
  path: string
  slug: string
  title: string
}

interface PostNavFooterProps {
  next?: PostNavLink
  prev?: PostNavLink
}

/**
 * Editorial prev/next footer: hairline-separated two-column nav with mono
 * eyebrow labels and Playfair serif titles (see design-drafts/DESIGN.md).
 * Links go straight to /writings/<slug> — the /blog/* redirect does not
 * exist in the static export.
 */
export default function PostNavFooter({ next, prev }: PostNavFooterProps) {
  const { t } = useTranslation()
  if (!prev?.path && !next?.path) return null

  const labelClass =
    'block font-mono text-[11px] tracking-widest uppercase text-ink/50 transition-colors duration-150 group-hover:text-primary-600 dark:text-ink-dark/50 dark:group-hover:text-primary-400'
  const titleClass =
    'mt-2 block font-display text-lg leading-snug font-bold text-ink decoration-1 underline-offset-4 group-hover:underline dark:text-ink-dark'

  return (
    <footer className="border-ink/20 dark:border-ink-dark/20 mx-auto mt-16 max-w-[65ch] border-t pt-8">
      <nav className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        {prev?.path ? (
          <Link
            href={`/writings/${prev.slug}`}
            className="group max-w-xs transition-colors duration-150"
            aria-label={`Previous post: ${prev.title}`}
          >
            <span className={labelClass}>&larr; {t('post.previous')}</span>
            <span className={titleClass}>{prev.title}</span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
        {next?.path && (
          <Link
            href={`/writings/${next.slug}`}
            className="group max-w-xs transition-colors duration-150 sm:ml-auto sm:text-right"
            aria-label={`Next post: ${next.title}`}
          >
            <span className={labelClass}>{t('post.next')} &rarr;</span>
            <span className={titleClass}>{next.title}</span>
          </Link>
        )}
      </nav>
    </footer>
  )
}
