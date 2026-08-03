#!/usr/bin/env bash
# Generate editorial cover art for every blog post via codex imagegen.
# See docs/EDITORIAL_REDESIGN_BRIEF.md — style must stay consistent across the set.
# Usage: scripts/generate-covers.sh [parallelism]   (default 3)
set -u

ROOT="/home/emins/code/website"
OUT="$ROOT/public/static/images/generated"
LOGS="/tmp/imagegen-logs"
PAR="${1:-3}"
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
acidan-tasarruf-ugruna|A lone figure calmly extinguishing candles one by one in a dusk-lit room, serene face, emotional numbness, deep indigo shadows with warm ember accents.
cahilligin-kurbanlarina-merhamet-uzerine|A crowd of sleepwalkers drifting through fog toward a cliff edge, one awake figure reaching back toward them in warning, muted grays with a single ochre lantern light.
diger-dunyalar|Many small floating islands in a twilight sky, each island carrying one tiny house with a lit window, each its own little world, teal dusk with amber lights.
insani-karikature-cevirenler|An old carnival puppet theatre with wooden marionettes wearing exaggerated grotesque masks, one puppeteer hand visible above, warm theatrical reds and browns.
saplantili-asklar|A hand offering a heavy ring of antique iron keys toward a shadowy second figure, a single red rose lying on a stone table between them, deep rose and moss green tones.
insanlarin-ziyanlari-uzerine|A grand banquet table the morning after a feast, overturned goblets, wilted flowers, cold morning light through tall windows, amber and violet tones.
sokrates-ve-deger-dusmani-dostu|Two robed figures debating in an ancient Greek agora among marble columns, one gesturing calmly, the other laughing, marble white and Mediterranean blue.
ben-inanmak-degil-bilmek-istiyorum-safsatasi|A scholar climbing a tall ladder made of stacked books toward one small high window of bright light, dust motes in the beam, warm browns and gold.
bayesci-dusunme-metodu|A lone navigator at a wooden desk with compass, hand-drawn maps and brass balance scales, drifting clouds visible through a round window, slate blue and brass.
self-taught-vit|An antique mechanical loom weaving a tapestry from scattered small patches that slowly assemble into a coherent landscape image, iron and wood with pastel thread colors.
JOBS

echo "---- summary ----"
ls -la "$OUT"