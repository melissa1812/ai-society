/* Birmingham AI Society: display preferences (theme + accessibility). */
(function () {
  "use strict";
  var KEY = "ais-prefs";
  var root = document.documentElement;
  var prefs = load();

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }
  function set(k, v) { if (v === undefined || v === null || v === false || v === "") delete prefs[k]; else prefs[k] = v; save(); apply(); }

  var mq = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  function resolvedTheme() { var t = prefs.theme || "system"; return t === "system" ? (mq && mq.matches ? "light" : "dark") : t; }

  function apply() {
    var t = resolvedTheme();
    root.dataset.theme = t;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "light" ? "#f6f4fb" : "#0a1020";
    var btn = document.getElementById("theme-btn");
    if (btn) btn.setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
    document.dispatchEvent(new CustomEvent("ais:prefs", { detail: prefs }));
  }

  if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (!prefs.theme || prefs.theme === "system") apply(); });

  document.getElementById("theme-btn").addEventListener("click", function () {
    set("theme", resolvedTheme() === "light" ? "dark" : "light");
  });

  window.AISPrefs = { get: function () { return prefs; }, set: set, apply: apply, resolvedTheme: resolvedTheme };
  apply();
})();
