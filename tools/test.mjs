import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { resolve, sep } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '../docs');
const server = createServer(async (req, res) => {
  let path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
  if (!path.startsWith(root + sep) && path !== root) { res.writeHead(400).end(); return; }
  try {
    if ((await stat(path)).isDirectory()) {
      if (!new URL(req.url, 'http://local').pathname.endsWith('/')) {
        const url = new URL(req.url, 'http://local'); url.pathname += '/';
        res.writeHead(301, { location: url.pathname + url.search }).end(); return;
      }
      path += '/index.html';
    }
    const body = await readFile(path); res.writeHead(200, {'content-length': body.length}).end(body);
  } catch { res.writeHead(404).end(await readFile(root + '/404.html')); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  await test('model is HTTP 200 with permanent exact size and hash', async () => {
    const response = await fetch(base + '/subtitle-overlay/models/silero_vad.onnx');
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200); assert.equal(bytes.length, 2327524);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), '2623a2953f6ff3d2c1e61740c6cdb7168133479b267dfef114a4a3cc5bdd788f');
  });
  for (const path of ['/', '/no-such-page.html?lang=ko#contact', '/a/deep/link?x=1&y=%ED%95%9C#part', '//evil.example/path?x=1', '/a%20b?next=https%3A%2F%2Fevil.example']) {
    await test(`human redirect ${path}`, async () => {
      const response = await fetch(base + path); const html = await response.text();
      assert.equal(response.status, path === '/' ? 200 : 404);
      assert.match(html, /name="robots" content="noindex, follow"/);
      assert.match(html, /http-equiv="refresh"/);
      assert.match(html, /rel="canonical"/);
      const url = new URL(base + path); let destination;
      const elements = { canonical: {}, destination: {} };
      const context = vm.createContext({ location: {pathname:url.pathname,search:url.search,hash:url.hash,replace(v){destination=v;}},document:{getElementById(id){return elements[id];}} });
      for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1],context);
      assert.equal(destination, 'https://kuiperbelt.site' + url.pathname + url.search + url.hash);
      assert.equal(new URL(destination).origin,'https://kuiperbelt.site');
      assert.equal(elements.canonical.href,'https://kuiperbelt.site'+url.pathname);
    });
  }
  await test('every old page answers 200 and moves to the same path without JavaScript', async () => {
    const { pages, stub, target } = await import('./make-stubs.mjs');
    const list = await pages();
    assert.ok(list.length > 40);
    for (const path of list) {
      assert.equal(await readFile(resolve(root, path), 'utf8'), stub(path), `stale stub ${path}`);
      const response = await fetch(base + '/' + path.split('/').map(encodeURIComponent).join('/'));
      const html = await response.text();
      assert.equal(response.status, 200, path);
      assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${target(path)}">`), path);
      assert.ok(html.includes(`<link rel="canonical" href="${target(path)}">`), path);
      assert.equal(new URL(target(path)).origin, 'https://kuiperbelt.site');
    }
    assert.equal(target('spamdog/index.html'), 'https://kuiperbelt.site/spamdog/');
    assert.equal(target('spamdog/privacy.html'), 'https://kuiperbelt.site/spamdog/privacy.html');
    const url = new URL(base + '/spamdog/privacy.html?lang=ko#contact'); let destination;
    const html = await (await fetch(url)).text();
    const context = vm.createContext({ location: { pathname: url.pathname, search: url.search, hash: url.hash, replace(v) { destination = v; } } });
    for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(match[1], context);
    assert.equal(destination, 'https://kuiperbelt.site/spamdog/privacy.html?lang=ko#contact');
  });
  await test('app-ads.txt retained byte for byte', async () => {
    const r=await fetch(base+'/app-ads.txt');assert.equal(r.status,200);
    assert.equal(createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex'),'5f95b64111d5bf7008c038f7b13b84eeb17b314f040f60a9f6493b5cb54afa39');
  });
  for (const path of ['callback','deauthorize','delete']) {
    await test(`OAuth ${path} stays on old origin`,async()=>{
      const r=await fetch(`${base}/threads-oauth/${path}?code=TEST&state=TEST`);
      assert.equal(r.status,200);assert.equal(new URL(r.url).origin,base);
      assert.equal(new URL(r.url).search,'?code=TEST&state=TEST');
      assert.doesNotMatch(await r.text(),/location\.replace|http-equiv="refresh"/);
    });
  }
  await test('no custom domain or publishing of history',async()=>{
    await assert.rejects(stat(root+'/CNAME')); assert.equal((await stat(root+'/.nojekyll')).size,0);
  });
} finally { server.closeAllConnections(); await new Promise(r=>server.close(r)); }
