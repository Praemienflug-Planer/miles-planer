(() => {
  const INFANT_WARNING = 'Kinder unter 2 Jahren werden vom Rechner derzeit nicht erfasst und müssen separat geprüft werden.';

  function ensureInfantWarning() {
    const note = document.querySelector('.family-module-note');
    if (!note || note.textContent.includes('unter 2 Jahren')) return;
    note.textContent = `${note.textContent.trim()} ${INFANT_WARNING}`.trim();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function findSelectedRate() {
    const rates = window.MILES_PLANNER_AWARD_RATES?.rates || [];
    const ziel = document.getElementById('ziel')?.value;
    const programm = document.getElementById('programm')?.value;
    const klasse = document.getElementById('reiseklasse')?.value;
    return rates.find((rate) =>
      normalize(rate.ziel) === normalize(ziel) &&
      normalize(rate.programm) === normalize(programm) &&
      normalize(rate.klasse) === normalize(klasse)
    );
  }

  function selectedSeasonFactor(rate) {
    const reisezeit = document.getElementById('reisezeit')?.value;
    if (reisezeit === 'Ferien') return Number(rate?.faktorFerien || 1);
    if (reisezeit === 'Hauptreisezeit') return Number(rate?.faktorHauptsaison || 1);
    return Number(rate?.faktorNebensaison || 1);
  }

  function installMilesOnlySeasonScaling() {
    const form = document.getElementById('milesForm');
    if (!form || form.dataset.reviewSeasonFix === '1') return;
    form.dataset.reviewSeasonFix = '1';

    form.addEventListener('submit', () => {
      const rate = findSelectedRate();
      if (!rate || rate.seasonFactorMode !== 'miles-only') return;

      const factor = selectedSeasonFactor(rate);
      const safeFactor = Number.isFinite(factor) && factor > 0 ? factor : 1;
      const original = {
        seasonFactorMode: rate.seasonFactorMode,
        bestMilesRtPp: rate.bestMilesRtPp,
        realMilesRtPp: rate.realMilesRtPp,
        consMilesRtPp: rate.consMilesRtPp
      };

      // The existing calculator uses one season factor for both miles and costs.
      // To keep the official chart mileage fixed while still scaling taxes/cash,
      // temporarily neutralize the mileage side before the calculator applies it.
      rate.seasonFactorMode = 'costs-scaled';
      ['bestMilesRtPp', 'realMilesRtPp', 'consMilesRtPp'].forEach((key) => {
        const value = Number(rate[key]);
        if (Number.isFinite(value)) rate[key] = value / safeFactor;
      });

      queueMicrotask(() => {
        rate.seasonFactorMode = original.seasonFactorMode;
        rate.bestMilesRtPp = original.bestMilesRtPp;
        rate.realMilesRtPp = original.realMilesRtPp;
        rate.consMilesRtPp = original.consMilesRtPp;
      });
    }, true);
  }

  function clarifyBundleDate() {
    const result = document.getElementById('result');
    if (!result) return;
    result.querySelectorAll('.result-info-card p').forEach((paragraph) => {
      const text = paragraph.textContent || '';
      const match = text.match(/^Award-, Gebühren- und Cash-Planungswerte der Grundmatrix: Stand ([^.]+)\. Programm- und Transferregeln: geprüft am (.+)\.$/);
      if (!match) return;
      paragraph.textContent = `Datenpaket der Award-, Gebühren- und Cash-Planungswerte: zuletzt zusammengeführt am ${match[1]}. Einzelne Programmzeilen können einen älteren Grundstand oder einen separat ausgewiesenen Kalibrierungsstand haben. Programm- und Transferregeln: geprüft am ${match[2]}.`;
    });
  }

  function installObservers() {
    ensureInfantWarning();
    const familyNote = document.querySelector('.family-module-note');
    if (familyNote) {
      new MutationObserver(ensureInfantWarning).observe(familyNote, { childList: true, characterData: true, subtree: true });
    }

    const result = document.getElementById('result');
    if (result) {
      new MutationObserver(clarifyBundleDate).observe(result, { childList: true, subtree: true });
      clarifyBundleDate();
    }
  }

  installMilesOnlySeasonScaling();
  installObservers();
})();
