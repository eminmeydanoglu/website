import 'css/prism.css'
import 'katex/dist/katex.css'

import Link from '@/components/Link'
import { components } from '@/components/MDXComponents'
import siteMetadata from '@/data/siteMetadata'
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
      <header className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase dark:text-emerald-300">
          rafiq log
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {entry.title}
        </h1>
        <time className="mt-4 block text-sm text-gray-500 dark:text-gray-400" dateTime={entry.date}>
          {formatDate(entry.date, siteMetadata.locale)}
        </time>
        {entry.summary && (
          <p className="mt-4 text-base text-gray-600 dark:text-gray-300">{entry.summary}</p>
        )}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
        <MDXLayoutRenderer code={entry.body.code} components={components} toc={entry.toc} />
      </div>

      <footer className="mt-14 border-t border-gray-200 pt-6 dark:border-gray-700">
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
