(() => {
  const TOTAL_STEPS = 6;
  const STEP_COPY = {
    1: "Reiseziel auswählen",
    2: "Reisegruppe eintragen",
    3: "Reisezeit festlegen",
    4: "Programm auswählen",
    5: "Reiseklasse auswählen",
    6: "Punkte und Sammelrate eintragen"
  };

  let currentStep = 1;
  let maxUnlockedStep = 1;

  const byId = (id) => document.getElementById(id);

  function toInt(value, fallback = 0) {
    const n = Number(String(value ?? "").replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, Math.floor(n));
  }

  function setValue(id, value) {
    const el = byId(id);
    if (!el) return;
    el.value = String(value);
  }

  function getValue(id) {
    return byId(id)?.value || "";
  }

  function syncPersonenFromCounters() {
    const adults = toInt(getValue("erwachsene"), 0);
    const children = toInt(getValue("kinder2_11"), 0);
    const total = adults + children;

    setValue("infants0_1", 0);
    setValue("personen", total > 0 ? total : "");

    return { adults, children, total };
  }

  function clearStepMessages() {
    document.querySelectorAll(".wizard-step-message").forEach((el) => el.remove());
  }

  function showStepMessage(step, message) {
    clearStepMessages();

    const stepEl = document.querySelector(`.wizard-step[data-step="${step}"] .step-content`);
    if (!stepEl) return;

    const messageEl = document.createElement("div");
    messageEl.className = "wizard-step-message";
    messageEl.textContent = message;
    stepEl.appendChild(messageEl);
  }

  function validateStep(step) {
    syncPersonenFromCounters();

    if (step === 1 && !getValue("ziel")) {
      return "Bitte wähle zuerst ein Reiseziel aus.";
    }

    if (step === 2) {
      const group = syncPersonenFromCounters();

      if (group.adults < 1) {
        return "Bitte trage mindestens eine erwachsene Person ein.";
      }

      if (group.total < 1) {
        return "Bitte trage mindestens eine reisende Person ein.";
      }

      if (group.total > 8) {
        return "Der Rechner ist aktuell für maximal 8 Reisende ausgelegt.";
      }

      if (group.children > 7) {
        return "Bitte trage maximal 7 Kinder ein.";
      }
    }

    if (step === 3) {
      const year = toInt(getValue("reisejahr"), 0);
      const thisYear = new Date().getFullYear();

      if (!getValue("reisezeit")) {
        return "Bitte wähle den Reisezeitraum aus.";
      }

      if (!getValue("reisemonat")) {
        return "Bitte wähle den Reisemonat aus.";
      }

      if (!year || year < thisYear || year > 2035) {
        return `Bitte trage ein realistisches Reisejahr zwischen ${thisYear} und 2035 ein.`;
      }
    }

    if (step === 4 && !getValue("programm")) {
      return "Bitte wähle ein Meilenprogramm aus.";
    }

    if (step === 5 && !getValue("reiseklasse")) {
      return "Bitte wähle Premium Economy oder Business Class aus.";
    }

    if (step === 6) {
      const rate = toInt(getValue("monatlicheSammelrate"), 0);

      if (rate <= 0) {
        return "Bitte gib eine monatliche Sammelrate größer 0 ein.";
      }
    }

    return "";
  }

  function refreshProgramHint() {
    const hint = byId("wizardProgramHint");
    if (!hint) return;

    const program = getValue("programm");
    if (!program || typeof getProgramConfig !== "function" || typeof buildTransferInfo !== "function") {
      hint.textContent = "Nach der Auswahl passen sich die Punktefelder automatisch an.";
      return;
    }

    const cfg = getProgramConfig(program);
    hint.textContent = buildTransferInfo(cfg);
  }

  function refreshProgressUi() {
    const progressFill = byId("wizardProgressFill");
    const progressLabel = byId("wizardProgressLabel");
    const progressSummary = byId("wizardProgressSummary");

    if (progressFill) {
      progressFill.style.width = `${Math.round((currentStep / TOTAL_STEPS) * 100)}%`;
    }

    if (progressLabel) {
      progressLabel.textContent = `Schritt ${currentStep} von ${TOTAL_STEPS}`;
    }

    if (progressSummary) {
      progressSummary.textContent = STEP_COPY[currentStep] || "";
    }

    document.querySelectorAll(".wizard-step").forEach((stepEl) => {
      const step = Number(stepEl.dataset.step || 0);
      const visible = step === currentStep;
      stepEl.classList.toggle("wizard-visible", visible);
      stepEl.classList.toggle("active", visible);
      stepEl.classList.toggle("wizard-complete", step < currentStep);
      stepEl.classList.toggle("wizard-locked", step > maxUnlockedStep);
    });

    document.querySelectorAll(".wizard-tab").forEach((tab) => {
      const step = Number(tab.dataset.wizardJump || 0);
      tab.classList.toggle("is-current", step === currentStep);
      tab.classList.toggle("is-done", step < currentStep && step <= maxUnlockedStep);
      tab.classList.toggle("is-locked", step > maxUnlockedStep);
      tab.disabled = step > maxUnlockedStep;
    });
  }

  function goToStep(step) {
    const target = Math.min(TOTAL_STEPS, Math.max(1, Number(step) || 1));
    if (target > maxUnlockedStep) return;

    currentStep = target;
    clearStepMessages();
    refreshProgressUi();

    const activeStep = document.querySelector(".wizard-step.wizard-visible");
    if (activeStep && typeof activeStep.scrollIntoView === "function") {
      activeStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function unlockAndGo(nextStep) {
    const next = Math.min(TOTAL_STEPS, Math.max(1, Number(nextStep) || currentStep + 1));
    const validationMessage = validateStep(currentStep);

    if (validationMessage) {
      showStepMessage(currentStep, validationMessage);
      return;
    }

    maxUnlockedStep = Math.max(maxUnlockedStep, next);
    currentStep = next;
    clearStepMessages();
    refreshProgressUi();

    const activeStep = document.querySelector(".wizard-step.wizard-visible");
    if (activeStep && typeof activeStep.scrollIntoView === "function") {
      activeStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function updateWizardFlow() {
    syncPersonenFromCounters();

    if (typeof updatePointsLabels === "function") {
      updatePointsLabels();
    }

    refreshProgramHint();
    refreshProgressUi();
  }

  function attachWizardEvents() {
    document.querySelectorAll(".wizard-next").forEach((button) => {
      button.addEventListener("click", () => unlockAndGo(button.dataset.nextStep));
    });

    document.querySelectorAll(".wizard-back").forEach((button) => {
      button.addEventListener("click", () => goToStep(button.dataset.prevStep));
    });

    document.querySelectorAll(".wizard-tab").forEach((tab) => {
      tab.addEventListener("click", () => goToStep(tab.dataset.wizardJump));
    });

    [
      "ziel",
      "erwachsene",
      "kinder2_11",
      "reisezeit",
      "reisemonat",
      "reisejahr",
      "programm",
      "reiseklasse",
      "bestandAktuell",
      "transferBestand",
      "geplanterBonus",
      "monatlicheSammelrate",
      "szenario"
    ].forEach((id) => {
      const el = byId(id);
      if (!el) return;
      el.addEventListener("input", updateWizardFlow);
      el.addEventListener("change", updateWizardFlow);
    });

    const form = byId("milesForm");
    if (form) {
      form.addEventListener("submit", () => {
        syncPersonenFromCounters();
      }, true);
    }
  }

  window.updateFormFlow = updateWizardFlow;

  try {
    updateFormFlow = updateWizardFlow;
  } catch (error) {
    // ignore: the global binding may be read-only in some browsers
  }

  window.goToWizardStep = goToStep;

  document.addEventListener("DOMContentLoaded", () => {
    syncPersonenFromCounters();
    attachWizardEvents();
    updateWizardFlow();
  });
})();
