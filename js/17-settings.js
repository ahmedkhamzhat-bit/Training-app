// Strona ustawień i jej sekcje.
'use strict';

function settingsExtra() {
  let h = '<div class="sechead"><span class="lbl">' + t("secData") + "</span></div>";
  h += '<p class="hint" style="margin-top:0">' + t("lastBk", { d: meta.lastBackup ? fmtDate(meta.lastBackup) : t("never") }) + "</p>";
  h += '<div class="btns" style="flex-direction:column;gap:10px"><button class="btn" data-act="export">' + t("exportBtn") + '</button><button class="btn ghost" data-act="import-json">' + t("importBtn") + '</button><button class="link" data-act="paste-import">' + t("pasteBtn") + '</button></div><p class="hint">' + t("backupHint") + "</p>";
  h += '<div class="btns" style="flex-direction:column;gap:10px;margin-top:6px"><button class="btn ghost" data-act="csv-export">' + t("csvExport") + '</button><button class="btn ghost" data-act="csv-import">' + t("csvImport") + '</button></div><p class="hint">' + t("csvHint") + "</p>";
  h += '<div class="sechead" style="margin-top:18px"><span class="lbl">' + t("snapH") + '</span></div><p class="hint" style="margin-top:0">' + t("snapHint") + '</p><div id="snapList"></div>';
  return h;
}
function segOpt(o, cur, items) {
  return '<div class="seg">' + items.map((i) => '<button data-act="opt" data-o="' + o + '" data-v="' + i[0] + '" aria-pressed="' + (String(cur) === String(i[0])) + '">' + i[1] + "</button>").join("") + "</div>";
}
function acSettings() {
  const lt = meta.theme === "light", onOff = [["1", t("on")], ["0", t("off")]], dl = meta.deload;
  const PAL = ["#a78bfa", "#f472b6", "#f87171", "#fb923c", "#4ade80"], ac = meta.accent && meta.accent.hex ? meta.accent.hex.toLowerCase() : null, isPal = !!ac && PAL.indexOf(ac) >= 0;
  const sw = '<button class="sw-c" data-act="accent" data-v="reset" style="background:' + (lt ? "#1d6e8a" : "#8fc1d4") + '" aria-pressed="' + !meta.accent + '" aria-label="' + esc(t("accentDef")) + '"></button>' + PAL.map((c) => '<button class="sw-c" data-act="accent" data-hex="' + c + '" style="background:' + c + '" aria-pressed="' + (ac === c) + '" aria-label="' + c + '"></button>').join("");
  const nf = 'style="max-width:120px;text-align:left;padding-inline:12px"';
  const sec = ui.setSec || "";
  let h = "";
  if (!sec) {
    return ["sub", "lu", "look", "train", "body", "acc"].map((k) => '<button class="setrow" data-act="set-sec" data-v="' + k + '"><span>' + t(SECT[k]) + '</span><span class="chev">›</span></button>').join("");
  }
  if (sec === "sub") {
    h += '<div class="fld"><span class="lbl">' + t("subL") + "</span>" + segOpt("sub", meta.sub ? "1" : "0", onOff) + "</div>";
  } else if (sec === "lu") {
    h += '<div class="fld"><span class="lbl">' + t("lang") + '</span><div class="seg"><button data-act="lang" data-l="pl" aria-pressed="' + (lang === "pl") + '">Polski</button><button data-act="lang" data-l="en" aria-pressed="' + (lang === "en") + '">English</button></div></div>';
    h += '<div class="fld"><span class="lbl">' + t("unitsL") + "</span>" + segOpt("units", meta.units, [["metric", "kg · cm"], ["imperial", "lb · in"]]) + "</div>";
  } else if (sec === "look") {
    h += '<div class="fld"><span class="lbl">' + t("theme") + '</span><div class="seg"><button data-act="theme" data-v="dark" aria-pressed="' + (meta.theme !== "light") + '">' + t("themeDark") + '</button><button data-act="theme" data-v="light" aria-pressed="' + (meta.theme === "light") + '">' + t("themeLight") + "</button></div></div>";
    h += '<div class="fld"><span class="lbl">' + t("accent") + '</span><div class="swatches">' + sw + '<input type="color" class="sw-cc' + (meta.accent && meta.accent.hex && !isPal ? " on" : "") + '" data-k="accent-hex" value="' + esc(meta.accent && meta.accent.hex || "#8fc1d4") + '" aria-label="' + esc(t("accentCustom")) + '"></div></div>';
    h += '<div class="fld"><span class="lbl">' + t("anim") + "</span>" + segOpt("anim", meta.anim ? "1" : "0", onOff) + "</div>";
    h += '<div class="fld"><span class="lbl">' + t("vibe") + "</span>" + segOpt("vibe", meta.vibe ? "1" : "0", onOff) + "</div>";
  } else if (sec === "train") {
    h += '<div class="fld"><span class="lbl">' + t("hintProg") + "</span>" + segOpt("prog", meta.hints.prog ? "1" : "0", onOff) + "</div>";
    h += '<div class="fld"><span class="lbl">' + t("hintRange") + "</span>" + segOpt("range", meta.hints.range ? "1" : "0", onOff) + "</div>";
    h += '<div class="fld"><span class="lbl">' + t("deload") + "</span>" + segOpt("deload", dl.on ? "1" : "0", onOff) + "</div>";
    if (dl.on) {
      h += '<div class="pgrid"><div class="pf"><label class="lbl" for="dlE">' + t("dlEvery") + '</label><input id="dlE" class="num" data-k="dl-every" inputmode="numeric" value="' + esc(dl.every) + '" ' + nf + '></div><div class="pf"><label class="lbl" for="dlP">' + t("dlPct") + '</label><input id="dlP" class="num" data-k="dl-pct" inputmode="decimal" value="' + esc(dl.pct) + '" ' + nf + '></div><div class="pf"><label class="lbl" for="dlS">' + t("dlStart") + '</label><input id="dlS" type="date" data-k="dl-start" value="' + esc(dl.start) + '"></div></div><p class="hint">' + t("dlHint") + "</p>";
    }
  } else if (sec === "acc") {
    h += '<div class="fld"><label class="lbl" for="accE">' + t("accEmail") + '</label><input id="accE" type="email" data-k="acc-email" inputmode="email" autocomplete="off" value="' + esc(meta.accEmail || "") + '"></div>';
    h += '<div class="fld"><label class="lbl" for="accP">' + t("accPass") + '</label><input id="accP" type="password" data-k="acc-pass" autocomplete="new-password"></div><p class="hint">' + t("accHint") + "</p>";
  } else {
    h += '<div class="fld"><span class="lbl">' + t("wGoal") + "</span>" + segOpt("wgoal", meta.wGoal === "loss" ? "loss" : "gain", [["gain", t("wGain")], ["loss", t("wLoss")]]) + "</div>";
  }
  return h;
}
const SECT = { sub: "subL", lu: "secLU", look: "secLook", train: "secTrain", body: "secBody", acc: "secAcc" };
