# Birmingham AI Society website

Live at **https://melissa1812.github.io/ai-society/**

The committee stats page is at **https://melissa1812.github.io/ai-society/stats.html**. It needs the committee passcode.

## Updating the site

All the words on the site live in one file: **`assets/js/content.js`**.

1. On GitHub, open `assets/js/content.js` and click the pencil icon.
2. Change the text between the quotes. Keep the quotes, commas and brackets as they are.
3. Click **Commit changes**. The site updates in about a minute.

Each section in that file has an example of the format it expects. Some common jobs:

**Add a blog post.** Add a block inside `posts: [ ]`. Use `\n` to start a new paragraph.
```js
posts: [
  { cat: "AI news", date: "2026-11-02", title: "This week in AI",
    body: "First paragraph.\nSecond paragraph." },
],
```

**Set the next session.** Replace `next: null,` with:
```js
next: { title: "Prompting 101", date: "Tuesday 3 November", time: "16:00 – 18:00",
        room: "Murray LC-UG05", brief: "What we will cover." },
```

**Add a session after it has run.**
1. Copy the existing session block in `sessions`.
2. Put the copy at the top of the list.
3. Give it a new `id`, using lowercase words and dashes.
4. Fill in the rest of the details.

The `parts` list becomes the "Did you enjoy…?" questions in the anonymous feedback form.

**Photos for the committee or guests.**
1. Upload the image to `assets/img/committee/` or `assets/img/guests/`, using **Add file → Upload files**.
2. Put its path in `photo`, for example `"assets/img/committee/tina.jpg"`.
3. Use square images that are around 400 × 400 px.

Only add a guest's photo and role if they have agreed to it.

**Guild affiliation.** Put the Guild page link in `guildUrl`. It then appears in the footer.

## Backend setup (sign-ups, feedback, stats)

GitHub Pages can't store data, so a Google Sheet does it. This is a one-off setup that takes about 10 minutes. Do it with the society's Google account.

1. Create a new Google Sheet, for example "AI Society website data".
2. In the Sheet, go to **Extensions → Apps Script**.
3. Delete what's there, paste in the whole of `apps-script/Code.gs`, and save.
4. Set the committee passcode:
   1. Click **Project Settings** (the cog icon).
   2. Under **Script Properties**, click **Add script property**.
   3. Set the name to `STATS_KEY` and the value to a passcode of your choice. Share the passcode only with the committee.
5. Back in the editor, choose the `setup` function and click **Run**. Approve the permissions. This creates the four tabs: signups, feedback, events and attendance.
6. Deploy the script:
   1. Click **Deploy → New deployment**.
   2. For the type, choose **Web app**.
   3. Set **Execute as: Me**.
   4. Set **Who has access: Anyone**.
   5. Click **Deploy** and copy the **Web app URL**.
7. Paste that URL into `assets/js/content.js` as `apiUrl: "https://script.google.com/macros/s/…/exec"` and commit.

After you change `Code.gs` later, publish the change with **Deploy → Manage deployments**: click the edit (pencil) icon, set Version to **New version**, then click **Deploy**. This keeps the same URL.

### What gets stored

| Tab | Contents |
|---|---|
| `signups` | Name, email, year, course and what they want to learn. A repeat sign-up with the same email isn't added twice. |
| `feedback` | Anonymous answers for each session. No name or email is collected. |
| `events` | Anonymous visits: which section was viewed and for how long, plus phone or computer. Each browser tab gets a random id that is gone when the tab closes. There are no cookies, and browsers that send Do Not Track are skipped. |
| `attendance` | Headcounts entered by the committee on the stats page. |

To remove someone from the mailing list, delete their row in `signups`.

## Fonts

The site uses Poppins for text. Titles use Bicubik and the tagline uses Larken, falling back to Unbounded and Fraunces until we have the font files. Once the `.woff2` files are added to `assets/fonts/`, the site will use them. Unbounded and OpenDyslexic are included under the SIL Open Font License (see `assets/fonts/`).

## Files

```
index.html            the website
stats.html            committee stats (passcode)
assets/js/content.js  ALL the text you edit
assets/js/app.js      sections and navigation
assets/js/a11y.js     light/dark mode and accessibility panel
assets/js/data.js     sign-up, feedback and anonymous visit stats
assets/js/stats.js    stats dashboard
assets/css/           styles
apps-script/Code.gs   Google Sheet backend
```
