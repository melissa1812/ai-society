/* =====================================================================
   SITE CONTENT
   This is the only file you need to edit to update the website.
   Save, commit, and GitHub Pages republishes in about a minute.
   Keep the commas and quotes exactly as they are around your text.
   ===================================================================== */

window.SITE = {

  /* Paste the Google Apps Script web app URL here (see README). Until it is
     set, the sign-up and feedback forms say they open soon. */
  apiUrl: "",

  /* Add the Guild of Students page once you are affiliated. */
  guildUrl: "",

  /* Shown on the AInnovate page for sponsor enquiries. */
  sponsorEmail: "",

  /* ---------------- About us ---------------- */
  about: {
    intro: "A student community for learning how AI works, asking what it means for society, and building things that are purposeful, ethical and meaningful.",
    who: "The University of Birmingham AI Society is a student-run community for anyone curious about artificial intelligence, whatever you study and however much you already know.",
    vision: "A campus where AI is built and used on purpose: ethically, responsibly and for the benefit of people.",
    aspirations: "Hands-on workshops, guest speakers, a podcast and the AInnovate award, so every member leaves able to do more with AI and to think harder about it.",
    story: "AI was changing every subject on campus faster than the conversation about it. We wanted a place where students could learn the tools, ask the uncomfortable questions and build things together.\nOur tagline is the standard we hold ourselves to. Power without responsibility is not innovation, so every session asks what a solution can do and what it should do."
  },

  /* ---------------- Next session ----------------
     Replace null with:
     { title: "", date: "Tuesday 3 November", time: "16:00 – 18:00",
       room: "Murray LC-UG05", brief: "" }                              */
  next: null,

  /* ---------------- Our sessions ----------------
     Newest first. "parts" become the "Did you enjoy...?" questions in the
     anonymous feedback form. "materials" are links to slides, notebooks etc.
     e.g. materials: [{ label: "Slides (PDF)", url: "https://..." }]       */
  sessions: [
    {
      id: "ethics-innovation",
      title: "Ethics & Innovation Workshop",
      date: "Tuesday 20 October",
      time: "16:00 – 18:00",
      room: "Murray LC-UG05",
      brief: "What do we really know about AI? We looked at the short-term and long-term impacts of AI, and how to weigh them in your AInnovate solutions. The goal isn't to create for the sake of innovation, but to build solutions that are purposeful, ethical and meaningful.",
      points: [
        "The ethical, social and environmental consequences of AI",
        "What we are looking for in your AInnovate solutions",
        "How to keep AI in the workplace efficient, responsible and sustainable"
      ],
      parts: [
        "the discussion on AI's ethical, social and environmental impact",
        "the AInnovate briefing",
        "the discussion on responsible AI at work"
      ],
      materials: []
    }
  ],

  /* ---------------- Weekly blog ----------------
     Categories that work well: "AI news", "Last session", "Next session", "Podcast"
     { cat: "AI news", date: "2026-11-02", title: "",
       body: "First paragraph.\nSecond paragraph." }                       */
  posts: [],

  /* ---------------- Podcast ----------------
     Only add a guest's photo and role if they have agreed to it.
     { title: "", date: "2026-11-02", guest: "", role: "", intro: "",
       photo: "assets/img/guests/name.jpg", listenUrl: "https://..." ,
       audio: "assets/audio/episode-1.mp3" }   (audio is optional)       */
  episodes: [],

  /* ---------------- Committee ----------------
     { name: "", role: "", does: "What I do in the society",
       motivation: "What motivates me", photo: "assets/img/committee/name.jpg" } */
  committee: [],

  /* ---------------- AInnovate ---------------- */
  ainnovate: {
    tagline: "Build AI that is purposeful, ethical and meaningful.",
    brief: "",          /* the challenge, in a paragraph or two (\n for a new paragraph) */
    prize: "",          /* e.g. "£500 and a mentoring session" */
    prizeNote: "",      /* one line under the prize */
    eligibility: "",
    timeline: [],       /* in order: { step: "Registration opens", when: "3 November" } */
    rules: [],          /* "One team of up to four people", ... */
    criteria: [],       /* "Ethical impact", "Feasibility", ... */
    howToEnter: "",
    enterUrl: "",       /* link to the entry form */

    sponsorPitch: "AInnovate puts your organisation in front of students who build with AI and think hard about its impact. Sponsors are credited on every AInnovate session, our posters and this website, and are invited to judge the final.",
    tiers: [
      { name: "Award sponsor", gets: "Name on the award, a seat on the judging panel, and a slot to speak at the final." },
      { name: "Session partner", gets: "Co-host one workshop, with your logo on the session posters and blog write-up." },
      { name: "Supporter", gets: "Your logo on this page and a thank-you in our podcast." }
    ],
    sponsors: []        /* { name: "", logo: "assets/img/sponsors/name.png", url: "https://..." } */
  }
};
