// Obsługa kliknięć (jeden delegowany handler, akcje data-act).
'use strict';

document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-act]");
  if (!b || b.disabled) return;
  const a = b.dataset.act, D = b.dataset;
  const ei = D.e !== void 0 ? +D.e : -1, si = D.s !== void 0 ? +D.s : -1;
  if (a === "sub-go") {
    closeSheets();
    ui.setSec = "";
    ui.acct = "settings";
    go("account", "acsub");
    return;
  }
  if (!meta.sub && (LOCKRE.test(a) || a === "acct" && D.v !== "history" && D.v !== "notes")) {
    closeSheets();
    paywall();
    return;
  }
  if (ui.screen === "exmenu" && /^ex-/.test(a)) {
    ui.screen = "logger";
    render();
    winTo(0, ui.exmY || 0);
  }
  switch (a) {
    case "tab":
      if (D.t === ui.tab && !ui.screen) {
        winTo(0, 0);
        break;
      }
      go(D.t, null);
      break;
    case "sheet-close":
      closeSheets();
      break;
    case "fd-open":
      sheet(fdHtml());
      break;
    case "lang":
      meta.lang = D.l;
      lang = D.l;
      persistMeta();
      render();
      break;
    case "theme":
      meta.theme = D.v;
      persistMeta();
      render();
      break;
    case "copy": {
      const ta = $("#cpy");
      try {
        await navigator.clipboard.writeText(ta.value);
        toast(t("copied"));
      } catch (_) {
        ta.focus();
        ta.select();
      }
      break;
    }
    case "export":
      exportData();
      break;
    case "paste-import":
      openPasteImport();
      break;
    case "paste-go": {
      const v = ($("#pasteIn") || {}).value || "";
      closeSheets();
      importText(v);
      break;
    }
    case "acct":
      ui.acct = D.v;
      go("account", "acsub");
      break;
    case "pfold-open": {
      ui.pfq = "";
      sheet("<h2>" + t("folder") + '</h2><div class="fld"><input type="search" data-k="pf-q" placeholder="' + esc(t("folderPh")) + '" aria-label="' + esc(t("folder")) + '" autocomplete="off"></div><div id="pfl" class="mlist">' + pfoldHtml() + "</div>");
      break;
    }
    case "pfold-pick": {
      ui.plan.folder = D.f || "";
      const f = D.f || "";
      if (f && !(meta.folders || []).includes(f) && !meta.plans.some((p) => p.folder === f)) {
        meta.folders = meta.folders || [];
        meta.folders.push(f);
        persistMeta();
      }
      closeSheets();
      render();
      break;
    }
    case "cex-del": {
      const n = ui.rvEx;
      const ok = await ask(t("cexDelQ", { n }), t("delShort"), true);
      if (ok) {
        const k = ckey(n);
        meta.customEx = (meta.customEx || []).filter((x) => ckey(x) !== k);
        meta.recentEx = (meta.recentEx || []).filter((x) => ckey(x) !== k);
        persistMeta();
        ui.acct = "ex";
        render();
        winTo(0, 0);
      }
      break;
    }
    case "exd-open":
      exdOpen(D.n);
      go("account", "acsub");
      break;
    case "exd-back":
      ui.acct = "ex";
      go("account", "acsub");
      break;
    case "exd-tab":
      ui.exTab = D.v;
      render();
      break;
    case "exf-eq":
      openExFilt("eq");
      break;
    case "exf-ty":
      openExFilt("ty");
      break;
    case "exf-mu":
      openExFilt("mu");
      break;
    case "exf-tog": {
      const key = "ex" + FK[D.w], a2 = ui[key] || (ui[key] = []), i = a2.indexOf(D.v);
      if (i >= 0) a2.splice(i, 1);
      else a2.push(D.v);
      updDone("ex");
      const b2 = $("#exfBody");
      if (b2) b2.innerHTML = exFiltSheet(D.w);
      const l = $("#exl2");
      if (l) l.innerHTML = exRowsHtml();
      const fb = $("#exfb");
      if (fb) fb.innerHTML = exFiltBtns();
      break;
    }
    case "exf-clear": {
      ui["ex" + FK[D.w]] = [];
      updDone("ex");
      const b2 = $("#exfBody");
      if (b2) b2.innerHTML = exFiltSheet(D.w);
      const l = $("#exl2");
      if (l) l.innerHTML = exRowsHtml();
      const fb = $("#exfb");
      if (fb) fb.innerHTML = exFiltBtns();
      break;
    }
    case "exd-new":
    case "cex-open": {
      ui.cx = { name: D.n || "", eq: [], p: "", s: [], ty: "wr" };
      ui.acct = "exnew";
      go("account", "acsub");
      break;
    }
    case "cx-back":
      ui.acct = "ex";
      go("account", "acsub");
      break;
    case "cx-pick": {
      const w = D.w, ttl = { eq: "exfEq", p: "cxPrim", s: "cxSec", ty: "cxType" }[w], multi = w === "eq" || w === "s";
      const sw = sheet('<div class="bigh"><h2>' + t(ttl) + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div id="cxOpts" class="bigb">' + cxOpts(w) + "</div>" + (multi ? '<div class="btns" style="padding:12px 16px"><button class="btn" data-act="sheet-close">' + t("exfDone") + "</button></div>" : ""));
      sw.querySelector(".sh").classList.add("big");
      break;
    }
    case "cx-tog": {
      const w = D.w, c = ui.cx;
      if (w === "eq" || w === "s") {
        const a2 = c[w], i = a2.indexOf(D.v);
        if (i >= 0) a2.splice(i, 1);
        else a2.push(D.v);
        const o = $("#cxOpts");
        if (o) o.innerHTML = cxOpts(w);
      } else {
        if (w === "p") {
          c.p = c.p === D.v ? "" : D.v;
          c.s = c.s.filter((x) => x !== c.p);
        } else c.ty = D.v;
        closeSheets();
      }
      const nm = $("#cxName");
      if (nm) c.name = nm.value;
      render();
      break;
    }
    case "cx-save": {
      const nm = $("#cxName");
      if (nm) ui.cx.name = nm.value;
      const n = (ui.cx.name || "").trim();
      if (!n) {
        if (nm) {
          nm.classList.add("bad");
          nm.focus();
        }
        break;
      }
      meta.customEx = meta.customEx || [];
      if (!exLibNames().some((x) => ckey(x) === ckey(n))) meta.customEx.push(n);
      meta.exInfo = meta.exInfo || {};
      meta.exInfo[ckey(n)] = { eq: ui.cx.eq.slice(), p: ui.cx.p ? [ui.cx.p] : [], s: ui.cx.s.slice(), ty: ui.cx.ty };
      persistMeta();
      closeSheets();
      exdOpen(n);
      go("account", "acsub");
      break;
    }
    case "cex-add2-old": {
      const n = (D.from === "sheet" ? $("#cexName").value || "" : D.n || "").trim();
      if (!n) {
        if ($("#cexName")) $("#cexName").classList.add("bad");
        break;
      }
      meta.customEx = meta.customEx || [];
      if (!exLibNames().some((x) => ckey(x) === ckey(n))) meta.customEx.push(n);
      persistMeta();
      closeSheets();
      exdOpen(n);
      go("account", "acsub");
      break;
    }
    case "acsub-back":
      go("account", null);
      break;
    case "rvtab":
      ui.rv = D.v;
      render();
      break;
    /* plans */
    case "pkind": {
      ui.plan.kind = D.v || "";
      if (D.v === "emom") {
        if (!ui.plan.emom) ui.plan.emom = { every: 60, rounds: 10 };
        ui.plan.exercises.forEach((e2) => {
          if (e2.treps == null) e2.treps = 10;
        });
      }
      if (D.v === "stretch") ui.plan.exercises.forEach((e2) => {
        e2.mode = "time";
        e2.bw = false;
      });
      render();
      break;
    }
    case "plan-new":
      closeSheets();
      ui.plan = { id: uid(), name: "", folder: D.f || "", exercises: [], isNew: true };
      go("train", "plan");
      break;
    case "plan-edit": {
      closeSheets();
      const p = meta.plans.find((x) => x.id === D.id);
      if (p) {
        ui.plan = clone(p);
        ui.plan.exercises.forEach((x) => {
          if (x.rest == null) x.rest = DEF_REST;
        });
        go("train", "plan");
      }
      break;
    }
    case "plan-cancel":
      ui.plan = null;
      go("train", null);
      break;
    case "plan-save":
      savePlan();
      break;
    case "detail-repeat": {
      const se = sessions.find((x) => x.id === D.id);
      if (!se) break;
      const exs = se.exercises.filter((e2) => !e2.skipped);
      if (!exs.length) break;
      if (active) {
        const ok = await ask(t("replaceActive"), t("discardShort"), true);
        if (!ok) break;
      }
      const plan = { id: null, name: se.name, kind: se.kind === "stretch" ? "stretch" : void 0, exercises: exs.map((e2) => {
        const ws = e2.sets.filter((x) => x.ty !== "w"), rs = ws.map((x) => pn(x.rest)).filter((v) => v > 0);
        const o = { name: e2.name, sets: Math.max(1, ws.length), mode: e2.mode === "time" ? "time" : "reps", bw: !!e2.bw, rest: rs.length ? rs[0] : fdRest() };
        if (e2.ek) o.ek = e2.ek;
        if (e2.nw) o.nw = true;
        if (e2.ss) o.ss = true;
        if (e2.tempo) o.tempo = e2.tempo;
        if (e2.rom) o.rom = e2.rom;
        if (e2.scale) o.scale = e2.scale;
        ["rmin", "rmax", "tkg"].forEach((k) => {
          if (e2[k] != null) o[k] = e2[k];
        });
        return o;
      }) };
      active = newSession(plan, se.kind);
      active.planId = null;
      active.name = se.name;
      persistActive();
      ui.prevOpen = {};
      rest = null;
      go("train", "logger");
      break;
    }
    case "detail-toplan": {
      const se = sessions.find((x) => x.id === D.id);
      if (!se) break;
      const exs = se.exercises.filter((e2) => !e2.skipped).map((e2) => {
        const ws = e2.sets.filter((x) => x.ty !== "w"), top = topSet(e2), rs = ws.map((x) => pn(x.rest)).filter((v) => v > 0);
        const o = { id: uid(), name: e2.name, sets: Math.max(1, ws.length), mode: e2.mode === "time" ? "time" : "reps", bw: !!e2.bw, rest: rs.length ? rs[0] : DEF_REST };
        if (e2.ek) o.ek = e2.ek;
        if (e2.ss) o.ss = true;
        if (e2.tempo) o.tempo = e2.tempo;
        if (e2.rom) o.rom = e2.rom;
        if (e2.scale) o.scale = e2.scale;
        ["rmin", "rmax"].forEach((k) => {
          if (e2[k] != null) o[k] = e2[k];
        });
        if (top && top.kg > 0 && e2.mode !== "time") o.tkg = top.kg;
        else if (e2.tkg != null) o.tkg = e2.tkg;
        return o;
      });
      if (!exs.length) break;
      ui.plan = { id: uid(), name: se.name, folder: "", exercises: exs, isNew: true };
      go("train", "plan");
      toast(t("toPlanHint"));
      break;
    }
    case "home-train":
      go("train", null);
      break;
    case "home-goals":
      ui.acct = "history";
      go("account", null);
      break;
    case "wk-goal":
      sheet("<h2>" + t("wkGoalT") + '</h2><div class="fld"><input id="wkIn" class="num" inputmode="numeric" value="' + esc(meta.weekGoal || 3) + '" style="max-width:120px;text-align:left"></div><p class="hint">' + t("wkGoalH") + '</p><div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="wk-save">' + t("save") + "</button></div>");
      break;
    case "wk-save": {
      const v = Math.round(pn($("#wkIn").value) || 3);
      meta.weekGoal = Math.max(1, Math.min(14, v));
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "plan-menu": {
      const p = meta.plans.find((x) => x.id === D.id);
      if (!p) break;
      sheet('<div class="bigh" style="padding:0 0 8px;position:relative;top:-10px"><h2>' + esc(p.name) + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><div class="btns" style="flex-direction:column"><button class="btn ghost" data-act="plan-edit" data-id="' + p.id + '">' + t("edit") + '</button><button class="btn ghost" data-act="dated-new" data-id="' + p.id + '">' + t("datedNew") + '</button><button class="btn ghost" data-act="plan-rm" data-id="' + p.id + '" style="color:var(--bad)">' + t("delShort") + "</button></div>");
      break;
    }
    case "plan-rm": {
      const p = meta.plans.find((x) => x.id === D.id);
      if (!p) break;
      closeSheets();
      const ok = await ask(t("delPlanQ", { n: p.name || t("planDefault") }), t("delShort"), true);
      if (ok) {
        meta.plans = meta.plans.filter((x) => x.id !== p.id);
        Object.keys(meta.schedule).forEach((k) => {
          if (meta.schedule[k].k === "plan" && meta.schedule[k].id === p.id) delete meta.schedule[k];
        });
        Object.keys(meta.dated).forEach((d) => {
          if (meta.dated[d] === p.id) delete meta.dated[d];
        });
        persistMeta();
        render();
      }
      break;
    }
    case "plan-del": {
      const ok = await ask(t("delPlanQ", { n: ui.plan.name || t("planDefault") }), t("delShort"), true);
      if (ok) {
        const pid = ui.plan.id;
        meta.plans = meta.plans.filter((x) => x.id !== pid);
        Object.keys(meta.schedule).forEach((k) => {
          if (meta.schedule[k].k === "plan" && meta.schedule[k].id === pid) delete meta.schedule[k];
        });
        Object.keys(meta.dated).forEach((d) => {
          if (meta.dated[d] === pid) delete meta.dated[d];
        });
        persistMeta();
        ui.plan = null;
        go("train", null);
      }
      break;
    }
    case "pex-add":
      openExPicker("plan");
      break;
    case "pex-del": {
      const x = ui.plan.exercises[ei];
      const ok = await ask(t("delExQ", { n: x.name || t("exName") }), t("delShort"), true);
      if (ok) {
        ui.plan.exercises.splice(ei, 1);
        render();
      }
      break;
    }
    case "pex-up":
      if (ei > 0) {
        const x = ui.plan.exercises;
        [x[ei - 1], x[ei]] = [x[ei], x[ei - 1]];
        render();
      }
      break;
    case "pex-down": {
      const x = ui.plan.exercises;
      if (ei < x.length - 1) {
        [x[ei + 1], x[ei]] = [x[ei], x[ei + 1]];
        render();
      }
      break;
    }
    case "pex-type": {
      const e2 = ui.plan.exercises[ei];
      e2.ek = D.v || void 0;
      if (D.v === "stretch") {
        e2.mode = "time";
        e2.bw = false;
      }
      if (D.v === "counter") {
        e2.mode = "reps";
        e2.bw = false;
        e2.treps = 100;
      }
      if (D.v === "emom" && e2.treps == null) e2.treps = 10;
      if (D.v === "emom" && !ui.plan.emom) ui.plan.emom = { every: 60, rounds: 10 };
      render();
      break;
    }
    case "pex-mode":
      ui.plan.exercises[ei].mode = D.m;
      delete ui.plan.exercises[ei].nw;
      render();
      break;
    case "pex-bw":
      ui.plan.exercises[ei].bw = D.b === "1";
      if (D.b === "n") ui.plan.exercises[ei].nw = true;
      else delete ui.plan.exercises[ei].nw;
      render();
      break;
    case "pex-sets": {
      const x = ui.plan.exercises[ei];
      x.sets = Math.max(1, Math.min(20, x.sets + +D.d));
      render();
      break;
    }
    /* session start */
    case "start": {
      closeSheets();
      const p = meta.plans.find((x) => x.id === D.id);
      if (p) begin(p);
      break;
    }
    case "start-free":
      begin(null);
      break;
    case "wname-edit":
      if (!active) break;
      sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("wnEdit") + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><div class="fld"><input id="wnIn" maxlength="60" value="' + esc(active.name) + '" autocomplete="off"></div><div class="btns" style="margin-top:14px"><button class="btn" data-act="wname-save">' + t("save") + "</button></div>");
      setTimeout(() => {
        const i = $("#wnIn");
        if (i) {
          i.focus();
          i.select();
        }
      }, 60);
      break;
    case "wname-save": {
      const v = ($("#wnIn").value || "").trim();
      if (v) {
        active.name = v;
        persistActive();
      }
      closeSheets();
      render();
      break;
    }
    case "start-stretch":
      begin(null, "stretch");
      break;
    case "kind-set": {
      if (!active) break;
      if (D.v === "stretch") {
        active.kind = "stretch";
        active.exercises.forEach((e2) => {
          e2.mode = "time";
          e2.bw = false;
          e2.scale = e2.scale || "rpe";
          e2.sets.forEach((x) => {
            x.kg = "";
          });
        });
      } else {
        delete active.kind;
      }
      persistActive();
      render();
      break;
    }
    case "resume":
      ui.prevOpen = {};
      go("train", "logger");
      break;
    /* logger */
    case "leave": {
      if (active && active.editingId) {
        if (editSnap(active) !== active.snap) {
          const ok = await ask(t("editLeaveQ"), t("leaveBtn"), true);
          if (!ok) break;
        }
        active = null;
        persistActive();
        go("account", "detail");
        break;
      }
      go("train", null);
      break;
    }
    case "finish":
      finishSession();
      break;
    case "discard": {
      const ok = await ask(t("discardQ"), t("discardShort"), true);
      if (ok) discardSession();
      break;
    }
    case "ex-add":
      openExPicker("log");
      break;
    case "ex-prev": {
      const ex = active.exercises[ei];
      if (!norm(ex.name)) {
        toast(t("needName"));
        break;
      }
      ui.prevOpen[ex.uid] = !ui.prevOpen[ex.uid];
      render();
      break;
    }
    case "ex-bw": {
      pushUndo();
      const ex = active.exercises[ei];
      ex.bw = !ex.bw;
      delete ex.nw;
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "ex-menu": {
      ui.exmE = ei;
      ui.exmY = winY();
      ui.screen = "exmenu";
      render();
      winTo(0, 0);
      break;
    }
    case "exm-back": {
      ui.screen = "logger";
      render();
      winTo(0, ui.exmY || 0);
      break;
    }
    case "ex-note": {
      const ex = active.exercises[ei];
      if (!ex) break;
      closeSheets();
      sheet("<h2>" + esc(ex.name || t("exMenu")) + '</h2><div class="fld"><label class="lbl" for="xnIn">' + t("exNoteL") + '</label><textarea id="xnIn" maxlength="400" placeholder="' + esc(t("exNotePh")) + '">' + esc((meta.exNotes || {})[ckey(ex.name)] || "") + '</textarea></div><p class="hint">' + t("exNoteH") + '</p><div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="xn-save" data-e="' + ei + '">' + t("save") + "</button></div>");
      break;
    }
    case "xn-save": {
      const ex = active.exercises[ei], k = ex ? ckey(ex.name) : "";
      if (k) {
        const v = ($("#xnIn").value || "").trim();
        meta.exNotes = meta.exNotes || {};
        if (v) meta.exNotes[k] = v;
        else delete meta.exNotes[k];
        persistMeta();
      }
      closeSheets();
      render();
      break;
    }
    case "ex-warm": {
      const ex = active.exercises[ei];
      if (!ex) break;
      if (ex.sets.some((x) => x.ty === "w")) {
        closeSheets();
        toast(t("warmHave"));
        break;
      }
      let w = 0;
      const f = ex.sets.find((x) => pn(x.kg) > 0);
      if (f) w = pn(f.kg);
      if (!(w > 0)) {
        const lp = lastPerf(ex.name, active.editingId), tp = lp ? topSet(lp.ex) : null;
        if (tp && tp.kg > 0) w = tp.kg;
      }
      if (!(w > 0)) {
        closeSheets();
        toast(t("warmNeed"));
        break;
      }
      pushUndo();
      const rr = (x) => Math.max(0, Math.round(x / 2.5) * 2.5), seen = {}, add = [];
      [[0.4, 8], [0.6, 5], [0.8, 3]].forEach((p) => {
        const kg = rr(w * p[0]);
        if (kg > 0 && kg < w && !seen[kg]) {
          seen[kg] = 1;
          add.push({ kg: rawN(kg), val: String(p[1]), rir: "", rest: 45, done: false, ty: "w" });
        }
      });
      if (!add.length) {
        closeSheets();
        toast(t("warmNeed"));
        break;
      }
      const at = ex.sets.findIndex((x) => x.ty !== "w");
      ex.sets.splice(at < 0 ? 0 : at, 0, ...add);
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "ex-type": {
      const ex = active.exercises[ei];
      if (!ex) break;
      const em = active.em || { every: 60, rounds: 10 };
      sheet("<h2>" + esc(ex.name || t("exMenu")) + '</h2><p class="lbl" style="margin:0 0 8px">' + t("exTypeL") + '</p><div class="btns" style="flex-direction:column">' + [["", "kTrain"], ["emom", "kEmom"], ["stretch", "kStretch"]].map((x) => '<button class="btn' + ((ex.ek || "") === x[0] ? "" : " ghost") + '" data-act="ex-settype" data-e="' + ei + '" data-v="' + x[0] + '">' + t(x[1]) + "</button>").join("") + "</div>" + (ex.ek === "emom" ? '<div class="pgrid" style="margin-top:14px"><div class="pf"><span class="lbl">' + t("emEvery") + '</span><input class="num" data-k="emc-every" inputmode="numeric" value="' + esc(em.every) + '" style="width:92px"></div><div class="pf"><span class="lbl">' + t("emRounds") + '</span><input class="num" data-k="emc-rounds" inputmode="numeric" value="' + esc(em.rounds) + '" style="width:92px"></div><div class="pf"><span class="lbl">' + t("emReps") + '</span><input class="num" data-k="emc-treps" data-e="' + ei + '" inputmode="decimal" value="' + esc(ex.tv == null ? 10 : ex.tv) + '" style="width:92px"></div></div>' : "") + '<div class="btns" style="margin-top:16px"><button class="btn" data-act="sheet-close">' + t("close") + "</button></div>");
      break;
    }
    case "ex-settype": {
      pushUndo();
      const ex = active.exercises[ei];
      if (!ex) break;
      if (active.em && active.em.run) {
        toast(t("emLocked"));
        break;
      }
      if (D.v) ex.ek = D.v;
      else delete ex.ek;
      if (D.v === "stretch") {
        ex.mode = "time";
        ex.bw = false;
        ex.scale = ex.scale || "rpe";
        ex.sets.forEach((x) => {
          x.kg = "";
        });
      }
      emRebuild();
      persistActive();
      closeSheets();
      render();
      if (D.v === "emom") document.querySelector('[data-act="ex-type"][data-e="' + ei + '"]') || 0;
      break;
    }
    case "ex-mode": {
      pushUndo();
      const ex = active.exercises[ei];
      ex.mode = ex.mode === "time" ? "reps" : "time";
      delete ex.nw;
      active.sw = null;
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "ex-rm": {
      closeSheets();
      const x = active.exercises[ei];
      const ok = await ask(t("delExQ", { n: x.name || t("exName") }), t("delShort"), true);
      if (ok) {
        pushUndo();
        active.exercises.splice(ei, 1);
        active.sw = null;
        persistActive();
        render();
      }
      break;
    }
    case "ct-add": {
      const i = $("#ci-" + ei), n = Math.round(pn(i && i.value) || 0);
      if (!(n > 0)) {
        if (i) {
          i.classList.add("bad");
          i.focus();
        }
        break;
      }
      pushUndo();
      active.exercises[ei].sets.push({ kg: "", val: String(n), rir: "", rest: null, done: true, ty: "n", at: Date.now() });
      buzz(25);
      persistActive();
      render();
      break;
    }
    case "ct-del": {
      pushUndo();
      active.exercises[ei].sets.splice(si, 1);
      persistActive();
      render();
      break;
    }
    case "set-add": {
      pushUndo();
      const ex = active.exercises[ei];
      const l = ex.sets[ex.sets.length - 1] || {};
      ex.sets.push({ kg: "", val: "", rir: "", rest: l.rest === void 0 ? DEF_REST : l.rest, done: false, ty: "n" });
      persistActive();
      render();
      break;
    }
    case "set-del": {
      const ex = active.exercises[ei];
      const l = ex.sets[ex.sets.length - 1];
      if (ex.sets.length > 1 && l && !l.done) {
        if (pn(l.val) !== null || pn(l.kg) !== null || pn(l.rir) !== null) {
          const ok = await ask(t("delSetQ"), t("delShort"), true);
          if (!ok) break;
        }
        pushUndo();
        ex.sets.pop();
        active.sw = null;
        persistActive();
        render();
      }
      break;
    }
    case "set-done": {
      const st = active.exercises[ei].sets[si];
      if (st.done) {
        pushUndo();
        st.done = false;
        delete st.at;
      } else {
        if (!(pn(st.val) > 0)) {
          const inp = document.querySelector('input[data-k="val"][data-e="' + ei + '"][data-s="' + si + '"]');
          if (inp) {
            inp.classList.add("bad");
            inp.focus();
          }
          break;
        }
        pushUndo();
        if (active.sw && active.sw.ei === ei && active.sw.si === si) stopSw();
        st.done = true;
        st.at = Date.now();
        buzz(25);
        try {
          const ex0 = active.exercises[ei];
          if (!active.editingId && st.ty !== "w" && ex0.ek !== "stretch") {
            const r0 = exStats(ex0.name), kg0 = pn(st.kg) || 0, v0 = pn(st.val);
            if (r0 && !r0.timeOnly && ex0.mode !== "time" && (kg0 > 0 && r0.maxKg > 0 && kg0 > r0.maxKg || kg0 === 0 && r0.maxReps > 0 && v0 > r0.maxReps)) {
              toast(t("prHit", { n: ex0.name }));
              buzz([30, 60, 30]);
            } else if (r0 && r0.timeOnly && v0 > r0.longest) {
              toast(t("prHit", { n: ex0.name }));
            }
          }
        } catch (e2) {
        }
        const g = grpRange(ei);
        let all = true;
        for (let i = g[0]; i <= g[1]; i++) {
          if (i === ei) continue;
          const o = active.exercises[i];
          if (o.skipped) continue;
          const s2 = o.sets[si];
          if (s2 && !s2.done) all = false;
        }
        const r = pn(st.rest);
        if (all && r !== null && r > 0) startRest(r);
        if (g[1] > g[0]) {
          const ne = ei < g[1] ? ei + 1 : g[0], ns = ei < g[1] ? si : si + 1;
          setTimeout(() => {
            const n = document.querySelector('input[data-k="val"][data-e="' + ne + '"][data-s="' + ns + '"]');
            if (n) n.scrollIntoView({ block: "center", behavior: "smooth" });
          }, 80);
        }
      }
      persistActive();
      render();
      break;
    }
    case "rest-add":
      if (rest && !rest.fin) {
        rest.end += +D.d * 1e3;
        rest.total = Math.max(1, rest.total + +D.d);
        tickRest();
      }
      break;
    case "rest-skip":
      rest = null;
      $("#rest").hidden = true;
      break;
    /* history */
    case "detail":
      ui.detailFrom = ui.screen === "acsub" && ui.acct === "exd" ? "exd" : "history";
      ui.detailId = D.id;
      go("account", "detail");
      break;
    case "detail-back":
      ui.acct = ui.detailFrom === "exd" && ui.rvEx ? "exd" : "history";
      ui.detailFrom = null;
      go("account", "acsub");
      break;
    case "detail-edit": {
      if (active) {
        toast(t("finishActiveFirst"));
        break;
      }
      const s = sessions.find((x) => x.id === ui.detailId);
      if (!s) break;
      active = {
        id: uid(),
        editingId: s.id,
        planId: s.planId,
        name: s.name,
        date: s.date,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        note: s.note || "",
        remark: s.remark || "",
        tStart: isFinite(s.startedAt) ? hm(s.startedAt) : "",
        tEnd: isFinite(s.endedAt) ? hm(s.endedAt) : "",
        exercises: s.exercises.map((x) => ({
          uid: uid(),
          name: x.name,
          mode: x.mode,
          bw: !!x.bw,
          ss: !!x.ss,
          skipped: !!x.skipped,
          scale: x.scale || void 0,
          tempo: x.tempo || "",
          rom: x.rom || "",
          rmin: x.rmin == null ? null : x.rmin,
          rmax: x.rmax == null ? null : x.rmax,
          tkg: x.tkg == null ? null : x.tkg,
          ek: x.ek || (s.kind === "stretch" ? "stretch" : void 0),
          ctg: x.ctg,
          sets: x.sets.map((z) => ({ kg: z.kg === null || z.kg === void 0 ? "" : z.kg, val: z.val === null || z.val === void 0 ? "" : z.val, rir: z.rir === null || z.rir === void 0 ? "" : z.rir, rest: z.rest === null || z.rest === void 0 ? "" : z.rest, ty: z.ty || "n", at: z.at || null, done: true }))
        })),
        u: Date.now()
      };
      active.snap = editSnap(active);
      persistActive();
      ui.prevOpen = {};
      go("train", "logger");
      break;
    }
    case "detail-del": {
      const s = sessions.find((x) => x.id === ui.detailId);
      if (!s) break;
      const ok = await ask(t("detDelQ", { n: s.name + " – " + fmtDate(s.date) }), t("delShort"), true);
      if (ok) {
        sessions = sessions.filter((x) => x.id !== s.id);
        persistSessions();
        dbWrite("s-" + s.id, null);
        ui.acct = "history";
        go("account", "acsub");
      }
      break;
    }
    case "remark":
      openRemark(D.id);
      break;
    case "remark-save": {
      const s = sessions.find((x) => x.id === D.id);
      const inp = $("#rmIn");
      if (s && inp) {
        s.remark = inp.value.trim();
        persistSessions();
        dbWrite("s-" + s.id, s);
      }
      closeSheets();
      render();
      break;
    }
    /* review */
    case "month": {
      const y = +ui.month.slice(0, 4), m = +ui.month.slice(5, 7) - 1 + +D.d;
      const nm = dstr(new Date(y, m, 1)).slice(0, 7);
      if (nm <= todayStr().slice(0, 7)) {
        ui.month = nm;
        render();
      }
      break;
    }
    /* body */
    case "w-add": {
      const kg0 = pn($("#wIn").value), kg = kg0 === null ? null : wFrom(kg0), date = $("#wDate").value || todayStr();
      if (kg === null || kg < 20 || kg > 400) break;
      const prevW = [...meta.weights].sort(byDateAsc).pop();
      meta.weights.push({ id: uid(), date, kg: Math.round(kg * 10) / 10 });
      persistMeta();
      render();
      if (prevW) {
        const d = Math.round((Math.round(kg * 10) / 10 - prevW.kg) * 10) / 10;
        toast(t("wAdded", { d: (d > 0 ? "+" : d < 0 ? "−" : "±") + fmtN(dwv(Math.abs(d))) + " " + uW() }));
      }
      break;
    }
    case "w-del": {
      const w = meta.weights.find((x) => x.id === D.id);
      if (!w) break;
      const ok = await ask(t("delWQ", { v: fmtN(wv(w.kg)) + " " + uW(), d: fmtDate(w.date) }), t("delShort"), true);
      if (ok) {
        meta.weights = meta.weights.filter((x) => x.id !== D.id);
        persistMeta();
        render();
      }
      break;
    }
    /* goals */
    case "goal-new":
      openGoalSheet();
      break;
    case "gunit": {
      const w = b.closest(".sh"), was = b.getAttribute("aria-pressed") === "true";
      w.querySelectorAll('[data-act="gunit"]').forEach((x) => x.setAttribute("aria-pressed", String(x === b && !was)));
      w.parentNode.dataset.un = was ? "" : D.v;
      break;
    }
    case "gdue": {
      const w = b.closest(".sh");
      w.querySelectorAll('[data-act="gdue"]').forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      $("#gDue", w).hidden = D.v === "0";
      w.parentNode.dataset.due = D.v;
      break;
    }
    case "goal-save": {
      const text = ($("#gText").value || "").trim();
      if (!text) {
        toast(t("goalNeed"));
        break;
      }
      const wrap = b.closest(".sw");
      const due = wrap && wrap.dataset.due === "1";
      const tg = pn($("#gTg").value);
      meta.goals.push({ id: uid(), text, created: todayStr(), deadline: due ? $("#gDue").value || "" : "", status: "active", closed: "", target: tg > 0 ? tg : null, unit: { r: t("uReps"), w: uW(), s: "s" }[wrap.dataset.un || ""] || "", cur: 0, note: "" });
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "goal-toggle": {
      const g = meta.goals.find((x) => x.id === D.id);
      if (!g) break;
      if (g.status === "active") {
        openGoalClose(g.id, "done");
        break;
      }
      g.status = "active";
      g.closed = "";
      persistMeta();
      render();
      break;
    }
    case "goal-menu": {
      const g = meta.goals.find((x) => x.id === D.id);
      if (!g) break;
      sheet('<h2 style="font-size:20px;overflow-wrap:anywhere">' + esc(g.text) + '</h2><div class="btns" style="flex-direction:column;margin-top:14px">' + (g.status === "active" ? '<button class="btn ghost" data-act="goal-set" data-id="' + g.id + '" data-st="dropped">' + t("goalDrop") + "</button>" : '<button class="btn ghost" data-act="goal-set" data-id="' + g.id + '" data-st="active">' + t("goalRestore") + "</button>") + '<button class="btn ghost" data-act="goal-del" data-id="' + g.id + '" style="color:var(--bad)">' + t("goalDel") + '</button><button class="btn" data-act="sheet-close">' + t("close") + "</button></div>");
      break;
    }
    case "goal-set": {
      const g = meta.goals.find((x) => x.id === D.id);
      if (!g) break;
      if (D.st === "dropped") {
        closeSheets();
        openGoalClose(g.id, "dropped");
        break;
      }
      g.status = D.st;
      g.closed = D.st === "active" ? "" : todayStr();
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "goal-del": {
      closeSheets();
      const ok = await ask(t("goalDelQ"), t("delShort"), true);
      if (ok) {
        meta.goals = meta.goals.filter((x) => x.id !== D.id);
        persistMeta();
        render();
      }
      break;
    }
    case "opt": {
      const o = D.o, v = D.v;
      if (o === "sub") meta.sub = v === "1";
      else if (o === "anim") meta.anim = v === "1";
      else if (o === "vibe") meta.vibe = v === "1";
      else if (o === "units") meta.units = v === "imperial" ? "imperial" : "metric";
      else if (o === "wgoal") meta.wGoal = v;
      else if (o === "scale") meta.scale = v;
      else if (o === "fs") {
        meta.fs = v;
        applyTheme();
      } else if (o === "prog") meta.hints.prog = v === "1";
      else if (o === "range") meta.hints.range = v === "1";
      else if (o === "deload") {
        meta.deload.on = v === "1";
        if (meta.deload.on && !meta.deload.start) meta.deload.start = dstr(weekStart(/* @__PURE__ */ new Date()));
      }
      persistMeta();
      render();
      break;
    }
    case "accent": {
      meta.accent = D.v === "reset" ? null : D.hex ? { hex: D.hex } : { h: +D.h };
      persistMeta();
      render();
      break;
    }
    case "undo":
      undo();
      break;
    case "set-type":
      openSetType(ei, si);
      break;
    case "set-type-pick": {
      pushUndo();
      active.exercises[ei].sets[si].ty = D.ty;
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "sw-toggle": {
      pushUndo();
      const same = active.sw && active.sw.ei === ei && active.sw.si === si;
      stopSw();
      if (!same) active.sw = { ei, si, t0: Date.now() };
      else buzz(30);
      persistActive();
      render();
      break;
    }
    case "ex-skip": {
      pushUndo();
      const x = active.exercises[ei];
      x.skipped = !x.skipped;
      active.sw = null;
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "ex-ss": {
      pushUndo();
      const x = active.exercises[ei];
      x.ss = !x.ss;
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "ex-tempo":
      closeSheets();
      openTempo(ei);
      break;
    case "ex-scale": {
      pushUndo();
      const x = active.exercises[ei];
      x.scale = exScale(x) === "rpe" ? "rir" : "rpe";
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "pex-scale":
      ui.plan.exercises[ei].scale = D.v;
      render();
      break;
    case "tempo-save": {
      pushUndo();
      const x = active.exercises[ei];
      x.tempo = ($("#tpIn").value || "").trim();
      x.rom = ($("#romIn").value || "").trim();
      persistActive();
      closeSheets();
      render();
      break;
    }
    case "arch-toggle":
      ui.showArch = !ui.showArch;
      render();
      break;
    case "day-edit":
      openDaySheet(+D.d);
      break;
    case "day-set": {
      const i = +D.d;
      if (D.k === "none") delete meta.schedule[i];
      else if (D.k === "plan") meta.schedule[i] = { k: "plan", id: D.id };
      else meta.schedule[i] = { k: "rest" };
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "day-note": {
      const i = +D.d, v = ($("#dayTx").value || "").trim();
      if (v) meta.schedule[i] = { k: "note", text: v };
      else delete meta.schedule[i];
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "pex-more": {
      const x = ui.plan.exercises[ei];
      ui.planMore = ui.planMore || {};
      ui.planMore[x.id] = !ui.planMore[x.id];
      render();
      break;
    }
    case "pex-ss":
      ui.plan.exercises[ei].ss = D.v === "1";
      render();
      break;
    case "plan-arch": {
      ui.plan.archived = !ui.plan.archived;
      savePlan();
      break;
    }
    case "pk-tog": {
      const a2 = ui.pkSel || (ui.pkSel = []), i = a2.indexOf(D.n);
      if (i >= 0) a2.splice(i, 1);
      else a2.push(D.n);
      pkRefresh();
      break;
    }
    case "pk-cancel": {
      const b2 = ui.pkBack || { tab: "train" };
      ui.pkSel = null;
      go(b2.tab, b2.screen);
      break;
    }
    case "pk-own": {
      const b2 = ui.pkBack || { tab: "train" };
      if (ui.pk === "plan") {
        const ex = ui.plan.exercises;
        if (!(ex.length === 1 && !ex[0].name.trim())) ex.push({ id: uid(), name: "", sets: 3, mode: "reps", bw: false, rest: DEF_REST, treps: 10 });
      } else if (active) {
        pushUndo();
        active.exercises.push({ uid: uid(), name: "", mode: "reps", bw: false, ss: false, sets: Array.from({ length: fdSets() }, () => ({ kg: "", val: "", rir: "", rest: fdRest(), done: false, ty: "n" })) });
        persistActive();
      }
      ui.pkSel = null;
      go(b2.tab, b2.screen);
      break;
    }
    case "pk-done": {
      const sel = (ui.pkSel || []).slice();
      if (!sel.length) break;
      const b2 = ui.pkBack || { tab: "train" };
      if (ui.pk !== "plan" && active) pushUndo();
      sel.forEach((name) => {
        if (!exLibNames().some((x) => ckey(x) === ckey(name))) {
          meta.customEx = meta.customEx || [];
          meta.customEx.push(name);
        }
        const d = exDefaults(name);
        meta.recentEx = [libDisp(name)].concat((meta.recentEx || []).filter((x) => ckey(x) !== ckey(name))).slice(0, 8);
        if (ui.pk === "plan") {
          const ex = ui.plan.exercises, ne = { id: uid(), name, sets: d.sets, mode: d.mode, bw: d.bw, rest: DEF_REST, treps: 10 };
          if (d.nw) ne.nw = true;
          if (ex.length === 1 && !ex[0].name.trim()) ex[0] = ne;
          else ex.push(ne);
        } else if (active) {
          active.exercises.push({ uid: uid(), nw: d.nw || void 0, name, mode: d.mode, bw: d.bw, ss: false, sets: Array.from({ length: fdSets(d) }, () => ({ kg: "", val: "", rir: "", rest: fdRest(), done: false, ty: "n" })) });
        }
      });
      persistMeta();
      if (ui.pk !== "plan" && active) persistActive();
      ui.pkSel = null;
      go(b2.tab, b2.screen);
      break;
    }
    case "pkf-eq":
      openPkFilt("eq");
      break;
    case "pkf-ty":
      openPkFilt("ty");
      break;
    case "pkf-mu":
      openPkFilt("mu");
      break;
    case "pkf-tog": {
      const key = "pk" + FK[D.w], a2 = ui[key] || (ui[key] = []), i = a2.indexOf(D.v);
      if (i >= 0) a2.splice(i, 1);
      else a2.push(D.v);
      updDone("pk");
      const bd = $("#pkfBody");
      if (bd) bd.innerHTML = pkFiltSheet(D.w);
      pkRefresh();
      break;
    }
    case "pkf-clear": {
      ui["pk" + FK[D.w]] = [];
      updDone("pk");
      const bd = $("#pkfBody");
      if (bd) bd.innerHTML = pkFiltSheet(D.w);
      pkRefresh();
      break;
    }
    case "pk-add": {
      const name = (D.n || "").trim();
      if (!name) break;
      closeSheets();
      const d = exDefaults(name);
      meta.recentEx = [libDisp(name)].concat((meta.recentEx || []).filter((x) => ckey(x) !== ckey(name))).slice(0, 8);
      persistMeta();
      if (ui.pk === "plan") {
        const sx = false, ex = ui.plan.exercises, ne = { id: uid(), name, sets: d.sets, mode: sx ? "time" : d.mode, bw: sx ? false : d.bw, rest: DEF_REST, treps: 10 };
        if (d.nw) ne.nw = true;
        if (ex.length === 1 && !ex[0].name.trim()) ex[0] = ne;
        else ex.push(ne);
        render();
      } else if (active) {
        pushUndo();
        active.exercises.push({ uid: uid(), nw: d.nw || void 0, name, mode: nkS() ? "time" : d.mode, bw: nkS() ? false : d.bw, scale: nkS() ? "rpe" : void 0, ss: false, sets: Array.from({ length: fdSets(d) }, () => ({ kg: "", val: "", rir: "", rest: fdRest(), done: false, ty: "n" })) });
        persistActive();
        render();
      }
      break;
    }
    case "cmp-on":
      ui.cmp = { on: true, ids: [] };
      render();
      break;
    case "cmp-off":
      ui.cmp = { on: false, ids: [] };
      render();
      break;
    case "cmp-pick": {
      const i = ui.cmp.ids.indexOf(D.id);
      if (i >= 0) ui.cmp.ids.splice(i, 1);
      else {
        ui.cmp.ids.push(D.id);
        if (ui.cmp.ids.length > 2) ui.cmp.ids.shift();
      }
      render();
      break;
    }
    case "cmp-go":
      if (ui.cmp.ids.length === 2) go("account", "compare");
      break;
    case "cmp-back":
      ui.cmp = { on: false, ids: [] };
      ui.acct = "history";
      go("account", "acsub");
      break;
    case "range":
      ui.range = D.v;
      closeSheets();
      render();
      break;
    case "rv-range":
      sheet("<h2>" + t("rvRange") + '</h2><div class="btns" style="flex-direction:column">' + [["month", "rMonth"], ["90", "r90"], ["365", "r365"], ["all", "rAll"]].map((x) => '<button class="btn' + (ui.range === x[0] ? "" : " ghost") + '" data-act="range" data-v="' + x[0] + '">' + t(x[1]) + "</button>").join("") + "</div>");
      break;
    case "png-make":
      openSummary();
      break;
    case "png-share":
      sharePng();
      break;
    case "goal-close": {
      const g = meta.goals.find((x) => x.id === D.id);
      if (!g) break;
      g.status = D.st;
      g.closed = todayStr();
      g.note = ($("#gNote").value || "").trim();
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "goal-prog":
      openGoalProg(D.id);
      break;
    case "goal-prog-save": {
      const g = meta.goals.find((x) => x.id === D.id);
      if (!g) break;
      const v = pn($("#gCur").value);
      g.cur = v === null ? 0 : Math.max(0, v);
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "goal-ach":
      go("account", "achv");
      break;
    case "ach-back":
      ui.acct = "goals";
      go("account", "acsub");
      break;
    case "import-json":
      $("#importIn").click();
      break;
    case "csv-export":
      exportCsv();
      break;
    case "csv-import":
      $("#csvIn").click();
      break;
    case "rv-ex-open":
      openExSearch();
      break;
    case "rv-pick":
      ui.rvEx = D.n;
      closeSheets();
      render();
      break;
    case "rv-mus":
      openMuscleSheet(ui.rvEx);
      break;
    case "ex-mus-open": {
      const nm = active.exercises[ei].name;
      closeSheets();
      openMuscleSheet(nm);
      break;
    }
    case "pex-mus":
      openMuscleSheet(ui.plan.exercises[ei].name);
      break;
    case "mus-tog": {
      const k = norm(ui.musName), o = meta.muscles[k] || (meta.muscles[k] = { p: [], s: [] }), m = D.m, a2 = D.r === "p" ? o.p : o.s, b2 = D.r === "p" ? o.s : o.p;
      const i = a2.indexOf(m);
      if (i >= 0) a2.splice(i, 1);
      else {
        a2.push(m);
        const j = b2.indexOf(m);
        if (j >= 0) b2.splice(j, 1);
      }
      if (!o.p.length && !o.s.length) delete meta.muscles[k];
      persistMeta();
      const l = $("#muslist");
      if (l) l.innerHTML = musListHtml();
      break;
    }
    case "mus-done":
      closeSheets();
      render();
      break;
    case "st-add": {
      const n = pn($("#stIn").value), date = $("#stDate").value || todayStr();
      if (n === null || n < 1 || n > 2e5) break;
      const e2 = meta.steps.find((x) => x.date === date);
      if (e2) e2.n = Math.round(n);
      else meta.steps.push({ id: uid(), date, n: Math.round(n) });
      persistMeta();
      render();
      break;
    }
    case "st-del": {
      const x = meta.steps.find((q) => q.id === D.id);
      if (!x) break;
      const ok = await ask(t("delWQ", { v: fmtVol(x.n) + " " + t("stepsU"), d: fmtDate(x.date) }), t("delShort"), true);
      if (ok) {
        meta.steps = meta.steps.filter((q) => q.id !== D.id);
        persistMeta();
        render();
      }
      break;
    }
    case "settings-open":
      closeSheets();
      ui.setSec = "";
      ui.acct = "settings";
      go("account", "acsub");
      break;
    case "set-sec":
      ui.setSec = D.v;
      render();
      winTo(0, 0);
      ui._d = depthNow();
      if (meta.anim !== false) slide("slF");
      break;
    case "set-up":
      if (ui.setSec) {
        ui.setSec = "";
        render();
        winTo(0, 0);
        ui._d = depthNow();
        if (meta.anim !== false) slide("slB");
      } else go("account", null);
      break;
    case "data-open":
      openData();
      break;
    case "hist-w":
      openHist("w");
      break;
    case "hist-s":
      openHist("s");
      break;
    case "prof-edit":
      openProfileEdit();
      break;
    case "prof-photo":
      $("#photoIn").click();
      break;
    case "prof-photo-del": {
      const ok = await ask(t("photoDelQ"), t("delShort"), true);
      if (!ok) break;
      meta.photo = "";
      persistMeta();
      closeSheets();
      render();
      openProfileEdit();
      break;
    }
    case "prof-photo-del-old":
      meta.photo = "";
      persistMeta();
      closeSheets();
      render();
      openProfileEdit();
      break;
    case "height-edit":
      openHeightEdit();
      break;
    case "height-save": {
      const n = htIn($("#hIn").value);
      meta.heightCm = n !== null && n > 50 && n < 260 ? n : null;
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "ps-toggle": {
      ui.pq = "";
      kbSheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("plans") + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '" style="margin-right:-8px">✕</button></div><div class="fld"><input type="search" id="pQ" data-k="p-q" placeholder="' + esc(t("planSearchPh")) + '" aria-label="' + esc(t("planSearchPh")) + '" autocomplete="off"></div><div id="psList" class="pklist">' + planListHtml("") + "</div>");
      const i = $("#pQ");
      if (i) i.focus();
      break;
    }
    case "train-menu":
      sheet("<h2>" + t("plans") + '</h2><div class="btns" style="flex-direction:column"><button class="btn ghost" data-act="plan-new">' + t("newPlan") + '</button><button class="btn ghost" data-act="folder-new">' + t("newFolder") + '</button><button class="btn ghost" data-act="dated-new">' + t("datedNew") + '</button><button class="btn ghost" data-act="train-set">' + t("trainSet") + '</button><button class="btn" data-act="sheet-close">' + t("close") + "</button></div>");
      break;
    case "train-set": {
      closeSheets();
      const seg = '<div class="seg">' + [["rir", "RIR"], ["rpe", "RPE"]].map((x) => '<button data-act="scale-set" data-v="' + x[0] + '" aria-pressed="' + (meta.scale === x[0]) + '">' + x[1] + "</button>").join("") + "</div>";
      sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("trainSet") + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><div class="fld"><span class="lbl">' + t("scaleL") + "</span>" + seg + '</div><div class="btns" style="margin-top:16px"><button class="btn" data-act="sheet-close">' + t("close") + "</button></div>");
      break;
    }
    case "scale-set": {
      meta.scale = D.v === "rpe" ? "rpe" : "rir";
      persistMeta();
      b.closest(".seg").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      break;
    }
    case "h-menu":
      sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("hShowT") + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><div class="btns" style="flex-direction:column">' + [["all", "hShowAll"], ["s", "hShowW"], ["n", "hShowN"]].map((x) => '<button class="btn ' + ((ui.hf.show || "all") === x[0] ? "" : "ghost") + '" data-act="h-show" data-v="' + x[0] + '">' + t(x[1]) + "</button>").join("") + "</div>");
      break;
    case "h-show":
      ui.hf.show = D.v;
      closeSheets();
      render();
      break;
    case "notes-del-on":
      ui.noteSel = [];
      render();
      break;
    case "notes-del-off":
      ui.noteSel = null;
      render();
      break;
    case "notes-pick": {
      if (!ui.noteSel) break;
      const q = ui.noteSel.indexOf(D.id);
      if (q >= 0) ui.noteSel.splice(q, 1);
      else ui.noteSel.push(D.id);
      render();
      break;
    }
    case "notes-del-go": {
      const ids = ui.noteSel || [];
      if (!ids.length) break;
      const ok = await ask(t("noteDelManyQ", { n: ids.length }), t("delShort"), true);
      if (ok) {
        meta.notes = meta.notes.filter((x) => ids.indexOf(x.id) < 0);
        ui.noteSel = null;
        persistMeta();
        render();
      }
      break;
    }
    case "dated-new":
      closeSheets();
      openDatedSheet(D.id);
      break;
    case "dated-save": {
      const pid = $("#dtPlan") && $("#dtPlan").value, d = $("#dtDate") && $("#dtDate").value;
      if (!pid || !/^\d{4}-\d{2}-\d{2}$/.test(d || "") || d < todayStr()) {
        if ($("#dtDate")) $("#dtDate").classList.add("bad");
        break;
      }
      meta.dated[d] = pid;
      persistMeta();
      closeSheets();
      render();
      toast(t("datedSaved"));
      break;
    }
    case "dated-rm":
      delete meta.dated[D.d];
      persistMeta();
      render();
      break;
    case "snap-restore":
      snapRestore(D.d);
      break;
    case "folder-new":
      closeSheets();
      openFolderNew();
      break;
    case "folder-menu":
      openFolderMenu(D.f);
      break;
    case "folder-add": {
      const n = ($("#fnIn").value || "").trim();
      if (!n) break;
      meta.folders = meta.folders || [];
      if (!meta.folders.includes(n)) meta.folders.push(n);
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "folder-save": {
      const n = ($("#fnIn").value || "").trim(), o = D.f;
      if (n && n !== o) {
        meta.plans.forEach((p) => {
          if ((p.folder || "") === o) p.folder = n;
        });
        meta.folders = [...new Set((meta.folders || []).map((x) => x === o ? n : x).concat([n]))];
        persistMeta();
      }
      closeSheets();
      render();
      break;
    }
    case "folder-del": {
      const o = D.f;
      closeSheets();
      const ok = await ask(t("folderDelQ", { n: o }), t("delShort"), true);
      if (ok) {
        meta.plans.forEach((p) => {
          if ((p.folder || "") === o) p.folder = "";
        });
        meta.folders = (meta.folders || []).filter((x) => x !== o);
        persistMeta();
        render();
      }
      break;
    }
    case "pw-add":
      (ui.plan.warm = ui.plan.warm || []).push({ name: "", note: "" });
      render();
      break;
    case "pw-del":
      ui.plan.warm.splice(ei, 1);
      render();
      break;
    case "warm-add": {
      active.warm = active.warm || [];
      active.warm.push({ name: "", note: "", done: false });
      persistActive();
      render();
      const q = document.querySelector('input[data-k="warm-name"][data-e="' + (active.warm.length - 1) + '"]');
      if (q) q.focus();
      break;
    }
    case "warm-done": {
      const w = active.warm[ei];
      if (w) {
        w.done = !w.done;
        persistActive();
        buzz(20);
        render();
      }
      break;
    }
    case "warm-del":
      active.warm.splice(ei, 1);
      persistActive();
      render();
      break;
    case "em-toggle": {
      const e2 = active.em;
      if (!e2) break;
      ensureAudio();
      const tot = e2.rounds * e2.every * 1e3;
      if (e2.run) {
        e2.el = Date.now() - e2.t0;
        e2.run = false;
      } else {
        if (e2.el >= tot) {
          e2.el = 0;
          e2.k = 0;
        }
        e2.t0 = Date.now() - e2.el;
        e2.run = true;
        buzz(40);
      }
      persistActive();
      emUpdate();
      break;
    }
    case "em-reset": {
      const ok = await ask(t("emResetQ"), t("emReset"), true);
      if (ok && active && active.em) {
        active.em.run = false;
        active.em.el = 0;
        active.em.k = 0;
        persistActive();
        emUpdate();
      }
      break;
    }
    case "pc-m":
      (ui.pc = ui.pc || { m: "dur", r: "month" }).m = D.v;
      render();
      break;
    case "pc-r":
      (ui.pc = ui.pc || { m: "dur", r: "month" }).r = D.v;
      render();
      break;
    case "hist-m":
      openHist("m");
      break;
    case "meas-toggle":
      ui.measOpen = !ui.measOpen;
      render();
      break;
    case "meas-add-open": {
      ui.measBack = { tab: ui.tab, screen: ui.screen };
      ui.mDate = todayStr();
      ui.mVals = measFill(ui.mDate);
      go(ui.tab, "measadd");
      break;
    }
    case "meas-edit": {
      const m = MEAS.find((x) => x[0] === D.k) || MEAS[0], L = (meta.meas[m[0]] || []).slice().sort(byDateAsc), ex = L.find((q) => q.date === ui.measDate) || L[L.length - 1];
      sheet("<h2>" + esc(t(m[1])) + '</h2><div class="fld"><label class="lbl" for="mvIn">' + t("noteDate") + ": " + fmtDate(ui.measDate) + " · " + mu(m) + '</label><input id="mvIn" class="num" inputmode="decimal" style="text-align:left;padding-inline:12px" value="' + esc(ex ? fmtN(mvv(m, ex.v)) : "") + '" placeholder="' + mu(m) + '" autocomplete="off"></div><div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="sheet-top">' + t("cancel") + '</button><button class="btn" data-act="meas-save" data-k="' + m[0] + '">' + t("save") + "</button></div>");
      setTimeout(() => {
        const i = $("#mvIn");
        if (i) i.focus();
      }, 60);
      break;
    }
    case "sheet-top": {
      const w = b.closest(".sw");
      if (w) w.remove();
      break;
    }
    case "meas-save": {
      const m = MEAS.find((x2) => x2[0] === D.k) || MEAS[0], x = pn($("#mvIn").value), v = x === null ? null : m[2] === "cm" ? lFrom(x) : x, lo = m[0] === "bf" ? 1 : 5, hi = m[0] === "bf" ? 75 : 300;
      if (v === null || v < lo || v > hi) {
        const i = $("#mvIn");
        i.classList.add("bad");
        i.focus();
        break;
      }
      const L = meta.meas[m[0]] = meta.meas[m[0]] || [], date = ui.measDate || todayStr(), ex = L.find((q) => q.date === date);
      if (ex) ex.v = Math.round(v * 100) / 100;
      else L.push({ id: uid(), date, v: Math.round(v * 100) / 100 });
      persistMeta();
      const w = b.closest(".sw");
      if (w) w.remove();
      const ml = $("#measList");
      if (ml) ml.innerHTML = measListHtml();
      render();
      break;
    }
    case "prof-g":
      meta.gender = D.v || "";
      persistMeta();
      closeSheets();
      render();
      openProfileEdit();
      break;
    case "acx":
      ui.acx = D.v;
      render();
      break;
    case "meas-add": {
      const key = ui.meas || "bf", mm = MEAS.find((x) => x[0] === key) || MEAS[0], v = ((x) => x === null ? null : mm[2] === "cm" ? lFrom(x) : x)(pn($("#mIn").value)), date = $("#mDate").value || todayStr();
      const lo = mm[0] === "bf" ? 1 : 5, hi = mm[0] === "bf" ? 75 : 300;
      if (v === null || v < lo || v > hi) {
        const i = $("#mIn");
        i.classList.add("bad");
        i.focus();
        break;
      }
      const L = meta.meas[key] = meta.meas[key] || [];
      const prev = [...L].sort(byDateAsc).pop();
      L.push({ id: uid(), date, v: Math.round(v * 100) / 100 });
      persistMeta();
      closeSheets();
      render();
      if (prev) {
        const d = Math.round((Math.round(v * 10) / 10 - prev.v) * 10) / 10;
        toast(t("wAdded", { d: (d > 0 ? "+" : d < 0 ? "−" : "±") + fmtN(mvv(mm, Math.abs(d))) + " " + mu(mm) }));
      }
      break;
    }
    case "meas-del": {
      const key = ui.meas || "bf", mm = MEAS.find((x2) => x2[0] === key) || MEAS[0], L = meta.meas[key] || [], x = L.find((q) => q.id === D.id);
      if (!x) break;
      const ok = await ask(t("delWQ", { v: fmtN(x.v) + " " + mm[2], d: fmtDate(x.date) }), t("delShort"), true);
      if (ok) {
        meta.meas[key] = L.filter((q) => q.id !== D.id);
        persistMeta();
        render();
      }
      break;
    }
    case "folder-toggle": {
      ui.fopen = ui.fopen || {};
      ui.fopen[D.f] = !ui.fopen[D.f];
      render();
      break;
    }
    case "fd-sets": {
      const f = Object.assign({}, fd());
      f.sets = Math.max(1, Math.min(20, f.sets + +D.d));
      meta.freeDef = f;
      persistMeta();
      {
        const n = $("#fdN");
        if (n) n.textContent = f.sets;
      }
      break;
    }
    case "rec-pick":
      openRecPick();
      break;
    case "std-open":
      openStd();
      break;
    case "rec-tog": {
      meta.recEx = meta.recEx || [];
      const k = ckey(D.n), i = meta.recEx.findIndex((x) => ckey(x) === k);
      if (i >= 0) meta.recEx.splice(i, 1);
      else meta.recEx.push(D.n);
      persistMeta();
      const on = i < 0;
      b.setAttribute("aria-pressed", on);
      const g = b.querySelector(".gchk");
      g.classList.toggle("on", on);
      g.innerHTML = on ? ICON.check : "";
      render();
      break;
    }
    case "note-new":
      openNote("");
      break;
    case "note-edit":
      openNote(D.id);
      break;
    case "note-save": {
      const nn = ui.note;
      if (!nn) break;
      const tx = (nn.text || "").trim();
      if (!tx) {
        const i = $("#nText");
        if (i) i.classList.add("bad");
        break;
      }
      const dt = nn.date || todayStr();
      if (nn.id) {
        const n = meta.notes.find((x) => x.id === nn.id);
        if (n) {
          n.text = tx;
          n.date = dt;
        }
      } else meta.notes.push({ id: uid(), date: dt, text: tx });
      persistMeta();
      {
        const b2 = ui.noteBack || { tab: "review" };
        ui.note = null;
        go(b2.tab, b2.screen);
      }
      break;
    }
    case "note-rm": {
      const id = D.id;
      const ok = await ask(t("noteDelQ"), t("delShort"), true);
      if (ok) {
        meta.notes = meta.notes.filter((x) => x.id !== id);
        persistMeta();
        render();
      }
      break;
    }
    case "meas-back": {
      const b2 = ui.measBack || { tab: "account", screen: "acsub" };
      ui.mVals = null;
      go(b2.tab, b2.screen);
      break;
    }
    case "meas-save-all": {
      const date = ui.mDate || todayStr(), upd = [];
      let bad = null;
      MEAS.forEach((m) => {
        const raw = ui.mVals && ui.mVals[m[0]];
        if (raw === void 0 || String(raw).trim() === "") return;
        const x = pn(raw), v = x === null ? null : m[2] === "cm" ? lFrom(x) : x, lo = m[0] === "bf" ? 1 : 5, hi = m[0] === "bf" ? 75 : 300;
        if (v === null || v < lo || v > hi) {
          if (!bad) bad = m[0];
          return;
        }
        upd.push([m, v]);
      });
      if (bad) {
        const i = document.querySelector('input[data-m="' + bad + '"]');
        if (i) {
          i.classList.add("bad");
          i.focus();
        }
        break;
      }
      upd.forEach((u) => {
        const L = meta.meas[u[0][0]] = meta.meas[u[0][0]] || [], ex = L.find((q) => q.date === date), v = Math.round(u[1] * 100) / 100;
        if (ex) ex.v = v;
        else L.push({ id: uid(), date, v });
      });
      if (upd.length) persistMeta();
      {
        const b2 = ui.measBack || { tab: "account", screen: "acsub" };
        ui.mVals = null;
        go(b2.tab, b2.screen);
      }
      break;
    }
    case "note-back": {
      const b2 = ui.noteBack || { tab: "review" };
      ui.note = null;
      go(b2.tab, b2.screen);
      break;
    }
    case "note-del": {
      const id = ui.note && ui.note.id;
      if (!id) break;
      const ok = await ask(t("noteDelQ"), t("delShort"), true);
      if (ok) {
        meta.notes = meta.notes.filter((x) => x.id !== id);
        persistMeta();
        const b2 = ui.noteBack || { tab: "review" };
        ui.note = null;
        go(b2.tab, b2.screen);
      }
      break;
    }
    case "cex-add": {
      const n = (D.n || "").trim();
      if (!n) break;
      meta.customEx = meta.customEx || [];
      if (!exLibNames().some((x) => ckey(x) === ckey(n))) meta.customEx.push(n);
      persistMeta();
      ui.rvEx = libDisp(n);
      const rl = $("#recList");
      if (rl) {
        rl.innerHTML = recPickHtml();
      } else {
        closeSheets();
        render();
      }
      break;
    }
  }
});
