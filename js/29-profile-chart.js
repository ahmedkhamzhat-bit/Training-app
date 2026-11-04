// Wykres w Profilu i kafelki ćwiczeń.
'use strict';

function pcVal(x, m) {
  if (m === "dur") return isFinite(x.startedAt) && isFinite(x.endedAt) && x.endedAt > x.startedAt ? (x.endedAt - x.startedAt) / 6e4 : 0;
  if (m === "vol") return sessionStats(x).vol;
  let r = 0;
  x.exercises.forEach((ex) => {
    if (ex.skipped || ex.mode === "time") return;
    ex.sets.forEach((q) => {
      if (q.ty !== "w" && pn(q.val) > 0) r += pn(q.val);
    });
  });
  return r;
}
function profChart() {
  const pc = ui.pc || (ui.pc = { m: "dur", r: "month" });
  const S = trSess(), now = /* @__PURE__ */ new Date(), today = todayStr();
  let b = [];
  const mlab = (d) => new Intl.DateTimeFormat(lang, { month: "short" }).format(d) + (pc.r === "all" ? " " + String(d.getFullYear()).slice(2) : "");
  if (pc.r === "month") {
    const y = now.getFullYear(), mo = now.getMonth(), dm = new Date(y, mo + 1, 0).getDate();
    for (let d = 1; d <= dm; d++) b.push({ k: y + "-" + pad(mo + 1) + "-" + pad(d), l: shortDate(y + "-" + pad(mo + 1) + "-" + pad(d)), v: 0, t: "d" });
  } else if (pc.r === "3m") {
    const cw = weekStart(now);
    for (let i = 12; i >= 0; i--) {
      const d = new Date(cw.getFullYear(), cw.getMonth(), cw.getDate() - 7 * i, 12);
      b.push({ k: dstr(d), l: shortDate(dstr(d)), v: 0, t: "w" });
    }
  } else {
    let from = new Date(now.getFullYear(), now.getMonth() - 11, 1, 12);
    if (pc.r === "all") {
      const f = S.length ? S.slice().sort(byDateAsc)[0].date : today;
      from = new Date(+f.slice(0, 4), +f.slice(5, 7) - 1, 1, 12);
    }
    const yearly = pc.r === "all" && (now.getFullYear() - from.getFullYear()) * 12 + now.getMonth() - from.getMonth() >= 24;
    if (yearly) {
      for (let y = from.getFullYear(); y <= now.getFullYear(); y++) b.push({ k: String(y), l: String(y), v: 0, t: "y" });
    } else {
      for (let d = new Date(from); d <= now; d = new Date(d.getFullYear(), d.getMonth() + 1, 1, 12)) b.push({ k: d.getFullYear() + "-" + pad(d.getMonth() + 1), l: mlab(d), v: 0, t: "m" });
    }
  }
  S.forEach((x) => {
    const ds = String(x.date);
    let key;
    if (b[0].t === "d") key = ds;
    else if (b[0].t === "w") key = dstr(weekStart(dateObj(ds)));
    else if (b[0].t === "y") key = ds.slice(0, 4);
    else key = ds.slice(0, 7);
    const q = b.find((z) => z.k === key);
    if (q) q.v += pcVal(x, pc.m);
  });
  b.forEach((q) => {
    q.v = Math.round(pc.m === "vol" ? wv(q.v) : q.v);
  });
  const tot = b.reduce((a, q) => a + q.v, 0), unit = pc.m === "dur" ? t("min", { n: fmtVol(tot) }) : pc.m === "vol" ? imp() ? fmtVol(tot) + " lb" : fmtKg(tot) : fmtVol(tot) + " " + t("reps").toLowerCase();
  const ropt = [["month", "pcMonth"], ["3m", "pc3m"], ["year", "pcYear"], ["all", "pcAll"]].map((x) => '<option value="' + x[0] + '"' + (pc.r === x[0] ? " selected" : "") + ">" + esc(t(x[1])) + "</option>").join("");
  return '<div class="pchart"><div class="sumrow"><span class="sub">' + esc(t("pcSum")) + ': <b style="color:var(--fg)">' + esc(unit) + '</b></span><select class="rsel" data-k="pc-r" aria-label="' + esc(t("pcRange")) + '">' + ropt + "</select></div>" + barChart(b, { unit: pc.m === "dur" ? t("min", { n: "" }).trim() : pc.m === "vol" ? uW() : t("reps").toLowerCase(), label: t(pc.m === "dur" ? "pcDur" : pc.m === "vol" ? "pcVol" : "pcReps") }) + '<div class="seg sm" style="margin-top:8px">' + [["dur", "pcDur"], ["vol", "pcVol"], ["reps", "pcReps"]].map((x) => '<button data-act="pc-m" data-v="' + x[0] + '" aria-pressed="' + (pc.m === x[0]) + '">' + t(x[1]) + "</button>").join("") + "</div></div>";
}
function exTiles(r) {
  let tiles = tile(t("exSessions"), String(r.n), fmtDate(r.first) + " – " + fmtDate(r.last)) + tile(t("exSets"), String(r.sets), "");
  if (r.timeOnly) {
    tiles += tile(t("exTime"), fmtTime(r.time), "") + tile(t("exLongest"), fmtTime(r.longest), fmtDate(r.longestDate)) + tile(t("exAvgTime"), fmtTime(r.time / r.sets), "");
  } else {
    tiles += tile(t("exReps"), fmtVol(Math.round(r.reps)), t("exSince", { d: fmtDate(r.first) }) + " · " + t("exAvgReps", { n: fmtN(Math.round(r.reps / r.sets * 10) / 10) }));
    if (r.hasW) tiles += tile(t("exVol"), fmtKg(r.vol), t("exSince", { d: fmtDate(r.first) })) + tile(t("exMaxKg"), (r.best.bw ? "BW + " : "") + fmtN(wv(r.maxKg)) + " " + uW(), fmtDate(r.maxKgDate), !!r.best.bw);
    tiles += tile(t("exBest"), fmtTop({ mode: "reps", bw: r.best.bw, kg: r.best.kg, val: r.best.val }), fmtDate(r.bestDate), true);
    tiles += tile(t("exMaxReps"), fmtN(r.maxReps), fmtDate(r.maxRepsDate));
  }
  if (r.rirN) tiles += tile(t("exAvgRir"), fmtN(Math.round(r.rirSum / r.rirN * 10) / 10), "");
  return tiles;
}
