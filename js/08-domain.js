// Logika treningu: serie, statystyki sesji, deload, czyszczenie i tworzenie sesji.
'use strict';

function topSet(ex) {
  const sets = ex.sets.filter((s) => pn(s.val) > 0 && s.ty !== "w");
  if (!sets.length) return null;
  if (ex.mode === "time") {
    let b = null;
    sets.forEach((s) => {
      const v = pn(s.val);
      if (!b || v > b.val) b = { mode: "time", bw: false, kg: 0, val: v, rir: pn(s.rir) };
    });
    return b;
  }
  let best = null;
  sets.forEach((s) => {
    const kg = pn(s.kg) || 0, r = pn(s.val);
    if (!best || kg > best.kg || kg === best.kg && r > best.val) best = { mode: "reps", bw: !!ex.bw, kg, val: r, rir: pn(s.rir) };
  });
  return best;
}
function fmtTop(x) {
  if (x.mode === "time") return fmtTime(x.val);
  if (x.bw) return (x.kg > 0 ? "BW + " + fmtN(wv(x.kg)) + " " + uW() : "BW") + " × " + fmtN(x.val);
  return x.kg > 0 ? fmtN(wv(x.kg)) + " " + uW() + " × " + fmtN(x.val) : "× " + fmtN(x.val);
}
const TYTAG = { w: "W", d: "D", f: "F", p: "P", a: "A" };
function setText(ex, s) {
  const kg = pn(s.kg) || 0, v = pn(s.val);
  let x;
  if (ex.mode === "time") x = fmtTime(v) + (kg > 0 ? " · " + (ex.bw ? "+" : "") + fmtN(wv(kg)) + " " + uW() : "");
  else if (ex.bw) x = (kg > 0 ? "BW + " + fmtN(wv(kg)) + " " + uW() : "BW") + " × " + fmtN(v);
  else x = kg > 0 ? fmtN(wv(kg)) + " " + uW() + " × " + fmtN(v) : fmtN(v) + " " + t("uReps");
  const it = intText(s.rir, ex);
  if (it) x += " · " + it;
  if (TYTAG[s.ty]) x = TYTAG[s.ty] + " · " + x;
  if (ex.ek === "counter" && s.at) x = hm(s.at) + " · " + x;
  return x;
}
function compactSet(e, s) {
  const p = TYTAG[s.ty] ? TYTAG[s.ty] + " " : "";
  if (e.mode === "time") return p + fmtTime(s.val) + (s.kg > 0 ? "@" + fmtN(wv(s.kg)) : "");
  if (e.bw) return p + (s.kg > 0 ? "+" + fmtN(wv(s.kg)) : "BW") + "×" + fmtN(s.val);
  return p + (s.kg > 0 ? fmtN(wv(s.kg)) : "") + "×" + fmtN(s.val);
}
function sessionStats(s) {
  let sets = 0, vol = 0;
  s.exercises.forEach((ex) => ex.ek === "stretch" || ex.sets.forEach((st) => {
    const v = pn(st.val);
    if (v > 0 && st.ty !== "w") {
      sets++;
      if (ex.mode !== "time") vol += (pn(st.kg) || 0) * v;
    }
  }));
  return { sets, vol: Math.round(vol) };
}
function timeRange(s) {
  if (isFinite(s.startedAt) && isFinite(s.endedAt) && s.endedAt >= s.startedAt) return hm(s.startedAt) + "–" + hm(s.endedAt);
  if (isFinite(s.startedAt)) return hm(s.startedAt);
  return "";
}
function lastPerf(name, excludeId) {
  const n = norm(name);
  if (!n) return null;
  const list = [...sessions].sort(byDateAsc).reverse();
  for (const s of list) {
    if (s.id === excludeId) continue;
    const ex = s.exercises.find((e) => norm(e.name) === n && e.sets.some((x) => pn(x.val) > 0));
    if (ex) return { date: s.date, ex };
  }
  return null;
}
function lastDone(planId) {
  const l = sessions.filter((s) => s.planId === planId).sort(byDateAsc);
  return l.length ? l[l.length - 1].date : null;
}
function exNamesAll(all) {
  const seen = {}, out = [];
  const add = (n) => {
    const k = ckey(n);
    if (k && !seen[k]) {
      seen[k] = 1;
      out.push(libDisp(String(n).trim()));
    }
  };
  meta.plans.filter((p) => all || p.kind !== "stretch").forEach((p) => p.exercises.forEach((e) => add(e.name)));
  (all ? sessions : trSess()).forEach((s) => s.exercises.forEach((e) => add(e.name)));
  if (all) exLibNames().forEach(add);
  return out.sort((a, b) => a.localeCompare(b, lang));
}
function deloadInfo(d) {
  const dl = meta.deload;
  if (!dl || !dl.on || !dl.start) return null;
  const st = weekStart(dateObj(dl.start)), cur = weekStart(d || /* @__PURE__ */ new Date());
  const wk = Math.round((cur - st) / 6048e5);
  if (wk < 0) return null;
  const n = wk % dl.every + 1;
  return { n, every: dl.every, deload: n === dl.every, pct: dl.pct };
}
const reduceKg = (kg, pct) => Math.round(kg * (1 - pct / 100) * 2) / 2;
function cleanSession(s) {
  const ex = s.exercises.map((e) => {
    const stx = e.ek === "stretch" || s.kind === "stretch";
    const o = {
      name: (e.name || "").trim(),
      mode: stx || e.mode === "time" ? "time" : "reps",
      bw: stx ? false : !!e.bw,
      sets: e.skipped ? [] : e.sets.filter((x) => pn(x.val) > 0).map((x) => {
        const r = { kg: stx ? null : pn(x.kg), val: pn(x.val), rir: pn(x.rir), rest: pn(x.rest) };
        if (x.ty && x.ty !== "n") r.ty = x.ty;
        if (x.at) r.at = x.at;
        return r;
      })
    };
    if (e.skipped) o.skipped = true;
    if (e.ek === "stretch" || e.ek === "emom" || e.ek === "counter") o.ek = e.ek;
    if (e.ek === "counter" && pn(e.ctg) > 0) o.ctg = pn(e.ctg);
    if (e.ss) o.ss = true;
    ["tempo", "rom"].forEach((k) => {
      const v = String(e[k] || "").trim();
      if (v) o[k] = v;
    });
    if (e.scale === "rpe" || e.scale === "rir") o.scale = e.scale;
    ["rmin", "rmax", "tkg"].forEach((k) => {
      const v = pn(e[k]);
      if (v !== null) o[k] = v;
    });
    return o;
  }).filter((e) => e.name && (e.sets.length || e.skipped));
  return {
    id: s.editingId || s.id,
    planId: s.planId || null,
    name: (s.name || "").trim() || t("workout"),
    date: s.date || todayStr(),
    startedAt: s.startedAt || Date.now(),
    endedAt: s.editingId ? s.endedAt || Date.now() : Date.now(),
    note: (s.note || "").trim(),
    remark: (s.remark || "").trim(),
    exercises: ex,
    kind: ex.length && ex.every((x) => x.ek === "stretch") ? "stretch" : ex.length && ex.every((x) => x.ek === "emom") ? "emom" : s.kind === "stretch" || s.kind === "emom" ? s.kind : void 0,
    warm: (s.warm || []).filter((w) => String(w.name || "").trim()).map((w) => ({ name: String(w.name).trim(), note: String(w.note || "").trim(), done: !!w.done }))
  };
}
function newSession(plan, kind) {
  const di = deloadInfo(), dl = !!(di && di.deload);
  const exs = (plan ? plan.exercises : []).map((e) => {
    const ek = e.ek || (plan.kind === "stretch" ? "stretch" : plan.kind === "emom" ? "emom" : plan.kind === "counter" ? "counter" : ""), stx = ek === "stretch";
    let pre = "";
    if (dl && e.mode !== "time" && !stx) {
      let base = pn(e.tkg);
      if (!(base > 0)) {
        const lp = lastPerf(e.name), tp = lp ? topSet(lp.ex) : null;
        base = tp ? tp.kg : 0;
      }
      if (base > 0) pre = rawN(reduceKg(base, di.pct));
    }
    const o = {
      uid: uid(),
      name: e.name,
      mode: stx ? "time" : e.mode,
      bw: stx ? false : !!e.bw,
      ss: !!e.ss,
      scale: e.scale || (stx ? "rpe" : void 0),
      tempo: e.tempo || "",
      rom: e.rom || "",
      rmin: e.rmin == null ? null : e.rmin,
      rmax: e.rmax == null ? null : e.rmax,
      tkg: e.tkg == null ? null : e.tkg,
      sets: Array.from({ length: e.sets }, () => ({ kg: pre, val: "", rir: "", rest: e.rest == null ? DEF_REST : e.rest, done: false, ty: "n" }))
    };
    if (ek) o.ek = ek;
    if (ek === "counter") {
      o.sets = [];
      o.mode = "reps";
      o.bw = false;
      o.ctg = pn(e.treps) > 0 ? pn(e.treps) : 100;
    }
    if (e.nw) o.nw = true;
    if (ek === "emom") o.tv = e.treps == null ? 10 : e.treps;
    return o;
  });
  const ns = { id: uid(), planId: plan ? plan.id : null, name: plan ? plan.name : t("workout"), date: todayStr(), startedAt: Date.now(), note: "", remark: "", deload: dl, exercises: exs, u: Date.now() };
  if (plan && plan.warm && plan.warm.length) ns.warm = plan.warm.map((w) => ({ name: w.name, note: w.note || "", done: false }));
  if (exs.some((e) => e.ek === "emom")) {
    const pe = plan && plan.emom || { every: 60, rounds: 10 };
    ns.em = { every: pe.every, rounds: pe.rounds, run: false, t0: 0, el: 0, k: 0 };
    const l = exs.filter((e) => e.ek === "emom");
    l.forEach((ex, i) => {
      const pl = plan.exercises[exs.indexOf(ex)];
      const c = Math.max(0, Math.floor((pe.rounds - i + l.length - 1) / l.length));
      ex.sets = Array.from({ length: c }, () => ({ kg: pl.tkg != null ? rawN(pl.tkg) : "", val: "", rir: "", rest: null, done: false, ty: "n" }));
    });
  }
  return ns;
}
