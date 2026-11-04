// Kopia zapasowa: eksport/import JSON i CSV.
'use strict';

function markBackup() {
  meta.lastBackup = todayStr();
  persistMeta();
}
async function shareFile(name, mime, text) {
  let dl = null;
  try {
    if (window.claude && window.claude.use) dl = await claude.use("downloads");
  } catch (e) {
  }
  if (dl) {
    try {
      await dl.save({ filename: name, data: text });
      return true;
    } catch (e) {
      if (e && e.code === "declined") return false;
    }
  }
  try {
    const f = new File([text], name, { type: mime });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [f] })) {
      await navigator.share({ files: [f], title: name });
      return true;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return false;
  }
  let url = "";
  try {
    url = URL.createObjectURL(new Blob([text], { type: mime }));
  } catch (e) {
  }
  sheet('<p class="q">' + t("exportFail") + '</p><textarea class="copyarea" readonly id="cpy">' + esc(text) + '</textarea><div class="btns" style="margin-top:12px"><button class="btn" data-act="copy">' + t("copy") + "</button>" + (url ? '<a class="btn ghost" href="' + url + '" download="' + esc(name) + '">' + t("downloadFile") + "</a>" : "") + "</div>");
  return true;
}
async function exportData() {
  const payload = JSON.stringify({ app: "dziennik-serii", v: 2, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), meta, sessions }, null, 1);
  if (await shareFile("dziennik-serii-" + todayStr() + ".json", "application/json", payload)) markBackup();
}
function csvEsc(v, sep) {
  v = String(v == null ? "" : v);
  return v.indexOf(sep) >= 0 || /["\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}
async function exportCsv() {
  const pl = lang === "pl", sep = pl ? ";" : ",", num = (v) => v === null || v === void 0 ? "" : pl ? String(v).replace(".", ",") : String(v);
  const rows = [["Date", "Workout", "Start", "End", "Exercise", "Set", "Type", "Weight (kg)", "Bodyweight", "Reps", "Seconds", "RIR", "Rest (s)", "Skipped", "Remark", "Workout note"]];
  const hh = (x) => x && isFinite(x) ? hm(x) : "";
  sessions.slice().sort(byDateAsc).forEach((se) => se.exercises.forEach((ex) => {
    if (ex.skipped) {
      rows.push([se.date, se.name, hh(se.startedAt), hh(se.endedAt), ex.name, "", "", "", "", "", "", "", "", "1", se.remark || "", se.note || ""]);
      return;
    }
    ex.sets.forEach((x, i) => {
      const tm = ex.mode === "time";
      rows.push([se.date, se.name, hh(se.startedAt), hh(se.endedAt), ex.name, i + 1, { w: "warmup", d: "drop", f: "failure", p: "pause", a: "assisted" }[x.ty] || "normal", num(x.kg), ex.bw ? 1 : 0, tm ? "" : num(x.val), tm ? num(x.val) : "", num(x.rir), num(x.rest), "", se.remark || "", se.note || ""]);
    });
  }));
  const text = "\uFEFF" + rows.map((r) => r.map((v) => csvEsc(v, sep)).join(sep)).join("\r\n");
  await shareFile("dziennik-serii-" + todayStr() + ".csv", "text/csv", text);
}
function parseCsv(text) {
  text = String(text).replace(/^﻿/, "");
  const first = text.split(/\r?\n/)[0] || "";
  const sep = [";", "	", ","].map((c) => [c, first.split(c).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === sep) {
      row.push(cur);
      cur = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur);
      cur = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cur += c;
  }
  row.push(cur);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}
const CSV_COLS = {
  date: ["date", "data", "start_time", "workout date", "date (utc)"],
  workout: ["workout", "workout name", "workout_name", "title", "trening", "nazwa treningu"],
  exercise: ["exercise", "exercise name", "exercise_name", "exercise_title", "ćwiczenie", "cwiczenie"],
  set: ["set", "set order", "set number", "set_index", "seria", "set_order"],
  type: ["type", "set type", "set_type", "typ"],
  kg: ["weight (kg)", "weight_kg", "weight", "kg", "ciężar", "ciezar", "weight (lbs)", "weight (lb)"],
  reps: ["reps", "repetitions", "powt.", "powtórzenia", "powtorzenia"],
  sec: ["seconds", "duration_seconds", "duration (s)", "czas (s)", "sekundy"],
  rir: ["rir"],
  rpe: ["rpe"],
  rest: ["rest (s)", "rest", "odpoczynek"],
  note: ["workout note", "workout notes", "note", "notes", "notatka", "description"],
  end: ["end_time", "end"],
  bw: ["bodyweight"]
};
function csvDate(v) {
  v = String(v || "").trim();
  let m;
  if (m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?/)) return { d: m[1] + "-" + m[2] + "-" + m[3], t: m[4] ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime() : null };
  if (m = v.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})(?:[ ,T]+(\d{1,2}):(\d{2}))?/)) {
    let a = +m[1], b = +m[2];
    if (a <= 12 && b > 12) {
      const x = a;
      a = b;
      b = x;
    }
    return { d: m[3] + "-" + pad(b) + "-" + pad(a), t: m[4] ? new Date(+m[3], b - 1, a, +m[4], +m[5]).getTime() : null };
  }
  return null;
}
function hashId(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h << 5) + h + str.charCodeAt(i) | 0;
  return "i" + (h >>> 0).toString(36);
}
function buildCsvSessions(rows) {
  if (rows.length < 2) return { err: "csvNoRows" };
  const head = rows[0].map((x) => x.trim().toLowerCase()), col = {};
  Object.keys(CSV_COLS).forEach((k) => {
    for (const n of CSV_COLS[k]) {
      const i = head.indexOf(n);
      if (i >= 0) {
        col[k] = i;
        break;
      }
    }
  });
  if (col.date === void 0 || col.exercise === void 0) return { err: "csvNoCols" };
  const lbs = col.kg !== void 0 && /lb/.test(head[col.kg]), num = (v) => pn(String(v == null ? "" : v).replace(",", "."));
  const map = {}, order = [];
  let nSets = 0;
  rows.slice(1).forEach((r, ri) => {
    const dt = csvDate(r[col.date]);
    if (!dt) return;
    const exn = String(r[col.exercise] || "").trim();
    if (!exn) return;
    const reps = col.reps !== void 0 ? num(r[col.reps]) : null, sec = col.sec !== void 0 ? num(r[col.sec]) : null;
    if (!(reps > 0) && !(sec > 0)) return;
    const wn = (col.workout !== void 0 ? String(r[col.workout] || "").trim() : "") || t("workout");
    const key = dt.d + "|" + wn + "|" + (dt.t || "");
    const se = map[key] || (map[key] = { id: "", planId: null, name: wn, date: dt.d, startedAt: dt.t || void 0, note: "", remark: "", exercises: [], _ex: {}, _k: key });
    if (!map[key].added) {
      map[key].added = 1;
      order.push(se);
    }
    if (col.note !== void 0 && !se.note) {
      const nv = String(r[col.note] || "").trim();
      if (nv) se.note = nv;
    }
    let ex = se._ex[norm(exn)];
    if (!ex) {
      ex = { name: exn, mode: "reps", bw: false, sets: [] };
      se._ex[norm(exn)] = ex;
      se.exercises.push(ex);
    }
    const time = !(reps > 0) && sec > 0;
    if (time) ex.mode = "time";
    let kg = col.kg !== void 0 ? num(r[col.kg]) : null;
    if (kg === null) kg = 0;
    if (lbs) kg = Math.round(kg * 0.45359237 * 100) / 100;
    const tyRaw = col.type !== void 0 ? String(r[col.type] || "").toLowerCase() : "";
    const ty = /warm|^w$/.test(tyRaw) ? "w" : /drop|^d$/.test(tyRaw) ? "d" : /fail|^f$/.test(tyRaw) ? "f" : /assist|^a$/.test(tyRaw) ? "a" : "n";
    let rir = null;
    if (col.rir !== void 0) rir = num(r[col.rir]);
    else if (col.rpe !== void 0) {
      const v = num(r[col.rpe]);
      if (v !== null && v > 0 && v <= 10) rir = 10 - v;
    }
    const st = { kg, val: time ? sec : reps, rir, rest: col.rest !== void 0 ? num(r[col.rest]) : null };
    if (ty !== "n") st.ty = ty;
    if (col.bw !== void 0 && /^(1|true|yes|tak)$/i.test(String(r[col.bw]).trim())) ex.bw = true;
    ex.sets.push(st);
    nSets++;
  });
  order.forEach((se) => {
    se.id = hashId(se._k);
    delete se._ex;
    delete se._k;
    delete se.added;
    if (se.startedAt) {
      se.endedAt = se.startedAt;
    }
  });
  return { sessions: order, nSets, lbs };
}
async function importCsvText(text) {
  let res;
  try {
    res = buildCsvSessions(parseCsv(text));
  } catch (e) {
    res = { err: "csvNoRows" };
  }
  if (res.err) {
    toast(t(res.err));
    return;
  }
  const have = {};
  sessions.forEach((x) => {
    have[x.id] = 1;
  });
  const fresh = res.sessions.filter((x) => !have[x.id]);
  if (!fresh.length) {
    toast(t("csvNothing"));
    return;
  }
  const ok = await ask(t("csvQ", { n: cnt("wk", fresh.length), s: cnt("set", fresh.reduce((a, x) => a + x.exercises.reduce((b, e) => b + e.sets.length, 0), 0)) }) + (res.lbs ? " " + t("csvLbs") : "") + " " + t("csvKg"), t("importBtn"), false);
  if (!ok) return;
  fresh.forEach((x) => {
    sessions.push(x);
    if (store.col) dbWrite("s-" + x.id, x);
  });
  persistSessions();
  render();
  toast(t("csvDone", { n: fresh.length }));
}
async function importText(text) {
  let obj = null;
  try {
    obj = JSON.parse(text);
  } catch (_) {
  }
  if (!obj || !obj.meta || !Array.isArray(obj.sessions)) {
    toast(t("importBad"));
    return;
  }
  const ok = await ask(t("importQ", { n: cnt("wk", obj.sessions.length), d: obj.exportedAt ? fmtDate(String(obj.exportedAt).slice(0, 10)) : "—" }), t("importBtn"), true);
  if (ok) applyImport(obj);
}
function openPasteImport() {
  sheet("<h2>" + t("pasteBtn") + '</h2><div class="fld"><textarea class="copyarea" id="pasteIn" placeholder="' + esc(t("pastePh")) + '" aria-label="' + esc(t("pasteBtn")) + '"></textarea></div><div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="paste-go">' + t("pasteGo") + "</button></div>");
}
function applyImport(obj) {
  const oldIds = sessions.map((s) => s.id);
  meta = Object.assign(defMeta(), obj.meta);
  normMeta();
  sessions = obj.sessions.filter((s) => s && s.id && s.date && Array.isArray(s.exercises));
  LS.set("tl.meta", meta);
  persistSessions();
  if (store.col) {
    dbWrite("meta", meta);
    oldIds.filter((id) => !sessions.some((s) => s.id === id)).forEach((id) => dbWrite("s-" + id, null));
    sessions.forEach((s) => dbWrite("s-" + s.id, s));
  }
  lang = meta.lang || lang;
  closeSheets();
  render();
  toast(t("imported"));
}
