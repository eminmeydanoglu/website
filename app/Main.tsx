'use client'

import { Suspense } from 'react'
import GalleryLayout from '@/layouts/GalleryLayout'
export default function Home({ posts }) {
  // Filter out drafts for gallery
  const filteredPosts = posts.filter((post) => !post.draft)

  return (
    <>
      {/* Writings greet the visitor — About/CV lives behind the avatar (top-right) */}
      <Suspense fallback={<div className="py-8 text-center text-gray-500">Yükleniyor...</div>}>
        <GalleryLayout posts={filteredPosts} />
      </Suspense>
    </>
  )
}
