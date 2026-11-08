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

// The founder's own pages stay on this host and open its homepage. They never
// lead to kuiperbelt.site: the two sites are kept apart on purpose.
export const personal = /^(hwan\/index\.html|portfolio[^/]*\.html|legacy\/portfolio[^/]*\.html)$/;

export function target(path) {
  if (personal.test(path)) return '/';
  const page = path.replace(/(^|\/)index\.html$/, '$1');
  return 'https://kuiperbelt.site/' + page.split('/').map(encodeURIComponent).join('/');
}

export function stub(path) {
  if (personal.test(path)) return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://fivestar1103.github.io/">
<title>Seonghwan Oh</title>
<script>location.replace('/' + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=/">
</head>
<body>
<p><a href="/">Seonghwan Oh</a></p>
</body>
</html>
`;
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
