# SmartHerd lessons site: how lessons are written

This repo is Sam's lesson website. Vercel redeploys it on every push to `main`. There is no build step: plain HTML, one shared stylesheet, and a JSON index.

## Who the learner is

Sam works in hospital IT in Accra, Ghana. He's strong on servers, networking, Linux and Python scripting, and is building a cybersecurity career. He has little to no electronics knowledge. He asked for lessons that start from scratch, with **nothing based on assumption**: what every part is, what every label on a board means, and exactly how and why each connection is made. He learns best from **vivid drawings, images and video** (YouTube links are welcome).

## Files

- `index.html`: home page. It reads `data/lessons.json` and shows progress plus every published lesson, newest first. Don't hand-edit the lesson list in it.
- `data/lessons.json`: `current` (what Sam is on now) and `entries` (one per published page, oldest first). Never delete entries.
- `data/syllabus.json`: the 52-week plan. Each week = one lesson with 3 sessions: S1 Learn, S2 Build, S3 Submit.
- `lessons/`: one page per session, named `wNN-sN.html` (for example `w02-s1.html`). `lesson-01.html` holds all of Week 1. Never delete or rewrite a past page, except to fix a factual error.
- `assets/style.css`: shared styles. Use its classes; don't add per-page CSS.

## Page structure (copy lesson-01.html)

Each page uses the same `<head>`, header, `<main class="wrap">` and footer as `lessons/lesson-01.html`, with `../assets/style.css`. Then:

1. `<p class="meta">Lesson N &middot; Week N &middot; Session S &middot; Published <date></p>`, an `<h1>`, and a `.lead` paragraph saying what Sam can do by the end.
2. A time estimate, what's needed, and a `.toc` box when there are 3+ sections.
3. Teaching sections (`<h2>`), each in this order: **drawing first**, then a short plain explanation, then a video.
4. Session 2 pages: numbered, click-by-click steps with exact pin names, plus a numbered wiring map drawing.
5. Session 3 pages: what to submit (link or code, own-words questions, practice problems) and how it will be checked.
6. A word list for new terms, a Sources list, and a link back to `../index.html`.

### Drawings

- Inline `<svg viewBox="0 0 760 H">` inside `<figure>` with a `<figcaption>`. The title is the first `<text>`, stating the point, not the topic.
- Colours only through CSS variables in `style` attributes so light and dark mode both work: `style="fill:var(--ink)"`, `var(--quiet)`, `var(--edge)`, `var(--tint)`, `var(--muted)`, `var(--accent)`, `var(--red)`, `var(--warn)`, `var(--good)`, `var(--tan)`. Literal colours are OK only for real-world colours such as resistor bands.
- Text at least 11.5 px in a 760-wide frame. Label every leg, pin and wire. Keep labels clear of lines and each other.
- At least one drawing per teaching section. Hardware sessions need a wiring map that names every pin exactly as printed.

### Videos

Embed with the `.video` block from lesson-01.html: `https://www.youtube-nocookie.com/embed/<id>`, plus a one-line note and an "Open on YouTube" link. Only use a video you found in a search result in this run, with a title matching the topic. Never invent a video ID.

### Accuracy rules

- Check facts against official docs (Espressif, Arduino, Wokwi docs, library READMEs, vendor datasheets) found in this run, and list them under Sources.
- Wokwi's default ESP32 board is the **ESP32-DevKitC V4** (`board-esp32-devkit-c-v4`). Its pins: left side top to bottom 3V3, EN, VP, VN, 34, 35, 32, 33, 25, 26, 27, 14, 12, GND, 13, D2, D3, CMD, 5V; right side GND, 23, 22, TX, RX, 21, GND, 19, 18, 5, 17, 16, 4, 0, 2, 15, D1, D0, CLK. On this board D0 to D3, CMD and CLK are flash pins: never use them. GPIO 2 is the pin printed "2".
- Wokwi doesn't simulate current, so a missing resistor still "works" there. Always say so when it matters.
- When something can't be verified, say so on the page instead of guessing.

## Writing style

Like a real person explaining to a smart friend over coffee: clear, direct, warm, plain words. Short sentences. No buzzwords, no corporate jargon, **no em dashes**. Explain every new word the first time it appears.

## Commits

One commit per published session, message `Add Week N Session S: <title>`, with the session's attribution trailer lines.
