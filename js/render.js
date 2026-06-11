/* Renders SITE_DATA (js/data.js) into the page.
   You should not need to edit this file to update content. */
(function () {
    "use strict";

    const D = SITE_DATA;

    function esc(s) {
        const d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    function el(html) {
        const t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstElementChild;
    }

    const ICONS = {
        truck:
            '<svg class="project-icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        bot:
            '<svg class="project-icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="6" width="16" height="12" rx="2"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><path d="M12 6V3M8 21h8"/></svg>',
        chip:
            '<svg class="project-icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
        code:
            '<svg class="project-icon" viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>',
    };

    const GITHUB_SVG =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.12 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>';

    /* ---------- About ---------- */
    const aboutText = document.querySelector(".about-text");
    if (aboutText) {
        const photo = document.querySelector(".about-photo");
        if (photo) {
            photo.src = D.about.photo;
            photo.alt = "Portrait of " + D.name;
        }
        aboutText.innerHTML =
            D.about.paragraphs.map((p) => `<p>${p}</p>`).join("") +
            `<ul class="about-facts mono">` +
            D.about.facts
                .map(
                    (f) =>
                        `<li><span class="fact-key">${esc(f.key)}</span>= ${esc(f.value)}</li>`
                )
                .join("") +
            `</ul>`;
    }

    /* ---------- Experience timeline ---------- */
    const timeline = document.querySelector(".timeline");
    if (timeline) {
        timeline.innerHTML = "";
        D.experience.forEach((job) => {
            timeline.appendChild(
                el(`
        <article class="tl-item reveal">
          <div class="tl-marker" aria-hidden="true"></div>
          <div class="tl-card glass">
            <header class="tl-head">
              <h3>${esc(job.title)}</h3>
              <p class="tl-org">${esc(job.org)}</p>
              <p class="tl-date mono">${esc(job.date)}</p>
            </header>
            <ul>${job.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          </div>
        </article>`)
            );
        });
    }

    /* ---------- Projects ---------- */
    const projectGrid = document.querySelector(".project-grid");
    if (projectGrid) {
        projectGrid.innerHTML = "";
        D.projects.forEach((p) => {
            const linkHtml = p.link
                ? `<a class="project-link mono" href="${esc(p.link.url)}" target="_blank" rel="noopener">${GITHUB_SVG} ${esc(p.link.label)}</a>`
                : "";
            projectGrid.appendChild(
                el(`
        <article class="project-card glass reveal">
          <div class="project-top">
            ${ICONS[p.icon] || ICONS.code}
            <span class="project-tags mono">${esc(p.tags)}</span>
          </div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          ${linkHtml}
        </article>`)
            );
        });
    }

    /* ---------- Skills ---------- */
    const skillsGrid = document.querySelector(".skills-grid");
    if (skillsGrid) {
        skillsGrid.innerHTML = "";
        D.skills.forEach((g) => {
            skillsGrid.appendChild(
                el(`
        <div class="skill-group glass reveal">
          <h3 class="mono">&gt; ${esc(g.group)}</h3>
          <ul class="chips">${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        </div>`)
            );
        });
    }

    /* ---------- Education & Awards ---------- */
    const eduGrid = document.querySelector(".edu-grid");
    if (eduGrid) {
        eduGrid.innerHTML = "";
        D.education.forEach((e) => {
            const linkLabel = e.link ? new URL(e.link).hostname.replace(/^www\./, "") : "";
            eduGrid.appendChild(
                el(`
        <div class="edu-card glass reveal">
          <h3>${esc(e.school)}</h3>
          ${e.link ? `<p class="tl-org"><a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(linkLabel)}</a></p>` : ""}
          <p>${esc(e.degree)}</p>
          <p class="tl-date mono">${esc(e.date)}</p>
        </div>`)
            );
        });
        eduGrid.appendChild(
            el(`
      <div class="edu-card glass reveal">
        <h3>Awards</h3>
        <ul>${D.awards.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
      </div>`)
        );
    }

    const hobbiesList = document.querySelector(".more-about .chips");
    if (hobbiesList) {
        hobbiesList.innerHTML = D.hobbies.map((h) => `<li>${esc(h)}</li>`).join("");
    }

    /* ---------- Contact ---------- */
    const contactCard = document.querySelector(".contact-card");
    if (contactCard) {
        contactCard.innerHTML =
            `<p class="mono contact-line">$ mail -s "hello" ${esc(D.email)}</p>` +
            `<p>${esc(D.contact.blurb)}</p>` +
            `<a class="btn btn-primary" href="mailto:${esc(D.email)}">Say Hello</a>` +
            `<div class="contact-socials">` +
            D.socials
                .map(
                    (s) =>
                        `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`
                )
                .join("") +
            `</div>`;
    }
})();
