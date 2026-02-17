import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import sharp from 'sharp'

const BLOG_DIR = path.join(process.cwd(), 'data/blog')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OG_DIR = path.join(PUBLIC_DIR, 'static/og')
const WIDTH = 1200
const HEIGHT = 630

if (!fs.existsSync(OG_DIR)) {
  fs.mkdirSync(OG_DIR, { recursive: true })
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Word-wrap text to fit within maxWidth (approximate character-based)
function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim())
      currentLine = word
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word
    }
  }
  if (currentLine) lines.push(currentLine.trim())
  return lines
}

function createTextOverlaySvg(title, author, siteUrl) {
  const lines = wrapText(title, 24)
  const fontSize = lines.length > 2 ? 58 : 68
  const lineHeight = fontSize * 1.25
  const titleBlockHeight = lines.length * lineHeight

  // Position title in the lower-left area
  const titleStartY = HEIGHT - titleBlockHeight - 130

  const titleLines = lines
    .map((line, i) => {
      const y = titleStartY + i * lineHeight
      return `<text x="72" y="${y}" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="white" letter-spacing="-1">${escapeXml(line)}</text>`
    })
    .join('\n    ')

  const metaY = HEIGHT - 55

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <!-- Gradient overlay for text readability -->
    <defs>
      <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)" />
        <stop offset="30%" stop-color="rgba(0,0,0,0.1)" />
        <stop offset="70%" stop-color="rgba(0,0,0,0.55)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.85)" />
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#overlay)" />
    
    ${titleLines}
    
    <text x="72" y="${metaY}" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.85)" font-weight="600">${escapeXml(author)}</text>
    <text x="${WIDTH - 72}" y="${metaY}" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.6)" font-weight="400" text-anchor="end">${escapeXml(siteUrl)}</text>
  </svg>`
}

async function generateOgImage(title, thumbnailPath, slug) {
  const outputPath = path.join(OG_DIR, `${slug}.png`)

  // Resolve thumbnail path
  const imgPath = path.join(PUBLIC_DIR, thumbnailPath.replace(/^\//, ''))

  if (!fs.existsSync(imgPath)) {
    console.warn(`  ⚠ Thumbnail not found: ${imgPath}, using fallback`)
    // Create a dark gradient fallback
    const fallbackBg = sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 15, g: 15, b: 20, alpha: 1 },
      },
    }).png()

    const textOverlay = Buffer.from(
      createTextOverlaySvg(title, 'Emin Meydanoğlu', 'meydanoglu.com')
    )

    await fallbackBg.composite([{ input: textOverlay, top: 0, left: 0 }]).toFile(outputPath)

    console.log(`  ✓ ${slug}.png (fallback)`)
    return
  }

  // Load and resize background image to cover 1200x630
  const bgImage = await sharp(imgPath)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.9 })
    .png()
    .toBuffer()

  // Create text overlay SVG
  const textOverlay = Buffer.from(createTextOverlaySvg(title, 'Emin Meydanoğlu', 'meydanoglu.com'))

  // Composite
  await sharp(bgImage)
    .composite([{ input: textOverlay, top: 0, left: 0 }])
    .png({ quality: 90 })
    .toFile(outputPath)

  console.log(`  ✓ ${slug}.png`)
}

async function main() {
  console.log('Generating OG images...\n')

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { data } = matter(content)

    if (data.draft) continue

    const slug = file.replace(/\.mdx$/, '')
    const title = data.title || slug
    const thumbnail = data.thumbnail || null

    if (!thumbnail) {
      console.log(`  ⊘ ${slug} (no thumbnail, skipping)`)
      continue
    }

    try {
      await generateOgImage(title, thumbnail, slug)
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`)
    }
  }

  console.log('\nDone!')
}

main()
