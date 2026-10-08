/* Runs in <head> before paint. Same storage key and system default as the dashboard. */
(function () {
  var root = document.documentElement;
  var key = "kisdash-theme";
  var system = window.matchMedia("(prefers-color-scheme: dark)");
  try {
    var saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  } catch (e) {}
  function dark() { return root.dataset.theme === "dark" || (!root.dataset.theme && system.matches); }
  function update() {
    var button = document.querySelector("[data-theme-toggle]");
    if (button) {
      var ko = root.lang === "ko";
      button.setAttribute("aria-label", dark() ? (ko ? "라이트 테마로 전환" : "Switch to light theme") : (ko ? "다크 테마로 전환" : "Switch to dark theme"));
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark() ? "#0d1116" : "#f2f4f7";
  }
  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector("[data-theme-toggle]");
    if (button) button.addEventListener("click", function () {
      var next = dark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch (e) {}
      update();
    });
    update();
    new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ["lang"] });
  });
  system.addEventListener("change", update);
})();
