const API_URL =
  "https://script.google.com/macros/s/AKfycbyUYB1eWHphJIvw5ReSgZflvPjCWXlxNrk_WcprVOv8PFoq_CvvKoxijAu8hR3iAu_s/exec";

const PROGRAM_CONFIG = {
  "Miles & More": {
    currentUnit: "Miles & More Meilen",
    transferUnit: "PAYBACK Punkte",
    transferInfo: "Transferfaktor: 1:1 · PAYBACK Punkte werden 1:1 in Miles & More Meilen umgewandelt.",
  },
  Avios: {
    currentUnit: "Avios",
    transferUnit: "Membership Rewards Punkte",
    transferInfo: "Transferfaktor: 5:4 · Membership Rewards Punkte werden zu Avios umgerechnet.",
  },
  "Flying Blue": {
    currentUnit: "Flying Blue Meilen",
    transferUnit: "Membership Rewards Punkte",
    transferInfo: "Transferfaktor: 5:4 · Membership Rewards Punkte werden zu Flying Blue Meilen umgerechnet.",
  },
  KrisFlyer: {
    currentUnit: "KrisFlyer Meilen",
    transferUnit: "Membership Rewards Punkte",
    transferInfo: "Transferfaktor laut Rechnerlogik · Membership Rewards Punkte werden im Sheet automatisch umgerechnet.",
  },
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
    PROGRAM_CONFIG[programm] || {
      currentUnit: "Meilen / Punkte",
      transferUnit: "Transferfähige Punkte",
      transferInfo: "Transferfaktor laut Rechnerlogik",
    }
  );
}

function updatePointsLabels() {
  const programm = document.getElementById("programm").value;
  const cfg = getProgramConfig(programm);

  document.getElementById("labelBestandAktuell").textContent =
    `Aktueller Bestand (${cfg.currentUnit})`;

  document.getElementById("labelTransferBestand").textContent =
    `Transferfähiger Bestand (${cfg.transferUnit})`;

  document.getElementById("labelGeplanterBonus").textContent =
    `Geplanter Bonus (${cfg.transferUnit})`;

  document.getElementById("labelMonatlicheSammelrate").textContent =
    `Monatliche Sammelrate (${cfg.transferUnit})`;

  document.getElementById("pointsHelper").textContent = cfg.transferInfo;
}

function setStepActive(id, isActive) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("active", isActive);
}

function updateFormFlow() {
  const ziel = document.getElementById("ziel").value;
  const personen = document.getElementById("personen").value;
  const reiseklasse = document.getElementById("reiseklasse").value;
  const reisezeit = document.getElementById("reisezeit").value;
  const reisemonat = document.getElementById("reisemonat").value;
  const programm = document.getElementById("programm").value;

  setStepActive("step-ziel", true);
  setStepActive("step-personen", !!ziel);
  setStepActive("step-reiseklasse", !!ziel && !!personen);
  setStepActive("step-reisezeit", !!ziel && !!personen && !!reiseklasse);
  setStepActive("step-reisemonat", !!ziel && !!personen && !!reiseklasse && !!reisezeit);
  setStepActive("step-programm", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat);
  setStepActive("step-punkte", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat && !!programm);

  if (programm) {
    updatePointsLabels();
  }
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

    populateSelect("ziel", data.ziele || [], "Bitte Ziel wählen");
    populateSelect("reiseklasse", (data.klassen || []).filter((k) => !/economy/i.test(k)), "Bitte Reiseklasse wählen");
    populateSelect("reisezeit", data.reisezeiten || [], "Bitte Reisezeit wählen");
    populateSelect("reisemonat", data.monate || [], "Bitte Reisemonat wählen");
    populateSelect("programm", data.programme || [], "Bitte Programm wählen");
  } catch (error) {
    console.error(error);

    populateSelect("ziel", ["Dubai", "Japan", "Malediven", "Südafrika", "Thailand", "USA East", "USA West"], "Bitte Ziel wählen");
    populateSelect("reiseklasse", ["Premium Economy", "Business"], "Bitte Reiseklasse wählen");
    populateSelect("reisezeit", ["Nebensaison", "Hauptreisezeit", "Ferien"], "Bitte Reisezeit wählen");
    populateSelect("reisemonat", [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"
    ], "Bitte Reisemonat wählen");
    populateSelect("programm", ["Miles & More", "Avios", "Flying Blue", "KrisFlyer"], "Bitte Programm wählen");
  }

  updateFormFlow();
}

async function berechneMilesPlaner() {
  const resultBox = document.getElementById("result");

  const payload = {
    ziel: document.getElementById("ziel").value,
    personen: document.getElementById("personen").value,
    programm: document.getElementById("programm").value,
    reiseklasse: document.getElementById("reiseklasse").value,
    reisezeit: document.getElementById("reisezeit").value,
    reisejahr: document.getElementById("reisejahr").value,
    reisemonat: document.getElementById("reisemonat").value,
    bestandAktuell: document.getElementById("bestandAktuell").value,
    transferBestand: document.getElementById("transferBestand").value,
    geplanterBonus: document.getElementById("geplanterBonus").value,
    monatlicheSammelrate: document.getElementById("monatlicheSammelrate").value,
  };

  if (
    !payload.ziel ||
    !payload.personen ||
    !payload.reiseklasse ||
    !payload.reisezeit ||
    !payload.reisemonat ||
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
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("HTTP-Fehler: " + response.status);
    }

    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Unbekannter Fehler aus Apps Script");
    }

    const personen = Number(payload.personen) || 1;
    const programmName = payload.programm || "Programm";
    const cfg = getProgramConfig(programmName);

    const dealLabel = extractDealLabel(data.deal);
    const dealDetail = extractDealDetail(data.deal);
    const cpmValue = extractCpm(data.deal);

    const taxesPP = extractTaxesPP(data.taxes);
    const taxesTotal = extractTaxesTotal(data.taxes);
    const finalTaxesPP = Number.isNaN(taxesPP) ? extractZuzahlungPP(data.cash) : taxesPP;
    const finalTaxesTotal =
      Number.isNaN(taxesTotal) && !Number.isNaN(finalTaxesPP)
        ? finalTaxesPP * personen
        : taxesTotal;

    const cashPP = extractCashPP(data.cash);
    const cashGesamt = !Number.isNaN(cashPP) ? cashPP * personen : NaN;

    const ersparnisGesamt = extractErsparnisGesamt(data.cash);
    const ersparnisPP =
      !Number.isNaN(ersparnisGesamt) && personen > 0
        ? ersparnisGesamt / personen
        : NaN;

    const progressHeute = extractPercent(data.progress);
    const progressBonus = extractPercent(data.progressBonus);

    const dealClass =
      /guter deal|sehr guter deal|top deal/i.test(dealLabel)
        ? "deal-good"
        : /mittel|ok|solide/i.test(dealLabel)
        ? "deal-medium"
        : /schwach|schlechter deal|kein guter deal/i.test(dealLabel)
        ? "deal-bad"
        : "deal-neutral";

    resultBox.innerHTML = `
      <div class="result-card">
        <h2>${escapeHtml(data.headline || "Ergebnis")}</h2>
        <p class="subline">${escapeHtml(data.subline || "")}</p>

        <div class="result-section">
          <p><strong>${escapeHtml(data.statusText || "")}</strong></p>
          <p>${escapeHtml(data.risiken || "")}</p>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Bestand heute (${escapeHtml(cfg.currentUnit)})</div>
            <div class="value">${escapeHtml(data.bestand || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Bonus geplant (${escapeHtml(cfg.transferUnit)})</div>
            <div class="value">${escapeHtml(data.bonus || "")}</div>
            <div class="value-note">${escapeHtml(cfg.transferInfo)}</div>
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
              <div class="value-note">${escapeHtml(data.progressNoteToday || "Stand heute ohne geplanten Bonus")}</div>
            </div>

            <div class="result-item">
              <div class="label">Fortschritt zum ${escapeHtml(programmName)}-Ziel inkl. Bonus</div>
              <div class="value">${escapeHtml(data.progressBonus || "")}</div>
              ${buildProgressBar(progressBonus)}
              <div class="value-note">${escapeHtml(data.progressNoteBonus || cfg.transferInfo)}</div>
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
  } catch (error) {
    resultBox.innerHTML = `
      <p><strong>Fehler:</strong> ${escapeHtml(error.message)}</p>
      <p>Bitte prüfe die Apps-Script-Web-App und die Sheet-Verknüpfung.</p>
    `;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await ladeDropdowns();

  ["ziel", "personen", "reiseklasse", "reisezeit", "reisemonat", "programm"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", updateFormFlow);
    }
  });

  const programm = document.getElementById("programm");
  if (programm) {
    programm.addEventListener("change", updatePointsLabels);
  }
});
