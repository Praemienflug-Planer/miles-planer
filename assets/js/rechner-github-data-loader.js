(() => {
  const previousLadeDropdowns = typeof window.ladeDropdowns === "function" ? window.ladeDropdowns : null;
  const previousBerechneMilesPlaner = typeof window.berechneMilesPlaner === "function" ? window.berechneMilesPlaner : null;

  function getGithubLists() { return window.MILES_PLANNER_LISTS || null; }
  function getGithubPrograms() { return window.MILES_PLANNER_PROGRAMS?.programs || null; }
  function getGithubRates() { return window.MILES_PLANNER_AWARD_RATES?.rates || []; }
  function normalize(value) { return String(value || "").trim().toLowerCase(); }

  async function ladeDropdownsAusGithub() {
    fillFallbackDropdowns();
    try {
      const lists = getGithubLists();
      const programs = getGithubPrograms();
      if (!lists || !programs) throw new Error("GitHub-Stammdaten nicht vollständig geladen.");
      PROGRAM_META = programs || FALLBACK_PROGRAM_META;
      populateSelect("ziel", lists.ziele || [], "Bitte Ziel wählen");
      populateSelect("reiseklasse", lists.reiseklassen || [], "Bitte Reiseklasse wählen");
      populateSelect("reisezeit", lists.reisezeiten || [], "Bitte Reisezeit wählen");
      populateSelect("reisemonat", lists.reisemonate || [], "Bitte Reisemonat wählen");
      populateSelect("programm", lists.programme || [], "Bitte Programm wählen");
      console.log("Dropdowns aus GitHub-Stammdaten geladen:", { listsDataStand: lists.dataStand, programsDataStand: window.MILES_PLANNER_PROGRAMS?.dataStand });
    } catch (error) {
      console.error("GitHub-Stammdaten konnten nicht geladen werden. Fallback wird verwendet:", error);
      if (previousLadeDropdowns) { await previousLadeDropdowns(); return; }
    }
    updatePointsLabels();
    updateFormFlow();
  }

  function findGithubRate(payload) {
    return getGithubRates().find((rate) => normalize(rate.ziel) === normalize(payload.ziel) && normalize(rate.programm) === normalize(payload.programm) && normalize(rate.klasse) === normalize(payload.reiseklasse));
  }

  function getScenarioPrefix(szenario) {
    if (szenario === "best") return "best";
    if (szenario === "konservativ") return "cons";
    return "real";
  }

  function getSeasonFactor(rate, reisezeit) {
    if (reisezeit === "Ferien") return Number(rate.faktorFerien || 1);
    if (reisezeit === "Hauptreisezeit") return Number(rate.faktorHauptsaison || 1);
    return Number(rate.faktorNebensaison || 1);
  }

  function addMonths(date, months) {
    const result = new Date(date.getTime());
    result.setMonth(result.getMonth() + months);
    return result;
  }

  function formatMonthYear(date) {
    return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  }

  function getCpmNumber(cpmText) {
    return Number(String(cpmText || "0").replace(" ct", "").replace(",", "."));
  }

  function classifyCpmValue(cpmText) {
    const cpm = getCpmNumber(cpmText);
    if (!Number.isFinite(cpm) || cpm < 1.0) return "weak";
    if (cpm >= 2.0) return "top";
    if (cpm >= 1.5) return "good";
    return "medium";
  }

  function buildDealRecommendation(cpmText, payload) {
    const cpm = getCpmNumber(cpmText);
    const klasse = payload.reiseklasse || "Prämienflug";
    const programm = payload.programm || "Programm";
    if (!Number.isFinite(cpm) || cpm <= 0) return "Der rechnerische Gegenwert lässt sich mit den aktuellen Eingaben nicht sinnvoll bewerten.";
    if (cpm >= 2.0) return `Sehr starker Gegenwert: ${cpmText} pro Meile ist für ${klasse} mit ${programm} attraktiv. Prüfe als Nächstes vor allem Verfügbarkeit und reale Zuzahlungen.`;
    if (cpm >= 1.5) return `Guter Gegenwert: ${cpmText} pro Meile spricht grundsätzlich für eine sinnvolle Einlösung, sofern Verfügbarkeit und Flugzeiten passen.`;
    if (cpm >= 1.0) return `Solider Gegenwert: ${cpmText} pro Meile kann sich lohnen, ist aber kein Selbstläufer. Vergleiche unbedingt mit Cashpreisen und alternativen Programmen.`;
    if (cpm >= 0.6) return `Eher schwacher Gegenwert: ${cpmText} pro Meile ist nur dann interessant, wenn Cashpreise hoch sind oder du Meilen gezielt abbauen möchtest.`;
    return `Schwacher Gegenwert: ${cpmText} pro Meile spricht eher gegen diese Einlösung. Ein Cash-Ticket oder ein anderes Programm könnte sinnvoller sein.`;
  }

  function buildGithubResult(payload, rate) {
    const prefix = getScenarioPrefix(payload.szenario);
    const persons = extractNumber(payload.personen);
    const cfg = getProgramConfig(payload.programm);
    const seasonFactor = getSeasonFactor(rate, payload.reisezeit);
    const milesPp = Number(rate[`${prefix}MilesRtPp`] || 0) * seasonFactor;
    const taxesPp = Number(rate[`${prefix}TaxesRtPp`] || 0) * seasonFactor;
    const targetMiles = Math.round(milesPp * persons);
    const awardTotal = Math.round(taxesPp * persons);
    const cashTotal = Math.round(Number(rate.cashPp || 0) * persons * seasonFactor);
    const currentBalance = extractNumber(payload.bestandAktuell);
    const transferBalance = extractNumber(payload.transferBestand) * Number(cfg.faktor || 1);
    const plannedBonus = extractNumber(payload.geplanterBonus) * Number(cfg.faktor || 1);
    const monthlyRate = extractNumber(payload.monatlicheSammelrate) * Number(cfg.faktor || 1);
    const availableTotal = Math.round(currentBalance + transferBalance + plannedBonus);
    const missing = Math.max(0, targetMiles - availableTotal);
    const months = monthlyRate > 0 ? Math.ceil(missing / monthlyRate) : 999;
    const targetDate = addMonths(new Date(), months);
    const savingsTotal = Math.max(0, cashTotal - awardTotal);
    const cpm = targetMiles > 0 ? ((savingsTotal / targetMiles) * 100).toFixed(2).replace(".", ",") + " ct" : "—";
    return {
      status: "ok",
      source: "github",
      bestand: `${formatPoints(availableTotal)} ${cfg.kurzlabel || "Punkte"}`,
      zielbedarf: formatPoints(targetMiles),
      fehlend: formatPoints(missing),
      monate: String(months),
      zielErreicht: formatMonthYear(targetDate),
      reise: `${payload.reisemonat} ${payload.reisejahr}`,
      cash_total: cashTotal,
      award_total: awardTotal,
      savings_total: savingsTotal,
      cpm,
      cpmClass: classifyCpmValue(cpm),
      deal: buildDealRecommendation(cpm, payload),
      rate
    };
  }

  async function berechneMilesPlanerMitGithubFallback() {
    clearValidationUI();
    const resultBox = $("result");
    if (!resultBox) { alert("Ergebnisbereich nicht gefunden."); return; }
    const payload = collectPayload();
    const errors = validatePayload(payload);
    if (errors.length > 0) { showValidationErrors(errors); return; }
    const rate = findGithubRate(payload);
    if (!rate) {
      console.log("Kein passender GitHub-Awardwert gefunden. Nutze Google-Sheets-Fallback.", payload);
      if (previousBerechneMilesPlaner) return previousBerechneMilesPlaner();
    }
    const calcButton = $("calcButton");
    if (calcButton) { calcButton.disabled = true; calcButton.textContent = "Berechne…"; }
    zeigeErgebnisView();
    resultBox.innerHTML = "<p>Berechne…</p>";
    try {
      const data = buildGithubResult(payload, rate);
      const cfg = getProgramConfig(payload.programm);
      const chart = classifyAmpel(data.monate, payload);
      resultBox.innerHTML = `
        <div class="result-card">
          <div class="decision-card decision-card-${escapeHtml(chart.key)}">
            <div class="decision-badge">${escapeHtml(chart.badge)} ${escapeHtml(chart.title)}</div>
            <h3 class="decision-title">${escapeHtml(chart.text)}</h3>
            <p class="decision-text">Ziel: <strong>${escapeHtml(payload.ziel)}</strong> · Klasse: <strong>${escapeHtml(payload.reiseklasse)}</strong> · Reisende: <strong>${escapeHtml(payload.personen)}</strong></p>
          </div>
          <div class="result-section">
            <h3>Deine Kennzahlen</h3>
            <div class="result-grid">
              <div class="result-item"><div class="label">Bestand heute</div><div class="value">${escapeHtml(data.bestand || "—")}</div></div>
              <div class="result-item"><div class="label">Zielbedarf</div><div class="value">${escapeHtml(data.zielbedarf || "—")} ${escapeHtml(cfg.kurzlabel || "")}</div></div>
              <div class="result-item"><div class="label">Fehlende Punkte</div><div class="value">${escapeHtml(data.fehlend || "—")} ${escapeHtml(cfg.kurzlabel || "")}</div></div>
              <div class="result-item"><div class="label">Sammelzeit</div><div class="value">${escapeHtml(data.monate || "—")} Monate</div></div>
              <div class="result-item"><div class="label">Ziel erreicht ca.</div><div class="value">${escapeHtml(data.zielErreicht || "—")}</div></div>
              <div class="result-item"><div class="label">Geplante Reise</div><div class="value">${escapeHtml(data.reise || `${payload.reisemonat} ${payload.reisejahr}`)}</div></div>
            </div>
          </div>
          <div class="result-section deal-section">
            <h3>Deal & Kosten</h3>
            <div class="result-grid deal-grid">
              <div class="result-item"><div class="label">Cashpreis gesamt</div><div class="value">${formatEuro(data.cash_total)}</div></div>
              <div class="result-item"><div class="label">Award-Zuzahlung gesamt</div><div class="value">${formatEuro(data.award_total)}</div></div>
              <div class="result-item"><div class="label">Ersparnis gesamt</div><div class="value">${formatEuro(data.savings_total)}</div></div>
              <div class="result-item cpm-tile cpm-${escapeHtml(data.cpmClass || "weak")}"><div class="label">Wert pro Meile</div><div class="value">${escapeHtml(data.cpm || "—")}</div><div class="value-note">${escapeHtml(data.deal || "")}</div></div>
            </div>
          </div>
          <div class="result-section"><h3>Nächste Schritte</h3><ul><li>Prüfe, ob dein Reisezeitraum flexibel genug ist.</li><li>Vergleiche alternative Programme, falls der Meilenbedarf stark abweicht.</li><li>Nutze Aktionen und planbare Sammelwege, statt spontan Meilen zu kaufen.</li></ul></div>
          ${buildAffiliateBox()}
        </div>`;
      updatePointsLabels();
    } catch (error) {
      if (previousBerechneMilesPlaner) { console.error("GitHub-Berechnung fehlgeschlagen. Nutze Google-Sheets-Fallback:", error); return previousBerechneMilesPlaner(); }
      resultBox.innerHTML = `<div class="result-info-card"><strong>Fehler:</strong><p>${escapeHtml(error.message)}</p></div>`;
    } finally {
      if (calcButton) { calcButton.disabled = false; calcButton.textContent = "Jetzt berechnen"; }
    }
  }

  function installSubmitOverride() {
    const form = $("milesForm");
    if (!form || form.dataset.githubSubmitOverride === "1") return;
    form.dataset.githubSubmitOverride = "1";
    form.addEventListener("submit", (event) => { event.preventDefault(); event.stopImmediatePropagation(); berechneMilesPlanerMitGithubFallback(); }, true);
  }

  window.ladeDropdowns = ladeDropdownsAusGithub;
  window.berechneMilesPlaner = berechneMilesPlanerMitGithubFallback;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installSubmitOverride);
  else installSubmitOverride();
})();
