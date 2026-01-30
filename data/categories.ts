// Blog post categories
export const CATEGORIES = [
  { id: 'felsefe', label: 'Felsefe', color: 'blue' },
  { id: 'bilim', label: 'Bilim', color: 'green' },
  { id: 'teknoloji', label: 'Teknoloji', color: 'purple' },
  { id: 'kisisel', label: 'Kişisel', color: 'orange' },
  { id: 'elestirel-dusunme', label: 'Eleştirel Düşünme', color: 'red' },
  { id: 'din-teoloji', label: 'Din/Teoloji', color: 'yellow' },
  { id: 'sosyoloji', label: 'Sosyoloji', color: 'pink' },
  { id: 'ekonomi', label: 'Ekonomi', color: 'teal' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id)
}

export function getCategoryColor(id: string): string {
  const category = getCategoryById(id)
  return category?.color ?? 'gray'
}
