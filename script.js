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

function extractErsparnis(text) {
  if (!text) return "";
  const match = text.match(/Ersparnis\s*~?([0-9\.\,]+)\s*€\s*gesamt/i);
  return match ? `${match[1]} €` : "";
}

function extractCashPP(text) {
  if (!text) return "";
  const match = text.match(/Cash\s*~?([0-9\.\,]+)\s*€\s*p\.?P\.?/i);
  return match ? `${match[1]} € p.P.` : "";
}

function extractZuzahlungPP(text) {
  if (!text) return "";
  const match = text.match(/Zuzahlung\s*~?([0-9\.\,]+)\s*€\s*p\.?P\.?/i);
  return match ? `${match[1]} € p.P.` : "";
}

function extractTaxesTotal(text) {
  if (!text) return "";
  const match = text.match(/\(~?([0-9\.\,]+)\s*€\s*(?:für|gesamt)/i);
  return match ? `${match[1]} € gesamt` : "";
}

function extractTaxesPP(text) {
  if (!text) return "";
  const match = text.match(/~?([0-9\.\,]+)\s*€\s*p\.?P\.?/i);
  return match ? `${match[1]} € p.P.` : "";
}

function extractDealLabel(text) {
  if (!text) return "";
  return text.split("|")[0].trim();
}

function extractDealDetail(text) {
  if (!text) return "";
  const parts = text.split("|");
  return parts.length > 1 ? parts.slice(1).join("|").trim() : "";
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

    const dealLabel = extractDealLabel(data.deal);
    const dealDetail = extractDealDetail(data.deal);

    const taxesTotal = extractTaxesTotal(data.taxes);
    const taxesPP = extractTaxesPP(data.taxes);

    const cashPP = extractCashPP(data.cash);
    const zuzahlungPP = extractZuzahlungPP(data.cash);
    const ersparnisGesamt = extractErsparnis(data.cash);

    const personen = Number(payload.personen) || 1;

    let ersparnisPP = "";
    if (ersparnisGesamt) {
      const numeric = ersparnisGesamt.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
      const total = Number(numeric);
      if (!Number.isNaN(total) && personen > 0) {
        const perPerson = Math.round(total / personen);
        ersparnisPP = `${perPerson.toLocaleString("de-DE")} € p.P.`;
      }
    }

    let cashGesamt = "";
    if (cashPP) {
      const numeric = cashPP.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
      const value = Number(numeric);
      if (!Number.isNaN(value)) {
        cashGesamt = `${Math.round(value * personen).toLocaleString("de-DE")} € gesamt`;
      }
    }

    let zuzahlungGesamt = taxesTotal;
    if (!zuzahlungGesamt && zuzahlungPP) {
      const numeric = zuzahlungPP.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
      const value = Number(numeric);
      if (!Number.isNaN(value)) {
        zuzahlungGesamt = `${Math.round(value * personen).toLocaleString("de-DE")} € gesamt`;
      }
    }

    resultBox.innerHTML = `
      <div class="result-card">
        ${
          ersparnisGesamt
            ? `
          <div class="hero-savings-box">
            <div class="hero-savings-label">💰 Geschätzte Ersparnis durch den Award</div>
            <div class="hero-savings-value">${escapeHtml(ersparnisGesamt)}</div>
            <div class="hero-savings-sub">
              ${escapeHtml(personen)} Reisende${ersparnisPP ? ` · ca. ${escapeHtml(ersparnisPP)}` : ""}
            </div>
          </div>
        `
            : ""
        }

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
          <h3>Deal & Kosten</h3>

          <div class="result-grid">
            <div class="result-item">
              <div class="label">Deal-Bewertung</div>
              <div class="value value-small">${escapeHtml(dealLabel || data.deal || "")}</div>
              ${
                dealDetail
                  ? `<div class="value-note">${escapeHtml(dealDetail)}</div>`
                  : ""
              }
            </div>

            <div class="result-item">
              <div class="label">Award-Zuzahlung</div>
              <div class="value value-small">${escapeHtml(zuzahlungGesamt || data.taxes || "")}</div>
              ${
                taxesPP
                  ? `<div class="value-note">ca. ${escapeHtml(taxesPP)}</div>`
                  : ""
              }
            </div>

            <div class="result-item">
              <div class="label">Cashpreis</div>
              <div class="value value-small">${escapeHtml(cashGesamt || data.cash || "")}</div>
              ${
                cashPP
                  ? `<div class="value-note">ca. ${escapeHtml(cashPP)}</div>`
                  : ""
              }
            </div>

            <div class="result-item">
              <div class="label">Ersparnis</div>
              <div class="value value-small">${escapeHtml(ersparnisGesamt || "—")}</div>
              ${
                ersparnisPP
                  ? `<div class="value-note">ca. ${escapeHtml(ersparnisPP)}</div>`
                  : ""
              }
            </div>
          </div>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Fortschritt heute</div>
            <div class="value">${escapeHtml(data.progress || "")}</div>
          </div>
          <div class="result-item">
            <div class="label">Fortschritt inkl. Bonus</div>
            <div class="value">${escapeHtml(data.progressBonus || "")}</div>
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
