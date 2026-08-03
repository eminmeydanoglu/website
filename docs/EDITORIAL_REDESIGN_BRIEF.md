# Editorial Pastel Redesign — Brief (Round 1)

Date: 2026-08-02
Status: Direction approved by owner. Implementation happens on emin-sever
(repo: `/home/emins/code/website`).

## Design Direction

"Editorial pastel", inspired primarily by **Works in Progress**
(https://worksinprogress.co) — cream paper background, hairline rules, serif
display type, classical-art imagery, and text panels tinted from each
artwork's own palette.

Reference screenshots in repo root:

- `ref-worksinprogress.jpeg` — PRIMARY reference, owner's pick. The example
  the owner loved: Bruegel-style painting + pale-yellow text panel with
  hairline rules, serif title, small-caps meta.
- `ref-psyche.jpeg` — essay↔artwork pairing; cream + deep green + ochre
  accents; philosophy-magazine feel (matches the site's content).
- `ref-maggieappleton.jpeg` — calm serif scale, personal warmth.
- `ref-joshwcomeau.jpeg` — take ONLY tag/chip styling and eyebrow labels.
- `ref-rauno.jpeg`, `ref-emilkowalski.jpeg` — craft/typography references
  only, NOT the target aesthetic.
- `baseline-home.jpeg`, `baseline-projects.jpeg`, `baseline-post.jpeg` —
  pre-redesign state of this site.

## Requirements (owner, round 1)

1. **Homepage = the writings.** Posts greet the visitor immediately; no big
   intro hero first.
2. **3–4 post cards visible at once** — not one giant featured story like
   WiP's own homepage.
3. **Scattered/masonry layout.** Cards are NOT strictly aligned; mixed sizes
   (some big, some small).
4. **Every post has artwork.** Current cover images will be REPLACED with
   AI-generated images (pipeline below). Target style: classical painting /
   print illustration, consistent across the set.
5. **Dynamic color↔image harmony.** Each card's panel/accent color is derived
   from its artwork's palette (as WiP does per story).
6. **Profile logo top-right** → click opens About/CV section.
7. Keep TR/EN bilingual and dark mode working. Stack: Next.js 15 + Tailwind
   v4 + Contentlayer2.

## Imagegen Pipeline (to build)

- Drive codex on emin-sever like an API — VERIFIED WORKING (smoke test
  produced a valid 1254x1254 PNG):

  ```
  cd <workdir> && codex exec --skip-git-repo-check \
    -c model_reasoning_effort=\"high\" \
    "<post content/title + style spec; ask it to save the PNG into the cwd>"
  ```

- Model `gpt-5.6-terra`, high reasoning effort (the "terra high" setup).
  NOTE: codex-cli 0.146.0 on emin-sever rejects `--profile autonomous`
  (config profile V2); the base `~/.codex/config.toml` there already carries
  `approval_policy="never"`, `sandbox_mode="danger-full-access"`,
  `web_search="live"`, so the `-c` effort override is the whole delta.
- Codex's built-in `image_gen` tool writes to
  `$CODEX_HOME/generated_images/<session>/`; instruct it to copy the file
  into the target dir. Final covers go under
  `public/static/images/generated/`, one per post, style-consistent.
- Minor: `service_tier = "flex"` triggers a harmless unsupported-tier warning
  with this model; remove the line from remote config if noise matters.

## Environment

- 26 design skills installed at `.agents/skills/` (ui-design + visual-critique
  packs, design-token, theming-system, color-expert, motion-design,
  brand-to-design-md). Restart kimi to pick them up.
- Dev server: `node .yarn/releases/yarn-3.6.1.cjs dev` (yarn is repo-pinned).
- Progress log convention: `docs/progress.txt`.
