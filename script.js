// URL der Backend-API (unverändert genutzt)
const API_URL =
  "https://script.google.com/macros/s/AKfycbyfyZtqZyRrQlQWmTMK-IbKc7J4KCGK4A1huw2F9ZOVdSm7hw9mN3BVSYlRmDnF8o1h/exec";

// Programmdaten (Punktetransfer-Regeln und Labels)
const FALLBACK_PROGRAM_META = {
  "Miles & More": {
    punktelabel: "Miles & More Meilen",
    kurzlabel: "M&M",
    transferquelle: "PAYBACK",
    faktor: 1,
    // Offizieller Transfer: PAYBACK→M&M 1:1 ab 200 Punkten
    transferRatioLabel: "PAYBACK Punkte \u2192 Miles & More (1:1)",
    transferMinimum: 200,
    transferDuration: "sofort bis wenige Tage (Meilen-Abo: 2× jährlich)",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "Avios": {
    punktelabel: "Avios",
    kurzlabel: "Avios",
    transferquelle: "Membership Rewards",
    faktor: 0.8,
    transferRatioLabel: "Membership Rewards \u2192 Avios (5:4)",
    transferMinimum: 1000,
    transferDuration: "bis zu 1 Werktag",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "Flying Blue": {
    punktelabel: "Flying Blue Meilen",
    kurzlabel: "Flying Blue",
    transferquelle: "Membership Rewards",
    faktor: 0.8,
    transferRatioLabel: "Membership Rewards \u2192 Flying Blue (5:4)",
    transferMinimum: 625,
    transferDuration: "bis zu 1 Werktag",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "KrisFlyer": {
    punktelabel: "KrisFlyer Meilen",
    kurzlabel: "KrisFlyer",
    transferquelle: "Membership Rewards",
    faktor: 0.6667,
    transferRatioLabel: "Membership Rewards \u2192 KrisFlyer (3:2)",
    transferMinimum: 1500,
    transferDuration: "bis zu 15 Werktage",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  }
};

let PROGRAM_META = FALLBACK_PROGRAM_META; // Kann bei Bedarf durch API-Daten erweitert werden

// Im Affiliate-Bereich verzichten wir komplett auf Kommerz und verweisen auf Kontakt.
function buildAffiliateBox() {
  return `
    <div class="affiliate-box neutral-box">
      <h4>Fragen zu Karten und Sammelstrategie?</h4>
      <p>
        <strong>Hinweis:</strong> Ich nutze selbst verschiedene Karten- und Punkteprogramme
        und teile hier nur meine persönliche Einordnung. Bei Fragen zu einer konkreten
        Karte oder zu Transferwegen kannst du mich über das
        <a href="/miles-planer/kontakt.html">Kontaktformular</a> erreichen.
        Ich gebe keine Finanz-, Steuer- oder Rechtsberatung und mache keine
        individuellen Produktempfehlungen.
      </p>
    </div>`;
}

function $(id) {
  return document.getElementById(id);
}

// Aktualisiert die Labels der Punkte-Felder dynamisch je nach ausgewähltem Programm
function updatePointsLabels() {
  const programm = $("programm")?.value;
  const cfg = PROGRAM_META[programm] || {};
  const labelBestand = $("labelBestandAktuell");
  const labelTransfer = $("labelTransferBestand");
  const labelBonus = $("labelGeplanterBonus");
  const labelRate = $("labelMonatlicheSammelrate");
  if (labelBestand) labelBestand.textContent = `Aktueller Bestand (${cfg.punktelabel || "Punkte"})`;
  if (labelTransfer) labelTransfer.textContent = `Transferfähiger Bestand (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  if (labelBonus) labelBonus.textContent = `Geplanter Bonus (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  if (labelRate) labelRate.textContent = `Monatliche Sammelrate (${cfg.transferquelle || "Transferpartner"} Punkte)`;
}

// setzt automatischen Schritt-Fortschritt bei Formular-Eingaben
function setStepActive(id, isActive) {
  const el = $(id);
  if (el) el.classList.toggle("active", isActive);
}

function updateFormFlow() {
  const ziel = $("ziel")?.value;
  const personen = $("personen")?.value;
  const klasse = $("reiseklasse")?.value;
  const zeit = $("reisezeit")?.value;
  const monat = $("reisemonat")?.value;
  const jahr = $("reisejahr")?.value;
  const programm = $("programm")?.value;
  setStepActive("step-ziel", true);
  setStepActive("step-personen", !!ziel);
  setStepActive("step-reiseklasse", !!ziel && !!personen);
  setStepActive("step-reisezeit", !!ziel && !!personen && !!klasse);
  setStepActive("step-reisemonat", !!ziel && !!personen && !!klasse && !!zeit);
  setStepActive("step-reisejahr", !!ziel && !!personen && !!klasse && !!zeit && !!monat);
  setStepActive("step-programm", !!ziel && !!personen && !!klasse && !!zeit && !!monat && !!jahr);
  setStepActive("step-punkte", !!ziel && !!personen && !!klasse && !!zeit && !!monat && !!jahr && !!programm);
  updatePointsLabels();
}

// Nach dem Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  updatePointsLabels();
  updateFormFlow();
  setupTracking(); // vorbereitetes Tracking
});

// Validierung: Pflichtfelder und Zahlenbereiche
function showValidationErrors(errors) {
  const errorBox = $("formErrors");
  if (!errorBox) return;
  const list = errors.map(e => `<li>${escapeHtml(e.message)}</li>`).join("");
  errorBox.innerHTML = `<strong>Bitte prüfen:</strong><ul>${list}</ul>`;
  errorBox.style.display = "block";
  // Felder markieren und fokussieren
  if (errors[0]) {
    const first = $(errors[0].field);
    if (first) first.focus({ preventScroll: false });
  }
}

function clearValidationUI() {
  const errorBox = $("formErrors");
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
  }
  ["ziel","personen","reiseklasse","reisezeit","reisemonat","reisejahr","programm",
   "bestandAktuell","transferBestand","geplanterBonus","monatlicheSammelrate",
   "kinder2_11","infants0_1"]
   .forEach(id => {
     const el = $(id);
     if (el) {
       el.classList.remove("field-invalid");
       el.removeAttribute("aria-invalid");
     }
   });
}

function validatePayload(payload) {
  const errors = [];
  // Pflichtfelder
  ["ziel","personen","reiseklasse","reisezeit","reisemonat","reisejahr","programm"]
    .forEach(fieldId => {
      if (!payload[fieldId]) {
        const el = $(fieldId);
        const name = el?.closest(".step-card")?.querySelector("h3")?.textContent || fieldId;
        errors.push({ field: fieldId, message: `Bitte ${name} auswählen.` });
      }
    });
  // Kinderregeln
  const ges = parseInt(payload.personen) || 0;
  const kinder = parseInt(payload.kinder2_11) || 0;
  const babies = parseInt(payload.infants0_1) || 0;
  if (kinder + babies > ges) {
    errors.push({ field: "kinder2_11", message: "Kinder + Babys dürfen zusammen nicht mehr als die Gesamtzahl sein." });
  }
  if ((kinder > 0 || babies > 0) && (ges - kinder - babies < 1)) {
    errors.push({ field: "personen", message: "Mindestens eine erwachsene Person muss mitreisen." });
  }
  // Zahlen-Felder: nur ≥ 0 erlaubt
  ["bestandAktuell","transferBestand","geplanterBonus","monatlicheSammelrate"]
    .forEach(id => {
      const n = parseFloat(payload[id]) || 0;
      if (n < 0) {
        errors.push({ field: id, message: `${$("label" + id)?.textContent || id} darf nicht negativ sein.` });
      }
    });
  return errors;
}

function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#039;");
}

// *** Ergebnisberechnung und Anzeige ***
async function berechneMilesPlaner() {
  clearValidationUI();
  const resultBox = $("result");
  if (!resultBox) {
    alert("Ergebnisbereich nicht gefunden.");
    return;
  }
  const payload = collectPayload();
  const errors = validatePayload(payload);
  if (errors.length) {
    showValidationErrors(errors);
    return;
  }
  // Button-Status
  const calcBtn = $("calcButton");
  if (calcBtn) {
    calcBtn.disabled = true;
    calcBtn.textContent = "Berechne…";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  resultBox.innerHTML = "<p>Berechne&hellip;</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("HTTP-Fehler " + response.status);
    const data = await response.json();
    if (data.status === "error") throw new Error(data.message || "Unbekannter Fehler");
    // Ampel und Kennzahlen zusammenbauen
    const scenarioKey = data.scenario || "realistisch";
    const chart = classifyAmpel(data.monate, payload);
    const fehlendValue = Number(data.fehlend || 0);

    resultBox.innerHTML = `
      <div class="result-card">
        <div class="decision-card decision-${escapeHtml(chart.key)}">
          <div class="decision-badge">${escapeHtml(chart.badge)} ${escapeHtml(chart.title)}</div>
          <p>${escapeHtml(chart.text)}</p>
        </div>
        <div class="result-section">
          <h3>Ihre Kennzahlen</h3>
          <div class="result-grid">
            <div class="result-item">
              <div class="label">Fehlende Punkte</div>
              <div class="value">${escapeHtml(data.fehlend || "—")} ${escapeHtml(PROGRAM_META[payload.programm]?.kurzlabel || "")}</div>
            </div>
            <div class="result-item">
              <div class="label">Sammelzeit</div>
              <div class="value">${escapeHtml(data.monate || "—")}</div>
            </div>
            <div class="result-item">
              <div class="label">Reise geplant</div>
              <div class="value">${escapeHtml(payload.reisemonat)} ${escapeHtml(payload.reisejahr)}</div>
            </div>
          </div>
        </div>
        <div class="result-section">
          <h3>Nächste Schritte</h3>
          <ul>
            <li>Erhöhe deine monatliche Sammelrate (mehr ausgeben oder Promotionen nutzen).</li>
            <li>Überprüfe Verfügbarkeiten: Flexibilität bei Datum oder Flughäfen erhöht Chancen.</li>
            <li>Bei weiteren Fragen nutze das obenstehende Kontaktformular.</li>
          </ul>
        </div>
        <!-- Hier keine Affiliate-Box, nur neutraler Hinweis -->
        ${buildAffiliateBox()}
      </div>
    `;
  } catch (error) {
    resultBox.innerHTML = `<div class="result-info-card"><strong>Fehler:</strong> ${escapeHtml(error.message)}</div>`;
    console.error(error);
  } finally {
    if (calcBtn) {
      calcBtn.disabled = false;
      calcBtn.textContent = "Jetzt berechnen";
    }
  }
}

// Hilfsfunktionen aus dem Original
function collectPayload() {
  return {
    ziel: $("ziel")?.value || "",
    personen: $("personen")?.value || "1",
    kinder2_11: $("kinder2_11")?.value || "0",
    infants0_1: $("infants0_1")?.value || "0",
    reiseklasse: $("reiseklasse")?.value || "",
    reisezeit: $("reisezeit")?.value || "",
    reisemonat: $("reisemonat")?.value || "",
    reisejahr: $("reisejahr")?.value || "",
    programm: $("programm")?.value || "",
    bestandAktuell: $("bestandAktuell")?.value || "0",
    transferBestand: $("transferBestand")?.value || "0",
    geplanterBonus: $("geplanterBonus")?.value || "0",
    monatlicheSammelrate: $("monatlicheSammelrate")?.value || "0",
    flexDays: $("flexDays")?.value || "0",
    altAirports: $("altAirports")?.checked ? "1" : "0",
    splitBooking: $("splitBooking")?.checked ? "1" : "0",
    szenario: $("szenario")?.value || "realistisch"
  };
}

function parseGermanMonth(monthName) {
  const map = {
    Januar: 0, Februar: 1, März: 2, April: 3, Mai: 4, Juni: 5,
    Juli: 6, August: 7, September: 8, Oktober: 9, November: 10, Dezember: 11
  };
  return map[String(monthName || "").trim()] ?? null;
}

function diffMonths(fromDate, toDate) {
  const y1 = fromDate.getFullYear(), m1 = fromDate.getMonth();
  const y2 = toDate.getFullYear(), m2 = toDate.getMonth();
  return (y2 - y1) * 12 + (m2 - m1);
}

function formatDurationMonths(months) {
  months = Math.max(0, Math.round(months));
  if (months === 0) return "0 Monate";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  let result = years ? `${years} Jahr${years>1?'e':''}` : "";
  if (rem) result += (result?" und ":"") + `${rem} Monat${rem>1?'e':''}`;
  return result;
}

function classifyAmpel(monate, payload) {
  // Wenn Reisedatum in Vergangenheit oder Daten fehlen
  const travelDate = $("reisejahr").value && $("reisemonat").value 
    ? new Date(parseInt($("reisejahr").value), parseGermanMonth($("reisemonat").value), 1)
    : null;
  const now = new Date();
  const monthsUntil = travelDate ? diffMonths(now, travelDate) : NaN;
  if (isNaN(monate) || isNaN(monthsUntil)) {
    return { key: "bad", badge: "🔴", title: "Unklares Ergebnis", text: "Bitte prüfe deine Eingaben." };
  }
  let key = "good", badge="🟢", title="Gut erreichbar",
      text="Dein Ziel ist zeitlich realistisch.";

  if (monthsUntil < 0) {
    key = "bad"; badge="🔴"; title="Reisedatum vorbei";
    text = "Das gewählte Reisedatum liegt in der Vergangenheit.";
  } else if (monate <= monthsUntil) {
    key = "good"; badge="🟢"; title="Gut erreichbar";
    text = "Dein Ziel ist zeitlich realistisch, vorausgesetzt Verfügbarkeiten passen.";
  } else if (monate <= monthsUntil + 3) {
    key = "medium"; badge="🟡"; title="Knapp erreichbar";
    text = "Dein Ziel ist knapp erreichbar – etwas Zusatz-Puffer oder Boost könnte helfen.";
  } else {
    key = "bad"; badge="🔴"; title="Schlecht erreichbar";
    text = "Mit den aktuellen Parametern ist dein Ziel wahrscheinlich nicht realistisch.";
  }
  return { key, badge, title, text };
}

// Tracking-Stubs (DSGVO: erst aktivieren, wenn Consent erteilt)
function trackEvent(eventName, data) {
  if (!window.gtag) return; // Beispiel: für Google Analytics
  try {
    window.gtag('event', eventName, data);
  } catch {}
}

// Berechnung starten bei Formular-Submit
const form = $("milesForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    berechneMilesPlaner();
    trackEvent("calculator_submit", { program: $("programm")?.value || "" });
  });
}
