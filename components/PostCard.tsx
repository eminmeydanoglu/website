import Image from './Image'
import Link from './Link'
import { getCategoryById } from '@/data/categories'

interface PostCardProps {
  title: string
  slug: string
  summary?: string
  thumbnail?: string
  category?: string
  icon?: string
  date: string
  tags?: string[]
}

const CategoryBadge = ({ categoryId }: { categoryId: string }) => {
  const category = getCategoryById(categoryId)
  if (!category) return null

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[category.color] || colorClasses.gray}`}
    >
      {category.label}
    </span>
  )
}

const PostCard = ({ title, slug, summary, thumbnail, category, icon, date }: PostCardProps) => {
  const href = `/blog/${slug}`
  const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/50">
      {/* Thumbnail */}
      <Link
        href={href}
        aria-label={`Read ${title}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        {thumbnail ? (
          <Image
            alt={title}
            src={thumbnail}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fill
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <span className="text-4xl">{icon || '📝'}</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title with icon */}
        <h2 className="mb-2 text-lg leading-tight font-bold tracking-tight text-gray-900 dark:text-gray-100">
          <Link href={href} className="hover:text-primary-500 dark:hover:text-primary-400">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </Link>
        </h2>

        {/* Category badge */}
        {category && (
          <div className="mb-2">
            <CategoryBadge categoryId={category} />
          </div>
        )}

        {/* Summary */}
        {summary && (
          <p className="mb-3 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        )}

        {/* Date */}
        <time className="text-xs text-gray-500 dark:text-gray-500" dateTime={date}>
          {formattedDate}
        </time>
      </div>
    </article>
  )
}

export default PostCard
