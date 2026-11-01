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

  function attr(name, val) { if (val) root.setAttribute("data-" + name, val); else root.removeAttribute("data-" + name); }

  function apply() {
    var t = resolvedTheme();
    root.dataset.theme = t;
    attr("font", prefs.font);
    attr("size", prefs.size);
    attr("spacing", prefs.spacing ? "wide" : "");
    attr("contrast", prefs.contrast ? "high" : "");
    attr("calm", prefs.calm ? "on" : "");
    root.style.setProperty("--nl", prefs.night ? String(prefs.nightLevel || 0.28) : "0");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t === "light" ? "#f6f4fb" : "#0a1020";
    var btn = document.getElementById("theme-btn");
    if (btn) btn.setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
    syncPanel();
    document.dispatchEvent(new CustomEvent("ais:prefs", { detail: prefs }));
  }

  if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (!prefs.theme || prefs.theme === "system") apply(); });

  document.getElementById("theme-btn").addEventListener("click", function () {
    set("theme", resolvedTheme() === "light" ? "dark" : "light");
  });

  /* ---------------- Accessibility panel ---------------- */
  var hasTTS = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  var openBtn = document.getElementById("a11y-btn");
  var host = document.getElementById("a11y-root");

  function seg(name, legend, opts) {
    return '<div class="a11y-group"><fieldset class="seg"><legend class="lab">' + legend + "</legend>" + opts.map(function (o, i) {
      var id = "a11y-" + name + "-" + i;
      return '<input type="radio" name="' + name + '" id="' + id + '" value="' + o[0] + '"><label for="' + id + '"' + (o[2] ? ' style="font-family:' + o[2] + '"' : "") + ">" + o[1] + "</label>";
    }).join("") + "</fieldset></div>";
  }
  function toggle(id, label, hint) {
    return '<label class="toggle" for="' + id + '"><span><span class="lab">' + label + "</span>" + (hint ? '<br><span class="note">' + hint + "</span>" : "") + '</span><input type="checkbox" id="' + id + '"><span class="sw" aria-hidden="true"></span></label>';
  }

  host.innerHTML =
    '<div class="a11y-scrim" id="a11y-scrim" hidden></div>' +
    '<div class="a11y" id="a11y" role="dialog" aria-modal="true" aria-labelledby="a11y-title" hidden>' +
      '<div class="a11y-head"><h2 id="a11y-title">Accessibility</h2><button class="icon-btn" type="button" id="a11y-close" aria-label="Close accessibility settings"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      (hasTTS ?
      '<div class="a11y-group"><span class="lab">Read aloud</span><p class="note">Reads the section you are on and highlights each part as it goes.</p>' +
        '<div class="tts-controls"><button class="btn btn-small" type="button" id="tts-start">Read this page</button></div>' +
        '<label class="lab" for="tts-rate">Reading speed</label><input type="range" id="tts-rate" min="0.7" max="1.5" step="0.1">' +
        '<label class="lab" for="tts-voice">Voice</label><select id="tts-voice"><option value="">Default voice</option></select></div>' : "") +
      seg("font", "Reading font", [["", "Standard"], ["lexend", "Easy read", "Lexend, sans-serif"], ["dyslexic", "OpenDyslexic", "OpenDyslexic, sans-serif"]]) +
      seg("size", "Text size", [["", "Default"], ["115", "Larger"], ["130", "Largest"]]) +
      '<div class="a11y-group">' + toggle("a11y-spacing", "Extra spacing", "More room between lines, letters and words") + "</div>" +
      '<div class="a11y-group">' + toggle("a11y-night", "Night light", "A warm filter that is easier on sensitive eyes") +
        '<label class="lab" for="a11y-nl">Warmth</label><input type="range" id="a11y-nl" min="0.1" max="0.55" step="0.05"></div>' +
      '<div class="a11y-group">' + toggle("a11y-contrast", "High contrast", "Solid colours and no gradients behind text") + "</div>" +
      '<div class="a11y-group">' + toggle("a11y-calm", "Reduce motion", "Turns off animations and transitions") + "</div>" +
      '<div class="a11y-group"><button class="btn btn-plain btn-small" type="button" id="a11y-reset">Reset all settings</button><p class="note">Settings are saved in this browser only.</p></div>' +
    "</div>" +
    (hasTTS ? '<div class="tts-bar" id="tts-bar" role="region" aria-label="Read aloud controls" hidden><span id="tts-status">Reading</span><button class="btn btn-small" type="button" id="tts-pause">Pause</button><button class="btn btn-plain btn-small" type="button" id="tts-stop">Stop</button></div>' : "");

  var panel = document.getElementById("a11y"), scrim = document.getElementById("a11y-scrim");
  function q(id) { return document.getElementById(id); }

  function syncPanel() {
    if (!panel) return;
    function check(name, val) { var el = panel.querySelector('input[name="' + name + '"][value="' + (val || "") + '"]'); if (el) el.checked = true; }
    check("font", prefs.font); check("size", prefs.size);
    q("a11y-spacing").checked = !!prefs.spacing;
    q("a11y-night").checked = !!prefs.night;
    q("a11y-nl").value = prefs.nightLevel || 0.28;
    q("a11y-nl").disabled = !prefs.night;
    q("a11y-contrast").checked = !!prefs.contrast;
    q("a11y-calm").checked = !!prefs.calm;
    if (hasTTS) q("tts-rate").value = prefs.rate || 1;
  }

  panel.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "font") set("font", t.value);
    else if (t.name === "size") set("size", t.value);
    else if (t.id === "a11y-spacing") set("spacing", t.checked);
    else if (t.id === "a11y-night") set("night", t.checked);
    else if (t.id === "a11y-contrast") set("contrast", t.checked);
    else if (t.id === "a11y-calm") set("calm", t.checked);
    else if (t.id === "tts-voice") set("voice", t.value);
  });
  panel.addEventListener("input", function (e) {
    if (e.target.id === "a11y-nl") set("nightLevel", Number(e.target.value));
    if (e.target.id === "tts-rate") set("rate", Number(e.target.value));
  });
  q("a11y-reset").addEventListener("click", function () {
    var theme = prefs.theme; prefs = theme ? { theme: theme } : {}; save(); apply();
    var v = q("tts-voice"); if (v) v.value = "";
  });

  /* open / close with focus trap */
  var lastFocus = null;
  function openPanel() {
    lastFocus = document.activeElement;
    panel.hidden = false; scrim.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    q("a11y-close").focus();
  }
  function closePanel() {
    panel.hidden = true; scrim.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  openBtn.addEventListener("click", function () { panel.hidden ? openPanel() : closePanel(); });
  q("a11y-close").addEventListener("click", closePanel);
  scrim.addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (panel.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closePanel(); return; }
    if (e.key !== "Tab") return;
    var f = Array.prototype.filter.call(panel.querySelectorAll("button, input, select"), function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------------- Read aloud ---------------- */
  if (hasTTS) {
    var synth = window.speechSynthesis, queue = [], idx = 0, reading = false, paused = false, currentEl = null;
    var bar = q("tts-bar"), pauseBtn = q("tts-pause"), status = q("tts-status");

    function fillVoices() {
      var sel = q("tts-voice"), voices = synth.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
      var keep = prefs.voice || "";
      sel.innerHTML = '<option value="">Default voice</option>' + voices.map(function (v) {
        return '<option value="' + v.name.replace(/"/g, "&quot;") + '">' + v.name.replace(/</g, "&lt;") + " (" + v.lang + ")</option>";
      }).join("");
      sel.value = keep;
    }
    fillVoices();
    if (synth.addEventListener) synth.addEventListener("voiceschanged", fillVoices);

    function readable() {
      var view = document.querySelector(".view:not([hidden])");
      if (!view) return [];
      return Array.prototype.filter.call(view.querySelectorAll("h1, h2, h3, p, li, .chip, .hl-t, .hl-d, time"), function (el) {
        if (el.closest("form, [hidden], .sr, .seg")) return false;
        if (el.querySelector("p, li")) return false;
        return el.offsetParent !== null && el.textContent.trim().length > 1;
      });
    }
    function mark(el) {
      if (currentEl) currentEl.classList.remove("reading");
      currentEl = el;
      if (el) { el.classList.add("reading"); el.scrollIntoView({ block: "center", behavior: prefs.calm ? "auto" : "smooth" }); }
    }
    function speakNext() {
      if (!reading) return;
      if (idx >= queue.length) { stop(); return; }
      var el = queue[idx], u = new SpeechSynthesisUtterance(el.textContent.replace(/\s+/g, " ").trim());
      u.lang = "en-GB"; u.rate = prefs.rate || 1;
      var v = prefs.voice && synth.getVoices().filter(function (x) { return x.name === prefs.voice; })[0];
      if (v) { u.voice = v; u.lang = v.lang; }
      u.onend = function () { idx++; speakNext(); };
      u.onerror = function (e) { if (e.error !== "interrupted" && e.error !== "canceled") { idx++; speakNext(); } };
      mark(el);
      status.textContent = "Reading " + (idx + 1) + " of " + queue.length;
      synth.speak(u);
    }
    function start() {
      synth.cancel();
      queue = readable(); idx = 0; reading = true; paused = false;
      if (!queue.length) return;
      bar.hidden = false; pauseBtn.textContent = "Pause";
      if (!panel.hidden) closePanel();
      pauseBtn.focus();
      speakNext();
    }
    function stop() {
      reading = false; paused = false; synth.cancel(); mark(null);
      if (!bar.hidden) { bar.hidden = true; openBtn.focus(); }
    }
    q("tts-start").addEventListener("click", start);
    q("tts-stop").addEventListener("click", stop);
    pauseBtn.addEventListener("click", function () {
      if (!reading) return;
      if (paused) { synth.resume(); paused = false; pauseBtn.textContent = "Pause"; status.textContent = "Reading " + (idx + 1) + " of " + queue.length; }
      else { synth.pause(); paused = true; pauseBtn.textContent = "Resume"; status.textContent = "Paused"; }
    });
    document.addEventListener("ais:view", function () { if (reading) stop(); });
    window.addEventListener("pagehide", function () { synth.cancel(); });
  }

  window.AISPrefs = { get: function () { return prefs; }, set: set, apply: apply, resolvedTheme: resolvedTheme };
  apply();
})();
