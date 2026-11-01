/* Committee stats dashboard. Reads aggregated data from the Apps Script backend. */
(function () {
  "use strict";
  var S = window.SITE || {};
  var API = S.apiUrl;
  var KEY_STORE = "ais-stats-key";
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var SECTION = { home: "Home", about: "About", next: "Next session", sessions: "Sessions", ainnovate: "AInnovate", blog: "Blog", podcast: "Podcast", committee: "Committee", join: "Join" };
  var last = null;

  /* ---------- theme toggle (shares the main site's saved preference) ---------- */
  $("#theme-btn").addEventListener("click", function () {
    var t = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = t;
    try { var p = JSON.parse(localStorage.getItem("ais-prefs") || "{}"); p.theme = t; localStorage.setItem("ais-prefs", JSON.stringify(p)); } catch (e) {}
    $("#theme-btn").setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
  });

  /* ---------- formatting ---------- */
  function dur(s) {
    s = Math.round(s || 0);
    if (s < 60) return s + "s";
    var m = Math.floor(s / 60), r = s % 60;
    if (m < 60) return m + "m" + (r ? " " + r + "s" : "");
    return Math.floor(m / 60) + "h " + (m % 60) + "m";
  }
  function day(iso) { if (!iso) return ""; var d = new Date(iso + "T12:00:00"); return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
  function niceMax(v) {
    if (v <= 4) return 4;
    var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return step * p;
  }

  /* ---------- charts (single series: the card title names it, no legend needed) ---------- */
  var W = 640, H = 230, PL = 34, PR = 12, PT = 16, PB = 30;
  function size(w) { W = w; H = w > 600 ? 260 : 230; }
  function axis(max) {
    var out = "", ticks = 4;
    for (var i = 0; i <= ticks; i++) {
      var v = max / ticks * i, y = PT + (H - PT - PB) * (1 - i / ticks);
      out += '<line class="' + (i ? "gl" : "base") + '" x1="' + PL + '" x2="' + (W - PR) + '" y1="' + y + '" y2="' + y + '"/>' +
        '<text x="' + (PL - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + (Number.isInteger(v) ? v : v.toFixed(1)) + "</text>";
    }
    return out;
  }
  function xLabels(data, xAt, every) {
    return data.map(function (d, i) { return i % every === 0 || i === data.length - 1 ? '<text x="' + xAt(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(d.label) + "</text>" : ""; }).join("");
  }
  function columns(data, color, label, w) {
    size(w || 420);
    var max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1])));
    var n = data.length, band = (W - PL - PR) / n, bw = Math.min(28, band * 0.62);
    var xAt = function (i) { return PL + band * i + band / 2; };
    var yAt = function (v) { return PT + (H - PT - PB) * (1 - v / max); };
    var marks = data.map(function (d, i) {
      var x = xAt(i) - bw / 2, y = yAt(d.value), h = H - PB - y, r = Math.min(4, h);
      var path = h > 0 ? '<path class="mark" fill="' + color + '" d="M' + x + "," + (H - PB) + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y + "H" + (x + bw - r) + "Q" + (x + bw) + "," + y + " " + (x + bw) + "," + (y + r) + "V" + (H - PB) + 'Z"/>' : "";
      return '<rect class="hit" tabindex="0" x="' + (xAt(i) - band / 2) + '" y="' + PT + '" width="' + band + '" height="' + (H - PT - PB) + '" data-tip="' + esc(d.tip) + '"/>' + path;
    }).join("");
    var lastI = n - 1, lastD = data[lastI];
    var lastLabel = lastD && lastD.value ? '<text class="val" x="' + xAt(lastI) + '" y="' + (yAt(lastD.value) - 6) + '" text-anchor="middle">' + lastD.value + "</text>" : "";
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(label) + '">' + axis(max) + marks + lastLabel + xLabels(data, xAt, n > 8 ? 2 : 1) + "</svg></div>";
  }
  function line(data, color, label, w) {
    size(w || 420);
    var max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1])));
    var n = data.length, span = W - PL - PR - 20;
    var xAt = function (i) { return PL + 10 + (n > 1 ? span * i / (n - 1) : span / 2); };
    var yAt = function (v) { return PT + (H - PT - PB) * (1 - v / max); };
    var d = data.map(function (p, i) { return (i ? "L" : "M") + xAt(i) + "," + yAt(p.value); }).join("");
    var band = n > 1 ? span / (n - 1) : span;
    var pts = data.map(function (p, i) {
      return '<rect class="hit" tabindex="0" x="' + (xAt(i) - band / 2) + '" y="' + PT + '" width="' + band + '" height="' + (H - PT - PB) + '" data-tip="' + esc(p.tip) + '"/>' +
        '<circle class="mark" cx="' + xAt(i) + '" cy="' + yAt(p.value) + '" r="4" fill="' + color + '" stroke="var(--surface)" stroke-width="2"/>';
    }).join("");
    var L = data[n - 1];
    var lastLabel = L ? '<text class="val" x="' + Math.min(xAt(n - 1), W - PR - 4) + '" y="' + (yAt(L.value) - 10) + '" text-anchor="end">' + L.value + "</text>" : "";
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(label) + '">' + axis(max) +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' + pts + lastLabel + xLabels(data, xAt, n > 8 ? 2 : 1) + "</svg></div>";
  }
  function hbars(rows) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
    return '<div class="hbars">' + rows.map(function (r) {
      return '<div class="hbar"><span>' + esc(r.label) + '</span><div class="track"><div class="fill" style="width:' + (r.value / max * 100).toFixed(1) + '%"></div></div><span class="n">' + r.text + "</span></div>";
    }).join("") + "</div>";
  }
  function emptyNote(t) { return '<p class="muted">' + t + "</p>"; }

  /* ---------- tooltip ---------- */
  var tip = $("#tip");
  function showTip(el) {
    tip.textContent = el.getAttribute("data-tip"); tip.hidden = false;
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth;
    var x = Math.max(8, Math.min(window.innerWidth - tw - 8, r.left + r.width / 2 - tw / 2));
    tip.style.left = x + "px"; tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + "px";
  }
  ["pointerover", "focusin"].forEach(function (ev) { document.addEventListener(ev, function (e) { var t = e.target.closest && e.target.closest("[data-tip]"); if (t) showTip(t); }); });
  ["pointerout", "focusout"].forEach(function (ev) { document.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest("[data-tip]")) tip.hidden = true; }); });
  window.addEventListener("scroll", function () { tip.hidden = true; }, { passive: true });

  /* ---------- render ---------- */
  function render(o) {
    var m = o.members, v = o.visits, att = o.attendance || [], fb = o.feedback;
    var growth = m.growth.map(function (g) { return { label: day(g.week), value: g.total, tip: "Week of " + day(g.week) + ": " + g.total + " members (" + g.joined + " joined)" }; });
    var visits = v.byWeek.map(function (w) { return { label: day(w.week), value: w.visits, tip: "Week of " + day(w.week) + ": " + w.visits + " visits" }; });
    var attPts = att.map(function (a) { return { label: day(a.date), value: a.count, tip: a.session + ", " + day(a.date) + ": " + a.count + " attended" }; });
    var avgAtt = att.length ? Math.round(att.reduce(function (s, a) { return s + a.count; }, 0) / att.length) : 0;
    var dev = v.devices || {}, devTotal = (dev.mobile || 0) + (dev.desktop || 0);

    var sessionOpts = (S.sessions || []).map(function (s) { return '<option value="' + esc(s.id) + '" data-title="' + esc(s.title) + '" data-date="">' + esc(s.title) + "</option>"; }).join("");

    $("#dash").innerHTML = '<div class="dash">' +
      '<div class="kpis">' +
        '<div class="kpi"><span class="l">Members</span><span class="v">' + m.total + '</span><span class="s">' + m.last7 + " joined in the last 7 days</span></div>" +
        '<div class="kpi"><span class="l">Website visits</span><span class="v">' + v.total + '</span><span class="s">' + v.last7 + " in the last 7 days</span></div>" +
        '<div class="kpi"><span class="l">Average time on site</span><span class="v">' + dur(v.avgSeconds) + '</span><span class="s">per visit</span></div>' +
        '<div class="kpi"><span class="l">Average attendance</span><span class="v">' + avgAtt + '</span><span class="s">across ' + att.length + " recorded session" + (att.length === 1 ? "" : "s") + "</span></div>" +
      "</div>" +

      '<div class="grid2">' +
        '<section class="card"><h2>Total members</h2><p class="sub">Last 12 weeks, by week joined</p>' + line(growth, "var(--c1)", "Total members over the last 12 weeks") + "</section>" +
        '<section class="card"><h2>Website visits per week</h2><p class="sub">' + (devTotal ? Math.round((dev.mobile || 0) / devTotal * 100) + "% on phones" : "Last 12 weeks") + "</p>" + columns(visits, "var(--c1)", "Website visits per week") + "</section>" +
      "</div>" +

      '<section class="card"><h2>Where people spend their time</h2><p class="sub">Average time per visit to each section, with total time</p>' +
        (v.sections.length ? hbars(v.sections.map(function (s) { return { label: SECTION[s.section] || s.section, value: s.avgSeconds, text: dur(s.avgSeconds) + " <span>(" + dur(s.totalSeconds) + " total)</span>" }; })) : emptyNote("No visits recorded yet.")) +
      "</section>" +

      '<section class="card"><h2>Session attendance</h2><p class="sub">Headcount per session, oldest first</p>' +
        (attPts.length > 1 ? line(attPts, "var(--c2)", "Attendance per session", window.innerWidth < 700 ? 400 : 900) : attPts.length ? emptyNote("One session recorded: " + esc(att[0].session) + ", " + att[0].count + " attended. The trend appears after the second.") : emptyNote("No attendance recorded yet. Add the first headcount below.")) +
        (att.length ? '<div class="tbl"><table><thead><tr><th>Session</th><th>Date</th><th class="num">Attended</th><th>Notes</th></tr></thead><tbody>' +
          att.slice().reverse().map(function (a) { return "<tr><td>" + esc(a.session) + "</td><td>" + esc(day(a.date)) + '</td><td class="num">' + a.count + "</td><td>" + esc(a.notes) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "") +
        '<form class="att-form" id="att-form" novalidate>' +
          '<div class="field"><label for="att-session">Session</label><select id="att-session">' + sessionOpts + '<option value="__other">Another session</option></select></div>' +
          '<div class="field"><label for="att-date">Session date</label><input id="att-date" type="date"></div>' +
          '<div class="field"><label for="att-count">Attendees</label><input id="att-count" type="number" min="0" max="4999" inputmode="numeric"></div>' +
          '<div class="field full" id="att-other-wrap" hidden><label for="att-other">Session name</label><input id="att-other" type="text" maxlength="160"></div>' +
          '<div class="field full"><label for="att-notes">Notes <span class="opt">(optional)</span></label><input id="att-notes" type="text" maxlength="300"></div>' +
          '<div class="msg full" id="att-msg" role="status" hidden></div>' +
          '<div class="full"><button class="btn btn-small" type="submit">Add attendance</button></div>' +
        "</form>" +
      "</section>" +

      '<div class="grid2">' +
        '<section class="card"><h2>Members by year of study</h2>' + (m.byYear.length ? hbars(m.byYear.map(function (r) { return { label: r.key, value: r.count, text: String(r.count) }; })) : emptyNote("No members yet.")) + "</section>" +
        '<section class="card"><h2>Top courses</h2>' + (m.byCourse.length ? hbars(m.byCourse.map(function (r) { return { label: r.key, value: r.count, text: String(r.count) }; })) : emptyNote("No members yet.")) + "</section>" +
      "</div>" +

      '<section class="card"><h2>Session feedback</h2><p class="sub">' + fb.total + " anonymous response" + (fb.total === 1 ? "" : "s") + (fb.bySession.length ? ": " + fb.bySession.map(function (s) { return esc(s.key) + " (" + s.count + ")"; }).join(", ") : "") + "</p>" +
        (fb.recent.length ? '<div class="quotes">' + fb.recent.map(function (f) {
          var lines = [];
          if (f.like) lines.push("<span><b>Liked:</b> " + esc(f.like) + "</span>");
          if (f.improve) lines.push("<span><b>Improve:</b> " + esc(f.improve) + "</span>");
          if (f.process) lines.push("<span><b>Thought process:</b> " + esc(f.process) + "</span>");
          var parts = Object.keys(f.parts || {}).map(function (k) { return esc(k) + ": " + esc(f.parts[k]); });
          if (parts.length) lines.push("<span><b>Enjoyed:</b> " + parts.join("; ") + "</span>");
          return '<div class="quote"><span class="m">' + esc(f.session) + ", " + esc(day(f.date)) + "</span>" + lines.join("") + "</div>";
        }).join("") + "</div>" : emptyNote("No feedback yet.")) +
      "</section>" +

      '<section class="card"><h2>Members</h2><p class="sub">Newest first. The full list, with what each person wants to learn, is in the CSV.</p>' +
        (m.list.length ? '<div class="tbl"><table><thead><tr><th>Name</th><th>Email</th><th>Year</th><th>Course</th><th>Joined</th></tr></thead><tbody>' +
          m.list.slice(0, 25).map(function (r) { return "<tr><td>" + esc(r.name) + "</td><td>" + esc(r.email) + "</td><td>" + esc(r.year) + "</td><td>" + esc(r.course) + "</td><td>" + esc(day(r.joined)) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
          '<div><button class="btn btn-plain btn-small" type="button" id="csv">Download members (CSV)</button></div>' : emptyNote("No members yet.")) +
      "</section>" +
      '<p class="legend-note">Updated ' + new Date(o.generated).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) + ". Visit stats exclude browsers that ask not to be tracked.</p>" +
    "</div>";

    bindDash(o);
  }

  function bindDash(o) {
    var csv = $("#csv");
    if (csv) csv.addEventListener("click", function () {
      var q = function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; };
      var rows = [["Name", "Email", "Year", "Course", "Wants to learn", "Joined"]].concat(o.members.list.map(function (r) { return [r.name, r.email, r.year, r.course, r.interest, r.joined]; }));
      var blob = new Blob(["﻿" + rows.map(function (r) { return r.map(q).join(","); }).join("\r\n")], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ai-society-members.csv";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });

    var form = $("#att-form"), sel = $("#att-session"), other = $("#att-other-wrap"), msg = $("#att-msg");
    sel.addEventListener("change", function () { other.hidden = sel.value !== "__other"; });
    other.hidden = sel.value !== "__other";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isOther = sel.value === "__other";
      var title = isOther ? $("#att-other").value.trim() : sel.options[sel.selectedIndex].dataset.title;
      var id = isOther ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : sel.value;
      var count = $("#att-count").value, date = $("#att-date").value;
      function err(t) { msg.hidden = false; msg.className = "msg full err"; msg.textContent = t; }
      if (!title) return err("Type the session name.");
      if (!date) return err("Pick the date the session ran.");
      if (count === "" || Number(count) < 0) return err("Enter how many people attended.");
      var btn = form.querySelector("button"); btn.disabled = true;
      fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ type: "attendance", key: key(), sessionId: id, sessionTitle: title, date: date, count: Number(count), notes: $("#att-notes").value.trim() }) })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.error === "wrong_passcode" ? "The passcode was rejected. Lock and sign in again." : "That headcount was not saved.");
          load();
        })
        .catch(function (x) { btn.disabled = false; err(x.message || "That headcount was not saved. Check your connection and try again."); });
    });
  }

  /* ---------- auth + loading ---------- */
  function key() { try { return sessionStorage.getItem(KEY_STORE) || ""; } catch (e) { return ""; } }
  function setKey(k) { try { if (k) sessionStorage.setItem(KEY_STORE, k); else sessionStorage.removeItem(KEY_STORE); } catch (e) {} }

  function load() {
    var gateMsg = $("#gate-msg");
    return fetch(API + (API.indexOf("?") < 0 ? "?" : "&") + "action=stats&key=" + encodeURIComponent(key()))
      .then(function (r) { return r.json(); })
      .then(function (o) {
        if (!o.ok) {
          setKey(""); showGate();
          gateMsg.hidden = false; gateMsg.className = "msg err";
          gateMsg.textContent = o.error === "wrong_passcode" ? "That passcode is not right. Check it with the committee." : "The stats could not load.";
          return;
        }
        last = o;
        $("#gate").hidden = true; $("#dash").hidden = false; $("#refresh").hidden = false; $("#signout").hidden = false;
        render(o);
      })
      .catch(function () {
        showGate(); gateMsg.hidden = false; gateMsg.className = "msg err";
        gateMsg.textContent = "The stats could not load. Check your connection and try again.";
      });
  }
  function showGate() { $("#gate").hidden = false; $("#dash").hidden = true; $("#refresh").hidden = true; $("#signout").hidden = true; }

  if (!API) {
    $("#gate").innerHTML = '<div class="empty"><strong>The backend is not connected yet</strong>Follow "Backend setup" in the README, then paste the web app URL into assets/js/content.js as apiUrl.</div>';
    return;
  }
  $("#gate").addEventListener("submit", function (e) {
    e.preventDefault();
    var k = $("#key").value.trim();
    if (!k) { $("#gate-msg").hidden = false; $("#gate-msg").className = "msg err"; $("#gate-msg").textContent = "Enter the committee passcode."; return; }
    setKey(k); $("#gate-btn").disabled = true;
    load().then(function () { $("#gate-btn").disabled = false; });
  });
  $("#refresh").addEventListener("click", load);
  $("#signout").addEventListener("click", function () { setKey(""); last = null; $("#key").value = ""; $("#dash").innerHTML = ""; showGate(); $("#key").focus(); });
  if (key()) load();
})();
