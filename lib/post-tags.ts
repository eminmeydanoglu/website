type PostTagSource = {
  tags?: string[] | null
}

export function getPostTags(post: PostTagSource): string[] {
  return [...new Set((post.tags ?? []).filter(Boolean))]
}

export function formatTagLabel(label: string): string {
  return `#${label.toLowerCase().split(' ').join('-')}`
}
