// Widok Home: notatki, trendy miesiąca, kafelki, statystyki ćwiczenia.
'use strict';

function weekStreak() {
  const goal = Math.max(1, Math.min(14, meta.weekGoal || 3)), cnt = {};
  trSess().forEach((x) => {
    const k = weekKey(x.date);
    cnt[k] = (cnt[k] || 0) + 1;
  });
  const d = weekStart(/* @__PURE__ */ new Date()), cur = cnt[dstr(d)] || 0;
  let n = cur >= goal ? 1 : 0;
  d.setDate(d.getDate() - 7);
  while ((cnt[dstr(d)] || 0) >= goal && n < 520) {
    n++;
    d.setDate(d.getDate() - 7);
  }
  return { n, cur, goal };
}
function homeWidget() {
  let c = "";
  const sk = weekStreak(), PL = prInfo().last, lp = PL.length ? PL[PL.length - 1] : null;
  c += '<div class="stats" style="margin-top:12px"><button class="stat" data-act="wk-goal"><span class="lbl">' + t("hwStreak") + "</span><b>" + t("hwWeeks", { n: sk.n }) + '</b><span class="sub">' + t("hwWeekGoal", { c: sk.cur, g: sk.goal }) + "</span></button>" + tile(t("hwLastPr"), lp ? compactSet({ mode: lp.mode, bw: lp.bw }, { kg: lp.kg, val: lp.val }) : "—", lp ? lp.name + " · " + fmtDate(lp.date) : "", true) + "</div>";
  return c;
}
function vReview() {
  const L = [...meta.notes].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  let h = '<header class="top"><h1>' + t("tReview") + '</h1><div class="hbtns"><button class="link" data-act="note-new">' + t("noteNew") + "</button></div></header>";
  if (!L.length) return h + '<p class="empty">' + t("homeNone") + "</p>";
  return h + '<ul class="rows">' + L.map((n) => '<li class="row"><button class="hmain" data-act="note-edit" data-id="' + n.id + '"><div class="ttl"><span class="pn">' + t("noteTag") + '</span> <span class="tag">' + fmtDate(n.date) + '</span></div><div class="sub" style="white-space:pre-line;overflow-wrap:anywhere">' + esc(n.text.length > 200 ? n.text.slice(0, 200) + "…" : n.text) + '</div></button><button class="icon" data-act="note-rm" data-id="' + n.id + '" aria-label="' + esc(t("delShort")) + '">' + ICON.trash + "</button></li>").join("") + "</ul>";
}
function musRange(items) {
  const mx = Math.max(24, Math.max.apply(null, items.map((i) => i.v)) * 1.08);
  return '<div class="mrg">' + items.map((i) => {
    const c = i.v < 10 ? "lo" : i.v <= 20 ? "ok" : "hi";
    return '<div class="mr"><span class="hl">' + esc(i.l) + '</span><span class="mtr"><u style="left:' + 10 / mx * 100 + "%;width:" + 10 / mx * 100 + '%"></u><i class="' + c + '" style="width:' + Math.max(2, i.v / mx * 100) + '%"></i></span><b>' + esc(fmtN(i.v)) + "</b></div>";
  }).join("") + '</div><p class="hint">' + t("musRangeNote") + "</p>";
}
function avgDurTile(L) {
  let sum = 0, n = 0;
  L.forEach((x) => {
    if (isFinite(x.startedAt) && isFinite(x.endedAt) && x.endedAt > x.startedAt) {
      sum += (x.endedAt - x.startedAt) / 6e4;
      n++;
    }
  });
  return '<div class="stat"><span class="lbl">' + t("rvAvg") + "</span><b>" + (n ? t("min", { n: Math.round(sum / n) }) : "—") + "</b></div>";
}
function rvMonth() {
  const y = +ui.month.slice(0, 4), m = +ui.month.slice(5, 7);
  const nowM = todayStr().slice(0, 7);
  let h = rvHead();
  if (ui.range !== "month") return h + rangeCal() + rvTrends();
  const inM = trSess().filter((s) => String(s.date).slice(0, 7) === ui.month).sort(byDateAsc);
  const days = new Date(y, m, 0).getDate();
  h += calendar(y, m);
  if (!inM.length) {
    h += '<p class="empty">' + t("rvNoData") + "</p>";
    const sn = stCount(ui.month + "-00", ui.month + "-32");
    h += homeWidget();
  } else {
    h += '<div class="stats"><div class="stat"><span class="lbl">' + t("rvWorkouts") + "</span><b>" + inM.length + "</b></div>" + avgDurTile(inM) + "</div>";
    h += homeWidget();
    const vols = inM.map((s) => ({ s, st: sessionStats(s) }));
    const useVol = vols.some((x) => x.st.vol > 0);
    h += '<div class="sechead"><span class="lbl">' + (useVol ? t("rvPerVol") : t("rvPerSets")) + "</span></div>" + barChart(vols.map((x) => ({ v: useVol ? Math.round(wv(x.st.vol)) : x.st.sets, l: shortDate(x.s.date) })), { int: !useVol, label: useVol ? t("rvPerVol") : t("rvPerSets") });
  }
  if (inM.length) {
    const pd = new Date(y, m - 2, 1), pm = pd.getFullYear() + "-" + pad(pd.getMonth() + 1), pS = trSess().filter((x) => String(x.date).slice(0, 7) === pm);
    const sum = (L) => {
      let a = 0, v = 0;
      L.forEach((x) => {
        const q = sessionStats(x);
        a += q.sets;
        v += q.vol;
      });
      return { n: L.length, sets: a, vol: v };
    };
    const A = sum(inM), B = sum(pS), dd = (c, p, f) => pS.length ? (c - p >= 0 ? "+" : "") + (f ? f(c - p) : fmtN(c - p)) : "";
    h += '<div class="sechead"><span class="lbl">' + t("mCmp") + "</span></div>" + (pS.length ? '<div class="stats">' + tile(t("rvWorkouts"), String(A.n), dd(A.n, B.n) + " · " + t("vsPrev")) + tile(t("exSets"), String(A.sets), dd(A.sets, B.sets) + " · " + t("vsPrev")) + (A.vol || B.vol ? tile(t("exVol"), fmtKg(A.vol), dd(A.vol, B.vol, fmtKg) + " · " + t("vsPrev")) : "") + "</div>" : '<p class="empty">' + t("mCmpNone") + "</p>") + '<button class="btn ghost" style="margin-top:14px;width:100%" data-act="png-make">' + t("mSummary") + "</button>";
  }
  if (inM.length) h += rvTrends();
  return h;
}
function tile(label, value, sub, small) {
  const L = String(value).length, cls = L > 13 ? "xs" : small || L > 9 ? "sm" : "";
  return '<div class="stat"><span class="lbl">' + esc(label) + "</span><b" + (cls ? ' class="' + cls + '"' : "") + ">" + esc(value) + "</b>" + (sub ? '<span class="sub">' + esc(sub) + "</span>" : "") + "</div>";
}
function rvExercise() {
  const nm = ui.rvEx;
  let h = "";
  const r = exStats(nm);
  if (!r) return h + '<p class="empty">' + t("exNoData") + "</p>";
  const per = r.per.slice(-20);
  const tiles = exTiles(r);
  h += '<div class="stats">' + tiles + "</div>";
  if (r.timeOnly) {
    h += '<div class="sechead"><span class="lbl">' + t("chTime") + "</span></div>" + lineChart(per.map((p) => ({ v: p.best, l: p.l })), { label: t("chTime") });
    h += '<div class="sechead"><span class="lbl">' + t("chTimeTot") + "</span></div>" + barChart(per.map((p) => ({ v: p.time, l: p.l })), { label: t("chTimeTot") });
  } else {
    h += '<div class="sechead"><span class="lbl">' + (r.hasW ? t("chTopKg") : t("chTopReps")) + "</span></div>" + lineChart(per.map((p) => ({ v: r.hasW ? wv(p.top) : p.best, l: p.l })), { label: r.hasW ? t("chTopKg") : t("chTopReps") });
    h += '<div class="sechead"><span class="lbl">' + t("chReps") + "</span></div>" + barChart(per.map((p) => ({ v: p.reps, l: p.l })), { label: t("chReps") });
    if (r.hasW) h += '<div class="sechead"><span class="lbl">' + t("chVol") + "</span></div>" + barChart(per.map((p) => ({ v: Math.round(wv(p.vol)), l: p.l })), { label: t("chVol") }) + '<div class="sechead"><span class="lbl">' + t("chAvgKg") + "</span></div>" + lineChart(per.map((p) => ({ v: Math.round(wv(p.avg) * 10) / 10, l: p.l })), { label: t("chAvgKg") });
    const gs = Object.keys(r.groups).map((k) => r.groups[k]).sort((a, b) => b.kg - a.kg || (b.bw ? 1 : 0) - (a.bw ? 1 : 0));
    h += '<div class="sechead"><span class="lbl">' + t("exWeights") + '</span></div><div class="tbl"><div class="tr th"><span>' + t("exW") + "</span><span>" + t("exWs") + "</span><span>" + t("exWr") + "</span><span>" + t("exWm") + "</span></div>" + gs.map((g) => '<div class="tr"><span>' + esc(g.bw ? g.kg > 0 ? "BW + " + fmtN(wv(g.kg)) + " " + uW() : "BW" : g.kg > 0 ? fmtN(wv(g.kg)) + " " + uW() : "—") + "</span><span>" + g.sets + "</span><span>" + fmtN(g.reps) + "</span><span>" + fmtN(g.max) + "</span></div>").join("") + "</div>";
  }
  h += '<div class="sechead"><span class="lbl">' + t("exRecent") + "</span></div>" + r.recent.map((e) => '<button class="rcnt" data-act="detail" data-id="' + esc(e.sid) + '" style="display:block;width:100%"><span class="pn">' + fmtDate(e.date) + ' <span class="chev">›</span></span><div class="sl">' + e.sets.map((s) => "<span>" + esc(compactSet(e, s)) + "</span>").join("") + "</div></button>").join("");
  return h;
}
