// Renderowanie ekranów, przejścia (slide), nawigacja go().
'use strict';

function exUsedKeys() {
  const u = {};
  trSess().forEach((x) => x.exercises.forEach((e) => {
    if (!e.skipped && e.sets.some((q) => pn(q.val) > 0)) u[ckey(e.name)] = 1;
  }));
  return u;
}
function ageStr(a) {
  if (lang === "pl") {
    const m = a % 10, c = a % 100;
    return a === 1 ? "1 rok" : m >= 2 && m <= 4 && !(c >= 12 && c <= 14) ? a + " lata" : a + " lat";
  }
  return a + " yo";
}
function applyDatalist() {
  $("#exnames").innerHTML = exNamesAll(true).map((n) => '<option value="' + esc(n) + '"></option>').join("");
  $("#folders").innerHTML = [...new Set(meta.plans.map((p) => p.folder).concat(meta.folders || []).filter(Boolean))].map((n) => '<option value="' + esc(n) + '"></option>').join("");
}
function renderTabs() {
  const items = [["review", "tReview", ICON.home], ["train", "tTrain", ICON.train], ["account", "tAccount", ICON.user]];
  $("#tabsIn").innerHTML = items.map((i) => '<button data-act="tab" data-t="' + i[0] + '"' + (ui.tab === i[0] ? ' aria-current="true"' : "") + ">" + i[2] + "<span>" + t(i[1]) + "</span></button>").join("");
}
let wl = null;
async function wake() {
  try {
    if (ui.screen === "logger" && navigator.wakeLock && !wl) {
      wl = await navigator.wakeLock.request("screen");
      wl.addEventListener("release", () => {
        wl = null;
      });
    }
  } catch (e) {
  }
}
function enhanceDates(root) {
  (root || document).querySelectorAll("input[type=date]:not([data-df])").forEach((inp) => {
    inp.dataset.df = "1";
    const lab = document.createElement("label");
    lab.className = "dfield";
    const tx = document.createElement("span");
    tx.className = "dtx";
    const ic = document.createElement("span");
    ic.className = "dic";
    ic.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
    const upd = () => {
      tx.textContent = inp.value ? fmtDate(inp.value) : "—";
    };
    inp.parentNode.insertBefore(lab, inp);
    lab.appendChild(tx);
    lab.appendChild(ic);
    lab.appendChild(inp);
    upd();
    inp.addEventListener("input", upd);
    inp.addEventListener("change", upd);
  });
}
function render() {
  document.documentElement.lang = lang;
  applyTheme();
  applyDatalist();
  const y = winY();
  let h;
  if (ui.screen === "logger" && active) h = vLogger();
  else if (ui.screen === "plan" && ui.plan) h = vPlan();
  else if (ui.screen === "note" && ui.note) h = vNote();
  else if (ui.screen === "measadd" && ui.mVals) h = vMeasAdd();
  else if (ui.screen === "exmenu" && active && active.exercises[ui.exmE]) h = vExMenu();
  else if (ui.screen === "pick" && ui.pkSel) h = vPick();
  else if (ui.screen === "detail") h = vDetail();
  else if (ui.screen === "compare") h = vCompare();
  else if (ui.screen === "achv") h = vAchv();
  else if (ui.screen === "acsub" && ui.tab === "account") h = vAcSub();
  else {
    ui.screen = null;
    h = { review: vReview, train: vTrain, account: vAccount }[ui.tab]();
  }
  $("#app").innerHTML = h;
  enhanceDates($("#app"));
  $("#tabs").hidden = ui.screen === "logger" || ui.screen === "plan" || ui.screen === "note" && !!ui.note || ui.screen === "pick" && !!ui.pkSel || ui.screen === "measadd" && !!ui.mVals || ui.screen === "exmenu" && !!active;
  renderTabs();
  if (ui.screen === "logger") {
    wake();
  } else {
    if (wl) {
      try {
        wl.release();
      } catch (e) {
      }
      wl = null;
    }
  }
  syncRest();
  fitStrip();
  emUpdate();
  {
    const sn = $("#sNote");
    if (sn) grow(sn);
  }
  const hb = $("#histBody");
  if (hb) {
    const sc = hb.scrollTop;
    hb.innerHTML = histHtml();
    hb.scrollTop = sc;
  }
  const psl = $("#psList");
  if (psl) psl.innerHTML = planListHtml(ui.pq);
  winTo(0, y);
}
function shellOn() {
  return document.documentElement.classList.contains("shell");
}
function winY() {
  return shellOn() ? $("#app").scrollTop : window.scrollY;
}
function winTo(x, y) {
  if (shellOn()) $("#app").scrollTop = y;
  else window.scrollTo(x, y);
}
function grow(el) {
  el.style.height = "auto";
  el.style.height = Math.max(92, el.scrollHeight + 2) + "px";
}
function slide(c) {
  const a = $("#app");
  a.classList.remove("slF", "slB");
  void a.offsetWidth;
  a.classList.add(c);
  setTimeout(() => a.classList.remove(c), 540);
}
function depthNow() {
  if (ui.tab === "train") return !ui.screen ? 0 : -1;
  if (ui.tab !== "account") return -1;
  if (!ui.screen) return 0;
  if (ui.screen === "acsub") return ui.acct === "exd" || ui.acct === "exnew" || ui.acct === "settings" && ui.setSec ? 2 : 1;
  if (ui.screen === "detail" || ui.screen === "compare" || ui.screen === "achv") return 2;
  return -1;
}
function go(tab, screen) {
  const was = ui._d == null ? -1 : ui._d;
  if (tab) ui.tab = tab;
  ui.screen = screen || null;
  ui.noteSel = null;
  render();
  winTo(0, 0);
  const d = depthNow(), wt = ui._t;
  ui._d = d;
  ui._t = ui.tab;
  if (meta.anim !== false && was >= 0 && d >= 0 && was !== d && wt === ui.tab) slide(d > was ? "slF" : "slB");
}
