(function () {
  var root = document.documentElement;
  var toggle = document.querySelector("[data-language-toggle]");
  var metadata = {
    en: { title: "Kuiper Belt — Independent software", description: "Kuiper Belt is an independent software business from South Korea, founded by Seonghwan Oh. Explore Subtitle Overlay for Chrome and SpamDog for iPhone.", label: "한국어로 보기" },
    ko: { title: "카이퍼 벨트 — 독립 소프트웨어", description: "오성환이 한국에서 만드는 독립 소프트웨어. Subtitle Overlay 자막 확장과 SpamDog 아이폰 스팸전화 차단 앱을 소개합니다.", label: "View in English" }
  };
  function apply(language) {
    root.lang = language;
    root.dataset.language = language;
    document.title = metadata[language].title;
    document.querySelector('meta[name="description"]').content = metadata[language].description;
    document.querySelector('meta[property="og:title"]').content = metadata[language].title;
    document.querySelector('meta[property="og:description"]').content = metadata[language].description;
    toggle.setAttribute("aria-label", metadata[language].label);
  }
  apply(root.dataset.language === "ko" ? "ko" : "en");
  toggle.addEventListener("click", function () {
    var next = root.dataset.language === "ko" ? "en" : "ko";
    apply(next);
    try { localStorage.setItem("site-language", next); } catch (e) {}
  });
  document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear());
})();
