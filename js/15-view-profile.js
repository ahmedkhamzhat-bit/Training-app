// Widok Profil i jego podstrony: historia, ciało, cele, porównanie, szczegóły treningu.
'use strict';

function avatarHtml(big) {
  const nm = (meta.name || "").trim();
  return '<span class="avatar' + (big ? " big" : "") + '">' + (meta.photo ? '<img src="' + meta.photo + '" alt="">' : nm ? "<b>" + esc(nm.slice(0, 1).toUpperCase()) + "</b>" : ICON.user) + "</span>";
}
function ageOf(b) {
  if (!b) return null;
  const d = /* @__PURE__ */ new Date(b + "T12:00:00"), n = /* @__PURE__ */ new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || n.getMonth() === d.getMonth() && n.getDate() < d.getDate()) a--;
  return a >= 0 && a < 130 ? a : null;
}
function vAccount() {
  const lw = meta.weights.length ? [...meta.weights].sort(byDateAsc).pop() : null, a = ageOf(meta.birth);
  let h = '<header class="top"><h1>' + t("tAccount") + '</h1><div class="hbtns"><button class="icon" data-act="prof-edit" aria-label="' + esc(t("profEdit")) + '">' + ICON.pen + '</button><button class="icon" data-act="data-open" aria-label="' + esc(t("secData")) + '">' + ICON.share + '</button><button class="icon" data-act="settings-open" aria-label="' + esc(t("acSettings")) + '">' + ICON.gear + "</button></div></header>";
  h += '<div class="phead"><div class="pc l1"><span class="lbl">' + esc(t("accWorkouts")) + "</span><b>" + trSess().length + '</b></div><div class="pav">' + avatarHtml(true) + '</div><div class="pc r1"><span class="lbl">' + esc(t("accHeight")) + "</span><b>" + esc(meta.heightCm ? imp() ? fmtHt(meta.heightCm) : fmtN(meta.heightCm) + " cm" : "—") + '</b></div><div class="pc l2"><span class="lbl">' + esc(t("ageL")) + "</span><b>" + (a !== null ? esc(ageStr(a)) : "—") + '</b></div><div class="pc r2"><span class="lbl">' + esc(t("accWeight")) + "</span><b>" + esc(lw ? fmtN(wv(lw.kg)) + " " + uW() : "—") + "</b></div></div>";
  const gl = meta.gender === "m" ? t("gM") : meta.gender === "f" ? t("gF") : "";
  h += '<div class="pnm"><div class="pname' + (meta.name ? "" : " none") + '">' + esc(meta.name || t("profAdd")) + "</div>" + (gl ? '<div class="sub">' + esc(gl) + "</div>" : "") + "</div>";
  h += profChart();
  h += '<div class="nav2">' + [["history", "acHistory"], ["body", "acBody"], ["stats", "acStats"], ["ex", "acEx"], ["notes", "acNotes"], ["goals", "acGoals"]].map((x) => '<button data-act="acct" data-v="' + x[0] + '"' + (!meta.sub && x[0] !== "history" && x[0] !== "notes" ? ' style="opacity:.5"' : "") + ">" + { history: ICON.hist, body: ICON.body, stats: ICON.rev, ex: ICON.train, notes: ICON.note, goals: ICON.goal }[x[0]] + "<span>" + t(x[1]) + "</span></button>").join("") + "</div>";
  return h;
}
function vAcSub() {
  const k = { history: 1, body: 1, stats: 1, ex: 1, exd: 1, exnew: 1, settings: 1, notes: 1, goals: 1 }[ui.acct] ? ui.acct : "history", tt = { history: "acHistory", body: "acBody", stats: "acStats", ex: "acEx", notes: "acNotes", goals: "acGoals" }[k];
  if (k === "settings") {
    const sec = ui.setSec || "";
    return '<header class="top cen"><button class="icon back" data-act="set-up" aria-label="' + esc(t("back")) + '">←</button><h1>' + t(sec ? SECT[sec] : "acSettings") + '</h1><span></span></header><div id="setBody" style="padding-bottom:24px">' + acSettings() + "</div>";
  }
  if (k === "notes" || k === "goals") {
    const L = [...meta.notes].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    let h = '<header class="top cen two"><button class="icon back" data-act="acsub-back" aria-label="' + esc(t("back")) + '">←</button><h1>' + t(tt) + '</h1><span class="hbtns">' + (k === "notes" && L.length && !ui.noteSel ? '<button class="icon" data-act="notes-del-on" aria-label="' + esc(t("noteDelMode")) + '">' + ICON.trash + "</button>" : "") + '<button class="icon" data-act="' + (k === "notes" ? "note-new" : "goal-new") + '" aria-label="' + esc(t(k === "notes" ? "noteNew" : "goalNew")) + '">' + ICON.plus + "</button></span></header>";
    if (k === "goals") return h + (meta.sub ? acGoals(true) : lockCard());
    if (!L.length) return h + '<p class="empty">' + t("homeNone") + "</p>";
    const dm = ui.noteSel;
    if (dm) h += '<div class="cmpbar"><span class="sub grow">' + t("noteSelN", { n: dm.length }) + '</span><button class="btn sm" data-act="notes-del-go"' + (dm.length ? "" : ' disabled style="opacity:.4"') + ">" + t("delShort") + '</button><button class="link" data-act="notes-del-off">' + t("cancel") + "</button></div>";
    return h + '<ul class="rows">' + L.map((n) => '<li class="row">' + (dm ? '<button class="gchk' + (dm.indexOf(n.id) >= 0 ? " on" : "") + '" data-act="notes-pick" data-id="' + n.id + '" aria-pressed="' + (dm.indexOf(n.id) >= 0) + '" aria-label="' + esc(t("delShort")) + '">' + (dm.indexOf(n.id) >= 0 ? ICON.check : "") + "</button>" : "") + '<button class="hmain" data-act="' + (dm ? "notes-pick" : "note-edit") + '" data-id="' + n.id + '"><div class="ttl"><span class="pn">' + t("noteTag") + '</span> <span class="tag">' + fmtDate(n.date) + '</span></div><div class="sub" style="white-space:pre-line;overflow-wrap:anywhere">' + esc(n.text.length > 200 ? n.text.slice(0, 200) + "…" : n.text) + "</div></button></li>").join("") + "</ul>";
  }
  if (k === "exnew") return '<header class="top exh cen"><button class="icon back" data-act="cx-back" aria-label="' + esc(t("back")) + '">←</button><h1>' + t("cexNew") + "</h1><span></span></header>" + cxPage();
  if (k === "ex" || k === "exd") {
    return '<header class="top exh cen"><button class="icon back" data-act="' + (k === "exd" ? "exd-back" : "acsub-back") + '" aria-label="' + esc(t("back")) + '">←</button><h1>' + esc(k === "exd" ? ui.rvEx : t("acEx")) + "</h1>" + (k === "ex" ? '<button class="icon" data-act="exd-new" aria-label="' + esc(t("cexNew")) + '">' + ICON.plus + "</button>" : "<span></span>") + "</header>" + (k === "ex" ? acExercises() : acExd());
  }
  return '<header class="top cen"><button class="icon back" data-act="acsub-back" aria-label="' + esc(t("back")) + '">←</button><h1>' + t(tt) + "</h1>" + (k === "body" ? '<button class="icon" data-act="meas-add-open" aria-label="' + esc(t("measT")) + '">' + ICON.plus + "</button>" : k === "history" ? '<button class="icon" data-act="h-menu" aria-label="' + esc(t("more")) + '">⋯</button>' : "<span></span>") + "</header>" + { history: acHistory, body: acBody, stats: rvMonth }[k]();
}
function histFilter() {
  const f = ui.hf, q = norm(f.q);
  return [...sessions].sort(byDateAsc).reverse().filter((s) => {
    if (f.plan === "_none") {
      if (s.planId) return false;
    } else if (f.plan && s.planId !== f.plan) return false;
    if (f.month && String(s.date).slice(0, 7) !== f.month) return false;
    if (f.ex && !s.exercises.some((e) => norm(e.name) === norm(f.ex))) return false;
    if (q) {
      const hay = norm([s.name, s.note, s.remark].concat(s.exercises.map((e) => e.name)).join(" "));
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  });
}
function histListHtml() {
  const f = ui.hf, q = norm(f.q);
  const sh = f.show || "all";
  const ss = (sh === "n" ? [] : histFilter()).map((x) => ({ k: "s", d: x.date, x }));
  const nn = sh === "s" || f.plan || f.ex ? [] : meta.notes.filter((n) => (!f.month || String(n.date).slice(0, 7) === f.month) && (!q || norm(n.text).indexOf(q) >= 0)).map((x) => ({ k: "n", d: x.date, x }));
  const list = ss.concat(nn).sort((a, b) => String(b.d).localeCompare(String(a.d)) || (b.k === "n" ? -1 : 1));
  if (!list.length) return '<p class="empty">' + t("hNone") + "</p>";
  const cmp = ui.cmp, PRH = prInfo().by;
  let cur = "", h = "", rows = "";
  const flush = () => {
    if (rows) h += '<ul class="rows">' + rows + "</ul>";
    rows = "";
  };
  list.forEach((it) => {
    const m = String(it.d).slice(0, 7);
    if (m !== cur) {
      flush();
      cur = m;
      h += '<div class="sechead"><span class="lbl">' + esc(monthLabel(m)) + "</span></div>";
    }
    if (it.k === "n") {
      const n = it.x;
      rows += '<li class="row"><button class="hmain" data-act="note-edit" data-id="' + n.id + '"><div class="ttl"><span class="pn">' + t("noteTag") + '</span> <span class="tag">' + fmtDate(n.date) + '</span></div><div class="sub" style="white-space:pre-line;overflow-wrap:anywhere">' + esc(n.text.length > 160 ? n.text.slice(0, 160) + "…" : n.text) + "</div></button>" + (cmp.on ? "" : '<button class="icon" data-act="note-rm" data-id="' + n.id + '" aria-label="' + esc(t("delShort")) + '">' + ICON.trash + "</button>") + "</li>";
      return;
    }
    const s = it.x;
    const st = sessionStats(s), tr = timeRange(s), sel = cmp.ids.indexOf(s.id) >= 0, nEx = s.exercises.filter((e) => !e.skipped).length;
    const prx = PRH[s.id];
    rows += '<li class="row">' + (cmp.on ? '<button class="gchk' + (sel ? " on" : "") + '" data-act="cmp-pick" data-id="' + s.id + '" aria-pressed="' + sel + '" aria-label="' + esc(t("cmpGo")) + '">' + (sel ? ICON.check : "") + "</button>" : "") + '<button class="hmain" data-act="' + (cmp.on ? "cmp-pick" : "detail") + '" data-id="' + s.id + '"><div class="ttl"><span class="pn">' + esc(s.name) + " – " + fmtDate(s.date) + "</span>" + kindTag(s) + (s.remark ? ' <span class="rem">' + esc(s.remark) + "</span>" : "") + '</div><div class="sub">' + (tr ? esc(tr) + " · " : "") + cnt("ex", nEx) + " · " + cnt("set", st.sets) + (st.vol ? " · " + fmtKg(st.vol) : "") + (prx ? ' · <b class="prt">' + t("prTag") + " ×" + prx.n + "</b>" : "") + "</div></button>" + (cmp.on ? "" : '<button class="icon" data-act="remark" data-id="' + s.id + '" aria-label="' + esc(t("remark")) + '">' + ICON.pen + "</button>") + "</li>";
  });
  flush();
  return h;
}
function acHistory() {
  if (!sessions.length && !meta.notes.length) return '<div class="cmpbar"><button class="link" data-act="note-new">' + t("noteNew") + '</button></div><p class="empty">' + t("noHist") + "</p>";
  const f = ui.hf, cmp = ui.cmp, names = exNamesAll();
  const months = [...new Set(sessions.map((s) => String(s.date).slice(0, 7)))].sort().reverse();
  const opt = (v, l, cur) => '<option value="' + esc(v) + '"' + (String(cur) === String(v) ? " selected" : "") + ">" + esc(l) + "</option>";
  let h = '<div class="fld sea" style="margin-top:14px"><input type="search" data-k="h-q" value="' + esc(f.q) + '" placeholder="' + esc(t("hSearch")) + '" aria-label="' + esc(t("hSearch")) + '" autocomplete="off"><span class="lupa" aria-hidden="true">' + ICON.search + "</span></div>";
  h += '<div class="filters"><select data-k="h-plan" aria-label="' + esc(t("hAllPlans")) + '">' + opt("", t("hAllPlans"), f.plan) + opt("_none", t("hNoPlan"), f.plan) + meta.plans.map((p) => opt(p.id, p.name, f.plan)).join("") + '</select><select data-k="h-ex" aria-label="' + esc(t("hAllEx")) + '">' + opt("", t("hAllEx"), f.ex) + names.map((n) => opt(n, n, f.ex)).join("") + '</select><select data-k="h-month" aria-label="' + esc(t("hAllMonths")) + '">' + opt("", t("hAllMonths"), f.month) + months.map((m) => opt(m, monthLabel(m), f.month)).join("") + "</select></div>";
  h += '<div class="cmpbar">' + (cmp.on ? '<span class="sub grow">' + t("cmpSel", { n: cmp.ids.length }) + '</span><button class="btn sm" data-act="cmp-go"' + (cmp.ids.length === 2 ? "" : ' disabled style="opacity:.4"') + ">" + t("cmpGo") + '</button><button class="link" data-act="cmp-off">' + t("cancel") + "</button>" : '<button class="link" data-act="cmp-on">' + t("cmpOn") + '</button><span class="grow"></span><button class="link" data-act="note-new">' + t("noteNew") + "</button>") + "</div>";
  return h + '<div id="hlist">' + histListHtml() + "</div>";
}
const MEAS = [["bf", "mBf", "%"], ["neck", "mNeck", "cm"], ["chest", "mChest", "cm"], ["shoulders", "mSh", "cm"], ["bicL", "mBicL", "cm"], ["bicR", "mBicR", "cm"], ["fL", "mFL", "cm"], ["fR", "mFR", "cm"], ["hips", "mHips", "cm"], ["thL", "mThL", "cm"], ["thR", "mThR", "cm"], ["cL", "mCL", "cm"], ["cR", "mCR", "cm"]];
function dlt(d, unit, col) {
  if (!d) return '<span class="delta">±0 ' + unit + "</span>";
  const up = d > 0, cls = col ? (col === "loss" ? !up : up) ? " gv" : " rv" : "";
  return '<span class="delta' + cls + '">' + (up ? "+" : "−") + fmtN(Math.abs(d)) + " " + unit + "</span>";
}
function last5Html(A, unit, col) {
  if (!A.length) return "";
  let h = '<div class="sechead" style="margin-top:18px"><span class="lbl">' + t("last5") + "</span></div>";
  for (let i = A.length - 1; i >= Math.max(0, A.length - 5); i--) {
    const d = i > 0 ? Math.round((A[i].v - A[i - 1].v) * 10) / 10 : null;
    h += '<div class="wl nob' + (i === Math.max(0, A.length - 5) ? " lastl" : "") + '"><span class="v">' + fmtN(A[i].v) + " " + unit + "</span>" + (d === null ? "<span></span>" : dlt(d, unit, col)) + '<span class="sub grow" style="text-align:right">' + fmtDate(A[i].date) + "</span></div>";
  }
  return h;
}
function measDetail(key) {
  const mm = MEAS.find((x) => x[0] === key) || MEAS[0], ML = (meta.meas[mm[0]] || []).slice().sort(byDateAsc);
  ui.meas = mm[0];
  if (!ML.length) return '<p class="empty">' + t("hNone") + "</p>";
  let h = '<div class="hrow"><button class="link" data-act="hist-m">' + t("histBtn") + "</button></div>";
  const c = ML[ML.length - 1], p = ML.length > 1 ? ML[ML.length - 2] : null;
  h += '<div class="wcmp"><b>' + fmtN(mvv(mm, c.v)) + " " + mu(mm) + "</b>" + (p ? dlt(Math.round((mvv(mm, c.v) - mvv(mm, p.v)) * 10) / 10, mu(mm), "") + '<span class="sub">' + t("wVsPrev", { w: fmtN(mvv(mm, p.v)) + " " + mu(mm), d: fmtDate(p.date) }).replace(" kg (", " (") + "</span>" : '<span class="sub">' + fmtDate(c.date) + "</span>") + "</div>";
  h += lineChart(ML.slice(-40).map((w) => ({ v: mvv(mm, w.v), l: shortDate(w.date) })), { unit: mu(mm), label: t(mm[1]) });
  h += last5Html(ML.map((w) => ({ v: mvv(mm, w.v), date: w.date })), mu(mm), "");
  return h;
}
function measLastText(m) {
  const L = (meta.meas[m[0]] || []).slice().sort(byDateAsc), c = L.length ? L[L.length - 1] : null;
  return c ? fmtN(mvv(m, c.v)) + " " + mu(m) : "—";
}
function measListHtml() {
  return MEAS.map((m) => '<button class="mrow2" data-act="meas-edit" data-k="' + m[0] + '"><span class="grow">' + esc(t(m[1])) + '</span><span class="v">' + esc(measLastText(m)) + '</span><span class="chev">›</span></button>').join("");
}
function acBody() {
  const col = meta.wGoal === "loss" ? "loss" : "gain";
  const ws = [...meta.weights].sort(byDateAsc);
  let h = '<div class="sechead"><span class="lbl">' + t("weight") + "</span></div>";
  h += '<div class="wform"><input id="wIn" class="num" inputmode="decimal" placeholder="' + uW() + '" aria-label="' + uW() + '" autocomplete="off"><input id="wDate" type="date" value="' + todayStr() + '" aria-label="date"><button class="btn" data-act="w-add">' + t("weightAdd") + "</button></div>";
  if (ws.length) {
    h += '<div class="hrow"><button class="link" data-act="hist-w">' + t("histBtn") + "</button></div>";
    const c = ws[ws.length - 1], p = ws.length > 1 ? ws[ws.length - 2] : null;
    h += '<div class="wcmp"><b>' + fmtN(wv(c.kg)) + " " + uW() + "</b>" + (p ? dlt(dwv(Math.round((c.kg - p.kg) * 10) / 10), uW(), col) + '<span class="sub">' + t("wVsPrev", { w: fmtN(wv(p.kg)), d: fmtDate(p.date) }) + "</span>" : '<span class="sub">' + fmtDate(c.date) + "</span>") + "</div>";
    h += lineChart(ws.slice(-40).map((w) => ({ v: wv(w.kg), l: shortDate(w.date) })), { unit: uW(), label: t("weight") });
    h += last5Html(ws.map((w) => ({ v: wv(w.kg), date: w.date })), uW(), col);
  }
  const mk = ui.meas || "bf", mm = MEAS.find((x) => x[0] === mk) || MEAS[0], ML = (meta.meas[mm[0]] || []).slice().sort(byDateAsc);
  const mo = !!ui.measOpen;
  h += '<div class="meash"><button class="meast" data-act="meas-toggle" aria-expanded="' + mo + '"><span class="grow">' + t("measOpen") + '</span><span class="chev">' + (mo ? "▾" : "›") + "</span></button></div>";
  if (mo) {
    const mm2 = MEAS.find((x) => x[0] === (ui.meas || "bf")) || MEAS[0];
    h += '<div class="fld"><select data-k="meas-sel" aria-label="' + esc(t("measT")) + '">' + MEAS.map((x) => '<option value="' + x[0] + '"' + (x[0] === mm2[0] ? " selected" : "") + ">" + esc(t(x[1])) + "</option>").join("") + "</select></div>" + measDetail(mm2[0]);
  }
  return h;
}
function goalRow(g, arch) {
  const st = g.status, tg = pn(g.target) > 0 ? pn(g.target) : 0, cu = pn(g.cur) || 0;
  const dl = g.deadline ? Math.round((/* @__PURE__ */ new Date(g.deadline + "T12:00") - /* @__PURE__ */ new Date(todayStr() + "T12:00")) / 864e5) : null;
  const parts = [t("goalAdded", { d: fmtDate(g.created) })];
  if (st === "active" && g.deadline) parts.push(t("goalUntil", { d: fmtDate(g.deadline) }) + " · " + (dl >= 0 ? t("goalLeft", { n: cnt("day", dl) }) : t("goalLate")));
  if (st === "done") parts.push(t("goalDoneOn", { d: fmtDate(g.closed) }));
  if (st === "dropped") parts.push(t("goalDropOn", { d: fmtDate(g.closed) }));
  const lead = st === "dropped" ? '<span class="gchk x" aria-hidden="true">✕</span>' : '<button class="gchk' + (st === "done" ? " on" : "") + '" data-act="goal-toggle" data-id="' + g.id + '" aria-pressed="' + (st === "done") + '" aria-label="' + esc(t("goalCheck")) + '">' + (st === "done" ? ICON.check : "") + "</button>";
  let prog = "";
  if (tg) {
    const p = Math.max(0, Math.min(100, Math.round(cu / tg * 100)));
    prog = '<button class="gprog" data-act="goal-prog" data-id="' + g.id + '"' + (st !== "active" ? " disabled" : "") + ' aria-label="' + esc(t("goalProg")) + '"><span class="hbar"><i style="width:' + p + '%"></i></span><b>' + esc(fmtN(cu) + " / " + fmtN(tg) + (g.unit ? " " + g.unit : "")) + "</b></button>";
  }
  return '<div class="row goalr' + (st !== "active" ? " closed" : "") + '">' + lead + '<div class="grow"><div class="pn' + (st === "done" ? " strike" : "") + '">' + esc(g.text) + "</div>" + prog + '<div class="sub">' + esc(parts.join(" · ")) + "</div>" + (g.note && (arch || st !== "active") ? '<div class="gnote">' + esc(g.note) + "</div>" : "") + '</div><button class="icon" data-act="goal-menu" data-id="' + g.id + '" aria-label="' + esc(t("goalMenu")) + '">⋯</button></div>';
}
function acGoals(pg) {
  const act = meta.goals.filter((g) => g.status === "active").sort((a, b) => (a.deadline || "9999").localeCompare(b.deadline || "9999") || String(a.created).localeCompare(String(b.created)));
  const his = meta.goals.filter((g) => g.status !== "active").sort((a, b) => String(b.closed).localeCompare(String(a.closed)));
  const nd = meta.goals.filter((g) => g.status === "done").length;
  let h = pg ? '<div class="sechead"><span class="lbl">' + t("goalActive") + "</span></div>" : '<div class="gtitle"><span class="lbl">' + t("goalActive") + '</span><h2 class="sech2">' + t("goalsH") + '</h2><button class="link" data-act="goal-new">' + t("goalNew") + "</button></div>";
  h += act.length ? act.map((g) => goalRow(g)).join("") : '<p class="empty">' + t("goalNone") + "</p>";
  if (nd) h += '<button class="btn ghost" style="width:100%;margin-top:14px" data-act="goal-ach">' + t("achTitle") + " (" + nd + ")</button>";
  if (his.length) h += '<div class="sechead"><span class="lbl">' + t("goalHistory") + "</span></div>" + his.map((g) => goalRow(g)).join("");
  return h;
}
function vAchv() {
  const L = meta.goals.filter((g) => g.status === "done").sort((a, b) => String(b.closed).localeCompare(String(a.closed)));
  return '<header class="top"><button class="icon back" data-act="ach-back" aria-label="' + esc(t("back")) + '">←</button></header><h2>' + t("achTitle") + "</h2>" + (L.length ? L.map((g) => goalRow(g, true)).join("") : '<p class="empty">' + t("achNone") + "</p>");
}
function openGoalClose(id, st) {
  const g = meta.goals.find((x) => x.id === id);
  if (!g) return;
  sheet("<h2>" + t(st === "done" ? "goalCloseDone" : "goalCloseDrop") + '</h2><p class="sub" style="overflow-wrap:anywhere">' + esc(g.text) + '</p><div class="fld"><label class="lbl" for="gNote">' + t(st === "done" ? "goalNoteDone" : "goalNoteDrop") + '</label><textarea id="gNote" class="copyarea" style="min-height:90px" maxlength="300">' + esc(g.note || "") + '</textarea></div><div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="goal-close" data-id="' + id + '" data-st="' + st + '">' + t("save") + "</button></div>");
}
function openGoalProg(id) {
  const g = meta.goals.find((x) => x.id === id);
  if (!g) return;
  sheet("<h2>" + t("goalProg") + '</h2><p class="sub" style="overflow-wrap:anywhere">' + esc(g.text) + '</p><div class="fld"><label class="lbl" for="gCur">' + t("goalCur") + (g.unit ? " (" + esc(g.unit) + ")" : "") + '</label><input id="gCur" class="num" inputmode="decimal" value="' + esc(g.cur == null ? "" : g.cur) + '" style="text-align:left;padding-inline:12px" autocomplete="off"></div><div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="goal-prog-save" data-id="' + id + '">' + t("save") + "</button></div>");
}
function topDelta(a, b) {
  if (!a || !b || a.mode !== b.mode) return null;
  const parts = [];
  let cls = "";
  if (a.mode === "reps") {
    const dk = Math.round((wv(b.kg) - wv(a.kg)) * 100) / 100, dr = Math.round((b.val - a.val) * 100) / 100;
    if (dk) parts.push((dk > 0 ? "+" : "") + fmtN(dk) + " " + uW());
    if (dr) parts.push((dr > 0 ? "+" : "") + fmtN(dr) + " " + t("uReps"));
    cls = dk > 0 || dk === 0 && dr > 0 ? "good" : dk < 0 || dk === 0 && dr < 0 ? "warn" : "";
  } else {
    const dv = b.val - a.val;
    if (dv) parts.push((dv > 0 ? "+" : "") + fmtN(dv) + " s");
    cls = dv > 0 ? "good" : dv < 0 ? "warn" : "";
  }
  return { txt: parts.length ? parts.join(" · ") : t("rvSame"), cls };
}
function vCompare() {
  const ss = ui.cmp.ids.map((id) => sessions.find((x) => x.id === id)).filter(Boolean).sort(byDateAsc);
  if (ss.length < 2) {
    ui.screen = null;
    return vAccount();
  }
  const a = ss[0], b = ss[1], sa = sessionStats(a), sb = sessionStats(b);
  let h = '<header class="top"><button class="icon back" data-act="cmp-back" aria-label="' + esc(t("back")) + '">←</button></header><h2>' + t("cmpTitle") + "</h2>";
  h += '<div class="cmpgrid">' + [a, b].map((x) => '<div><div class="pn">' + esc(x.name) + '</div><div class="sub">' + fmtDate(x.date) + (timeRange(x) ? " · " + esc(timeRange(x)) : "") + "</div></div>").join("") + "</div>";
  if (a.planId !== b.planId) h += '<p class="hint">' + t("cmpDiff") + "</p>";
  const dlt2 = (x, y) => {
    const d = y - x;
    return d === 0 ? "" : '<div class="delta ' + (d > 0 ? "good" : "warn") + '">' + (d > 0 ? "+" : "") + fmtN(d) + "</div>";
  };
  h += '<div class="cmpgrid" style="margin-top:12px"><div class="stat"><span class="lbl">' + t("exSets") + '</span><b class="sm">' + sa.sets + '</b></div><div class="stat"><span class="lbl">' + t("exSets") + '</span><b class="sm">' + sb.sets + "</b>" + dlt2(sa.sets, sb.sets) + '</div><div class="stat"><span class="lbl">' + t("exVol") + '</span><b class="sm">' + fmtKg(sa.vol) + '</b></div><div class="stat"><span class="lbl">' + t("exVol") + '</span><b class="sm">' + fmtKg(sb.vol) + "</b>" + dlt2(sa.vol, sb.vol) + "</div></div>";
  const keys = [], seen = {};
  a.exercises.concat(b.exercises).forEach((e) => {
    const k = norm(e.name);
    if (k && !seen[k]) {
      seen[k] = 1;
      keys.push(k);
    }
  });
  keys.forEach((k) => {
    const ea = a.exercises.find((e) => norm(e.name) === k), eb = b.exercises.find((e) => norm(e.name) === k), nm = (ea || eb).name;
    const col = (e) => !e ? '<span class="sub">—</span>' : e.skipped ? '<span class="tag">' + t("skippedTag") + "</span>" : numL(e.sets.filter((x) => pn(x.val) > 0)).map((q) => '<div class="sl"><i>' + q.l + "</i><span>" + esc(setText(e, q.x)) + "</span></div>").join("");
    const d = ea && eb ? topDelta(topSet(ea), topSet(eb)) : null;
    h += '<div class="exd"><div class="pn">' + esc(nm) + '</div><div class="cmpgrid"><div>' + col(ea) + "</div><div>" + col(eb) + "</div></div>" + (d ? '<div class="delta ' + d.cls + '">' + esc(d.txt) + "</div>" : "") + "</div>";
  });
  return h;
}
function vDetail() {
  const s = sessions.find((x) => x.id === ui.detailId);
  if (!s) {
    ui.screen = null;
    return vAccount();
  }
  const st = sessionStats(s), tr = timeRange(s), nEx = s.exercises.filter((e) => !e.skipped).length;
  const dur = isFinite(s.startedAt) && isFinite(s.endedAt) && s.endedAt >= s.startedAt ? t("min", { n: Math.max(1, Math.round((s.endedAt - s.startedAt) / 6e4)) }) : "";
  const PR = prInfo().by[s.id];
  let h = '<header class="top"><button class="icon back" data-act="detail-back" aria-label="' + esc(t("back")) + '">←</button><button class="btn sm" data-act="detail-edit">' + t("edit") + "</button></header>";
  h += '<div class="dtl-h"><h2>' + esc(s.name) + " – " + fmtDate(s.date) + kindTag(s) + '</h2><button class="icon" data-act="remark" data-id="' + s.id + '" aria-label="' + esc(t("remark")) + '">' + ICON.pen + "</button></div>";
  if (s.remark) h += '<div class="rem" style="margin-bottom:6px;overflow-wrap:anywhere">' + esc(s.remark) + "</div>";
  {
    const hasT = isFinite(s.startedAt), hasE = hasT && isFinite(s.endedAt) && s.endedAt >= s.startedAt;
    const l1 = hasT ? hm(s.startedAt) + (hasE ? " – " + hm(s.endedAt) : "") + (dur ? " (" + dur + ")" : "") : dur || "";
    if (l1) h += '<div class="dline">' + esc(l1) + "</div>";
    h += '<div class="dline sec">' + esc(cnt("ex", nEx) + ", " + cnt("set", st.sets) + (st.vol ? ", " + fmtKg(st.vol) : "")) + "</div>";
    if (PR) h += '<div class="sub" style="margin-top:6px"><b class="prt">' + t("prTag") + " ×" + PR.n + "</b></div>";
  }
  if (s.warm && s.warm.length) h += '<div class="exd"><div class="pn">' + t("warmT") + "</div>" + s.warm.map((w) => '<div class="sl"><i>' + (w.done ? "✓" : "○") + "</i><span>" + esc(w.name) + (w.note ? " · " + esc(w.note) : "") + "</span></div>").join("") + "</div>";
  h += s.exercises.map((ex, i) => {
    const prevSS = i > 0 && s.exercises[i - 1].ss, inG = !!ex.ss || prevSS;
    const extra = [];
    if (ex.tempo) extra.push(t("tempo") + " " + ex.tempo);
    if (ex.rom) extra.push(ex.rom);
    if (ex.skipped) return '<div class="exd"><div class="pn">' + esc(ex.name) + '</div><span class="tag">' + t("skippedTag") + "</span></div>";
    return '<div class="exd' + (inG ? " ssd" : "") + '"><div class="pn">' + esc(ex.name) + (inG ? ' <span class="tag">' + t("superset") + "</span>" : "") + "</div>" + (extra.length ? '<div class="sub" style="margin-bottom:4px">' + esc(extra.join(" · ")) + "</div>" : "") + numL(ex.sets.filter((x) => pn(x.val) > 0)).map((q) => '<div class="sl"><i>' + q.l + "</i><span>" + esc(setText(ex, q.x)) + (pn(q.x.rest) > 0 ? " · " + esc(fmtN(pn(q.x.rest))) + " s" : "") + "</span>" + (PR && PR.ex[i] && PR.ex[i][ex.sets.indexOf(q.x)] ? '<b class="prb">' + t("prTag") + "</b>" : "") + "</div>").join("") + "</div>";
  }).join("");
  if (s.note) h += '<div class="sechead"><span class="lbl">' + t("note") + '</span></div><div class="note">' + esc(s.note) + "</div>";
  h += '<button class="btn block" style="margin-top:18px" data-act="detail-repeat" data-id="' + s.id + '">' + t("repeatW") + "</button>";
  if (s.planId && meta.plans.some((p) => p.id === s.planId && !p.archived)) h += '<button class="btn ghost block" style="margin-top:10px" data-act="dated-new" data-id="' + s.planId + '">' + t("datedNew") + "</button>";
  h += '<button class="btn ghost block" style="margin-top:10px" data-act="detail-toplan" data-id="' + s.id + '">' + t("toPlan") + "</button>";
  h += '<button class="link danger" style="display:block;margin:22px auto 0" data-act="detail-del">' + t("detDel") + "</button>";
  return h;
}
