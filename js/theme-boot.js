/* ------------------------------------------------------------------
   Runs in <head>, before the page paints, on every page.

   Works out which theme this visit should use and stamps it on <html>
   so there is never a flash of the wrong one. It looks in three places
   because localStorage is not always available: Safari (and Chrome in
   some configurations) throws on localStorage for pages opened straight
   off disk as file://, which would otherwise mean the toggle worked on
   the page you clicked it and nowhere else.

     1. ?theme= in the URL  — how js/theme.js carries the choice between
                              pages when storage is blocked
     2. localStorage        — the normal case
     3. window.name         — survives same-tab navigation with no
                              storage at all

   Falls back to the OS setting when the visitor has never chosen.
------------------------------------------------------------------- */

(function () {
  var KEY = "aj-theme";

  function fromQuery() {
    var m = /[?&]theme=(light|dark)/.exec(window.location.search || "");
    return m ? m[1] : null;
  }
  function fromStorage() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function fromWindowName() {
    var m = /aj-theme:(light|dark)/.exec(window.name || "");
    return m ? m[1] : null;
  }

  var pick = fromQuery() || fromStorage() || fromWindowName();
  var explicit = pick === "light" || pick === "dark";

  if (!explicit) {
    pick = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  document.documentElement.setAttribute("data-theme", pick);
  // handed to js/theme.js so it knows whether this was a real choice
  window.__ajTheme = { theme: pick, explicit: explicit };
})();
