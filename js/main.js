/* ------------------------------------------------------------------
   Shared behaviour across every page: navbar, mobile menu, active-link
   highlighting, reveal-on-scroll, avatar fallback. The background star
   field and its cursor lens live in js/starfield.js.
------------------------------------------------------------------- */

(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- hexagon intro (plays once per browser session) ---------------- */
  (function intro() {
    const already = sessionStorage.getItem("aj-intro-played");
    if (already) return;
    const overlay = document.createElement("div");
    overlay.className = "intro-overlay";
    overlay.innerHTML = `
      <svg viewBox="0 0 120 120" class="intro-hex">
        <polygon class="hex-fill" points="60,6 106,33 106,87 60,114 14,87 14,33" />
        <polygon class="hex-stroke" points="60,6 106,33 106,87 60,114 14,87 14,33" />
        <text x="60" y="63" class="hex-txt">${SITE.initials}</text>
      </svg>`;
    document.body.prepend(overlay);

    if (prefersReducedMotion) {
      sessionStorage.setItem("aj-intro-played", "1");
      overlay.remove();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const finish = () => {
      overlay.classList.add("hidden");
      document.documentElement.style.overflow = "";
      sessionStorage.setItem("aj-intro-played", "1");
      setTimeout(() => overlay.remove(), 750);
    };
    setTimeout(finish, 3600);
  })();

  /* ---------------- avatar fallback (image missing -> initials) ---------------- */
  function wireAvatarFallback(root) {
    root.querySelectorAll("img[data-avatar]").forEach((img) => {
      img.addEventListener("error", () => {
        const wrap = img.closest("[data-avatar-wrap]");
        img.remove();
        if (wrap && !wrap.querySelector(".fallback-initials")) {
          const span = document.createElement("span");
          span.className = "fallback-initials";
          span.textContent = SITE.initials;
          wrap.appendChild(span);
        }
      });
    });
  }
  wireAvatarFallback(document);

  /* ---------------- navbar: brand mark svg ---------------- */
  document.querySelectorAll("[data-brand-hex]").forEach((el) => {
    el.innerHTML = `
      <svg viewBox="0 0 40 40" class="brand-mark-svg">
        <polygon class="hex-fill" points="20,2 35,11 35,29 20,38 5,29 5,11" />
        <polygon class="hex-stroke" points="20,2 35,11 35,29 20,38 5,29 5,11" />
        <text x="20" y="21" class="hex-txt">${SITE.initials}</text>
      </svg>`;
  });

  /* ---------------- navbar scroll state ---------------- */
  const navbar = document.querySelector(".navbar");
  function onScrollNav() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------------- mobile nav toggle ---------------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
      })
    );
  }

  /* ---------------- active nav link ---------------- */
  const current = (document.body.dataset.page || "").toLowerCase();
  document.querySelectorAll(".nav-links a[data-page]").forEach((a) => {
    if (a.dataset.page === current) a.classList.add("active");
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in-view"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const group = entry.target.closest(".reveal-stagger");
              if (group) {
                [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
              }
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------------- timeline scroll-spy (experience / projects) ---------------- */
  const timelineItems = [...document.querySelectorAll(".timeline-item")];
  if (timelineItems.length) {
    let spyTicking = false;
    function updateActiveTimelineItem() {
      spyTicking = false;
      const viewportCenter = window.innerHeight / 2;
      let closest = null;
      let closestDist = Infinity;
      timelineItems.forEach((item) => {
        const r = item.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= window.innerHeight) return;
        const dist = Math.abs(r.top + r.height / 2 - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = item;
        }
      });
      timelineItems.forEach((item) => item.classList.toggle("active", item === closest));
    }
    function onSpyScroll() {
      if (spyTicking) return;
      spyTicking = true;
      requestAnimationFrame(updateActiveTimelineItem);
    }
    updateActiveTimelineItem();
    window.addEventListener("scroll", onSpyScroll, { passive: true });
    window.addEventListener("resize", onSpyScroll);
  }

  /* ---------------- liquid-glass pointer highlight ----------------
     Each .glass block carries a spotlight background layer positioned by
     --mx / --my. Only worth wiring up on a real pointer: touch has no
     hover, and the reads are throttled to one rAF frame either way. */
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    let pending = null;
    let queued = false;
    let lastGlass = null;

    const paint = () => {
      queued = false;
      if (!pending) return;
      pending.el.style.setProperty("--mx", pending.x + "%");
      pending.el.style.setProperty("--my", pending.y + "%");
      pending = null;
    };

    document.addEventListener(
      "pointermove",
      (e) => {
        const glass = e.target instanceof Element ? e.target.closest(".glass") : null;
        if (glass !== lastGlass && lastGlass) {
          lastGlass.style.removeProperty("--mx");
          lastGlass.style.removeProperty("--my");
        }
        lastGlass = glass;
        if (!glass) return;
        const r = glass.getBoundingClientRect();
        if (!r.width || !r.height) return;
        pending = {
          el: glass,
          x: (((e.clientX - r.left) / r.width) * 100).toFixed(1),
          y: (((e.clientY - r.top) / r.height) * 100).toFixed(1),
        };
        if (!queued) {
          queued = true;
          requestAnimationFrame(paint);
        }
      },
      { passive: true }
    );
  }

  /* ---------------- footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
