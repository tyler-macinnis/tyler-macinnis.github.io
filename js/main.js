/* Main: boot sequence, typewriter, theme toggle, nav, scroll reveal */
(function () {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Boot sequence (every page load, skippable) ---------- */
    const overlay = document.getElementById("boot-overlay");
    const bootLog = document.getElementById("boot-log");

    const BOOT_LINES = [
        "[    0.000000] tyler-bios v2.0 — initializing...",
        "[    0.041337] CPU: embedded engineer detected",
        "[    0.102456] Loading kernel modules: c.ko cpp.ko python.ko",
        "[    0.184201] Mounting /dev/experience ... ok",
        "[    0.226914] Mounting /dev/skills ... ok",
        "[    0.301712] Starting reverse-engineering daemon ... ok",
        "[    0.359004] Starting ai-curiosity service ... ok",
        "[    0.420815] Network: github.com/tyler-macinnis ... linked",
        "[    0.487777] All systems nominal.",
        "",
        "Welcome to tyler-macinnis.github.io",
    ];

    function dismissBoot() {
        if (!overlay || overlay.classList.contains("done")) return;
        overlay.classList.add("done");
        overlay.addEventListener(
            "transitionend",
            () => {
                // A replay may have restarted the boot before this fade-out
                // finished — only hide if we are still dismissed.
                if (overlay.classList.contains("done")) overlay.classList.add("hidden");
            },
            { once: true }
        );
        window.removeEventListener("keydown", dismissBoot);
    }

    // Generation counter: bumping it invalidates timers from earlier runs,
    // so a skipped boot can be replayed immediately without interference.
    let bootGen = 0;

    function playBoot() {
        if (!overlay || !bootLog) return;
        const gen = ++bootGen;
        overlay.classList.remove("done", "hidden");
        bootLog.textContent = "";
        window.addEventListener("keydown", dismissBoot);

        const finish = (delay) =>
            setTimeout(() => {
                if (gen === bootGen) dismissBoot();
            }, delay);

        if (reduceMotion) {
            // Honor reduced-motion: show the full log at once, no line-by-line animation.
            bootLog.textContent = BOOT_LINES.join("\n");
            finish(3000);
        } else {
            let i = 0;
            (function nextLine() {
                if (gen !== bootGen || overlay.classList.contains("done")) return;
                if (i >= BOOT_LINES.length) {
                    finish(2200);
                    return;
                }
                bootLog.textContent += BOOT_LINES[i++] + "\n";
                setTimeout(nextLine, 200 + Math.random() * 240);
            })();
        }
    }

    // Expose for the terminal's `reboot` command and the replay button.
    window.replayBoot = playBoot;

    if (overlay && bootLog) {
        overlay.addEventListener("click", dismissBoot);
        playBoot();
    } else if (overlay) {
        overlay.classList.add("done", "hidden");
    }

    const replayBtn = document.getElementById("boot-replay");
    if (replayBtn) {
        replayBtn.addEventListener("click", playBoot);
    }

    /* ---------- Typewriter ---------- */
    const tw = document.getElementById("typewriter");
    const PHRASES =
        typeof SITE_DATA !== "undefined" && SITE_DATA.typewriterPhrases.length
            ? SITE_DATA.typewriterPhrases
            : ["Embedded Software Engineer"];

    if (tw) {
        if (reduceMotion) {
            tw.textContent = PHRASES[0];
        } else {
            let pi = 0;
            let ci = 0;
            let deleting = false;

            (function tick() {
                const phrase = PHRASES[pi];
                if (!deleting) {
                    ci++;
                    tw.textContent = phrase.slice(0, ci);
                    if (ci === phrase.length) {
                        deleting = true;
                        setTimeout(tick, 1800);
                        return;
                    }
                    setTimeout(tick, 55 + Math.random() * 50);
                } else {
                    ci--;
                    tw.textContent = phrase.slice(0, ci);
                    if (ci === 0) {
                        deleting = false;
                        pi = (pi + 1) % PHRASES.length;
                        setTimeout(tick, 350);
                        return;
                    }
                    setTimeout(tick, 28);
                }
            })();
        }
    }

    /* ---------- Theme toggle ---------- */
    const root = document.documentElement;
    const themeBtn = document.getElementById("theme-toggle");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        root.dataset.theme = savedTheme;
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const next = root.dataset.theme === "dark" ? "light" : "dark";
            root.dataset.theme = next;
            localStorage.setItem("theme", next);
        });
    }

    /* ---------- Mobile nav ---------- */
    const nav = document.querySelector(".nav");
    const navToggle = document.querySelector(".nav-toggle");

    if (nav && navToggle) {
        navToggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
        });
        nav.querySelectorAll(".nav-links a").forEach((a) =>
            a.addEventListener("click", () => {
                nav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            })
        );
    }

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    if (reduceMotion) {
        revealEls.forEach((el) => el.classList.add("visible"));
    } else {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealEls.forEach((el) => io.observe(el));
    }

    /* ---------- Footer year ---------- */
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
})();
