import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const basePath = process.env.BASE_PATH || ''
  const normalizeImage = (img: string) => {
    if (img.startsWith('http')) return img
    const withLeadingSlash = img.startsWith('/') ? img : `/${img}`
    const withBasePath =
      basePath && !withLeadingSlash.startsWith(`${basePath}/`)
        ? `${basePath}${withLeadingSlash}`
        : withLeadingSlash
    return `${siteMetadata.siteUrl.replace(/\/$/, '')}${withBasePath}`
  }
  const resolvedImage = normalizeImage(image || siteMetadata.socialBanner)

  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: [resolvedImage],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: [resolvedImage],
    },
    ...rest,
  }
}
