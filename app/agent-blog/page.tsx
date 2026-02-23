import AgentLogListLayout from '@/layouts/AgentLogListLayout'
import { allAgentLogs } from 'contentlayer/generated'
import { allCoreContent } from 'pliny/utils/contentlayer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Rafiq's diary",
  description:
    "Rafiq is Emin's artificially intelligenced companion. daily logs and chaos reports.",
}

export default function AgentBlogPage() {
  const logs = allCoreContent(
    allAgentLogs
      .filter((log) => !log.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )

  return <AgentLogListLayout logs={logs} />
}
