import EditorialCard from './EditorialCard'
import type { Blog } from 'contentlayer/generated'
import { getPostTags } from '@/lib/post-tags'
import { getPostTint } from '@/lib/post-tints'

interface GalleryGridProps {
  posts: Blog[]
}

/**
 * Aligned editorial grid: 3 columns on desktop (2 on tablet, 1 on mobile)
 * with dense flow. Every 5th card spans two columns, but there is no
 * vertical stagger — grid items stretch so every card in a row shares the
 * same top edge and the layout reads as a clean grid.
 */
const GalleryGrid = ({ posts }: GalleryGridProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="mb-4 text-6xl">📭</span>
        <h3 className="font-display text-ink dark:text-ink-dark mb-2 text-xl font-semibold">
          Yazı bulunamadı
        </h3>
        <p className="font-serif text-gray-600 dark:text-gray-400">
          Filtreleri temizleyip tekrar deneyin.
        </p>
      </div>
    )
  }

  return (
    <div className="grid [grid-auto-flow:dense] grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <div key={post.slug} className={i % 5 === 3 ? 'sm:col-span-2' : ''}>
          <EditorialCard
            title={post.title}
            slug={post.slug}
            summary={post.summary}
            thumbnail={post.thumbnail}
            date={post.date}
            tags={getPostTags(post)}
            tint={getPostTint(post.slug)}
            large={i % 5 === 3}
          />
        </div>
      ))}
    </div>
  )
}

export default GalleryGrid
