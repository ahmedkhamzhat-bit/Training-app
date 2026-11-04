// Automatyczne kopie lokalne: raz dziennie migawka danych w IndexedDB (ostatnie SNAP_KEEP), lista i przywracanie.
'use strict';

const SNAP_KEEP = 14;

function snapDb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("tl-backup", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("snaps", { keyPath: "date" });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function snapList() {
  try {
    const db = await snapDb();
    return await new Promise((res) => {
      const q = db.transaction("snaps").objectStore("snaps").getAll();
      q.onsuccess = () => res(q.result.sort((a, b) => b.date.localeCompare(a.date)));
      q.onerror = () => res([]);
    });
  } catch (e) {
    return [];
  }
}

// Zapisuje migawkę pod podanym kluczem (domyślnie: dzisiejsza data) i przycina stare.
async function snapSave(key, overwrite) {
  if (!sessions.length && !meta.plans.length) return;
  const db = await snapDb();
  const date = key || todayStr();
  if (!overwrite) {
    const have = await new Promise((res) => {
      const q = db.transaction("snaps").objectStore("snaps").get(date);
      q.onsuccess = () => res(!!q.result);
      q.onerror = () => res(false);
    });
    if (have) return;
  }
  const snap = { date: date, at: Date.now(), n: sessions.length, meta: clone(meta), sessions: clone(sessions) };
  await new Promise((res) => {
    const tx = db.transaction("snaps", "readwrite");
    tx.objectStore("snaps").put(snap);
    tx.oncomplete = res;
    tx.onerror = res;
  });
  const all = (await snapList()).filter((s) => s.date.indexOf("~") < 0);
  const old = all.slice(SNAP_KEEP);
  if (old.length) {
    await new Promise((res) => {
      const tx = db.transaction("snaps", "readwrite");
      old.forEach((s) => tx.objectStore("snaps").delete(s.date));
      tx.oncomplete = res;
      tx.onerror = res;
    });
  }
}

async function snapRender() {
  const box = $("#snapList");
  if (!box) return;
  const L = await snapList();
  if (!$("#snapList")) return;
  box.innerHTML = L.length ? L.map((s) => {
    const pre = s.date.indexOf("~") >= 0;
    return '<div class="row"><div class="grow"><div class="pn">' + fmtDate(s.date.slice(0, 10)) + (pre ? ' <span class="tag">' + t("snapPre") + "</span>" : "") + '</div><div class="sub">' + cnt("wk", s.n) + '</div></div><button class="btn sm" data-act="snap-restore" data-d="' + esc(s.date) + '">' + t("snapRestore") + "</button></div>";
  }).join("") : '<p class="hint">' + t("snapNone") + "</p>";
}

async function snapRestore(date) {
  const L = await snapList();
  const s = L.find((x) => x.date === date);
  if (!s) return;
  const ok = await ask(t("snapQ", { d: fmtDate(s.date.slice(0, 10)), n: cnt("wk", s.n) }), t("snapRestore"), true);
  if (!ok) return;
  await snapSave(todayStr() + "~", true);
  applyImport({ meta: s.meta, sessions: s.sessions });
  toast(t("snapDone"));
}
