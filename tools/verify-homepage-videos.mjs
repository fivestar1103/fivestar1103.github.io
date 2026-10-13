import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { createReadStream, readFileSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const out = path.resolve(option('--out', '../homepage-video-verification-20261013')); mkdirSync(out, { recursive: true });
const root = path.resolve('docs');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.vtt': 'text/vtt', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  let file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://local').pathname)}`);
  if ((file !== root && !file.startsWith(root + path.sep)) || !existsSync(file)) { res.writeHead(404); res.end(); return; }
  if (statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
  const size = statSync(file).size; const headers = { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const start = range ? Number(range[1]) : 0; const end = range?.[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
  if (start > end) { res.writeHead(416); res.end(); return; }
  if (range) headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  headers['Content-Length'] = end - start + 1;
  res.writeHead(range ? 206 : 200, headers); if (req.method === 'HEAD') res.end(); else createReadStream(file, { start, end }).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = option('--base', `http://127.0.0.1:${server.address().port}`);
const browser = await chromium.launch({ channel: 'chromium', headless: true });
const results = []; const errors = []; const failed = [];
try {
  for (const width of [320, 390, 1440]) {
    for (const colorScheme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, locale: 'en-US', reducedMotion: 'reduce' });
      await context.addInitScript(() => { try { localStorage.setItem('site-language', 'en'); } catch { /* opaque frames */ } });
      const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
      for (const route of ['/', '/hwan/', '/subtitle-overlay/', '/subtitle-overlay/index.ko.html']) {
        const downloads = []; const listener = request => { if (request.url().includes('.mp4')) downloads.push(request.url()); };
        page.on('request', listener);
        const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
        if (!response?.ok()) throw new Error(`Page unavailable ${route}`);
        const video = page.locator('video').first(); await video.scrollIntoViewIfNeeded();
        const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src), frames: [...document.querySelectorAll('video')].map(video => ({ width: video.getBoundingClientRect().width, ratio: video.getBoundingClientRect().width / video.getBoundingClientRect().height, preload: video.preload })) }));
        if (geometry.overflow || geometry.brokenImages.length || downloads.length || geometry.frames.some(frame => Math.abs(frame.ratio - 16 / 9) > .02 || frame.preload !== 'none')) throw new Error(`Layout or eager video download: ${route} ${width} ${colorScheme}`);
        if (route === '/' || route === '/hwan/') {
          await page.locator('[data-language-toggle]').click();
          if (await page.locator('html').getAttribute('lang') !== 'ko') throw new Error('Homepage language toggle failed');
          if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Korean overflow');
        }
        await page.screenshot({ path: path.join(out, `${width}-${colorScheme}-${route === '/' ? 'company' : route === '/hwan/' ? 'founder' : route.includes('.ko') ? 'product-ko' : 'product-en'}.png`), fullPage: true });
        if (colorScheme === 'light' && width !== 320) await page.locator(route === '/' ? '.product-with-video' : route === '/hwan/' ? '.work-item' : '#demo').first().screenshot({ path: path.join(out, `${width}-${route === '/' ? 'company' : route === '/hwan/' ? 'founder' : route.includes('.ko') ? 'product-ko' : 'product-en'}-video.png`) });
        page.off('request', listener);
        results.push({ width, colorScheme, route, ...geometry, initialMp4Requests: downloads.length });
      }
      await context.close();
    }
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.locator('[data-video-preview]').scrollIntoViewIfNeeded();
  const preview = page.locator('[data-video-preview] video'); const button = page.locator('[data-video-toggle]');
  if (!await preview.evaluate(video => video.paused && !video.querySelector('source').getAttribute('src'))) throw new Error('Reduced-motion preview started');
  await button.click(); await page.waitForFunction(() => document.querySelector('[data-video-preview] video').currentTime > .1);
  await button.click(); if (!await preview.evaluate(video => video.paused)) throw new Error('Pause control failed');
  await page.locator('#top').scrollIntoViewIfNeeded(); await page.locator('[data-video-preview]').scrollIntoViewIfNeeded();
  if (!await preview.evaluate(video => video.paused)) throw new Error('Manual pause was not preserved');
  await page.goto(base + '/subtitle-overlay/', { waitUntil: 'networkidle' });
  const compact = page.locator('#demo video').first(); await compact.evaluate(video => { video.muted = true; });
  await page.locator('#demo [data-video-play]').first().click();
  await page.waitForFunction(() => document.querySelector('#demo video').currentTime > .1);
  const metadata = await compact.evaluate(video => ({ duration: video.duration, width: video.videoWidth, height: video.videoHeight, trackCount: video.textTracks.length }));
  if (metadata.duration !== 30 || metadata.width !== 1280 || metadata.height !== 720 || metadata.trackCount !== 1) throw new Error('Compact media metadata failed');
  const previous = await compact.elementHandle(); await page.locator('.product-header .product-nav a[href="support.html"]').click(); await page.waitForURL('**/support.html');
  if (!await previous.evaluate(video => video.paused)) throw new Error('SPA navigation left audio playing');
  await page.locator('.product-header .product-nav a[href="./"]').click(); await page.waitForURL('**/subtitle-overlay/');
  if (await page.locator('#demo video').count() !== 2 || await page.locator('#demo video').first().evaluate(video => getComputedStyle(video).width) === '1280px') throw new Error('SPA overview video styles failed');
  await page.locator('.app-tour-details').first().locator('summary').click();
  const detailed = page.locator('#demo video').nth(1); await detailed.evaluate(video => { video.muted = true; });
  await page.locator('#demo [data-video-play]').nth(1).click();
  await page.waitForFunction(() => document.querySelectorAll('#demo video')[1].currentTime > .1);
  if (Math.abs(await detailed.evaluate(video => video.duration) - 80.4) > .01) throw new Error('Detailed tour playback failed');
  const automatic = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  await automatic.goto(base + '/', { waitUntil: 'networkidle' }); await automatic.locator('[data-video-preview]').scrollIntoViewIfNeeded();
  await automatic.waitForFunction(() => !document.querySelector('[data-video-preview] video').paused);
  await automatic.locator('#contact').scrollIntoViewIfNeeded();
  await automatic.waitForFunction(() => document.querySelector('[data-video-preview] video').paused);
  const dataSaver = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  await dataSaver.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }));
  const saver = await dataSaver.newPage(); await saver.goto(base + '/', { waitUntil: 'networkidle' }); await saver.locator('[data-video-preview]').scrollIntoViewIfNeeded();
  if (!await saver.locator('video').evaluate(video => video.paused && !video.querySelector('source').getAttribute('src'))) throw new Error('Data saver triggered a download');
  await dataSaver.close();
  const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent)));
  if (!schema.some(item => item['@type'] === 'VideoObject' && item.duration === 'PT30S')) throw new Error('Video schema absent');
  if (errors.length || failed.length) throw new Error(JSON.stringify({ errors, failed }));
  const source = JSON.parse(readFileSync('docs/subtitle-overlay/media/1.8-preview/source-manifest.json', 'utf8'));
  for (const asset of source.assets) {
    if (!option('--base') && createHash('sha256').update(readFileSync(`docs/subtitle-overlay/media/1.8-preview/${asset.file}`)).digest('hex') !== asset.sha256) throw new Error('Media hash differs');
  }
  const receipt = { status: 'passed', base, layoutCases: results, errors, failed, functional: { compactAndDetailedPlayback: true, englishCaptionTrackPresent: true, explicitPreviewPlayPause: true, respectsReducedMotionAndDataSaver: true, previewPausesOffscreen: true, manualPauseSurvivesScroll: true, navigationStopsDetachedAudio: true, overviewStylesSurviveSupportNavigation: true, videoStructuredData: true, assetHashes: !option('--base') }, source };
  writeFileSync(path.join(out, 'verification.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify({ status: receipt.status, layoutCases: results.length, functional: receipt.functional }, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
