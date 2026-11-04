// Planowanie treningu na konkretną datę: arkusz wyboru, pomocnik schedFor().
'use strict';

// Co jest zaplanowane na dany dzień: wpis na datę ma pierwszeństwo przed planem tygodnia.
function schedFor(ds) {
  const id = meta.dated && meta.dated[ds];
  if (id && meta.plans.some((p) => p.id === id && !p.archived)) return { k: "plan", id: id, dated: true };
  return meta.schedule[(dateObj(ds).getDay() + 6) % 7] || null;
}

// Zaplanowane treningi od jutra wzwyż (najbliższe pierwsze).
function upcomingDated() {
  const td = todayStr();
  return Object.keys(meta.dated || {})
    .filter((d) => d > td && meta.plans.some((p) => p.id === meta.dated[d] && !p.archived))
    .sort()
    .slice(0, 6);
}

function datedHtml() {
  const L = upcomingDated();
  if (!L.length) return "";
  let h = '<div class="sechead"><span class="lbl">' + t("datedH") + "</span></div>";
  h += '<ul class="rows">' + L.map((d) => {
    const p = meta.plans.find((x) => x.id === meta.dated[d]);
    return '<li class="row"><div class="grow"><div class="pn">' + esc(p.name) + '</div><div class="sub">' + fmtDate(d) + '</div></div><button class="icon" data-act="dated-rm" data-d="' + d + '" aria-label="' + esc(t("delShort")) + '">✕</button></li>';
  }).join("") + "</ul>";
  return h;
}

function openDatedSheet(planId) {
  const plans = meta.plans.filter((p) => !p.archived);
  if (!plans.length) {
    toast(t("datedNoPlan"));
    return;
  }
  const tm = new Date();
  tm.setDate(tm.getDate() + 1);
  sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("datedNew") + '</h2><span style="margin-right:-8px">' + xb() + "</span></div>" +
    '<div class="fld"><label class="lbl" for="dtPlan">' + t("datedPlan") + '</label><select id="dtPlan" style="width:100%">' +
    plans.map((p) => '<option value="' + esc(p.id) + '"' + (p.id === planId ? " selected" : "") + ">" + esc(p.name) + "</option>").join("") + "</select></div>" +
    '<div class="fld"><label class="lbl" for="dtDate">' + t("datedDate") + '</label><input id="dtDate" type="date" min="' + todayStr() + '" value="' + dstr(tm) + '"></div>' +
    '<div class="btns" style="margin-top:14px"><button class="btn" data-act="dated-save">' + t("save") + "</button></div>");
}
