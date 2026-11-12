// Biblioteka ćwiczeń: filtry, lista, szczegóły ćwiczenia, notatki, pomiary.
'use strict';

const EXICO = { "bench": '<path d="M6 34h30M10 30h18"/><circle cx="9" cy="26" r="3"/><path d="M27 30l6 6v8M18 30V14M10 14h16M10 11v6M26 11v6"/>', "dead": '<circle cx="24" cy="8" r="3"/><path d="M24 12v16M24 28l-4 16M24 28l4 16M24 15l-4 15M24 15l4 15M10 30h28M10 26v8M38 26v8"/>', "squat": '<circle cx="24" cy="9" r="3"/><path d="M12 16h24M12 12v8M36 12v8M24 13v13M24 26l-8 6M24 26l8 6M16 32l2 12M32 32l-2 12"/>', "ohp": '<circle cx="24" cy="16" r="3"/><path d="M12 6h24M12 3v6M36 3v6M24 20v14M24 34l-4 12M24 34l4 12M24 22l-6-10-2-6M24 22l6-10 2-6"/>', "pull": '<circle cx="24" cy="12" r="3"/><path d="M10 6h28M24 18v16M24 34l-2 10M24 34l2 10M24 20l-8-10-2-4M24 20l8-10 2-4"/>', "push": '<circle cx="9" cy="26" r="3"/><path d="M6 42h36M13 29l25 9M38 38l2 4M16 30v12"/>', "dips": '<circle cx="24" cy="9" r="3"/><path d="M8 28h14M8 28v16M24 13v17M24 16l-6 6v6M24 30l5 8-4 6"/>', "legr": '<circle cx="22" cy="10" r="3"/><path d="M8 5h28M22 14l-6-9M22 14l6-9M22 14v14M22 28h18M22 28l18 3"/>', "lsit": '<circle cx="18" cy="9" r="3"/><path d="M18 13v17M18 16v18M12 36h12M18 30h22M4 36h6"/>', "plank": '<circle cx="9" cy="28" r="3"/><path d="M6 42h36M12 31l28 7M16 33v9M40 38v4"/>', "curl": '<circle cx="22" cy="9" r="3"/><path d="M22 13v17M22 30l-4 14M22 30l4 14M22 16l4 8 6-10M29 11l7 6"/>', "row": '<circle cx="35" cy="14" r="3"/><path d="M31 17L15 27M15 27l-1 17M15 27l7 17M29 19l-1 17M18 36h20M18 32v8M38 32v8"/>', "hspu": '<circle cx="24" cy="38" r="3"/><path d="M6 45h36M19 45l2-14M29 45l-2-14M24 31V10M24 10l-3-7M24 10l3-7"/>', "nord": '<circle cx="38" cy="20" r="3"/><path d="M6 44h36M14 40l22-17M35 25l3 11 2 7M8 38h8M8 34v8"/>', "hang": '<circle cx="24" cy="13" r="3"/><path d="M10 5h28M24 17v17M24 34l-2 12M24 34l2 12M24 19l-7-14M24 19l7-14"/>', "dumb": '<path d="M14 24h20M10 18v12M14 15v18M34 15v18M38 18v12"/>' };
function exIcon(name, big) {
  const k = ckey(name);
  let id = "dumb";
  const sz = big ? 40 : 28;
  return '<span class="exi' + (big ? " big" : "") + '"><svg viewBox="0 0 48 48" width="' + sz + '" height="' + sz + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + EXICO[id] + "</svg></span>";
}
const EQS = ["bb", "db", "mc", "cb", "bw", "kb", "bar", "bn", "band", "ot"];
function libOther(n) {
  const k = ckey(n), x = EXLIB.find((q) => norm(q[0]) === k);
  return x ? norm(n) === norm(x[0]) ? x[1] : x[0] : "";
}
function exMusAll() {
  const set = {};
  exLibNames().forEach((n) => {
    const o = musOf(n);
    o.p.concat(o.s).forEach((m) => {
      set[grpOf(m)] = 1;
    });
  });
  return FGRP.map((g) => g[0]).concat(["other"]).filter((m) => set[m]);
}
function exFilterMatch(n) {
  return exMatch(n, ui.exQ2, ui.exEq, ui.exMu, ui.exTy);
}
function exRowsHtml() {
  const names = exLibNames(), filt = !!(norm(ui.exQ2 || "") || (ui.exEq || []).length || (ui.exMu || []).length || (ui.exTy || []).length);
  const alpha = names.filter(exFilterMatch).sort((a, b) => a.localeCompare(b, lang));
  const row = (n) => exRowHtml(n, { act: "exd-open" });
  let rec = "";
  if (!filt) {
    const have = {};
    names.forEach((n) => {
      have[ckey(n)] = n;
    });
    const L = [];
    (meta.recentEx || []).forEach((n) => {
      const d = have[ckey(n)];
      if (d && L.indexOf(d) < 0) L.push(d);
    });
    if (L.length) rec = '<div class="sechead"><span class="lbl">' + t("exRecentH") + "</span></div>" + L.slice(0, 8).map(row).join("");
  }
  return rec + (alpha.length ? '<div class="sechead"><span class="lbl">' + t("hAllEx") + "</span></div>" + alpha.map(row).join("") : '<p class="empty">' + t("exNone") + "</p>");
}
function exFiltBtns() {
  const a = (ui.exEq || []).length, b = (ui.exMu || []).length, c = (ui.exTy || []).length;
  return '<button class="btn ghost" data-act="exf-ty">' + t("exfTy") + (c ? " (" + c + ")" : "") + '</button><button class="btn ghost" data-act="exf-eq">' + t("exfEq") + (a ? " (" + a + ")" : "") + '</button><button class="btn ghost" data-act="exf-mu">' + t("exfMu") + (b ? " (" + b + ")" : "") + "</button>";
}
function acExercises() {
  return '<div class="fld sea" style="margin-top:6px"><input type="search" data-k="ex2-q" value="' + esc(ui.exQ2 || "") + '" placeholder="' + esc(t("exSearchPh")) + '" aria-label="' + esc(t("exSearchPh")) + '" autocomplete="off"><span class="lupa" aria-hidden="true">' + ICON.search + '</span></div><div class="fbtns" id="exfb">' + exFiltBtns() + '</div><button class="row pkr" data-act="std-open" style="margin-top:8px"><span class="grow pn">' + t("stdH") + '</span><span class="chev">›</span></button><div id="exl2">' + exRowsHtml() + "</div>";
}
const FCI = '<svg viewBox="0 0 48 48" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + EXICO.dumb + "</svg>";
function filtCount(pre) {
  return exLibNames().filter(pre === "pk" ? pkMatch : exFilterMatch).length;
}
function updDone(pre) {
  const b = $("#fDone");
  if (!b) return;
  const any = (ui[pre + "Eq"] || []).length + (ui[pre + "Mu"] || []).length + (ui[pre + "Ty"] || []).length;
  b.textContent = t("exfDone") + (any ? " (" + filtCount(pre) + ")" : "");
}
function exFiltSheet(w, pre) {
  pre = pre || "ex";
  const isEq = w === "eq", sel = ui[pre + FK[w]] || [], opts = isEq ? EQS : w === "ty" ? KINDS : exMusAll(), act = pre === "pk" ? "pkf-tog" : "exf-tog";
  return '<div class="fgrid">' + opts.map((v) => {
    const on = sel.indexOf(v) >= 0;
    return '<button class="fblk" data-act="' + act + '" data-w="' + w + '" data-v="' + v + '" aria-pressed="' + on + '"><span class="ci">' + FCI + '</span><span class="grow nm">' + esc(isEq ? t("eq_" + v) : w === "ty" ? t("ty_" + v) : grpLab(v)) + "</span></button>";
  }).join("") + "</div>";
}
function openExFilt(w) {
  const sw = sheet('<div class="bigh"><h2>' + t(FT[w]) + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div id="exfBody" class="bigb" data-w="' + w + '">' + exFiltSheet(w) + '</div><div class="btns" style="padding:12px 16px"><button class="btn ghost" data-act="exf-clear" data-w="' + w + '">' + t("exfClear") + '</button><button class="btn" id="fDone" data-act="sheet-close">' + t("exfDone") + "</button></div>");
  sw.querySelector(".sh").classList.add("big", "fit");
}
function cxSum(w) {
  const c = ui.cx;
  let a;
  if (w === "eq") a = c.eq.map((v) => t("eq_" + v));
  else if (w === "p") a = c.p ? [t("mus_" + c.p)] : [];
  else if (w === "s") a = c.s.map((v) => t("mus_" + v));
  else a = [t("cxt_" + c.ty)];
  return a.length ? a.join(", ") : t("cxNone");
}
function cxPage() {
  const c = ui.cx, fld = (w, l) => '<div class="fld"><span class="lbl">' + l + '</span><button class="selbtn" data-act="cx-pick" data-w="' + w + '"><span class="grow sub" style="color:var(--fg);text-align:left">' + esc(cxSum(w)) + '</span><span class="chev">›</span></button></div>';
  return '<div class="fld"><label class="lbl" for="cxName">' + t("exNameL") + '</label><input id="cxName" data-k="cx-name" value="' + esc(c.name) + '" placeholder="' + esc(t("exName")) + '" autocomplete="off"></div>' + fld("eq", t("exfEq")) + fld("p", t("cxPrim")) + fld("s", t("cxSec")) + fld("ty", t("cxType")) + '<div class="btns" style="margin:22px 0 8px"><button class="btn" data-act="cx-save">' + t("addShort") + "</button></div>";
}
function cxOpts(w) {
  const c = ui.cx, row = (v, on, lab) => '<button class="fblk" data-act="cx-tog" data-w="' + w + '" data-v="' + v + '" aria-pressed="' + on + '"><span class="ci">' + FCI + '</span><span class="grow nm">' + esc(lab) + "</span></button>";
  const G = (x) => '<div class="fgrid">' + x + "</div>";
  if (w === "eq") return G(EQS.map((v) => row(v, c.eq.indexOf(v) >= 0, t("eq_" + v))).join(""));
  if (w === "p") return G(MUS.map((v) => row(v, c.p === v, t("mus_" + v))).join(""));
  if (w === "s") return G(MUS.filter((m) => m !== c.p).map((v) => row(v, c.s.indexOf(v) >= 0, t("mus_" + v))).join(""));
  return G(Object.keys(CXT).map((k) => row(k, c.ty === k, t("cxt_" + k))).join(""));
}
function exdOpen(n) {
  const d = libDisp(n);
  ui.rvEx = d;
  ui.exTab = "stats";
  ui.acct = "exd";
  meta.recentEx = [d].concat((meta.recentEx || []).filter((x) => ckey(x) !== ckey(d))).slice(0, 8);
  persistMeta();
}
function exdHist(name) {
  const k = ckey(name), L = [...sessions].sort(byDateAsc).reverse().map((s) => ({ s, e: s.exercises.find((e) => ckey(e.name) === k && !e.skipped && e.sets.some((q) => pn(q.val) > 0)) })).filter((x) => x.e);
  if (!L.length) return '<p class="empty">' + t("exNoData") + "</p>";
  return L.map((x) => '<button class="rcnt" data-act="detail" data-id="' + esc(x.s.id) + '" style="display:block;width:100%"><span class="pn">' + esc(x.s.name) + " - " + fmtDate(x.s.date) + ' <span class="chev">›</span></span><div class="sl">' + x.e.sets.filter((q) => pn(q.val) > 0).map((q) => "<span>" + esc(compactSet(x.e, q)) + "</span>").join("") + "</div></button>").join("");
}
function exdHow(name) {
  const li = libInfo(name), k = ckey(name);
  let how = k === ckey("Podciąganie") ? t("howPull") : k === ckey("Pompki") ? t("howPush") : li ? lang === "pl" ? li.pl : li.en : "";
  let h = "";
  if (li) h += '<div class="sechead"><span class="lbl">' + t("exfEq") + '</span></div><p class="sub" style="color:var(--fg);margin:8px 0 0">' + esc(li.eq.map((e) => t("eq_" + e)).join(", ")) + "</p>";
  h += '<div class="sechead"><span class="lbl">' + t("exMus") + '</span></div><p class="sub" style="color:var(--fg);margin:8px 0 0">' + esc(musSummary(name)) + "</p>";
  h += '<div class="sechead"><span class="lbl">' + t("howT") + "</span></div>" + (how ? '<div class="howto">' + esc(how) + "</div>" : '<p class="empty">' + t("howNone") + "</p>");
  if ((meta.customEx || []).some((x) => ckey(x) === k)) h += '<div style="margin-top:28px"><button class="link danger" data-act="cex-del">' + t("cexDel") + "</button></div>";
  return h;
}
function acExd() {
  const tab = ui.exTab || "stats", name = ui.rvEx;
  const tabs = '<div class="seg" style="margin-top:6px">' + [["stats", "exTabStats"], ["hist", "exTabHist"], ["how", "exTabHow"]].map((x) => '<button data-act="exd-tab" data-v="' + x[0] + '" aria-pressed="' + (tab === x[0]) + '">' + t(x[1]) + "</button>").join("") + "</div>";
  return '<div style="text-align:center;margin-top:8px">' + exIcon(name, true) + "</div>" + tabs + (tab === "hist" ? exdHist(name) : tab === "how" ? exdHow(name) : rvExercise());
}
const fd = () => meta.freeDef || { sets: 3, rest: DEF_REST };
function fdSets(d) {
  return 1;
}
function fdRest() {
  return 120;
}
function rangeCal() {
  if (ui.range === "90") {
    const n = /* @__PURE__ */ new Date();
    let c = '<div class="mini3">';
    for (let i = 2; i >= 0; i--) {
      const d2 = new Date(n.getFullYear(), n.getMonth() - i, 1, 12);
      c += '<div class="mc"><div class="mcl">' + esc(new Intl.DateTimeFormat(lang, { month: "short" }).format(d2)) + "</div>" + calendar(d2.getFullYear(), d2.getMonth() + 1, true) + "</div>";
    }
    return c + "</div>" + legendHtml();
  }
  const f0 = firstSessionDate();
  if (!f0) return "";
  const rs = rangeStart(), from = rs && rs > f0 ? rs : null, td = todayStr();
  let on = 0, miss = 0, rst = 0, d = from ? dateObj(from) : dateObj(f0);
  if (from) d.setDate(d.getDate() + 1);
  for (; dstr(d) <= td; d.setDate(d.getDate() + 1)) {
    const st = dayStatus(dstr(d), f0);
    if (st === "on") on++;
    else if (st === "miss") miss++;
    else if (st === "rest") rst++;
  }
  const cell = (cls, n, l) => '<div class="cn ' + cls + '"><b>' + n + "</b><span>" + esc(l) + "</span></div>";
  return '<div class="cnts" style="grid-template-columns:repeat(2,minmax(0,1fr))">' + cell("on", on, t("legTrain")) + cell("rest", rst, t("legRest")) + "</div>";
}
function foldersAll() {
  return [...new Set(meta.plans.map((p) => p.folder).concat(meta.folders || []).filter(Boolean))].sort((a, b) => a.localeCompare(b, lang));
}
function pfoldHtml() {
  const raw = (ui.pfq || "").trim(), q = norm(raw), cur = ui.plan && ui.plan.folder || "", all = foldersAll();
  const L = all.filter((f) => !q || norm(f).indexOf(q) >= 0);
  const row = (f, lab) => '<button class="rowchk" data-act="pfold-pick" data-f="' + esc(f) + '" aria-pressed="' + (cur === f) + '"><span class="gchk' + (cur === f ? " on" : "") + '">' + (cur === f ? ICON.check : "") + '</span><span class="grow">' + esc(lab) + "</span></button>";
  let h = "";
  if (raw && !all.some((f) => norm(f) === q)) h += '<button class="rowchk" data-act="pfold-pick" data-f="' + esc(raw) + '"><span class="grow" style="color:var(--acc)">+ ' + esc(t("folderCreate", { n: raw })) + "</span></button>";
  if (!q) h += row("", t("noFolder"));
  return h + L.map((f) => row(f, f)).join("");
}
function openNote(id) {
  const n = id ? meta.notes.find((x) => x.id === id) : null;
  ui.noteBack = { tab: ui.tab, screen: ui.screen };
  ui.note = { id: n ? n.id : "", date: n ? n.date : todayStr(), text: n ? n.text : "" };
  go(ui.tab, "note");
  if (!n) setTimeout(() => {
    const i = $("#nText");
    if (i) i.focus();
  }, 60);
}
function measFill(d) {
  const o = {};
  MEAS.forEach((m) => {
    const e = (meta.meas[m[0]] || []).find((q) => q.date === d);
    if (e) o[m[0]] = fmtRaw(mvv(m, e.v));
  });
  return o;
}
function vMeasAdd() {
  const d = ui.mDate || todayStr();
  return '<header class="top"><button class="icon back" data-act="meas-back" aria-label="' + esc(t("back")) + '">←</button><button class="btn sm" data-act="meas-save-all">' + t("save") + "</button></header><h2>" + t("measT") + '</h2><div class="fld"><label class="mdt"><span>' + t("noteDate") + ": <b>" + esc(new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(dateObj(d))) + '</b></span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><input id="mdDate2" type="date" data-df="1" data-k="mdate2" aria-label="' + esc(t("noteDate")) + '" value="' + esc(d) + '"></label></div><div style="margin-top:8px">' + MEAS.map((m) => {
    const v = ui.mVals && ui.mVals[m[0]] !== void 0 ? ui.mVals[m[0]] : "";
    const L = (meta.meas[m[0]] || []).slice().sort(byDateAsc), last = L.length ? fmtRaw(mvv(m, L[L.length - 1].v)) : "—";
    return '<div class="mrow2" style="cursor:default"><span class="grow">' + esc(t(m[1])) + '</span><input class="num" inputmode="decimal" data-k="mval" data-m="' + m[0] + '" value="' + esc(v) + '" placeholder="' + esc(last) + '" style="width:92px" aria-label="' + esc(t(m[1])) + '" autocomplete="off"><span class="v" style="width:28px">' + esc(mu(m)) + "</span></div>";
  }).join("") + "</div>";
}
function vExMenu() {
  const ei = ui.exmE, ex = active.exercises[ei], last = ei >= active.exercises.length - 1;
  const bt = (act, lab, st) => '<button class="btn ghost" data-act="' + act + '" data-e="' + ei + '"' + (st ? ' style="' + st + '"' : "") + ">" + lab + "</button>";
  return '<header class="top"><button class="icon back" data-act="exm-back" aria-label="' + esc(t("back")) + '">←</button><h1 class="grow" style="margin:0;font-size:22px;overflow-wrap:anywhere">' + esc(ex.name || t("exMenu")) + '</h1></header><div class="btns" style="flex-direction:column;margin-top:8px">' + bt("ex-mode", ex.mode === "time" ? t("toReps") : t("toTime")) + bt("ex-bw", ex.bw ? t("toKg") : t("toBw")) + (!last || ex.ss ? bt("ex-ss", ex.ss ? t("ssUnlink") : t("ssLink")) : "") + bt("ex-type", t("exTypeL")) + bt("ex-scale", t(exScale(ex) === "rpe" ? "scaleToRir" : "scaleToRpe")) + bt("ex-note", t("exNoteB")) + bt("ex-tempo", t("tempoRom")) + bt("ex-skip", t("skipEx")) + bt("ex-rm", t("rmEx"), "color:var(--bad)") + "</div>";
}
function vNote() {
  const n = ui.note;
  return '<header class="top ntop"><button class="icon back" data-act="note-back" aria-label="' + esc(t("back")) + '">←</button><span class="grow"></span><label class="ndate" aria-label="' + esc(t("noteDate")) + '"><span class="nds">' + esc(fmtDate(n.date)) + '</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><input type="date" data-df="1" data-k="n-date" value="' + esc(n.date) + '"></label><button class="btn sm" data-act="note-save">' + t("save") + '</button></header><textarea id="nText" class="ntext" data-k="n-text" maxlength="2000" placeholder="' + esc(t("notePh2")) + '">' + esc(n.text) + "</textarea>";
}
