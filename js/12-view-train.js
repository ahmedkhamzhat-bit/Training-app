// Widok Trening: lista planów, edytor planu (vPlan), ustawienia treningu swobodnego.
'use strict';

function planRow(p, arch) {
  const l = lastDone(p.id);
  return '<li class="row"><div class="grow"><div class="pn">' + esc(p.name) + kindTag(p) + '</div><div class="sub">' + cnt("ex", p.exercises.length) + ", " + (l ? t("last", { d: fmtDate(l) }) : t("never")) + '</div></div><button class="icon" data-act="plan-menu" data-id="' + p.id + '" aria-label="' + esc(t("more")) + '">⋯</button>' + (arch ? "" : '<button class="btn" data-act="start" data-id="' + p.id + '">' + t("start") + "</button>") + "</li>";
}
function vTrain() {
  const di = deloadInfo(), todayI = ((/* @__PURE__ */ new Date()).getDay() + 6) % 7, sc = schedFor(todayStr()), dn = T[lang].dn || T.en.dn;
  let h = '<header class="top"><h1>' + t("tTrain") + '</h1><span class="hbtns"><button class="icon" data-act="ps-toggle" aria-label="' + esc(t("planSearchPh")) + '">' + ICON.search + '</button><button class="icon" data-act="train-menu" aria-label="' + esc(t("more")) + '">⋯</button></span></header>' + weekStrip(todayI, dn);
  if (active) h += '<div class="banner act"><div class="grow"><div class="lbl">' + t("inProgress") + '</div><div class="bn">' + esc(active.name) + '</div></div><button class="btn" data-act="resume">' + t("resume") + "</button></div>";
  if (sc) {
    const pl = sc.k === "plan" ? meta.plans.find((x) => x.id === sc.id) : null;
    if (pl) {
      const ia = active && active.planId === pl.id;
      h += '<div class="banner' + (ia ? " act" : "") + '" style="margin-top:10px"><div class="grow"><div class="lbl">' + t("today") + '</div><div class="bn">' + esc(pl.name) + "</div></div>" + (ia ? '<button class="btn" data-act="resume">' + t("resume") + "</button>" : '<button class="btn" data-act="start" data-id="' + pl.id + '">' + t("start") + "</button>") + "</div>";
    } else if (sc.k === "rest") h += '<div class="banner" style="margin-top:10px"><div class="grow"><div class="lbl">' + t("today") + '</div><div class="bn">' + t("restDay") + "</div></div></div>";
    else if (sc.k === "free") h += '<div class="banner" style="margin-top:10px"><div class="grow"><div class="lbl">' + t("today") + '</div><div class="bn">' + t("workout") + "</div></div></div>";
    else if (sc.k === "note") h += '<div class="banner" style="margin-top:10px"><div class="grow"><div class="lbl">' + t("today") + '</div><div class="bn">' + esc(sc.text) + "</div></div></div>";
  }
  h += datedHtml();
  if (di) h += '<div class="dlb' + (di.deload ? "" : " calm") + '">' + (di.deload ? t("dlBanner", { p: fmtN(di.pct) }) : t("cycleWeek", { n: di.n, e: di.every })) + "</div>";
  h += '<div class="sechead"><span class="lbl">' + t("plans") + "</span></div>";
  h += '<div class="freerow"><button class="btn ghost" data-act="start-free">' + t("freeWorkout") + "</button></div>";
  h += meta.sub ? '<div id="plist">' + planListHtml() + "</div>" : lockCard();
  return h;
}
function vPlan() {
  const p = ui.plan, more = ui.planMore || (ui.planMore = {}), n = p.exercises.length;
  let h = '<header class="top"><button class="icon back" data-act="plan-cancel" aria-label="' + esc(t("back")) + '">←</button><span class="hbtns"><button class="icon' + (p.folder ? " on" : "") + '" data-act="pfold-open" aria-label="' + esc(t("folder")) + '">' + ICON.folder + '</button><button class="btn sm" data-act="plan-save">' + t("save") + "</button></span></header>";
  h += "<h2>" + (p.isNew ? t("planNew") : t("planEdit")) + "</h2>";
  h += '<div class="fld"><label class="lbl" for="planName">' + t("planName") + '</label><input id="planName" data-k="plan-name" value="' + esc(p.name) + '" placeholder="' + esc(t("planNamePh")) + '" autocomplete="off"></div>';
  if (p.folder) h += '<p class="sub" style="margin:-4px 0 12px">' + ICON.folder + " " + esc(p.folder) + "</p>";
  if (p.exercises.some((e) => e.ek === "emom")) {
    const em = p.emom || (p.emom = { every: 60, rounds: 10 });
    h += '<div class="pgrid"><div class="pf"><span class="lbl">' + t("emEvery") + '</span><input class="num" data-k="pem-every" inputmode="numeric" value="' + esc(em.every) + '" style="width:92px"></div><div class="pf"><span class="lbl">' + t("emRounds") + '</span><input class="num" data-k="pem-rounds" inputmode="numeric" value="' + esc(em.rounds) + '" style="width:92px"></div></div><p class="hint">' + t("emHint") + "</p>";
  }
  h += '<div class="sechead"><span class="lbl">' + t("exercises") + "</span></div>";
  h += p.exercises.map((e, i) => {
    const open = !!more[e.id], nf = 'style="width:84px" inputmode="decimal"', sx = e.ek === "stretch", em = e.ek === "emom", ct = e.ek === "counter";
    let c = '<div class="card pcard"><div class="pbody"><input data-k="pex-name" data-e="' + i + '" list="exnames" value="' + esc(e.name) + '" placeholder="' + esc(t("exName")) + '" aria-label="' + esc(t("exName")) + '" autocomplete="off"><div class="pf" style="margin-top:10px"><div class="seg sm">' + [["", "kTrain"], ["emom", "kEmom"], ["counter", "kCounter"]].map((x) => '<button data-act="pex-type" data-e="' + i + '" data-v="' + x[0] + '" aria-pressed="' + ((e.ek || "") === x[0]) + '">' + t(x[1]) + "</button>").join("") + "</div></div>" + (sx || ct ? "" : '<div class="pseg"><div class="seg sm"><button data-act="pex-mode" data-e="' + i + '" data-m="reps" aria-pressed="' + (e.mode === "reps") + '">' + t("modeReps") + '</button><button data-act="pex-mode" data-e="' + i + '" data-m="time" aria-pressed="' + (e.mode === "time") + '">' + t("modeTime") + '</button></div><div class="seg sm"><button data-act="pex-bw" data-e="' + i + '" data-b="0" aria-pressed="' + (!e.bw && !e.nw) + '">' + t("loadKg") + '</button><button data-act="pex-bw" data-e="' + i + '" data-b="1" aria-pressed="' + (!!e.bw && !e.nw) + '">' + t("loadBw") + '</button><button data-act="pex-bw" data-e="' + i + '" data-b="n" aria-pressed="' + !!e.nw + '">' + t("loadNa") + "</button></div></div>") + '<div class="pgrid">' + (ct ? '<div class="pf"><span class="lbl">' + t("ctTarget") + '</span><input class="num" data-k="pex-treps" data-e="' + i + '" inputmode="numeric" value="' + esc(e.treps == null ? "" : e.treps) + '" style="width:104px"></div>' : em ? '<div class="pf"><span class="lbl">' + t("emReps") + '</span><input class="num" data-k="pex-treps" data-e="' + i + '" inputmode="decimal" value="' + esc(e.treps == null ? "" : e.treps) + '" style="width:84px"></div><div class="pf"><span class="lbl">' + t("tgtKgL") + '</span><input class="num" data-k="pex-tkg" data-e="' + i + '" inputmode="decimal" value="' + esc(e.tkg == null ? "" : e.tkg) + '" style="width:84px"></div>' : '<div class="pf"><span class="lbl">' + t("setsN") + '</span><div class="step"><button data-act="pex-sets" data-e="' + i + '" data-d="-1" aria-label="−">−</button><span class="num">' + e.sets + '</span><button data-act="pex-sets" data-e="' + i + '" data-d="1" aria-label="+">+</button></div></div><div class="pf"><span class="lbl">' + t("restS") + '</span><input class="num" data-k="pex-rest" data-e="' + i + '" inputmode="numeric" value="' + esc(e.rest) + '" style="width:92px" aria-label="' + esc(t("restS")) + '"></div>') + '</div><button class="link" data-act="pex-more" data-e="' + i + '" style="margin-top:6px">' + (open ? t("less") : t("more")) + (open ? " ▴" : " ▾") + "</button>";
    if (open) {
      c += '<div class="morep">' + (i < n - 1 ? '<div class="pf"><span class="lbl">' + t("ssPlan") + '</span><div class="seg sm" style="max-width:160px"><button data-act="pex-ss" data-e="' + i + '" data-v="0" aria-pressed="' + !e.ss + '">' + t("no") + '</button><button data-act="pex-ss" data-e="' + i + '" data-v="1" aria-pressed="' + !!e.ss + '">' + t("yes") + "</button></div></div>" : "") + '<button class="btn ghost sm" style="margin-top:10px" data-act="pex-mus" data-e="' + i + '">' + t("exMus") + '</button><div class="pf"><span class="lbl">' + t("scaleL") + '</span><div class="seg sm" style="max-width:160px"><button data-act="pex-scale" data-e="' + i + '" data-v="rir" aria-pressed="' + (exScale(e) === "rir") + '">RIR</button><button data-act="pex-scale" data-e="' + i + '" data-v="rpe" aria-pressed="' + (exScale(e) === "rpe") + '">RPE</button></div></div>' + (sx ? "" : '<div class="pgrid"><div class="pf"><span class="lbl">' + t("rFrom") + '</span><input class="num" data-k="pex-rmin" data-e="' + i + '" value="' + esc(e.rmin == null ? "" : e.rmin) + '" ' + nf + '></div><div class="pf"><span class="lbl">' + t("rTo") + '</span><input class="num" data-k="pex-rmax" data-e="' + i + '" value="' + esc(e.rmax == null ? "" : e.rmax) + '" ' + nf + "></div>" + (e.nw ? "" : '<div class="pf"><span class="lbl">' + t("tgtKgL") + '</span><input class="num" data-k="pex-tkg" data-e="' + i + '" value="' + esc(e.tkg == null || e.tkg === "" ? "" : wv(e.tkg)) + '" ' + nf + "></div>") + "</div>") + '<div class="pgrid"><div class="pf grow"><span class="lbl">' + t("tempo") + '</span><input data-k="pex-tempo" data-e="' + i + '" maxlength="20" value="' + esc(e.tempo || "") + '" placeholder="' + esc(t("tempoPh")) + '"></div><div class="pf grow"><span class="lbl">' + t("rom") + '</span><input data-k="pex-rom" data-e="' + i + '" maxlength="40" value="' + esc(e.rom || "") + '" placeholder="' + esc(t("romPh")) + '"></div></div></div>';
    }
    return c + '</div><div class="tools"><button data-act="pex-up" data-e="' + i + '" aria-label="↑">↑</button><button data-act="pex-down" data-e="' + i + '" aria-label="↓">↓</button><button data-act="pex-del" data-e="' + i + '" aria-label="' + esc(t("delShort")) + '">✕</button></div></div>';
  }).join("");
  h += '<button class="btn ghost block" data-act="pex-add">' + t("addEx") + "</button>";
  if (!p.isNew) h += '<button class="btn ghost block" data-act="plan-arch">' + t(p.archived ? "unarchivePlan" : "archivePlan") + '</button><button class="link danger" style="margin-top:12px" data-act="plan-del">' + t("delPlan") + "</button>";
  return h;
}
function fdHtml() {
  const f = fd();
  return "<h2>" + t("fdT") + '</h2><div class="pgrid" style="margin-top:6px"><div class="pf"><span class="lbl">' + t("setsN") + '</span><div class="step"><button data-act="fd-sets" data-d="-1" aria-label="−">−</button><span class="num" id="fdN">' + f.sets + '</span><button data-act="fd-sets" data-d="1" aria-label="+">+</button></div></div><div class="pf"><span class="lbl">' + t("restS") + '</span><input class="num" data-k="fd-rest" inputmode="numeric" value="' + esc(f.rest) + '" style="width:92px" aria-label="' + esc(t("restS")) + '"></div></div><div class="btns" style="margin-top:18px"><button class="btn" data-act="sheet-close">' + t("close") + "</button></div>";
}
