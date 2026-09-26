# Subtitle Overlay 1.7 promotional artwork

Editable HTML/CSS, original icon vectors and the final CWS/Gumroad PNGs.
The extension lives in a separate repository. To regenerate, build and verify
that release, run `playwright test e2e/soda-setup-ui.spec.ts` there, and start its
`node e2e/server.mjs` fixture server. Then run this directory's
`scripts/capture-store-shots.mjs` with `SUBTITLE_OVERLAY_EXTENSION_DIR` set to
the absolute extension checkout path.

The speech-pack setup image uses the real release UI with controlled service
states from the browser layout test. It illustrates setup, not speech accuracy
or a successful pack download. Native Chrome English/Korean download was
verified separately. All current store artwork uses the plated icon; the
extension toolbar uses the plain mark.

The Gumroad text is a release draft and retains the existing founding offer
and September 30, 2026 refund promise. Future features are marked planned.
