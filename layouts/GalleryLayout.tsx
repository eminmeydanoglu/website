'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import GalleryGrid from '@/components/GalleryGrid'
import FilterBar from '@/components/FilterBar'
import type { Blog } from 'contentlayer/generated'

interface GalleryLayoutProps {
  posts: Blog[]
  title: string
}

export default function GalleryLayout({ posts, title }: GalleryLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read initial state from URL
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>(
    (searchParams.get('sort') as 'date-desc' | 'date-asc' | 'title') || 'date-desc'
  )

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('q', search)
    if (sortBy !== 'date-desc') params.set('sort', sortBy)

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [category, search, sortBy, pathname, router])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // Filter by category
    if (category) {
      result = result.filter((post) => post.category === category)
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.summary?.toLowerCase().includes(searchLower)
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
  }, [posts, category, search, sortBy])

  const handleClear = () => {
    setCategory('')
    setSearch('')
    setSortBy('date-desc')
  }

  return (
    <>
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {title}
        </h1>
      </div>

      <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="border-t border-gray-200 py-8 dark:border-gray-700">
            <FilterBar
              selectedCategory={category}
              searchQuery={search}
              sortBy={sortBy}
              onCategoryChange={setCategory}
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
        </div>
      </div>
    </>
  )
}
