// Wykresy SVG (słupkowy, liniowy), kalendarz, legenda, tydzień.
'use strict';

const SVGT = 'font-size="10" style="fill:var(--mut);font-family:var(--f-num)"';
function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p, n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return n * p;
}
function xIdx(n) {
  const step = Math.max(1, Math.ceil(n / 5));
  const out = [];
  let last = -99;
  for (let i = 0; i < n; i++) {
    if (i === 0 || i - last >= step) {
      out.push(i);
      last = i;
    }
  }
  if (last !== n - 1 && n - 1 - last >= Math.ceil(step * 0.6)) out.push(n - 1);
  return out;
}
function barChart(items, o) {
  o = o || {};
  const n = items.length;
  if (!n) return "";
  const W = 320, H = 150, pl = o.unit ? 60 : 34, pr = 20, pt = 12, pb = 24, pw = W - pl - pr, ph = H - pt - pb;
  const mx = Math.max.apply(null, items.map((i) => i.v).concat([o.target || 0]));
  const top = o.int ? Math.max(2, Math.ceil(mx / 2) * 2) : niceMax(mx);
  const Y = (v) => pt + ph * (1 - v / top);
  const slot = pw / n, bw = Math.min(28, slot * 0.64);
  let s = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.label || "") + '">';
  [0, top / 2, top].forEach((v) => {
    const y = Y(v);
    s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="stroke:var(--line)" stroke-width="1"/><text x="' + (pl - 6) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end" ' + SVGT + ">" + short(v) + (o.unit ? " " + esc(o.unit) : "") + "</text>";
  });
  items.forEach((it, i) => {
    const x = pl + slot * i + (slot - bw) / 2, h = Math.max(it.v > 0 ? 2 : 0, Y(0) - Y(it.v));
    s += '<rect x="' + x.toFixed(1) + '" y="' + (Y(0) - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" style="fill:var(--acc)"/>';
    if (o.vals && slot >= 22 && it.v > 0) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (Y(0) - h - 4).toFixed(1) + '" text-anchor="middle" font-size="10" style="fill:var(--fg);font-family:var(--f-num)">' + short(it.v) + "</text>";
  });
  if (o.target) {
    const y = Y(o.target).toFixed(1);
    s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--warn)" stroke-width="1.2" stroke-dasharray="4 3"/><text x="' + (W - pr) + '" y="' + (+y - 4) + '" text-anchor="end" font-size="10" style="fill:var(--warn);font-family:var(--f-num)">' + esc(o.targetLabel || "") + "</text>";
  }
  xIdx(n).forEach((i) => {
    s += '<text x="' + (pl + slot * i + slot / 2).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle" ' + SVGT + ">" + esc(items[i].l) + "</text>";
  });
  return s + "</svg>";
}
function lineChart(items, o) {
  o = o || {};
  const n = items.length;
  if (!n) return "";
  const W = 320, H = 150, pl = o.unit ? 60 : 34, pr = 12, pt = 12, pb = 24, pw = W - pl - pr, ph = H - pt - pb;
  const vals = items.map((i) => i.v).concat(o.ghost || []);
  let lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  if (hi - lo < 1) {
    const c = (hi + lo) / 2;
    lo = c - 1;
    hi = c + 1;
  } else {
    const pd = (hi - lo) * 0.12;
    lo -= pd;
    hi += pd;
  }
  lo = Math.floor(lo);
  hi = Math.ceil(hi);
  if (lo < 0 && Math.min.apply(null, vals) >= 0) lo = 0;
  if (hi - lo < 2) hi = lo + 2;
  const X = (i) => n > 1 ? pl + pw * i / (n - 1) : pl + pw / 2, Y = (v) => pt + ph * (1 - (v - lo) / (hi - lo));
  let s = '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.label || "") + '">';
  [lo, (lo + hi) / 2, hi].forEach((v) => {
    const y = Y(v);
    s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="stroke:var(--line)" stroke-width="1"/><text x="' + (pl - 6) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end" ' + SVGT + ">" + short(v) + (o.unit ? " " + esc(o.unit) : "") + "</text>";
  });
  if (o.ghost) o.ghost.forEach((g, i) => {
    s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(g).toFixed(1) + '" r="2" style="fill:var(--mut)" opacity=".55"/>';
  });
  if (n > 1) s += '<polyline points="' + items.map((it, i) => X(i).toFixed(1) + "," + Y(it.v).toFixed(1)).join(" ") + '" fill="none" style="stroke:var(--acc)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
  items.forEach((it, i) => {
    if (i < n - 1) s += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(it.v).toFixed(1) + '" r="2.4" style="fill:var(--acc)"/>';
  });
  s += '<circle cx="' + X(n - 1).toFixed(1) + '" cy="' + Y(items[n - 1].v).toFixed(1) + '" r="4.5" style="fill:var(--acc);stroke:var(--bg)" stroke-width="2"/>';
  xIdx(n).forEach((i) => {
    const x = X(i);
    const anchor = i === 0 && n > 1 ? "start" : i === n - 1 && n > 1 ? "end" : "middle";
    s += '<text x="' + x.toFixed(1) + '" y="' + (H - 7) + '" text-anchor="' + anchor + '" ' + SVGT + ">" + esc(items[i].l) + "</text>";
  });
  return s + "</svg>";
}
function firstSessionDate() {
  let f = "";
  sessions.forEach((x) => {
    if (!f || x.date < f) f = x.date;
  });
  return f;
}
function dayStatus(ds, first) {
  if (sessions.some((x) => x.date === ds)) return "on";
  const sc = schedFor(ds);
  if (sc && sc.k === "rest") return "rest";
  return "";
}
function calendar(y, m, mini) {
  const wd = lang === "pl" ? ["P", "W", "Ś", "C", "P", "S", "N"] : ["M", "T", "W", "T", "F", "S", "S"];
  const first = (new Date(y, m - 1, 1).getDay() + 6) % 7, days = new Date(y, m, 0).getDate(), td = todayStr(), f0 = firstSessionDate();
  let c = '<div class="cal' + (mini ? " mini" : "") + '">' + wd.map((x) => '<span class="cw">' + x + "</span>").join("");
  for (let i = 0; i < first; i++) c += "<span></span>";
  for (let d = 1; d <= days; d++) {
    const ds = y + "-" + pad(m) + "-" + pad(d), st = dayStatus(ds, f0);
    c += '<span class="cd' + (st ? " " + st : "") + (ds === td ? " td" : "") + '">' + d + "</span>";
  }
  if (mini) return c + "</div>";
  return c + "</div>" + legendHtml();
}
function legendHtml() {
  return '<div class="legend"><span><i class="lg on"></i>' + t("legTrain") + '</span><span><i class="lg rest"></i>' + t("legRest") + "</span></div>";
}
function weekStart(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  x.setDate(x.getDate() - (x.getDay() + 6) % 7);
  return x;
}
const dateObj = (s) => new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10), 12);
