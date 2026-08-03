'use client'

import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import Link from '@/components/Link'
import { coreContent } from 'pliny/utils/contentlayer'
import { useLanguage } from '@/lib/LanguageContext'

export default function AboutPage() {
  const { language } = useLanguage()

  // Load language-specific author profile
  const authorSlug = `default.${language}`
  let author = allAuthors.find((p) => p.slug === authorSlug) as Authors

  // Fallback to default if language-specific version doesn't exist
  if (!author) {
    author = allAuthors.find((p) => p.slug === 'default') as Authors
  }

  const mainContent = coreContent(author)

  return (
    <div className="pt-2">
      <div className="pb-6">
        <h1 className="text-ink/70 dark:text-ink-dark/70 font-mono text-sm tracking-[0.25em] uppercase">
          {language === 'en' ? 'About' : 'Hakkımda'}
        </h1>
      </div>
      <div className="border-ink/80 dark:border-ink-dark/30 border-t pt-10">
        <AuthorLayout content={mainContent}>
          <MDXLayoutRenderer code={author.body.code} />
        </AuthorLayout>
        <div className="mt-10">
          <Link
            href="/cv"
            className="border-ink hover:bg-ink hover:text-paper dark:border-ink-dark dark:hover:bg-ink-dark dark:hover:text-paper-dark inline-block border px-5 py-2 font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {language === 'en' ? 'View CV →' : "CV'yi görüntüle →"}
          </Link>
        </div>
      </div>
    </div>
  )
}
