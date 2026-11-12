// Rozpoczynanie i kończenie treningu, zapis planu.
'use strict';

async function begin(plan, kind) {
  if (active) {
    const ok = await ask(t("replaceActive"), t("discardShort"), true);
    if (!ok) return;
  }
  active = newSession(plan, kind);
  persistActive();
  ui.prevOpen = {};
  rest = null;
  go("train", "logger");
}
async function finishSession() {
  if (active.sw) stopSw();
  if (active.em) active.em.run = false;
  if (active.editingId) {
    const st = msFrom(active.date, active.tStart), en = msFrom(active.date, active.tEnd);
    if (isFinite(st) && isFinite(en) && en >= st) {
      active.startedAt = st;
      active.endedAt = en;
    }
  }
  const c = cleanSession(active);
  if (!c.exercises.some((e) => e.sets.length)) {
    const ok = await ask(t("emptyFinish"), t("discardShort"), true);
    if (ok) discardSession();
    return;
  }
  const i = sessions.findIndex((s) => s.id === c.id);
  if (i >= 0) sessions[i] = c;
  else sessions.push(c);
  persistSessions();
  dbWrite("s-" + c.id, c);
  active = null;
  persistActive();
  rest = null;
  ui.acct = "history";
  go("account", "acsub");
  toast(t("saved", { n: c.name + " – " + fmtDate(c.date) }));
}
function editSnap(a) {
  return JSON.stringify([a.name, a.date, a.tStart, a.tEnd, a.note, a.remark, a.exercises]);
}
function discardSession() {
  active = null;
  persistActive();
  rest = null;
  go("train", null);
}
function savePlan() {
  const p = ui.plan;
  const exs = p.exercises.filter((e) => e.name.trim()).map((e) => {
    const r = pn(e.rest);
    const o = { id: e.id, name: e.name.trim(), sets: e.sets, mode: e.mode, bw: !!e.bw, rest: r !== null && r >= 0 && r <= 900 ? Math.round(r) : DEF_REST };
    if (e.ss) o.ss = true;
    ["rmin", "rmax", "tkg"].forEach((k) => {
      if (k === "tkg" && e.nw) return;
      const v = pn(e[k]);
      if (v !== null && v >= 0) o[k] = v;
    });
    ["tempo", "rom"].forEach((k) => {
      const v = String(e[k] || "").trim();
      if (v) o[k] = v;
    });
    if (e.scale === "rpe" || e.scale === "rir") o.scale = e.scale;
    if (e.ek === "emom" || e.ek === "stretch" || e.ek === "counter") o.ek = e.ek;
    if (e.nw) o.nw = true;
    if (e.ek === "emom") o.treps = e.treps;
    if (e.ek === "counter") {
      const tr = pn(e.treps);
      o.treps = tr > 0 ? Math.round(tr) : 100;
      o.mode = "reps";
      o.bw = false;
      o.sets = 1;
    }
    return o;
  });
  if (!exs.length) {
    toast(t("planNeedsEx"));
    return;
  }
  delete exs[exs.length - 1].ss;
  const plan = { id: p.id, name: p.name.trim() || t("planDefault"), folder: (p.folder || "").trim(), archived: !!p.archived, exercises: exs };
  exs.forEach((e) => {
    if (e.ek === "stretch") {
      e.mode = "time";
      e.bw = false;
      delete e.rmin;
      delete e.rmax;
      delete e.tkg;
    }
  });
  if (exs.every((e) => e.ek === "stretch")) plan.kind = "stretch";
  else if (exs.every((e) => e.ek === "emom")) plan.kind = "emom";
  else if (exs.every((e) => e.ek === "counter")) plan.kind = "counter";
  if (p.warm && p.warm.length) plan.warm = p.warm.filter((w) => String(w.name || "").trim()).map((w) => ({ name: String(w.name).trim(), note: String(w.note || "").trim() }));
  if (exs.some((e) => e.ek === "emom")) {
    const em = p.emom || {}, ev = pn(em.every), rd = pn(em.rounds);
    plan.emom = { every: ev >= 10 && ev <= 900 ? Math.round(ev) : 60, rounds: rd >= 1 && rd <= 200 ? Math.round(rd) : 10 };
    exs.forEach((e) => {
      if (e.ek === "emom") {
        const tr = pn(e.treps);
        e.treps = tr > 0 ? tr : 10;
      }
    });
  }
  const i = meta.plans.findIndex((x) => x.id === p.id);
  if (i >= 0) meta.plans[i] = plan;
  else meta.plans.push(plan);
  persistMeta();
  ui.plan = null;
  go("train", null);
}
