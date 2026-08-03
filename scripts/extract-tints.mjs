/**
 * Extract each generated cover's dominant hue and snap it to the nearest
 * curated pastel (see design-drafts/DESIGN.md — never raw-extract).
 * Writes data/post-tints.json: { "<slug>": "<pastel hex>" }.
 *
 * Usage: node scripts/extract-tints.mjs
 */
import sharp from 'sharp'
import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const GENERATED = new URL('../public/static/images/generated/', import.meta.url).pathname
const OUT = new URL('../data/post-tints.json', import.meta.url).pathname

// Curated pastels — must match PANEL_TINTS in lib/post-tints.ts
const PASTELS = [
  { hex: '#CEE0DC', name: 'mint', hue: 172 },
  { hex: '#F4D06F', name: 'yellow', hue: 45 },
  { hex: '#B8CBE8', name: 'blue', hue: 218 },
  { hex: '#F6D8CE', name: 'blush', hue: 14 },
  { hex: '#DDD3EA', name: 'lavender', hue: 258 },
]

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) * 60
      break
    case g:
      h = ((b - r) / d + 2) * 60
      break
    default:
      h = ((r - g) / d + 4) * 60
  }
  return { h, s, l }
}

const hueDist = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b))

async function dominantColor(file) {
  // Downscale hard, then average — robust enough for tint snapping.
  const { data, info } = await sharp(file)
    .resize(32, 32, { fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  let r = 0
  let g = 0
  let b = 0
  const n = info.width * info.height
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
  }
  return rgbToHsl(Math.round(r / n), Math.round(g / n), Math.round(b / n))
}

const files = readdirSync(GENERATED).filter((f) => f.endsWith('.png'))

// Score every post against every pastel, then assign greedily with a per-tint
// cap so a warm-toned set doesn't collapse into a wall of yellow.
const CAP = 2
const scored = []
for (const file of files) {
  const slug = file.replace(/\.png$/, '')
  const { h, s } = await dominantColor(join(GENERATED, file))
  const prefs =
    s < 0.12
      ? PASTELS.map((p) => ({ ...p, d: p.name === 'blush' ? 0 : 999 }))
      : PASTELS.map((p) => ({ ...p, d: hueDist(h, p.hue) })).sort((a, b) => a.d - b.d)
  scored.push({ slug, hue: h, sat: s, prefs })
}
// Most-constrained first (smaller best distance = clearer winner, assign early)
scored.sort((a, b) => a.prefs[0].d - b.prefs[0].d)

const usage = Object.fromEntries(PASTELS.map((p) => [p.name, 0]))
const result = {}
for (const { slug, hue, sat, prefs } of scored) {
  const pick = prefs.find((p) => usage[p.name] < CAP) ?? prefs[0]
  usage[pick.name] += 1
  result[slug] = pick.hex
  console.log(`${slug}: hue=${hue.toFixed(0)} sat=${sat.toFixed(2)} -> ${pick.name} ${pick.hex}`)
}

writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n')
console.log(`\nwrote ${OUT} (${files.length} tints)`, usage)
