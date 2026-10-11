#!/usr/bin/env node
// Regenerates the Chrome Web Store / Gumroad marketing shots from the REAL
// extension build, end to end:
//
//   1. Loads `subtitle-overlay-extension/dist/` into a full Chromium
//      (channel: 'chromium' — the headless shell cannot load MV3 extensions,
//      same pattern as e2e/fixtures.ts) and captures the live popup at
//      deviceScaleFactor 2 into promotional/screenshots/popup-*.png.
//   2. Re-renders promotional/store-shots/slide1-5.html at exactly 1280×800
//      into store-1..5.png.
//   3. Renders thumb.html at 600×600 into gumroad-thumbnail.png (Gumroad
//      requires a square image of at least 600×600).
//
// Run from anywhere:  node "promotional/scripts/capture-store-shots.mjs"
// Playwright is resolved from the extension package's node_modules.

import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const promoDir = path.resolve(here, '..');
const extDir = process.env.SUBTITLE_OVERLAY_EXTENSION_DIR
  ? path.resolve(process.env.SUBTITLE_OVERLAY_EXTENSION_DIR)
  : path.resolve(promoDir, '..', 'subtitle-overlay-extension');
const distDir = path.join(extDir, 'dist');
// Match the E2E capture: disposable build, localhost fixture access, analytics off.
const { prepareTestExtension } = await import(pathToFileURL(path.join(extDir, 'e2e/extensionBuild.mjs')).href);
const shotsDir = path.join(promoDir, 'screenshots');
const slidesDir = path.join(promoDir, 'store-shots');

const require = createRequire(path.join(extDir, 'package.json'));
const { chromium } = require('playwright');

if (!existsSync(path.join(distDir, 'manifest.json'))) {
  console.error(`No build at ${distDir} — run \`npm run build\` in the extension first.`);
  process.exit(1);
}
const manifestVersion = require(path.join(distDir, 'manifest.json')).version;
console.log(`Capturing from dist/ v${manifestVersion}`);

// Lines for the side-panel shot. Written for this image rather than lifted from
// a real subtitle file, so nothing copyrighted ends up in a store asset.
const PANEL_LINES = [
  { startTime: 12, endTime: 15, text: 'You said you would wait for me.' },
  { startTime: 16, endTime: 19, text: 'I did. For eleven years.' },
  { startTime: 21, endTime: 24, text: 'Then why does the room feel this empty?' },
  { startTime: 26, endTime: 30, text: 'Because you never unpacked anything.' },
  { startTime: 33, endTime: 36, text: 'That is not fair.' },
  { startTime: 38, endTime: 42, text: 'No. But it is true, and you know it.' },
  { startTime: 45, endTime: 48, text: 'I kept the letters.' },
  { startTime: 51, endTime: 55, text: 'All of them?' },
  { startTime: 58, endTime: 62, text: 'Every one. Even the ones you tore up.' },
  { startTime: 66, endTime: 70, text: 'I thought I had thrown those away.' },
  { startTime: 74, endTime: 78, text: 'You threw them at me. It is not the same.' },
  { startTime: 82, endTime: 86, text: 'Sit down. Please.' },
];

// ── 1. live popup captures ──────────────────────────────────────────────
async function capturePopup() {
  const captureDist = prepareTestExtension('standard');
  const profile = mkdtempSync(path.join(tmpdir(), 'so-shots-'));
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    headless: true,
    viewport: { width: 760, height: 860 },
    deviceScaleFactor: 2,
    locale: 'en-US',
    args: [
      '--lang=en-US',
      `--disable-extensions-except=${captureDist}`,
      `--load-extension=${captureDist}`,
    ],
  });
  try {
    let [worker] = context.serviceWorkers();
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const extensionId = new URL(worker.url()).host;
    await worker.evaluate(async () => {
      for (let waited = 0; waited < 3000; waited += 50) {
        if ((await chrome.storage.local.get('firstRun_v1')).firstRun_v1) break;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await chrome.storage.local.set({ firstRun_v1: { introSeen: true, consentPromptSeen: true } });
    });

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/src/popup/index.html`);
    await popup.getByRole('button', { name: 'Styling', exact: true }).waitFor({ timeout: 10_000 });
    await popup.waitForTimeout(600); // storage hydration + first paint settle
    const popupText = await popup.locator('body').innerText();
    if (new RegExp(`\\bv${manifestVersion.replaceAll('.', '\\.')}\\b`, 'i').test(popupText)) {
      throw new Error(
        `Popup exposes v${manifestVersion}; remove it before generating reusable store screenshots.`
      );
    }

    if (/\bbeta\b/i.test(popupText)) throw new Error('Release UI still exposes a Beta label');
    await popup.screenshot({
      path: path.join(shotsDir, 'popup-subtitles.png'),
      fullPage: true,
    });
    console.log('✓ screenshots/popup-subtitles.png');

    // The in-video panel. It needs a real page with a real <video>, because the
    // content script only injects on http/https and only mounts where there is
    // something to caption. The e2e fixture server already serves exactly that
    // and carries no dependencies, so it is reused rather than duplicated.
    const player = await context.newPage();
    await player.setViewportSize({ width: 1180, height: 760 });
    await player.goto('http://localhost:5174/player.html');
    await player.waitForFunction(
      () => {
        const v = document.querySelector('video');
        return !!v && v.currentTime > 0 && v.readyState > 2;
      },
      undefined,
      { timeout: 20_000 }
    );

    await worker.evaluate(async (lines) => {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (!tab?.id) throw new Error('no active tab for the panel shot');
      await chrome.tabs.sendMessage(tab.id, {
        action: 'loadSubtitles',
        fileName: 'store-shot.srt',
        source: 'upload',
        subtitles: lines,
      });
    }, PANEL_LINES);

    await player.locator('.subtitle-side-trigger-zone button').first().click();
    await player.locator('.subtitle-side-panel').waitFor({ timeout: 10_000 });
    await player.waitForTimeout(900);
    await player.locator('.subtitle-side-panel').screenshot({
      path: path.join(shotsDir, 'side-panel.png'),
    });
    console.log('✓ screenshots/side-panel.png');

    await player.bringToFront();
    await popup.reload();
    await popup.getByTestId('smart-sync-beta-card').waitFor();
    await popup.getByTestId('smart-sync-beta-card').screenshot({
      path: path.join(shotsDir, 'smart-sync-setup.png'), animations: 'disabled',
    });
    console.log('✓ screenshots/smart-sync-setup.png (current release controls)');

    await popup.getByRole('button', { name: 'Styling' }).click();
    await popup.waitForTimeout(400);
    await popup.screenshot({
      path: path.join(shotsDir, 'popup-styling.png'),
      fullPage: true,
    });
    console.log('✓ screenshots/popup-styling.png');


  } finally {
    await context.close();
    rmSync(profile, { recursive: true, force: true });
    rmSync(captureDist, { recursive: true, force: true });
  }
}

// ── 2. slide renders (1280×800) + 3. thumbnail (600×600) ───────────────
async function renderSlides() {
  const browser = await chromium.launch({ channel: 'chromium', headless: true });
  try {
    const renders = [
      ...[1, 2, 3, 4, 5].map((n) => ({
        file: `slide${n}.html`,
        out: `store-${n}.png`,
        width: 1280,
        height: 800,
      })),
      { file: 'thumb.html', out: 'gumroad-thumbnail.png', width: 600, height: 600 },
      { file: 'slide6-roadmap.html', out: 'cover-roadmap.png', width: 1280, height: 800 },
      // The only image Chrome documents as affecting placement: without it
      // the listing is sorted behind every extension that has one.
      { file: 'tile.html', out: 'small-promo-440x280.png', width: 440, height: 280 },
      // Featuring only, per Chrome's docs. Kept here so it has a source in
      // the repo rather than being a one-off slide-deck export.
      { file: 'marquee.html', out: 'marquee-1400x560.png', width: 1400, height: 560 },
    ];
    for (const { file, out, width, height } of renders) {
      const src = path.join(slidesDir, file);
      if (!existsSync(src)) {
        console.log(`- ${file} missing, skipped`);
        continue;
      }
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(pathToFileURL(src).href);
      await page.waitForLoadState('networkidle'); // @import'ed Google fonts
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(slidesDir, out) });
      await page.close();
      console.log(`✓ store-shots/${out}`);
    }
  } finally {
    await browser.close();
  }
}

// Capture the current release card directly; do not reuse the obsolete SODA/Beta setup fixture.
await capturePopup();
await renderSlides();
console.log('Done.');
