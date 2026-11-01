/* Birmingham AI Society: views, navigation and rendering.
   Content comes from content.js (window.SITE). */
(function () {
  "use strict";
  var S = window.SITE || {};
  var SOON = "Committee will insert content shortly.";

  var VIEWS = [
    { id: "home", label: "Home", title: "Birmingham AI Society" },
    { id: "about", label: "About", title: "About us" },
    { id: "next", label: "Next session", title: "Next session" },
    { id: "sessions", label: "Sessions", title: "Our sessions" },
    { id: "ainnovate", label: "AInnovate", title: "AInnovate" },
    { id: "blog", label: "Blog", title: "Blog" },
    { id: "podcast", label: "Podcast", title: "Podcast" },
    { id: "committee", label: "Committee", title: "Committee" },
    { id: "join", label: "Join", title: "Join the society", mobileOnly: true }
  ];

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function paras(t) { return String(t || "").split("\n").filter(Boolean).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join(""); }
  function safeUrl(u) { u = String(u || ""); return /^(https?:\/\/|assets\/|\.\/|#)/i.test(u) ? u : ""; }
  function longDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  function initials(n) { return String(n || "?").split(/\s+/).map(function (w) { return w[0] || ""; }).slice(0, 2).join("").toUpperCase(); }
  var ICON = {
    date: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    time: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    room: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };
  function chip(kind, text, label) {
    return text ? '<span class="chip">' + ICON[kind] + '<span class="sr">' + label + ": </span>" + esc(text) + "</span>" : "";
  }
  function chips(o) { return '<div class="chips">' + chip("date", o.date, "Date") + chip("time", o.time, "Time") + chip("room", o.room, "Room") + "</div>"; }
  function empty(title) { return '<div class="empty"><strong>' + esc(title || "Coming soon") + "</strong>" + SOON + "</div>"; }
  function vh(id, title, lede) {
    return '<header class="vh"><div class="vh-ring" aria-hidden="true"></div><h1 class="vh-title" id="h-' + id + '" tabindex="-1">' + esc(title) + "</h1>" + (lede ? '<p class="vh-lede">' + esc(lede) + "</p>" : "") + "</header>";
  }
  function dataReady() { return !!(S.apiUrl && window.AISData); }

  /* ---------- views ---------- */
  var R = {};

  R.home = function () {
    var n = S.next;
    var nextCard = n
      ? '<div class="ring next-card"><p class="tag">Up next</p><h2 class="h2">' + esc(n.title) + "</h2>" + chips(n) + '<p class="muted">' + esc(n.brief) + '</p><div class="row-btns"><a class="btn btn-small" href="#next">Session details</a></div></div>'
      : '<div class="ring next-card"><p class="tag">Up next</p><h2 class="h2">Next session</h2><p class="muted">' + SOON + '</p><div class="row-btns"><a class="btn btn-small" href="#join">Join to hear first</a></div></div>';
    var links = [
      ["ainnovate", "AInnovate", "Our award for purposeful, ethical AI solutions"],
      ["sessions", "Sessions", "Briefs, material and anonymous feedback"],
      ["podcast", "Podcast", "Conversations with our guest speakers"],
      ["blog", "Blog", "Weekly AI news and society updates"]
    ].map(function (l) {
      return '<a href="#' + l[0] + '"><span class="hl-t">' + l[1] + '</span><span class="hl-dot" aria-hidden="true"></span><span class="hl-d">' + l[2] + "</span></a>";
    }).join("");
    return '<div class="wrap">' +
      '<div class="hero"><div>' +
        '<h1 class="vh-title hero-title" id="h-home" tabindex="-1"><span class="grad">AI</span> Society</h1>' +
        '<p class="tagline">With great power comes great responsibility</p>' +
        '<p class="hero-sub">' + esc(S.about && S.about.intro) + "</p>" +
        '<div class="row-btns"><a class="btn" href="#join">Join the society</a><a class="btn btn-ghost" href="#about">Who we are</a></div>' +
      '</div><div class="logo-ring"><img src="assets/img/logo.jpg" width="640" height="640" alt="University of Birmingham AI Society logo: a brain split into a pink organic half and a blue circuit half, with a light bulb between them"></div></div>' +
      '<div class="home-grid">' + nextCard + '<nav class="home-links" aria-label="Explore">' + links + "</nav></div>" +
    "</div>";
  };

  R.about = function () {
    var a = S.about || {};
    function col(t, b) { return "<div><h2 class=\"h3\">" + t + "</h2>" + (b ? "<p>" + esc(b) + "</p>" : '<p class="muted">' + SOON + "</p>") + "</div>"; }
    return '<div class="wrap stack-l">' + vh("about", "About us", a.intro) +
      '<div class="about-cols">' + col("Who we are", a.who) + col("Our vision", a.vision) + col("Our aspirations", a.aspirations) + "</div>" +
      '<div class="story"><h2 class="serif">How and why we started</h2><div class="prose muted">' + (a.story ? paras(a.story) : "<p>" + SOON + "</p>") + "</div></div>" +
    "</div>";
  };

  R.next = function () {
    var n = S.next;
    var body = n
      ? '<div class="ring stack"><h2 class="h2" style="font-size:clamp(1.4rem,3.4vw,2.2rem)">' + esc(n.title) + "</h2>" + chips(n) + '<div class="prose">' + paras(n.brief) + '</div><div class="row-btns"><a class="btn" href="#join">Join the society</a></div></div>'
      : empty("Next session to be announced");
    return '<div class="wrap">' + vh("next", "Next session", "Date, time, room and what we will cover.") + body + "</div>";
  };

  R.sessions = function () {
    var list = (S.sessions || []).map(function (s) {
      var mats = (s.materials || []).filter(function (m) { return safeUrl(m.url); });
      return '<article class="session" data-session="' + esc(s.id) + '">' +
        "<div><h2 class=\"h2\">" + esc(s.title) + "</h2>" + chips(s) + "</div>" +
        "<div>" + '<div class="prose">' + paras(s.brief) + "</div>" +
          (s.points && s.points.length ? '<ul class="points">' + s.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
          '<div class="mat"><h3 class="h3">Session material</h3>' + (mats.length
            ? '<div class="mat-list">' + mats.map(function (m) { return '<a href="' + esc(safeUrl(m.url)) + '" target="_blank" rel="noopener">' + esc(m.label) + "</a>"; }).join("") + "</div>"
            : '<p class="muted">' + SOON + "</p>") + "</div>" +
          '<div class="fb-wrap"><button class="btn btn-ghost btn-small fb-toggle" type="button" aria-expanded="false" aria-controls="fb-' + esc(s.id) + '">Give anonymous feedback</button><div class="fb" id="fb-' + esc(s.id) + '" hidden></div></div>' +
        "</div></article>";
    }).join("");
    return '<div class="wrap">' + vh("sessions", "Our sessions", "A short brief of each session, the material we share, and an anonymous way to tell us what you thought.") + (list || empty("No sessions yet")) + "</div>";
  };

  R.ainnovate = function () {
    var A = S.ainnovate || {};
    function list(arr, cls, fn) { return arr && arr.length ? "<" + (cls === "timeline" ? "ol" : "ul") + ' class="' + cls + '">' + arr.map(fn).join("") + "</" + (cls === "timeline" ? "ol" : "ul") + ">" : '<p class="muted">' + SOON + "</p>"; }
    var enter = safeUrl(A.enterUrl) ? '<a class="btn" href="' + esc(safeUrl(A.enterUrl)) + '" target="_blank" rel="noopener">Enter AInnovate</a>' : '<a class="btn" href="#join">Join to take part</a>';
    var sponsors = (A.sponsors || []).length
      ? '<div class="sponsor-logos">' + A.sponsors.map(function (s) { var img = s.logo ? '<img src="' + esc(safeUrl(s.logo)) + '" alt="' + esc(s.name) + '">' : esc(s.name); return safeUrl(s.url) ? '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + img + "</a>" : img; }).join("") + "</div>"
      : "";
    var contact = A.sponsorEmail || S.sponsorEmail;
    return '<div class="wrap stack-l">' + vh("ainnovate", "AInnovate", A.tagline) +
      '<div class="award"><div class="stack"><p class="tag">The AInnovate award</p><h2 class="award-title">Build it well, build it responsibly</h2>' +
        '<div class="prose">' + (A.brief ? paras(A.brief) : "<p>" + SOON + "</p>") + '</div><div class="row-btns">' + enter + "</div></div>" +
        '<div class="award-prize"><span class="muted">Prize</span><span class="big">' + esc(A.prize || "To be announced") + "</span>" + (A.prizeNote ? '<span class="muted">' + esc(A.prizeNote) + "</span>" : "") + "</div></div>" +
      '<div class="ai-cols">' +
        '<div class="stack"><h2 class="h2">Timeline</h2>' + list(A.timeline, "timeline", function (t) { return "<li><div><b>" + esc(t.step) + "</b><span>" + esc(t.when) + "</span></div></li>"; }) + "</div>" +
        '<div class="stack"><h2 class="h2">Rules</h2>' + (A.eligibility ? "<p>" + esc(A.eligibility) + "</p>" : "") + list(A.rules, "rules", function (r) { return "<li>" + esc(r) + "</li>"; }) +
          '<h2 class="h2" style="margin-top:18px">What the judges look for</h2>' + list(A.criteria, "rules", function (r) { return "<li>" + esc(r) + "</li>"; }) +
          (A.howToEnter ? '<h2 class="h2" style="margin-top:18px">How to enter</h2><div class="prose">' + paras(A.howToEnter) + "</div>" : "") + "</div>" +
      "</div>" +
      '<div class="panel stack"><h2 class="h2">Sponsor AInnovate</h2><p class="prose">' + esc(A.sponsorPitch) + "</p>" +
        (A.tiers && A.tiers.length ? '<div class="tiers">' + A.tiers.map(function (t) { return '<div class="tier"><h3 class="h3">' + esc(t.name) + '</h3><p class="muted">' + esc(t.gets) + "</p></div>"; }).join("") + "</div>" : "") +
        (sponsors ? '<h3 class="h3">With thanks to</h3>' + sponsors : "") +
        (contact ? '<div class="copy-row"><span>Get in touch:</span><code id="sponsor-email">' + esc(contact) + '</code><button class="btn btn-plain btn-small" type="button" data-copy="sponsor-email">Copy email</button></div>' : '<p class="muted">Sponsor contact: ' + SOON + "</p>") +
      "</div>" +
    "</div>";
  };

  var blogCat = "All";
  R.blog = function () {
    var posts = (S.posts || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var cats = ["All"].concat(posts.map(function (p) { return p.cat; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; }));
    var shown = posts.filter(function (p) { return blogCat === "All" || p.cat === blogCat; });
    var filters = posts.length > 1 ? '<div class="filters" role="group" aria-label="Filter posts">' + cats.map(function (c) { return '<button type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === blogCat) + '">' + esc(c) + "</button>"; }).join("") + "</div>" : "";
    var list = shown.map(function (p) {
      return '<article class="post"><div class="post-meta"><span class="tag">' + esc(p.cat) + '</span><time datetime="' + esc(p.date) + '">' + esc(longDate(p.date)) + "</time></div><div><h2>" + esc(p.title) + '</h2><div class="prose">' + paras(p.body) + "</div></div></article>";
    }).join("");
    return '<div class="wrap">' + vh("blog", "Blog", "Every week: AI news from around the world, what our last session covered, what is coming next, and highlights from the podcast.") + filters + (list ? '<div class="posts">' + list + "</div>" : empty("No posts yet")) + "</div>";
  };

  function avatar(p) {
    var src = safeUrl(p.photo);
    return '<div class="avatar">' + (src ? '<img src="' + esc(src) + '" alt="' + esc(p.name || p.guest) + '" loading="lazy">' : '<span aria-hidden="true">' + esc(initials(p.name || p.guest)) + "</span>") + "</div>";
  }

  R.podcast = function () {
    var eps = (S.episodes || []).map(function (e) {
      var listen = safeUrl(e.listenUrl) ? '<a class="btn btn-small" href="' + esc(safeUrl(e.listenUrl)) + '" target="_blank" rel="noopener">Listen to the episode</a>' : "";
      var audio = safeUrl(e.audio) ? '<audio controls preload="none" src="' + esc(safeUrl(e.audio)) + '">Your browser cannot play this recording.</audio>' : "";
      return '<article class="episode">' + avatar({ name: e.guest, photo: e.photo }) + '<div class="stack"><div><p class="tag">' + esc(longDate(e.date)) + '</p><h2 class="serif" style="font-size:clamp(1.4rem,2.6vw,1.85rem);line-height:1.2">' + esc(e.title) + '</h2><p class="muted">' + esc(e.guest) + (e.role ? ", " + esc(e.role) : "") + '</p></div><div class="prose">' + paras(e.intro) + "</div>" + audio + (listen ? '<div class="row-btns">' + listen + "</div>" : "") + "</div></article>";
    }).join("");
    return '<div class="wrap">' + vh("podcast", "Podcast", "Recordings of our podcast, with a short introduction to each guest speaker and their role.") + (eps || empty("Episodes coming soon")) + "</div>";
  };

  R.committee = function () {
    var ppl = (S.committee || []).map(function (p) {
      return '<article class="person">' + avatar(p) + '<div><h2 class="h3">' + esc(p.name) + '</h2><p class="role">' + esc(p.role) + "</p></div>" +
        (p.does ? "<p>" + esc(p.does) + "</p>" : "") + (p.motivation ? '<p><span class="sr">What motivates me: </span><em class="serif">' + esc(p.motivation) + "</em></p>" : "") + "</article>";
    }).join("");
    return '<div class="wrap">' + vh("committee", "Committee", "The people behind the society: what we do and what motivates us.") + (ppl ? '<div class="people">' + ppl + "</div>" : empty("Meet the committee")) + "</div>";
  };

  R.join = function () {
    var form = dataReady()
      ? '<form class="form" id="join-form" novalidate>' +
          '<div class="two"><div class="field"><label for="j-name">Full name</label><input id="j-name" name="name" type="text" autocomplete="name" required maxlength="120"></div>' +
          '<div class="field"><label for="j-email">University email</label><input id="j-email" name="email" type="email" autocomplete="email" required maxlength="160" placeholder="you@student.bham.ac.uk"></div></div>' +
          '<div class="two"><div class="field"><label for="j-year">Year of study</label><select id="j-year" name="year" required><option value="">Choose one</option><option>Foundation year</option><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year or placement</option><option>Master\'s</option><option>PhD</option><option>Staff</option><option>Other</option></select></div>' +
          '<div class="field"><label for="j-course">Course</label><input id="j-course" name="course" type="text" required maxlength="120" placeholder="e.g. Computer Science"></div></div>' +
          '<div class="field"><label for="j-learn">What would you like to learn? <span class="opt">(optional)</span></label><textarea id="j-learn" name="interest" maxlength="800"></textarea></div>' +
          '<label class="check" for="j-consent"><input id="j-consent" type="checkbox"><span>I am happy for the society to email me about sessions and events. You can ask us to remove you at any time.</span></label>' +
          '<div class="msg" id="j-msg" role="status" hidden></div>' +
          '<div><button class="btn" type="submit" id="j-btn">Join the society</button></div>' +
        "</form>"
      : '<div class="empty"><strong>Sign-up opens soon</strong>' + SOON + "</div>";
    return '<div class="wrap">' + vh("join", "Join the society", null) +
      '<div class="ring join"><div class="stack"><h2 class="serif">Become a member</h2><p class="muted">Tell us a little about yourself and we will keep you posted on sessions, guest speakers, AInnovate and the podcast.</p><p class="muted">Your answers also tell us how many of us there are and which courses and years we come from, so we can plan sessions that suit everyone.</p></div><div>' + form + "</div></div></div>";
  };

  /* ---------- feedback form (per session) ---------- */
  function feedbackForm(s) {
    if (!dataReady()) return '<p><strong>Feedback opens soon.</strong> ' + SOON + "</p>";
    var id = esc(s.id);
    var parts = (s.parts || []).map(function (p, i) {
      return '<fieldset class="seg"><legend>Did you enjoy ' + esc(p) + "?</legend>" +
        ["Yes", "Somewhat", "Not really"].map(function (o, j) { return '<input type="radio" name="part' + i + '" id="' + id + "-p" + i + "-" + j + '" value="' + o + '"><label for="' + id + "-p" + i + "-" + j + '">' + o + "</label>"; }).join("") + "</fieldset>";
    }).join("");
    return '<form class="form fb-form" novalidate data-session="' + id + '">' +
      '<p class="note">This form is anonymous. We do not collect your name or email.</p>' +
      '<div class="field"><label for="' + id + '-like">What did you like the most?</label><textarea id="' + id + '-like" maxlength="1500"></textarea></div>' +
      '<div class="field"><label for="' + id + '-imp">What could we improve on?</label><textarea id="' + id + '-imp" maxlength="1500"></textarea></div>' +
      parts +
      '<div class="field"><label for="' + id + '-proc">In the part where you worked on your own or in a team, what was your thought process?</label><textarea id="' + id + '-proc" maxlength="1500"></textarea></div>' +
      '<div class="msg" role="status" hidden></div><div><button class="btn btn-small" type="submit">Send feedback</button></div></form>';
  }

  /* ---------- router ---------- */
  var current = null, enteredAt = 0;
  var navList = $("#nav-list");
  navList.innerHTML = VIEWS.filter(function (v) { return v.id !== "home"; }).map(function (v) {
    return '<li' + (v.mobileOnly ? ' class="mobile-only"' : "") + '><a href="#' + v.id + '" data-nav="' + v.id + '">' + v.label + "</a></li>";
  }).join("");

  function render(id) {
    var el = $('[data-view="' + id + '"]');
    if (el && R[id]) { el.innerHTML = R[id](); bind(id, el); }
  }

  function show(id, focus) {
    if (!R[id]) id = "home";
    var prev = current, now = Date.now();
    if (prev === id) return;
    render(id);
    $$(".view").forEach(function (v) { v.hidden = v.dataset.view !== id; v.classList.remove("entering"); });
    var el = $('[data-view="' + id + '"]');
    void el.offsetWidth; el.classList.add("entering");
    $$("[data-nav]").forEach(function (a) { if (a.closest(".nav")) a.setAttribute("aria-current", a.dataset.nav === id ? "page" : "false"); });
    var v = VIEWS.filter(function (x) { return x.id === id; })[0];
    document.title = id === "home" ? "Birmingham AI Society" : v.title + " | Birmingham AI Society";
    closeMenu();
    window.scrollTo(0, 0);
    if (focus) { var h = $("#h-" + id); if (h) h.focus({ preventScroll: true }); }
    if (prev) document.dispatchEvent(new CustomEvent("ais:leave", { detail: { view: prev, ms: now - enteredAt } }));
    document.dispatchEvent(new CustomEvent("ais:view", { detail: { view: id, prev: prev } }));
    current = id; enteredAt = now;
  }
  window.AIS = {
    current: function () { return current; },
    since: function () { return enteredAt; },
    resetTimer: function () { enteredAt = Date.now(); },
    rerender: function () { if (current) render(current); },
    esc: esc
  };

  function fromHash() { return (location.hash || "#home").slice(1).split(/[?/]/)[0] || "home"; }
  window.addEventListener("hashchange", function () { show(fromHash(), true); });

  /* ---------- per-view behaviour ---------- */
  function bind(id, el) {
    if (id === "blog") $$("[data-cat]", el).forEach(function (b) { b.addEventListener("click", function () { blogCat = b.dataset.cat; render("blog"); var f = $('[data-cat="' + CSS.escape(blogCat) + '"]', el); if (f) f.focus(); }); });
    if (id === "sessions") $$(".fb-toggle", el).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        var open = panel.hidden;
        panel.hidden = !open; btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "Hide feedback form" : "Give anonymous feedback";
        if (open && !panel.dataset.ready) {
          var s = (S.sessions || []).filter(function (x) { return x.id === btn.closest("[data-session]").dataset.session; })[0];
          panel.innerHTML = feedbackForm(s); panel.dataset.ready = "1";
          if (window.AISData) window.AISData.bindFeedback(panel, s);
          var first = $("textarea, button", panel); if (first) first.focus();
        }
      });
    });
    if (id === "join" && window.AISData && $("#join-form", el)) window.AISData.bindJoin($("#join-form", el));
    $$("[data-copy]", el).forEach(function (b) {
      b.addEventListener("click", function () {
        var t = document.getElementById(b.dataset.copy), txt = t.textContent;
        function done(ok) { b.textContent = ok ? "Copied" : "Select and copy"; setTimeout(function () { b.textContent = "Copy email"; }, 2000); }
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { selectText(t); done(false); });
        else { selectText(t); done(false); }
      });
    });
  }
  function selectText(n) { var r = document.createRange(); r.selectNodeContents(n); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }

  /* ---------- mobile menu ---------- */
  var menuBtn = $("#menu-btn"), nav = $("#nav");
  function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Open menu"); document.body.classList.remove("menu-open"); }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("open");
    nav.classList.toggle("open", open); document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { var a = $("a", nav); if (a) a.focus(); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); menuBtn.focus(); } });

  /* ---------- footer ---------- */
  if (safeUrl(S.guildUrl)) $("#guild").innerHTML = 'Affiliated with the <a href="' + esc(safeUrl(S.guildUrl)) + '" target="_blank" rel="noopener">Guild of Students</a>';

  show(fromHash(), false);
})();
