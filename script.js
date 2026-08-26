const API_URL =
  "https://script.google.com/macros/s/AKfycbyfyZtqZyRrQlQWmTMK-IbKc7J4KCGK4A1huw2F9ZOVdSm7hw9mN3BVSYlRmDnF8o1h/exec";

const FALLBACK_PROGRAM_META = {
  "Miles & More": {
    punktelabel: "Miles & More Meilen",
    kurzlabel: "M&M",
    transferquelle: "PAYBACK",
    faktor: 1,
    transferRatioLabel: "PAYBACK Punkte → Miles & More (1:1)",
    transferMinimum: 200,
    transferDuration: "sofort bis wenige Tage",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "Avios": {
    punktelabel: "Avios",
    kurzlabel: "Avios",
    transferquelle: "Membership Rewards",
    faktor: 0.8,
    transferRatioLabel: "Membership Rewards → Avios (5:4)",
    transferMinimum: 1000,
    transferDuration: "bis zu 1 Werktag",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "Flying Blue": {
    punktelabel: "Flying Blue Meilen",
    kurzlabel: "Flying Blue",
    transferquelle: "Membership Rewards",
    faktor: 0.8,
    transferRatioLabel: "Membership Rewards → Flying Blue (5:4)",
    transferMinimum: 625,
    transferDuration: "bis zu 1 Werktag",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "KrisFlyer": {
    punktelabel: "KrisFlyer Meilen",
    kurzlabel: "KrisFlyer",
    transferquelle: "Membership Rewards",
    faktor: 0.6667,
    transferRatioLabel: "Membership Rewards → KrisFlyer (3:2)",
    transferMinimum: 1500,
    transferDuration: "bis zu 15 Werktage",
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  }
};

let PROGRAM_META = FALLBACK_PROGRAM_META;

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPoints(value) {
  const n = Number(String(value).replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n)) return String(value || "");
  return Math.round(n).toLocaleString("de-DE");
}

function formatEuro(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `${Math.round(n).toLocaleString("de-DE")} €`;
}

function extractNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function getProgramConfig(programm) {
  return PROGRAM_META[programm] || FALLBACK_PROGRAM_META[programm] || {
    punktelabel: "Punkte",
    kurzlabel: programm || "Programm",
    transferquelle: "Transferpartner",
    faktor: 1
  };
}

function buildAffiliateBox() {
  return `
    <div class="affiliate-box neutral-box">
      <h4>Fragen zu Karten und Sammelstrategie?</h4>
      <p>
        <strong>Hinweis:</strong> Ich nutze selbst verschiedene Karten- und Punkteprogramme.
        Wenn du Fragen zu einer konkreten Karte oder einer möglichen Freundschaftswerbung hast,
        kannst du mich über das
        <a href="/miles-planer/kontakt.html">Kontaktformular</a>
        kontaktieren. Ich gebe keine Finanzberatung und empfehle nur Produkte,
        die ich selbst sinnvoll einordnen kann.
      </p>
    </div>
  `;
}

function populateSelect(id, values, placeholder) {
  const select = $(id);
  if (!select) return;

  const oldValue = select.value;

  select.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.appendChild(placeholderOption);

  values.forEach((value) => {
    if (value === null || value === undefined || value === "") return;

    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    select.appendChild(option);
  });

  if (oldValue && values.map(String).includes(String(oldValue))) {
    select.value = oldValue;
  }
}

function fillFallbackDropdowns() {
  populateSelect(
    "ziel",
    ["Dubai", "Japan", "Malediven", "Südafrika", "Thailand", "USA East", "USA West"],
    "Bitte Ziel wählen"
  );

  populateSelect(
    "reiseklasse",
    ["Economy", "Premium Economy", "Business"],
    "Bitte Reiseklasse wählen"
  );

  populateSelect(
    "reisezeit",
    ["Nebensaison", "Hauptreisezeit", "Ferien"],
    "Bitte Reisezeit wählen"
  );

  populateSelect(
    "reisemonat",
    ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "Bitte Reisemonat wählen"
  );

  populateSelect(
    "programm",
    ["Miles & More", "Avios", "Flying Blue", "KrisFlyer"],
    "Bitte Programm wählen"
  );
}

async function ladeDropdowns() {
  fillFallbackDropdowns();

  try {
    const response = await fetch(`${API_URL}?action=options`, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Dropdown-API nicht erreichbar: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "Options-API meldet Fehler.");
    }

    PROGRAM_META = data.programMeta || FALLBACK_PROGRAM_META;

    populateSelect("ziel", data.ziele || [], "Bitte Ziel wählen");
    populateSelect("reiseklasse", data.klassen || [], "Bitte Reiseklasse wählen");
    populateSelect("reisezeit", data.reisezeiten || [], "Bitte Reisezeit wählen");
    populateSelect("reisemonat", data.monate || [], "Bitte Reisemonat wählen");
    populateSelect("programm", data.programme || [], "Bitte Programm wählen");

    console.log("Dropdowns geladen:", data);
  } catch (error) {
    console.error("Dropdown-Laden fehlgeschlagen. Fallback wird verwendet:", error);
  }

  updatePointsLabels();
  updateFormFlow();
}

function buildTransferInfo(cfg) {
  if (!cfg) return "";

  if (cfg.transferRatioLabel) {
    return cfg.transferRatioLabel;
  }

  const source = cfg.transferquelle || "Transferpartner";
  const target = cfg.kurzlabel || "Programm";

  if (cfg.faktor === 1) {
    return `${source} → ${target} 1:1`;
  }

  if (typeof cfg.faktor === "number") {
    return `${source} → ${target} (${String(cfg.faktor).replace(".", ",")})`;
  }

  return `${source} → ${target}`;
}

function updatePointsLabels() {
  const programm = $("programm")?.value;
  const cfg = getProgramConfig(programm);

  const labelBestand = $("labelBestandAktuell");
  const labelTransfer = $("labelTransferBestand");
  const labelBonus = $("labelGeplanterBonus");
  const labelRate = $("labelMonatlicheSammelrate");
  const pointsHelper = $("pointsHelper");
  const resultTransferHint = $("resultTransferHint");

  if (labelBestand) {
    labelBestand.textContent = `Aktueller Bestand (${cfg.punktelabel || "Punkte"})`;
  }

  if (labelTransfer) {
    labelTransfer.textContent = `Transferfähiger Bestand (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  if (labelBonus) {
    labelBonus.textContent = `Geplanter Bonus (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  if (labelRate) {
    labelRate.textContent = `Monatliche Sammelrate (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  const helperHtml = `
    <strong>Transferhinweis</strong>
    <p>${escapeHtml(buildTransferInfo(cfg))}</p>
    ${
      programm
        ? `<p>Der Rechner nutzt die aktuell hinterlegten Annahmen aus der Tabelle.</p>`
        : `<p>Wähle zuerst ein Programm aus, damit der passende Transferhinweis angezeigt wird.</p>`
    }
  `;

  if (pointsHelper) pointsHelper.innerHTML = helperHtml;
  if (resultTransferHint) resultTransferHint.innerHTML = helperHtml;
}

function setStepActive(id, isActive) {
  const el = $(id);
  if (!el) return;
  el.classList.toggle("active", isActive);
}

function updateFormFlow() {
  const ziel = $("ziel")?.value;
  const personen = $("personen")?.value;
  const reiseklasse = $("reiseklasse")?.value;
  const reisezeit = $("reisezeit")?.value;
  const reisemonat = $("reisemonat")?.value;
  const reisejahr = $("reisejahr")?.value;
  const programm = $("programm")?.value;

  setStepActive("step-ziel", true);
  setStepActive("step-personen", !!ziel);
  setStepActive("step-reiseklasse", !!ziel && !!personen);
  setStepActive("step-reisezeit", !!ziel && !!personen && !!reiseklasse);
  setStepActive("step-reisemonat", !!ziel && !!personen && !!reiseklasse && !!reisezeit);
  setStepActive("step-reisejahr", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat);
  setStepActive("step-programm", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat && !!reisejahr);
  setStepActive("step-punkte", !!ziel && !!personen && !!reiseklasse && !!reisezeit && !!reisemonat && !!reisejahr && !!programm);

  updatePointsLabels();
}

function clearValidationUI() {
  const errorBox = $("formErrors");

  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
  }

  [
    "ziel",
    "personen",
    "reiseklasse",
    "reisezeit",
    "reisemonat",
    "reisejahr",
    "programm",
    "bestandAktuell",
    "transferBestand",
    "geplanterBonus",
    "monatlicheSammelrate",
    "kinder2_11",
    "infants0_1"
  ].forEach((id) => {
    const el = $(id);
    if (!el) return;

    el.classList.remove("field-invalid");
    el.removeAttribute("aria-invalid");
  });
}

function showValidationErrors(errors) {
  const errorBox = $("formErrors");
  if (!errorBox) return;

  errorBox.innerHTML = `
    <strong>Bitte prüfen:</strong>
    <ul>
      ${errors.map((e) => `<li>${escapeHtml(e.message)}</li>`).join("")}
    </ul>
  `;

  errorBox.style.display = "block";

  errors.forEach((error) => {
    const el = $(error.field);
    if (!el) return;

    el.classList.add("field-invalid");
    el.setAttribute("aria-invalid", "true");
  });

  const first = errors[0]?.field ? $(errors[0].field) : null;
  if (first && typeof first.focus === "function") {
    first.focus({ preventScroll: false });
  }
}

function collectPayload() {
  return {
    ziel: $("ziel")?.value || "",
    personen: $("personen")?.value || "",
    kinder2_11: $("kinder2_11")?.value || "0",
    infants0_1: $("infants0_1")?.value || "0",
    programm: $("programm")?.value || "",
    reiseklasse: $("reiseklasse")?.value || "",
    reisezeit: $("reisezeit")?.value || "",
    reisemonat: $("reisemonat")?.value || "",
    reisejahr: $("reisejahr")?.value || "",
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

function validatePayload(payload) {
  const errors = [];

  [
    "ziel",
    "personen",
    "reiseklasse",
    "reisezeit",
    "reisemonat",
    "reisejahr",
    "programm"
  ].forEach((fieldId) => {
    if (!payload[fieldId]) {
      const el = $(fieldId);
      const label =
        el?.closest(".step-card")?.querySelector("h3")?.textContent || fieldId;

      errors.push({
        field: fieldId,
        message: `Bitte ${label} auswählen.`
      });
    }
  });

  const personen = Number(payload.personen || 0);
  const kinder = Number(payload.kinder2_11 || 0);
  const infants = Number(payload.infants0_1 || 0);

  if (kinder + infants > personen) {
    errors.push({
      field: "kinder2_11",
      message: "Kinder + Babys dürfen zusammen nicht mehr als die Gesamtzahl der Reisenden sein."
    });
  }

  if ((kinder > 0 || infants > 0) && personen - kinder - infants < 1) {
    errors.push({
      field: "personen",
      message: "Mindestens eine erwachsene Person muss mitreisen."
    });
  }

  [
    "bestandAktuell",
    "transferBestand",
    "geplanterBonus",
    "monatlicheSammelrate"
  ].forEach((fieldId) => {
    const n = extractNumber(payload[fieldId]);

    if (n < 0) {
      errors.push({
        field: fieldId,
        message: `${fieldId} darf nicht negativ sein.`
      });
    }
  });

  if (extractNumber(payload.monatlicheSammelrate) <= 0) {
    errors.push({
      field: "monatlicheSammelrate",
      message: "Bitte gib eine monatliche Sammelrate größer 0 ein."
    });
  }

  return errors;
}

function zeigeErgebnisView() {
  const inputView = $("inputView");
  const resultView = $("resultView");

  if (inputView) inputView.classList.remove("active");
  if (resultView) resultView.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function zurueckZuEingaben() {
  const inputView = $("inputView");
  const resultView = $("resultView");

  if (resultView) resultView.classList.remove("active");
  if (inputView) inputView.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function parseGermanMonth(monthName) {
  const map = {
    Januar: 0,
    Februar: 1,
    März: 2,
    April: 3,
    Mai: 4,
    Juni: 5,
    Juli: 6,
    August: 7,
    September: 8,
    Oktober: 9,
    November: 10,
    Dezember: 11
  };

  return map[String(monthName || "").trim()] ?? null;
}

function diffMonths(fromDate, toDate) {
  return (
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth())
  );
}

function classifyAmpel(monate, payload) {
  const monthIndex = parseGermanMonth(payload.reisemonat);
  const year = Number(payload.reisejahr);
  const travelDate =
    Number.isFinite(year) && monthIndex !== null
      ? new Date(year, monthIndex, 1)
      : null;

  const monthsToGoal = extractNumber(monate);
  const monthsUntilTravel = travelDate ? diffMonths(new Date(), travelDate) : NaN;

  if (!Number.isFinite(monthsToGoal) || !Number.isFinite(monthsUntilTravel)) {
    return {
      key: "bad",
      badge: "🔴",
      title: "Unklares Ergebnis",
      text: "Bitte prüfe deine Eingaben."
    };
  }

  if (monthsUntilTravel < 0) {
    return {
      key: "bad",
      badge: "🔴",
      title: "Reisedatum liegt zurück",
      text: "Das gewählte Reisedatum liegt in der Vergangenheit."
    };
  }

  if (monthsToGoal <= monthsUntilTravel) {
    return {
      key: "good",
      badge: "🟢",
      title: "Gut erreichbar",
      text: "Dein Ziel wirkt zeitlich realistisch. Die tatsächliche Verfügbarkeit bleibt der wichtigste Faktor."
    };
  }

  if (monthsToGoal <= monthsUntilTravel + 3) {
    return {
      key: "medium",
      badge: "🟡",
      title: "Knapp erreichbar",
      text: "Dein Ziel ist zeitlich knapp. Mehr Flexibilität oder ein Punkte-Boost können helfen."
    };
  }

  return {
    key: "bad",
    badge: "🔴",
    title: "Eher nicht erreichbar",
    text: "Mit den aktuellen Eingaben ist das Ziel bis zur Reise wahrscheinlich zu knapp."
  };
}

async function berechneMilesPlaner() {
  clearValidationUI();

  const resultBox = $("result");
  if (!resultBox) {
    alert("Ergebnisbereich nicht gefunden.");
    return;
  }

  const payload = collectPayload();
  const errors = validatePayload(payload);

  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  const calcButton = $("calcButton");
  if (calcButton) {
    calcButton.disabled = true;
    calcButton.textContent = "Berechne…";
  }

  zeigeErgebnisView();
  resultBox.innerHTML = "<p>Berechne…</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Unbekannter Fehler aus Apps Script.");
    }

    const cfg = getProgramConfig(payload.programm);
    const chart = classifyAmpel(data.monate, payload);

    resultBox.innerHTML = `
      <div class="result-card">
        <div class="decision-card decision-card-${escapeHtml(chart.key)}">
          <div class="decision-badge">
            ${escapeHtml(chart.badge)} ${escapeHtml(chart.title)}
          </div>
          <h3 class="decision-title">${escapeHtml(chart.text)}</h3>
          <p class="decision-text">
            Ziel: <strong>${escapeHtml(payload.ziel)}</strong> ·
            Klasse: <strong>${escapeHtml(payload.reiseklasse)}</strong> ·
            Reisende: <strong>${escapeHtml(payload.personen)}</strong>
          </p>
        </div>

        <div class="result-section">
          <h3>Deine Kennzahlen</h3>

          <div class="result-grid">
            <div class="result-item">
              <div class="label">Bestand heute</div>
              <div class="value">${escapeHtml(data.bestand || "—")}</div>
            </div>

            <div class="result-item">
              <div class="label">Zielbedarf</div>
              <div class="value">${escapeHtml(data.zielbedarf || "—")} ${escapeHtml(cfg.kurzlabel || "")}</div>
            </div>

            <div class="result-item">
              <div class="label">Fehlende Punkte</div>
              <div class="value">${escapeHtml(data.fehlend || "—")} ${escapeHtml(cfg.kurzlabel || "")}</div>
            </div>

            <div class="result-item">
              <div class="label">Sammelzeit</div>
              <div class="value">${escapeHtml(data.monate || "—")} Monate</div>
            </div>

            <div class="result-item">
              <div class="label">Ziel erreicht ca.</div>
              <div class="value">${escapeHtml(data.zielErreicht || "—")}</div>
            </div>

            <div class="result-item">
              <div class="label">Geplante Reise</div>
              <div class="value">${escapeHtml(data.reise || `${payload.reisemonat} ${payload.reisejahr}`)}</div>
            </div>
          </div>
        </div>

        <div class="result-section deal-section">
          <h3>Deal & Kosten</h3>

          <div class="result-grid deal-grid">
            <div class="result-item">
              <div class="label">Cashpreis gesamt</div>
              <div class="value">${formatEuro(data.cash_total)}</div>
            </div>

            <div class="result-item">
              <div class="label">Award-Zuzahlung gesamt</div>
              <div class="value">${formatEuro(data.award_total)}</div>
            </div>

            <div class="result-item">
              <div class="label">Ersparnis gesamt</div>
              <div class="value">${formatEuro(data.savings_total)}</div>
            </div>

            <div class="result-item">
              <div class="label">Wert pro Meile</div>
              <div class="value">${escapeHtml(data.cpm || "—")}</div>
              <div class="value-note">${escapeHtml(data.deal || "")}</div>
            </div>
          </div>
        </div>

        <div class="result-section">
          <h3>Nächste Schritte</h3>
          <ul>
            <li>Prüfe, ob dein Reisezeitraum flexibel genug ist.</li>
            <li>Vergleiche alternative Programme, falls der Meilenbedarf stark abweicht.</li>
            <li>Nutze Aktionen und planbare Sammelwege, statt spontan Meilen zu kaufen.</li>
          </ul>
        </div>

        ${buildAffiliateBox()}
      </div>
    `;

    updatePointsLabels();
  } catch (error) {
    resultBox.innerHTML = `
      <div class="result-info-card">
        <strong>Fehler:</strong>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
    console.error(error);
  } finally {
    if (calcButton) {
      calcButton.disabled = false;
      calcButton.textContent = "Jetzt berechnen";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const watchedFields = [
    "ziel",
    "personen",
    "reiseklasse",
    "reisezeit",
    "reisemonat",
    "reisejahr",
    "programm",
    "szenario"
  ];

  watchedFields.forEach((id) => {
    const el = $(id);
    if (!el) return;

    el.addEventListener("change", updateFormFlow);
    el.addEventListener("input", updateFormFlow);
  });

  const form = $("milesForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      berechneMilesPlaner();
    });
  } else {
    console.error("Formular #milesForm wurde nicht gefunden.");
  }

  updatePointsLabels();
  updateFormFlow();
  ladeDropdowns();
});
