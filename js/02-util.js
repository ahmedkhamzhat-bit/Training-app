// Małe narzędzia: $, esc, uid, daty, parsowanie liczb, LS (localStorage).
'use strict';

const $ = (s, r) => (r || document).querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = (n) => String(n).padStart(2, "0");
const dstr = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const todayStr = () => dstr(/* @__PURE__ */ new Date());
const fmtDate = (s) => {
  const p = String(s).split("-");
  return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : String(s);
};
const shortDate = (s) => fmtDate(s).slice(0, 5);
const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
const pn = (v) => {
  if (v === null || v === void 0 || v === "") return null;
  const n = parseFloat(String(v).replace(",", "."));
  return isFinite(n) ? n : null;
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const byDateAsc = (a, b) => String(a.date).localeCompare(String(b.date)) || (a.startedAt || 0) - (b.startedAt || 0);
const hm = (ms) => {
  const d = new Date(ms);
  return pad(d.getHours()) + ":" + pad(d.getMinutes());
};
const msFrom = (d, tm) => {
  if (!d || !tm) return NaN;
  const a = String(d).split("-").map(Number), b = String(tm).split(":").map(Number);
  return new Date(a[0], a[1] - 1, a[2], b[0], b[1]).getTime();
};
const DEF_REST = 90;
const LS = {
  get(k) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      return false;
    }
  }
};
