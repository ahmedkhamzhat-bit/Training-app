// Arkusze (modale z dołu), okno potwierdzenia ask(), dopasowanie do klawiatury.
'use strict';

function sheet(html) {
  const w = document.createElement("div");
  w.className = "sw";
  w.innerHTML = '<div class="sbg" data-act="sheet-close"></div><div class="sh" role="dialog" aria-modal="true">' + html + "</div>";
  document.body.appendChild(w);
  enhanceDates(w);
  return w;
}
const closeSheets = () => document.querySelectorAll(".sw").forEach((n) => n.remove());
function kbFit() {
  const v = window.visualViewport;
  if (!v) return;
  document.querySelectorAll(".sw.kb").forEach((w) => {
    w.style.top = v.offsetTop + "px";
    w.style.height = v.height + "px";
  });
}
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", kbFit);
  window.visualViewport.addEventListener("scroll", kbFit);
}
function kbSheet(html) {
  const w = sheet(html);
  w.classList.add("kb");
  const h = w.querySelector(".sh");
  if (h) h.classList.add("fix");
  kbFit();
  return w;
}
function ask(msg, ok, danger) {
  return new Promise((res) => {
    const w = sheet('<p class="q">' + esc(msg) + '</p><div class="btns"><button class="btn ghost" data-r="0">' + esc(t("cancel")) + '</button><button class="btn' + (danger ? " dng" : "") + '" data-r="1">' + esc(ok) + "</button></div>");
    w.addEventListener("click", (e) => {
      const b = e.target.closest("[data-r]");
      if (b) {
        w.remove();
        res(b.dataset.r === "1");
      } else if (e.target.classList.contains("sbg")) {
        w.remove();
        res(false);
      }
    });
  });
}
