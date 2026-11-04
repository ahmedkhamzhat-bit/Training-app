// Formatowanie serii, skale intensywności (RIR/RPE), wibracje, cofanie (undo).
'use strict';

const fmtKg = (n) => imp() ? fmtVol(Math.round(wv(n))) + " lb" : n >= 1e4 ? fmtN(Math.round(n / 100) / 10) + " t" : fmtVol(Math.round(n)) + " kg";
const rawN = (n) => String(Math.round(n * 100) / 100);
const fmtRaw = (n) => typeof n === "number" ? String(n) : String(n);
const exScale = (ex) => ex && ex.scale === "rpe" ? "rpe" : ex && ex.scale === "rir" ? "rir" : meta.scale === "rpe" ? "rpe" : "rir";
const intName = (ex) => exScale(ex) === "rpe" ? "RPE" : "RIR";
function intShow(v, ex) {
  if (exScale(ex) !== "rpe") return v === null || v === void 0 ? "" : v;
  const n = pn(v);
  return n === null ? "" : rawN(10 - n);
}
function intStore(txt, ex) {
  if (exScale(ex) !== "rpe") return txt;
  const n = pn(txt);
  return n === null ? "" : rawN(10 - n);
}
function intText(v, ex) {
  const n = pn(v);
  if (n === null) return "";
  return intName(ex) + " " + fmtN(exScale(ex) === "rpe" ? 10 - n : n);
}
let hapLabel = null;
function iosTick() {
  try {
    if (!hapLabel) {
      const l = document.createElement("label");
      l.setAttribute("aria-hidden", "true");
      l.style.cssText = "position:fixed;left:-100px;top:-100px;opacity:0;pointer-events:none";
      const i = document.createElement("input");
      i.type = "checkbox";
      i.setAttribute("switch", "");
      l.appendChild(i);
      document.body.appendChild(l);
      hapLabel = l;
    }
    hapLabel.click();
  } catch (e) {
  }
}
function buzz(p) {
  if (!meta.vibe) return;
  try {
    if (navigator.vibrate) {
      navigator.vibrate(p || 30);
      return;
    }
  } catch (e) {
  }
  iosTick();
}
let undoStack = [], undoFor = "";
function pushUndo() {
  if (!active) return;
  if (undoFor !== active.id) {
    undoStack = [];
    undoFor = active.id;
  }
  const c = Object.assign({}, active);
  delete c.u;
  const j = JSON.stringify(c);
  if (undoStack[undoStack.length - 1] !== j) {
    undoStack.push(j);
    if (undoStack.length > 40) undoStack.shift();
  }
}
function undo() {
  if (!active || !undoStack.length || undoFor !== active.id) {
    toast(t("undoNone"));
    return;
  }
  const o = JSON.parse(undoStack.pop());
  o.u = Date.now();
  o.sw = null;
  active = o;
  persistActive();
  render();
  toast(t("undone"));
}
