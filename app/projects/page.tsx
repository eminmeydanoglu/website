'use client'

import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { useTranslation } from '@/lib/LanguageContext'

export default function Projects() {
  const { t } = useTranslation()
  return (
    <div className="pt-2">
      <div className="pb-6">
        <h1 className="text-ink/70 dark:text-ink-dark/70 font-mono text-sm tracking-[0.25em] uppercase">
          {t('page.projects')}
        </h1>
      </div>
      <div className="border-ink/80 dark:border-ink-dark/30 border-t py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projectsData.map((d) => (
            <Card
              key={d.title}
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
