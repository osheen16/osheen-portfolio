/* ------------------------------------------------------------------
   Home-page-only interactions: staggered name reveal with an
   interactive letter-pressure effect, role typewriter, and the hero
   photo that docks into the nav corner as the user scrolls.
------------------------------------------------------------------- */

(function () {
  if (document.body.dataset.page !== "home") return;

  /* ---------------- staggered letter reveal ---------------- */
  const firstNameEl = document.getElementById("hero-first-name");
  const surnameEl = document.getElementById("hero-surname");
  let delayIndex = 0;

  function splitIntoLetters(el) {
    if (!el) return;
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "p-letter" + (ch === " " || ch === " " ? " space" : "");
      span.textContent = ch === " " ? " " : ch;
      span.style.animationDelay = `${0.45 + delayIndex * 0.045}s`;
      delayIndex++;
      el.appendChild(span);
    });
  }
  splitIntoLetters(firstNameEl);
  splitIntoLetters(surnameEl);

  /* ---------------- interactive letter pressure (mouse-proximity magnetic effect) ---------------- */
  const pressureLetters = [...document.querySelectorAll(".hero-name .p-letter")];
  if (
    pressureLetters.length &&
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const heroSection = document.querySelector(".hero");
    let mx = -9999,
      my = -9999,
      pending = false;
    const RADIUS = 170;

    function applyPressure() {
      pending = false;
      pressureLetters.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        const t = Math.max(0, 1 - dist / RADIUS);
        if (t <= 0.01) {
          el.style.transform = "";
          el.style.fontWeight = "";
          el.style.textShadow = "";
          return;
        }
        const weight = Math.round(450 + t * 260);
        const scale = 1 + t * 0.28;
        const lift = t * 6;
        el.style.fontWeight = weight;
        el.style.transform = `translateY(${-lift}px) scale(${scale})`;
        el.style.textShadow = `0 0 ${10 + t * 26}px rgba(232, 121, 249, ${0.25 + t * 0.6})`;
      });
    }

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      if (!pending) {
        pending = true;
        requestAnimationFrame(applyPressure);
      }
    }
    function onLeave() {
      mx = -9999;
      my = -9999;
      if (!pending) {
        pending = true;
        requestAnimationFrame(applyPressure);
      }
    }

    if (heroSection) {
      heroSection.addEventListener("mousemove", onMove, { passive: true });
      heroSection.addEventListener("mouseleave", onLeave, { passive: true });
    }
  }

  /* ---------------- role typewriter ---------------- */
  const roleEl = document.getElementById("hero-role-text");
  const roles = ["Full-Stack Developer", "AI/ML Engineer", "Software Developer"];
  if (roleEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ri = 0, ci = 0, deleting = false;
    function tick() {
      const word = roles[ri];
      ci += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, ci);
      let delay = deleting ? 32 : 55;
      if (!deleting && ci === word.length) { delay = 1700; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 1500);
  } else if (roleEl) {
    roleEl.textContent = roles[0];
  }

  /* ---------------- avatar docking into nav corner on scroll ---------------- */
  const avatar = document.getElementById("hero-avatar");
  const spacer = document.querySelector(".hero-avatar-spacer");
  const target = document.getElementById("nav-avatar-target");
  if (!avatar || !spacer || !target) return;

  const START_SIZE = 148;
  const END_SIZE = 42;
  const DOCK_DISTANCE = Math.max(340, window.innerHeight * 0.55);

  let naturalTop = 0, naturalLeft = 0, targetTop = 0, targetLeft = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function measure() {
    const s = spacer.getBoundingClientRect();
    naturalTop = s.top + window.scrollY;
    naturalLeft = s.left;
    const t = target.getBoundingClientRect();
    targetTop = t.top + t.height / 2 - END_SIZE / 2;
    targetLeft = t.left + t.width / 2 - END_SIZE / 2;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function apply() {
    const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, window.scrollY / DOCK_DISTANCE));
    const curTop = lerp(naturalTop - window.scrollY, targetTop, progress);
    const curLeft = lerp(naturalLeft, targetLeft, progress);
    const size = lerp(START_SIZE, END_SIZE, progress);
    avatar.style.width = size + "px";
    avatar.style.height = size + "px";
    avatar.style.transform = `translate3d(${curLeft}px, ${curTop}px, 0)`;
    avatar.style.borderWidth = lerp(2, 1.5, progress) + "px";
    avatar.style.opacity = progress > 0.985 ? "1" : "1";
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { apply(); ticking = false; });
  }

  measure();
  apply();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); apply(); });
})();
