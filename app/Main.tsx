'use client'

import { Suspense } from 'react'
import { Authors, allAuthors, allBlogs } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import GalleryLayout from '@/layouts/GalleryLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { useLanguage } from '@/lib/LanguageContext'

export default function Home({ posts }) {
  const { language, t } = useLanguage()

  // Load language-specific author profile
  const authorSlug = `default.${language}`
  let author = allAuthors.find((p) => p.slug === authorSlug) as Authors

  // Fallback to default if language-specific version doesn't exist
  if (!author) {
    author = allAuthors.find((p) => p.slug === 'default') as Authors
  }

  const mainContent = coreContent(author)

  // Filter out drafts for gallery
  const filteredPosts = posts.filter((post) => !post.draft)

  return (
    <>
      {/* Author Section */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <AuthorLayout content={mainContent}>
            <MDXLayoutRenderer code={author.body.code} />
          </AuthorLayout>
        </div>
      </div>

      {/* Writings Gallery */}
      <Suspense fallback={<div className="py-8 text-center text-gray-500">Yükleniyor...</div>}>
        <GalleryLayout posts={filteredPosts} title={language === 'en' ? 'Writings' : 'Yazılar'} />
      </Suspense>
    </>
  )
}
