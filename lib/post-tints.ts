import tintMap from '@/data/post-tints.json'

/**
 * Curated editorial pastels (see design-drafts/DESIGN.md).
 * Card panels always snap to this set — never raw-extracted colors.
 */
export const PANEL_TINTS = ['#CEE0DC', '#F4D06F', '#B8CBE8', '#F6D8CE', '#DDD3EA']

/** Ink color used on top of every pastel panel (readable on all five). */
export const PANEL_INK = '#141414'

const overrides = tintMap as Record<string, string>

/**
 * Per-post panel tint. After cover generation, scripts/extract-tints writes
 * data/post-tints.json (slug -> hex from the cover's dominant hue, snapped to
 * PANEL_TINTS). Until then, a stable hash of the slug picks the tint.
 */
export function getPostTint(slug: string): string {
  const mapped = overrides[slug]
  if (mapped && PANEL_TINTS.includes(mapped)) return mapped
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0
  return PANEL_TINTS[Math.abs(h) % PANEL_TINTS.length]
}
