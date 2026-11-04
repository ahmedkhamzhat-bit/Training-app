// Arkusze profilu: historia, dane, ustawienia, edycja profilu, zdjęcie.
'use strict';

function histHtml() {
  if (ui.histKind === "m") {
    const mm = MEAS.find((x) => x[0] === (ui.meas || "bf")) || MEAS[0], A2 = (meta.meas[mm[0]] || []).slice().sort(byDateAsc);
    const L2 = A2.map((w, i) => ({ w, d: i ? Math.round((w.v - A2[i - 1].v) * 10) / 10 : null })).reverse();
    return L2.length ? L2.map((r) => '<div class="wl"><span class="v">' + fmtN(mvv(mm, r.w.v)) + " " + mu(mm) + "</span>" + (r.d === null ? "<span></span>" : dlt(mvv(mm, r.d), mu(mm), "")) + '<span class="sub grow" style="text-align:right">' + fmtDate(r.w.date) + '</span><button class="icon xb" data-act="meas-del" data-id="' + r.w.id + '" aria-label="' + esc(t("delShort")) + '">✕</button></div>').join("") : '<p class="empty">' + t("hNone") + "</p>";
  }
  const col = meta.wGoal === "loss" ? "loss" : "gain";
  const A = [...meta.weights].sort(byDateAsc), L = A.map((w, i) => ({ w, d: i ? Math.round((w.kg - A[i - 1].kg) * 10) / 10 : null })).reverse();
  return L.length ? L.map((r) => '<div class="wl"><span class="v">' + fmtN(wv(r.w.kg)) + " " + uW() + "</span>" + (r.d === null ? "<span></span>" : dlt(dwv(r.d), uW(), col)) + '<span class="sub grow" style="text-align:right">' + fmtDate(r.w.date) + '</span><button class="icon xb" data-act="w-del" data-id="' + r.w.id + '" aria-label="' + esc(t("delShort")) + '">✕</button></div>').join("") : '<p class="empty">' + t("hNone") + "</p>";
}
function openHist(kind) {
  ui.histKind = kind;
  const mm = MEAS.find((x) => x[0] === (ui.meas || "bf")) || MEAS[0];
  const w = sheet('<div class="bigh"><h2>' + (kind === "m" ? esc(t("histM", { n: t(mm[1]) })) : t("histW")) + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div id="histBody" class="bigb">' + histHtml() + "</div>");
  w.querySelector(".sh").classList.add("big");
}
function openData() {
  const w = sheet('<div class="bigh"><h2>' + t("secData") + '</h2><button class="icon xb" data-act="sheet-close" aria-label="' + esc(t("close")) + '">✕</button></div><div id="dataBody" class="bigb">' + settingsExtra().replace(/<div class="sechead">.*?<\/div>/, "") + "</div>");
  w.querySelector(".sh").classList.add("big");
  snapRender();
}
function openProfileEdit() {
  const g = meta.gender || "";
  sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("profEdit") + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><div style="display:flex;justify-content:center;margin:6px 0 10px">' + avatarHtml(true) + '</div><div class="btns"><button class="btn ghost" data-act="prof-photo">' + t("profPhoto") + "</button>" + (meta.photo ? '<button class="btn ghost" data-act="prof-photo-del" style="color:var(--bad)">' + t("profPhotoDel") + "</button>" : "") + '</div><div class="fld"><label class="lbl" for="pName">' + t("profName") + '</label><input id="pName" data-k="prof-name" maxlength="40" value="' + esc(meta.name || "") + '" placeholder="' + esc(t("profNamePh")) + '" autocomplete="off"></div><div class="fld"><label class="lbl" for="pH">' + (imp() ? t("height").replace(/\s*\(.*\)\s*$/, "") + ` (ft'in")` : t("height")) + '</label><input id="pH" class="num" data-k="prof-h" inputmode="decimal" style="text-align:left;padding-inline:12px" value="' + esc(htShow(meta.heightCm)) + '" autocomplete="off"></div><div class="fld"><label class="lbl" for="pB">' + t("birthL") + '</label><input id="pB" type="date" data-k="prof-b" value="' + esc(meta.birth || "") + '"></div><div class="fld"><span class="lbl">' + t("genderL") + '</span><div class="seg sm">' + [["m", "gM"], ["f", "gF"]].map((x) => '<button data-act="prof-g" data-v="' + x[0] + '" aria-pressed="' + (g === x[0]) + '">' + t(x[1]) + "</button>").join("") + "</div></div>");
}
function openHeightEdit() {
  sheet("<h2>" + t("heightEdit") + '</h2><div class="fld"><label class="lbl" for="hIn">' + t("height") + '</label><input id="hIn" class="num" inputmode="decimal" style="text-align:left;padding-inline:12px" value="' + esc(htShow(meta.heightCm)) + '" autocomplete="off"></div><div class="btns" style="margin-top:18px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="height-save">' + t("save") + "</button></div>");
}
function processPhoto(file) {
  const r = new FileReader();
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      try {
        const n = 320, c = document.createElement("canvas");
        c.width = c.height = n;
        const g = c.getContext("2d"), m = Math.min(img.width, img.height);
        g.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, n, n);
        meta.photo = c.toDataURL("image/jpeg", 0.82);
        persistMeta();
        closeSheets();
        render();
        openProfileEdit();
      } catch (e) {
        toast(t("exportFail"));
      }
    };
    img.onerror = () => toast(t("exportFail"));
    img.src = r.result;
  };
  r.readAsDataURL(file);
}
