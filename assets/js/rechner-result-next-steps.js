(() => {
  const BASE = '';

  function getPayloadSafe() {
    if (typeof collectPayload === 'function') return collectPayload();
    return { programm: document.getElementById('programm')?.value || '' };
  }

  function getNextStepConfig(programm) {
    const normalized = String(programm || '').toLowerCase();

    if (normalized.includes('miles') || normalized.includes('more')) {
      return {
        title: 'Dein Ergebnis passt zu Miles & More: Sammelweg gezielt verbessern',
        text: 'Wenn dein Plan auf Miles & More basiert, sind meistens drei Bausteine relevant: PAYBACK im Alltag, Transferbonus-Aktionen und eine passende Miles-&-More-/Eurowings-Kreditkarte. Prüfe diese Reihenfolge, bevor du Punkte überträgst oder eine Karte beantragst.',
        links: [
          ['PAYBACK Strategie ansehen', `${BASE}/meilen-sammeln/payback/`],
          ['Transfer zu Miles & More prüfen', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`],
          ['Kreditkarte seriös einordnen', `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`]
        ],
        note: 'Kreditkarten nur nutzen, wenn die Abrechnung immer vollständig bezahlt wird. Meilen sind kein Grund für Konsumschulden.'
      };
    }

    if (normalized.includes('flying')) {
      return {
        title: 'Dein Ergebnis passt zu Flying Blue: flexible Amex-Punkte prüfen',
        text: 'Für Flying Blue sind flexible Punkte wie American Express Membership Rewards besonders interessant, weil du sie erst später gezielt übertragen kannst. Das ist bei schwankenden Flying-Blue-Preisen oft wertvoller als ein zu früher Transfer.',
        links: [
          ['Amex Membership Rewards verstehen', `${BASE}/meilen-sammeln/amex/`],
          ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`],
          ['Amex oder PAYBACK vergleichen', `${BASE}/amex-oder-payback/`]
        ],
        note: 'Flying-Blue-Preise können stark schwanken. Plane mit Puffer und übertrage Punkte erst, wenn Verfügbarkeit und Buchungslogik klar sind.'
      };
    }

    if (normalized.includes('avios')) {
      return {
        title: 'Dein Ergebnis passt zu Avios: Transferlogik und Sweet Spot prüfen',
        text: 'Bei Avios kommt es stark auf Strecke, Airline und Programm an. Flexible Punkte können sinnvoll sein, wenn du noch offen bleiben möchtest.',
        links: [
          ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`],
          ['Amex Membership Rewards sammeln', `${BASE}/meilen-sammeln/amex/`],
          ['Amex oder PAYBACK vergleichen', `${BASE}/amex-oder-payback/`]
        ],
        note: 'Avios können sehr stark sein, aber nicht pauschal. Prüfe den konkreten Sweet Spot und mögliche Gebühren.'
      };
    }

    if (normalized.includes('kris')) {
      return {
        title: 'Dein Ergebnis passt zu KrisFlyer: Transferzeit und Puffer prüfen',
        text: 'Bei KrisFlyer sind Transferzeiten, Ablaufdaten und Verfügbarkeiten besonders wichtig. Übertrage Punkte nicht zu früh und plane nicht zu knapp.',
        links: [
          ['Amex Membership Rewards sammeln', `${BASE}/meilen-sammeln/amex/`],
          ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`],
          ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/`]
        ],
        note: 'Transfers können länger dauern. Verfügbarkeit, Ablaufdaten und Programmregeln sollten vor einer Übertragung geprüft werden.'
      };
    }

    return {
      title: 'Dein nächster Schritt: Sammelweg passend zum Ziel prüfen',
      text: 'Nach dem Ergebnis solltest du zuerst klären, welcher Sammelweg zu deinem Programm, deiner Familie und deinem Reisezeitraum passt. Entscheidend ist nicht die Karte an sich, sondern ob sie deine konkrete Lücke sinnvoll schließt.',
      links: [
        ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/`],
        ['Amex oder PAYBACK vergleichen', `${BASE}/amex-oder-payback/`],
        ['Tools & Rechner ansehen', `${BASE}/tools/`]
      ],
      note: 'Entscheidend ist nicht nur die Punktzahl, sondern auch Verfügbarkeit, Gebühren und realistische Sammelrate.'
    };
  }

  function renderNextStepBox(programm) {
    const config = getNextStepConfig(programm);
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
      <p>Der Rechner zeigt zuerst, ob dein Ziel rechnerisch realistisch wirkt. Erst danach lohnt sich die Frage, welcher Sammelweg die Lücke sinnvoll schließt: PAYBACK, American Express Membership Rewards, Miles & More Kreditkarte, Wunschgutschein oder einzelne Meilenangebote.</p>
      <p>Ich ordne diese Wege aus Planungssicht ein. Affiliate-Links werden transparent gekennzeichnet. Bitte prüfe Konditionen, Gebühren und Kartenbedingungen immer selbst vor einem Abschluss.</p>
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
