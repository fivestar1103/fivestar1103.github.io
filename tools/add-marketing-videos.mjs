import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Run once against the reviewed source branch; preserve the previous pages in Git.
if (readFileSync('docs/index.html', 'utf8').includes('data-video-preview')) throw new Error('Videos are already integrated; edit the existing media sections instead of rerunning this migration.');
const library = path.resolve(process.argv[2] ?? '../marketing-video-library-20261013/library');
const manifest = JSON.parse(readFileSync(path.join(library, 'manifest.json'), 'utf8'));
const media = 'docs/subtitle-overlay/media/1.8-preview'; mkdirSync(media, { recursive: true });
const assets = { 'website-loop': 'website-preview-12s', 'compact-overview': 'app-preview-30s', 'detailed-walkthrough': 'app-tour-80s' };
for (const [id, name] of Object.entries(assets)) {
  const asset = manifest.variants.find(item => item.id === id);
  const file = path.join(library, asset.filename);
  if (createHash('sha256').update(readFileSync(file)).digest('hex') !== asset.sha256) throw new Error(`Unreviewed video ${id}`);
  copyFileSync(file, `${media}/${name}.mp4`); copyFileSync(path.join(library, asset.poster), `${media}/${name}.jpg`);
}
writeFileSync(`${media}/source-manifest.json`, `${JSON.stringify({ source: 'Subtitle Overlay 1.8.0 review candidate',
  date: '2026-10-13', assets: Object.keys(assets).map(id => { const v = manifest.variants.find(item => item.id === id); return { id, file: `${assets[id]}.mp4`, seconds: v.durationSeconds, sha256: v.sha256 }; }) }, null, 2)}\n`);
const stamp = seconds => { const ms = Math.round(seconds * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
const compact = manifest.variants.find(item => item.id === 'compact-overview');
const cues = compact.segments.map(segment => `${stamp(segment.timelineStart)} --> ${stamp(segment.timelineStart + segment.duration)}\n${segment.chapter === '07-repeat' ? 'The package arrived this morning and nobody signed for it.' : `[${segment.title.replaceAll('\n', ' ')} ${segment.description.replaceAll('\n', ' ')}]`}`);
writeFileSync(`${media}/app-preview.en.vtt`, `WEBVTT\n\n${cues.join('\n\n')}\n`);
const edit = (file, from, to) => { const text = readFileSync(file, 'utf8'); if (!text.includes(from)) throw new Error(`Missing anchor in ${file}`); writeFileSync(file, text.replace(from, to)); };
const style = '<link rel="stylesheet" href="/assets/product-video.css">';
for (const file of ['docs/index.html', 'docs/hwan/index.html', ...['index', 'support', 'privacy'].flatMap(name => [`docs/subtitle-overlay/${name}.html`, `docs/subtitle-overlay/${name}.ko.html`])]) edit(file, '</head>', `${style}\n<script src="/assets/product-video.js" defer></script>\n</head>`);
edit('docs/index.html', '<article class="product">', '<article class="product product-with-video">');
edit('docs/index.html', '<div class="product-visual subtitle-visual"><img src="/subtitle-overlay/shots/hero.png" alt="Subtitle Overlay subtitle styling and timing controls" width="1280" height="800" loading="lazy"></div>', `<figure class="product-video" data-video-preview>
          <video muted loop playsinline preload="none" width="1280" height="720" poster="/subtitle-overlay/media/1.8-preview/website-preview-12s.jpg" aria-label="Subtitle Overlay silent app preview">
            <source data-src="/subtitle-overlay/media/1.8-preview/website-preview-12s.mp4" type="video/mp4">
          </video>
          <figcaption><div><p><span class="copy-en">1.8 update preview · English interface</span><span class="copy-ko">1.8 업데이트 미리보기 · 영어 화면</span></p><a class="text-link kb-link" href="/subtitle-overlay/#demo" data-en-href="/subtitle-overlay/#demo" data-ko-href="/subtitle-overlay/index.ko.html#demo"><span class="copy-en">Watch the 30-second app tour</span><span class="copy-ko">30초 제품 소개 보기</span><span aria-hidden="true">→</span></a></div><button class="video-toggle" type="button" data-video-toggle data-video-state="paused"><span class="video-label-play"><span class="copy-en">Play preview</span><span class="copy-ko">미리보기 재생</span></span><span class="video-label-pause"><span class="copy-en">Pause preview</span><span class="copy-ko">미리보기 일시정지</span></span></button></figcaption>
        </figure>`);
const native = (name, aria, captions = false, bilingual = false) => {
  const seconds = name.includes('80') ? 80 : 30;
  const label = /[가-힣]/.test(aria) ? `${seconds}초 시연 재생` : `Play ${seconds}-second tour`;
  const button = bilingual ? `<span class="copy-en">Play ${seconds}-second tour</span><span class="copy-ko">${seconds}초 시연 재생</span>` : label;
  const url = `/subtitle-overlay/media/1.8-preview/${name}.mp4`;
  return `<div class="video-frame"><video data-video-tour playsinline preload="none" width="1280" height="720" poster="/subtitle-overlay/media/1.8-preview/${name}.jpg" aria-label="${aria}"><source src="${url}" type="video/mp4">${captions ? '<track kind="captions" src="/subtitle-overlay/media/1.8-preview/app-preview.en.vtt" srclang="en" label="English">' : ''}<a href="${url}">${aria}</a></video><button class="video-play" type="button" data-video-play><span aria-hidden="true">▶</span>${button}</button></div><noscript><p><a href="${url}">${label}</a></p></noscript>`;
};
edit('docs/hwan/index.html', '        </article>', `          <figure class="product-video work-video">${native('app-preview-30s', 'Subtitle Overlay app preview, 30 seconds', true, true)}<figcaption><p><span class="copy-en">Subtitle Overlay in 30 seconds · 1.8 update preview</span><span class="copy-ko">30초로 보는 Subtitle Overlay · 1.8 업데이트 미리보기</span></p><a class="kb-link" href="/subtitle-overlay/#demo" data-en-href="/subtitle-overlay/#demo" data-ko-href="/subtitle-overlay/index.ko.html#demo"><span class="copy-en">Explore the full tour</span><span class="copy-ko">전체 시연 보기</span> →</a></figcaption></figure>\n        </article>`);
const descriptions = {
  en: ['See it in 30 seconds.', 'Bring a file, make it comfortable to read, and stay in control of the timing.', 'The tour previews the 1.8 update, including sentence repeat. Features shown may differ from the current Chrome release.', 'Watch the full app tour · 80 seconds', 'Read the short tour transcript', ['Bring a subtitle file, find one online, or reopen a saved file.', 'Change subtitle appearance and position while you watch.', 'Adjust timing, search for a line, and jump to that moment.', 'Hear the same sentence twice with sentence repeat.', 'Keep subtitles in fullscreen and configure your defaults.', 'Review the optional Smart Sync Pro suggestion, Apply it, or Undo.']],
  ko: ['30초로 보는 사용 흐름', '자막 파일을 불러오고, 보기 편하게 바꾸고, 시간을 맞추는 과정을 확인하세요.', '문장 반복을 포함한 1.8 업데이트 미리보기입니다. 영상의 기능은 현재 Chrome 배포판과 다를 수 있습니다.', '전체 앱 시연 보기 · 80초', '짧은 시연의 내용 읽기', ['자막 파일을 불러오거나, 온라인에서 찾거나, 저장한 파일을 다시 엽니다.', '시청 중 자막 모양과 위치를 바꿉니다.', '시간을 조절하고, 자막 문장을 검색해 해당 장면으로 이동합니다.', '문장 반복으로 같은 문장을 두 번 듣습니다.', '전체 화면에서 자막을 보고 기본 설정을 바꿉니다.', '선택 기능인 Smart Sync Pro의 제안을 확인하고 적용하거나 되돌립니다.']]
};
for (const [language, copy] of Object.entries(descriptions)) {
  const file = `docs/subtitle-overlay/index${language === 'ko' ? '.ko' : ''}.html`;
  const image = language === 'ko' ? '<div class="shot"><img src="./shots/hero.png" alt="브라우저 영상 위에 표시된 자막" width="1280" height="800"></div>' : '<div class="shot"><img src="./shots/hero.png" alt="Subtitles rendered over a video in the browser" width="1280" height="800"></div>';
  edit(file, image, `<section class="app-demo" id="demo" aria-labelledby="demo-title"><h2 id="demo-title">${copy[0]}</h2><p>${copy[1]}</p><figure class="product-video">${native('app-preview-30s', language === 'ko' ? 'Subtitle Overlay 30초 미리보기, 영어 화면' : 'Subtitle Overlay app preview, 30 seconds', true)}<figcaption><p>${copy[2]}</p></figcaption></figure><details class="app-tour-details"><summary>${copy[3]}</summary><figure class="product-video">${native('app-tour-80s', language === 'ko' ? 'Subtitle Overlay 전체 앱 시연, 영어 화면' : 'Subtitle Overlay full app tour, 80 seconds')}</figure></details><details class="app-tour-details"><summary>${copy[4]}</summary><ol class="tour-transcript">${copy[5].map(item => `<li>${item}</li>`).join('')}</ol></details></section>`);
  const data = { '@context': 'https://schema.org', '@type': 'VideoObject', name: language === 'ko' ? 'Subtitle Overlay 1.8 업데이트 미리보기' : 'Subtitle Overlay 1.8 app preview', description: copy[1] + ' ' + copy[2], thumbnailUrl: 'https://kuiperbelt.site/subtitle-overlay/media/1.8-preview/app-preview-30s.jpg', contentUrl: 'https://kuiperbelt.site/subtitle-overlay/media/1.8-preview/app-preview-30s.mp4', uploadDate: '2026-10-13', duration: 'PT30S', inLanguage: 'en' };
  edit(file, style, `<script type="application/ld+json">${JSON.stringify(data)}</script>\n${style}`);
}
edit('docs/subtitle-overlay/navigation.js', '      // One synchronous update:', "      document.querySelectorAll('video').forEach(video => video.pause());\n      // One synchronous update:");
console.log('Added reviewed videos to the company, founder, and EN/KO product homepages.');
