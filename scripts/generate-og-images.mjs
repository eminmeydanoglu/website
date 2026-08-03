/**
 * Generates per-post Open Graph images (1200x630) in the Editorial Pastel
 * style (see design-drafts/DESIGN.md):
 *
 *   paper #FFF7F4 background · generated cover art on the right, full height,
 *   separated by a 1px ink hairline · per-post pastel tint chip · Playfair
 *   Display serif title in ink · IBM Plex Mono uppercase meta.
 *
 * Typography is rendered by librsvg/Pango through sharp's SVG support. The
 * brand fonts live in scripts/fonts/ (checked in, OFL-licensed); we point
 * fontconfig at them via a generated config so the build works on any machine
 * without system font installs. Pango falls back to system serif/mono stacks
 * if the font files are missing.
 *
 * Contract: reads data/blog/*.mdx frontmatter (title, date, tags, thumbnail),
 * writes public/static/og/<slug>.png. Invoked by `yarn build` before
 * `next build`; app/writings/[...slug]/page.tsx references /static/og/<slug>.png.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'data/blog')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OG_DIR = path.join(PUBLIC_DIR, 'static/og')
const FONT_DIR = path.join(process.cwd(), 'scripts/fonts')
const TINTS_PATH = path.join(process.cwd(), 'data/post-tints.json')

const WIDTH = 1200
const HEIGHT = 630
const PAPER = '#FFF7F4'
const INK = '#141414'
const DEFAULT_TINT = '#F6D8CE' // curated blush, used when a slug has no tint entry
const IMG_X = 744 // cover art starts here; text column is 72..696
const TEXT_LEFT = 72
const TEXT_RIGHT = 696

const AUTHOR = 'Emin Meydanoğlu'
const SITE = 'meydanoglu.com'

const SERIF = "'Playfair Display', 'DejaVu Serif', 'Liberation Serif', serif"
const MONO = "'IBM Plex Mono', 'DejaVu Sans Mono', 'Liberation Mono', monospace"

// Assigned in main() after FONTCONFIG_FILE is set.
let sharp = null

// Point fontconfig at the checked-in brand fonts before sharp (and its
// vendored libvips/fontconfig) initializes.
function setupFonts() {
  if (!fs.existsSync(path.join(FONT_DIR, 'PlayfairDisplay-VF.ttf'))) {
    console.warn('  ⚠ scripts/fonts missing, falling back to system fonts')
    return
  }
  const conf = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${FONT_DIR}</dir>
  <cachedir>${path.join(os.tmpdir(), 'og-fontconfig-cache')}</cachedir>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
</fontconfig>`
  const confPath = path.join(os.tmpdir(), 'og-fonts.conf')
  fs.writeFileSync(confPath, conf)
  process.env.FONTCONFIG_FILE = confPath
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Locale-independent Turkish uppercase (i -> İ, ı -> I).
function trUpper(str) {
  return str.replace(/i/g, 'İ').toUpperCase()
}

// Greedy word-wrap by estimated advance width (Playfair Bold ≈ 0.52em/char);
// words longer than a full line are hard-split.
function wrapText(text, maxCharsPerLine) {
  const words = []
  for (const word of text.split(' ')) {
    for (let i = 0; i < word.length; i += maxCharsPerLine) {
      words.push(word.slice(i, i + maxCharsPerLine))
    }
  }

  const lines = []
  let currentLine = ''
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

// Pick the largest serif size whose wrapped title fits the text column.
function layoutTitle(title, columnWidth) {
  const maxLines = 4
  for (const fontSize of [64, 56, 48, 42, 36]) {
    const cpl = Math.max(8, Math.floor(columnWidth / (fontSize * 0.52)))
    const lines = wrapText(title, cpl)
    if (lines.length <= maxLines) {
      return { lines, fontSize, lineHeight: fontSize * 1.18 }
    }
  }
  // Very long titles: smallest size, truncate the last line with an ellipsis
  const fontSize = 36
  const cpl = Math.max(8, Math.floor(columnWidth / (fontSize * 0.52)))
  const lines = wrapText(title, cpl).slice(0, maxLines)
  lines[maxLines - 1] = lines[maxLines - 1].replace(/.{2}$/, '…')
  return { lines, fontSize, lineHeight: fontSize * 1.18 }
}

function isoDate(date) {
  if (!date) return ''
  if (date instanceof Date) return date.toISOString().slice(0, 10)
  return String(date).slice(0, 10)
}

/**
 * Text overlay: eyebrow (tint chip + author · site), hairline, vertically
 * centered serif title block, bottom hairline + date/tag meta. Ink on paper.
 */
function createTextOverlaySvg({ title, date, tag, tint, fullWidth }) {
  const left = TEXT_LEFT
  const right = fullWidth ? WIDTH - TEXT_LEFT : TEXT_RIGHT
  const columnWidth = right - left

  // Eyebrow: tint chip + "EMIN MEYDANOĞLU · MEYDANOGLU.COM"
  const chipSize = 16
  const eyebrowY = 96

  // Title block, vertically centered between the two hairlines
  const { lines, fontSize, lineHeight } = layoutTitle(title, columnWidth)
  const regionTop = 150
  const regionBottom = 505
  const blockHeight = lines.length * lineHeight
  const firstBaseline = regionTop + (regionBottom - regionTop - blockHeight) / 2 + fontSize * 0.82

  const titleLines = lines
    .map((line, i) => {
      const y = Math.round(firstBaseline + i * lineHeight)
      return `<text x="${left}" y="${y}" font-family="${SERIF}" font-size="${fontSize}" font-weight="700" fill="${INK}">${escapeXml(line)}</text>`
    })
    .join('\n    ')

  const metaY = 566
  const metaLeft = escapeXml(isoDate(date))
  const metaRight = tag ? escapeXml(trUpper(tag)) : ''

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <!-- eyebrow -->
    <rect x="${left}" y="${eyebrowY - chipSize}" width="${chipSize}" height="${chipSize}" fill="${tint}" />
    <text x="${left + chipSize + 14}" y="${eyebrowY}" font-family="${MONO}" font-size="21" font-weight="500" letter-spacing="3.5" fill="${INK}">${escapeXml(trUpper(`${AUTHOR} · ${SITE}`))}</text>
    <line x1="${left}" y1="124" x2="${right}" y2="124" stroke="${INK}" stroke-width="1" />

    ${titleLines}

    <!-- bottom meta -->
    <line x1="${left}" y1="530" x2="${right}" y2="530" stroke="${INK}" stroke-width="1" />
    <text x="${left}" y="${metaY}" font-family="${MONO}" font-size="20" font-weight="400" letter-spacing="3" fill="${INK}">${metaLeft}</text>
    <text x="${right}" y="${metaY}" font-family="${MONO}" font-size="20" font-weight="400" letter-spacing="3" fill="${INK}" text-anchor="end">${metaRight}</text>
  </svg>`
}

async function generateOgImage({ title, date, tag, tint, thumbnailPath, slug }) {
  const outputPath = path.join(OG_DIR, `${slug}.png`)
  const imgPath = thumbnailPath ? path.join(PUBLIC_DIR, thumbnailPath.replace(/^\//, '')) : null

  const paper = sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: PAPER },
  })

  const overlays = []
  let fullWidth = true

  if (imgPath && fs.existsSync(imgPath)) {
    fullWidth = false
    // Cover art: full-height column on the right, cropped to the salient
    // region, separated from the text by a 1px ink hairline.
    const cover = await sharp(imgPath)
      .resize(WIDTH - IMG_X, HEIGHT, { fit: 'cover', position: 'attention' })
      .png()
      .toBuffer()
    overlays.push({ input: cover, top: 0, left: IMG_X })
    const hairline = Buffer.from(
      `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <line x1="${IMG_X}" y1="0" x2="${IMG_X}" y2="${HEIGHT}" stroke="${INK}" stroke-width="1" />
      </svg>`
    )
    overlays.push({ input: hairline, top: 0, left: 0 })
  } else if (imgPath) {
    console.warn(`  ⚠ Thumbnail not found: ${imgPath}, text-only layout`)
  }

  const textOverlay = Buffer.from(createTextOverlaySvg({ title, date, tag, tint, fullWidth }))
  overlays.push({ input: textOverlay, top: 0, left: 0 })

  await paper.composite(overlays).png({ quality: 90 }).toFile(outputPath)
  console.log(`  ✓ ${slug}.png${fullWidth ? ' (no artwork)' : ''}`)
}

async function main() {
  console.log('Generating OG images (editorial style)...\n')

  setupFonts()
  sharp = (await import('sharp')).default

  const tints = fs.existsSync(TINTS_PATH) ? JSON.parse(fs.readFileSync(TINTS_PATH, 'utf-8')) : {}
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  if (!fs.existsSync(OG_DIR)) {
    fs.mkdirSync(OG_DIR, { recursive: true })
  }

  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { data } = matter(content)

    if (data.draft) continue

    const slug = file.replace(/\.mdx$/, '')
    const title = data.title || slug
    const tag = Array.isArray(data.tags) && data.tags.length > 0 ? String(data.tags[0]) : null
    const tint = tints[slug] || DEFAULT_TINT

    try {
      await generateOgImage({
        title,
        date: data.date,
        tag,
        tint,
        thumbnailPath: data.thumbnail || null,
        slug,
      })
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`)
    }
  }

  console.log('\nDone!')
}

main()
