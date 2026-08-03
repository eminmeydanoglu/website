import Image from './Image'
import Link from './Link'
import { formatTagLabel } from '@/lib/post-tags'
import { PANEL_INK } from '@/lib/post-tints'

interface EditorialCardProps {
  title: string
  slug: string
  summary?: string
  thumbnail?: string
  date: string
  tags?: string[]
  /** Panel background — a curated pastel from getPostTint. */
  tint: string
  /** Featured cards span two columns and get a wider image crop. */
  large?: boolean
  /** Route prefix for the card link (e.g. `/agent-blog`). */
  basePath?: string
}

/**
 * Works in Progress-style story card: full-bleed artwork with a tinted panel
 * overlapping the bottom-left — serif title, mono meta, hairline, excerpt, tag.
 * See design-drafts/DESIGN.md.
 */
const EditorialCard = ({
  title,
  slug,
  summary,
  thumbnail,
  date,
  tags = [],
  tint,
  large = false,
  basePath = '/writings',
}: EditorialCardProps) => {
  const href = `${basePath}/${slug}`
  const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const topic = tags.length > 0 ? formatTagLabel(tags[0]) : null

  return (
    <article>
      <Link href={href} aria-label={title} className="group block">
        {/* Artwork */}
        <div className={`relative overflow-hidden ${large ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
          {thumbnail ? (
            <Image
              alt={title}
              src={thumbnail}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              fill
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: tint }}
            >
              <span
                className="font-mono text-xs tracking-widest lowercase"
                style={{ color: PANEL_INK }}
              >
                {topic ?? 'yazı'}
              </span>
            </div>
          )}
        </div>

        {/* Tinted panel overlapping the artwork */}
        <div
          className="relative z-10 -mt-12 w-[92%] p-5 sm:-mt-14"
          style={{ backgroundColor: tint, color: PANEL_INK }}
        >
          <h3
            className={`font-display leading-tight font-bold group-hover:underline ${
              large ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
          >
            {title}
          </h3>
          <div className="mt-2 font-mono text-[11px] tracking-widest lowercase opacity-80">
            {formattedDate}
          </div>
          {summary && (
            <>
              <div className="my-3 border-t" style={{ borderColor: `${PANEL_INK}B3` }} />
              <p className="line-clamp-3 font-serif text-[15px] leading-relaxed">{summary}</p>
            </>
          )}
          {topic && (
            <div className="mt-3 font-mono text-[11px] tracking-widest lowercase underline underline-offset-4">
              {topic}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}

export default EditorialCard
