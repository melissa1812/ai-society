/* Birmingham AI Society: sign-ups, feedback and anonymous visit stats.
   Talks to the Google Apps Script web app set as SITE.apiUrl. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var API = S.apiUrl;
  if (!API) return;

  function post(payload) {
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }
  function show(el, text, kind) { el.hidden = false; el.className = "msg " + (kind || ""); el.textContent = text; }
  var esc = window.AIS.esc;

  /* ---------- Join form ---------- */
  function bindJoin(form) {
    var msg = form.querySelector("#j-msg"), btn = form.querySelector("#j-btn");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = function (id) { return form.querySelector("#" + id); };
      var d = { name: f("j-name").value.trim(), email: f("j-email").value.trim(), year: f("j-year").value, course: f("j-course").value.trim(), interest: f("j-learn").value.trim() };
      var bad = [];
      [["j-name", !d.name], ["j-email", !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)], ["j-year", !d.year], ["j-course", !d.course]].forEach(function (c) {
        f(c[0]).setAttribute("aria-invalid", c[1] ? "true" : "false"); if (c[1]) bad.push(c[0]);
      });
      if (bad.length) { show(msg, "Fill in your name, a valid email, your year of study and your course.", "err"); f(bad[0]).focus(); return; }
      if (!f("j-consent").checked) { show(msg, "Tick the box so we know we can email you.", "err"); f("j-consent").focus(); return; }
      btn.disabled = true; btn.textContent = "Joining…";
      post(Object.assign({ type: "signup" }, d)).then(function (r) {
        if (!r.ok) throw new Error(r.error);
        var first = esc(d.name.split(" ")[0]);
        form.innerHTML = '<p class="msg ok" role="status" tabindex="-1">' + (r.existing
          ? "You are already a member, " + first + ". Thanks for coming back."
          : "Welcome to the society, " + first + ". We will be in touch about the next session.") + "</p>";
        form.firstChild.focus();
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Join the society";
        show(msg, "Your sign-up did not go through. Check your connection and try again.", "err");
      });
    });
  }

  /* ---------- Session feedback ---------- */
  function bindFeedback(panel, s) {
    var form = panel.querySelector("form"); if (!form) return;
    var msg = form.querySelector(".msg"), btn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (suffix) { return form.querySelector("#" + CSS.escape(s.id + suffix)).value.trim(); };
      var parts = {};
      (s.parts || []).forEach(function (p, i) { var c = form.querySelector('input[name="part' + i + '"]:checked'); if (c) parts[p] = c.value; });
      var d = { type: "feedback", sessionId: s.id, sessionTitle: s.title, like: v("-like"), improve: v("-imp"), process: v("-proc"), parts: parts };
      if (!d.like && !d.improve && !d.process && !Object.keys(parts).length) { show(msg, "Answer at least one question before sending.", "err"); return; }
      btn.disabled = true; btn.textContent = "Sending…";
      post(d).then(function (r) {
        if (!r.ok) throw new Error(r.error);
        form.innerHTML = '<p class="msg ok" role="status" tabindex="-1">Feedback sent. Thank you, it helps us plan the next session.</p>';
        form.firstChild.focus();
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Send feedback";
        show(msg, "Your feedback did not send. Check your connection and try again.", "err");
      });
    });
  }

  window.AISData = { bindJoin: bindJoin, bindFeedback: bindFeedback, post: post };

  /* Forms rendered before this file loaded need re-rendering with live forms. */
  var cur = window.AIS.current();
  if (cur === "join" || cur === "sessions") window.AIS.rerender();

  /* ---------- Anonymous visit stats ----------
     A random id per browser tab (sessionStorage), no cookies, nothing
     kept between visits. Skipped when the browser asks not to be tracked. */
  var optOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1";
  if (optOut) return;

  var sid;
  try {
    sid = sessionStorage.getItem("ais-sid");
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("ais-sid", sid); }
  } catch (e) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); }
  var device = window.matchMedia && matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop";
  var ref = "";
  try { ref = document.referrer && new URL(document.referrer).host !== location.host ? new URL(document.referrer).host : ""; } catch (e) {}

  function beacon(kind, view, ms) {
    var body = JSON.stringify({ type: "event", kind: kind, view: view, ms: ms || 0, sid: sid, device: device, ref: ref });
    if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: "text/plain;charset=utf-8" }))) return;
    try { fetch(API, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" } }); } catch (e) {}
  }

  beacon("pageview", window.AIS.current());
  document.addEventListener("ais:leave", function (e) { beacon("view_time", e.detail.view, e.detail.ms); });
  document.addEventListener("ais:view", function (e) { if (e.detail.prev) beacon("pageview", e.detail.view); });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { beacon("view_time", window.AIS.current(), Date.now() - window.AIS.since()); }
    window.AIS.resetTimer();
  });
})();
