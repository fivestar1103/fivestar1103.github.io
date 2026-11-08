/* A faint Delaunay mesh for the page background.
   Seeded points (some in loose clusters, some scattered) are triangulated once
   with Bowyer–Watson. Only short edges are drawn, fading out with length, so the
   mesh reads as a few quiet constellations. home.js calls homeMesh.draw(offset)
   on scroll.

   The one warm point: two small sparks walk the edges, lighting the edge they
   travel, and on a mouse the edges near the pointer warm slightly. Reduced
   motion turns the sparks off and draws only on scroll. */
(function () {
  var canvas = document.querySelector(".mesh");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var root = document.documentElement;
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var points = [], buckets = [], neighbours = [], sparks = [];
  var width = 0, height = 0, fieldHeight = 0, offset = 0, pointer = null;
  var rgb = "52, 66, 84", warm = "207, 109, 52";
  var BUCKETS = 6, NEAR = 70, FAR = 190, LINE = 0.17, NODE = 0.26;
  var SPARKS = 2, SPEED = 46, GLOW = 150;
  var pick = Math.random;

  function random(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function circle(a, b, c) {
    var d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
    if (Math.abs(d) < 1e-9) return { x: 0, y: 0, r: Infinity };
    var a2 = a.x * a.x + a.y * a.y, b2 = b.x * b.x + b.y * b.y, c2 = c.x * c.x + c.y * c.y;
    var x = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
    var y = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
    return { x: x, y: y, r: (a.x - x) * (a.x - x) + (a.y - y) * (a.y - y) };
  }

  // Bowyer–Watson. Returns unique edges as index pairs.
  function triangulate(pts) {
    var n = pts.length, size = Math.max(width, fieldHeight) * 20, cx = width / 2, cy = fieldHeight / 2;
    var all = pts.concat([{ x: cx - size, y: cy - size }, { x: cx, y: cy + size }, { x: cx + size, y: cy - size }]);
    function tri(a, b, c) { var o = circle(all[a], all[b], all[c]); return { a: a, b: b, c: c, x: o.x, y: o.y, r: o.r }; }
    var tris = [tri(n, n + 1, n + 2)];
    for (var i = 0; i < n; i++) {
      var p = all[i], keep = [], open = {};
      for (var k = 0; k < tris.length; k++) {
        var t = tris[k], dx = p.x - t.x, dy = p.y - t.y;
        if (dx * dx + dy * dy < t.r) {
          [[t.a, t.b], [t.b, t.c], [t.c, t.a]].forEach(function (e) {
            var key = Math.min(e[0], e[1]) + "," + Math.max(e[0], e[1]);
            if (open[key]) delete open[key]; else open[key] = e;
          });
        } else keep.push(t);
      }
      Object.keys(open).forEach(function (key) { keep.push(tri(open[key][0], open[key][1], i)); });
      tris = keep;
    }
    var seen = {}, edges = [];
    tris.forEach(function (t) {
      if (t.a >= n || t.b >= n || t.c >= n) return;
      [[t.a, t.b], [t.b, t.c], [t.c, t.a]].forEach(function (e) {
        var u = Math.min(e[0], e[1]), v = Math.max(e[0], e[1]), key = u + "," + v;
        if (!seen[key]) { seen[key] = true; edges.push([u, v]); }
      });
    });
    return edges;
  }

  function build() {
    var next = random(1103), count = Math.max(40, Math.min(260, Math.round(width * fieldHeight / 26000)));
    var centres = [], clusters = Math.max(3, Math.round(count / 18));
    for (var c = 0; c < clusters; c++) centres.push({ x: next() * width, y: next() * fieldHeight });
    points = [];
    for (var tries = 0; points.length < count && tries < count * 20; tries++) {
      var p;
      if (next() < 0.65) {
        var centre = centres[Math.floor(next() * clusters)], angle = next() * Math.PI * 2;
        var radius = Math.sqrt(-2 * Math.log(next() + 1e-9)) * 110;   // Gaussian spread
        p = { x: centre.x + Math.cos(angle) * radius, y: centre.y + Math.sin(angle) * radius };
      } else p = { x: next() * width, y: next() * fieldHeight };
      if (p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > fieldHeight + 40) continue;
      if (points.some(function (q) { return (q.x - p.x) * (q.x - p.x) + (q.y - p.y) * (q.y - p.y) < 22 * 22; })) continue;
      points.push(p);
    }
    buckets = []; neighbours = points.map(function () { return []; });
    for (var b = 0; b < BUCKETS; b++) buckets.push([]);
    triangulate(points).forEach(function (e) {
      var a = points[e[0]], z = points[e[1]], length = Math.hypot(a.x - z.x, a.y - z.y);
      var fade = 1 - Math.min(1, Math.max(0, (length - NEAR) / (FAR - NEAR)));
      if (fade <= 0.04) return;
      buckets[Math.min(BUCKETS - 1, Math.floor(fade * BUCKETS))].push(e);
      neighbours[e[0]].push(e[1]); neighbours[e[1]].push(e[0]);
    });
    sparks = [];
  }

  // Sparks start on the visible, emptier right side and walk without turning back.
  function spawn() {
    var lo = offset + height * 0.12, hi = offset + height * 0.88, choices = [];
    points.forEach(function (p, i) { if (p.y > lo && p.y < hi && p.x > width * 0.45 && neighbours[i].length) choices.push(i); });
    if (!choices.length) points.forEach(function (p, i) { if (p.y > lo && p.y < hi && neighbours[i].length) choices.push(i); });
    if (!choices.length) return null;
    var a = choices[Math.floor(pick() * choices.length)];
    return { from: a, to: neighbours[a][Math.floor(pick() * neighbours[a].length)], t: 0 };
  }
  function step(dt) {
    while (sparks.length < SPARKS) { var s = spawn(); if (!s) break; sparks.push(s); }
    sparks = sparks.filter(function (s) {
      var a = points[s.from], z = points[s.to];
      s.t += SPEED * dt / Math.max(1, Math.hypot(a.x - z.x, a.y - z.y));
      while (s.t >= 1) {
        var options = neighbours[s.to].filter(function (n) { return n !== s.from; });
        if (!options.length) options = neighbours[s.to];
        s.t -= 1; s.from = s.to; s.to = options[Math.floor(pick() * options.length)];
      }
      var y = points[s.from].y;
      return y > offset - 40 && y < offset + height + 40;     // left the screen: respawn next frame
    });
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dpr = canvas.width / Math.max(1, width);
    ctx.setTransform(dpr, 0, 0, dpr, 0, -offset * dpr);
    ctx.lineWidth = 0.8;
    var top = offset - 30, bottom = offset + height + 30;
    buckets.forEach(function (edges, b) {
      ctx.strokeStyle = "rgba(" + rgb + "," + (LINE * (b + 1) / BUCKETS).toFixed(3) + ")";
      ctx.beginPath();
      edges.forEach(function (e) {
        var a = points[e[0]], z = points[e[1]];
        if (Math.max(a.y, z.y) < top || Math.min(a.y, z.y) > bottom) return;
        ctx.moveTo(a.x, a.y); ctx.lineTo(z.x, z.y);
      });
      ctx.stroke();
    });
    ctx.fillStyle = "rgba(" + rgb + "," + NODE + ")";
    ctx.beginPath();
    points.forEach(function (p) {
      if (p.y < top || p.y > bottom) return;
      ctx.moveTo(p.x + 1.1, p.y); ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
    });
    ctx.fill();

    if (pointer) {                                   // edges near the mouse warm a little
      var px = pointer.x, py = pointer.y + offset;
      buckets.forEach(function (edges, b) {
        edges.forEach(function (e) {
          var a = points[e[0]], z = points[e[1]], d = Math.hypot((a.x + z.x) / 2 - px, (a.y + z.y) / 2 - py);
          if (d >= GLOW) return;
          var k = 1 - d / GLOW;
          ctx.strokeStyle = "rgba(" + warm + "," + (0.34 * k * k * (b + 1) / BUCKETS).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(z.x, z.y); ctx.stroke();
        });
      });
    }

    sparks.forEach(function (s) {                     // the travelling points
      var a = points[s.from], z = points[s.to], x = a.x + (z.x - a.x) * s.t, y = a.y + (z.y - a.y) * s.t;
      var trail = ctx.createLinearGradient(a.x, a.y, x, y);
      trail.addColorStop(0, "rgba(" + warm + ",0)");
      trail.addColorStop(1, "rgba(" + warm + ",0.5)");
      ctx.strokeStyle = trail; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke();
      var halo = ctx.createRadialGradient(x, y, 0, x, y, 9);
      halo.addColorStop(0, "rgba(" + warm + ",0.28)");
      halo.addColorStop(1, "rgba(" + warm + ",0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(" + warm + ",0.9)"; ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    });
  }

  function colour() {
    var style = getComputedStyle(root);
    rgb = (style.getPropertyValue("--mesh") || "52, 66, 84").trim();
    warm = (style.getPropertyValue("--spark-rgb") || "207, 109, 52").trim();
  }

  function resize() {
    var w = window.innerWidth, h = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    var field = h + Math.max(0, root.scrollHeight - h) * 0.33 + 80;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var rebuild = w !== width || field > fieldHeight;   // ignore small height changes from mobile toolbars
    width = w; height = h;
    if (rebuild) { fieldHeight = field; build(); }
    render();
  }

  // Animation runs only for the sparks, only while the tab is visible.
  var frame = 0, last = 0, queued = false;
  function loop(now) {
    frame = 0;
    if (motion.matches || document.hidden) return;
    step(Math.min(0.05, last ? (now - last) / 1000 : 0));
    last = now;
    render();
    frame = window.requestAnimationFrame(loop);
  }
  function start() { if (!frame && !motion.matches && !document.hidden) { last = 0; frame = window.requestAnimationFrame(loop); } }
  function redraw() {                                  // when the loop is not running
    if (frame || queued) return;
    queued = true;
    window.requestAnimationFrame(function () { queued = false; render(); });
  }

  var timer = 0;
  window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(resize, 120); }, { passive: true });
  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    pointer = { x: e.clientX, y: e.clientY }; redraw();
  }, { passive: true });
  document.addEventListener("mouseout", function (e) { if (!e.relatedTarget) { pointer = null; redraw(); } });
  document.addEventListener("visibilitychange", start);
  motion.addEventListener("change", function () { if (motion.matches) sparks = []; start(); redraw(); });
  new MutationObserver(function () { colour(); redraw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { colour(); redraw(); });
  colour();
  resize();
  window.homeMesh = { draw: function (y) { offset = y; if (!frame) render(); } };
  start();
})();
