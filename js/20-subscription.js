// Blokada funkcji bez subskrypcji (LOCKRE, paywall, lockCard).
'use strict';

const LOCKRE = /^(dated-|plan-|pex-|pfold|folder|train-menu|ps-toggle|day-|start$|goal|wk-goal|ach|detail-toplan|exd|cex|std-|rec-|rv-|meas|mus-|png-|hw-)/;
function paywall() {
  sheet('<div class="bigh" style="padding:0 0 8px"><h2>' + t("subT") + '</h2><span style="margin-right:-8px">' + xb() + '</span></div><p class="sub" style="margin:0 0 16px">' + t("subTxt") + '</p><div class="btns"><button class="btn" data-act="sub-go">' + t("subGo") + "</button></div>");
}
const LOCKIC = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
function lockCard() {
  return '<button class="banner" data-act="sub-go" style="width:100%;text-align:left;margin-top:14px"><div class="grow"><div class="bn">' + LOCKIC + " " + t("subT") + '</div><div class="sub">' + t("subLock") + "</div></div></button>";
}
