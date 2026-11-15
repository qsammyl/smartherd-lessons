# SmartHerd Learning Path

Static site of Sam's daily SmartHerd lessons (electronics, embedded, data, AI, cybersecurity and robotics, applied to mixed farming).

- `index.html` shows progress and every published lesson, read from `data/lessons.json`.
- `lessons/` holds one HTML page per lesson session. Pages are never deleted, so the site is a running record.
- `assets/style.css` is shared by every page. Drawings are inline SVG that follow light and dark mode.

A daily scheduled task adds the next session and pushes here. Vercel redeploys on every push. No build step.
