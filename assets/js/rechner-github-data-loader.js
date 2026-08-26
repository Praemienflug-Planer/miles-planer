(() => {
  const previousLadeDropdowns = typeof window.ladeDropdowns === "function" ? window.ladeDropdowns : null;
  const previousBerechneMilesPlaner = typeof window.berechneMilesPlaner === "function" ? window.berechneMilesPlaner : null;

  function getGithubLists() { return window.MILES_PLANNER_LISTS || null; }
  function getGithubPrograms() { return window.MILES_PLANNER_PROGRAMS?.programs || null; }
  function getGithubRates() { return window.MILES_PLANNER_AWARD_RATES?.rates || []; }
  function normalize(value) { return String(value || "").trim().toLowerCase(); }

  function updateFamilyUiCopy() {
    const note = document.querySelector(".family-module-note");
    if (!note) return;
    note.textContent = "Hinweis: Flying Blue gewährt für Kinder von 2–11 Jahren unter den offiziellen Bedingungen 25 % Rabatt auf Reward Tickets; dieser Abschlag wird als Planungswert berücksichtigt. Bei Miles & More gilt der 25-%-Child’s-Award-Rabatt nur bei bestimmten ausführenden Airlines. Da der Rechner keine Airline abfragt, wird Miles & More konservativ mit dem vollen Meilenbedarf berechnet.";
  }

  async function ladeDropdownsAusGithub() {
    fillFallbackDropdowns();
    updateFamilyUiCopy();
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

  function getChildDiscount(programm) {
    const key = normalize(programm);
    if (key === "flying blue") return 0.25;
    return 0;
  }

  function getFamilyAwardMath(payload, persons) {
    const kinder = Math.min(extractNumber(payload.kinder2_11), Math.max(0, persons - 1));
    const discount = getChildDiscount(payload.programm);
    const adults = Math.max(1, persons - kinder);
    const billablePersons = adults + kinder * (1 - discount);
    const savedChildShare = kinder * discount;
    const programKey = normalize(payload.programm);

    let note = "";
    if (kinder > 0 && programKey === "flying blue") {
      note = `Flying Blue: ${kinder} Kind${kinder === 1 ? "" : "er"} von 2–11 Jahren mit 25 % Meilenabschlag als Planungswert berücksichtigt. Laut Flying Blue gilt der Rabatt für Reward Tickets, wenn das Kind mit einem Erwachsenen reist; für den Rabatt soll über Air France oder KLM gebucht werden.`;
    } else if (kinder > 0 && programKey === "miles & more") {
      note = `Miles & More: Der Child’s Award Flight kann für Kinder von 2–11 Jahren 25 % weniger Meilen kosten, gilt aber nur bei bestimmten ausführenden Airlines. Da der Rechner keine Airline abfragt, wird hier bewusst mit dem vollen Meilenbedarf gerechnet.`;
    } else if (kinder > 0) {
      note = `${payload.programm}: Für Kinder von 2–11 Jahren ist im Rechner kein allgemeiner Meilenrabatt hinterlegt. Der volle Meilenbedarf bleibt als Planungswert bestehen.`;
    }

    return { kinder, adults, discount, billablePersons, savedChildShare, note };
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

  function buildDataBasisHtml(payload) {
    const awardDataStand = window.MILES_PLANNER_AWARD_RATES?.dataStand || "nicht angegeben";
    const rulesDataStand = window.MILES_PLANNER_PROGRAMS?.dataStand || "nicht angegeben";
    const programKey = normalize(payload.programm);

    let programNote = "Die hinterlegten Meilen-, Gebühren- und Cashwerte sind Planungsbereiche und keine Livepreise.";
    if (programKey === "miles & more") {
      programNote = "Miles & More berechnet Awards mit Austrian Airlines, Air Dolomiti, Discover Airlines, Lufthansa, Lufthansa City Airlines und SWISS teilweise variabel nach aktuellem Online-Angebot. Die hier hinterlegte Zahl ist deshalb ausdrücklich nur ein Planungsbereich.";
    } else if (programKey === "flying blue") {
      programNote = "Flying Blue bepreist Reward Tickets dynamisch. Die hier hinterlegte Zahl ist ein Planungsbereich und kein garantierter Mindestpreis.";
    } else if (programKey === "avios") {
      programNote = "Avios-Awardpreise hängen stark von Airline, Routing und Peak-/Off-Peak-Logik ab. Der Rechner nutzt einen Planungsbereich statt eines garantierten Fixpreises.";
    } else if (programKey === "krisflyer") {
      programNote = "KrisFlyer-Werte hängen unter anderem von Saver/Advantage, Routing und Verfügbarkeit ab. Der Rechner nutzt hierfür Planungsbereiche.";
    } else if (programKey === "emirates skywards") {
      programNote = "Skywards-Awardpreise und Zuzahlungen können sich je nach Route und Verfügbarkeit ändern. Maßgeblich ist die konkrete Emirates-Buchungsmaske.";
    }

    return `<div class="result-info-card"><strong>Datenbasis des Rechners</strong><p>Award-, Gebühren- und Cash-Planungswerte: Stand ${escapeHtml(awardDataStand)}. Programm- und Transferregeln: geprüft am ${escapeHtml(rulesDataStand)}.</p><p>${escapeHtml(programNote)}</p><p>Vor Punktetransfer oder Buchung immer den tatsächlich verfügbaren Award und die reale Zuzahlung prüfen.</p></div>`;
  }

  function buildGithubResult(payload, rate) {
    const prefix = getScenarioPrefix(payload.szenario);
    const persons = extractNumber(payload.personen);
    const family = getFamilyAwardMath(payload, persons);
    const cfg = getProgramConfig(payload.programm);
    const seasonFactor = getSeasonFactor(rate, payload.reisezeit);
    const milesPp = Number(rate[`${prefix}MilesRtPp`] || 0) * seasonFactor;
    const taxesPp = Number(rate[`${prefix}TaxesRtPp`] || 0) * seasonFactor;
    const targetMiles = Math.round(milesPp * family.billablePersons);
    const milesWithoutChildDiscount = Math.round(milesPp * persons);
    const childDiscountMiles = Math.max(0, milesWithoutChildDiscount - targetMiles);
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
      family,
      childDiscountMiles,
      rate
    };
  }

  async function berechneMilesPlanerMitGithubFallback() {
    clearValidationUI();
    updateFamilyUiCopy();
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
      const familyNoteHtml = data.family?.note ? `<div class="result-info-card"><strong>Familienlogik</strong><p>${escapeHtml(data.family.note)}</p>${data.childDiscountMiles > 0 ? `<p>Planerischer Meilenvorteil: ${escapeHtml(formatPoints(data.childDiscountMiles))} ${escapeHtml(cfg.kurzlabel || "Punkte")} gegenüber voller Erwachsenenberechnung.</p>` : ""}<p>Hinweis: Der Rechner bildet nur den Meilenbedarf als Planungswert ab. Steuern, Gebühren, Verfügbarkeit, Airline-Regeln und konkrete Buchungsbedingungen können abweichen.</p></div>` : "";
      const dataBasisHtml = buildDataBasisHtml(payload);
      resultBox.innerHTML = `
        <div class="result-card">
          <div class="decision-card decision-card-${escapeHtml(chart.key)}">
            <div class="decision-badge">${escapeHtml(chart.badge)} ${escapeHtml(chart.title)}</div>
            <h3 class="decision-title">${escapeHtml(chart.text)}</h3>
            <p class="decision-text">Ziel: <strong>${escapeHtml(payload.ziel)}</strong> · Klasse: <strong>${escapeHtml(payload.reiseklasse)}</strong> · Reisende: <strong>${escapeHtml(payload.personen)}</strong></p>
          </div>
          ${familyNoteHtml}
          ${dataBasisHtml}
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
          <div class="result-section"><h3>Nächste Schritte</h3><ul><li>Prüfe den Awardpreis und die Verfügbarkeit direkt beim Programm.</li><li>Vergleiche alternative Programme, falls der Meilenbedarf stark abweicht.</li><li>Transferiere flexible Punkte erst, wenn die konkrete Buchungsmöglichkeit feststeht.</li></ul></div>
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
  updateFamilyUiCopy();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { updateFamilyUiCopy(); installSubmitOverride(); });
  else installSubmitOverride();
})();
