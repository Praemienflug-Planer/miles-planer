(() => {
  const BASE = '';

  function getPayloadSafe() {
    if (typeof collectPayload === 'function') return collectPayload();
    return { programm: document.getElementById('programm')?.value || '' };
  }

  function parseGermanMonth(monthName) {
    const map = { januar: 0, februar: 1, märz: 2, maerz: 2, april: 3, mai: 4, juni: 5, juli: 6, august: 7, september: 8, oktober: 9, november: 10, dezember: 11 };
    return map[String(monthName || '').trim().toLowerCase()] ?? null;
  }

  function diffMonths(fromDate, toDate) {
    return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
  }

  function extractNumber(value) {
    const n = Number(String(value || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  }

  function getResultValue(labelText) {
    const items = Array.from(document.querySelectorAll('#result .result-item'));
    const item = items.find((el) => el.querySelector('.label')?.textContent?.trim() === labelText);
    return item?.querySelector('.value')?.textContent?.trim() || '';
  }

  function formatGap(months) {
    if (!Number.isFinite(months) || months <= 0) return '';
    if (months >= 24) {
      const years = months / 12;
      return `ca. ${years.toLocaleString('de-DE', { maximumFractionDigits: years >= 3 ? 0 : 1 })} Jahre`;
    }
    if (months >= 12) {
      const years = months / 12;
      return `ca. ${years.toLocaleString('de-DE', { maximumFractionDigits: 1 })} Jahre`;
    }
    return `${Math.round(months)} Monate`;
  }

  function getResultContext(payload) {
    const monthIndex = parseGermanMonth(payload.reisemonat);
    const travelYear = Number(payload.reisejahr);
    const travelDate = Number.isFinite(travelYear) && monthIndex !== null ? new Date(travelYear, monthIndex, 1) : null;
    const monthsUntilTravel = travelDate ? diffMonths(new Date(), travelDate) : NaN;
    const monthsToGoal = extractNumber(getResultValue('Sammelzeit'));
    const gapMonths = Number.isFinite(monthsToGoal) && Number.isFinite(monthsUntilTravel) ? monthsToGoal - monthsUntilTravel : NaN;
    const decisionKey = document.querySelector('#result .decision-card-bad') ? 'bad' : document.querySelector('#result .decision-card-medium') ? 'medium' : document.querySelector('#result .decision-card-good') ? 'good' : '';
    return { decisionKey, monthsUntilTravel, monthsToGoal, gapMonths, gapLabel: formatGap(gapMonths) };
  }

  function getGapConfig(context) {
    if (context.decisionKey !== 'bad' || !Number.isFinite(context.gapMonths) || context.gapMonths <= 3) return null;
    const severe = context.gapMonths >= 18;
    const gapText = context.gapLabel ? `Der aktuelle Plan verfehlt den Reisezeitraum um ${context.gapLabel}. ` : '';
    return {
      title: severe ? 'Ehrliches Fazit: Mit der aktuellen Rate reicht es nicht' : 'Der Plan ist zu knapp: Rate oder Ziel anpassen',
      text: `${gapText}Das ist kein kleines Transferproblem, sondern eine echte Sammellücke. Prüfe zuerst, ob Reiseklasse, Reiseziel, Reisejahr oder monatliche Sammelrate angepasst werden müssen. Ein einmaliger Punkte-Boost kann helfen, ersetzt aber keine dauerhaft zu niedrige Sammelrate.`,
      links: [
        ['Amex-Punkteboost einordnen', `${BASE}/meilen-sammeln/amex-kreditkarten/`],
        ['Amex Punkte sammeln', `${BASE}/meilen-sammeln/amex/`],
        ['Ziel neu berechnen', `${BASE}/rechner/`]
      ],
      note: 'Hinweis: Aktionen ändern sich. Je nach Angebot kann ein hoher Membership-Rewards-Startbonus helfen, teils bis zu 85.000 MR Punkte. Bedingungen, Kosten und erforderlichen Umsatz immer vorher prüfen.'
    };
  }

  function getNextStepConfig(programm, context) {
    const gapConfig = getGapConfig(context);
    if (gapConfig) return gapConfig;

    const normalized = String(programm || '').toLowerCase();

    if (normalized.includes('miles') || normalized.includes('more')) {
      return { title: 'Dein Ergebnis passt zu Miles & More: Sammelweg gezielt verbessern', text: 'Wenn dein Plan auf Miles & More basiert, sind meistens drei Bausteine relevant: PAYBACK im Alltag, Transferbonus-Aktionen und ein passender Kartenbaustein. Prüfe diese Reihenfolge, bevor du Punkte überträgst.', links: [['PAYBACK Strategie ansehen', `${BASE}/meilen-sammeln/payback/`], ['Transfer zu Miles & More prüfen', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`], ['Kartenbaustein einordnen', `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`]], note: 'Zusätzliche Produkte nur nutzen, wenn sie zu deinem Alltag passen. Meilen sind kein Grund für unnötige Ausgaben.' };
    }

    if (normalized.includes('flying')) {
      return { title: 'Dein Ergebnis passt zu Flying Blue: flexible Amex-Punkte prüfen', text: 'Für Flying Blue sind flexible Punkte wie American Express Membership Rewards besonders interessant, weil du sie erst später gezielt übertragen kannst. Das ist bei schwankenden Flying-Blue-Preisen oft wertvoller als ein zu früher Transfer.', links: [['Amex Membership Rewards verstehen', `${BASE}/meilen-sammeln/amex/`], ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`], ['Amex oder PAYBACK vergleichen', `${BASE}/amex-oder-payback/`]], note: 'Flying-Blue-Preise können stark schwanken. Plane mit Puffer und übertrage Punkte erst, wenn Verfügbarkeit und Buchungslogik klar sind.' };
    }

    if (normalized.includes('avios')) {
      return { title: 'Dein Ergebnis passt zu Avios: Transferlogik und Sweet Spot prüfen', text: 'Bei Avios kommt es stark auf Strecke, Airline und Programm an. Flexible Punkte können sinnvoll sein, wenn du noch offen bleiben möchtest.', links: [['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`], ['Amex Membership Rewards sammeln', `${BASE}/meilen-sammeln/amex/`], ['Amex oder PAYBACK vergleichen', `${BASE}/amex-oder-payback/`]], note: 'Avios können sehr stark sein, aber nicht pauschal. Prüfe den konkreten Sweet Spot und mögliche Gebühren.' };
    }

    if (normalized.includes('kris')) {
      return { title: 'Dein Ergebnis passt zu KrisFlyer: Transferzeit und Puffer prüfen', text: 'Bei KrisFlyer sind Transferzeiten, Ablaufdaten und Verfügbarkeiten wichtig. Das ist aber erst der zweite Schritt: Wenn die Sammellücke groß ist, muss zuerst der Punkteaufbau realistisch werden.', links: [['Amex Membership Rewards sammeln', `${BASE}/meilen-sammeln/amex/`], ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`], ['Meilen sammeln als Familie', `${BASE}/meilen-sammeln-familie/`]], note: 'Transfers können länger dauern. Verfügbarkeit, Ablaufdaten und Programmregeln sollten vor einer Übertragung geprüft werden.' };
    }

    return { title: 'Dein nächster Schritt: Sammelweg passend zum Ziel prüfen', text: 'Nach dem Ergebnis solltest du zuerst klären, welcher Sammelweg zu deinem Programm, deiner Familie und deinem Reisezeitraum passt. Entscheidend ist, ob er deine konkrete Lücke sinnvoll schließt.', links: [['Meilen sammeln als Familie', `${BASE}/meilen-sammeln-familie/`], ['Amex oder PAYBACK vergleichen', `${BASE}/amex-oder-payback/`], ['Tools & Rechner ansehen', `${BASE}/tools/`]], note: 'Entscheidend ist nicht nur die Punktzahl, sondern auch Verfügbarkeit, Gebühren und realistische Sammelrate.' };
  }

  function renderNextStepBox(programm) {
    const payload = getPayloadSafe();
    const context = getResultContext(payload);
    const config = getNextStepConfig(programm, context);
    return `
      <div class="result-section next-step-box" data-enhanced-result="true">
        <p class="eyebrow">Empfohlener nächster Schritt</p>
        <h3>${config.title}</h3>
        <p>${config.text}</p>
        <div class="next-step-actions">
          ${config.links.map(([label, href], index) => `<a class="btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}" href="${href}">${label}</a>`).join('')}
        </div>
        <p class="next-step-note">${config.note}</p>
      </div>
    `;
  }

  function renderSammelwegeBox() {
    return `
      <h4>Warum diese Sammelwege angezeigt werden</h4>
      <p>Der Rechner zeigt zuerst, ob dein Ziel rechnerisch realistisch wirkt. Erst danach lohnt sich die Frage, welcher Sammelweg die Lücke sinnvoll schließt: PAYBACK, American Express Membership Rewards, Miles & More, Wunschgutschein oder einzelne Meilenangebote.</p>
      <p>Ich ordne diese Wege aus Planungssicht ein. Affiliate-Links werden transparent gekennzeichnet. Bitte prüfe Konditionen, Gebühren und Bedingungen immer selbst vor einem Abschluss.</p>
    `;
  }

  function enhanceResultNextSteps() {
    const result = document.getElementById('result');
    if (!result || !result.querySelector('.result-card')) return;
    if (result.querySelector('.next-step-box')) return;

    const payload = getPayloadSafe();
    const affiliateBox = result.querySelector('.affiliate-box');
    const genericNextSteps = Array.from(result.querySelectorAll('.result-section')).find((section) => section.querySelector('h3')?.textContent?.trim() === 'Nächste Schritte');

    if (genericNextSteps) genericNextSteps.insertAdjacentHTML('afterend', renderNextStepBox(payload.programm));
    else if (affiliateBox) affiliateBox.insertAdjacentHTML('beforebegin', renderNextStepBox(payload.programm));

    if (affiliateBox && !affiliateBox.classList.contains('result-sammelwege-box')) {
      affiliateBox.classList.add('result-sammelwege-box');
      affiliateBox.innerHTML = renderSammelwegeBox();
    }
  }

  function startResultObserver() {
    const result = document.getElementById('result');
    if (!result) return;
    const observer = new MutationObserver(() => enhanceResultNextSteps());
    observer.observe(result, { childList: true, subtree: true });
    enhanceResultNextSteps();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startResultObserver);
  else startResultObserver();
})();