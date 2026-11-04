// Arkusz nowego celu i uwag do treningu.
'use strict';

function openGoalSheet() {
  const d = /* @__PURE__ */ new Date();
  const eom = dstr(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  const w = sheet("<h2>" + t("goalNew").replace("+ ", "") + '</h2><div class="fld"><label class="lbl" for="gText">' + t("goalText") + '</label><input id="gText" maxlength="80" placeholder="' + esc(t("goalPh")) + '" autocomplete="off"></div><div class="fld"><span class="lbl">' + t("goalDue") + '</span><div class="seg"><button data-act="gdue" data-v="1" aria-pressed="true">' + t("goalDueOn") + '</button><button data-act="gdue" data-v="0" aria-pressed="false">' + t("goalNoDue") + '</button></div><input id="gDue" type="date" value="' + eom + '" aria-label="' + esc(t("goalDue")) + '"></div><div class="pgrid"><div class="pf"><label class="lbl" for="gTg">' + t("goalTarget") + '</label><input id="gTg" class="num" inputmode="decimal" placeholder="20" style="text-align:left;padding-inline:12px" autocomplete="off"></div></div><div class="fld"><span class="lbl">' + t("goalUnit") + '</span><div class="seg sm">' + [["r", t("uReps")], ["w", uW()], ["s", "s"]].map((x, i) => '<button data-act="gunit" data-v="' + x[0] + '" aria-pressed="false">' + { r: t("gUnR"), w: t("gUnW"), s: t("gUnS") }[x[0]] + "</button>").join("") + '</div></div><p class="hint">' + t("goalTargetHint") + '</p><div class="btns" style="margin-top:20px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="goal-save">' + t("save") + "</button></div>");
  w.dataset.due = "1";
  w.dataset.un = "";
}
function openRemark(id) {
  const s = sessions.find((x) => x.id === id);
  if (!s) return;
  sheet("<h2>" + t("remark") + '</h2><p class="sub">' + esc(s.name + " – " + fmtDate(s.date)) + '</p><div class="fld"><input id="rmIn" maxlength="80" value="' + esc(s.remark || "") + '" placeholder="' + esc(t("remarkPh")) + '" aria-label="' + esc(t("remark")) + '" autocomplete="off"></div><div class="btns" style="margin-top:20px"><button class="btn ghost" data-act="sheet-close">' + t("cancel") + '</button><button class="btn" data-act="remark-save" data-id="' + s.id + '">' + t("save") + "</button></div>");
  setTimeout(() => {
    const i = $("#rmIn");
    if (i) {
      i.focus();
      try {
        i.setSelectionRange(i.value.length, i.value.length);
      } catch (e) {
      }
    }
  }, 60);
}
