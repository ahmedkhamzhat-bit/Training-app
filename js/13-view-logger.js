// Widok trwającego treningu (logger).
'use strict';

function vLogger() {
  const s = active, exs = s.exercises, canUndo = undoStack.length && undoFor === s.id, nk = s.kind === "stretch";
  let h = '<header class="top" style="display:grid;grid-template-columns:1fr auto 1fr"><button class="icon back" data-act="leave" style="justify-self:start" aria-label="' + esc(t("back")) + '">←</button>' + (s.editingId ? "<span></span>" : '<span class="clock lbl" id="clock">0:00</span>') + '<button class="btn sm" data-act="finish" style="justify-self:end">' + t("finish") + "</button></header>";
  h += '<div class="trow"><input class="title" data-k="s-name" value="' + esc(s.name) + '" aria-label="' + esc(t("planName")) + '" autocomplete="off" readonly tabindex="-1"><button class="icon" data-act="wname-edit" aria-label="' + esc(t("wnEdit")) + '">' + ICON.pen + '</button><label class="ndate" aria-label="date"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><input type="date" data-df="1" data-k="s-date" value="' + esc(s.date) + '"></label></div>';
  if (s.editingId) h += '<div class="dtrow"><input type="time" data-k="t-start" value="' + esc(s.tStart || "") + '" aria-label="' + esc(t("tStart")) + '"><input type="time" data-k="t-end" value="' + esc(s.tEnd || "") + '" aria-label="' + esc(t("tEnd")) + '"></div>';
  if (s.em) {
    h += '<div class="emom"><div class="emtop"><span class="lbl">EMOM · ' + t("emEveryS", { n: s.em.every }) + '</span><span class="lbl" id="emRound"></span></div><div class="emnow" id="emNow"></div><div class="emclock" id="emClock">0:00</div><div class="emprog"><i id="emBar"></i></div><div class="emnext" id="emNext"></div><div class="btns" style="margin-top:12px"><button class="btn" id="emBtn" data-act="em-toggle">' + t("emStart") + '</button><button class="btn ghost" data-act="em-reset">' + t("emReset") + "</button></div></div>";
  }
  if (s.deload) {
    const di = deloadInfo();
    h += '<div class="dlb">' + t("dlBanner", { p: fmtN(di ? di.pct : meta.deload.pct) }) + "</div>";
  }
  let ssG = 0, ssP = 0;
  h += exs.map((ex, ei) => {
    const prevSS = ei > 0 && exs[ei - 1].ss, inG = !!ex.ss || prevSS, firstG = inG && !prevSS;
    if (inG) {
      if (firstG) {
        ssG++;
        ssP = 1;
      } else ssP++;
    }
    const ssLab = inG ? String.fromCharCode(64 + ssG) + ssP : "";
    const cls = (inG ? " ss" : "") + (prevSS ? " ssm" : "") + (ex.ss ? " ssn" : "");
    if (ex.skipped) return '<div class="card skipped' + cls + '"><div class="exhead"><div class="grow"><div class="pn">' + esc(ex.name || t("exName")) + '</div><span class="tag">' + t("skippedTag") + '</span></div><button class="link" data-act="ex-skip" data-e="' + ei + '">' + t("unskip") + "</button></div></div>";
    if (ex.ek === "counter") {
      const done = ex.sets.reduce((a, x) => a + (pn(x.val) || 0), 0), tg = pn(ex.ctg) || 0, over = tg > 0 && done > tg, pct = tg > 0 ? Math.min(100, done / tg * 100) : 0;
      let k = '<div class="card ctc' + cls + '"><div class="exhead"><input class="exname" data-k="ex-name" data-e="' + ei + '" list="exnames" value="' + esc(ex.name) + '" placeholder="' + esc(t("exName")) + '" aria-label="' + esc(t("exName")) + '" autocomplete="off"><button class="icon" data-act="ex-menu" data-e="' + ei + '" aria-label="' + esc(t("exMenu")) + '">⋯</button></div><div class="ctbig' + (over ? " over" : "") + '"><b>' + fmtN(done) + "</b><span>/ " + fmtN(tg) + "</span><em>" + (over ? t("ctOver", { n: fmtN(done - tg) }) : t("ctLeft", { n: fmtN(Math.max(0, tg - done)) })) + '</em></div><div class="ctbar"><i style="width:' + pct + '%"></i></div><div class="oneline" style="margin-top:8px"><input id="ci-' + ei + '" class="num" inputmode="numeric" placeholder="' + esc(t("ctPh")) + '" aria-label="' + esc(t("ctPh")) + '" autocomplete="off" style="text-align:left;padding-inline:12px"><button class="btn" data-act="ct-add" data-e="' + ei + '">' + t("ctAdd") + "</button></div>";
      k += ex.sets.length ? '<div class="ctchips">' + ex.sets.map((st, si) => '<span class="ctchip"><small>' + (st.at ? hm(st.at) : "") + "</small><b>+" + fmtN(pn(st.val) || 0) + '</b><button data-act="ct-del" data-e="' + ei + '" data-s="' + si + '" aria-label="' + esc(t("delShort")) + '">✕</button></span>').reverse().join("") + "</div>" : "";
      return k + "</div>";
    }
    const nk2 = ex.ek === "stretch" || !!ex.nw, lastDoneFlag = ex.sets.length && ex.sets[ex.sets.length - 1].done, hi = meta.hints.range ? pn(ex.rmax) : null;
    let c = '<div class="card' + cls + '">' + (inG ? '<div class="lbl ssl">' + t("superset") + " · " + ssLab + "</div>" : "") + '<div class="exhead"><input class="exname" data-k="ex-name" data-e="' + ei + '" list="exnames" value="' + esc(ex.name) + '" placeholder="' + esc(t("exName")) + '" aria-label="' + esc(t("exName")) + '" autocomplete="off"><button class="icon" data-act="ex-menu" data-e="' + ei + '" aria-label="' + esc(t("exMenu")) + '">⋯</button></div><div class="exsub"><button class="link" data-act="ex-prev" data-e="' + ei + '">' + t("prev") + "</button>" + chipsHtml(ex, ei, s) + "</div>" + ((meta.exNotes || {})[ckey(ex.name)] ? '<button class="xnote" data-act="ex-note" data-e="' + ei + '">' + esc(meta.exNotes[ckey(ex.name)]) + "</button>" : "");
    if (ui.prevOpen[ex.uid]) {
      const lp = lastPerf(ex.name, s.editingId);
      c += '<div class="prev">' + (lp ? '<span class="lbl">' + t("prevOn", { d: fmtDate(lp.date) }) + "</span>" + lp.ex.sets.filter((x) => pn(x.val) > 0).map((x) => "<span>" + esc(setText(lp.ex, x)) + "</span>").join("") : "<span>" + t("prevNone") + "</span>") + "</div>";
    }
    c += '<div class="sets' + (nk2 ? " nk" : "") + '"><div class="set hd"><span>' + t("setH") + "</span>" + (nk2 ? "" : "<span>" + (ex.bw ? "BW +" + uW() : t("kg")) + "</span>") + "<span>" + (ex.mode === "time" ? t("time") : t("reps")) + "</span><span>" + intName(ex) + "</span><span>" + t("restH") + "</span><span></span></div>";
    const lpx = lastPerf(ex.name, s.editingId), lpw = lpx ? lpx.ex.sets.filter((x) => pn(x.val) > 0 && x.ty !== "w") : [];
    c += ex.sets.map((st, si) => {
      const wi = ex.sets.slice(0, si).filter((x) => x.ty !== "w").length, pl = st.ty === "w" ? null : lpw[wi];
      const run = !!(s.sw && s.sw.ei === ei && s.sw.si === si);
      const tyc = TYTAG[st.ty] ? " ty " + st.ty : "";
      const vin = '<input class="num' + (hi !== null && pn(st.val) >= hi ? " rtop" : "") + '" inputmode="' + (ex.mode === "time" ? "numeric" : "decimal") + '" data-k="val" data-e="' + ei + '" data-s="' + si + '" value="' + esc(st.val === null || st.val === void 0 ? "" : st.val) + '" placeholder="' + (pl ? fmtRaw(pl.val) : ex.mode === "time" ? "s" : "—") + '" aria-label="' + esc(ex.mode === "time" ? t("time") : t("reps")) + '" autocomplete="off">';
      const vcell = ex.mode === "time" ? '<div class="vcell">' + vin + '<button class="swb' + (run ? " run" : "") + '" data-act="sw-toggle" data-e="' + ei + '" data-s="' + si + '" aria-label="' + esc(run ? t("swStop") : t("swStart")) + '">' + (run ? "■" : "▶") + "</button></div>" : vin;
      return '<div class="set' + (st.done ? " done" : "") + '"><button class="si' + tyc + '" data-act="set-type" data-e="' + ei + '" data-s="' + si + '" aria-label="' + esc(t("tyH")) + '">' + (TYTAG[st.ty] || setNo(ex.sets, si)) + "</button>" + (nk2 ? "" : '<input class="num" inputmode="decimal" data-k="kg" data-e="' + ei + '" data-s="' + si + '" value="' + esc(st.kg === null || st.kg === void 0 || st.kg === "" ? "" : fmtRaw(wv(st.kg))) + '" placeholder="' + (pl && pn(pl.kg) > 0 ? fmtRaw(wv(pl.kg)) : ex.bw ? "+" + uW() : uW()) + '" aria-label="' + esc(ex.bw ? "BW +" + uW() : uW()) + '" autocomplete="off">') + vcell + '<input class="num" inputmode="decimal" data-k="rir" data-e="' + ei + '" data-s="' + si + '" value="' + esc(intShow(st.rir, ex)) + '" placeholder="' + intName(ex) + '" aria-label="' + intName(ex) + '" autocomplete="off"><input class="num" inputmode="numeric" data-k="rest" data-e="' + ei + '" data-s="' + si + '" value="' + esc(st.rest === null || st.rest === void 0 ? "" : st.rest) + '" placeholder="s" aria-label="' + esc(t("restS")) + '" autocomplete="off"><button class="chk" data-act="set-done" data-e="' + ei + '" data-s="' + si + '" aria-pressed="' + !!st.done + '" aria-label="' + esc(t("done")) + '">' + ICON.check + "</button></div>";
    }).join("") + "</div>";
    c += '<div class="cardtools"><div class="pm"><button data-act="set-del" data-e="' + ei + '" aria-label="' + esc(t("delSetA")) + '"' + (ex.sets.length <= 1 || lastDoneFlag ? " disabled" : "") + '>−</button><button data-act="set-add" data-e="' + ei + '" aria-label="' + esc(t("addSetA")) + '">+</button></div></div></div>';
    return c;
  }).join("");
  h += '<button class="btn ghost block" data-act="ex-add">' + t("addEx") + "</button>";
  h += '<div class="fld"><label class="lbl" for="sNote">' + t("note") + '</label><textarea id="sNote" data-k="s-note" placeholder="' + esc(t("notePh")) + '">' + esc(s.note || "") + "</textarea></div>";
  h += '<button class="btn block" data-act="finish">' + t("finishFull") + "</button>";
  h += '<div style="text-align:center;margin-top:8px"><button class="link danger" data-act="discard">' + t("discard") + "</button></div>";
  return h;
}
