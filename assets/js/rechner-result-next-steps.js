(() => {
  const BASE = '/miles-planer';

  function getPayloadSafe() {
    if (typeof collectPayload === 'function') return collectPayload();
    return { programm: document.getElementById('programm')?.value || '' };
  }

  function getNextStepConfig(programm) {
    const normalized = String(programm || '').toLowerCase();

    if (normalized.includes('miles') || normalized.includes('more')) {
      return {
        title: 'Dein nächster sinnvoller Schritt: Miles-&-More-Sammelweg prüfen',
        text: 'Wenn dein Ergebnis auf Miles & More basiert, sind PAYBACK, Transferboni und die Miles-&-More-Kreditkarte die naheliegenden nächsten Themen.',
        links: [
          ['PAYBACK Punkte sammeln', `${BASE}/meilen-sammeln/payback/`],
          ['PAYBACK zu Miles & More übertragen', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`],
          ['Miles & More Kreditkarte einordnen', `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`]
        ],
        note: 'Achte besonders auf Zuzahlungen, Verfügbarkeiten für mehrere Plätze und Transferbonus-Aktionen.'
      };
    }

    if (normalized.includes('flying')) {
      return {
        title: 'Dein nächster sinnvoller Schritt: flexible Amex-Punkte prüfen',
        text: 'Für Flying Blue sind flexible Punkte wie American Express Membership Rewards besonders interessant, weil sie später gezielt übertragen werden können.',
        links: [
          ['Amex Membership Rewards verstehen', `${BASE}/meilen-sammeln/amex/`],
          ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`],
          ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/`]
        ],
        note: 'Flying-Blue-Preise können stark schwanken. Plane deshalb eher mit Puffer und prüfe Alternativdaten.'
      };
    }

    if (normalized.includes('avios')) {
      return {
        title: 'Dein nächster sinnvoller Schritt: Avios- und Amex-Logik prüfen',
        text: 'Bei Avios lohnt sich der Blick auf Transferwege, Partnerprogramme und die Umrechnung aus Membership Rewards Punkten.',
        links: [
          ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`],
          ['Amex Membership Rewards sammeln', `${BASE}/meilen-sammeln/amex/`],
          ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/`]
        ],
        note: 'Avios können je nach Programm und Strecke sehr unterschiedlich stark sein. Prüfe daher den konkreten Sweet Spot.'
      };
    }

    if (normalized.includes('kris')) {
      return {
        title: 'Dein nächster sinnvoller Schritt: Transferzeit und Puffer prüfen',
        text: 'Bei KrisFlyer sind Transferzeiten und Verfügbarkeiten besonders wichtig. Plane nicht zu knapp und übertrage Punkte erst, wenn die Buchungslogik klar ist.',
        links: [
          ['Amex Membership Rewards sammeln', `${BASE}/meilen-sammeln/amex/`],
          ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`],
          ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/`]
        ],
        note: 'Transfers können länger dauern. Verfügbarkeit, Ablaufdaten und Programmregeln sollten vor einer Übertragung geprüft werden.'
      };
    }

    return {
      title: 'Dein nächster sinnvoller Schritt: Sammelweg passend zum Ziel prüfen',
      text: 'Nach dem Ergebnis solltest du zuerst klären, welcher Sammelweg zu deinem Programm, deiner Familie und deinem Reisezeitraum passt.',
      links: [
        ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/`],
        ['Tools & Rechner ansehen', `${BASE}/tools/`],
        ['Amex Punkte umrechnen', `${BASE}/amex-meilen-umrechnen/`]
      ],
      note: 'Entscheidend ist nicht nur die Punktzahl, sondern auch Verfügbarkeit, Gebühren und realistische Sammelrate.'
    };
  }

  function renderNextStepBox(programm) {
    const config = getNextStepConfig(programm);
    return `
      <div class="result-section next-step-box" data-enhanced-result="true">
        <p class="eyebrow">Nächster Schritt</p>
        <h3>${config.title}</h3>
        <p>${config.text}</p>
        <div class="next-step-actions">
          ${config.links.map(([label, href]) => `<a class="btn btn-secondary" href="${href}">${label}</a>`).join('')}
        </div>
        <p class="next-step-note">${config.note}</p>
      </div>
    `;
  }

  function renderSammelwegeBox() {
    return `
      <h4>Du möchtest passende Sammelwege einordnen?</h4>
      <p>
        Der Rechner zeigt nur, ob dein Ziel rechnerisch realistisch wirkt. Der nächste Schritt ist die Frage,
        welcher Sammelweg zu deinem Programm passt: PAYBACK, American Express Membership Rewards,
        Miles & More Kreditkarte, Wunschgutschein oder einzelne Meilenangebote.
      </p>
      <p>
        Ich nutze selbst verschiedene Punkte- und Meilenprogramme und ordne diese hier aus Planungssicht ein.
        Bitte prüfe Konditionen, Gebühren und Kartenbedingungen immer selbst vor einem Abschluss.
      </p>
    `;
  }

  function enhanceResultNextSteps() {
    const result = document.getElementById('result');
    if (!result || !result.querySelector('.result-card')) return;
    if (result.querySelector('.next-step-box')) return;

    const payload = getPayloadSafe();
    const affiliateBox = result.querySelector('.affiliate-box');
    const genericNextSteps = Array.from(result.querySelectorAll('.result-section')).find((section) =>
      section.querySelector('h3')?.textContent?.trim() === 'Nächste Schritte'
    );

    if (genericNextSteps) {
      genericNextSteps.insertAdjacentHTML('afterend', renderNextStepBox(payload.programm));
    } else if (affiliateBox) {
      affiliateBox.insertAdjacentHTML('beforebegin', renderNextStepBox(payload.programm));
    }

    if (affiliateBox && !affiliateBox.classList.contains('result-sammelwege-box')) {
      affiliateBox.classList.add('result-sammelwege-box');
      affiliateBox.innerHTML = renderSammelwegeBox();
    }
  }

  function startResultObserver() {
    const result = document.getElementById('result');
    if (!result) return;

    const observer = new MutationObserver(() => {
      enhanceResultNextSteps();
    });

    observer.observe(result, { childList: true, subtree: true });
    enhanceResultNextSteps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startResultObserver);
  } else {
    startResultObserver();
  }
})();
