/* Live GitHub integration: pulls public repos + recent activity
   for SITE_DATA.githubUsername and renders them into #projects.
   Results are cached in sessionStorage for 10 minutes to stay
   well under the unauthenticated API rate limit. */
(function () {
    "use strict";

    const USER = SITE_DATA.githubUsername;
    if (!USER) return;

    const repoGrid = document.getElementById("gh-repos");
    const activityList = document.getElementById("gh-activity");
    const statusEl = document.getElementById("gh-status");
    if (!repoGrid || !activityList) return;

    const CACHE_TTL = 10 * 60 * 1000;
    const MAX_REPOS = 6;
    const MAX_EVENTS = 8;

    const LANG_COLORS = {
        C: "#555555",
        "C++": "#f34b7d",
        "C#": "#178600",
        Python: "#3572A5",
        Java: "#b07219",
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        HTML: "#e34c26",
        CSS: "#663399",
        SCSS: "#c6538c",
        Ruby: "#701516",
        Shell: "#89e051",
        PowerShell: "#012456",
        Rust: "#dea584",
        Go: "#00ADD8",
        Lua: "#000080",
        Assembly: "#6E4C13",
        Jupyter: "#DA5B0B",
    };

    function esc(s) {
        const d = document.createElement("div");
        d.textContent = s == null ? "" : String(s);
        return d.innerHTML;
    }

    function el(html) {
        const t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    }

    function relTime(iso) {
        const s = (Date.now() - new Date(iso).getTime()) / 1000;
        if (s < 60) return "just now";
        const m = s / 60;
        if (m < 60) return Math.floor(m) + "m ago";
        const h = m / 60;
        if (h < 24) return Math.floor(h) + "h ago";
        const d = h / 24;
        if (d < 30) return Math.floor(d) + "d ago";
        const mo = d / 30;
        if (mo < 12) return Math.floor(mo) + "mo ago";
        return Math.floor(mo / 12) + "y ago";
    }

    async function fetchJSON(url) {
        const key = "gh:" + url;
        try {
            const cached = JSON.parse(sessionStorage.getItem(key));
            if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;
        } catch (_) { /* ignore bad cache */ }

        const res = await fetch(url, {
            headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) throw new Error("GitHub API " + res.status);
        const data = await res.json();
        try {
            sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
        } catch (_) { /* storage full — fine */ }
        return data;
    }

    /* ---------- Repos ---------- */

    function renderRepos(repos) {
        const top = repos
            .filter((r) => !r.fork && !r.archived)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, MAX_REPOS);

        repoGrid.innerHTML = "";
        top.forEach((r) => {
            const color = LANG_COLORS[r.language] || "var(--accent)";
            repoGrid.appendChild(
                el(`
        <a class="repo-card glass" href="${esc(r.html_url)}" target="_blank" rel="noopener">
          <div class="repo-head">
            <span class="repo-name mono">${esc(r.name)}</span>
            <span class="repo-stars mono" title="Stars">★ ${r.stargazers_count}</span>
          </div>
          <p class="repo-desc">${esc(r.description || "No description yet.")}</p>
          <div class="repo-meta mono">
            ${r.language ? `<span class="repo-lang"><span class="lang-dot" style="background:${color}"></span>${esc(r.language)}</span>` : ""}
            <span class="repo-updated">updated ${relTime(r.pushed_at)}</span>
          </div>
        </a>`)
            );
        });
        return top;
    }

    /* ---------- Activity ---------- */

    function describeEvent(ev) {
        const repo = ev.repo ? ev.repo.name.replace(USER + "/", "") : "";
        const p = ev.payload || {};
        switch (ev.type) {
            case "PushEvent": {
                const n = (p.commits || []).length || 1;
                return `pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`;
            }
            case "CreateEvent":
                return p.ref_type === "repository"
                    ? `created repository ${repo}`
                    : `created ${p.ref_type} ${p.ref || ""} in ${repo}`;
            case "DeleteEvent":
                return `deleted ${p.ref_type} ${p.ref || ""} in ${repo}`;
            case "WatchEvent":
                return `starred ${ev.repo.name}`;
            case "ForkEvent":
                return `forked ${ev.repo.name}`;
            case "PullRequestEvent":
                return `${p.action} PR #${p.number} in ${repo}`;
            case "PullRequestReviewEvent":
                return `reviewed a PR in ${repo}`;
            case "IssuesEvent":
                return `${p.action} issue #${p.issue && p.issue.number} in ${repo}`;
            case "IssueCommentEvent":
                return `commented on ${repo}#${p.issue && p.issue.number}`;
            case "ReleaseEvent":
                return `released ${p.release && p.release.tag_name} of ${repo}`;
            case "PublicEvent":
                return `open-sourced ${repo}`;
            default:
                return null;
        }
    }

    function renderActivity(events) {
        const items = [];
        for (const ev of events) {
            const text = describeEvent(ev);
            if (!text) continue;
            items.push({ text, when: ev.created_at, url: "https://github.com/" + ev.repo.name });
            if (items.length >= MAX_EVENTS) break;
        }

        activityList.innerHTML = "";
        items.forEach((it) => {
            activityList.appendChild(
                el(`
        <li>
          <span class="act-dot" aria-hidden="true"></span>
          <a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.text)}</a>
          <span class="act-time mono">${relTime(it.when)}</span>
        </li>`)
            );
        });
        return items;
    }

    /* ---------- Boot ---------- */

    if (statusEl) statusEl.textContent = "[ syncing... ]";

    Promise.all([
        fetchJSON(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`),
        fetchJSON(`https://api.github.com/users/${USER}/events/public?per_page=30`),
    ])
        .then(([repos, events]) => {
            const topRepos = renderRepos(repos);
            const activity = renderActivity(events);
            // Expose for the terminal's `github` command.
            window.__GH = { repos: topRepos, activity };
            if (statusEl) statusEl.textContent = "[ live ]";
        })
        .catch(() => {
            if (statusEl) statusEl.textContent = "[ offline ]";
            repoGrid.innerHTML =
                '<p class="gh-error mono">Could not reach the GitHub API right now — ' +
                `find everything at <a href="https://github.com/${USER}" target="_blank" rel="noopener">github.com/${USER}</a>.</p>`;
            const wrap = document.getElementById("gh-activity-wrap");
            if (wrap) wrap.hidden = true;
        });
})();
