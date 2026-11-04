// Obrazek z podsumowaniem treningu (canvas) i udostępnianie PNG.
'use strict';

let lastPng = null;
function drawSummary() {
  const css = getComputedStyle(document.documentElement), cv = (k) => css.getPropertyValue(k).trim() || "#888";
  const W = 1080, H = 1350, c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  const bg = cv("--bg"), fg = cv("--fg"), mut = cv("--mut"), acc = cv("--acc"), line = cv("--line"), F = "-apple-system,system-ui,Segoe UI,Roboto,sans-serif";
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  const y = +ui.month.slice(0, 4), m = +ui.month.slice(5, 7), inM = trSess().filter((x) => String(x.date).slice(0, 7) === ui.month);
  let sets = 0, vol = 0, mins = 0;
  inM.forEach((x) => {
    const z = sessionStats(x);
    sets += z.sets;
    vol += z.vol;
    if (isFinite(x.startedAt) && isFinite(x.endedAt) && x.endedAt > x.startedAt) mins += (x.endedAt - x.startedAt) / 6e4;
  });
  g.textBaseline = "alphabetic";
  g.fillStyle = mut;
  g.font = "500 34px " + F;
  g.fillText(t("mSummaryT").toUpperCase(), 80, 120);
  g.fillStyle = fg;
  g.font = "700 76px " + F;
  g.fillText(monthLabel(ui.month), 80, 210);
  const stats = [[String(inM.length), t("rvWorkouts")], [String(sets), t("exSets")], [vol ? fmtKg(vol) : fmtTime(mins * 60).slice(0, -3) + " h", vol ? t("exVol") : t("trTime")]];
  stats.forEach((q, i) => {
    const x = 80 + i * 300;
    g.fillStyle = acc;
    let fs = 92;
    g.font = "700 " + fs + "px " + F;
    while (g.measureText(q[0]).width > (i === 2 ? W - 80 - x : 270) && fs > 40) {
      fs -= 4;
      g.font = "700 " + fs + "px " + F;
    }
    g.fillText(q[0], x, 400);
    g.fillStyle = mut;
    g.font = "500 32px " + F;
    g.fillText(q[1], x, 450);
  });
  const days = new Date(y, m, 0).getDate(), first = (new Date(y, m - 1, 1).getDay() + 6) % 7, on = {};
  inM.forEach((x) => {
    on[+String(x.date).slice(8, 10)] = 1;
  });
  for (let d = 1; d <= days; d++) {
    const i = first + d - 1, cx = 80 + i % 7 * 70 + 30, cy = 560 + Math.floor(i / 7) * 70 + 30;
    g.beginPath();
    g.arc(cx, cy, 26, 0, 7);
    g.fillStyle = on[d] ? acc : line;
    g.fill();
    g.fillStyle = on[d] ? cv("--acc-ink") : mut;
    g.font = "500 24px " + F;
    g.textAlign = "center";
    g.fillText(String(d), cx, cy + 9);
  }
  g.textAlign = "left";
  const ex = {};
  inM.forEach((x) => workSets(x).forEach((q) => {
    const k = norm(q.ex.name), o = ex[k] || (ex[k] = { n: q.ex.name, v: 0, c: 0, top: null });
    o.c++;
    o.v += (pn(q.x.kg) || 0) * pn(q.x.val);
  }));
  inM.forEach((x) => x.exercises.forEach((e) => {
    const k = norm(e.name), tp = topSet(e);
    if (ex[k] && tp && (!ex[k].top || (tp.kg > ex[k].top.kg || tp.kg === ex[k].top.kg && tp.val > ex[k].top.val))) ex[k].top = tp;
  }));
  const top = Object.keys(ex).map((k) => ex[k]).sort((a, b) => b.v - a.v || b.c - a.c).slice(0, 4);
  g.fillStyle = mut;
  g.font = "500 30px " + F;
  g.fillText(t("trRank").toUpperCase(), 80, 1040);
  top.forEach((e, i) => {
    const yy = 1100 + i * 64;
    g.fillStyle = fg;
    g.font = "600 38px " + F;
    let nm = e.n;
    while (g.measureText(nm).width > 520 && nm.length > 3) nm = nm.slice(0, -2);
    if (nm !== e.n) nm += "…";
    g.fillText(nm, 80, yy);
    g.fillStyle = mut;
    g.textAlign = "right";
    g.font = "500 34px " + F;
    g.fillText(e.top ? fmtTop(e.top) : "", W - 80, yy);
    g.textAlign = "left";
  });
  return c;
}
function openSummary() {
  let cv;
  try {
    cv = drawSummary();
  } catch (e) {
    toast(t("exportFail"));
    return;
  }
  cv.toBlob((b) => {
    if (!b) {
      toast(t("exportFail"));
      return;
    }
    lastPng = b;
    let u = "";
    try {
      u = URL.createObjectURL(b);
    } catch (e) {
    }
    sheet('<img class="pngp" src="' + u + '" alt="' + esc(t("mSummary")) + '"><p class="hint">' + t("pngHint") + '</p><div class="btns"><button class="btn ghost" data-act="sheet-close">' + t("close") + '</button><button class="btn" data-act="png-share">' + t("pngShare") + "</button></div>");
  }, "image/png");
}
async function sharePng() {
  if (!lastPng) return;
  const name = "podsumowanie-" + ui.month + ".png";
  try {
    const f = new File([lastPng], name, { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [f] })) {
      await navigator.share({ files: [f], title: name });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return;
  }
  try {
    const u = URL.createObjectURL(lastPng), a = document.createElement("a");
    a.href = u;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {
  }
}
