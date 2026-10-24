/* ------------------------------------------------------------------
   Renders data.js content into whichever page includes the matching
   container element. Safe to load on every page.
------------------------------------------------------------------- */

(function () {
  const el = (id) => document.getElementById(id);

  const ICONS = {
    email:
      '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2.383V17h18V7.383l-8.445 6.13a1 1 0 0 1-1.11 0L3 7.383zM4.518 6l7.482 5.43L19.482 6H4.518z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
    scholar:
      '<svg viewBox="0 0 24 24"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 13.5L4.5 12.5V15c0 2.21 3.36 4 7.5 4s7.5-1.79 7.5-4v-2.5L12 16.5z"/></svg>',
  };

  /* ---------------- social icon links ---------------- */
  const socialTarget = el("social-target");
  if (socialTarget) {
    socialTarget.innerHTML = SOCIALS.map(
      (s) => `
      <a class="social-icon-link" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">
        <span class="social-icon-btn">${ICONS[s.key] || ""}</span>
        <span class="social-icon-label">${s.label}</span>
      </a>`
    ).join("");
  }

  /* ---------------- current role card (home) ---------------- */
  const roleTarget = el("role-card-target");
  if (roleTarget) {
    roleTarget.innerHTML = `
      <div class="role-card-top">
        <div>
          <h3>${CURRENT_ROLE.title}</h3>
          <div class="role-org">${CURRENT_ROLE.org}</div>
          <div class="role-meta">${CURRENT_ROLE.period} · ${CURRENT_ROLE.location}</div>
        </div>
        <span class="status-dot">Currently building</span>
      </div>
      <p class="blurb">${CURRENT_ROLE.blurb}</p>
    `;
  }

  /* ---------------- stats grid (home) ---------------- */
  const statsTarget = el("stats-target");
  if (statsTarget) {
    statsTarget.innerHTML = ACHIEVEMENTS.map(
      (a) => `<div class="stat-item"><div class="stat-num">${a.stat}</div><div class="stat-label">${a.label}</div></div>`
    ).join("");
  }

  /* ---------------- experience timeline ---------------- */
  const timelineTarget = el("timeline-target");
  if (timelineTarget) {
    timelineTarget.innerHTML = EXPERIENCE.map(
      (job) => `
      <div class="timeline-item reveal">
        <div class="tl-block glass glass-lift">
          <h3>${job.title}</h3>
          <div class="role-org">${job.org}</div>
          <div class="role-meta">${job.period} · ${job.location}</div>
          <div style="margin-bottom:0.9rem;">${job.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
          <ul>${job.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        </div>
      </div>`
    ).join("");
  }

  /* ---------------- projects timeline ---------------- */
  const projectsTarget = el("projects-target");
  if (projectsTarget) {
    projectsTarget.innerHTML = PROJECTS.map(
      (p) => `
      <div class="timeline-item reveal">
        <div class="tl-block glass glass-lift">
          <h3>${p.title}</h3>
          <div class="role-org">${p.context}</div>
          <div class="role-meta">${p.period}</div>
          <p style="color:var(--text-dim);font-size:0.96rem;margin:0.9rem 0 1rem;max-width:65ch;">${p.description}</p>
          ${p.pipeline ? `
            <div class="project-pipeline" style="margin:1.1rem 0 1rem;">
              <h4 style="margin:0 0 0.75rem;">Pipeline overview</h4>
              <ol style="display:grid;gap:0.65rem;padding-left:1.25rem;margin:0;">
                ${p.pipeline.map((step) => `<li><strong>${step.title}:</strong> <span style="color:var(--text-dim);">${step.detail}</span></li>`).join("")}
              </ol>
              <p style="color:var(--text-dim);font-size:0.82rem;margin-top:0.75rem;">Conceptual overview of the work described in my internship experience; individual stages may vary by experiment.</p>
            </div>` : ""}
          <div>${p.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        </div>
      </div>`
    ).join("");
  }

  /* ---------------- publications ---------------- */
  const pubsTarget = el("pubs-target");
  if (pubsTarget) {
    pubsTarget.innerHTML = PUBLICATIONS.map(
      (p) => `
      <div class="pub-card glass reveal">
        <span class="pub-status">${p.status}</span>
        <h3>${p.title}</h3>
        <div class="pub-venue">${p.venue}</div>
        <p class="pub-abstract">${p.abstract}</p>
      </div>`
    ).join("");
  }

  /* ---------------- skills ---------------- */
  const skillsTarget = el("skills-target");
  if (skillsTarget) {
    skillsTarget.innerHTML = Object.entries(SKILLS)
      .map(
        ([group, items]) => `
      <div class="skill-group glass">
        <h4>${group}</h4>
        <div>${items.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
      </div>`
      )
      .join("");
  }

  /* ---------------- education ---------------- */
  const eduTarget = el("edu-target");
  if (eduTarget) {
    eduTarget.innerHTML = EDUCATION.map(
      (e) => `
      <div class="edu-card glass reveal">
        <h3>${e.degree}</h3>
        <div class="role-org">${e.school}</div>
        <div class="role-meta">${e.period} · ${e.location}</div>
        <p style="color:var(--text-dim);margin-top:0.5rem;">${e.detail}</p>
      </div>`
    ).join("");
  }

  /* ---------------- extras ---------------- */
  const extrasTarget = el("extras-target");
  if (extrasTarget) {
    extrasTarget.innerHTML = EXTRAS.map(
      (x) => `<div class="contact-row glass"><b>${x.label}</b><span>${x.detail}</span></div>`
    ).join("");
  }

  /* ---------------- footer / meta placeholders present on every page ---------------- */
  document.querySelectorAll("[data-site-email]").forEach((n) => (n.textContent = SITE.email));
  document.querySelectorAll("[data-site-email-href]").forEach((n) => (n.href = `mailto:${SITE.email}`));
  document.querySelectorAll("[data-site-github]").forEach((n) => (n.href = SITE.github));
  document.querySelectorAll("[data-site-github-handle]").forEach((n) => (n.textContent = SITE.githubHandle));
})();
