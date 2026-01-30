'use client'

import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import siteMetadata from '@/data/siteMetadata'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, children }: LayoutProps) {
  const { date, title, thumbnail } = content

  return (
    <>
      <ScrollTopAndComment />
      <article className="mx-auto max-w-4xl">
        {/* Cover Image - Notion style */}
        {thumbnail && (
          <div className="relative -mx-4 mb-8 h-64 overflow-hidden sm:-mx-6 sm:h-80 md:h-96 lg:-mx-8">
            <Image src={thumbnail} alt={title} fill className="object-cover" priority />
          </div>
        )}

        {/* Header */}
        <header className="mb-8 text-center">
          <time
            dateTime={date}
            className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400"
          >
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
            {title}
          </h1>
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">{children}</div>
      </article>
    </>
  )
}
