const API_URL =
  "https://script.google.com/macros/s/AKfycbyfyZtqZyRrQlQWmTMK-IbKc7J4KCGK4A1huw2F9ZOVdSm7hw9mN3BVSYlRmDnF8o1h/exec";

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
  const match = String(text).match(/Cash\s*\|\s*~?\s*([0-9\.\,]+)\s*€\s*p\.?P\.?\s*Cash/i);
  if (match) return extractNumber(match[1]);

  const fallback = String(text).match(/~?\s*([0-9\.\,]+)\s*€\s*p\.?P\.?\s*Cash/i);
  return fallback ? extractNumber(fallback[1]) : NaN;
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

async function berechneMilesPlaner() {
  const resultBox = document.getElementById("result");

  zeigeErgebnisView();
  resultBox.innerHTML = "<p>Berechne...</p>";

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

    resultBox.innerHTML = `
      <div class="result-card">
        <h2>${escapeHtml(data.headline || "Ergebnis")}</h2>
        <p class="subline">${escapeHtml(data.subline || "")}</p>

        <div class="result-section">
          <p><strong>${escapeHtml(data.status || "")}</strong></p>
          <p>${escapeHtml(data.risiken || "")}</p>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Bestand heute</div>
            <div class="value">${escapeHtml(data.bestand || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Bonus geplant</div>
            <div class="value">${escapeHtml(data.bonus || "")}</div>
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
              <div class="value-note">Stand heute ohne geplanten Bonus</div>
            </div>

            <div class="result-item">
              <div class="label">Fortschritt zum ${escapeHtml(programmName)}-Ziel inkl. Bonus</div>
              <div class="value">${escapeHtml(data.progressBonus || "")}</div>
              ${buildProgressBar(progressBonus)}
              <div class="value-note">Inkl. geplantem Bonus und Transferfaktor</div>
            </div>
          </div>
        </div>

        <div class="result-section">
          <h3>Deal & Kosten</h3>

          <div class="result-grid">
            <div class="result-item deal-highlight">
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

