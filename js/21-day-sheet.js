// Przycisk zamknięcia arkusza i arkusz edycji dnia tygodnia.
'use strict';

function xb() {
  return '<button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button>';
}
function openDaySheet(i) {
  const dn = (T[lang].dn || T.en.dn)[i], cur = meta.schedule[i] || null, x = meta.dayx[i] || {};
  const plans = meta.plans.filter((p) => !p.archived);
  sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + dn + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><div class="fld"><label class="lbl" for="daySel">' + t("dayWhat") + '</label><select id="daySel" data-k="day-sel" data-d="' + i + '" style="width:100%"><option value=""' + (cur && (cur.k === "plan" || cur.k === "rest" || cur.k === "free") ? "" : " selected") + ">" + t("dayNone") + '</option><option value="rest"' + (cur && cur.k === "rest" ? " selected" : "") + ">" + t("restDay") + '</option><option value="free"' + (cur && cur.k === "free" ? " selected" : "") + ">" + t("workout") + "</option>" + (plans.length ? "<option disabled>──────────</option>" : "") + plans.map((p) => '<option value="p:' + esc(p.id) + '"' + (cur && cur.k === "plan" && cur.id === p.id ? " selected" : "") + ">" + esc(p.name) + "</option>").join("") + '</select></div><div class="fld"><label class="lbl" for="dayTag">' + t("dayTag") + '</label><input id="dayTag" data-k="day-tag" data-d="' + i + '" maxlength="24" placeholder="' + esc(t("dayTagPh")) + '" value="' + esc(x.tag || "") + '" autocomplete="off"></div><div class="fld"><label class="lbl" for="dayTx">' + t("dayOther") + '</label><div class="oneline"><input id="dayTx" maxlength="30" placeholder="' + esc(t("dayOtherPh")) + '" value="' + esc(cur && cur.k === "note" ? cur.text : "") + '" autocomplete="off"><button class="btn" data-act="day-note" data-d="' + i + '">' + t("save") + '</button></div></div><div class="fld"><label class="lbl" for="dayNt">' + t("dayNote") + '</label><textarea id="dayNt" data-k="day-nt" data-d="' + i + '" maxlength="600" placeholder="' + esc(t("dayNotePh")) + '" style="min-height:84px">' + esc(x.note || "") + "</textarea></div>");
}
