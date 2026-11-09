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
     Set to null when nothing is announced. "points" and "partners" are optional.
     { title: "", date: "Tuesday 3 November", time: "16:00 – 18:00",
       room: "Murray LC-UG05", brief: "", points: [], partners: "" }       */
  next: {
    title: "Hackathon Workshop",
    date: "Monday 9 November",
    time: "16:00 – 18:00",
    room: "Murray LG12",
    partners: "A live session with Women in Tech Society and WISE",
    brief: "Got an idea for the upcoming hackathon but don't know where to start? We've got you covered!\nGet familiar with the tools, techniques and approaches that can take your hackathon idea from concept to reality.",
    points: [
      "Problem solving & scalability, with Women in Tech Society",
      "Design & development tools, with the AI Society",
      "Building smarter & safer, with WISE"
    ]
  },

  /* ---------------- Our sessions ----------------
     Past sessions, newest first. When the next session has run, copy it here.
     "parts" become the "Did you enjoy...?" questions in the anonymous
     feedback form. "materials" are links to slides, notebooks etc.
     e.g. materials: [{ label: "Slides (PDF)", url: "https://..." }]       */
  sessions: [
    {
      id: "ainnovate-session",
      title: "AInnovate Session",
      date: "Tuesday 3 November",
      time: "15:00 – 17:00",
      room: "Strathcona Building LT2",
      brief: "Our dedicated AInnovate session: a cross-disciplinary innovation challenge to solve a real problem from your industry or discipline, using AI responsibly. We walked through the challenge brief, what every entry needs and how we judge, and helped people find teammates from different disciplines.",
      points: [
        "The challenge brief and what we're looking for",
        "What technical and non-technical entries need to submit",
        "Finding a team of 1–6, from any discipline"
      ],
      parts: [
        "the walkthrough of the challenge brief",
        "meeting potential teammates"
      ],
      materials: []
    },
    {
      id: "ai-on-trial",
      title: "AI on Trial",
      date: "Tuesday 27 October",
      time: "16:00 – 18:00",
      room: "MMAT-GC13",
      brief: "What happens when AI goes on trial? We put AI under the spotlight, debating its impact on creativity, fairness and education, exploring different perspectives, challenging assumptions and deciding whether AI is innocent or guilty.",
      points: [
        "AI's impact on human creativity, originality and artistic ownership",
        "Bias and discrimination in AI systems, and whether AI can truly make impartial decisions",
        "Whether AI supports learning or makes us more reliant, reducing independent thinking"
      ],
      parts: [
        "the debate on AI and creativity",
        "the debate on bias and fairness",
        "the debate on AI in education"
      ],
      materials: []
    },
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
    },
    {
      id: "prompt-engineering",
      title: "Prompt Engineering & AI-Assisted Development",
      date: "Tuesday 13 October",
      time: "15:00 – 17:00",
      room: "Bioscience E-102",
      brief: "Our first hands-on workshop, on getting the most out of AI. We looked at how LLMs are used in industry, with a focus on how to use them efficiently, ethically and responsibly.",
      points: [
        "Basic prompt structures",
        "Practical examples",
        "An accessible learning format"
      ],
      parts: [
        "learning the basic prompt structures",
        "the practical examples"
      ],
      materials: []
    },
    {
      id: "launch-event",
      title: "Launch Event",
      date: "Friday 9 October",
      time: "12:00 – 14:00",
      room: "Watson LT A (G23)",
      brief: "Be curious, be involved, be informed. Our launch event introduced the society and gave a taste of what our sessions look like: learning about AI hands-on, with the ethics built in from day one.",
      points: [
        "All disciplines welcome",
        "No experience required",
        "Snacks and refreshments"
      ],
      parts: [
        "finding out about the society",
        "the hands-on AI taster"
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
    /* Text from the AInnovate carousel. Each part below is one slide. */
    tagline: "A cross-disciplinary innovation challenge",
    pitch: "Bring a challenge from your industry. Let's rethink what's possible.",
    notAsking: ["Love AI", "Implement it carelessly and call it innovation"],
    asking: [
      "Bring a problem worth solving",
      "Really understand what innovation is, and how it can be done right",
      "Use AI as one tool, but only with responsible, ethical, proper practices"
    ],
    brief: "Present to us a solution that uses Artificial Intelligence to fix a pre-existing problem within your industry or discipline.",
    teamSize: "1–6",
    teamNote: "Don't have a team? No worries. Come to our session and find like-minded people.",
    teamNote2: "Want a team from different disciplines? We'd love that!",
    technical: ["Prototype", "Presentation of your fully formed solution and the problem, by video or in person in front of a panel"],
    nonTechnical: ["Presentation of your fully formed solution and the problem, by video or in person in front of a panel"],
    criteria: ["Challenge approach", "Innovation", "Implementation", "Research", "Feasibility", "Ethical considerations", "Integrity"],
    session: { label: "Dedicated AInnovate session", date: "Tuesday 3rd November", room: "Strathcona Building LT2", time: "Join us anytime from 3–5pm!" },
    enterUrl: "",       /* link to the entry form, once there is one */

    /* Courses shown faintly behind the "Who can join?" slide */
    disciplines: ["Ancient History", "Archaeology", "History", "Creative Writing", "Drama", "Theology and Religion", "Liberal Arts", "Modern Languages", "French", "German", "Spanish", "Politics", "International Relations", "Law", "Criminology", "Sociology", "Social Policy", "Anthropology", "Economics", "Business Management", "Accounting and Finance", "Mathematics", "Computer Science", "Artificial Intelligence", "Data Science", "Aerospace Engineering", "Chemical Engineering", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Biomedical Science", "Biological Sciences", "Biotechnology", "Geography", "Environmental Science", "Geology", "Earth Sciences", "Urban Planning", "Medicine", "Dentistry", "Nursing", "Physiotherapy", "Sport and Exercise Sciences", "Psychology", "Health Sciences", "Pharmacy", "Food Safety", "Human Sciences", "Philosophy", "English Literature", "Physics", "Chemistry"],

    /* Sponsors */
    sponsorPitch: "AInnovate puts your organisation in front of students from every discipline who are solving real problems with responsible AI. Sponsors are credited on every AInnovate session, our posters and this website, and are invited to sit on the judging panel.",
    tiers: [
      { name: "Award sponsor", gets: "Name on the award, a seat on the judging panel, and a slot to speak at the final." },
      { name: "Session partner", gets: "Co-host one workshop, with your logo on the session posters and blog write-up." },
      { name: "Supporter", gets: "Your logo on this page and a thank-you in our podcast." }
    ],
    sponsors: []        /* { name: "", logo: "assets/img/sponsors/name.png", url: "https://..." } */
  }
};
