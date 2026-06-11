/* Hero canvas: particle network with circuit-trace style connections */
(function () {
    "use strict";

    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = 0;
    let height = 0;
    let rafId = null;

    const DENSITY = 1 / 16000; // particles per px^2
    const MAX_PARTICLES = 110;
    const LINK_DIST = 150;
    const SPEED = 0.35;

    function accent() {
        return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2ee6a8";
    }

    function hexToRgb(hex) {
        const h = hex.replace("#", "");
        const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
        const n = parseInt(v, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
    }

    function seed() {
        const count = Math.min(Math.floor(width * height * DENSITY), MAX_PARTICLES);
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r: Math.random() * 1.6 + 0.8,
        }));
    }

    function step() {
        ctx.clearRect(0, 0, width, height);
        const [cr, cg, cb] = hexToRgb(accent());

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.65)`;
            ctx.fill();
        }

        // Circuit-trace links: orthogonal "L" segments instead of straight lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist > LINK_DIST) continue;

                const alpha = (1 - dist / LINK_DIST) * 0.22;
                ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, a.y); // horizontal then vertical, like a PCB trace
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        rafId = requestAnimationFrame(step);
    }

    function start() {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(step);
    }

    function stop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    resize();
    window.addEventListener("resize", resize);

    // Pause when hero is off-screen
    const hero = document.getElementById("hero");
    new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0 }
    ).observe(hero);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
        else start();
    });
})();
