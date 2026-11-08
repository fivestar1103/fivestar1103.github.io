(function () {
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");
  var themeButton = document.querySelector("[data-theme-toggle]");
  var languageButton = document.querySelector("[data-language-toggle]");
  var text = {
    en: { title: "Seonghwan Oh — Gameplay & Animations Programmer", description: "Seonghwan Oh, Gameplay & Animations Programmer at NCSOFT.", language: "한국어로 보기", toLight: "Switch to light theme", toDark: "Switch to dark theme" },
    ko: { title: "오성환 — 게임플레이·애니메이션 프로그래머", description: "NCSOFT 게임플레이·애니메이션 프로그래머 오성환입니다.", language: "View in English", toLight: "라이트 테마로 전환", toDark: "다크 테마로 전환" }
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

  // Sections: one screen each, at the page's natural length. Content moves at a
  // changing speed instead: about 0.4x of the scroll while a section is centred,
  // about 2x between sections, so each one settles and the next arrives quickly.
  // Native scrolling throughout; nothing is pinned or hijacked.
  var chapters = [].slice.call(document.querySelectorAll(".chapter"));
  var shells = chapters.map(function (chapter) { return chapter.querySelector(".shell"); });
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var queued = false;
  function update() {
    queued = false;
    var h = window.innerHeight, y = window.scrollY;
    if (window.homeMesh) window.homeMesh.draw(motion.matches ? 0 : y * 0.33);
    chapters.forEach(function (chapter, i) {
      var shell = shells[i];
      if (motion.matches || shell.offsetHeight > h + 1) {
        shell.style.transform = "";
        chapter.style.setProperty("--chapter-opacity", "1");
        return;
      }
      var p = (y - chapter.offsetTop) / h;           // 0 when the section fills the screen
      var q = Math.max(-1, Math.min(1, p));
      var seen = q - 0.6 * q * (1 - q * q);           // eased position: slow near 0, fast near ±1
      shell.style.transform = "translate3d(0," + ((p - (Math.abs(p) > 1 ? p : seen)) * h).toFixed(1) + "px,0)";
      chapter.style.setProperty("--chapter-opacity", Math.max(0, 1 - Math.abs(seen) * 1.25).toFixed(3));
    });
  }
  function schedule() { if (!queued) { queued = true; window.requestAnimationFrame(update); } }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule);
  motion.addEventListener("change", schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
  root.classList.add("sections-ready");
  update();
})();
