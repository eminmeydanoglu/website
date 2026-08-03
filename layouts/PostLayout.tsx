'use client'

import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import PostNavFooter from '@/components/PostNavFooter'
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
  next?: { path: string; slug: string; title: string }
  prev?: { path: string; slug: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
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

        {/* Header — mono meta per DESIGN.md type roles */}
        <header className="mb-10 text-center">
          <time
            dateTime={date}
            className="text-ink/60 dark:text-ink-dark/60 font-mono text-xs tracking-widest lowercase"
          >
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
          <h1 className="font-display text-ink dark:text-ink-dark mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </header>

        {/* Content — readable measure: the typography plugin's 65ch default
            (60-75 chars per readable-measure skill), centered. */}
        <div className="prose prose-lg dark:prose-invert mx-auto">{children}</div>

        {/* Prev/next — hairline-separated editorial footer */}
        <PostNavFooter next={next} prev={prev} />
      </article>
    </>
  )
}
