// Keep loaded fonts alive between the English and Korean product pages.
// Ordinary links remain fully usable without JavaScript or if fetching fails.
(() => {
  const base = new URL('./', location.href);
  const paths = new Set(['', 'index.html', 'support.html', 'privacy.html', 'index.ko.html', 'support.ko.html', 'privacy.ko.html'].map(p => base.pathname + p));
  let revision = 0;
  const cache = new Map();
  function isProduct(url) { return url.origin === location.origin && paths.has(url.pathname); }
  async function navigate(url, push) {
    const current = ++revision;
    try {
      let markup = cache.get(url.pathname);
      if (!markup) {
        const response = await fetch(url.href);
        if (!response.ok) throw new Error('Page unavailable');
        markup = await response.text();
        cache.set(url.pathname, markup);
      }
      if (current !== revision) return;
      const next = new DOMParser().parseFromString(markup, 'text/html');
      const selectors = ['.hero', '.divider', 'main', 'footer'];
      if (!selectors.every(s => next.querySelector(s))) throw new Error('Invalid product page');
      // One synchronous update: never hide the current page while awaiting a response.
      for (const selector of selectors) document.querySelector(selector).replaceWith(next.querySelector(selector));
      document.title = next.title;
      document.documentElement.lang = next.documentElement.lang;
      document.querySelector('.product-header').replaceWith(next.querySelector('.product-header'));
      document.querySelector('.skip').replaceWith(next.querySelector('.skip'));
      for (const selector of ['meta[name="description"]', 'link[rel="canonical"]', 'link[rel="alternate"]', 'meta[property^="og:"]', 'script[type="application/ld+json"]']) {
        document.head.querySelectorAll(selector).forEach(node => node.remove());
        next.head.querySelectorAll(selector).forEach(node => document.head.append(node));
      }
      if (push) history.pushState(null, '', url);
      window.scrollTo({top: 0, behavior: 'instant'});
      const target = url.hash ? document.getElementById(url.hash.slice(1)) : document.querySelector('main');
      if (url.hash) target?.scrollIntoView({behavior: 'instant'});
      else { target.setAttribute('tabindex', '-1'); target.focus({preventScroll: true}); }
    } catch {
      if (current === revision) location.assign(url.href);
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (!isProduct(url) || url.hash || url.search) return;
    event.preventDefault();
    if (url.pathname === location.pathname) { ++revision; return; }
    void navigate(url, true);
  });
  window.addEventListener('popstate', () => { if (isProduct(new URL(location.href))) void navigate(new URL(location.href), false); });
})();
