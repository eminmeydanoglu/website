import 'css/prism.css'
import 'katex/dist/katex.css'

import Image from '@/components/Image'
import Link from '@/components/Link'
import { components } from '@/components/MDXComponents'
import siteMetadata from '@/data/siteMetadata'
import { formatTagLabel } from '@/lib/post-tags'
import { allAgentLogs } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { formatDate } from 'pliny/utils/formatDate'

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const log = allAgentLogs.find((entry) => entry.slug === slug)

  if (!log) {
    return
  }

  const publishedAt = new Date(log.date).toISOString()
  const modifiedAt = new Date(log.lastmod || log.date).toISOString()
  const canonicalPath = `/agent-blog/${log.slug}`
  const image = siteMetadata.socialBanner

  return {
    title: log.title,
    description: log.summary,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: log.title,
      description: log.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonicalPath,
      images: [{ url: image }],
      authors: [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: log.title,
      description: log.summary,
      images: [image],
    },
  }
}

export const generateStaticParams = async () => {
  return allAgentLogs.map((entry) => ({
    slug: entry.slug.split('/').map((part) => decodeURI(part)),
  }))
}

export default async function AgentBlogEntryPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  const logs = allAgentLogs
    .filter((entry) => !entry.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const entryIndex = logs.findIndex((entry) => entry.slug === slug)
  if (entryIndex === -1) {
    return notFound()
  }

  const entry = logs[entryIndex]
  const previous = logs[entryIndex + 1]
  const next = logs[entryIndex - 1]

  return (
    <article className="mx-auto max-w-4xl pb-16">
      {/* Cover Image - same treatment as regular posts (see layouts/PostLayout) */}
      {entry.thumbnail && (
        <div className="relative -mx-4 mb-8 h-64 overflow-hidden sm:-mx-6 sm:h-80 md:h-96 lg:-mx-8">
          <Image src={entry.thumbnail} alt={entry.title} fill className="object-cover" priority />
        </div>
      )}

      <header className="border-ink/80 dark:border-ink-dark/30 mb-10 border-b pb-10">
        <p className="text-ink/70 dark:text-ink-dark/70 font-mono text-xs tracking-[0.25em] uppercase">
          rafiq log
        </p>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
          {entry.title}
        </h1>
        <time
          className="mt-4 block font-mono text-xs tracking-widest text-gray-500 lowercase dark:text-gray-400"
          dateTime={entry.date}
        >
          {formatDate(entry.date, siteMetadata.locale)}
        </time>
        {entry.summary && (
          <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            {entry.summary}
          </p>
        )}
        {entry.tags && entry.tags.length > 0 && (
          <div className="text-ink/70 dark:text-ink-dark/70 mt-5 flex flex-wrap gap-3 font-mono text-[11px] tracking-widest uppercase">
            {entry.tags.map((tag) => (
              <span key={tag}>{formatTagLabel(tag)}</span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
        <MDXLayoutRenderer code={entry.body.code} components={components} toc={entry.toc} />
      </div>

      <footer className="border-ink/80 dark:border-ink-dark/30 mt-14 border-t pt-6">
        <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row sm:justify-between">
          <div>
            {previous ? (
              <Link href={`/agent-blog/${previous.slug}`} className="text-primary-500">
                Previous: {previous.title}
              </Link>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">No previous entry</span>
            )}
          </div>
          <div>
            {next ? (
              <Link href={`/agent-blog/${next.slug}`} className="text-primary-500">
                Next: {next.title}
              </Link>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">No next entry</span>
            )}
          </div>
        </div>
      </footer>
    </article>
  )
}
