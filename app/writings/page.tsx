'use client'

import { Suspense } from 'react'
import { allBlogs } from 'contentlayer/generated'
import GalleryLayout from '@/layouts/GalleryLayout'
import { useTranslation } from '@/lib/LanguageContext'

function BlogContent() {
  const { t } = useTranslation()
  // Filter out drafts and sort by date
  const posts = allBlogs
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return <GalleryLayout posts={posts} title={t('page.blog')} />
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Yükleniyor...</div>}>
      <BlogContent />
    </Suspense>
  )
}
