'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image' // Import Image component
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { useTranslation } from '@/lib/LanguageContext'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+$/, '') // Remove any trailing /page
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="border-ink/20 dark:border-ink-dark/20 border-t pt-6 pb-8">
      <nav className="flex justify-between font-mono text-xs tracking-widest uppercase">
        {!prevPage && (
          <button
            className="text-ink/40 dark:text-ink-dark/40 cursor-auto disabled:opacity-50"
            disabled={!prevPage}
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="text-ink hover:text-primary-500 dark:text-ink-dark dark:hover:text-primary-400"
          >
            Previous
          </Link>
        )}
        <span className="text-ink/50 dark:text-ink-dark/50">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="text-ink/40 dark:text-ink-dark/40 cursor-auto disabled:opacity-50"
            disabled={!nextPage}
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="text-ink hover:text-primary-500 dark:text-ink-dark dark:hover:text-primary-400"
          >
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="pt-2">
        <div className="pb-6">
          <h1 className="text-ink/70 dark:text-ink-dark/70 font-mono text-sm tracking-[0.25em] uppercase">
            {title}
          </h1>
        </div>
        <div className="border-ink/80 dark:border-ink-dark/30 flex border-t py-10 sm:space-x-24">
          <div className="border-ink/20 dark:border-ink-dark/20 hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-none border pt-5 sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/writings') ? (
                <h3 className="text-primary-500 font-mono text-[11px] font-bold tracking-widest uppercase">
                  By tags
                </h3>
              ) : (
                <Link
                  href={`/writings`}
                  className="text-ink/60 hover:text-primary-500 dark:text-ink-dark/60 dark:hover:text-primary-400 font-mono text-[11px] font-bold tracking-widest uppercase"
                >
                  By tags
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="text-primary-500 inline px-3 py-2 font-mono text-xs font-bold tracking-wide">
                          {`${t.toLowerCase()} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="text-ink/60 hover:text-primary-500 dark:text-ink-dark/60 dark:hover:text-primary-400 px-3 py-2 font-mono text-xs tracking-wide"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t.toLowerCase()} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <ul className="divide-ink/20 dark:divide-ink-dark/20 divide-y">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, thumbnail } = post // Destructure thumbnail
                return (
                  <li key={path} className="py-6 first:pt-0">
                    {/* Use flexbox for layout */}
                    <article className="flex flex-col space-y-2 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-6">
                      {' '}
                      {/* Added xl:items-center */}
                      {/* Conditionally render thumbnail */}
                      {thumbnail && (
                        <div className="flex-shrink-0 xl:w-40">
                          <Link href={`/${path}`} aria-label={`Link to ${title}`}>
                            <Image
                              src={thumbnail}
                              alt="" // Alt text can be improved if descriptions are available
                              width={160} // Example width
                              height={90} // Example height based on 16:9 aspect ratio
                              className="border-ink/20 dark:border-ink-dark/20 rounded-none border object-cover"
                            />
                          </Link>
                        </div>
                      )}
                      <div className="flex-grow space-y-3">
                        {' '}
                        {/* Wrap text content */}
                        {/* Reordered Elements Start */}
                        <h2 className="font-display text-2xl leading-tight font-bold">
                          <Link
                            href={`/${path}`}
                            className="text-ink dark:text-ink-dark hover:underline"
                          >
                            {title}
                          </Link>
                        </h2>
                        {''}
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-ink/50 dark:text-ink-dark/50 font-mono text-[11px] tracking-widest lowercase">
                            <time dateTime={date} suppressHydrationWarning>
                              {formatDate(date, siteMetadata.locale)}
                            </time>
                          </dd>
                        </dl>
                        <div className="text-ink/70 dark:text-ink-dark/70 font-serif text-[15px] leading-relaxed">
                          {summary}
                        </div>
                        <div className="flex flex-wrap">
                          {tags?.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                        {''}
                        {/* Reordered Elements End */}
                      </div>{' '}
                      {/* Close flex-grow div */}
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
