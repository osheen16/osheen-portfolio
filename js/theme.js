/* ------------------------------------------------------------------
   Dark / light mode.

   Dark is the original site: black canvas, neon purple, the revolving
   star field with its gravitational-lens cursor. Light is a paper-white
   violet-tinted theme whose background effect is the rainbow fluid the
   cursor spills (js/fluid-cursor.js) — only one of the two effects ever
   runs, so the idle one costs nothing.

   js/theme-boot.js has already applied the theme in <head>. This file
   owns the toggle, the effect swap, and making the choice stick across
   pages. Sticking is the fiddly part: localStorage is unavailable on
   file:// in some browsers, so the choice is also written to
   window.name (survives same-tab navigation) and, when storage really
   is blocked, stamped onto every internal link as ?theme=.
------------------------------------------------------------------- */

(function () {
  const STORE_KEY = "aj-theme";
  const root = document.documentElement;
  const boot = window.__ajTheme || { theme: "dark", explicit: false };

  let chosen = boot.explicit; // has the visitor picked a side?

  /* ---------------- persistence, with fallbacks ---------------- */
  function writeStorage(theme) {
    try {
      localStorage.setItem(STORE_KEY, theme);
      return localStorage.getItem(STORE_KEY) === theme;
    } catch (e) {
      return false;
    }
  }

  function readStorage() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  // window.name rides along with the tab through navigations even when
  // no storage of any kind is available
  function writeWindowName(theme) {
    try {
      const cleaned = (window.name || "").replace(/\s*aj-theme:(light|dark)/g, "");
      window.name = (cleaned + " aj-theme:" + theme).trim();
    } catch (e) { /* nothing else to try */ }
  }

  // last resort: carry the choice in the URL of every link that stays on
  // this site, so a fresh document in a new tab still gets it
  function stampLinks(theme) {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return;
      const [path, hash] = href.split("#");
      const [file, query] = path.split("?");
      if (!/\.html?$/i.test(file)) return;
      const params = (query || "")
        .split("&")
        .filter((p) => p && !/^theme=/.test(p));
      params.push("theme=" + theme);
      a.setAttribute("href", file + "?" + params.join("&") + (hash ? "#" + hash : ""));
    });
  }

  function persist(theme) {
    const stored = writeStorage(theme);
    writeWindowName(theme);
    if (!stored) stampLinks(theme);
    return stored;
  }

  /* ---------------- background effects follow the theme ---------------- */
  function applyEffects(theme) {
    if (theme === "light") {
      if (window.Starfield) window.Starfield.stop();
      if (window.FluidCursor) window.FluidCursor.start();
    } else {
      if (window.FluidCursor) window.FluidCursor.stop();
      if (window.Starfield) window.Starfield.start();
    }
  }

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function setTheme(theme, fromUser) {
    root.setAttribute("data-theme", theme);
    if (fromUser) {
      chosen = true;
      persist(theme);
    }
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
      btn.setAttribute("aria-pressed", String(theme === "light"));
    });
    applyEffects(theme);
  }

  /* ---------------- the toggle button, built into every navbar ---------------- */
  const SUN = '<svg viewBox="0 0 24 24" class="theme-icon sun" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><g class="rays"><path d="M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></g></svg>';
  const MOON = '<svg viewBox="0 0 24 24" class="theme-icon moon" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>';

  document.querySelectorAll(".nav-right").forEach((slot) => {
    if (slot.querySelector("[data-theme-toggle]")) return;
    const btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.setAttribute("data-theme-toggle", "");
    btn.innerHTML = SUN + MOON;
    slot.insertBefore(btn, slot.firstChild);
    btn.addEventListener("click", () => {
      setTheme(current() === "light" ? "dark" : "light", true);
    });
  });

  /* ---------------- boot ---------------- */
  setTheme(boot.theme, false);

  // The visitor arrived with a choice already made (URL or window.name)
  // but this browser will not store it — keep it travelling on the links.
  if (chosen && readStorage() !== boot.theme) {
    writeWindowName(boot.theme);
    if (!writeStorage(boot.theme)) stampLinks(boot.theme);
  }

  // never chosen a side -> keep following the OS
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const onSystemChange = () => {
    if (chosen) return;
    setTheme(media.matches ? "light" : "dark", false);
  };
  if (media.addEventListener) media.addEventListener("change", onSystemChange);
  else if (media.addListener) media.addListener(onSystemChange);
})();
