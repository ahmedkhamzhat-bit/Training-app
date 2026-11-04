// Statystyki: trendy, rekordy, mapa cieplna, wybór rekordów.
'use strict';

const MUS = ["chest", "back", "upper_back", "traps", "shoulders", "front_delts", "lateral_delts", "rear_delts", "biceps", "triceps", "forearms", "grip", "core", "glutes", "abductors", "legs", "hamstrings", "calves", "neck", "lower_back", "adductors", "rotator_cuff", "tibialis", "full_body", "cardio", "other"];
function workSets(sess) {
  const o = [];
  sess.exercises.forEach((ex) => {
    if (ex.skipped) return;
    ex.sets.forEach((x) => {
      if (pn(x.val) > 0 && x.ty !== "w") o.push({ ex, x, s: sess });
    });
  });
  return o;
}
function rangeDays() {
  return ui.range === "90" ? 91 : ui.range === "365" ? 365 : 0;
}
function rangeStart() {
  if (ui.range === "month") {
    const y = +ui.month.slice(0, 4), m = +ui.month.slice(5, 7);
    return dstr(new Date(y, m - 1, 0));
  }
  const n = rangeDays();
  if (!n) return "";
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  return dstr(d);
}
function rangeEnd() {
  if (ui.range !== "month") return "";
  const y = +ui.month.slice(0, 4), m = +ui.month.slice(5, 7);
  return dstr(new Date(y, m, 0));
}
function inRange(a, b) {
  return trSess().filter((x) => (!a || x.date > a) && (!b || x.date <= b)).sort(byDateAsc);
}
function hbars(items, fmt) {
  const mx = Math.max.apply(null, items.map((i) => i.v).concat([1]));
  return '<div class="hbs">' + items.map((i) => '<div class="hb"><span class="hl">' + esc(i.l) + '</span><span class="hbar"><i style="width:' + Math.max(2, Math.round(i.v / mx * 100)) + '%"></i></span><b>' + esc(fmt ? fmt(i.v) : fmtN(i.v)) + "</b></div>").join("") + "</div>";
}
function rvTrends() {
  const mo = ui.range === "month", a = rangeStart(), S = inRange(a, rangeEnd());
  let h = "";
  if (!S.length) return mo ? "" : '<p class="empty">' + t("rvNoData") + "</p>" + homeWidget();
  const sum = (L) => {
    let q = 0, v = 0;
    L.forEach((x) => {
      const z = sessionStats(x);
      q += z.sets;
      v += z.vol;
    });
    return { n: L.length, sets: q, vol: v };
  };
  const C = sum(S);
  let P = null;
  if (rangeDays()) {
    const pa = dateObj(a);
    pa.setDate(pa.getDate() - rangeDays());
    P = sum(inRange(dstr(pa), a));
  }
  const dd = (c, p, f) => P && P.n ? (c - p >= 0 ? "+" : "") + (f ? f(c - p) : fmtN(c - p)) + " · " + t("vsPrev") : "";
  if (!mo) h += '<div class="stats">' + tile(t("rvWorkouts"), String(C.n), P ? dd(C.n, P.n) : "") + avgDurTile(S) + tile(t("exSets"), String(C.sets), P ? dd(C.sets, P.sets) : "") + (C.vol ? tile(t("exVol"), fmtKg(C.vol), P ? dd(C.vol, P.vol, fmtKg) : "") : "") + "</div>" + homeWidget();
  const cw = weekStart(/* @__PURE__ */ new Date()), wk = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(cw.getFullYear(), cw.getMonth(), cw.getDate() - 7 * i, 12);
    wk.push({ key: dstr(d), d, v: 0, sets: 0 });
  }
  trSess().forEach((x) => {
    const w = wk.find((q) => q.key === dstr(weekStart(dateObj(x.date))));
    if (w) {
      const z = sessionStats(x);
      w.v += z.vol;
      w.sets += z.sets;
    }
  });
  const useV = wk.some((w) => w.v > 0), tw = wk[11], lw = wk[10], val = (w) => useV ? w.v : w.sets, fw = (n) => useV ? fmtKg(n) : String(n);
  h += '<div class="sechead"><span class="lbl">' + t("trWeekVol") + '</span></div><div class="stats">' + tile(t("trThisWeek"), fw(val(tw)), lw && (val(lw) || val(tw)) ? (val(tw) - val(lw) >= 0 ? "+" : "") + (useV ? fmtKg(val(tw) - val(lw)) : fmtN(val(tw) - val(lw))) + " " + t("vsPrevWk") : "") + tile(t("trLastWeek"), fw(val(lw)), "") + "</div>" + barChart(wk.map((w) => ({ v: Math.round(useV ? wv(val(w)) : val(w)), l: shortDate(dstr(w.d)) })), { label: t("trWeekVol") });
  const LK = {};
  exLibNames().forEach((n) => {
    LK[ckey(n)] = 1;
  });
  const WS = [];
  S.forEach((x) => workSets(x).forEach((q) => {
    if (LK[ckey(q.ex.name)]) WS.push(q);
  }));
  const rp = WS.filter((q) => q.ex.mode !== "time"), bk = [["1–5", 0], ["6–12", 0], ["13+", 0]];
  rp.forEach((q) => {
    const v = pn(q.x.val);
    bk[v <= 5 ? 0 : v <= 12 ? 1 : 2][1]++;
  });
  if (rp.length) h += '<div class="sechead"><span class="lbl">' + t("trReps") + "</span></div>" + hbars(bk.map((b) => ({ l: b[0], v: b[1] })), (n) => n + " (" + Math.round(n / rp.length * 100) + "%)");
  const iw = {};
  WS.forEach((q) => {
    const r = pn(q.x.rir);
    if (r === null) return;
    const k = weekKey(q.s.date);
    (iw[k] || (iw[k] = { a: 0, n: 0 })).a += r;
    iw[k].n++;
  });
  const ik = Object.keys(iw).sort();
  if (ik.length >= 2) h += '<div class="sechead"><span class="lbl">' + t("trInt", { i: "RIR" }) + "</span></div>" + lineChart(ik.map((k) => ({ v: Math.round(iw[k].a / iw[k].n * 10) / 10, l: shortDate(k) })), { label: t("trInt", { i: "RIR" }) });
  let ga = 0, gn = 0, pa2 = 0;
  S.forEach((x) => x.exercises.forEach((ex) => {
    if (ex.skipped || ex.ss) return;
    for (let i = 1; i < ex.sets.length; i++) {
      const p = ex.sets[i - 1], c = ex.sets[i];
      if (p.at && c.at && pn(p.rest) > 0 && pn(c.val) > 0) {
        const g = (c.at - p.at) / 1e3;
        if (g > 0 && g <= 900) {
          ga += g;
          gn++;
          pa2 += pn(p.rest);
        }
      }
    }
  }));
  if (gn >= 3) h += '<div class="sechead"><span class="lbl">' + t("trRest") + '</span></div><div class="stats">' + tile(t("trRestAct"), fmtTime(ga / gn), "") + tile(t("trRestPlan"), fmtTime(pa2 / gn), "") + '</div><p class="hint">' + t("trRestNote") + "</p>";
  const mc = {};
  let any = false;
  WS.forEach((q) => {
    const o = musOf(q.ex.name);
    o.p.forEach((m) => {
      any = true;
      mc[m] = (mc[m] || 0) + 1;
    });
    o.s.forEach((m) => {
      any = true;
      mc[m] = (mc[m] || 0) + 0.5;
    });
  });
  let weeks = mo ? 4.3 : rangeDays() ? rangeDays() / 7 : Math.max(1, (Date.now() - dateObj(S[0].date)) / 6048e5);
  weeks = Math.max(1, weeks);
  h += '<div class="sechead"><span class="lbl">' + t("trMus") + "</span></div>";
  if (!any) h += '<p class="empty">' + t("musHint") + "</p>";
  else {
    const val2 = (m) => Math.round((mc[m] || 0) / weeks * 10) / 10;
    let ax = MUS.filter((m) => mc[m]);
    ["chest", "back", "legs", "shoulders", "biceps", "triceps"].forEach((m) => {
      if (ax.length < 6 && ax.indexOf(m) < 0) ax.push(m);
    });
    ax = MUS.filter((m) => ax.indexOf(m) >= 0);
    h += radarChart(ax.map((m) => ({ l: T[lang]["musR_" + m] !== void 0 ? t("musR_" + m) : t("mus_" + m), v: val2(m) }))) + musRange(MUS.filter((m) => mc[m]).map((m) => ({ l: t("mus_" + m), v: val2(m) })).sort((x, y) => y.v - x.v)) + '<p class="hint">' + t("musNote") + "</p>";
  }
  const rk = {};
  WS.forEach((q) => {
    const k = ckey(q.ex.name);
    (rk[k] || (rk[k] = { n: libDisp(q.ex.name), c: 0 })).c++;
  });
  const rl = Object.keys(rk).map((k) => rk[k]).sort((x, y) => y.c - x.c).slice(0, 8);
  if (rl.length) h += '<div class="sechead"><span class="lbl">' + t("trRank") + "</span></div>" + hbars(rl.map((x) => ({ l: x.n, v: x.c })), (n) => cnt("set", n));
  const W = meta.weights.slice().sort(byDateAsc);
  const bw = W.length ? W[W.length - 1].kg : 0;
  if (bw > 0) {
    const rr = exLibNames().map((n) => {
      const r = exStats(n);
      return r && !r.timeOnly && r.hasW && !(r.best && r.best.bw) && r.maxKg > 0 ? { l: n, v: Math.round(r.maxKg / bw * 100) / 100 } : null;
    }).filter(Boolean).sort((x, y) => y.v - x.v).slice(0, 6);
    if (rr.length) h += '<div class="sechead"><span class="lbl">' + t("trRatio") + "</span></div>" + hbars(rr, (n) => fmtN(n) + "×") + '<p class="hint">' + t("trRatioNote", { w: fmtN(wv(bw)) }) + "</p>";
  }
  return h;
}
function recPickHtml() {
  const sel = (meta.recEx || []).map(ckey), raw = (ui.recQ || "").trim(), q = norm(raw), all = exLibNames();
  const L = all.filter((n) => !q || norm(n).indexOf(q) >= 0);
  let h = "";
  if (raw && !all.some((n) => ckey(n) === ckey(raw))) h += '<button class="rowchk" data-act="cex-add" data-n="' + esc(raw) + '"><span class="grow" style="color:var(--acc)">+ ' + esc(t("cexAdd", { n: raw })) + "</span></button>";
  return h + (L.length ? L.map((n) => '<button class="rowchk" data-act="rec-tog" data-n="' + esc(n) + '" aria-pressed="' + sel.includes(ckey(n)) + '"><span class="gchk' + (sel.includes(ckey(n)) ? " on" : "") + '">' + (sel.includes(ckey(n)) ? ICON.check : "") + '</span><span class="grow">' + esc(n) + "</span></button>").join("") : h ? "" : '<p class="empty">' + t("exNone") + "</p>");
}
function openRecPick() {
  ui.recQ = "";
  const w = sheet('<div class="bigh"><h2>' + t("recPick") + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div class="fld" style="padding:0 16px;margin-top:0"><input type="search" data-k="rec-q" placeholder="' + esc(t("exSearchPh")) + '" autocomplete="off"></div><div id="recList" class="bigb">' + recPickHtml() + "</div>");
  w.querySelector(".sh").classList.add("big");
  w.classList.add("kb");
  kbFit();
}
