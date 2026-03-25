import Image from './Image'
import Link from './Link'
import { formatTagLabel } from '@/lib/post-tags'

interface PostCardProps {
  title: string
  slug: string
  summary?: string
  thumbnail?: string
  icon?: string
  date: string
  tags?: string[]
}

const PostCard = ({ title, slug, summary, thumbnail, date, tags = [] }: PostCardProps) => {
  const href = `/writings/${slug}`
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
            <span className="text-4xl text-gray-400">📄</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="mb-2 text-xl leading-snug font-bold tracking-tight text-gray-900 dark:text-gray-100">
          <Link href={href} className="hover:text-primary-500 dark:hover:text-primary-400">
            {title}
          </Link>
        </h2>

        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
              >
                {formatTagLabel(tag)}
              </span>
            ))}
          </div>
        )}

        {summary && (
          <p className="mb-3 flex-1 text-sm text-gray-600 dark:text-gray-400">{summary}</p>
        )}

        <time className="text-xs text-gray-500 dark:text-gray-500" dateTime={date}>
          {formattedDate}
        </time>
      </div>
    </article>
  )
}

export default PostCard
