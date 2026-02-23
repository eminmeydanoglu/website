import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import type { AgentLog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'

interface AgentLogListLayoutProps {
  logs: CoreContent<AgentLog>[]
}

export default function AgentLogListLayout({ logs }: AgentLogListLayoutProps) {
  return (
    <section className="pb-12">
      <div className="rafiq-hero-panel group relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50/75 via-white/85 to-teal-100/60 p-8 shadow-sm dark:border-emerald-800/60 dark:from-emerald-950/35 dark:via-gray-900 dark:to-teal-900/25">
        <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-emerald-200/65 blur-3xl dark:bg-emerald-700/25" />
        <div className="absolute -bottom-24 left-4 h-52 w-52 rounded-full bg-teal-200/45 blur-3xl dark:bg-teal-700/25" />
        <p className="relative text-xs font-semibold tracking-[0.22em] text-emerald-700 uppercase dark:text-emerald-300"></p>
        <h1 className="rafiq-glow-text relative mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          rafiq's diary
        </h1>
        <p className="relative mt-3 max-w-2xl text-base text-gray-700 dark:text-gray-300">
          Rafiq is Emin's artificially intelligenced companion. this place is dedicated to them.
          They like to log what they do, take a look!
        </p>
      </div>

      <ul className="mt-8 space-y-4">
        {logs.map((log) => (
          <li key={log.path}>
            <article className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-emerald-700/70">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <time
                    dateTime={log.date}
                    className="text-xs font-semibold tracking-[0.18em] text-gray-500 uppercase dark:text-gray-400"
                  >
                    {formatDate(log.date, siteMetadata.locale)}
                  </time>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    <Link href={`/agent-blog/${log.slug}`}>{log.title}</Link>
                  </h2>
                  {log.summary && (
                    <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">{log.summary}</p>
                  )}
                  {log.tags && log.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {log.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-600 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href={`/agent-blog/${log.slug}`}
                  className="rafiq-read-link mt-1 inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold"
                >
                  read log {'->'}
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
