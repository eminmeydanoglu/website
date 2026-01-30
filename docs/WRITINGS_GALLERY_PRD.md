# Writings Gallery View - Requirements

## Overview

Transform the current list-based blog layout into a Notion-style gallery view with card-based design, filtering, and database-like properties.

---

## Visual Design

### Card Layout

- **Grid:** Responsive masonry/grid (4 cols desktop, 3 tablet, 2 mobile, 1 small mobile)
- **Card Structure:**
  ```
  ┌─────────────────────────┐
  │                         │
  │    THUMBNAIL IMAGE      │
  │    (aspect 16:10)       │
  │                         │
  ├─────────────────────────┤
  │ 🎯 Title                │
  │ 👤 Author               │
  │ [Category Badge]        │
  │                         │
  │ Summary text preview... │
  └─────────────────────────┘
  ```

### Card Elements

1. **Thumbnail:** Full-width, consistent aspect ratio, fallback placeholder for missing images
2. **Icon/Emoji:** Optional decorative icon before title (from frontmatter)
3. **Title:** Bold, 1-2 lines max with ellipsis
4. **Author:** Avatar + name (small, subtle)
5. **Category Badge:** Colored pill/tag (primary category)
6. **Tags:** Secondary tags as smaller pills (optional, hideable)
7. **Summary:** 2-3 lines, truncated with ellipsis
8. **Date:** Subtle, bottom or as hover info

### Styling

- Dark mode compatible
- Hover effects: subtle lift/shadow, thumbnail zoom
- Smooth transitions
- Consistent card heights OR masonry layout

---

## Data Model (Frontmatter Extensions)

```yaml
---
title: 'Post Title'
date: 2026-01-30
tags: ['felsefe', 'epistemoloji']

# New fields
category: 'Felsefe' # Primary category (single)
icon: '🎯' # Optional emoji for card
author: 'Emin Meydanoğlu' # Author name
authorAvatar: '/static/images/avatar.png' # Optional, falls back to default
thumbnail: '/static/images/post-image.png'
summary: 'Brief description'
featured: false # Pin to top
draft: false
---
```

### Categories (predefined list)

- Felsefe
- Bilim
- Teknoloji
- Kişisel
- Eleştirel Düşünme
- Din/Teoloji
- Sosyoloji
- Ekonomi

---

## Filtering & Sorting

### Filter Bar (above grid)

- **Category dropdown/pills:** Filter by single category
- **Tag filter:** Multi-select tags
- **Search:** Real-time text search (title + summary)
- **Sort:** Date (new/old), Title (A-Z), Featured first

### URL State

- Filters reflected in URL query params for shareability
- Example: `/blog?category=Felsefe&tags=epistemoloji&sort=date-desc`

---

## Component Structure

```
app/blog/page.tsx
├── GalleryHeader
│   ├── Title ("Writings")
│   ├── FilterBar
│   │   ├── CategoryFilter
│   │   ├── TagFilter
│   │   └── SearchInput
│   └── SortDropdown
│
├── GalleryGrid
│   └── PostCard (repeated)
│       ├── CardThumbnail
│       ├── CardIcon
│       ├── CardTitle
│       ├── CardAuthor
│       ├── CardCategory
│       ├── CardTags (optional)
│       └── CardSummary
│
└── Pagination (or infinite scroll)
```

---

## Responsive Breakpoints

| Breakpoint | Columns | Card Width |
| ---------- | ------- | ---------- |
| < 480px    | 1       | 100%       |
| 480-768px  | 2       | ~50%       |
| 768-1024px | 3       | ~33%       |
| > 1024px   | 4       | ~25%       |

---

## Interactions

1. **Card Click:** Navigate to post
2. **Category Badge Click:** Filter by that category
3. **Tag Click:** Add tag to filter
4. **Hover:** Subtle elevation + thumbnail scale
5. **Keyboard:** Tab navigation, Enter to open

---

## Fallbacks & Edge Cases

- **No thumbnail:** Show gradient placeholder with icon/emoji centered
- **No summary:** Show first 150 chars of content
- **No category:** Show "Uncategorized" or hide badge
- **No icon:** Don't show icon space
- **Long titles:** Truncate with ellipsis after 2 lines
- **Empty state:** "No posts found" with clear filters button

---

## Migration Plan

### Phase 1: Data

- [ ] Add missing fields to existing posts (category, icon)
- [ ] Update contentlayer schema if needed
- [ ] Create default author config

### Phase 2: Components

- [ ] Create PostCard component
- [ ] Create GalleryGrid component
- [ ] Create FilterBar component
- [ ] Create CategoryFilter, TagFilter, SearchInput

### Phase 3: Integration

- [ ] Replace ListLayoutWithTags usage in /blog
- [ ] Add URL state management for filters
- [ ] Test responsive behavior

### Phase 4: Polish

- [ ] Animations and transitions
- [ ] Dark mode testing
- [ ] Accessibility audit
- [ ] Performance (image optimization, lazy loading)

---

## Decisions

1. **Fixed Grid** - consistent card heights, cleaner look
2. **Pagination** - simpler, SEO friendly
3. **Single Author** - Emin only, no multi-author complexity
4. **No view toggle** - gallery only for now

---

## Reference

- Notion Gallery View (see attached screenshot)
- Similar: Medium cards, Dev.to feed
