# tyler-macinnis.github.io

<!-- GitHub has no markdown syntax for centered content; a div is the only way. -->
<!-- markdownlint-disable MD033 -->
<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=24&pause=1200&color=2EE6A8&center=true&vCenter=true&width=560&lines=Tyler+MacInnis;Embedded+Software+Engineer;Reverse+Engineering+%2B+AI;An+interactive+terminal-themed+resume)](https://tyler-macinnis.github.io/)

[![Live Site](https://img.shields.io/badge/%F0%9F%9F%A2_VISIT_THE_LIVE_SITE-tyler--macinnis.github.io-2ee6a8?style=for-the-badge&labelColor=0a0e14)](https://tyler-macinnis.github.io/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-663399?style=flat&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat&logo=githubpages&logoColor=white)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-2ee6a8?style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat)

My personal portfolio — an interactive, terminal-themed resume built entirely from scratch
with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, zero dependencies.

</div>
<!-- markdownlint-restore -->

## Features

- **Boot sequence intro** — a kernel-style boot log plays on first visit (skippable, once per session)
- **Interactive terminal** — a fake shell with command history, tab completion, and a few
  undocumented easter eggs (`help` to start, `sudo` at your own risk)
- **Circuit-trace hero canvas** — particle network rendered with orthogonal PCB-style traces
- **Live GitHub integration** — recently active repos and activity feed pulled from the GitHub
  API at page load (cached, with graceful offline fallback)
- **Glassmorphism design system** — dark-first with a persistent light/dark toggle
- **Fully responsive & accessible** — semantic HTML, reduced-motion support, keyboard friendly

> [!TIP]
> Open the [live site](https://tyler-macinnis.github.io/) and type `neofetch` in the terminal
> to see your own machine's battery, RAM, and storage stats rendered in the shell.

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
