import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div className="pt-2">
      <div className="pb-6">
        <h1 className="text-ink/70 dark:text-ink-dark/70 font-mono text-sm tracking-[0.25em] uppercase">
          Tags
        </h1>
      </div>
      <div className="border-ink/80 dark:border-ink-dark/30 border-t py-10">
        {tagKeys.length === 0 && (
          <p className="text-ink/50 dark:text-ink-dark/50 font-mono text-xs tracking-widest uppercase">
            No tags found.
          </p>
        )}
        <ul className="flex max-w-2xl flex-wrap gap-x-8 gap-y-4">
          {sortedTags.map((t) => {
            return (
              <li key={t} className="flex items-baseline gap-1">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="text-ink/50 dark:text-ink-dark/50 font-mono text-xs"
                  aria-label={`View posts tagged ${t}`}
                >
                  {`(${tagCounts[t]})`}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
