// Lista planów, foldery, znaczniki typu, rozciąganie i tryb EMOM.
'use strict';

function planListHtml(qs) {
  let h = "";
  const q = String(qs || "").trim().toLowerCase();
  const mt = (p) => !q || (p.name + " " + (p.folder || "") + " " + p.exercises.map((e) => e.name).join(" ")).toLowerCase().includes(q);
  const act = meta.plans.filter((p) => !p.archived && mt(p)), arch = meta.plans.filter((p) => p.archived && mt(p));
  const names = [...new Set((q ? [] : meta.folders || []).concat(act.map((p) => p.folder || "")))].sort((a, b) => a === "" ? -1 : b === "" ? 1 : a.localeCompare(b, lang));
  const hasF = names.some((f) => f);
  if (!act.length && !hasF) h += '<p class="empty">' + t(q ? "noMatch" : meta.plans.length ? "allArchived" : "noPlans") + "</p>";
  names.forEach((f) => {
    const L = act.filter((p) => (p.folder || "") === f);
    if (f === "" && !L.length) return;
    const op = !f || !!q || !!(ui.fopen && ui.fopen[f]);
    if (hasF) h += '<div class="fhead">' + (f ? '<button class="fbtn grow" data-act="folder-toggle" data-f="' + esc(f) + '" aria-expanded="' + op + '"><span class="chev">' + (op ? "▾" : "▸") + '</span><span class="lbl">' + esc(f) + " (" + L.length + ")</span></button>" : '<span class="grow"></span>') + (f ? '<button class="icon" data-act="plan-new" data-f="' + esc(f) + '" aria-label="' + esc(t("newPlan")) + '">+</button><button class="icon" data-act="folder-menu" data-f="' + esc(f) + '" aria-label="' + esc(t("folderMenu")) + '">⋯</button>' : "") + "</div>";
    if (op && L.length) h += '<ul class="rows">' + L.map((p) => planRow(p, false)).join("") + "</ul>";
    if (f && op && !L.length) h += '<p class="empty" style="padding:8px 0">' + t("folderEmpty") + "</p>";
  });
  if (arch.length) {
    h += '<button class="row archh" data-act="arch-toggle"><span class="lbl grow">' + t("archive") + " (" + arch.length + ')</span><span class="chev">' + (ui.showArch ? "▾" : "▸") + "</span></button>";
    if (ui.showArch) h += '<ul class="rows">' + arch.map((p) => planRow(p, true)).join("") + "</ul>";
  }
  return h;
}
function isSt(s) {
  return !!s && s.kind === "stretch";
}
function trSess() {
  return sessions.filter((x) => !isSt(x));
}
function stretchCtx() {
  return false;
}
function stCount(a, b) {
  return sessions.filter((x) => isSt(x) && (!a || x.date > a) && (!b || x.date <= b)).length;
}
function kindTag(s) {
  if (s && s.kind === "counter") return ' <span class="tag">' + t("ctTag") + "</span>";
  return s && s.kind === "stretch" ? ' <span class="tag">' + t("kStretch") + "</span>" : s && s.kind === "emom" ? ' <span class="tag">EMOM</span>' : "";
}
function nkS() {
  return false;
}
function openFolderNew() {
  sheet("<h2>" + t("newFolder") + '</h2><div class="fld"><input id="fnIn" maxlength="40" placeholder="' + esc(t("folderPh")) + '" autocomplete="off"></div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="folder-add">' + t("save") + "</button></div>");
  setTimeout(() => {
    const i = $("#fnIn");
    if (i) i.focus();
  }, 60);
}
function openFolderMenu(f) {
  sheet("<h2>" + esc(f) + '</h2><div class="fld"><label class="lbl" for="fnIn">' + t("folderRename") + '</label><input id="fnIn" maxlength="40" value="' + esc(f) + '" autocomplete="off"></div><div class="btns" style="margin-top:14px"><button class="btn" data-act="folder-save" data-f="' + esc(f) + '">' + t("save") + '</button><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button></div><div style="margin-top:14px"><button class="link danger" data-act="folder-del" data-f="' + esc(f) + '">' + t("folderDel") + "</button></div>");
}
function emMs() {
  const e = active && active.em;
  if (!e) return 0;
  return e.run ? Date.now() - e.t0 : e.el;
}
function emList() {
  return active ? active.exercises.filter((e) => e.ek === "emom") : [];
}
function emRebuild() {
  const l = emList();
  if (!l.length) {
    delete active.em;
    return;
  }
  if (!active.em) active.em = { every: 60, rounds: 10, run: false, t0: 0, el: 0, k: 0 };
  const R = active.em.rounds;
  l.forEach((ex, i) => {
    const c = Math.max(0, Math.floor((R - i + l.length - 1) / l.length));
    if (!(pn(ex.tv) > 0)) ex.tv = 10;
    while (ex.sets.length < c) ex.sets.push({ kg: "", val: "", rir: "", rest: null, done: false, ty: "n" });
    if (ex.sets.length > c) ex.sets = ex.sets.filter((q, k) => k < c || q.done || pn(q.val) > 0).slice(0, Math.max(c, ex.sets.filter((q) => q.done).length));
  });
}
function emDone(m) {
  const L = emList(), n = L.length, ex = L[m % n];
  if (!ex) return;
  const st = ex.sets[Math.floor(m / n)];
  if (!st || st.done) return;
  if (!(pn(st.val) > 0) && pn(ex.tv) > 0) st.val = String(ex.tv);
  if (pn(st.val) > 0) {
    st.done = true;
    st.at = Date.now();
  }
}
function emUpdate() {
  const e = active && active.em;
  if (!e || ui.screen !== "logger") return;
  const ms = emMs(), ev = e.every * 1e3, fin = ms >= e.rounds * ev, m = fin ? e.rounds : Math.floor(ms / ev), L = emList(), n = L.length || 1;
  const lab = (i) => {
    const ex = L[i % n];
    if (!ex) return "";
    const st = ex.sets[Math.floor(i / n)], kg = st && pn(st.kg) > 0 ? " · " + (ex.bw ? "+" : "") + fmtN(wv(pn(st.kg))) + " " + uW() : "";
    return ex.name + " · " + (pn(ex.tv) > 0 ? ex.mode === "time" ? fmtN(pn(ex.tv)) + " s" : "×" + fmtN(pn(ex.tv)) : "") + kg;
  };
  const left = fin ? 0 : Math.ceil((ev - ms % ev) / 1e3), set = (id, v) => {
    const x = document.getElementById(id);
    if (x && x.textContent !== v) x.textContent = v;
  };
  set("emRound", fin ? t("emFin") : t("emRound", { a: m + 1, b: e.rounds }));
  set("emNow", fin ? t("emFinMsg") : lab(m));
  set("emClock", fmtTime(left));
  set("emNext", !fin && m + 1 < e.rounds ? t("emNext", { n: lab(m + 1) }) : "");
  const bar = document.getElementById("emBar");
  if (bar) bar.style.width = (fin ? 100 : Math.max(0, Math.min(100, ms % ev / ev * 100))) + "%";
  set("emBtn", e.run ? t("emPause") : ms > 0 && !fin ? t("emResume") : t("emStart"));
}
function emTick() {
  const e = active && active.em;
  if (!e) return;
  if (e.run) {
    const ms = Date.now() - e.t0, ev = e.every * 1e3, idx = Math.min(e.rounds, Math.floor(ms / ev));
    if (idx > e.k) {
      for (let m = e.k; m < idx; m++) emDone(m);
      e.k = idx;
      if (idx >= e.rounds) {
        e.run = false;
        e.el = e.rounds * ev;
        toast(t("emFinMsg"));
      }
      persistActive();
      beep();
      const ae = document.activeElement;
      if (!(ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) render();
    }
  }
  emUpdate();
}
