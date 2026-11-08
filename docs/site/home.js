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
})();
