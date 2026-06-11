# tyler-macinnis.github.io

> **Live site:** [tyler-macinnis.github.io](https://tyler-macinnis.github.io/)

My personal portfolio — an interactive, terminal-themed resume built entirely from scratch with
vanilla HTML, CSS, and JavaScript. No frameworks, no build step, zero dependencies.

## Features

- **Boot sequence intro** — a kernel-style boot log plays on first visit (skippable, once per session)
- **Interactive terminal** — a fake shell with command history, tab completion, and a few
  undocumented easter eggs (`help` to start, `sudo` at your own risk)
- **Circuit-trace hero canvas** — particle network rendered with orthogonal PCB-style traces
- **Live GitHub integration** — recently active repos and activity feed pulled from the GitHub
  API at page load (cached, with graceful offline fallback)
- **Glassmorphism design system** — dark-first with a persistent light/dark toggle
- **Fully responsive & accessible** — semantic HTML, reduced-motion support, keyboard friendly

## Stack

| Layer | Choice |
| --- | --- |
| Markup | Hand-written HTML5 |
| Styling | Plain CSS (custom properties, `backdrop-filter`, grid) |
| Behavior | Vanilla JS (Canvas 2D, IntersectionObserver) |
| Hosting | GitHub Pages (static, `.nojekyll`) |

## Updating content

All site content lives in one place: [js/data.js](js/data.js). Edit the `SITE_DATA` object
(experience, projects, skills, about text, socials, terminal responses, typewriter phrases)
and refresh — no HTML or CSS changes needed.

```js
// js/data.js — add a job, project, or skill by adding an entry:
experience: [
  { title: "...", org: "...", date: "...", bullets: ["..."] },
  // ...
],
```

The interactive terminal and hero typewriter pull from the same data automatically.

## Run locally

**VS Code (recommended):** press `F5` — this starts the local server and launches the browser
with the debugger attached (breakpoints work in the `js/` files). Or run the
`Serve site (localhost:8000)` task with `Ctrl+Shift+B`.

**Manual:**

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```text
index.html        page skeleton (sections are filled in from data)
js/data.js        ✏️ ALL site content — edit this to update the site
js/render.js      builds the sections from data.js
js/main.js        boot intro, typewriter, theme, nav, scroll reveal
js/terminal.js    interactive resume shell (content from data.js)
js/particles.js   hero canvas animation
css/style.css     design tokens + all styling
.vscode/          launch + task configs for F5 debugging
images/           favicon + profile photo
```

## License

[MIT](LICENSE)
