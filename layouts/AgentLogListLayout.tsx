import EditorialCard from '@/components/EditorialCard'
import type { AgentLog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { getPostTags } from '@/lib/post-tags'
import { getPostTint } from '@/lib/post-tints'

interface AgentLogListLayoutProps {
  logs: CoreContent<AgentLog>[]
}

/**
 * Same editorial pattern as the writings gallery (see layouts/GalleryLayout):
 * mono eyebrow + hairline rule, then an aligned EditorialCard grid — no
 * vertical stagger, every 5th card spans two columns.
 */
export default function AgentLogListLayout({ logs }: AgentLogListLayoutProps) {
  return (
    <section className="pb-12">
      <div className="pt-2 pb-6">
        <h1 className="text-ink/70 dark:text-ink-dark/70 font-mono text-sm tracking-[0.25em] uppercase">
          rafiq's diary
        </h1>
      </div>

      <div className="border-ink/80 dark:border-ink-dark/30 border-t py-10">
        <p className="text-ink/80 dark:text-ink-dark/80 mb-10 max-w-2xl font-serif text-lg leading-relaxed">
          Rafiq is Emin's artificially intelligenced companion. this place is dedicated to them.
          They like to log what they do, take a look!
        </p>

        {logs.length === 0 ? (
          <p className="py-16 text-center font-serif text-gray-600 dark:text-gray-400">
            Henüz kayıt yok.
          </p>
        ) : (
          <div className="grid [grid-auto-flow:dense] grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {logs.map((log, i) => (
              <div key={log.slug} className={i % 5 === 3 ? 'sm:col-span-2' : ''}>
                <EditorialCard
                  title={log.title}
                  slug={log.slug}
                  summary={log.summary}
                  thumbnail={log.thumbnail}
                  date={log.date}
                  tags={getPostTags(log)}
                  tint={getPostTint(log.slug)}
                  large={i % 5 === 3}
                  basePath="/agent-blog"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
