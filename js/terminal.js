/* Interactive fake terminal */
(function () {
    "use strict";

    const screen = document.getElementById("term-screen");
    const output = document.getElementById("term-output");
    const input = document.getElementById("term-input");
    if (!screen || !output || !input) return;

    const history = [];
    let histIdx = -1;

    const D = SITE_DATA;

    /* ---------- content (derived from js/data.js) ---------- */

    function pad(s, n) {
        return (s + " ".repeat(n)).slice(0, Math.max(n, s.length));
    }

    /* ---------- live system info (real browser APIs) ---------- */

    function bar(frac, width) {
        const w = width || 10;
        const f = isFinite(frac) ? Math.max(0, Math.min(1, frac)) : 0;
        const filled = Math.round(f * w);
        return "[" + "\u2588".repeat(filled) + "-".repeat(w - filled) + "]";
    }

    function fmtBytes(b) {
        if (!isFinite(b) || b <= 0) return "0 B";
        const units = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.min(Math.floor(Math.log2(b) / 10), units.length - 1);
        return (b / 2 ** (10 * i)).toFixed(i > 1 ? 1 : 0) + " " + units[i];
    }

    function fmtUptime(ms) {
        const s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s % 60}s`;
        return `${s}s`;
    }

    async function batteryLine() {
        if (!navigator.getBattery) return "unavailable in this browser";
        try {
            const b = await navigator.getBattery();
            const pct = Math.round(b.level * 100);
            const state = b.charging ? "charging" : "discharging";
            return `${pct}% ${bar(b.level)} (${state})`;
        } catch (_) {
            return "unavailable";
        }
    }

    async function storageLine() {
        if (!(navigator.storage && navigator.storage.estimate)) {
            return "unavailable in this browser";
        }
        try {
            const est = await navigator.storage.estimate();
            if (!est.quota) return "unavailable";
            const used = est.usage || 0;
            return `${fmtBytes(used)} used of ${fmtBytes(est.quota)} browser quota ${bar(used / est.quota)}`;
        } catch (_) {
            return "unavailable";
        }
    }

    async function systemInfo() {
        const now = new Date();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown tz";
        const langs = (D.skills.find((s) => s.group === "languages") || { items: [] }).items;
        const ram = navigator.deviceMemory
            ? `~${navigator.deviceMemory} GB ${bar(navigator.deviceMemory / 8)} (browser-reported)`
            : "unavailable in this browser";
        const cores = navigator.hardwareConcurrency
            ? navigator.hardwareConcurrency + " logical cores"
            : "unavailable";
        const display = `${screenInfo()} @${window.devicePixelRatio || 1}x`;

        const [battery, storage] = await Promise.all([batteryLine(), storageLine()]);

        const rows = [
            ["OS", "TylerOS 1.0 LTS (bare metal)"],
            ["Host", "Atlas Copco"],
            ["Kernel", "embedded-6.1.0-rt"],
            ["Shell", "resume-sh"],
            ["Languages", langs.join(", ")],
            ["Interests", "reverse engineering, AI/ML"],
            ["", ""],
            ["Time", now.toLocaleTimeString() + " (" + tz + ")"],
            ["Uptime", fmtUptime(performance.now()) + " (this page)"],
            ["Online", navigator.onLine ? "yes" : "no"],
            ["CPU", cores],
            ["RAM", ram],
            ["Battery", battery],
            ["Storage", storage],
            ["Display", display],
        ];

        return (
            "tyler@macinnis\n--------------\n" +
            rows
                .map(([k, v]) => (k ? pad(k + ":", 11) + v : ""))
                .join("\n")
        );
    }

    function screenInfo() {
        return window.screen ? `${window.screen.width}x${window.screen.height}` : "unknown";
    }

    const COMMANDS = {
        help: () =>
            [
                "Available commands:",
                "",
                "  about        who I am",
                "  experience   work history",
                "  projects     things I've built",
                "  skills       languages, tools, strengths",
                "  education    where I studied",
                "  awards       recognitions",
                "  contact      how to reach me",
                "  socials      links around the web",
                "  github       live repos + recent activity",
                "  neofetch     system + live hardware info",
                "  clear        clear the screen",
                "",
                "Tips: Up/Down for history, Tab to autocomplete.",
                "There may be one or two undocumented commands...",
            ].join("\n"),

        about: () =>
            D.about.paragraphs
                .map((p) => p.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
                .join("\n\n"),

        experience: () =>
            D.experience
                .map((j) => `[${pad(j.date.split("\u2014")[0].trim(), 14)}] ${j.title} \u00b7 ${j.org}`)
                .join("\n") + "\n\nRun 'contact' if any of this sounds useful to you.",

        projects: () =>
            D.projects
                .map((p) => {
                    const lines = [p.title + " (" + p.tags + ")", "  " + p.description];
                    if (p.link) lines.push("  -> " + p.link.url);
                    return lines.join("\n");
                })
                .join("\n\n"),

        skills: () =>
            D.skills.map((g) => pad(g.group, 11) + ": " + g.items.join(", ")).join("\n"),

        education: () =>
            D.education.map((e) => `${e.school} \u2014 ${e.degree} (${e.date})`).join("\n"),

        awards: () => D.awards.map((a) => "* " + a).join("\n"),

        contact: () =>
            ["email    : " + D.email]
                .concat(D.socials.map((s) => pad(s.label.toLowerCase(), 9) + ": " + s.url))
                .join("\n"),

        socials: () =>
            D.socials.map((s) => pad(s.label.toLowerCase(), 10) + s.url).join("\n"),

        github: () => {
            const gh = window.__GH;
            if (!gh) {
                return (
                    "GitHub data not loaded (still syncing or API unreachable).\n" +
                    "-> https://github.com/" + D.githubUsername
                );
            }
            const repos = gh.repos
                .map((r) => pad(r.name, 28) + (r.language || "") + "  \u2605 " + r.stargazers_count)
                .join("\n");
            const acts = gh.activity.map((a) => "* " + a.text).join("\n");
            return (
                "== recently active repos ==\n" + repos +
                "\n\n== recent activity ==\n" + acts +
                "\n\n-> https://github.com/" + D.githubUsername
            );
        },

        neofetch: () => systemInfo(),

        whoami: () => "tyler — but you probably knew that.",

        pwd: () => "/home/tyler/resume",

        ls: () =>
            "about.txt  experience.log  projects/  skills.json  education.md  contact.vcf",

        sudo: () => "tyler is not in the sudoers file. This incident will be reported. :)",

        hexdump: () =>
            [
                "00000000  54 79 6c 65 72 20 4d 61  63 49 6e 6e 69 73 20 2d  |Tyler MacInnis -|",
                "00000010  20 45 6d 62 65 64 64 65  64 20 53 57 20 45 6e 67  | Embedded SW Eng|",
                "00000020  69 6e 65 65 72 2e 20 52  45 20 2b 20 41 49 2e 00  |ineer. RE + AI..|",
                "00000030",
            ].join("\n"),

        exit: () => "There is no escape. Try 'clear' instead.",

        clear: null, // handled specially
    };

    const ALIASES = { man: "help", cat: "about", "?": "help", history: null };

    /* ---------- rendering ---------- */

    function esc(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function linkify(s) {
        return s.replace(
            /(https?:\/\/[^\s|]+)/g,
            '<a href="$1" target="_blank" rel="noopener">$1</a>'
        );
    }

    function print(text, cls) {
        const div = document.createElement("div");
        div.className = "t-line" + (cls ? " " + cls : "");
        div.innerHTML = linkify(esc(text));
        output.appendChild(div);
    }

    function printPrompt(cmd) {
        const div = document.createElement("div");
        div.className = "t-line";
        div.innerHTML =
            '<span class="t-accent">tyler@macinnis:~$</span> <span class="t-cmd">' +
            esc(cmd) +
            "</span>";
        output.appendChild(div);
    }

    function scrollToBottom() {
        screen.scrollTop = screen.scrollHeight;
    }

    /* ---------- execution ---------- */

    function run(raw) {
        const cmd = raw.trim();
        printPrompt(cmd);
        if (!cmd) {
            scrollToBottom();
            return;
        }

        history.push(cmd);
        histIdx = history.length;

        const name = cmd.split(/\s+/)[0].toLowerCase();
        const resolved = name in ALIASES ? ALIASES[name] : name;

        if (resolved === "clear") {
            output.innerHTML = "";
            return;
        }
        if (name === "history") {
            print(history.map((h, i) => String(i + 1).padStart(4) + "  " + h).join("\n"));
            scrollToBottom();
            return;
        }

        const handler = COMMANDS[resolved];
        if (handler) {
            const result = handler();
            if (result && typeof result.then === "function") {
                // Async command (e.g. neofetch querying hardware APIs)
                result
                    .then((text) => print(text))
                    .catch(() => print("resume-sh: command failed", "t-err"))
                    .finally(() => scrollToBottom());
            } else {
                print(result);
            }
        } else {
            print(`resume-sh: command not found: ${name}`, "t-err");
            print("Type 'help' for a list of commands.", "t-dim");
        }
        scrollToBottom();
    }

    /* ---------- input handling ---------- */

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            run(input.value);
            input.value = "";
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (histIdx > 0) {
                histIdx--;
                input.value = history[histIdx];
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (histIdx < history.length - 1) {
                histIdx++;
                input.value = history[histIdx];
            } else {
                histIdx = history.length;
                input.value = "";
            }
        } else if (e.key === "Tab") {
            e.preventDefault();
            const partial = input.value.trim().toLowerCase();
            if (!partial) return;
            const names = Object.keys(COMMANDS).concat(Object.keys(ALIASES));
            const matches = names.filter((n) => n.startsWith(partial));
            if (matches.length === 1) {
                input.value = matches[0];
            } else if (matches.length > 1) {
                printPrompt(input.value);
                print(matches.sort().join("  "), "t-dim");
                scrollToBottom();
            }
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            output.innerHTML = "";
        }
    });

    // Click anywhere in the terminal focuses the input
    screen.addEventListener("click", () => input.focus());

    /* ---------- welcome banner ---------- */

    print("resume-sh v1.0.0 — Tyler MacInnis", "t-accent");
    print("Type 'help' to see available commands.\n", "t-dim");
})();
