// Obsługa pól formularzy (input/change, data-k).
'use strict';

document.addEventListener("input", (e) => {
  const el = e.target, k = el.dataset ? el.dataset.k : null;
  if (!k) return;
  const ei = +el.dataset.e, si = +el.dataset.s;
  switch (k) {
    case "kg":
    case "val":
    case "rest": {
      {
        let vv = el.value;
        if (k === "kg" && imp()) {
          const n = pn(vv);
          if (n !== null) vv = String(wFrom(n));
        }
        active.exercises[ei].sets[si][k] = vv;
      }
      el.classList.remove("bad");
      persistActive();
      if (k === "val") {
        const ex = active.exercises[ei], hi = meta.hints.range ? pn(ex.rmax) : null;
        el.classList.toggle("rtop", hi !== null && pn(el.value) >= hi);
        const ch = document.querySelector('[data-rg="' + ei + '"]');
        if (ch) ch.textContent = rangeText(ex);
      }
      break;
    }
    case "rir":
      active.exercises[ei].sets[si].rir = intStore(el.value, active.exercises[ei]);
      el.classList.remove("bad");
      persistActive();
      break;
    case "ex-name":
      active.exercises[ei].name = el.value;
      persistActive();
      break;
    case "s-name":
      active.name = el.value;
      persistActive();
      break;
    case "s-date":
      if (el.value) {
        active.date = el.value;
        persistActive();
      }
      break;
    case "t-start":
      active.tStart = el.value;
      persistActive();
      break;
    case "t-end":
      active.tEnd = el.value;
      persistActive();
      break;
    case "s-note":
      active.note = el.value;
      persistActive();
      grow(el);
      break;
    case "plan-name":
      ui.plan.name = el.value;
      break;
    case "pex-name":
      ui.plan.exercises[ei].name = el.value;
      break;
    case "pex-rest":
      ui.plan.exercises[ei].rest = el.value;
      break;
    case "height": {
      const n = htIn(el.value);
      meta.heightCm = n !== null && n > 50 && n < 260 ? n : null;
      persistMeta();
      break;
    }
    case "rv-ex":
      ui.rvEx = el.value;
      render();
      break;
    case "accent-hex":
      meta.accent = { hex: el.value };
      applyTheme();
      persistMeta();
      break;
    case "dl-every": {
      const n = pn(el.value);
      if (n !== null && n >= 2 && n <= 12) {
        meta.deload.every = Math.round(n);
        persistMeta();
      }
      break;
    }
    case "dl-pct": {
      const n = pn(el.value);
      if (n !== null && n >= 1 && n <= 50) {
        meta.deload.pct = n;
        persistMeta();
      }
      break;
    }
    case "acc-email":
      meta.accEmail = el.value.trim();
      persistMeta();
      break;
    case "acc-pass":
      break;
    case "dl-start":
      if (el.value) {
        meta.deload.start = el.value;
        persistMeta();
      }
      break;
    case "plan-folder":
      ui.plan.folder = el.value;
      break;
    case "pex-rmin":
      ui.plan.exercises[ei].rmin = el.value;
      break;
    case "pex-rmax":
      ui.plan.exercises[ei].rmax = el.value;
      break;
    case "pex-tkg": {
      const n = pn(el.value);
      ui.plan.exercises[ei].tkg = n === null ? el.value : String(wFrom(n));
      break;
    }
    case "pex-tempo":
      ui.plan.exercises[ei].tempo = el.value;
      break;
    case "pex-rom":
      ui.plan.exercises[ei].rom = el.value;
      break;
    case "pk-in": {
      const q = el.value.trim(), l = $("#pkList"), nb = $("#pkNew");
      if (l) l.innerHTML = pickerList(q);
      if (nb) {
        nb.hidden = !q;
        nb.dataset.n = q;
        nb.textContent = t("pkNew", { n: q });
      }
      break;
    }
    case "h-q": {
      ui.hf.q = el.value;
      const l = $("#hlist");
      if (l) l.innerHTML = histListHtml();
      break;
    }
    case "h-plan":
      ui.hf.plan = el.value;
      render();
      break;
    case "h-ex":
      ui.hf.ex = el.value;
      render();
      break;
    case "h-month":
      ui.hf.month = el.value;
      render();
      break;
    case "mus-q":
      ui.musQ = el.value;
      {
        const l = $("#muslist");
        if (l) l.innerHTML = musListHtml();
      }
      break;
    case "emc-every": {
      const n = pn(el.value);
      if (n !== null && n >= 10 && n <= 900 && active && active.em) {
        active.em.every = Math.round(n);
        persistActive();
      }
      break;
    }
    case "emc-rounds": {
      const n = pn(el.value);
      if (n !== null && n >= 1 && n <= 200 && active && active.em) {
        active.em.rounds = Math.round(n);
        emRebuild();
        persistActive();
      }
      break;
    }
    case "emc-treps": {
      const n = pn(el.value);
      if (n !== null && n > 0 && active && active.exercises[ei]) {
        active.exercises[ei].tv = n;
        persistActive();
      }
      break;
    }
    case "pf-q": {
      ui.pfq = el.value;
      const l = $("#pfl");
      if (l) l.innerHTML = pfoldHtml();
      break;
    }
    case "ex2-q": {
      ui.exQ2 = el.value;
      const l = $("#exl2");
      if (l) l.innerHTML = exRowsHtml();
      break;
    }
    case "cex-name":
      el.classList.remove("bad");
      break;
    case "cx-name":
      ui.cx.name = el.value;
      el.classList.remove("bad");
      break;
    case "ex-q":
      ui.exQ = el.value;
      {
        const l = $("#exlist");
        if (l) l.innerHTML = exListHtml();
      }
      break;
    case "day-sel": {
      const i = +el.dataset.d, v = el.value;
      if (v === "") delete meta.schedule[i];
      else if (v === "rest") meta.schedule[i] = { k: "rest" };
      else meta.schedule[i] = { k: "plan", id: v.slice(2) };
      persistMeta();
      closeSheets();
      render();
      break;
    }
    case "day-tag":
    case "day-nt": {
      const i = +el.dataset.d, x = meta.dayx[i] || (meta.dayx[i] = {});
      if (k === "day-tag") x.tag = el.value.trim();
      else x.note = el.value.trim();
      if (!x.tag && !x.note) delete meta.dayx[i];
      persistMeta();
      render();
      break;
    }
    case "prof-name":
      meta.name = el.value.trim();
      persistMeta();
      render();
      break;
    case "p-q":
      ui.pq = el.value;
      {
        const l = $("#psList");
        if (l) l.innerHTML = planListHtml(ui.pq);
      }
      break;
    case "pk-q":
      ui.pkQ = el.value;
      pkRefresh();
      break;
    case "mval":
      if (ui.mVals) ui.mVals[el.dataset.m] = el.value;
      break;
    case "mdate2":
      if (el.value) {
        ui.mDate = el.value;
        render();
      }
      break;
    case "n-text":
      if (ui.note) {
        ui.note.text = el.value;
        el.classList.remove("bad");
      }
      break;
    case "n-date":
      if (ui.note) {
        ui.note.date = el.value || todayStr();
        const q = $(".nds");
        if (q) q.textContent = fmtDate(ui.note.date);
      }
      break;
    case "pw-name":
      ui.plan.warm[ei].name = el.value;
      break;
    case "pw-note":
      ui.plan.warm[ei].note = el.value;
      break;
    case "pex-treps":
      ui.plan.exercises[ei].treps = el.value;
      break;
    case "pem-every":
      ui.plan.emom.every = el.value;
      break;
    case "pem-rounds":
      ui.plan.emom.rounds = el.value;
      break;
    case "warm-name":
      active.warm[ei].name = el.value;
      persistActive();
      break;
    case "pc-r":
      (ui.pc = ui.pc || { m: "dur", r: "month" }).r = el.value;
      render();
      break;
    case "meas-sel":
      ui.meas = el.value;
      render();
      break;
    case "mdate":
      if (el.value) ui.measDate = el.value;
      break;
    case "meas-sel2": {
      ui.meas = el.value;
      const mm = MEAS.find((x) => x[0] === el.value) || MEAS[0], i = $("#mIn");
      if (i) {
        i.placeholder = mu(mm);
        i.setAttribute("aria-label", mu(mm));
      }
      break;
    }
    case "prof-h": {
      const n = htIn(el.value);
      meta.heightCm = n !== null && n > 50 && n < 260 ? n : null;
      persistMeta();
      render();
      break;
    }
    case "prof-b":
      meta.birth = el.value || "";
      persistMeta();
      render();
      break;
    case "fd-rest": {
      const n = pn(el.value);
      if (n !== null && n >= 0 && n <= 900) {
        meta.freeDef = Object.assign({}, fd(), { rest: Math.round(n) });
        persistMeta();
      }
      break;
    }
    case "rec-q":
      {
        ui.recQ = el.value;
        const l = $("#recList");
        if (l) l.innerHTML = recPickHtml();
      }
      break;
  }
});
