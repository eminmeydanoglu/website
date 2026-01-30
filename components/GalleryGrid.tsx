import PostCard from './PostCard'
import type { Blog } from 'contentlayer/generated'

interface GalleryGridProps {
  posts: Blog[]
}

const GalleryGrid = ({ posts }: GalleryGridProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="mb-4 text-6xl">📭</span>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Yazı bulunamadı
        </h3>
        <p className="text-gray-600 dark:text-gray-400">Filtreleri temizleyip tekrar deneyin.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          title={post.title}
          slug={post.slug}
          summary={post.summary}
          thumbnail={post.thumbnail}
          category={post.category}
          icon={post.icon}
          date={post.date}
          tags={post.tags}
        />
      ))}
    </div>
  )
}

export default GalleryGrid
