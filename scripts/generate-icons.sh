#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-source-image>"
  echo "Example: $0 assets/icon-source.jpg"
  exit 1
fi

SRC="$1"
if [[ ! -f "$SRC" ]]; then
  echo "Source image not found: $SRC" >&2
  exit 1
fi

OUT_DIR="assets"
mkdir -p "$OUT_DIR"

if ! command -v sips >/dev/null 2>&1; then
  echo "This script requires 'sips' (macOS built-in). Not found." >&2
  exit 1
fi

tmp="$(mktemp -t baseally-icon.XXXXXX).png"
cleanup() { rm -f "$tmp"; }
trap cleanup EXIT

# Convert to PNG first (sips handles many formats).
sips -s format png "$SRC" --out "$tmp" >/dev/null

# Center-crop to square first so icons don't become rectangles.
width="$(sips -g pixelWidth "$tmp" | awk '/pixelWidth/ {print $2}')"
height="$(sips -g pixelHeight "$tmp" | awk '/pixelHeight/ {print $2}')"
if [[ -n "${width}" && -n "${height}" ]]; then
  if (( width < height )); then
    side="$width"
  else
    side="$height"
  fi
  offset_x=0
  offset_y=0
  if (( width > side )); then
    offset_x=$(( (width - side) / 2 ))
  fi
  if (( height > side )); then
    offset_y=$(( (height - side) / 2 ))
  fi
  sips --cropOffset "$offset_y" "$offset_x" -c "$side" "$side" "$tmp" >/dev/null
fi

make_png() {
  local size="$1"
  local out="$2"
  cp "$tmp" "$out"
  sips -Z "$size" "$out" >/dev/null
}

make_png 16  "$OUT_DIR/icon-16.png"
make_png 32  "$OUT_DIR/icon-32.png"
make_png 48  "$OUT_DIR/icon-48.png"
make_png 180 "$OUT_DIR/apple-touch-icon.png"
make_png 192 "$OUT_DIR/icon-192.png"
make_png 512 "$OUT_DIR/icon-512.png"

echo "Generated:"
ls -1 "$OUT_DIR"/icon-16.png \
      "$OUT_DIR"/icon-32.png \
      "$OUT_DIR"/icon-48.png \
      "$OUT_DIR"/apple-touch-icon.png \
      "$OUT_DIR"/icon-192.png \
      "$OUT_DIR"/icon-512.png
