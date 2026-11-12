// Normy siły (poziomy dla podstawowych ćwiczeń).
'use strict';

const STD = [
  { k: "squat", n: "stdSquat", re: /back squat|przysiad ze sztang|przysiad.*sztang|^przysiad$|^squat$/i, m: [0.75, 1.25, 1.75, 2.25, 2.75] },
  { k: "bench", n: "stdBench", re: /bench press|wyciskanie sztangi le[żz]/i, m: [0.5, 0.9, 1.25, 1.6, 2] },
  { k: "dead", n: "stdDead", re: /^(deadlift \(barbell\)|martwy ci[aą]g \(sztang[aię]\))$/i, m: [1, 1.5, 2, 2.5, 3] },
  { k: "ohp", n: "stdOhp", re: /ohp|overhead|military|nad g[łl]ow|[żz]o[łl]nierskie/i, m: [0.35, 0.6, 0.9, 1.1, 1.4] },
  { k: "pull", n: "stdPull", re: /podci[aą]g|pull[\s-]?up|chin[\s-]?up/i, r: [0, 3, 10, 16, 21] }
];
const STL = ["Untrained", "Novice", "Proficient", "Advanced", "Elite"];
function stdAuto(x) {
  const nm = exLibNames().filter((n) => x.re.test(n));
  let best = null, bn = 0;
  nm.forEach((n) => {
    const r = exStats(n);
    if (r && r.n > bn) {
      bn = r.n;
      best = n;
    }
  });
  return best;
}
function stdHtml() {
  const bw = meta.weights.length ? [...meta.weights].sort(byDateAsc).pop().kg : null;
  let h = '<p class="stdd">' + t("stdDisc") + '</p><p class="sub" style="margin:12px 0 0">' + (bw ? t("stdBw", { n: fmtN(wv(bw)) }) : t("stdNoBw")) + "</p>";
  STD.forEach((x) => {
    const cur = stdAuto(x) || "", r = cur ? exStats(cur) : null;
    let val = null, txt = "—";
    if (r) {
      if (x.k === "pull") {
        val = r.maxReps;
        txt = fmtN(val) + " " + t("stdReps");
      } else if (r.maxKg > 0 && !(r.best && r.best.bw)) {
        val = r.maxKg;
        txt = t("recMaxKg") + ": " + fmtN(Math.round(wv(val) * 10) / 10) + " " + uW() + (bw ? " · " + fmtN(Math.round(val / bw * 100) / 100) + "×" : "");
      }
    }
    let lvl = -1;
    if (val !== null) {
      const th = x.k === "pull" ? x.r : bw ? x.m.map((m) => m * bw) : null;
      if (th) {
        th.forEach((q, i) => {
          if (val >= q) lvl = i;
        });
      }
    }
    h += '<div class="stdc"><div class="sh1"><b>' + t(x.n) + "</b><span>" + (lvl >= 0 ? STL[lvl] : val !== null ? t("stdBelow") : "") + '</span></div><div class="sub">' + esc(txt) + "</div>";
    h += '<div class="tbl"><div class="tr th stdr">' + STL.map((l) => "<span>" + l + "</span>").join("") + '</div><div class="tr stdr">' + STL.map((l, i) => {
      const lab = x.k === "pull" ? i < 4 ? x.r[i] + "–" + (x.r[i + 1] - 1) : x.r[i] + "+" : "<b>" + fmtN(x.m[i]) + "×</b>" + (bw ? "<i>" + fmtN(Math.round(wv(x.m[i] * bw) * 2) / 2) + " " + uW() + "</i>" : "");
      return '<span class="' + (i === lvl ? "cur" : "") + '">' + lab + "</span>";
    }).join("") + "</div></div></div>";
  });
  return h;
}
function openStd() {
  const w = sheet('<div class="bigh"><h2>' + t("stdH") + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div id="stdBody" class="bigb">' + stdHtml() + "</div>");
  w.querySelector(".sh").classList.add("big");
}
