/* ------------------------------------------------------------------
   Resume page: a little file-tree "codebase" of the resume. Click a
   file, the editor pane renders that section — styled differently
   per file type (prose / experience / key-value / grouped / chips).
------------------------------------------------------------------- */

(function () {
  if (document.body.dataset.page !== "resume") return;
  const fileListEl = document.getElementById("resume-files");
  const bodyEl = document.getElementById("resume-editor-body");
  const tabNameEl = document.getElementById("resume-editor-tab-name");
  const statusEl = document.getElementById("resume-statusbar");
  if (!fileListEl || !bodyEl || typeof RESUME_FILES === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TYPE_COLORS = { md: "#7dd3fc", js: "#f4d35e", yaml: "#d0a3ff", json: "#f5a35c" };

  fileListEl.innerHTML = RESUME_FILES.map(
    (f, i) => `
    <button class="resume-file" data-index="${i}" type="button">
      <span class="resume-file-dot" style="background:${TYPE_COLORS[f.type] || "#888"}"></span>
      <span>${f.name}</span>
    </button>`
  ).join("");

  function renderProse(file) {
    return `<p class="resume-prose" id="resume-prose-target"></p>`;
  }
  function renderExperience(file) {
    return file.entries
      .map(
        (e) => `
      <div class="resume-entry">
        <h3>${e.title}</h3>
        ${e.org ? `<div class="resume-entry-org">${e.org}</div>` : ""}
        <div class="resume-entry-meta">${e.period}${e.location ? " · " + e.location : ""}</div>
        ${e.blurb ? `<p class="resume-entry-blurb">${e.blurb}</p>` : ""}
        <ul class="resume-entry-points">${e.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>`
      )
      .join("");
  }
  function renderKeyValue(file) {
    return file.entries
      .map(
        (e) => `
      <div class="resume-kv-block">
        ${Object.entries(e)
          .map(([k, v]) => `<div class="resume-kv-row"><span class="resume-kv-key">${k}:</span><span class="resume-kv-val">${v}</span></div>`)
          .join("")}
      </div>`
      )
      .join("");
  }
  function renderEducation(file) {
    return file.entries.map((e) => `
      <div class="resume-kv-block resume-education-block">
        <div class="resume-education-degree">${e.degree}${e.result ? ` <span>(${e.result})</span>` : ""}</div>
        <div class="resume-education-school">${e.school}</div>
        <div class="resume-education-years">${e.years}</div>
      </div>`).join("");
  }
  function renderGroups(file) {
    return `<div class="resume-json-brace">{</div>${file.groups
      .map(
        (g) => `
      <div class="resume-group">
        <div class="resume-group-label">"${g.label}":</div>
        <ul>${g.items.map((it) => `<li>${it}</li>`).join("")}</ul>
      </div>`
      )
      .join("")}<div class="resume-json-brace">}</div>`;
  }
  function renderChips(file) {
    return `<div class="resume-json-brace">[</div><div class="resume-chip-row">${file.items
      .map((s) => `<span class="chip">"${s}"</span>`)
      .join("")}</div><div class="resume-json-brace">]</div>`;
  }

  const RENDERERS = { prose: renderProse, experience: renderExperience, keyvalue: renderKeyValue, education: renderEducation, groups: renderGroups, chips: renderChips };

  function typewriterInto(el, text) {
    if (reduceMotion) {
      el.textContent = text;
      return;
    }
    el.textContent = "";
    let i = 0;
    const step = () => {
      i += 3;
      el.textContent = text.slice(0, i);
      if (i < text.length) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function openFile(index) {
    const file = RESUME_FILES[index];
    if (!file) return;
    [...fileListEl.children].forEach((el, i) => el.classList.toggle("active", i === index));
    if (tabNameEl) tabNameEl.textContent = file.name;
    if (statusEl) statusEl.textContent = `${file.type.toUpperCase()} · UTF-8 · ${file.name}`;

    const html = RENDERERS[file.render] ? RENDERERS[file.render](file) : "";
    const swap = () => {
      bodyEl.innerHTML = html;
      bodyEl.classList.remove("swapping");
      if (file.render === "prose") {
        const target = document.getElementById("resume-prose-target");
        if (target) typewriterInto(target, file.content);
      }
    };
    if (reduceMotion) {
      swap();
    } else {
      bodyEl.classList.add("swapping");
      setTimeout(swap, 150);
    }
  }

  fileListEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".resume-file");
    if (!btn) return;
    openFile(Number(btn.dataset.index));
  });

  openFile(0);
})();
