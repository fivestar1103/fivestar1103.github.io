(function () {
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");
  var themeButton = document.querySelector("[data-theme-toggle]");
  var languageButton = document.querySelector("[data-language-toggle]");
  var text = {
    en: { title: "Seonghwan Oh — Gameplay Programmer", description: "Seonghwan Oh, gameplay programmer at NCSOFT.", language: "한국어로 보기", toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    ko: { title: "오성환 — 클라이언트 프로그래머", description: "NCSOFT 클라이언트 프로그래머 오성환입니다.", language: "View in English", toLight: "라이트 테마로 전환", toDark: "다크 테마로 전환" }
  };

  function dark() { return root.dataset.theme === "dark" || (!root.dataset.theme && system.matches); }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  function render() {
    var t = text[root.dataset.language === "ko" ? "ko" : "en"];
    document.title = t.title;
    document.querySelector('meta[name="description"]').content = t.description;
    languageButton.setAttribute("aria-label", t.language);
    themeButton.setAttribute("aria-label", dark() ? t.toLight : t.toDark);
    document.querySelector('meta[name="theme-color"]').content = dark() ? "#090b0f" : "#eef1f4";
  }

  themeButton.addEventListener("click", function () {
    root.dataset.theme = dark() ? "light" : "dark";
    save("home-theme", root.dataset.theme);
    render();
  });
  languageButton.addEventListener("click", function () {
    var next = root.dataset.language === "ko" ? "en" : "ko";
    root.lang = next;
    root.dataset.language = next;
    save("home-language", next);
    render();
  });
  system.addEventListener("change", render);
  document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear());
  render();

  // Sections: one screen each. On a large screen a section that fits is pinned
  // for a short stretch of scrolling, and every section fades with its distance
  // from the viewport. Native scrolling throughout; nothing is hijacked.
  var chapters = [].slice.call(document.querySelectorAll(".chapter"));
  var shells = chapters.map(function (chapter) { return chapter.querySelector(".shell"); });
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var large = window.matchMedia("(min-width: 900px) and (min-height: 640px)");
  var queued = false, layoutNeeded = true;
  function update() {
    queued = false;
    var h = window.innerHeight, y = window.scrollY;
    if (layoutNeeded) {
      layoutNeeded = false;
      chapters.forEach(function (chapter, i) {
        var pin = !motion.matches && large.matches && i < chapters.length - 1 && shells[i].offsetHeight <= h + 1;
        chapter.toggleAttribute("data-pinned", pin);
      });
    }
    chapters.forEach(function (chapter) {
      var top = chapter.offsetTop;
      var enter = Math.max(0, (top - y) / h);
      var exit = Math.max(0, (y - (top + Math.max(0, chapter.offsetHeight - h))) / h);
      var opacity = motion.matches ? 1 : Math.max(0, 1 - Math.max(enter, exit) * 0.8);
      chapter.style.setProperty("--chapter-opacity", opacity.toFixed(3));
    });
  }
  function schedule() { if (!queued) { queued = true; window.requestAnimationFrame(update); } }
  function layout() { layoutNeeded = true; schedule(); }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", layout, { passive: true });
  window.addEventListener("pageshow", layout);
  motion.addEventListener("change", layout);
  large.addEventListener("change", layout);
  if ("ResizeObserver" in window) { var observer = new ResizeObserver(layout); shells.forEach(function (shell) { observer.observe(shell); }); }
  if (document.fonts) document.fonts.ready.then(layout);
  root.classList.add("sections-ready");
  update();
})();
