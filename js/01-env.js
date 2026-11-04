// Wykrywanie safe-area (iOS): wylicza --sat/--sab, gdy CSS env() nie działa.
'use strict';

(function() {
  const r = document.documentElement, p = document.createElement("div");
  p.style.cssText = "position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)";
  document.body.appendChild(p);
  const cs = getComputedStyle(p);
  let t = parseFloat(cs.paddingTop) || 0, b = parseFloat(cs.paddingBottom) || 0;
  p.remove();
  const sa = window.navigator.standalone === true || window.matchMedia && matchMedia("(display-mode: standalone)").matches;
  const raw = [t, b];
  if (sa && !t && screen.height >= 812) {
    r.style.setProperty("--sat", "50px");
    t = 50;
  }
  if (sa && !b && screen.height >= 812) {
    r.style.setProperty("--sab", "34px");
    b = 34;
  }
  window.__ins = { raw, t, b, sa };
})();
