const API_URL =
  "https://script.google.com/macros/s/AKfycbyUYB1eWHphJIvw5ReSgZflvPjCWXlxNrk_WcprVOv8PFoq_CvvKoxijAu8hR3iAu_s/exec";

let PROGRAM_META = {};

const FALLBACK_PROGRAM_META = {
  "Miles & More": {
    punktelabel: "Miles & More Meilen",
    kurzlabel: "M&M",
    transferquelle: "PAYBACK",
    faktor: 1,
    transferBonusPct: { konservativ: 0, realistisch: 20, best: 30 },
    childDiscountPct: 25,
    infantDiscountPct: 90
  },
  "Avios": {
    punktelabel: "Avios",
    kurzlabel: "Avios",
    transferquelle: "Membership Rewards",
    faktor: 0.8,
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "Flying Blue": {
    punktelabel: "Flying Blue Meilen",
    kurzlabel: "Flying Blue",
    transferquelle: "Membership Rewards",
    faktor: 0.8,
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  },
  "KrisFlyer": {
    punktelabel: "KrisFlyer Meilen",
    kurzlabel: "KrisFlyer",
    transferquelle: "Membership Rewards",
    faktor: 0.6667,
    transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
  }
};

const AFFILIATE_CONFIG = {
  "Miles & More": {
    sourceLabel: "PAYBACK Punkte",
    headline: "Schneller zur Miles & More Einlösung",
    text: "Wenn die Lücke groß ist, kann ein einmaliger Bonus den Zeitplan verkürzen.",
    offers: [
      {
        title: "PAYBACK-geeignete Kreditkarte (Beispiel)",
        subtitle: "Bonus-Punkte können deine Sammelzeit verkürzen",
        bonus: 5000,
        url: "#",
        isExample: true
      }
    ]
  },
  "Avios": {
    sourceLabel: "Membership Rewards Punkte",
    headline: "Avios schneller aufbauen",
    text: "Ein Bonus kann deine Lücke deutlich reduzieren.",
    offers: [
      { title: "Kreditkarten-Bonus (Beispiel)", subtitle: "Bonus variiert – Details prüfen", bonus: 50000, url: "#", isExample: true }
    ]
  },
  "Flying Blue": {
    sourceLabel: "Membership Rewards Punkte",
    headline: "Flying Blue schneller aufbauen",
    text: "Ein Bonus kann deine Lücke deutlich reduzieren.",
    offers: [
      { title: "Kreditkarten-Bonus (Beispiel)", subtitle: "Bonus variiert – Details prüfen", bonus: 50000, url: "#", isExample: true }
    ]
  },
  "KrisFlyer": {
    sourceLabel: "Membership Rewards Punkte",
    headline: "KrisFlyer schneller aufbauen",
    text: "Ein Bonus kann deine Lücke deutlich reduzieren.",
    offers: [
      { title: "Kreditkarten-Bonus (Beispiel)", subtitle: "Bonus variiert – Details prüfen", bonus: 50000, url: "#", isExample: true }
    ]
  }
};

function $(id) {
  return document.getElementById(id);
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractNumber(text) {
  if (text === null || text === undefined) return NaN;
  if (typeof text === "number") return text;
  const cleaned = String(text)
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(cleaned);
}

function clampInt(value, min = 0, max = 999999999) {
  const n = Math.floor(Number(value));
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function formatEuro(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `${Math.round(n).toLocaleString("de-DE")} €`;
}

function formatPoints(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return Math.round(n).toLocaleString("de-DE");
}

function formatDurationMonths(value) {
  const months = Math.max(0, Math.round(Number(value)));
  if (!Number.isFinite(months) || months === 0) return "";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} Monat${remainingMonths === 1 ? "" : "e"}`;
  }
  if (remainingMonths === 0) {
    return `${years} Jahr${years === 1 ? "" : "e"}`;
  }
  return `${years} Jahr${years === 1 ? "" : "e"} und ${remainingMonths} Monat${remainingMonths === 1 ? "" : "e"}`;
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
  const select = $(id);
  if (!select) return;

  const currentValue = select.value;
  select.innerHTML = "";

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = placeholder;
  select.appendChild(firstOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });

  if (currentValue && values.includes(currentValue)) {
    select.value = currentValue;
  } else {
    select.value = "";
  }
}

function fillFallbackDropdowns() {
  PROGRAM_META = FALLBACK_PROGRAM_META;

  populateSelect("ziel", ["Dubai", "Japan", "Malediven", "Südafrika", "Thailand", "USA East", "USA West"], "Bitte Ziel wählen");
  populateSelect("reiseklasse", ["Economy", "Premium Economy", "Business"], "Bitte Reiseklasse wählen");
  populateSelect("reisezeit", ["Nebensaison", "Hauptreisezeit", "Ferien"], "Bitte Reisezeit wählen");
  populateSelect("reisemonat", ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"], "Bitte Reisemonat wählen");
  populateSelect("programm", ["Miles & More", "Avios", "Flying Blue", "KrisFlyer"], "Bitte Programm wählen");
}

function getProgramConfig(programm) {
  return (
    PROGRAM_META[programm] ||
    FALLBACK_PROGRAM_META[programm] || {
      punktelabel: "Meilen / Punkte",
      kurzlabel: programm || "Programm",
      transferquelle: "Transferpartner",
      faktor: null,
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 }
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
        text: "Dieses Szenario zeigt, wie dein Ziel erreichbar wäre, wenn Aktionen/Bonus & Rahmenbedingungen gut laufen."
      };
    case "konservativ":
      return {
        label: "Konservativ",
        badgeClass: "scenario-badge-konservativ",
        headline: "Vorsichtige Planung",
        text: "Dieses Szenario rechnet defensiv (mehr Puffer, weniger Bonusannahmen)."
      };
    case "realistisch":
    default:
      return {
        label: "Realistisch",
        badgeClass: "scenario-badge-realistisch",
        headline: "Solide Planung",
        text: "Standardwert für die meisten Nutzer: realistische mittlere Annahme."
      };
  }
}

function getAssumedTransferBonusPct(cfg, scenarioKey) {
  const map = cfg?.transferBonusPct || {};
  if (scenarioKey === "best") return Number(map.best || 0);
  if (scenarioKey === "konservativ") return Number(map.konservativ || 0);
  return Number(map.realistisch || 0);
}

function buildTransferInfo(cfg, scenarioKey) {
  if (!cfg) return "";
  const source = cfg.transferquelle || "Transferpartner";
  const target = cfg.kurzlabel || "Programm";
  const faktor = cfg.faktor;
  const bonusPct = getAssumedTransferBonusPct(cfg, scenarioKey);
  if (faktor === 1) {
    return bonusPct > 0
      ? `Transfer: ${source} → ${target} 1:1 (Annahme: +${bonusPct}% Bonus im Szenario)`
      : `Transfer: ${source} → ${target} 1:1`;
  }
  if (typeof faktor === "number" && !Number.isNaN(faktor)) {
    return bonusPct > 0
      ? `Transfer: ${source} → ${target} (${String(faktor).replace(".", ",")}) (Annahme: +${bonusPct}%)`
      : `Transfer: ${source} → ${target} (${String(faktor).replace(".", ",")})`;
  }
  return `Transfer: ${source} → ${target}`;
}

function updatePointsLabels() {
  const programm = $("programm")?.value;
  const scenarioKey = $("szenario")?.value || "realistisch";
  const cfg = getProgramConfig(programm);

  const labelBestandAktuell = $("labelBestandAktuell");
  const labelTransferBestand = $("labelTransferBestand");
  const labelGeplanterBonus = $("labelGeplanterBonus");
  const labelMonatlicheSammelrate = $("labelMonatlicheSammelrate");
  const pointsHelper = $("pointsHelper");
  const resultTransferHint = $("resultTransferHint");

  if (labelBestandAktuell) {
    labelBestandAktuell.textContent = `Aktueller Bestand (${cfg.punktelabel || "Meilen / Punkte"})`;
  }
  if (labelTransferBestand) {
    labelTransferBestand.textContent = `Transferfähiger Bestand (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }
  if (labelGeplanterBonus) {
    labelGeplanterBonus.textContent = `Geplanter Bonus (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }
  if (labelMonatlicheSammelrate) {
    labelMonatlicheSammelrate.textContent = `Monatliche Sammelrate (${cfg.transferquelle || "Transferpartner"} Punkte)`;
  }

  let helperHtml = `
    <strong>Transferhinweis</strong>
    <p>${escapeHtml(buildTransferInfo(cfg, scenarioKey))}</p>
  `;
  if (programm === "Miles & More") {
    helperHtml += `
      <p><strong>Offiziell:</strong> PAYBACK → Miles & More erfolgt 1:1.</p>
      <p><strong>Praxis:</strong> Es gibt gelegentlich Aktionen/Transferboni. Szenario kann das als Annahme abbilden.</p>
    `;
  } else if (programm) {
    helperHtml += `
      <p>Der Rechner nutzt das hinterlegte Standard-Transferverhältnis des Programms.</p>
    `;
  } else {
    helperHtml += `
      <p>Wähle zuerst ein Programm aus, damit der passende Transferhinweis angezeigt wird.</p>
    `;
  }

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

async function ladeDropdowns() {
  try {
    const response = await fetch(`${API_URL}?action=options`, { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error(`Dropdowns konnten nicht geladen werden (${response.status})`);

    const data = await response.json();
    if (data.status !== "ok") throw new Error(data.message || "Fehler beim Laden der Dropdown-Werte.");

    PROGRAM_META = data.programMeta || FALLBACK_PROGRAM_META;
    populateSelect("ziel", data.ziele || [], "Bitte Ziel wählen");
    populateSelect("reiseklasse", data.klassen || [], "Bitte Reiseklasse wählen");
    populateSelect("reisezeit", data.reisezeiten || [], "Bitte Reisezeit wählen");
    populateSelect("reisemonat", data.monate || [], "Bitte Reisemonat wählen");
    populateSelect("programm", data.programme || [], "Bitte Programm wählen");
  } catch (error) {
    console.error("Dropdown-API fehlgeschlagen, Fallback bleibt aktiv:", error);
  }

  updateFormFlow();
}

function clearValidationUI() {
  const errorBox = $("formErrors");
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
  }
  const ids = ["ziel","personen","reiseklasse","reisezeit","reisemonat","reisejahr","programm","bestandAktuell","transferBestand","geplanterBonus","monatlicheSammelrate","kinder2_11","infants0_1"];
  ids.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.classList.remove("field-invalid");
    el.removeAttribute("aria-invalid");
  });
}

function showValidationErrors(errors) {
  const errorBox = $("formErrors");
  if (!errorBox) return;
  const list = errors.map(e => `<li>${escapeHtml(e.message)}</li>`).join("");
  errorBox.innerHTML = `
    <strong>Bitte prüfe deine Eingaben:</strong>
    <ul>${list}</ul>
  `;
  errorBox.style.display = "block";
  errors.forEach((e) => {
    const el = $(e.field);
    if (!el) return;
    el.classList.add("field-invalid");
    el.setAttribute("aria-invalid", "true");
  });
  const first = errors[0]?.field ? $(errors[0].field) : null;
  if (first && typeof first.focus === "function") first.focus({ preventScroll: false });
}

function collectPayload() {
  const scenarioValue = $("szenario")?.value || "realistisch";
  const personen = clampInt($("personen")?.value, 1, 8);
  const kinder = clampInt($("kinder2_11")?.value, 0, 8);
  const infants = clampInt($("infants0_1")?.value, 0, 8);
  return {
    szenario: scenarioValue,
    ziel: $("ziel")?.value,
    personen: String(personen),
    kinder2_11: String(kinder),
    infants0_1: String(infants),
    programm: $("programm")?.value,
    reiseklasse: $("reiseklasse")?.value,
    reisezeit: $("reisezeit")?.value,
    reisejahr: $("reisejahr")?.value,
    reisemonat: $("reisemonat")?.value,
    bestandAktuell: $("bestandAktuell")?.value,
    transferBestand: $("transferBestand")?.value,
    geplanterBonus: $("geplanterBonus")?.value,
    monatlicheSammelrate: $("monatlicheSammelrate")?.value,
    flexDays: $("flexDays")?.value || "0",
    altAirports: $("altAirports")?.checked ? "1" : "0",
    splitBooking: $("splitBooking")?.checked ? "1" : "0"
  };
}

function validatePayload(payload) {
  const errors = [];
  const requiredFields = ["ziel","personen","reiseklasse","reisezeit","reisemonat","reisejahr","programm"];
  requiredFields.forEach((fieldId) => {
    const el = $(fieldId);
    const value = payload[fieldId];
    if (!value) {
      errors.push({ field: fieldId, message: `Bitte wähle ${el?.closest(".step-card")?.querySelector("h3")?.textContent || fieldId}.` });
    }
  });
  const personen = clampInt(payload.personen, 1, 8);
  const kinder = clampInt(payload.kinder2_11, 0, 8);
  const infants = clampInt(payload.infants0_1, 0, 8);
  if (kinder + infants > personen) {
    errors.push({ field: "kinder2_11", message: "Kinder + Babys dürfen zusammen nicht mehr als die Anzahl Reisende sein." });
  }
  const adults = Math.max(0, personen - kinder - infants);
  if ((kinder > 0 || infants > 0) && adults < 1) {
    errors.push({ field: "personen", message: "Wenn Kinder/Babys mitreisen, muss mindestens 1 Erwachsener dabei sein." });
  }
  const numericChecks = [
    { id: "bestandAktuell", label: "Aktueller Bestand" },
    { id: "transferBestand", label: "Transferfähiger Bestand" },
    { id: "geplanterBonus", label: "Geplanter Bonus" }
  ];
  numericChecks.forEach(({ id, label }) => {
    const n = extractNumber(payload[id]);
    if (!Number.isNaN(n) && n < 0) {
      errors.push({ field: id, message: `${label} darf nicht negativ sein.` });
    }
  });
  const monthly = extractNumber(payload.monatlicheSammelrate);
  if (Number.isNaN(monthly) || monthly <= 0) {
    errors.push({ field: "monatlicheSammelrate", message: "Bitte gib eine monatliche Sammelrate größer 0 ein." });
  }
  return errors;
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

function classifyAmpel({ monthsToGoal, monthsUntilTravel, seatsNeeded, travelTime, flexDays, splitBooking }) {
  if (!Number.isFinite(monthsToGoal) || monthsToGoal < 0) 
    return { key: "bad", badge: "🔴", title: "Aktuell nicht berechenbar", text: "Bitte prüfe deine Eingaben." };
  let key = "good";
  if (monthsToGoal <= monthsUntilTravel) key = "good";
  else if (monthsToGoal <= monthsUntilTravel + 3) key = "medium";
  else key = "bad";
  const isHighDemand = String(travelTime || "").toLowerCase().includes("ferien");
  const isFixed = Number(flexDays) === 0;
  const manySeats = Number(seatsNeeded) >= 4;
  if (manySeats && isHighDemand && isFixed && !splitBooking) {
    if (key === "good") key = "medium";
    else if (key === "medium") key = "bad";
  }
  if (key === "good") return { key, badge: "🟢", title: "Gut erreichbar", text: "Zeitlich wirkt dein Ziel realistisch." };
  if (key === "medium") return { key, badge: "🟡", title: "Knapp erreichbar", text: "Zeitlich möglich, aber mit Risiko." };
  return { key, badge: "🔴", title: "Eher nicht erreichbar", text: "Dein Ziel ist vermutlich zu knapp, um es sicher zu erreichen." };
}

function buildAffiliateBox(programmName, fehlendTarget, progressPercent, cfg, scenarioKey) {
  const aff = AFFILIATE_CONFIG[programmName] || null;
  if (!aff) return "";
  if (!Number.isFinite(fehlendTarget) || fehlendTarget <= 0) return "";

  const transferBonusPct = getAssumedTransferBonusPct(cfg, scenarioKey);
  const baseFactor = (typeof cfg?.faktor === "number" && Number.isFinite(cfg.faktor)) ? cfg.faktor : 1;
  const effectiveFactor = baseFactor * (1 + (transferBonusPct / 100));

  const cardsHtml = (aff.offers || []).map((offer) => {
    const bonusSource = Number(offer.bonus || 0);
    const bonusInTarget = bonusSource * effectiveFactor;
    const coverage = Math.min(100, Math.round((bonusInTarget / fehlendTarget) * 100));

    const partnerLabel = offer.url && offer.url !== "#" ? "Partnerlink*" : "Hinweis";
    const rel = offer.url && offer.url !== "#"
      ? 'rel="nofollow sponsored noopener noreferrer"'
      : 'rel="nofollow noopener noreferrer"';

    return `
      <a href="${escapeHtml(offer.url || "#")}" class="affiliate-card" target="_blank" ${rel}>
        <strong>${escapeHtml(offer.title)}</strong><br>
        <span>${escapeHtml(offer.subtitle)}</span>
        <div class="affiliate-meta">
          ${partnerLabel}<br>
          Bonus: ca. ${escapeHtml(formatPoints(bonusSource))} ${escapeHtml(aff.sourceLabel)}
          ${
            coverage > 0
              ? `<br><span class="affiliate-coverage">entspricht ca. ${coverage}% deiner aktuellen Lücke</span>`
              : ""
          }
        </div>
      </a>
    `;
  }).join("");

  let urgencyText = "";
  if (Number.isFinite(progressPercent)) {
    if (progressPercent < 35) urgencyText = "Bei großer Lücke kann ein einmaliger Bonus viel bewirken.";
    else if (progressPercent < 70) urgencyText = "Du bist schon weit – ein Bonus bringt dich deutlich näher ans Ziel.";
    else urgencyText = "Deine Restlücke ist klein – ein Bonus kann sie komplett schließen.";
  }

  return `
    <div class="affiliate-box">
      <h4>${escapeHtml(aff.headline)}</h4>
      <p>${escapeHtml(aff.text)}</p>
      ${urgencyText ? `<p class="affiliate-urgency">${escapeHtml(urgencyText)}</p>` : ""}
      <div class="affiliate-links">
        ${cardsHtml}
      </div>
      <p class="footer-text" style="margin-top:10px;">
        * Partnerlink: Wenn du über einen mit * markierten Link abschließt/kaufst, erhalten wir ggf. Provision. Für dich entstehen keine Mehrkosten.
      </p>
    </div>
  `;
}

async function berechneMilesPlaner() {
  clearValidationUI();
  const resultBox = $("result");
  if (!resultBox) return;

  const payload = collectPayload();
  const errors = validatePayload(payload);
  if (errors.length > 0) { showValidationErrors(errors); return; }

  const calcBtn = $("calcButton");
  if (calcBtn) { calcBtn.disabled = true; calcBtn.textContent = "Berechne…"; }

  zeigeErgebnisView();
  resultBox.innerHTML = "<p>Berechne…</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("HTTP-Fehler: " + response.status);

    const data = await response.json();
    if (data.status === "error") throw new Error(data.message || "Unbekannter Fehler aus Apps Script");

    const programmName = payload.programm || "Programm";
    const cfg = getProgramConfig(programmName);
    const scenarioKey = data.scenario || payload.szenario || "realistisch";
    const scenarioLabel = data.scenarioLabel || getScenarioLabel(scenarioKey);
    const scenarioMeta = getScenarioMeta(scenarioKey);

    const personen = clampInt(payload.personen, 1, 8);
    const infants = clampInt(payload.infants0_1, 0, 8);
    const seatsNeeded = Math.max(1, personen - infants);
    const fehlendValue = extractNumber(data.fehlend);
    const monateValue = extractNumber(data.monate);

    const year = clampInt(payload.reisejahr, 2026, 2100);
    const monthIndex = parseGermanMonth(payload.reisemonat);
    const travelDate = (monthIndex === null) ? null : new Date(year, monthIndex, 1);
    const now = new Date();
    const monthsUntilTravel = travelDate ? diffMonths(now, travelDate) : NaN;
    const flexDays = clampInt(payload.flexDays, 0, 99);
    const splitBooking = payload.splitBooking === "1";
    const travelTime = payload.reisezeit;

    const ampel = classifyAmpel({
      monthsToGoal: monateValue,
      monthsUntilTravel,
      seatsNeeded,
      travelTime,
      flexDays,
      splitBooking
    });

    const affiliateBoxHtml = buildAffiliateBox(programmName, fehlendValue, extractNumber(data.progressBonus), cfg, scenarioKey);

    const planCards = `
      <div class="result-section">
        <h3>Nächste Schritte</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="label">Sammelrate erhöhen</div>
            <div class="value value-small">Mehr Punkte pro Monat verkürzt die Lücke.</div>
            <div class="value-note"><a href="/miles-planer/meilen-sammeln/">Zum Sammel-Guide</a></div>
          </div>
          <div class="result-item">
            <div class="label">Einmaliger Boost</div>
            <div class="value value-small">Starke Aktionen/Boni können die Lücke stark verkleinern.</div>
            <div class="value-note">Siehe Empfehlungen unten.</div>
          </div>
          <div class="result-item">
            <div class="label">Verfügbarkeit</div>
            <div class="value value-small">Für ${escapeHtml(String(seatsNeeded))} Plätze ist Flexibilität oft der Schlüssel.</div>
            <div class="value-note"><a href="/miles-planer/meilen-business-class/">Tipps zur Buchbarkeit</a></div>
          </div>
        </div>
      </div>`;

    resultBox.innerHTML = `
      <div class="tool-card scenario-box">
        <div class="result-section">
          <div class="label">Szenario</div>
          <span class="scenario-badge ${escapeHtml(scenarioMeta.badgeClass)}">${escapeHtml(scenarioLabel)}</span>
          <div class="scenario-headline">${escapeHtml(scenarioMeta.headline)}</div>
          <div class="value-note">${escapeHtml(scenarioMeta.text)}</div>
        </div>
      </div>

      <div class="decision-card decision-card-${escapeHtml(ampel.key)}">
        <div class="decision-badge">${escapeHtml(ampel.badge)} ${escapeHtml(ampel.title)}</div>
        <h3 class="decision-title">${escapeHtml(ampel.text)}</h3>
        <p class="decision-text">
          Ziel: <strong>${escapeHtml(payload.ziel)}</strong> · Klasse: <strong>${escapeHtml(payload.reiseklasse)}</strong> · Reisende: <strong>${escapeHtml(payload.personen)}</strong>
        </p>

        <div class="decision-mini-grid">
          <div class="decision-mini-item">
            <span class="label">Fehlende Punkte</span>
            <strong>${escapeHtml(!Number.isNaN(fehlendValue) ? `${formatPoints(fehlendValue)} ${programmName}` : (data.fehlend||"—"))}</strong>
          </div>
          <div class="decision-mini-item">
            <span class="label">Sammeldauer</span>
            <strong>${escapeHtml(formatDurationMonths(monateValue) || data.monate||"—")}</strong>
          </div>
          <div class="decision-mini-item">
            <span class="label">Reise geplant</span>
            <strong>${escapeHtml(data.reise || `${payload.reisemonat} ${payload.reisejahr}`)}</strong>
          </div>
        </div>
      </div>

      ${planCards}

      <div class="result-section">
        <h3>Deine Kennzahlen</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="label">Bestand heute</div>
            <div class="value">${escapeHtml(data.bestand||"—")}</div>
          </div>
          <div class="result-item">
            <div class="label">Zielbedarf</div>
            <div class="value">${escapeHtml(data.zielbedarf||"—")}</div>
          </div>
          <div class="result-item">
            <div class="label">Ziel erreicht ca.</div>
            <div class="value value-small">${escapeHtml(data.zielErreicht||"—")}</div>
          </div>
          <div class="result-item">
            <div class="label">Gesamtersparnis</div>
            <div class="value value-small"><span id="ersparnis">—</span> €</div>
          </div>
        </div>
      </div>

      ${affiliateBoxHtml}

      <div class="result-section">
        <h3>Deal &amp; Kosten</h3>
        <div class="value-note">
          Steuern/Gebühren können beim Award-Flug extra anfallen.
        </div>
        <div class="result-grid">
          <div class="result-item">
            <div class="label">Deal</div>
            <div class="value">${escapeHtml(data.deal || "—")}</div>
          </div>
          <div class="result-item">
            <div class="label">Award-Zuzahlung</div>
            <div class="value">${escapeHtml(data.taxes || "—")}</div>
          </div>
          <div class="result-item">
            <div class="label">Cashpreis</div>
            <div class="value">${escapeHtml(data.cash || "—")}</div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <h3>Annahmen &amp; Hinweise</h3>
        <div class="result-info-card">
          <strong>Familienregeln</strong>
          <p>Wenn du Kinder/Babys angegeben hast, gelten je nach Programm besondere Regeln. Prüfe die offiziellen Bedingungen.</p>
        </div>
        <div class="result-info-card">
          <strong>Verfügbarkeit</strong>
          <p>Insbesondere bei Ferien und mehreren Plätzen ist Verfügbarkeit der Engpass. Flexibilität (Datum/Flughafen/Split) erhöht die Chancen.</p>
        </div>
      </div>
    `;

    $("bestand").textContent = data.bestand || "—";
    $("zielbedarf").textContent = data.zielbedarf || "—";
    $("zielErreicht").textContent = data.zielErreicht || "—";
    const ersMatch = data.cash.match(/Ersparnis\s*~\s*([0-9\.\,]+)/);
    $("ersparnis").textContent = ersMatch ? ersMatch[1] : "—";
    $("ersparnis").textContent += " €";

    updatePointsLabels();
  } catch (error) {
    resultBox.innerHTML = `
      <div class="result-info-card">
        <strong>Fehler: ${escapeHtml(error.message)}</strong>
        <p>Bitte prüfe die Apps-Script-Web-App und die Sheet-Verknüpfung.</p>
      </div>`;
    console.error(error);
  } finally {
    if (calcBtn) {
      calcBtn.disabled = false;
      calcBtn.textContent = "Jetzt berechnen";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillFallbackDropdowns();
  ["ziel","personen","reiseklasse","reisezeit","reisemonat","reisejahr","programm","szenario"].forEach((id) => {
    const el = $(id);
    if (el) {
      el.addEventListener("change", updateFormFlow);
      el.addEventListener("input", updateFormFlow);
    }
  });
  const clearOnEdit = ["bestandAktuell","transferBestand","geplanterBonus","monatlicheSammelrate","kinder2_11","infants0_1"];
  clearOnEdit.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", () => el.classList.remove("field-invalid"));
  });
  const programm = $("programm");
  if (programm) programm.addEventListener("change", updatePointsLabels);

  const form = $("milesForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      berechneMilesPlaner();
    });
  }

  updatePointsLabels();
  updateFormFlow();
  ladeDropdowns();
});
