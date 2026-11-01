/**
 * Birmingham AI Society: website backend (Google Apps Script).
 *
 * Stores sign-ups, anonymous session feedback, attendance and anonymous
 * visit statistics in the Google Sheet this script is attached to, and
 * serves aggregated stats to the committee dashboard (stats.html).
 *
 * Setup: see README.md, section "Backend setup".
 * Script property required: STATS_KEY  (the committee passcode)
 */

var SHEETS = {
  signups:    ["Joined", "Name", "Email", "Year", "Course", "Interest"],
  feedback:   ["Received", "Session ID", "Session", "Liked most", "Could improve", "Thought process", "Enjoyed parts"],
  events:     ["Time", "Visit ID", "Type", "Section", "Seconds", "Device", "Referrer"],
  attendance: ["Recorded", "Session ID", "Session", "Session date", "Attendees", "Notes"]
};

var VIEWS = ["home", "about", "next", "sessions", "ainnovate", "blog", "podcast", "committee", "join"];
var MAX_VIEW_MS = 30 * 60 * 1000;   // ignore anything longer than 30 minutes in one section

/* ------------------------------------------------------------------ */
/* Web app entry points                                                */
/* ------------------------------------------------------------------ */

function doPost(e) {
  var body;
  try { body = JSON.parse((e && e.postData && e.postData.contents) || "{}"); }
  catch (err) { return json({ ok: false, error: "bad_request" }); }

  try {
    switch (body.type) {
      case "signup":     return json(saveSignup(body));
      case "feedback":   return json(saveFeedback(body));
      case "event":      return json(saveEvent(body));
      case "attendance": return json(saveAttendance(body));
      default:           return json({ ok: false, error: "unknown_type" });
    }
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "server_error" });
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === "stats") {
    if (!checkKey(p.key)) return json({ ok: false, error: "wrong_passcode" });
    var data = {
      signups: rows("signups"),
      feedback: rows("feedback"),
      events: rows("events"),
      attendance: rows("attendance")
    };
    var out = aggregate(data, new Date());
    out.ok = true;
    return json(out);
  }
  return json({ ok: true, service: "Birmingham AI Society website backend" });
}

/* ------------------------------------------------------------------ */
/* Writers                                                             */
/* ------------------------------------------------------------------ */

function saveSignup(b) {
  var d = {
    name: clean(b.name, 120),
    email: clean(b.email, 160).toLowerCase(),
    year: clean(b.year, 40),
    course: clean(b.course, 120),
    interest: clean(b.interest, 800)
  };
  if (!d.name || !d.year || !d.course || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) {
    return { ok: false, error: "missing_fields" };
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet("signups");
    var last = sh.getLastRow();
    if (last > 1) {
      var emails = sh.getRange(2, 3, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).toLowerCase() === d.email) return { ok: true, existing: true };
      }
    }
    sh.appendRow([new Date(), d.name, d.email, d.year, d.course, d.interest]);
    return { ok: true, existing: false };
  } finally {
    lock.releaseLock();
  }
}

function saveFeedback(b) {
  var parts = {};
  if (b.parts && typeof b.parts === "object") {
    Object.keys(b.parts).slice(0, 12).forEach(function (k) { parts[clean(k, 160)] = clean(b.parts[k], 20); });
  }
  var row = [new Date(), clean(b.sessionId, 80), clean(b.sessionTitle, 160),
             clean(b.like, 1500), clean(b.improve, 1500), clean(b.process, 1500), JSON.stringify(parts)];
  if (!row[1] || (!row[3] && !row[4] && !row[5] && row[6] === "{}")) return { ok: false, error: "empty" };
  sheet("feedback").appendRow(row);
  return { ok: true };
}

function saveEvent(b) {
  var kind = b.kind === "pageview" ? "pageview" : (b.kind === "view_time" ? "view_time" : "");
  var view = VIEWS.indexOf(b.view) >= 0 ? b.view : "";
  var sid = String(b.sid || "").replace(/[^a-z0-9]/gi, "").slice(0, 32);
  if (!kind || !view || !sid) return { ok: false, error: "bad_event" };
  var ms = kind === "view_time" ? Math.max(0, Math.min(Number(b.ms) || 0, MAX_VIEW_MS)) : 0;
  if (kind === "view_time" && ms < 1000) return { ok: true, skipped: true };
  sheet("events").appendRow([new Date(), sid, kind, view, Math.round(ms / 1000),
    b.device === "mobile" ? "mobile" : "desktop", clean(b.ref, 120)]);
  return { ok: true };
}

function saveAttendance(b) {
  if (!checkKey(b.key)) return { ok: false, error: "wrong_passcode" };
  var count = Math.round(Number(b.count));
  if (!(count >= 0 && count < 5000)) return { ok: false, error: "bad_count" };
  sheet("attendance").appendRow([new Date(), clean(b.sessionId, 80), clean(b.sessionTitle, 160),
    clean(b.date, 20), count, clean(b.notes, 300)]);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Aggregation (pure: no Google services, so it can be tested)         */
/* ------------------------------------------------------------------ */

function aggregate(data, now) {
  var DAY = 86400000;
  function weekStart(d) {
    d = new Date(d); if (isNaN(d)) return "";
    var day = (d.getUTCDay() + 6) % 7;   // Monday = 0
    var m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
    return m.toISOString().slice(0, 10);
  }
  function countBy(list, fn) {
    var m = {};
    list.forEach(function (x) { var k = fn(x); if (k) m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).map(function (k) { return { key: k, count: m[k] }; })
      .sort(function (a, b) { return b.count - a.count || (a.key < b.key ? -1 : 1); });
  }
  function weeks(n) {
    var out = [], start = new Date(weekStart(now));
    for (var i = n - 1; i >= 0; i--) out.push(new Date(start.getTime() - i * 7 * DAY).toISOString().slice(0, 10));
    return out;
  }

  var signups = data.signups || [], events = data.events || [], feedback = data.feedback || [], att = data.attendance || [];

  // members
  var wk = weeks(12);
  var joinedByWeek = {};
  signups.forEach(function (r) { var w = weekStart(r.Joined); joinedByWeek[w] = (joinedByWeek[w] || 0) + 1; });
  var before = signups.filter(function (r) { return weekStart(r.Joined) < wk[0]; }).length;
  var running = before;
  var growth = wk.map(function (w) { running += joinedByWeek[w] || 0; return { week: w, joined: joinedByWeek[w] || 0, total: running }; });

  // visits and time
  var visits = {}, viewTime = {}, viewVisits = {}, devices = {};
  events.forEach(function (r) {
    var sid = r["Visit ID"]; if (!sid) return;
    var v = visits[sid] || (visits[sid] = { first: r.Time, seconds: 0, device: r.Device });
    if (new Date(r.Time) < new Date(v.first)) v.first = r.Time;
    if (r.Type === "view_time") {
      var s = Number(r.Seconds) || 0;
      v.seconds += s;
      viewTime[r.Section] = (viewTime[r.Section] || 0) + s;
      viewVisits[r.Section] = viewVisits[r.Section] || {};
      viewVisits[r.Section][sid] = 1;
    }
  });
  var visitList = Object.keys(visits).map(function (k) { return visits[k]; });
  visitList.forEach(function (v) { devices[v.device || "desktop"] = (devices[v.device || "desktop"] || 0) + 1; });
  var visitsByWeek = {};
  visitList.forEach(function (v) { var w = weekStart(v.first); visitsByWeek[w] = (visitsByWeek[w] || 0) + 1; });
  var timed = visitList.filter(function (v) { return v.seconds > 0; });
  var totalSeconds = timed.reduce(function (a, v) { return a + v.seconds; }, 0);

  var sections = Object.keys(viewTime).map(function (k) {
    var n = Object.keys(viewVisits[k]).length;
    return { section: k, totalSeconds: viewTime[k], visits: n, avgSeconds: n ? Math.round(viewTime[k] / n) : 0 };
  }).sort(function (a, b) { return b.totalSeconds - a.totalSeconds; });

  // attendance, oldest session first
  var attendance = att.map(function (r) {
    return { sessionId: r["Session ID"], session: r.Session, date: dateOnly(r["Session date"]) || dateOnly(r.Recorded), count: Number(r.Attendees) || 0, notes: r.Notes || "" };
  }).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });

  // feedback
  var fbBySession = countBy(feedback, function (r) { return r.Session || r["Session ID"]; });
  var recent = feedback.slice().sort(function (a, b) { return new Date(b.Received) - new Date(a.Received); }).slice(0, 30).map(function (r) {
    var parts = {}; try { parts = JSON.parse(r["Enjoyed parts"] || "{}"); } catch (e) {}
    return { date: dateOnly(r.Received), session: r.Session, like: r["Liked most"], improve: r["Could improve"], process: r["Thought process"], parts: parts };
  });

  return {
    generated: new Date(now).toISOString(),
    members: {
      total: signups.length,
      last7: signups.filter(function (r) { return now - new Date(r.Joined) < 7 * DAY; }).length,
      byYear: countBy(signups, function (r) { return r.Year; }),
      byCourse: countBy(signups, function (r) { return titleCase(r.Course); }).slice(0, 15),
      growth: growth,
      list: signups.map(function (r) { return { joined: dateOnly(r.Joined), name: r.Name, email: r.Email, year: r.Year, course: r.Course, interest: r.Interest }; })
        .sort(function (a, b) { return a.joined < b.joined ? 1 : -1; })
    },
    visits: {
      total: visitList.length,
      last7: visitList.filter(function (v) { return now - new Date(v.first) < 7 * DAY; }).length,
      avgSeconds: timed.length ? Math.round(totalSeconds / timed.length) : 0,
      byWeek: wk.map(function (w) { return { week: w, visits: visitsByWeek[w] || 0 }; }),
      devices: devices,
      sections: sections
    },
    attendance: attendance,
    feedback: { total: feedback.length, bySession: fbBySession, recent: recent }
  };
}

function dateOnly(v) {
  if (!v) return "";
  var d = new Date(v);
  return isNaN(d) ? String(v).slice(0, 10) : d.toISOString().slice(0, 10);
}
function titleCase(s) {
  s = String(s || "").trim().replace(/\s+/g, " ");
  return s ? s.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : "";
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function clean(v, max) {
  // Strip control characters and a leading "=" "+" "-" "@" so text can't become a spreadsheet formula.
  var s = String(v == null ? "" : v).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function checkKey(k) {
  var want = PropertiesService.getScriptProperties().getProperty("STATS_KEY");
  return !!want && typeof k === "string" && k.length === want.length && k === want;
}

function sheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(SHEETS[name]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, SHEETS[name].length).setFontWeight("bold");
  }
  return sh;
}

function rows(name) {
  var sh = sheet(name), values = sh.getDataRange().getValues();
  var head = values.shift() || SHEETS[name];
  return values.map(function (r) {
    var o = {};
    head.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    return o;
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the Apps Script editor to create the four tabs. */
function setup() {
  Object.keys(SHEETS).forEach(sheet);
}
