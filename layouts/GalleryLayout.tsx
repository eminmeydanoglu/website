'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import GalleryGrid from '@/components/GalleryGrid'
import FilterBar from '@/components/FilterBar'
import type { Blog } from 'contentlayer/generated'
import { getPostTags } from '@/lib/post-tags'

interface GalleryLayoutProps {
  posts: Blog[]
  title: string
}

export default function GalleryLayout({ posts, title }: GalleryLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read initial state from URL
  const [selectedTags, setSelectedTags] = useState(() => {
    const tags = searchParams.get('tags')
    return tags ? tags.split(',').filter(Boolean) : []
  })
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>(
    (searchParams.get('sort') as 'date-desc' | 'date-asc' | 'title') || 'date-desc'
  )

  const availableTags = useMemo(() => {
    const tagMap = new Map<string, { value: string; label: string; count: number }>()

    posts.forEach((post) => {
      getPostTags(post).forEach((tag) => {
        const value = slug(tag)
        const existing = tagMap.get(value)

        if (existing) {
          existing.count += 1
        } else {
          tagMap.set(value, { value, label: tag, count: 1 })
        }
      })
    })

    return [...tagMap.values()].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.label.localeCompare(b.label, 'tr')
    })
  }, [posts])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    if (search) params.set('q', search)
    if (sortBy !== 'date-desc') params.set('sort', sortBy)

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [selectedTags, search, sortBy, pathname, router])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((post) =>
        getPostTags(post).some((tag) => selectedTags.includes(slug(tag)))
      )
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.summary?.toLowerCase().includes(searchLower) ||
          getPostTags(post).some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    // Sort
    switch (sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title, 'tr'))
        break
      case 'date-desc':
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    // Featured posts first (if sorting by date)
    if (sortBy.startsWith('date')) {
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
    }

    return result
  }, [posts, selectedTags, search, sortBy])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]
    )
  }

  const handleClear = () => {
    setSelectedTags([])
    setSearch('')
    setSortBy('date-desc')
  }

  return (
    <>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h1>
      </div>

      <div className="border-t border-gray-200 py-8 dark:border-gray-700">
        <FilterBar
          availableTags={availableTags}
          selectedTags={selectedTags}
          searchQuery={search}
          sortBy={sortBy}
          onTagToggle={handleTagToggle}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onClear={handleClear}
        />

        <GalleryGrid posts={filteredPosts} />

        {/* Results count */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {filteredPosts.length} yazı gösteriliyor
        </p>
      </div>
    </>
  )
}
