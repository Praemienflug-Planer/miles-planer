(() => {
  const params = new URLSearchParams(window.location.search);
  const relevantKeys = ["ziel", "klasse", "programm", "erwachsene", "kinder", "reisezeit", "quelle"];
  if (!relevantKeys.some((key) => params.has(key))) return;

  const sourceCopy = {
    "thailand": "Du kommst aus dem Thailand-Beispiel. Thailand sowie 2 Erwachsene und 2 Kinder können bereits vorausgefüllt sein.",
    "new-york": "Du kommst aus dem New-York-Beispiel. USA East sowie 2 Erwachsene und 2 Kinder können bereits vorausgefüllt sein.",
    "business-class": "Du kommst aus dem Business-Class-Guide. Business Class kann bereits vorausgewählt sein.",
    "vergleich": "Du kommst aus dem Vergleich Premium Economy vs. Business Class. Rechne beide Klassen am besten nacheinander mit denselben übrigen Werten.",
    "vergleich-pe": "Du kommst aus dem Vergleich. Premium Economy kann bereits vorausgewählt sein.",
    "vergleich-bc": "Du kommst aus dem Vergleich. Business Class kann bereits vorausgewählt sein."
  };

  const aliases = {
    ziel: {
      thailand: "Thailand",
      "usa-east": "USA East",
      "usa east": "USA East",
      newyork: "USA East",
      "new-york": "USA East"
    },
    klasse: {
      business: "Business",
      "business class": "Business",
      "premium-economy": "Premium Economy",
      "premium economy": "Premium Economy",
      premium: "Premium Economy"
    },
    programm: {
      "miles-and-more": "Miles & More",
      "miles & more": "Miles & More",
      "flying-blue": "Flying Blue",
      "flying blue": "Flying Blue",
      avios: "Avios",
      krisflyer: "KrisFlyer",
      emirates: "Emirates Skywards",
      "emirates skywards": "Emirates Skywards"
    },
    reisezeit: {
      ferien: "Ferien",
      hauptreisezeit: "Hauptreisezeit",
      nebensaion: "Nebensaison",
      nebensaison: "Nebensaison"
    }
  };

  const byId = (id) => document.getElementById(id);
  const normalize = (value) => String(value || "").trim().toLowerCase();

  function mappedValue(key) {
    const raw = params.get(key);
    if (!raw) return "";
    return aliases[key]?.[normalize(raw)] || raw;
  }

  function setSelect(id, desiredValue) {
    if (!desiredValue) return false;
    const select = byId(id);
    if (!select || select.options.length < 2) return false;

    const desired = normalize(desiredValue);
    const option = Array.from(select.options).find((item) => normalize(item.value) === desired);
    if (!option) return false;

    select.value = option.value;
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function clampInteger(value, min, max) {
    const number = Number.parseInt(String(value || ""), 10);
    if (!Number.isFinite(number)) return null;
    return Math.min(max, Math.max(min, number));
  }

  function setNumber(id, value, min, max) {
    const number = clampInteger(value, min, max);
    const input = byId(id);
    if (number === null || !input) return false;

    input.value = String(number);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function addContextHint(appliedLabels) {
    const introHint = document.querySelector(".calculator-start-hint");
    if (!introHint || byId("calculatorContextHint")) return;

    const source = normalize(params.get("quelle"));
    const sourceText = sourceCopy[source] || "";
    if (!sourceText && appliedLabels.length === 0) return;

    const hint = document.createElement("div");
    hint.id = "calculatorContextHint";
    hint.className = "calculator-start-hint";

    const strong = document.createElement("strong");
    strong.textContent = "Aus dem Artikel übernommen:";
    hint.appendChild(strong);

    const text = document.createElement("p");
    if (appliedLabels.length > 0) {
      text.textContent = `${appliedLabels.join(" · ")}. Du kannst alle Werte jederzeit ändern.${sourceText ? ` ${sourceText}` : ""}`;
    } else {
      text.textContent = sourceText;
    }
    hint.appendChild(text);

    introHint.insertAdjacentElement("afterend", hint);
  }

  function applyPrefill() {
    const zielValue = mappedValue("ziel");
    const klasseValue = mappedValue("klasse");
    const programmValue = mappedValue("programm");
    const reisezeitValue = mappedValue("reisezeit");

    const requiredSelectsReady = (!zielValue || (byId("ziel")?.options.length || 0) > 1)
      && (!klasseValue || (byId("reiseklasse")?.options.length || 0) > 1)
      && (!programmValue || (byId("programm")?.options.length || 0) > 1)
      && (!reisezeitValue || (byId("reisezeit")?.options.length || 0) > 1);

    if (!requiredSelectsReady) return false;

    const applied = [];

    if (setSelect("ziel", zielValue)) applied.push(zielValue);
    if (setNumber("erwachsene", params.get("erwachsene"), 1, 8)) applied.push(`${byId("erwachsene").value} Erwachsene`);
    if (setNumber("kinder2_11", params.get("kinder"), 0, 7)) applied.push(`${byId("kinder2_11").value} Kinder`);
    if (setSelect("reisezeit", reisezeitValue)) applied.push(reisezeitValue);
    if (setSelect("programm", programmValue)) applied.push(programmValue);
    if (setSelect("reiseklasse", klasseValue)) applied.push(klasseValue);

    if (typeof window.updateFormFlow === "function") {
      window.updateFormFlow();
    }

    addContextHint(applied);
    return true;
  }

  function start() {
    let attempts = 0;
    const maxAttempts = 50;

    const tryApply = () => {
      attempts += 1;
      if (applyPrefill() || attempts >= maxAttempts) return;
      window.setTimeout(tryApply, 100);
    };

    tryApply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
