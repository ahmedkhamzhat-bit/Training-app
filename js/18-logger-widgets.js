// Zakres dat, chipsy ćwiczenia, stoper serii, arkusze typu serii i tempa.
'use strict';

function grpRange(ei) {
  const ex = active.exercises;
  let a = ei, b = ei;
  while (a > 0 && ex[a - 1].ss) a--;
  while (b < ex.length - 1 && ex[b].ss) b++;
  return [a, b];
}
function rangeText(ex) {
  if (!meta.hints.range) return "";
  const lo = pn(ex.rmin), hi = pn(ex.rmax);
  if (lo === null && hi === null) return "";
  const rg = lo !== null && hi !== null ? fmtN(lo) + "–" + fmtN(hi) : fmtN(lo !== null ? lo : hi) + (lo !== null ? "+" : " max");
  let n = 0, tot = 0;
  if (hi !== null) ex.sets.forEach((s) => {
    if (s.ty !== "w") {
      tot++;
      if (pn(s.val) >= hi) n++;
    }
  });
  return t(ex.mode === "time" ? "rangeChipT" : "rangeChip", { r: rg }) + (hi !== null && n > 0 ? " · " + t("rangeTop", { a: n, b: tot }) : "");
}
function chipsHtml(ex, ei, s) {
  const c = [];
  const rt = rangeText(ex);
  if (rt) c.push('<span data-rg="' + ei + '">' + esc(rt) + "</span>");
  const tk = pn(ex.tkg);
  if (tk > 0) c.push("<span>" + esc(t("tgtKg", { n: fmtN(wv(s.deload ? reduceKg(tk, meta.deload.pct) : tk)) })) + (s.deload ? " ↓" : "") + "</span>");
  const tr = [];
  if (ex.tempo) tr.push(t("tempo") + " " + ex.tempo);
  if (ex.rom) tr.push(ex.rom);
  if (tr.length) c.push("<span>" + esc(tr.join(" · ")) + "</span>");
  return c.join("");
}
function stopSw() {
  if (!active || !active.sw) return;
  const w = active.sw, ex = active.exercises[w.ei], st = ex && ex.sets[w.si];
  if (st) st.val = String(Math.max(1, Math.round((Date.now() - w.t0) / 1e3)));
  active.sw = null;
}
function tickSw() {
  if (!active || !active.sw || ui.screen !== "logger") return;
  const w = active.sw, inp = document.querySelector('input[data-k="val"][data-e="' + w.ei + '"][data-s="' + w.si + '"]');
  if (inp && document.activeElement !== inp) inp.value = Math.max(0, Math.floor((Date.now() - w.t0) / 1e3));
}
function openSetType(ei, si) {
  const cur = active.exercises[ei].sets[si].ty || "n";
  const o = [["n", t("tyN")], ["w", t("tyW")], ["d", t("tyD")], ["f", t("tyF")], ["p", t("tyP")], ["a", t("tyA")]];
  sheet("<h2>" + t("tyH") + '</h2><div class="btns" style="flex-direction:column">' + o.map((x) => '<button class="btn' + (cur === x[0] ? "" : " ghost") + '" data-act="set-type-pick" data-e="' + ei + '" data-s="' + si + '" data-ty="' + x[0] + '">' + x[1] + "</button>").join("") + '</div><p class="hint">' + t("tyNote") + "</p>");
}
function openTempo(ei) {
  const ex = active.exercises[ei];
  sheet("<h2>" + t("tempoRom") + '</h2><div class="fld"><label class="lbl" for="tpIn">' + t("tempo") + '</label><input id="tpIn" maxlength="20" value="' + esc(ex.tempo || "") + '" placeholder="' + esc(t("tempoPh")) + '" autocomplete="off"></div><div class="fld"><label class="lbl" for="romIn">' + t("rom") + '</label><input id="romIn" maxlength="40" value="' + esc(ex.rom || "") + '" placeholder="' + esc(t("romPh")) + '" autocomplete="off"></div><div class="btns" style="margin-top:20px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="tempo-save" data-e="' + ei + '">' + t("save") + "</button></div>");
}
