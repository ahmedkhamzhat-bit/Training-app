// Wybór ćwiczeń do planu: filtry, grupy, lista z bazy, własne ćwiczenia.
'use strict';

function exUsage() {
  const m = {};
  const add = (n) => {
    const k = norm(n);
    if (!k) return;
    if (!m[k]) m[k] = { name: String(n).trim(), n: 0 };
    m[k].n++;
  };
  const sc = stretchCtx();
  if (sc) {
    sessions.forEach((s) => s.exercises.forEach((e) => add(e.name)));
    meta.plans.forEach((p) => p.exercises.forEach((e) => add(e.name)));
    return Object.keys(m).map((k) => m[k]).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, lang));
  }
  const lib = {};
  exLibNames().forEach((n) => {
    lib[norm(n)] = n;
  });
  sessions.forEach((s) => s.exercises.forEach((e) => {
    const k = norm(e.name);
    if (lib[k]) add(lib[k]);
  }));
  meta.plans.forEach((p) => p.exercises.forEach((e) => {
    const k = norm(e.name);
    if (lib[k]) add(lib[k]);
  }));
  Object.keys(lib).forEach((k) => {
    if (!m[k]) m[k] = { name: lib[k], n: 0 };
  });
  return Object.keys(m).map((k) => m[k]).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, lang));
}
const CXT = { wr: { mode: "reps", bw: false, nw: false }, bwr: { mode: "reps", bw: true, nw: true }, wbw: { mode: "reps", bw: true, nw: false }, dur: { mode: "time", bw: false, nw: true }, durw: { mode: "time", bw: false, nw: false } };
function exDefaults(name) {
  const xi = meta.exInfo && meta.exInfo[ckey(name)];
  if (xi && CXT[xi.ty]) {
    const c = CXT[xi.ty];
    return { mode: c.mode, bw: c.bw, nw: c.nw, sets: 3 };
  }
  const lp = lastPerf(name);
  if (lp) return { mode: lp.ex.mode === "time" ? "time" : "reps", bw: !!lp.ex.bw, sets: Math.max(1, lp.ex.sets.filter((x) => x.ty !== "w").length) };
  for (const p of meta.plans) {
    const e = p.exercises.find((x) => norm(x.name) === norm(name));
    if (e) return { mode: e.mode, bw: !!e.bw, sets: e.sets };
  }
  const l2 = LIB2[ckey(name)];
  if (l2 && CXT[l2.ty]) {
    const c = CXT[l2.ty];
    return { mode: c.mode, bw: c.bw, nw: c.nw, sets: 3 };
  }
  return { mode: "reps", bw: false, sets: 3 };
}
function pickerList(q) {
  const k = norm(q), list = exUsage().filter((x) => !k || norm(x.name).indexOf(k) >= 0).slice(0, 600);
  return list.length ? list.map((x) => '<button class="row pkrow" data-act="pk-add" data-n="' + esc(x.name) + '"><span class="grow pn">' + esc(x.name) + '</span><span class="sub">' + x.n + "×</span></button>").join("") : '<p class="sub" style="padding:12px 0">' + t("pkEmpty") + "</p>";
}
function openExPicker(target) {
  ui.pk = target;
  ui.pkBack = { tab: ui.tab, screen: ui.screen };
  ui.pkSel = [];
  ui.pkQ = "";
  ui.pkEq = [];
  ui.pkMu = [];
  ui.pkTy = [];
  go(ui.tab, "pick");
}
const FGRP = [["chest", ["chest"]], ["back", ["back", "upper_back"]], ["shoulders", ["shoulders", "front_delts", "lateral_delts", "rear_delts"]], ["biceps", ["biceps"]], ["triceps", ["triceps"]], ["forearms", ["forearms"]], ["legs", ["legs"]], ["core", ["core"]], ["glutes", ["glutes"]], ["hamstrings", ["hamstrings"]], ["calves", ["calves"]]];
const FMAIN = {};
FGRP.forEach((g) => g[1].forEach((m) => {
  FMAIN[m] = g[0];
}));
const grpOf = (m) => FMAIN[m] || "other";
const grpLab = (k) => k === "shoulders" ? t("grpSh") : t("mus_" + k);
const KINDS = ["comp", "iso", "func", "isom", "plyo", "oly"], FT = { eq: "exfEq", mu: "exfMu", ty: "exfTy" }, FK = { eq: "Eq", mu: "Mu", ty: "Ty" };
function exKinds(n) {
  const cr = csvx(n);
  if (cr) return [cr.ty];
  const x = String(libDisp(n)).toLowerCase(), k = [];
  if (/\b(clean|snatch|jerk)\b/.test(x)) k.push("oly");
  if (/jump|burpee|bound|\bhop|plyo|clap|depth|skater|tuck/.test(x) && !/rope|jacks/.test(x)) k.push("plyo");
  if (/squat|deadlift|press|\brow\b|pull.?up|chin.?up|pulldown|\bdip\b|lunge|push.?up|thruster|thrust|step.?up|good morning|swing|\bclean|snatch|jerk/.test(x) && !/curl|extension|fly|flye|raise|pushdown|pressdown|kickback|calf|crunch|wrist/.test(x)) k.push("comp");
  if (!k.length && /curl|extension|fly|flye|raise|pushdown|pressdown|kickback|crunch/.test(x)) k.push("iso");
  return k;
}
const GFB = { chest: "chest", back: "back", upper_back: "back", traps: "back", lower_back: "back", shoulders: "shoulders", front_delts: "shoulders", lateral_delts: "shoulders", rear_delts: "shoulders", biceps: "biceps", triceps: "triceps", forearms: "forearms", grip: "forearms", legs: "legs", core: "core", glutes: "glutes", hamstrings: "hamstrings", calves: "calves" };
function exGroup(n) {
  const c = csvx(n);
  if (c) return c.g;
  const o = musOf(n), m = o.p[0];
  return GFB[m] || "other";
}
function exCmp(a, b) {
  const x = csvx(a), y = csvx(b), i = x ? x.i : 1e6, j = y ? y.i : 1e6;
  return i - j || a.localeCompare(b, lang);
}
function exGrouped(L, rowFn) {
  const B = {};
  L.forEach((n) => {
    const g = exGroup(n);
    (B[g] || (B[g] = [])).push(n);
  });
  return FGRP.map((g) => g[0]).concat(["other"]).filter((g) => B[g]).map((g) => '<div class="sechead"><span class="lbl">' + esc(grpLab(g)) + "</span></div>" + B[g].sort(exCmp).map(rowFn).join("")).join("");
}
function exMatch(n, qq, eq, mu, ty) {
  const q = norm(qq || "");
  eq = eq || [];
  mu = mu || [];
  if (q && norm(n).indexOf(q) < 0 && norm(libOther(n)).indexOf(q) < 0) return false;
  if (eq.length) {
    const li = libInfo(n);
    if (!li || !li.eq.some((e) => eq.indexOf(e) >= 0)) return false;
  }
  if (mu.length) {
    const o = musOf(n);
    if (!o.p.concat(o.s).some((m) => mu.indexOf(grpOf(m)) >= 0)) return false;
  }
  if (ty && ty.length) {
    if (!exKinds(n).some((m) => ty.indexOf(m) >= 0)) return false;
  }
  return true;
}
function pkMatch(n) {
  return exMatch(n, ui.pkQ, ui.pkEq, ui.pkMu, ui.pkTy);
}
function exRowHtml(n, o) {
  o = o || {};
  const mus = musOf(n).p.map((m) => t("mus_" + m)).join(", ");
  return '<button class="rowchk pkp" data-act="' + o.act + '" data-n="' + esc(n) + '"' + (o.sel != null ? ' aria-pressed="' + o.sel + '"' : "") + ">" + exIcon(n) + '<span class="grow"><span class="pn">' + esc(o.lab || n) + "</span>" + (mus ? '<span class="pkm">' + esc(mus) + "</span>" : "") + "</span>" + (o.sel != null ? '<span class="gchk' + (o.sel ? " on" : "") + '">' + (o.sel ? ICON.check : "") + "</span>" : '<span class="chev">›</span>') + "</button>";
}
function pkRowsHtml() {
  const raw = (ui.pkQ || "").trim(), sel = ui.pkSel || [], all = exUsage().map((x) => x.name), used = exUsedKeys();
  let h = raw ? "" : '<button class="row pkr" data-act="pk-own"><span class="grow pn" style="color:var(--acc)">+ ' + t("pkOwn") + "</span></button>";
  if (raw && !all.some((n) => ckey(n) === ckey(raw))) h += exRowHtml(raw, { act: "pk-tog", sel: sel.indexOf(raw) >= 0, lab: t("pkNew", { n: raw }) });
  const L = all.filter(pkMatch);
  return h + (L.length ? exGrouped(L, (n) => exRowHtml(n, { act: "pk-tog", sel: sel.indexOf(n) >= 0, used })) : h ? "" : '<p class="empty">' + t("exNone") + "</p>");
}
function pkFiltBtns() {
  const a = (ui.pkEq || []).length, b = (ui.pkMu || []).length, c = (ui.pkTy || []).length;
  return '<button class="btn ghost" data-act="pkf-ty">' + t("exfTy") + (c ? " (" + c + ")" : "") + '</button><button class="btn ghost" data-act="pkf-eq">' + t("exfEq") + (a ? " (" + a + ")" : "") + '</button><button class="btn ghost" data-act="pkf-mu">' + t("exfMu") + (b ? " (" + b + ")" : "") + "</button>";
}
function pkAddBar() {
  const n = (ui.pkSel || []).length;
  return n ? '<div class="pkfix"><button class="btn" data-act="pk-done">' + t("addShort") + " " + cnt("ex", n) + "</button></div>" : "";
}
function pkRefresh() {
  const r = $("#pkRows");
  if (r) r.innerHTML = pkRowsHtml();
  const a = $("#pkAdd");
  if (a) a.innerHTML = pkAddBar();
  const f = $("#pkfb");
  if (f) f.innerHTML = pkFiltBtns();
  const tp = $("#pkTop");
  if (tp) {
    const n = (ui.pkSel || []).length;
    tp.disabled = !n;
    tp.style.opacity = n ? "" : ".4";
  }
}
function vPick() {
  const n = ui.pkSel.length;
  return '<div class="pkhead"><div class="pkbar"><button class="link" data-act="pk-cancel">' + t("cancel") + '</button><span class="pkt">' + t("pkTitle") + '</span><button class="link" id="pkTop" data-act="pk-done"' + (n ? "" : ' disabled style="opacity:.4"') + ">" + t("addShort") + '</button></div><div class="fld" style="margin-top:0"><input type="search" id="pkIn" data-k="pk-q" value="' + esc(ui.pkQ || "") + '" placeholder="' + esc(t("exSearchPh")) + '" aria-label="' + esc(t("exSearchPh")) + '" autocomplete="off"></div><div class="fbtns" id="pkfb">' + pkFiltBtns() + '</div></div><div id="pkRows">' + pkRowsHtml() + '</div><div id="pkAdd">' + pkAddBar() + "</div>";
}
function pkFiltSheet(w) {
  return exFiltSheet(w, "pk");
}
function openPkFilt(w) {
  const sw = sheet('<div class="bigh"><h2>' + t(FT[w]) + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div id="pkfBody" class="bigb">' + pkFiltSheet(w) + '</div><div class="btns" style="padding:12px 16px"><button class="btn ghost" data-act="pkf-clear" data-w="' + w + '">' + t("exfClear") + '</button><button class="btn" id="fDone" data-act="sheet-close">' + t("exfDone") + "</button></div>");
  sw.querySelector(".sh").classList.add("big");
}
