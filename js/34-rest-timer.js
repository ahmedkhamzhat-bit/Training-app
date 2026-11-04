// Odpoczynek między seriami: stoper, dźwięk, sygnały.
'use strict';

let rest = null, audio = null;
function ensureAudio() {
  try {
    if (!audio) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) audio = new C();
    }
    if (audio && audio.state === "suspended") audio.resume();
  } catch (e) {
  }
}
function beep() {
  try {
    ensureAudio();
    if (!audio) return;
    [0, 0.22, 0.44].forEach((d) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.15;
      o.connect(g);
      g.connect(audio.destination);
      o.start(audio.currentTime + d);
      o.stop(audio.currentTime + d + 0.14);
    });
  } catch (e) {
  }
  try {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } catch (e) {
  }
}
function startRest(sec) {
  rest = { end: Date.now() + sec * 1e3, total: sec, fin: false, finAt: 0 };
  ensureAudio();
  buildRest();
}
function buildRest() {
  const el = $("#rest");
  if (!rest || ui.screen !== "logger") {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.className = "";
  el.innerHTML = '<div class="prog" id="restP"></div><div class="rt"><span class="lbl" id="restL">' + t("rest") + '</span><span class="big" id="restT"></span></div><div class="rb"><button data-act="rest-add" data-d="-15">−15</button><button data-act="rest-add" data-d="15">+15</button><button data-act="rest-skip">' + t("skip") + "</button></div>";
  tickRest();
}
function syncRest() {
  const el = $("#rest");
  if (!rest || ui.screen !== "logger") {
    el.hidden = true;
  } else if (el.hidden || !$("#restT")) {
    buildRest();
  }
}
function tickRest() {
  if (!rest) return;
  const el = $("#rest");
  const left = Math.ceil((rest.end - Date.now()) / 1e3);
  if (left <= 0 && !rest.fin) {
    rest.fin = true;
    rest.finAt = Date.now();
    beep();
    if (!el.hidden) {
      el.classList.add("fin");
      const l = $("#restL");
      if (l) l.textContent = t("restDone");
    }
  }
  if (rest.fin && Date.now() - rest.finAt > 8e3) {
    rest = null;
    el.hidden = true;
    return;
  }
  const tt = $("#restT");
  if (tt) tt.textContent = rest.fin ? "0:00" : fmtTime(left);
  const p = $("#restP");
  if (p && !rest.fin) p.style.width = Math.max(0, Math.min(100, (1 - left / rest.total) * 100)) + "%";
}
setInterval(() => {
  tickRest();
  tickSw();
  emTick();
  if (ui.screen === "logger" && active && !active.editingId) {
    const c = $("#clock");
    if (c) c.textContent = fmtTime((Date.now() - active.startedAt) / 1e3);
  }
}, 250);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    wake();
    tickRest();
    emTick();
  }
});
