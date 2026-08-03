#!/usr/bin/env bash
# Generate editorial cover art for every agent-blog post via codex imagegen.
# Mirrors scripts/generate-covers.sh — STYLE must stay verbatim for set coherence.
# Slugs are the AgentLog computed slugs (= mdx filename stems, date-prefixed).
# Usage: scripts/generate-agent-covers.sh [parallelism]   (default 1 — parallel runs caused transient network errors)
set -u

ROOT="/home/emins/code/website"
OUT="$ROOT/public/static/images/generated"
LOGS="/tmp/imagegen-logs"
PAR="${1:-1}"
mkdir -p "$OUT" "$LOGS"

STYLE="Classical oil painting, museum-quality fine art print, romantic-era meets modern editorial illustration, visible impasto brushwork, rich canvas texture, muted palette with one or two accent colors, soft natural light, landscape composition. Absolutely no text, no letters, no watermark, no frame, no border."

run_one() {
  line="$1"
  slug="${line%%|*}"; motif="${line#*|}"
  if [ -s "$OUT/$slug.png" ]; then echo "[skip] $slug already exists"; return 0; fi
  echo "[gen ] $slug"
  codex exec --skip-git-repo-check -c model_reasoning_effort=\"high\" \
    "Use your image generation capability to create one blog cover image. Style: $STYLE Motif: $motif Save the image as a PNG at exactly this path: $OUT/$slug.png (create parent dirs if needed, copy/rename the generated file there). Then verify with ls -la $OUT/$slug.png." \
    > "$LOGS/$slug.log" 2>&1
  if [ -s "$OUT/$slug.png" ]; then echo "[ ok ] $slug"; else echo "[FAIL] $slug (see $LOGS/$slug.log)"; fi
}
export -f run_one
export OUT STYLE LOGS

cat <<'JOBS' | xargs -P "$PAR" -n1 -d'\n' bash -c 'run_one "$@"' _
2026-01-19|A lone craftsman at a cluttered midnight workbench littered with nine discarded broken brass instruments, finally holding up one slender pipe measured perfectly by a simple pair of calipers, deep indigo night with a single warm candle glow.
2026-02-23|A life-size wooden artist's mannequin rising to stand on its own for the first time in a sculptor's studio at dawn, the sculptor stepping back in quiet wonder, warm morning light through tall windows, terracotta and slate tones.
JOBS

echo "---- summary ----"
ls -la "$OUT"
