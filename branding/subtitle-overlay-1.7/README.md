# Subtitle Overlay 1.7 promotional artwork

Editable HTML/CSS, original icon vectors and rendered CWS/Gumroad PNGs.

## Regenerate

Build the desired release in the separate extension repository, then start its
`node e2e/server.mjs` fixture server. Run this directory's
`scripts/capture-store-shots.mjs` with `SUBTITLE_OVERLAY_EXTENSION_DIR` set to
the absolute extension checkout path. Playwright comes from that checkout.
The script uses a disposable E2E copy of the release (localhost fixture access,
analytics disabled), dismisses first-run setup in the capture profile, captures
the current popup/Smart Sync card, then renders the original HTML at the store sizes.
Do not reuse the obsolete SODA/Beta setup screenshot or visual-test baselines.
The screenshots illustrate controls, not measured speech accuracy.

## 2026-10-11 correction

Removed Beta from `slide3.html`, `slide6-roadmap.html`, and `marquee.html`.
Re-captured the current v1.7.6 popup to remove the Pro/Smart Sync Beta badges
embedded in the old PNGs. Updated the corresponding generated assets.
Earlybird now uses the corrected roadmap and slides 2–4, preserving the two
videos, gallery order, slides 1/5, thumbnail, copy, and offer settings.
The CWS dashboard already held the newer Beta-free launch set (five shared
screenshots and both promo tiles); saved its draft without review submission.
The newer CWS/Membership set lives in `promotional/launch-2026-09-29` in the
adjacent Subtitle Overlay workspace. Do not replace it with this older five-slide
sequence merely because this sequence was regenerated for Earlybird.

Local backup and browser proof:
`subtitle overlay/strategy/smart-sync-beta-removal-2026-10-11/`.
The adjacent `gumroad-product-page.md` is historical copy, not today's live listing.
