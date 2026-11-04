// Stan aplikacji: defMeta, meta, sessions, active, normMeta (migracje), motyw, ui.
'use strict';

const defMeta = () => ({
  v: 3,
  units: "metric",
  lang: null,
  theme: "dark",
  accent: null,
  anim: true,
  vibe: true,
  scale: "rir",
  hints: { prog: false, range: true },
  bmi: false,
  heightCm: null,
  deload: { on: false, every: 4, pct: 10, start: "" },
  schedule: {},
  dayx: {},
  name: "",
  photo: "",
  wGoal: "gain",
  folders: [],
  notes: [],
  recEx: [],
  stdMap: {},
  customEx: [],
  meas: {},
  birth: "",
  gender: "",
  steps: [],
  muscles: {},
  lastBackup: "",
  snooze: "",
  created: "",
  plans: [],
  weights: [],
  photos: [],
  goals: []
});
let meta = Object.assign(defMeta(), LS.get("tl.meta") || {});
let sessions = LS.get("tl.sessions") || [];
let active = LS.get("tl.active") || null;
function fixActive() {
  if (active && active.exercises) active.exercises.forEach((e) => {
    if (!e.uid) e.uid = uid();
  });
}
fixActive();
lang = meta.lang || "pl";
function normMeta() {
  meta.sub = !!meta.sub;
  if (typeof meta.accEmail !== "string") meta.accEmail = "";
  if (Array.isArray(meta.daily) && meta.daily.length) {
    const lg = {};
    meta.daily.forEach((x) => {
      lg[x.id] = x.log || {};
    });
    meta.plans.push({ id: uid(), name: "Dzienny licznik", folder: "", archived: false, kind: "daily", exercises: meta.daily.map((x) => ({ id: x.id, name: x.name, sets: 1, mode: "reps", bw: false, rest: 0 })), log: lg });
  }
  delete meta.daily;
  (meta.plans || []).forEach((p) => {
    if (p.kind === "daily") {
      p.kind = "counter";
      delete p.log;
      (p.exercises || []).forEach((e) => {
        e.ek = "counter";
        e.mode = "reps";
        e.bw = false;
        if (e.treps == null) e.treps = 100;
      });
    }
  });
  (meta.plans || []).forEach((p) => {
    if (p.kind === "stretch" || p.kind === "emom") (p.exercises || []).forEach((e) => {
      if (!e.ek) e.ek = p.kind;
    });
  });
  if (!Array.isArray(meta.recentEx)) meta.recentEx = [];
  if (!meta.exInfo || typeof meta.exInfo !== "object") meta.exInfo = {};
  if (!(meta.weekGoal >= 1)) meta.weekGoal = 3;
  if (!meta.exNotes || typeof meta.exNotes !== "object") meta.exNotes = {};
  meta.goals = (meta.goals || []).map((g) => {
    if (g.text !== void 0) return Object.assign({ target: null, unit: "", cur: 0, note: "" }, g);
    const unit = g.type === "kg" ? "kg" : g.type === "time" ? "s" : lang === "pl" ? "powt." : "reps";
    return { id: g.id || uid(), text: (g.exercise || "") + (g.target ? ": " + g.target + " " + unit : ""), created: g.created || todayStr(), deadline: g.deadline || "", status: "active", closed: "", target: null, unit: "", cur: 0, note: "" };
  });
  if (meta.theme !== "light") meta.theme = "dark";
  if (meta.units !== "imperial") meta.units = "metric";
  if (!meta.dayx || typeof meta.dayx !== "object") meta.dayx = {};
  if (!Array.isArray(meta.steps)) meta.steps = [];
  if (!meta.meas || typeof meta.meas !== "object") meta.meas = {};
  if (!Array.isArray(meta.folders)) meta.folders = [];
  if (!Array.isArray(meta.customEx)) meta.customEx = [];
  if (!Array.isArray(meta.notes)) meta.notes = [];
  if (!Array.isArray(meta.recEx)) meta.recEx = [];
  if (!meta.stdMap || typeof meta.stdMap !== "object") meta.stdMap = {};
  if (!meta.muscles || typeof meta.muscles !== "object") meta.muscles = {};
  Object.keys(meta.muscles).forEach((k) => {
    const v = meta.muscles[k];
    if (typeof v === "string") meta.muscles[k] = { p: [v], s: [] };
    else if (!v || !Array.isArray(v.p)) meta.muscles[k] = { p: [], s: [] };
    else if (!Array.isArray(v.s)) v.s = [];
  });
  meta.hints = Object.assign({ prog: false, range: true }, meta.hints || {});
  meta.deload = Object.assign({ on: false, every: 4, pct: 10, start: "" }, meta.deload || {});
  if (!meta.schedule || typeof meta.schedule !== "object") meta.schedule = {};
  if (!meta.dated || typeof meta.dated !== "object" || Array.isArray(meta.dated)) meta.dated = {};
  {
    const cut = new Date();
    cut.setDate(cut.getDate() - 30);
    const cs = dstr(cut);
    Object.keys(meta.dated).forEach((d) => {
      if (d < cs || typeof meta.dated[d] !== "string") delete meta.dated[d];
    });
  }
  if (!meta.muscles || typeof meta.muscles !== "object") meta.muscles = {};
  if (meta.scale !== "rpe") meta.scale = "rir";
  if (meta.anim !== false) meta.anim = true;
  if (meta.vibe !== false) meta.vibe = true;
  if (!meta.created) meta.created = todayStr();
}
normMeta();
function hslHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const x = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return "#" + x(f(0)) + x(f(8)) + x(f(4));
}
function inkFor(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.62 ? "#0b1114" : "#ffffff";
}
function applyTheme() {
  const r = document.documentElement, a = meta.accent, lt = meta.theme === "light";
  r.setAttribute("data-theme", lt ? "light" : "dark");
  r.classList.toggle("noanim", meta.anim === false);
  r.style.zoom = 1;
  if (a && (a.hex || a.h !== void 0)) {
    const hex = a.hex || hslHex(a.h, lt ? 62 : 48, lt ? 32 : 68);
    r.style.setProperty("--acc", hex);
    r.style.setProperty("--acc-ink", inkFor(hex));
  } else {
    r.style.removeProperty("--acc");
    r.style.removeProperty("--acc-ink");
  }
}
applyTheme();
const ui = { hf: { q: "", plan: "", ex: "", month: "" }, cmp: { on: false, ids: [] }, tab: "train", screen: null, acct: "history", rv: "month", range: "month", rvEx: null, month: todayStr().slice(0, 7), plan: null, detailId: null, prevOpen: {} };
const store = { col: null, mode: "local" };
