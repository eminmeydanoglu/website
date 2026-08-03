---
version: alpha
name: Editorial Pastel (meydanoglu.com)
description: Works in Progress-inspired editorial magazine identity — blush paper, hairline rules, serif display, mono meta, pastel story panels tinted from artwork.
sources:
  - https://worksinprogress.co (live computed-style probe, 2026-08-02)
  - docs/EDITORIAL_REDESIGN_BRIEF.md (owner requirements)
notes:
  - WiP panel colors are assigned per topic, not extracted from images. Owner wants dynamic color↔image harmony, so we extract the dominant hue from each generated cover and snap it to the nearest curated pastel.
  - Dark mode keeps the same ink/paper relationship on a warm near-black.
colors:
  paper: "#FFF7F4"        # page background (WiP exact: rgb(255,247,244))
  ink: "#141414"          # primary text + hairlines (WiP soft black)
  paper-dark: "#1B1613"   # dark mode background (warm near-black)
  ink-dark: "#F4EBE5"     # dark mode text
  accent: "#33705B"       # interactive only: links, focus rings (Psyche-like sage, oklch scale in tailwind.css)
  tints:                  # story panel backgrounds, snapped from cover art
    mint: "#CEE0DC"       # WiP culture rgb(206,224,220)
    yellow: "#F4D06F"     # WiP politics rgb(244,208,111)
    blue: "#B8CBE8"       # dusty blue (WiP cities hero)
    blush: "#F6D8CE"      # house addition, matches paper
    lavender: "#DDD3EA"   # house addition
typography:
  display:
    fontFamily: Playfair Display (latin-ext)  # WiP "Editor" serif analog
    usage: card titles, page headings, prose h1-h3
  body:
    fontFamily: Newsreader (latin-ext)        # longform prose, summaries
    usage: .prose, card excerpts
  meta:
    fontFamily: IBM Plex Mono (latin-ext)     # WiP "GT America Mono" analog
    usage: nav, eyebrows, dates, tags, bylines — small size, wide tracking; uppercase for section labels only, dates/tags render lowercase (owner preference: "21 mart 2026", 2026-08 round 2)
  ui:
    fontFamily: Inter (latin-ext)             # form controls, search
layout:
  grid: 12-col desktop, cards on 3-col grid (2-col tablet, 1-col mobile), dense flow, rows and columns aligned — every 5th card spans 2 cols for scale contrast (owner rejected the scattered/staggered look, 2026-08 round 2); hairline 1px ink rules between sections
  card: full-bleed image + tinted panel overlapping bottom-left (WiP spotlight-card structure: title → mono meta → hairline → excerpt → tag)
components:
  editorial-card:
    backgroundColor: "{colors.tints.*} — per post"
    borderColor: none (image) / hairline rules inside panel
    titleFont: display serif, ~1.5-1.75rem, tight leading
    metaFont: mono, 0.75rem, uppercase, tracking-wide
  hairline:
    width: 1px
    color: "{colors.ink}" (light) / 20% ink-dark (dark)
imagery:
  style: classical oil painting / fine-art print, muted warm palette, visible texture, no text in image
  source: codex imagegen (see docs/EDITORIAL_REDESIGN_BRIEF.md), saved to public/static/images/generated/
---

## Overview

Personal writings site as an editorial magazine. Posts greet the visitor
immediately (3–4 cards above the fold), cards vary in size, every post has
artwork, and each card's panel is tinted from its artwork (snapped to the
curated pastel set above). Profile avatar top-right opens About/CV.

## Do's and Don'ts

- DO keep the page background paper-flat — color lives only inside cards.
- DO use mono for meta, serif for content, never mix roles.
- DO keep hairlines 1px and ink-colored; no gray borders, no rounded cards,
  no drop shadows on cards.
- DON'T use the accent color for large fills — it is for links/focus only.
- DON'T center long text; editorial = left-aligned.
- DON'T let a panel tint escape the curated set (always snap, never raw-extract).
