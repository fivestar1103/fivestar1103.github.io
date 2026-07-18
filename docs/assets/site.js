(function () {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-language-toggle]");
  const description = document.querySelector('meta[name="description"]');
  const metadata = {
    en: {
      title: "Seonghwan Oh — Gameplay Programmer & Independent Builder",
      description: "Seonghwan Oh is a gameplay programmer at NCSOFT, independent product builder, and open-source contributor in Seoul.",
      toggleLabel: "한국어로 보기"
    },
    ko: {
      title: "오성환 — 클라이언트 프로그래머 & 인디 빌더",
      description: "NCSOFT 클라이언트 프로그래머이자 독립 제품 개발자, 오픈소스 기여자 오성환의 포트폴리오입니다.",
      toggleLabel: "View in English"
    }
  };

  function setLanguage(language, persist) {
    const next = language === "ko" ? "ko" : "en";
    root.dataset.language = next;
    root.lang = next;
    document.title = metadata[next].title;
    description.setAttribute("content", metadata[next].description);
    toggle.setAttribute("aria-label", metadata[next].toggleLabel);

    document.querySelectorAll(".copy-en, .copy-ko").forEach(function (element) {
      element.setAttribute("aria-hidden", element.classList.contains("copy-" + next) ? "false" : "true");
    });

    if (persist) {
      try {
        localStorage.setItem("site-language", next);
      } catch (_) {
        // Language still works when browser storage is unavailable.
      }
    }
  }

  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem("site-language");
  } catch (_) {
    // Fall back to the browser language.
  }

  const browserLanguage = navigator.language && navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
  setLanguage(savedLanguage || browserLanguage, false);

  toggle.addEventListener("click", function () {
    setLanguage(root.dataset.language === "en" ? "ko" : "en", true);
  });

  const year = document.querySelector("[data-current-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
