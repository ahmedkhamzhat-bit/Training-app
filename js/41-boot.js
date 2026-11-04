// Start aplikacji: zdarzenia globalne, migracja nazw, pierwsze renderowanie.
'use strict';

$("#photoIn").addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if (f) processPhoto(f);
});
$("#csvIn").addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!f) return;
  let txt = "";
  try {
    txt = await f.text();
  } catch (_) {
  }
  importCsvText(txt);
});
$("#importIn").addEventListener("change", async (e) => {
  const f = e.target.files && e.target.files[0];
  e.target.value = "";
  if (!f) return;
  let txt = "";
  try {
    txt = await f.text();
  } catch (_) {
  }
  importText(txt);
});
document.addEventListener("focusin", (e) => {
  const k = e.target.dataset && e.target.dataset.k;
  if (active && ui.screen === "logger" && (k === "kg" || k === "val" || k === "rir" || k === "rest" || k === "ex-name")) pushUndo();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target && e.target.id === "pkIn") {
    const b = $("#pkNew");
    if (b && !b.hidden) b.click();
    e.preventDefault();
  }
});
function migNames() {
  try {
    const fix = (e) => {
      if (e && e.name) {
        const d = libDisp(e.name);
        if (d !== e.name && ckey(d) === ckey(e.name)) {
          e.name = d;
          return true;
        }
      }
      return false;
    };
    let a = false, b = false;
    sessions.forEach((x) => (x.exercises || []).forEach((e) => {
      if (fix(e)) a = true;
    }));
    (meta.plans || []).forEach((x) => (x.exercises || []).forEach((e) => {
      if (fix(e)) b = true;
    }));
    if (active && active.exercises) active.exercises.forEach((e) => {
      if (fix(e)) b = true;
    });
    meta.recentEx = (meta.recentEx || []).map((n) => libDisp(n));
    if (a) persistSessions();
    if (a || b) {
      persistMeta();
      if (active) persistActive();
    }
  } catch (e) {
  }
}
migNames();
render();
initDb();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {
});
snapSave().catch(() => {
});
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {
  }));
}
