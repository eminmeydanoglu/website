'use client'

import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { useTranslation } from '@/lib/LanguageContext'

const POSTS_PER_PAGE = 5

export default function BlogPage() {
  const { t } = useTranslation()
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={t('page.blog')}
    />
  )
}
