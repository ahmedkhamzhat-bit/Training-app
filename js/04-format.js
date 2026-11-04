// Język, jednostki (kg/lb, cm/in), funkcja t(), formatowanie liczb i czasu.
'use strict';

let lang = "pl";
const imp = () => meta.units === "imperial";
const UNK = { loadKg: 1, kg: 1, toBw: 1, toKg: 1, rvPerVol: 1, chTopKg: 1, chVol: 1, vol: 1, tgtKg: 1, tgtKgL: 1, trRatioNote: 1, wVsPrev: 1, pcVol: 1, stdBw: 1, stdNoBw: 1, chAvgKg: 1, height: 1 };
const wv = (k) => {
  if (k === null || k === void 0 || k === "") return k;
  const n = Number(k);
  return imp() ? Math.round(n * 2.20462 * 100) / 100 : n;
};
const wFrom = (v) => imp() ? Math.round(v / 2.20462 * 1e3) / 1e3 : v;
const lv = (c) => {
  if (c === null || c === void 0 || c === "") return c;
  const n = Number(c);
  return imp() ? Math.round(n * 0.393701 * 10) / 10 : n;
};
const lFrom = (v) => imp() ? Math.round(v / 0.393701 * 100) / 100 : v;
const uW = () => imp() ? "lb" : "kg", uL = () => imp() ? "in" : "cm";
const mu = (m) => m[2] === "cm" ? uL() : m[2], mvv = (m, v) => m[2] === "cm" ? lv(v) : v;
const fmtHt = (cm) => {
  const n = Math.round(cm * 0.393701), f = Math.floor(n / 12);
  return f + "'" + n % 12 + '"';
};
const parseHt = (v) => {
  v = String(v || "").trim().replace(",", ".");
  let m = v.match(/^(\d+)\s*(?:'|′|ft|feet|\s)\s*(\d+(?:\.\d+)?)?\s*(?:"|″|in)?$/i);
  if (m && (/['′]|ft|feet/i.test(v) || m[2] !== void 0)) return +m[1] * 12 + +(m[2] || 0);
  const x = parseFloat(v);
  return isFinite(x) ? x : null;
};
const htIn = (v) => {
  if (imp()) {
    const i = parseHt(v);
    return i === null ? null : Math.round(i / 0.393701 * 10) / 10;
  }
  return pn(v);
};
const htShow = (cm) => cm == null || cm === "" ? "" : imp() ? fmtHt(cm) : lv(cm);
const dwv = (d) => Math.round(d * (imp() ? 2.20462 : 1) * 100) / 100;
const t = (k, p) => {
  let s = T[lang][k] !== void 0 ? T[lang][k] : T.en[k];
  if (s === void 0) return k;
  if (imp() && UNK[k]) s = s.replace(/\bkg\b/g, "lb").replace(/\bcm\b/g, "in");
  if (p) for (const q in p) s = s.split("{" + q + "}").join(p[q]);
  return s;
};
const cnt = (k, n) => {
  const f = T[lang][k] || T.en[k];
  let i;
  if (lang === "pl") i = n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14) ? 1 : 2;
  else i = n === 1 ? 0 : 2;
  return n + " " + f[i];
};
const fmtN = (n) => String(Math.round(n * 100) / 100).replace(".", lang === "pl" ? "," : ".");
const fmtVol = (n) => n.toLocaleString(lang === "pl" ? "pl-PL" : "en-GB");
const fmtTime = (s) => {
  s = Math.max(0, Math.round(s));
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  return h ? h + ":" + pad(m) + ":" + pad(x) : m + ":" + pad(x);
};
const monthLabel = (m) => new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(new Date(+m.slice(0, 4), +m.slice(5, 7) - 1, 1));
const short = (n) => Math.abs(n) >= 1e3 ? String(Math.round(n)) : fmtN(n);
