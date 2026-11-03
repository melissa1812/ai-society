/* Birmingham AI Society: views, navigation and rendering.
   Content comes from content.js (window.SITE). */
(function () {
  "use strict";
  var S = window.SITE || {};
  var SOON = "Committee will insert content shortly.";

  var VIEWS = [
    { id: "home", label: "Home", title: "Birmingham AI Society", mobileOnly: true },
    { id: "about", label: "About", title: "About us" },
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
    return '<div class="wrap home">' +
      '<div class="hero"><div>' +
        '<h1 class="vh-title hero-title" id="h-home" tabindex="-1"><span class="grad">AI</span> Society</h1>' +
        '<p class="tagline">With great power comes great responsibility</p>' +
        '<p class="hero-sub">' + esc(S.about && S.about.intro) + "</p>" +
        '<div class="row-btns"><a class="btn" href="#join">Join the society</a><a class="btn btn-ghost" href="#sessions">See our sessions</a></div>' +
      '</div><div class="logo-ring"><img src="assets/img/logo.jpg" width="640" height="640" alt="University of Birmingham AI Society logo: a brain split into a pink organic half and a blue circuit half, with a light bulb between them"></div></div>' +
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
    var n = S.next;
    var next = n
      ? '<div class="ring next-up"><div class="stack"><p class="tag">Next session</p><h2 class="h2 next-title">' + esc(n.title) + '</h2><div class="prose">' + paras(n.brief) + '</div></div>' +
        '<div class="stack">' + chips(n) + '<div class="row-btns"><a class="btn btn-small" href="#join">Join the society</a></div></div></div>'
      : '<div class="ring next-up"><div class="stack"><p class="tag">Next session</p><h2 class="h2 next-title">To be announced</h2><p class="muted">' + SOON + '</p></div>' +
        '<div class="stack"><div class="row-btns"><a class="btn btn-small" href="#join">Join to hear first</a></div></div></div>';
    return '<div class="wrap stack-l">' + vh("sessions", "Our sessions", "What is coming up next, plus a brief of every past session, the material we share, and an anonymous way to tell us what you thought.") +
      next + '<div class="past"><h2 class="past-h">Past sessions</h2>' + (list ? "<div>" + list + "</div>" : empty("No sessions yet")) + "</div></div>";
  };

  R.ainnovate = function () {
    var A = S.ainnovate || {};
    var X = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/></svg>';
    var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" class="tick-bg"/><path d="M7 12.5l3.2 3.2L17 9"/></svg>';
    var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
    var PERSON = '<svg viewBox="0 0 40 44" aria-hidden="true"><circle cx="20" cy="10" r="9"/><path d="M2 44c0-11 8-19 18-19s18 8 18 19z"/></svg>';
    function pills(arr, cls, icon) { return (arr || []).map(function (t, i) { return '<li class="ai-row">' + (icon ? '<span class="ai-ic">' + icon + "</span>" : "") + '<span class="ai-pill ' + cls + (i % 2 && cls !== "ai-pill-no" ? " alt" : "") + '">' + esc(t) + "</span></li>"; }).join(""); }
    function brief(t) {
      t = esc(t);
      return t.replace(/Artificial Intelligence/, '<span class="gold-t">Artificial Intelligence</span>').replace(/(industry or discipline\.?)$/, '<span class="gold-t">$1</span>');
    }
    var ses = A.session || {};
    var detail = function (kind, text) { return text ? '<li class="ai-detail">' + ICON[kind] + "<span>" + esc(text) + "</span></li>" : ""; };
    var enter = safeUrl(A.enterUrl) ? '<a class="ai-btn ai-btn-solid" href="' + esc(safeUrl(A.enterUrl)) + '" target="_blank" rel="noopener">Enter AInnovate</a>' : "";

    var slides = [
      ["UOB AI Society · AInnovate", "Your industry has a problem",
        '<div class="sl sl-center"><p class="ai-h1">Your industry<br>has a problem.</p><p class="ai-small">What if</p><p class="ai-you">you</p><p class="ai-h2">could help solve it?</p></div>'],
      ["What is AInnovate?", "What is AInnovate?",
        '<div class="sl"><p class="ai-word" aria-label="AInnovate"><span class="gold-t">AI</span>NNOVATE</p><p class="ai-tagpill">' + esc(A.tagline) + '</p>' +
        '<p class="ai-h2">This isn\'t about making more AI.</p><p class="ai-h2">It\'s about solving <em class="gold-i">real problems.</em></p><p class="ai-body">' + esc(A.pitch) + "</p></div>"],
      ["Who can join?", "Who can join?",
        '<div class="ai-cloud" aria-hidden="true">' + (A.disciplines || []).concat(A.disciplines || []).map(esc).join(" · ") + "</div>" +
        '<div class="sl"><p class="ai-h1">You don\'t have to be a tech person to change the future with innovation.</p><p class="ai-body">No matter your course, background or expertise, you can be an innovator.</p><p class="ai-h2 gold-i">We need your perspective.</p></div>'],
      ["What we're looking for", "What we're looking for",
        '<div class="sl"><p class="ai-h3">We\'re not asking you to…</p><ul class="ai-list">' + pills(A.notAsking, "ai-pill-no", X) + '</ul>' +
        '<p class="ai-h3">We\'re asking you to…</p><ul class="ai-list">' + pills(A.asking, "", TICK) + '</ul><p class="ai-h2 gold-i">You bring the expertise.</p></div>'],
      ["The challenge", "The challenge brief",
        '<div class="sl sl-mid"><p class="ai-h1 ai-xl">The challenge<br>brief</p><p class="ai-lead">' + brief(A.brief || "") + '</p>' +
        '<ol class="ai-flow"><li class="ai-pill">A real problem</li><li class="ai-arrow" aria-hidden="true">' + ARROW + '</li><li class="ai-pill alt">Responsible AI</li><li class="ai-arrow" aria-hidden="true">' + ARROW + '</li><li class="ai-pill pink">Your solution</li></ol></div>'],
      ["How to enter", "How to enter",
        '<div class="sl sl-mid"><p class="ai-h1 ai-xl">Teams of ' + esc(A.teamSize) + '</p><div class="ai-people" aria-hidden="true">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<span class="p' + i + '">' + PERSON + "</span>"; }).join("") + "</div>" +
        '<div class="ai-datecard">' + ICON.date + "<span><b>" + esc(ses.date) + "</b>" + esc(ses.label) + "</span></div>" +
        '<p class="ai-body">' + esc(A.teamNote) + '</p><p class="ai-body cream-t">' + esc(A.teamNote2) + "</p></div>"],
      ["What to submit", "What every entry needs",
        '<div class="sl"><p class="ai-h1">What every entry needs</p><p class="ai-h3">Technical entries</p><ul class="ai-list">' + pills(A.technical, "", ARROW) + '</ul>' +
        '<p class="ai-h3">Non-technical entries</p><ul class="ai-list">' + pills(A.nonTechnical, "alt-first", ARROW) + "</ul></div>"],
      ["How we judge", "Criteria",
        '<div class="sl sl-mid"><p class="ai-h1 ai-xl">Criteria</p><p class="ai-body">What we\'ll look for in every entry.</p><ul class="ai-grid">' +
        (A.criteria || []).map(function (c, i) { return '<li class="ai-pill' + ([1, 2, 5, 6].indexOf(i) >= 0 ? " alt" : "") + '">' + esc(c) + "</li>"; }).join("") + "</ul></div>"],
      ["With great power comes great responsibility", "Every discipline. One challenge.",
        '<div class="sl sl-center"><p class="ai-h1">Every discipline.<br>Every perspective.</p><p class="ai-h1 gold-i">One challenge.</p><p class="ai-kicker">' + esc(ses.label) + '</p>' +
        '<ul class="ai-details">' + detail("date", ses.date) + detail("room", ses.room) + detail("time", ses.time) + '</ul>' +
        '<div class="ai-ctas">' + enter + '<a class="ai-btn' + (enter ? "" : " ai-btn-solid") + '" href="#join">Join the society</a></div></div>']
    ];
    var n = slides.length;
    var NEXT = ["What is AInnovate?", "Who can join?", "What we're looking for", "The challenge", "How to enter", "What to submit", "How we judge", "Join us"];

    var deck = '<div class="deck" data-deck tabindex="-1" aria-roledescription="carousel" aria-label="AInnovate">' +
      '<div class="deck-bars" role="group" aria-label="Choose a slide">' + slides.map(function (sl, i) { return '<button type="button" class="deck-bar" data-go="' + i + '" aria-label="Slide ' + (i + 1) + ": " + esc(sl[1]) + '"></button>'; }).join("") + "</div>" +
      '<div class="deck-meta"><span class="deck-label" data-label></span><span class="deck-count" data-count></span></div>' +
      '<div class="deck-stage">' + slides.map(function (sl, i) {
        return '<section class="slide' + (i === 2 ? " has-cloud" : "") + '" data-slide="' + i + '" data-label="' + esc(sl[0]) + '" data-title="' + esc(sl[1]) + '" data-next="' + esc(NEXT[i] || "") + '" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + n + ": " + esc(sl[1]) + '"' + (i ? " hidden" : "") + ">" + sl[2] + "</section>";
      }).join("") + "</div>" +
      '<div class="deck-foot"><img src="assets/img/logo-mark.jpg" alt="" width="64" height="64" class="deck-logo">' +
        '<div class="deck-nav"><button type="button" class="ai-btn ai-btn-ghost ai-btn-icon" data-prev aria-label="Previous slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg></button><button type="button" class="ai-btn" data-nextbtn></button></div></div>' +
      '<p class="sr" aria-live="polite" data-live></p>' +
    "</div>";

    var sponsors = (A.sponsors || []).length
      ? '<div class="sponsor-logos">' + A.sponsors.map(function (s) { var img = s.logo ? '<img src="' + esc(safeUrl(s.logo)) + '" alt="' + esc(s.name) + '">' : esc(s.name); return safeUrl(s.url) ? '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + img + "</a>" : img; }).join("") + "</div>"
      : "";
    var contact = A.sponsorEmail || S.sponsorEmail;
    var sponsor = '<section class="ai-sponsor" aria-labelledby="ai-sp-h"><p class="ai-kicker">Partner with us</p><h2 class="ai-h1" id="ai-sp-h">Sponsor <span class="gold-i">AInnovate</span></h2>' +
      '<p class="ai-body">' + esc(A.sponsorPitch) + "</p>" +
      (A.tiers && A.tiers.length ? '<ul class="ai-tiers">' + A.tiers.map(function (t, i) { return '<li class="ai-tier' + (i === 0 ? " lead" : "") + '"><h3>' + esc(t.name) + "</h3><p>" + esc(t.gets) + "</p></li>"; }).join("") + "</ul>" : "") +
      (sponsors ? '<p class="ai-h3">With thanks to</p>' + sponsors : "") +
      (contact ? '<div class="copy-row"><span>Get in touch:</span><code id="sponsor-email">' + esc(contact) + '</code><button class="ai-btn" type="button" data-copy="sponsor-email">Copy email</button></div>' : '<p class="ai-body">Sponsor contact: ' + SOON + "</p>") +
    "</section>";

    return '<div class="ainv"><div class="wrap"><h1 class="sr" id="h-ainnovate" tabindex="-1">AInnovate</h1>' + deck + sponsor + "</div></div>";
  };

  /* Slide deck behaviour (AInnovate) */
  function bindDeck(root) {
    var slides = $$(".slide", root), bars = $$(".deck-bar", root), n = slides.length, cur = 0;
    var next = $("[data-nextbtn]", root), prev = $("[data-prev]", root), live = $("[data-live]", root);
    var pad = function (i) { return (i < 10 ? "0" : "") + i; };
    function go(i, announce) {
      cur = Math.max(0, Math.min(n - 1, i));
      slides.forEach(function (s, k) { s.hidden = k !== cur; });
      bars.forEach(function (b, k) { b.classList.toggle("done", k < cur); b.classList.toggle("on", k === cur); if (k === cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
      $("[data-label]", root).textContent = slides[cur].dataset.label;
      $("[data-count]", root).textContent = pad(cur + 1) + " / " + pad(n);
      prev.hidden = cur === 0;
      if (cur < n - 1) { next.textContent = "Next: " + slides[cur].dataset.next + " →"; next.setAttribute("aria-label", "Next slide: " + slides[cur].dataset.next); }
      else { next.textContent = "Start again"; next.setAttribute("aria-label", "Back to the first slide"); }
      if (announce) live.textContent = "Slide " + (cur + 1) + " of " + n + ": " + slides[cur].dataset.title;
    }
    next.addEventListener("click", function () { go(cur < n - 1 ? cur + 1 : 0, true); });
    prev.addEventListener("click", function () { go(cur - 1, true); });
    bars.forEach(function (b, k) { b.addEventListener("click", function () { go(k, true); }); });
    root.addEventListener("keydown", function (e) {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1, true); }
    });
    var x0 = null, y0 = null;
    $(".deck-stage", root).addEventListener("pointerdown", function (e) { x0 = e.clientX; y0 = e.clientY; });
    $(".deck-stage", root).addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), true);
    });
    go(0, false);
  }

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
  navList.innerHTML = VIEWS.map(function (v) {
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

  function fromHash() { var h = (location.hash || "#home").slice(1).split(/[?/]/)[0] || "home"; return h === "next" ? "sessions" : h; }
  window.addEventListener("hashchange", function () { show(fromHash(), true); });

  /* ---------- per-view behaviour ---------- */
  function bind(id, el) {
    if (id === "ainnovate") { var d = $("[data-deck]", el); if (d) bindDeck(d); }
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
