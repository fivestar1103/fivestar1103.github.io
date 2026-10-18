// Writes a 200 redirect page at every old HTML path listed in legacy-pages.txt.
// GitHub Pages answers unknown paths with 404.html and HTTP 404; store review and
// policy crawlers read that as a dead privacy or support URL even though browsers
// follow the script. A stub at the exact path answers 200, follows without
// JavaScript through meta refresh, and keeps query and hash when scripts run.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const here = import.meta.dirname;
const docs = resolve(here, '../docs');
const kept = /^(index\.html|404\.html|threads-oauth\/)/;

export function target(path) {
  const page = path.replace(/(^|\/)index\.html$/, '$1');
  return 'https://kuiperbelt.site/' + page.split('/').map(encodeURIComponent).join('/');
}

export function stub(path) {
  const to = target(path);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<link rel="canonical" href="${to}">
<title>Kuiper Belt — moved</title>
<script>location.replace('https://kuiperbelt.site' + location.pathname + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${to}">
</head>
<body>
<p><a href="${to}">Continue to Kuiper Belt</a></p>
</body>
</html>
`;
}

export async function pages() {
  const list = (await readFile(resolve(here, 'legacy-pages.txt'), 'utf8')).split('\n').filter(Boolean);
  for (const path of list) {
    if (kept.test(path) || !path.endsWith('.html') || path.includes('..')) throw new Error(`not a stub path: ${path}`);
  }
  return list;
}

if (process.argv[1] === import.meta.filename) {
  const list = await pages();
  for (const path of list) {
    await mkdir(dirname(resolve(docs, path)), { recursive: true });
    await writeFile(resolve(docs, path), stub(path));
  }
  console.log(`${list.length} stubs written`);
}
