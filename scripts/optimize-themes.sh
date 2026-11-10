#!/bin/zsh
# Resize + compress every splash in public/themes to max 1920px wide JPEG (macOS built-in `sips`).
# Usage: npm run themes:optimize
setopt null_glob
cd "${0:A:h}/../public/themes" || exit 1
for f in *.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}; do
  out="${f%.*}.jpg"
  before=$(stat -f%z "$f")
  sips -s format jpeg -s formatOptions 72 -Z 1920 "$f" --out "_tmp_$out" >/dev/null && mv "_tmp_$out" "$out"
  [[ "$f" != "$out" ]] && rm "$f"
  echo "$out  $((before/1024))KB -> $(( $(stat -f%z "$out")/1024 ))KB"
done
