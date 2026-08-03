'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

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

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="pt-2">
        <div className="pb-6">
          <h1 className="text-ink/70 dark:text-ink-dark/70 font-mono text-sm tracking-[0.25em] uppercase">
            {title}
          </h1>
        </div>
        <div className="border-ink/80 dark:border-ink-dark/30 border-t py-10">
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="border-ink/40 text-ink focus:border-primary-500 focus:ring-primary-500 dark:border-ink-dark/40 dark:text-ink-dark block w-full rounded-none border bg-transparent px-4 py-2.5 pr-10 font-mono text-xs tracking-wide placeholder-gray-500 focus:ring-1 dark:placeholder-gray-400"
              />
            </label>
            <svg
              className="text-ink/50 dark:text-ink-dark/50 absolute top-3 right-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <ul className="divide-ink/20 dark:divide-ink-dark/20 mt-6 divide-y">
            {!filteredBlogPosts.length && (
              <p className="text-ink/50 dark:text-ink-dark/50 font-mono text-xs tracking-widest uppercase">
                No posts found.
              </p>
            )}
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path} className="py-6">
                  <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-ink/50 dark:text-ink-dark/50 font-mono text-[11px] tracking-widest lowercase">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-3 xl:col-span-3">
                      <div>
                        <h3 className="font-display text-2xl leading-tight font-bold">
                          <Link
                            href={`/${path}`}
                            className="text-ink dark:text-ink-dark hover:underline"
                          >
                            {title}
                          </Link>
                        </h3>
                        <div className="mt-2 flex flex-wrap">
                          {tags?.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <div className="text-ink/70 dark:text-ink-dark/70 font-serif text-[15px] leading-relaxed">
                        {summary}
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
