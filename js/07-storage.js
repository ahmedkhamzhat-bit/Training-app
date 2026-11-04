// Zapis danych: localStorage, toast, kolejka zapisu, opcjonalna baza zdalna (initDb).
'use strict';

let chain = Promise.resolve();
const timers = {};
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2800);
}
function dbWrite(id, data) {
  if (!store.col) return;
  const payload = data === null ? null : clone(data);
  chain = chain.then(() => payload === null ? store.col.doc(id).delete() : store.col.doc(id).set(payload)).catch((e) => {
    console.warn(e);
    toast(t("syncFail"));
  });
}
function later(key, fn, ms) {
  clearTimeout(timers[key]);
  timers[key] = setTimeout(fn, ms);
}
function persistMeta() {
  LS.set("tl.meta", meta);
  later("meta", () => dbWrite("meta", meta), 500);
}
function persistActive() {
  if (active) active.u = Date.now();
  LS.set("tl.active", active);
  later("active", () => dbWrite("active", active), 500);
}
function persistSessions() {
  LS.set("tl.sessions", sessions);
}
async function initDb() {
  try {
    if (!(window.claude && window.claude.use)) return;
    const r = await Promise.all([claude.use("db"), claude.use("user")]);
    const db = r[0], user = r[1];
    const id = user ? await user.id() : null;
    if (!db || !id) return;
    const col = db.collection("data/users/" + id);
    const snap = await col.get();
    const docs = {};
    snap.docs.forEach((d) => {
      docs[d.id] = d.data();
    });
    store.col = col;
    store.mode = "db";
    if (docs.meta) {
      meta = Object.assign(defMeta(), clone(docs.meta));
      normMeta();
      sessions = Object.keys(docs).filter((k) => k.indexOf("s-") === 0).map((k) => clone(docs[k]));
      if (docs.active && ui.screen !== "logger" && (!active || (docs.active.u || 0) >= (active.u || 0))) {
        active = clone(docs.active);
        fixActive();
      } else if (active) {
        dbWrite("active", active);
      }
      LS.set("tl.meta", meta);
      LS.set("tl.sessions", sessions);
      LS.set("tl.active", active);
    } else {
      dbWrite("meta", meta);
      sessions.forEach((s) => dbWrite("s-" + s.id, s));
      if (active) dbWrite("active", active);
    }
    lang = meta.lang || lang;
    if (ui.screen !== "logger" && ui.screen !== "plan") render();
  } catch (e) {
    console.warn("db unavailable", e);
  }
}
