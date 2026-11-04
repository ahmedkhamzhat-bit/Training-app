// Pasek tygodnia, podsumowanie mięśni, wyszukiwarka ćwiczeń, wykres radarowy.
'use strict';

const weekKey = (ds) => dstr(weekStart(dateObj(ds)));
function weekStrip(todayI, dn) {
  const ws = weekStart(/* @__PURE__ */ new Date()), f0 = firstSessionDate();
  let c = "";
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + i, 12), st = dayStatus(dstr(d), f0), a = schedFor(dstr(d)), x = meta.dayx[i] || {};
    let lab = "", sh = "";
    if (a) {
      if (a.k === "plan") {
        const pl = meta.plans.find((q) => q.id === a.id);
        lab = pl ? pl.name : "";
      } else if (a.k === "rest") {
        lab = t("restDay");
        sh = t("restShort");
      } else if (a.k === "note") lab = a.text;
    }
    c += '<button class="wd' + (st ? " " + st : "") + (i === todayI ? " today" : "") + '" data-act="day-edit" data-d="' + i + '" aria-label="' + esc(dn[i] + (lab ? ": " + lab : "") + (x.tag ? ", " + x.tag : "")) + '"><span class="wdn">' + esc(dn[i].slice(0, 3)) + "</span>" + (x.note ? '<b class="dot">★</b>' : "") + '<span class="wdl"' + (sh ? ' data-full="' + esc(lab) + '" data-short="' + esc(sh) + '"' : "") + ">" + esc(lab || "·") + "</span>" + (x.tag ? '<span class="wdt">' + esc(x.tag) + "</span>" : "") + "</button>";
  }
  return '<div class="wkstrip" role="group" aria-label="' + esc(t("week")) + '">' + c + "</div>";
}
function fitStrip() {
  document.querySelectorAll(".wdl[data-short]").forEach((el) => {
    el.textContent = el.dataset.full;
    el.style.fontSize = "";
    if (el.scrollWidth > el.clientWidth + 1) {
      el.style.fontSize = "8.5px";
      if (el.scrollWidth > el.clientWidth + 1) {
        el.style.fontSize = "";
        el.textContent = el.dataset.short;
      }
    }
  });
}
function setNo(sets, si) {
  let n = 0;
  for (let k = 0; k <= si; k++) if (sets[k].ty !== "w") n++;
  return n;
}
function numL(arr) {
  let n = 0;
  return arr.map((x) => ({ x, l: x.ty === "w" ? "W" : String(++n) }));
}
function rvHead() {
  const nowM = todayStr().slice(0, 7), mo = ui.range === "month";
  return '<div class="mnav" style="margin-top:8px">' + (mo ? '<button data-act="month" data-d="-1" aria-label="‹">‹</button><div class="mt">' + esc(monthLabel(ui.month)) + '</div><button data-act="month" data-d="1" aria-label="›"' + (ui.month >= nowM ? " disabled" : "") + ">›</button>" : '<div class="mt" style="text-align:left">' + t("rt" + ui.range) + "</div>") + '<button class="icon" data-act="rv-range" aria-label="' + esc(t("rvRange")) + '">⋯</button></div>';
}
function musOf(name) {
  const v = meta.muscles[norm(name)] || meta.muscles[ckey(name)];
  if (v && Array.isArray(v.p) && (v.p.length || (v.s || []).length)) return { p: v.p, s: v.s || [] };
  const li = libInfo(name);
  return li ? { p: li.p, s: li.s } : { p: [], s: [] };
}
function musSummary(name) {
  const o = musOf(name);
  if (!o.p.length && !o.s.length) return t("musNone");
  return (o.p.length ? t("musMain") + ": " + o.p.map((m) => t("mus_" + m)).join(", ") : "") + (o.s.length ? (o.p.length ? " · " : "") + t("musSec") + ": " + o.s.map((m) => t("mus_" + m)).join(", ") : "");
}
function musListHtml() {
  const cur = musOf(ui.musName), q = norm(ui.musQ || "");
  const L = MUS.filter((m) => !q || norm(t("mus_" + m)).indexOf(q) >= 0);
  if (!L.length) return '<p class="empty">' + t("hNone") + "</p>";
  return L.map((m) => {
    const P = cur.p.indexOf(m) >= 0, X = cur.s.indexOf(m) >= 0;
    return '<div class="mrow"><span class="grow">' + esc(t("mus_" + m)) + '</span><div class="seg sm"><button data-act="mus-tog" data-m="' + m + '" data-r="p" aria-pressed="' + P + '">' + t("musMain") + '</button><button data-act="mus-tog" data-m="' + m + '" data-r="s" aria-pressed="' + X + '">' + t("musSec") + "</button></div></div>";
  }).join("");
}
function openMuscleSheet(name) {
  if (!norm(name)) {
    toast(t("needName"));
    return;
  }
  ui.musName = name;
  ui.musQ = "";
  kbSheet('<div class="bigh" style="padding:0 0 8px"><h2 style="overflow-wrap:anywhere">' + esc(name) + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '" style="margin-right:-8px">✕</button></div><p class="hint" style="margin-top:0">' + t("musHelp") + '</p><div class="fld"><input type="search" data-k="mus-q" placeholder="' + esc(t("musSearch")) + '" aria-label="' + esc(t("musSearch")) + '" autocomplete="off"></div><div id="muslist" class="mlist">' + musListHtml() + '</div><div class="btns" style="margin-top:14px"><button class="btn" data-act="mus-done">' + t("close") + "</button></div>");
}
function exListHtml() {
  const raw = (ui.exQ || "").trim(), q = norm(raw), all = exLibNames(), L = all.filter((n) => !q || norm(n).indexOf(q) >= 0);
  const custom = (meta.customEx || []).map(ckey), used = exUsedKeys();
  let h = "";
  if (raw && !all.some((n) => ckey(n) === ckey(raw))) h += '<button class="row pkr" data-act="cex-add" data-n="' + esc(raw) + '"><span class="grow pn" style="color:var(--acc)">+ ' + esc(t("cexAdd", { n: raw })) + "</span></button>";
  if (!L.length && !h) return '<p class="empty">' + t("hNone") + "</p>";
  return h + L.map((n) => '<button class="row pkr" data-act="rv-pick" data-n="' + esc(n) + '"><span class="grow pn">' + esc(n) + (used[ckey(n)] ? ' <span class="tag">●</span>' : "") + "</span>" + (ckey(n) === ckey(ui.rvEx) ? '<span class="chev">✓</span>' : "") + "</button>").join("");
}
function openExSearch() {
  ui.exQ = "";
  kbSheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("exPick") + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '" style="margin-right:-8px">✕</button></div><div class="fld"><input type="search" data-k="ex-q" placeholder="' + esc(t("exSearchPh")) + '" aria-label="' + esc(t("exPick")) + '" autocomplete="off"></div><div id="exlist" class="mlist">' + exListHtml() + "</div>");
}
function radarChart(items) {
  const n = items.length;
  if (n < 3) return "";
  const W = 340, H = 330, cx = W / 2, cy = H / 2, R = 88, mx = Math.max.apply(null, items.map((i) => i.v).concat([1e-4]));
  const pt = (i, f) => {
    const a = -Math.PI / 2 + 2 * Math.PI * i / n;
    return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f, Math.cos(a), Math.sin(a)];
  };
  const P = (i, f) => {
    const q = pt(i, f);
    return q[0].toFixed(1) + "," + q[1].toFixed(1);
  };
  let g = '<svg class="chart radar" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(t("trRadar")) + '">';
  [0.25, 0.5, 0.75, 1].forEach((f) => {
    g += '<polygon points="' + items.map((_, i) => P(i, f)).join(" ") + '" fill="none" style="stroke:var(--line)" stroke-width="1"/>';
  });
  items.forEach((it, i) => {
    const e = pt(i, 1), l = pt(i, 1.12), an = l[2] > 0.3 ? "start" : l[2] < -0.3 ? "end" : "middle";
    let lb = it.l;
    if (lb.length > 13) lb = lb.slice(0, 12) + "…";
    g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" style="stroke:var(--line)" stroke-width="1"/><text x="' + l[0].toFixed(1) + '" y="' + (l[1] + (l[3] > 0.5 ? 9 : l[3] < -0.5 ? -2 : 3.5)).toFixed(1) + '" text-anchor="' + an + '" font-size="9.5" style="fill:' + (it.v > 0 ? "var(--fg)" : "var(--mut)") + ';font-family:var(--f-body)">' + esc(lb) + "</text>";
  });
  g += '<polygon points="' + items.map((it, i) => P(i, Math.max(0.03, it.v / mx))).join(" ") + '" style="fill:var(--acc);stroke:var(--acc)" fill-opacity=".32" stroke-width="2" stroke-linejoin="round"/>';
  items.forEach((it, i) => {
    if (it.v > 0) {
      const q = pt(i, Math.max(0.03, it.v / mx));
      g += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="3" style="fill:var(--acc)"/>';
    }
  });
  return g + "</svg>";
}
