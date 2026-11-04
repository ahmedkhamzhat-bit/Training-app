// Statystyki ćwiczeń: rekordy (prInfo) i podsumowanie ćwiczenia (exStats).
'use strict';

function prInfo() {
  const best = {}, by = {}, last = [];
  trSess().sort(byDateAsc).forEach((s) => {
    const m = {};
    let n = 0;
    s.exercises.forEach((ex, ei) => {
      if (ex.skipped || ex.ek === "stretch") return;
      const k = ckey(ex.name);
      if (!k) return;
      const b = best[k] || (best[k] = { kg: 0, reps: 0, t: 0, e1: 0, seen: false });
      const sets = [];
      ex.sets.forEach((x, si) => {
        if (pn(x.val) > 0 && x.ty !== "w") sets.push({ x, si, kg: pn(x.kg) || 0, v: pn(x.val) });
      });
      if (!sets.length) return;
      const tm = ex.mode === "time", had = b.seen;
      let hit = null;
      if (had) {
        if (tm) {
          const t0 = sets.reduce((a, o) => o.v > a.v ? o : a, sets[0]);
          if (t0.v > b.t) hit = { o: t0, ty: "t" };
        } else {
          const hv = sets.reduce((a, o) => o.kg > a.kg || o.kg === a.kg && o.v > a.v ? o : a, sets[0]);
          if (hv.kg > 0 && hv.kg > b.kg) hit = { o: hv, ty: "kg" };
          if (!hit) {
            const z = sets.filter((o) => o.kg === 0);
            if (z.length) {
              const mr = z.reduce((a, o) => o.v > a.v ? o : a, z[0]);
              if (mr.v > b.reps) hit = { o: mr, ty: "r" };
            }
          }
        }
      }
      sets.forEach((o) => {
        if (tm) {
          if (o.v > b.t) b.t = o.v;
        } else {
          if (o.kg > b.kg) b.kg = o.kg;
          if (o.kg === 0 && o.v > b.reps) b.reps = o.v;
        }
      });
      b.seen = true;
      if (hit) {
        (m[ei] || (m[ei] = {}))[hit.o.si] = hit.ty;
        n++;
        last.push({ date: s.date, name: ex.name, mode: ex.mode === "time" ? "time" : "reps", bw: !!ex.bw, kg: hit.o.kg, val: hit.o.v, ty: hit.ty });
      }
    });
    if (n) by[s.id] = { ex: m, n };
  });
  return { by, last };
}
function exStats(name) {
  const k = ckey(name), entries = [];
  trSess().sort(byDateAsc).forEach((s) => s.exercises.forEach((ex) => {
    if (ckey(ex.name) !== k) return;
    if (ex.skipped || ex.ek === "stretch") return;
    const sets = ex.sets.filter((x) => pn(x.val) > 0 && x.ty !== "w").map((x) => ({ kg: pn(x.kg) || 0, val: pn(x.val), rir: pn(x.rir) }));
    if (sets.length) entries.push({ sid: s.id, date: s.date, mode: ex.mode === "time" ? "time" : "reps", bw: !!ex.bw, sets });
  }));
  if (!entries.length) return null;
  const timeOnly = entries.every((e) => e.mode === "time");
  const E = entries.filter((e) => timeOnly ? e.mode === "time" : e.mode === "reps");
  const r = {
    timeOnly,
    n: E.length,
    first: E[0].date,
    last: E[E.length - 1].date,
    sets: 0,
    reps: 0,
    vol: 0,
    time: 0,
    hasW: false,
    maxKg: 0,
    maxKgDate: "",
    bestVol: 0,
    bestVolDate: "",
    best: null,
    bestDate: "",
    e1: 0,
    e1Date: "",
    maxReps: 0,
    maxRepsDate: "",
    rirSum: 0,
    rirN: 0,
    longest: 0,
    longestDate: "",
    per: [],
    groups: {},
    recent: E.slice(-6).reverse()
  };
  E.forEach((e) => {
    let sTop = 0, sReps = 0, sVol = 0, sTime = 0, sBest = 0, sE1 = 0;
    e.sets.forEach((s) => {
      r.sets++;
      if (s.rir !== null) {
        r.rirSum += s.rir;
        r.rirN++;
      }
      if (timeOnly) {
        r.time += s.val;
        sTime += s.val;
        if (s.val > sBest) sBest = s.val;
        if (s.val > r.longest) {
          r.longest = s.val;
          r.longestDate = e.date;
        }
      } else {
        r.reps += s.val;
        sReps += s.val;
        sVol += s.kg * s.val;
        if (s.kg > 0) r.hasW = true;
        if (s.kg > sTop) sTop = s.kg;
        if (s.val > sBest) sBest = s.val;
        if (!r.best || s.kg > r.best.kg || s.kg === r.best.kg && s.val > r.best.val) {
          r.best = { kg: s.kg, val: s.val, bw: e.bw };
          r.bestDate = e.date;
        }
        if (s.kg > r.maxKg) {
          r.maxKg = s.kg;
          r.maxKgDate = e.date;
        }
        if (s.val > r.maxReps) {
          r.maxReps = s.val;
          r.maxRepsDate = e.date;
        }
        const key = (e.bw ? "b" : "k") + s.kg;
        const g = r.groups[key] || (r.groups[key] = { kg: s.kg, bw: e.bw, sets: 0, reps: 0, max: 0 });
        g.sets++;
        g.reps += s.val;
        if (s.val > g.max) g.max = s.val;
      }
    });
    r.vol += sVol;
    if (sVol > r.bestVol) {
      r.bestVol = sVol;
      r.bestVolDate = e.date;
    }
    r.per.push({ l: shortDate(e.date), top: sTop, reps: sReps, vol: sVol, time: sTime, best: sBest, e1: sE1, avg: sReps > 0 ? sVol / sReps : 0 });
  });
  return r;
}
