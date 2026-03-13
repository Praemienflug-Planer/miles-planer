const API_URL =
  "https://script.google.com/macros/s/AKfycbyUYB1eWHphJIvw5ReSgZflvPjCWXlxNrk_WcprVOv8PFoq_CvvKoxijAu8hR3iAu_s/exec";

let PROGRAM_META = {};

const FALLBACK_PROGRAM_META = {
  "Miles & More": {
    punktelabel: "Miles & More Meilen",
    kurzlabel: "M&M",
    transferquelle: "PAYBACK",
    faktor: 1
  },
  Avios: {
    punktelabel: "Avios",
    kurzlabel: "Avios",
    transferquelle: "Membership Rewards",
    faktor: 0.8
  },
  "Flying Blue": {
    punktelabel: "Flying Blue Meilen",
    kurzlabel: "Flying Blue",
    transferquelle: "Membership Rewards",
    faktor: 0.8
  },
  KrisFlyer: {
    punktelabel: "KrisFlyer Meilen",
    kurzlabel: "KrisFlyer",
    transferquelle: "Membership Rewards",
    faktor: 0.6667
  }
};

const AFFILIATE_CONFIG = {
  "Miles & More": {
    sourceLabel: "PAYBACK Punkte",
    headline: "💡 Miles & More Ziel schneller erreichen",
    text: "Viele Nutzer schließen ihre Miles & More Lücke schneller über Kreditkarten-Boni oder Punkteaktionen.",
    offers: [
      {
        title: "American Express PAYBACK Kreditkarte",
        subtitle: "zusätzliche PAYBACK Punkte für Miles & More",
        bonus: 5000,
        url: "#"
      }
    ]
  },
  Avios: {
    sourceLabel: "Membership Rewards Punkte",
    headline: "💡 Avios schneller aufbauen",
    text: "Aktuell starke Membership Rewards Boni können helfen, deine Avios-Lücke deutlich schneller zu verkleinern.",
    offers: [
      {
        title: "American Express Gold Rosé",
        subtitle: "aktuell starker Bonus: bis zu 55.000 MR Punkte",
        bonus: 55000,
        url: "#"
      },
      {
        title: "American Express Gold",
        subtitle: "aktuell starker Bonus: bis zu 50.000 MR Punkte",
        bonus: 50000,
        url: "#"
      },
      {
        title: "American Express Platinum",
        subtitle: "aktuell starker Bonus: bis zu 85.000 MR Punkte",
        bonus: 85000,
        url: "#"
      }
    ]
  },
  "Flying Blue": {
    sourceLabel: "Membership Rewards Punkte",
    headline: "💡 Flying Blue schneller aufbauen",
    text: "Aktuell starke Membership Rewards Boni können helfen, deine Flying Blue Lücke deutlich schneller zu verkleinern.",
    offers: [
      {
        title: "American Express Gold Rosé",
        subtitle: "aktuell starker Bonus: bis zu 55.000 MR Punkte",
        bonus: 55000,
        url: "#"
      },
      {
        title: "American Express Gold",
        subtitle: "aktuell starker Bonus: bis zu 50.000 MR Punkte",
        bonus: 50000,
        url: "#"
      },
      {
        title: "American Express Platinum",
        subtitle: "aktuell starker Bonus: bis zu 85.000 MR Punkte",
        bonus: 85000,
        url: "#"
      }
    ]
  },
  KrisFlyer: {
    sourceLabel: "Membership Rewards Punkte",
    headline: "💡 KrisFlyer schneller aufbauen",
    text: "Aktuell starke Membership Rewards Boni können helfen, deine KrisFlyer Lücke deutlich schneller zu verkleinern.",
    offers: [
      {
        title: "American Express Gold Rosé",
        subtitle: "aktuell starker Bonus: bis zu 55.000 MR Punkte",
        bonus: 55000,
        url: "#"
      },
      {
        title: "American Express Gold",
        subtitle: "aktuell starker Bonus: bis zu 50.000 MR Punkte",
        bonus: 50000,
        url: "#"
      },
      {
        title: "American Express Platinum",
        subtitle: "aktuell starker Bonus: bis zu 85.000 MR Punkte",
        bonus: 85000,
        url: "#"
      }
    ]
  }
};

function zeigeErgebnisView() {
  document.getElementById("inputView").classList.remove("active");
  document.getElementById("resultView").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function zurueckZuEingaben() {
  document.getElementById("resultView").classList.remove("active");
  document.getElementById("inputView").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractNumber(text) {
  if (!text) return NaN;
  const cleaned = String(text)
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(cleaned);
}

function formatEuro(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return `${Math.round(value).toLocaleString("de-DE")} €`;
}

function formatPoints(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return Math.round(value).toLocaleString("de-DE");
}

function extractPercent(text) {
  if (!text) return NaN;
  const match = String(text).match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (!match) return NaN;
  return Number(match[1].replace(",", "."));
}

function extractDealLabel(text) {
  if (!text) return "";
  return String(text).split("|")[0].trim();
}

function extractDealDetail(text) {
  if (!text) return "";
  const parts = String(text).split("|");
  return parts.length > 1 ? parts.slice(1).join("|").trim() : "";
}

function extractCpm(text) {
  if (!text) return "";
  const match = String(text).match(/([0-9]+(?:[.,][0-9]+)?)\s*ct\s*pro\s*Meile/i);
  return match ? `${match[1].replace(".", ",")} ct / Meile` : "";
}

function extractTaxesPP(text) {
  if (!text) return NaN;
  const match = String(text).match(/~?\s*([0-9\.\,]+)\s*€\s*p\.?P\.?/i);
  return match ? extractNumber(match[1]) : NaN;
}

function extractTaxesTotal(text) {
  if (!text) return NaN;
  const match = String(text).match(/\(~?\s*([0-9\.\,]+)\s*€\s*(?:für|gesamt)/i);
  return match ? extractNumber(match[1]) : NaN;
}

function extractCashPP(text) {
  if (!text) return NaN;
  const match = String(text).match(/~?\s*([0-9\.\,]+)\s*€\s*p\.?P\.?\s*Cash/i);
  return match ? extractNumber(match[1]) : NaN;
}

function extractZuzahlungPP(text) {
  if (!text) return NaN;
  const match = String(text).match(/~?\s*([0-9\.\,]+)\s*€\s*p\.?P\.?\s*Zuzahlung/i);
  return match ? extractNumber(match[1]) : NaN;
}

function extractErsparnisGesamt(text) {
  if (!text) return NaN;
  const match = String(text).match(/Ersparnis\s*~?\s*([0-9\.\,]+)\s*€\s*gesamt/i);
  return match ? extractNumber(match[1]) : NaN;
}

function buildProgressBar(percent) {
  const safePercent = Number.isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent));
  return `
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" style="width:${safePercent}%"></div>
      </div>
    </div>
  `;
}

function populateSelect(id, values, placeholder = "Bitte wählen") {
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML = "";

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = placeholder;
  firstOption.selected = true;
  select.appendChild(firstOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function getProgramConfig(programm) {
  return (
    PROGRAM_META[programm] ||
    FALLBACK_PROGRAM_META[programm] || {
      punktelabel: "Meilen / Punkte",
      kurzlabel: programm || "Programm",
      transferquelle: "Transferpartner",
      faktor: null
    }
  );
}

function getScenarioLabel(value) {
  switch (value) {
    case "best":
      return "Best Case";
    case "konservativ":
      return "Konservativ";
    case "realistisch":
    default:
      return "Realistisch";
  }
}

function getScenarioMeta(value) {
  switch (value) {
    case "best":
      return {
        label: "Best Case",
        badgeClass: "scenario-badge-best",
        headline: "Optimistische Planung",
        text: "Dieses Szenario zeigt, wie dein Ziel erreichbar wäre, wenn Verfügbarkeit, Sammeltempo und Rahmenbedingungen gut laufen."
      };
    case "konservativ":
      return {
        label: "Konservativ",
        badgeClass: "scenario-badge-konservativ",
        headline: "Vorsichtige Planung",
        text: "Dieses Szenario rechnet mit mehr Puffer und ist besonders hilfreich, wenn du lieber defensiv planst."
      };
    case "realistisch":
    default:
      return {
        label: "Realistisch",
        badgeClass: "scenario-badge-realistisch",
        headline: "Solide Planung",
        text: "Dieses Szenario ist der beste Standardwert für die meisten Nutzer und bildet eine vernünftige mittlere Annahme ab."
      };
  }
}

function buildTransferInfo(cfg) {
  if (!cfg) return "";
  const source = cfg.transferquelle || "Transferpartner";
  const target = cfg.kurzlabel || "Programm";
  const faktor = cfg.faktor;

  if (faktor === 1) {
    return `Transferfaktor: ${source} → ${target} 1:1`;
  }
  if (typeof faktor === "number" && !Number.isNaN(faktor)) {
    return `Transferfaktor: ${source} → ${target} (${String(faktor).replace(".", ",")})`;
  }
  return `Transferfaktor: ${source} → ${target}`;
}

function updatePointsLabels() {
  const programm = document.getElementById("programm").value;
  const cfg = getProgramConfig(programm);

  const labelBestandAktuell = document.getElementById("labelBestandAktuell");
  const labelTransferBestand = document.getElementById("labelTransferBestand");
  const labelGeplanterBonus = document.getElementById("labelGeplanterBonus");
  const labelMonatlicheSammelrate = document.getElementById("labelMonatlicheSammelrate");
  const pointsHelper = document.getElementById("pointsHelper");
  const resultTransferHint = document.getElementById("resultTransferHint");

  if (labelBestandAktuell) {
    labelBestandAktuell.textContent =
      `Aktueller Bestand (${cfg.punktelabel || "Meilen / Punkte"})`;
  }

  if (labelTransferBestand) {
    labelTransferBestand.textContent =
      `Transferfähiger Bestand (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  if (labelGeplanterBonus) {
    labelGeplanterBonus.textContent =
      `Geplanter Bonus (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  if (labelMonatlicheSammelrate) {
    labelMonatlicheSammelrate.textContent =
      `Monatliche Sammelrate (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  const helperHtml = `
    <strong>Transferhinweis</strong>
    <p>${escapeHtml(buildTransferInfo(cfg))}</p>
    <p>
      Bei <strong>PAYBACK → Miles &amp; More</strong> rechnet der Rechner konservativ mit
      <strong>1:1</strong>.
    </p>
    <p>
      In der Praxis gibt es regelmäßig
      <strong>Transferboni von etwa 15–30&nbsp;%</strong>.
      Dadurch kann sich deine tatsächliche Sammelzeit deutlich verkürzen.
    </p>
  `;

  if (pointsHelper) {
    pointsHelper.innerHTML = helperHtml;
  }

  if (resultTransferHint) {
    resultTransferHint.innerHTML = helperHtml;
  }
}

function setStepActive(id, isActive) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("active", isActive);
}

function updateFormFlow() {
  const ziel = document.getElementById("ziel")?.value;
  const personen = document.getElementById("personen")?.value;
  const reiseklasse = document.getElementById("reiseklasse")?.value;
  const reisezeit = document.getElementById("reisezeit")?.value;
  const reisemonat = document.getElementById("reisemonat")?.value;
  const reisejahr = document.getElementById("reisejahr")?.value;
  const programm = document.getElementById("programm")?.value;

  setStepActive("step-ziel", true);
  setStepActive("step-personen", !!ziel);
  setStepActive("step-reiseklasse", !!ziel && !!personen);
  setStepActive("step-reisezeit", !!ziel && !!personen && !!reiseklasse);
  setStepActive("step-reisemonat", !!ziel && !!personen && !!reiseklasse && !!reisezeit);
  setStepActive("step-reisejahr", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat);
  setStepActive("step-programm", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat && !!reisejahr);
  setStepActive("step-punkte", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat && !!reisejahr && !!programm);

  if (programm) {
    updatePointsLabels();
  }
}

function getAffiliateConfig(programm) {
  return AFFILIATE_CONFIG[programm] || null;
}

function buildAffiliateBox(programm, fehlend, progressPercent) {
  const cfg = getAffiliateConfig(programm);
  if (!cfg) return "";
  if (Number.isNaN(fehlend) || fehlend <= 0) return "";

  const cardsHtml = cfg.offers
    .map((offer) => {
      const coverage = Math.min(100, Math.round((offer.bonus / fehlend) * 100));
      return `
        <a href="${escapeHtml(offer.url)}" class="affiliate-card" target="_blank" rel="nofollow sponsored noopener">
          <strong>${escapeHtml(offer.title)}</strong><br>
          <span>${escapeHtml(offer.subtitle)}</span>
          <div class="affiliate-meta">
            Aktuell: ca. ${escapeHtml(formatPoints(offer.bonus))} ${escapeHtml(cfg.sourceLabel)}
            ${
              coverage > 0
                ? `<br><span class="affiliate-coverage">könnte ca. ${coverage}% deiner aktuellen Lücke abdecken</span>`
                : ""
            }
          </div>
        </a>
      `;
    })
    .join("");

  let urgencyText = "";
  if (!Number.isNaN(progressPercent)) {
    if (progressPercent < 35) {
      urgencyText = "Gerade bei einer größeren Lücke kann ein starker Willkommensbonus einen spürbaren Unterschied machen.";
    } else if (progressPercent < 70) {
      urgencyText = "Du bist schon unterwegs – ein starker Bonus kann dein Ziel deutlich näher rücken lassen.";
    } else {
      urgencyText = "Dir fehlt nicht mehr viel – ein Bonus oder eine Aktion kann die Restlücke schnell schließen.";
    }
  }

  return `
    <div class="affiliate-box">
      <h4>${escapeHtml(cfg.headline)}</h4>
      <p>${escapeHtml(cfg.text)}</p>
      ${
        urgencyText
          ? `<p class="affiliate-urgency">${escapeHtml(urgencyText)}</p>`
          : ""
      }
      <div class="affiliate-links">
        ${cardsHtml}
      </div>
    </div>
  `;
}

async function ladeDropdowns() {
  try {
    const response = await fetch(`${API_URL}?action=options`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Dropdowns konnten nicht geladen werden.");
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "Fehler beim Laden der Dropdown-Werte.");
    }

    PROGRAM_META = data.programMeta || {};

    populateSelect("ziel", data.ziele || [], "Bitte Ziel wählen");
    populateSelect(
      "reiseklasse",
      (data.klassen || []).filter((k) => k !== "Economy"),
      "Bitte Reiseklasse wählen"
    );
    populateSelect("reisezeit", data.reisezeiten || [], "Bitte Reisezeit wählen");
    populateSelect("reisemonat", data.monate || [], "Bitte Reisemonat wählen");
    populateSelect("programm", data.programme || [], "Bitte Programm wählen");
  } catch (error) {
    console.error(error);

    PROGRAM_META = FALLBACK_PROGRAM_META;

    populateSelect("ziel", ["Dubai", "Japan", "Malediven", "Südafrika", "Thailand", "USA East", "USA West"], "Bitte Ziel wählen");
    populateSelect("reiseklasse", ["Premium Economy", "Business"], "Bitte Reiseklasse wählen");
    populateSelect("reisezeit", ["Nebensaison", "Hauptreisezeit", "Ferien"], "Bitte Reisezeit wählen");
    populateSelect(
      "reisemonat",
      ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      "Bitte Reisemonat wählen"
    );
    populateSelect("programm", ["Miles & More", "Avios", "Flying Blue", "KrisFlyer"], "Bitte Programm wählen");
  }

  updateFormFlow();
}

async function berechneMilesPlaner() {
  const resultBox = document.getElementById("result");
  const scenarioValue = document.getElementById("szenario")?.value || "realistisch";
  const fallbackScenarioLabel = getScenarioLabel(scenarioValue);

  const payload = {
    szenario: scenarioValue,
    ziel: document.getElementById("ziel")?.value,
    personen: document.getElementById("personen")?.value,
    programm: document.getElementById("programm")?.value,
    reiseklasse: document.getElementById("reiseklasse")?.value,
    reisezeit: document.getElementById("reisezeit")?.value,
    reisejahr: document.getElementById("reisejahr")?.value,
    reisemonat: document.getElementById("reisemonat")?.value,
    bestandAktuell: document.getElementById("bestandAktuell")?.value,
    transferBestand: document.getElementById("transferBestand")?.value,
    geplanterBonus: document.getElementById("geplanterBonus")?.value,
    monatlicheSammelrate: document.getElementById("monatlicheSammelrate")?.value
  };

  if (
    !payload.ziel ||
    !payload.personen ||
    !payload.reiseklasse ||
    !payload.reisezeit ||
    !payload.reisemonat ||
    !payload.reisejahr ||
    !payload.programm
  ) {
    alert("Bitte fülle die sichtbaren Schritte nacheinander aus.");
    return;
  }

  zeigeErgebnisView();
  resultBox.innerHTML = "<p>Berechne...</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("HTTP-Fehler: " + response.status);
    }

    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Unbekannter Fehler aus Apps Script");
    }

    const persons = Number(payload.personen) || 1;
    const programmName = payload.programm || "Programm";
    const cfg = getProgramConfig(programmName);

    const finalScenarioKey = data.scenario || scenarioValue;
    const finalScenarioLabel = data.scenarioLabel || fallbackScenarioLabel;
    const scenarioMeta = getScenarioMeta(finalScenarioKey);
    const scenarioBadgeClass = scenarioMeta.badgeClass;

    const dealLabel = extractDealLabel(data.deal);
    const dealDetail = extractDealDetail(data.deal);
    const cpmValue = extractCpm(data.deal);

    const taxesPP = extractTaxesPP(data.taxes);
    const taxesTotal = extractTaxesTotal(data.taxes);
    const finalTaxesPP = Number.isNaN(taxesPP) ? extractZuzahlungPP(data.cash) : taxesPP;
    const finalTaxesTotal =
      Number.isNaN(taxesTotal) && !Number.isNaN(finalTaxesPP)
        ? finalTaxesPP * persons
        : taxesTotal;

    const cashPP = extractCashPP(data.cash);
    const cashGesamt = !Number.isNaN(cashPP) ? cashPP * persons : NaN;

    const ersparnisGesamt = extractErsparnisGesamt(data.cash);
    const ersparnisPP =
      !Number.isNaN(ersparnisGesamt) && persons > 0
        ? ersparnisGesamt / persons
        : NaN;

    const progressHeute = extractPercent(data.progress);
    const progressBonus = extractPercent(data.progressBonus);
    const fehlendValue = extractNumber(data.fehlend);

    const dealClass =
      /guter deal|sehr guter deal|top deal|exzellenter deal/i.test(dealLabel)
        ? "deal-good"
        : /mittel|ok|solide/i.test(dealLabel)
        ? "deal-medium"
        : /schwach|schlechter deal|kein guter deal/i.test(dealLabel)
        ? "deal-bad"
        : "deal-neutral";

    const affiliateBoxHtml = buildAffiliateBox(programmName, fehlendValue, progressBonus);

    resultBox.innerHTML = `
      <div class="result-card">
        <div class="result-item scenario-box">
          <div class="label">Aktives Szenario</div>
          <div class="scenario-badge ${scenarioBadgeClass}">${escapeHtml(finalScenarioLabel)}</div>
          <div class="scenario-headline">${escapeHtml(scenarioMeta.headline)}</div>
          <div class="value-note">${escapeHtml(scenarioMeta.text)}</div>
        </div>

        <h2>${escapeHtml(data.headline || "Ergebnis")}</h2>
        <p class="subline">${escapeHtml(data.subline || "")}</p>

        <div class="result-section">
          <p><strong>${escapeHtml(data.statusText || "")}</strong></p>
          <p>${escapeHtml(data.risiken || "")}</p>
          ${
            data.betterProgramHint
              ? `<p class="value-note">${escapeHtml(data.betterProgramHint)}</p>`
              : ""
          }
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Bestand heute (${escapeHtml(cfg.punktelabel || "Meilen / Punkte")})</div>
            <div class="value">${escapeHtml(data.bestand || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Bonus geplant (${escapeHtml((cfg.transferquelle || "Transferpartner") + " Punkte")})</div>
            <div class="value">${escapeHtml(data.bonus || "")}</div>
            <div class="value-note">${escapeHtml(data.transferInfo || buildTransferInfo(cfg))}</div>
          </div>
          <div class="result-item">
            <div class="label">Zielbedarf</div>
            <div class="value">${escapeHtml(data.zielbedarf || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Fehlend</div>
            <div class="value">${escapeHtml(data.fehlend || "")}</div>
          </div>
        </div>

        ${affiliateBoxHtml}

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Monate bis Ziel</div>
            <div class="value">${escapeHtml(data.monate || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Ziel erreicht ca.</div>
            <div class="value">${escapeHtml(data.zielErreicht || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Geplante Reise</div>
            <div class="value">${escapeHtml(data.reise || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Reisebewertung</div>
            <div class="value">${escapeHtml(data.bewertung || "")}</div>
          </div>
        </div>

        <div class="result-section">
          <h3>Sammelfortschritt</h3>

          <div class="result-grid">
            <div class="result-item">
              <div class="label">Fortschritt zum ${escapeHtml(programmName)}-Ziel heute</div>
              <div class="value">${escapeHtml(data.progress || "")}</div>
              ${buildProgressBar(progressHeute)}
            </div>

            <div class="result-item">
              <div class="label">Fortschritt zum ${escapeHtml(programmName)}-Ziel inkl. Bonus</div>
              <div class="value">${escapeHtml(data.progressBonus || "")}</div>
              ${buildProgressBar(progressBonus)}
            </div>
          </div>
        </div>

        <div class="result-section">
          <h3>Deal & Kosten</h3>

          <div class="result-grid">
            <div class="result-item deal-highlight ${dealClass}">
              <div class="label">Deal-Bewertung</div>
              <div class="value value-small">${escapeHtml(dealLabel || data.deal || "")}</div>
              ${
                cpmValue
                  ? `<div class="cpm-badge">${escapeHtml(cpmValue)}</div>`
                  : ""
              }
              ${
                dealDetail
                  ? `<div class="value-note">${escapeHtml(dealDetail)}</div>`
                  : ""
              }
            </div>

            <div class="result-item">
              <div class="label">Award-Zuzahlung</div>
              <div class="value value-small">${escapeHtml(formatEuro(finalTaxesTotal) || data.taxes || "")}</div>
              ${
                !Number.isNaN(finalTaxesPP)
                  ? `<div class="value-note">ca. ${escapeHtml(formatEuro(finalTaxesPP))} p.P.</div>`
                  : ""
              }
            </div>

            <div class="result-item">
              <div class="label">Cashpreis</div>
              <div class="value value-small">${escapeHtml(formatEuro(cashGesamt) || "—")}</div>
              ${
                !Number.isNaN(cashPP)
                  ? `<div class="value-note">ca. ${escapeHtml(formatEuro(cashPP))} p.P.</div>`
                  : ""
              }
            </div>

            <div class="result-item">
              <div class="label">Ersparnis</div>
              <div class="value value-small">${escapeHtml(formatEuro(ersparnisGesamt) || "—")}</div>
              ${
                !Number.isNaN(ersparnisPP)
                  ? `<div class="value-note">ca. ${escapeHtml(formatEuro(ersparnisPP))} p.P.</div>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>
    `;

    updatePointsLabels();
  } catch (error) {
    resultBox.innerHTML = `
      <p><strong>Fehler:</strong> ${escapeHtml(error.message)}</p>
      <p>Bitte prüfe die Apps-Script-Web-App, die Sheet-Verknüpfung und die Szenario-Zuordnung.</p>
    `;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await ladeDropdowns();

  ["ziel", "personen", "reiseklasse", "reisezeit", "reisemonat", "reisejahr", "programm"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", updateFormFlow);
      el.addEventListener("input", updateFormFlow);
    }
  });

  const programm = document.getElementById("programm");
  if (programm) {
    programm.addEventListener("change", updatePointsLabels);
  }

  updateFormFlow();
});
