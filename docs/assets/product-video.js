/* A silent preview starts only while visible, with explicit pause/play control. */
(() => {
  if (document.documentElement.dataset.videoReady) return;
  document.documentElement.dataset.videoReady = 'true';
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-video-play]');
    if (!button) return;
    const frame = button.closest('.video-frame');
    const video = frame.querySelector('video');
    video.controls = true;
    frame.dataset.started = 'true';
    void video.play().catch(() => { frame.dataset.started = 'false'; video.controls = false; });
  });
  document.addEventListener('play', event => {
    if (!event.target.matches('video[data-video-tour]')) return;
    document.querySelectorAll('video').forEach(video => { if (video !== event.target) video.pause(); });
  }, true);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-video-preview]').forEach(figure => {
    const video = figure.querySelector('video');
    const button = figure.querySelector('[data-video-toggle]');
    let visible = false;
    let userPaused = false;
    let userPlayed = false;
    function hydrate() {
      const source = video.querySelector('source[data-src]');
      if (source && !source.getAttribute('src')) { source.src = source.dataset.src; video.load(); }
    }
    function updateLabel() { button.dataset.videoState = video.paused ? 'paused' : 'playing'; }
    function update() {
      const automatic = !motion.matches && !navigator.connection?.saveData;
      if (!visible || document.hidden || userPaused || (!automatic && !userPlayed)) { video.pause(); return; }
      hydrate();
      void video.play().catch(updateLabel);
    }
    button.addEventListener('click', () => {
      if (!video.paused) { userPaused = true; userPlayed = false; video.pause(); }
      else { userPaused = false; userPlayed = true; hydrate(); void video.play().catch(updateLabel); }
    });
    video.addEventListener('play', updateLabel);
    video.addEventListener('pause', updateLabel);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: .15 }).observe(video);
    }
    // Without the observer, the poster and explicit play button still work.
    updateLabel();
  });
})();
