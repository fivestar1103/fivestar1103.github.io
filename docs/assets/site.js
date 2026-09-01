(function () {
  var root = document.documentElement;
  var toggle = document.querySelector("[data-language-toggle]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  var description = document.querySelector('meta[name="description"]');

  var metadata = {
    en: {
      title: "Seonghwan Oh — Gameplay Programmer",
      description: "Seonghwan Oh writes client code for a console AAA game at NCSOFT, and builds browser extensions, iOS apps, and developer tools on the side.",
      toggleLabel: "한국어로 보기"
    },
    ko: {
      title: "오성환 — 클라이언트 프로그래머",
      description: "NCSOFT에서 콘솔 AAA 게임 클라이언트를 만들고, 브라우저 확장과 iOS 앱, 개발 도구를 따로 만듭니다.",
      toggleLabel: "View in English"
    }
  };

  // The <head> script already picked a language and stamped it before first
  // paint. This only keeps the metadata and the toggle label in step.
  function applyMetadata(language) {
    document.title = metadata[language].title;
    if (description) {
      description.setAttribute("content", metadata[language].description);
    }
    if (toggle) {
      toggle.setAttribute("aria-label", metadata[language].toggleLabel);
    }
  }

  function currentLanguage() {
    return root.dataset.language === "ko" ? "ko" : "en";
  }

  function setLanguage(language) {
    var next = language === "ko" ? "ko" : "en";
    root.dataset.language = next;
    root.lang = next;
    applyMetadata(next);

    try {
      localStorage.setItem("site-language", next);
    } catch (e) {
      // The toggle still works for this visit without storage.
    }
  }

  applyMetadata(currentLanguage());

  // The two languages set different line counts, so swapping them reflows the
  // page under the reader's eyes. A brief blur covers the reflow: instead of
  // two blocks of text trading places, it reads as one block changing shape.
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  if (toggle) {
    var main = document.getElementById("main");
    var swapping = false;

    toggle.addEventListener("click", function () {
      var next = currentLanguage() === "en" ? "ko" : "en";

      if (!main || swapping || (prefersReducedMotion && prefersReducedMotion.matches)) {
        setLanguage(next);
        return;
      }

      swapping = true;
      main.classList.add("kb-swap-target", "kb-swapping");

      window.setTimeout(function () {
        setLanguage(next);
        main.classList.remove("kb-swapping");
        window.setTimeout(function () {
          main.classList.remove("kb-swap-target");
          swapping = false;
        }, 150);
      }, 140);
    });
  }

  // On narrow screens the nav collapses into a panel. Without this it simply
  // vanished and there was no way to reach a section from a phone.
  if (navToggle && nav) {
    var closeNav = function () {
      nav.removeAttribute("data-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      if (open) {
        closeNav();
      } else {
        nav.setAttribute("data-open", "true");
        navToggle.setAttribute("aria-expanded", "true");
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.getAttribute("data-open") === "true") {
        closeNav();
        navToggle.focus();
      }
    });
  }

  var year = document.querySelector("[data-current-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
