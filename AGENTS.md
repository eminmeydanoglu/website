# Website Project - Agent Instructions

Personal website for Emin Meydanoğlu (meydanoglu.com).

## Tech Stack

- **Framework:** Next.js 15.4 (App Router)
- **Styling:** Tailwind CSS 4
- **Content:** Contentlayer2 (MDX blog posts)
- **Package Manager:** Yarn 3.6.1
- **Deployment:** GitHub Pages (static export)

## Project Structure

```
app/                  # Next.js App Router pages
├── page.tsx          # Homepage (Main component with blog list)
├── blog/             # Blog listing and [slug] pages
├── projects/         # Projects page
├── cv/               # CV viewer (PDF)
├── tags/             # Tag-based filtering
├── layout.tsx        # Root layout with providers
└── Main.tsx          # Main homepage component

components/           # Reusable UI components
├── ui/               # Base UI primitives

data/
├── blog/             # MDX blog posts
├── authors/          # Author MDX profiles (en/tr)
├── projects/         # Project MDX files
├── siteMetadata.js   # Site config (title, social, analytics)
├── headerNavLinks.ts # Navigation links
└── projectsData.ts   # Projects list

layouts/              # Page layout templates
├── PostLayout.tsx    # Blog post layout
├── AuthorLayout.tsx  # Author page layout
└── ListLayout.tsx    # Blog list layouts

lib/                  # Utilities
├── i18n.ts           # Internationalization helpers
└── LanguageContext.tsx

css/
├── tailwind.css      # Tailwind entry
└── prism.css         # Code highlighting

public/static/        # Static assets
├── images/           # Blog images, avatar
├── favicons/         # Favicon set
└── cv.pdf            # Resume PDF
```

## Commands

```bash
yarn install          # Install dependencies
yarn dev              # Start dev server (localhost:3000)
yarn build            # Build for production
yarn serve            # Serve production build
yarn lint             # ESLint + Prettier
```

## Content Authoring

Blog posts go in `data/blog/` as MDX files with frontmatter:

```mdx
---
title: 'Post Title'
date: '2025-01-30'
tags: ['tag1', 'tag2']
draft: false
summary: 'Brief description'
---

Content here...
```

## Key Files to Modify

| Goal                    | File                          |
| ----------------------- | ----------------------------- |
| Site title/social links | `data/siteMetadata.js`        |
| Navigation              | `data/headerNavLinks.ts`      |
| Homepage layout         | `app/Main.tsx`                |
| Blog post appearance    | `layouts/PostLayout.tsx`      |
| Styling                 | `css/tailwind.css`            |
| Author bio              | `data/authors/default.en.mdx` |

## Environment Variables

Copy `.env.example` to `.env.local`. Optional integrations:

- Giscus comments (GitHub Discussions)
- Umami/Plausible analytics
- Newsletter (Buttondown)

## Notes for Agents

- Turkish content uses `.tr.mdx` suffix (e.g., `default.tr.mdx`)
- Images referenced in posts go to `public/static/images/`
- Contentlayer auto-generates types at build time
- Use `contentlayer.config.ts` to modify content schema
