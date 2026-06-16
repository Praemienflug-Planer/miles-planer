(() => {
  const BASE = '';
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaqpjkgd';
  const LEAD_CHOICES = [
    'Nur Ergebnis-Zusammenfassung senden',
    '30-Tage-Sammelplan anfragen',
    'Roadmap / Strategie anfragen',
    'Passenden Karten- oder Referral-Link anfragen'
  ];

  function getPayloadSafe() {
    if (typeof collectPayload === 'function') return collectPayload();
    return { programm: document.getElementById('programm')?.value || '' };
  }

  function escapeAttr(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

  function isMilesAndMore(programm) {
    const normalized = String(programm || '').toLowerCase();
    return normalized.includes('miles') || normalized.includes('more');
  }

  function getGapConfig(context, programm) {
    if (context.decisionKey !== 'bad' || !Number.isFinite(context.gapMonths) || context.gapMonths <= 3) return null;
    const severe = context.gapMonths >= 18;
    const gapText = context.gapLabel ? `Der aktuelle Plan verfehlt den Reisezeitraum um ${context.gapLabel}. ` : '';

    if (isMilesAndMore(programm)) {
      return {
        title: severe ? 'Ehrliches Fazit: Mit der aktuellen Rate reicht es nicht' : 'Der Miles-&-More-Plan ist zu knapp',
        text: `${gapText}Das ist keine reine Transferfrage, sondern eine echte Sammellücke. Bei Miles & More solltest du zuerst prüfen, ob PAYBACK, PAYBACK Amex, eine Eurowings-/Miles-&-More-Kreditkarte oder ein späteres Reisejahr die Lücke realistisch schließen können. Wenn nicht, muss Ziel, Reiseklasse oder Sammelrate angepasst werden.`,
        links: [
          ['PAYBACK Strategie ansehen', `${BASE}/meilen-sammeln/payback/`],
          ['Transfer zu Miles & More prüfen', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`],
          ['Kartenbaustein einordnen', `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`]
        ],
        note: 'Wichtig: Karten- oder Punkteaktionen können helfen, aber nur wenn Bedingungen, Kosten, Mindestumsatz und dein normales Ausgabeverhalten passen. Nicht wegen Meilen mehr ausgeben.'
      };
    }

    return {
      title: severe ? 'Ehrliches Fazit: Mit der aktuellen Rate reicht es nicht' : 'Der Plan ist zu knapp: Rate oder Ziel anpassen',
      text: `${gapText}Das ist kein kleines Transferproblem, sondern eine echte Sammellücke. Prüfe zuerst, ob Reiseklasse, Reiseziel, Reisejahr oder monatliche Sammelrate angepasst werden müssen. Ein einmaliger Punkte-Boost kann helfen, ersetzt aber keine dauerhaft zu niedrige Sammelrate.`,
      links: [
        ['Amex-Punkteboost einordnen', `${BASE}/meilen-sammeln/amex-kreditkarten/`],
        ['Amex Punkte sammeln', `${BASE}/meilen-sammeln/amex/`],
        ['Ziel neu berechnen', `${BASE}/rechner/`]
      ],
      note: 'Hinweis: Aktionen ändern sich. Je nach Angebot kann ein hoher Membership-Rewards-Startbonus helfen. Bedingungen, Kosten und erforderlichen Umsatz immer vorher prüfen.'
    };
  }

  function getNextStepConfig(programm, context) {
    const gapConfig = getGapConfig(context, programm);
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

  function getLeadSegment(context) {
    if (context.decisionKey === 'good' || (Number.isFinite(context.gapMonths) && context.gapMonths <= 3)) return 'small';
    if (context.decisionKey === 'medium' || (Number.isFinite(context.gapMonths) && context.gapMonths <= 12)) return 'medium';
    return 'large';
  }

  function getRecommendation(payload, context) {
    const segment = getLeadSegment(context);
    const programm = String(payload.programm || '').toLowerCase();
    const gap = context.gapLabel ? `Lücke: ${context.gapLabel}` : 'Lücke nicht eindeutig berechnet';

    if (segment === 'small') {
      if (isMilesAndMore(payload.programm)) return { segment, label: 'Kleine Lücke', title: 'Passenden Karten- oder Transferbaustein anfordern', text: `Dein Ergebnis wirkt nah am Ziel. ${gap}. Sinnvoll ist jetzt eine konkrete Prüfung: PAYBACK-Transfer, Miles-&-More-Karte, PAYBACK Amex oder ein gezielter Punktebonus.`, choice: 'Passenden Karten- oder Referral-Link anfragen' };
      return { segment, label: 'Kleine Lücke', title: 'Konkreten Amex- oder Transferbaustein anfordern', text: `Dein Ergebnis wirkt nah am Ziel. ${gap}. Sinnvoll ist jetzt eine konkrete Prüfung, welcher flexible Punkte- oder Kartenbaustein die Restlücke sauber schließt.`, choice: 'Passenden Karten- oder Referral-Link anfragen' };
    }

    if (segment === 'medium') {
      return { segment, label: 'Mittlere Lücke', title: '30-Tage-Sammelplan per E-Mail anfordern', text: `Dein Ergebnis ist noch nicht ganz entspannt. ${gap}. Statt sofort irgendeine Karte abzuschließen, ist ein kurzer Sammelplan sinnvoll: Alltag, PAYBACK, Amex, Transferlogik und nächste Aktionen.`, choice: '30-Tage-Sammelplan anfragen' };
    }

    if (programm.includes('flying') || programm.includes('avios') || programm.includes('kris')) {
      return { segment, label: 'Große Lücke', title: 'Roadmap statt Schnellschuss anfordern', text: `Dein Ergebnis zeigt eher eine strukturelle Sammellücke. ${gap}. Hier passt eher eine Roadmap: Ziel, Reiseklasse, Zeitraum und Punkteprogramm neu sortieren, bevor Geld in Karten oder Transfers fließt.`, choice: 'Roadmap / Strategie anfragen' };
    }

    return { segment, label: 'Große Lücke', title: 'Roadmap statt Schnellschuss anfordern', text: `Dein Ergebnis zeigt eher eine strukturelle Sammellücke. ${gap}. Hier passt eher eine Roadmap: Ziel, Reiseklasse, Zeitraum, PAYBACK und Miles & More sauber neu sortieren.`, choice: 'Roadmap / Strategie anfragen' };
  }

  function getLeadChoices(recommendedChoice) {
    const unique = [];
    [recommendedChoice, ...LEAD_CHOICES].forEach((choice) => {
      if (!choice || unique.includes(choice)) return;
      unique.push(choice);
    });
    return unique;
  }

  function buildSummary(payload, context, recommendation) {
    const fields = [
      ['Segment', recommendation.label],
      ['Ziel', payload.ziel],
      ['Personen', payload.personen],
      ['Reiseklasse', payload.reiseklasse],
      ['Reisezeit', payload.reisezeit],
      ['Reisemonat', payload.reisemonat],
      ['Reisejahr', payload.reisejahr],
      ['Programm', payload.programm],
      ['Aktueller Bestand', payload.bestandAktuell],
      ['Transferfähiger Bestand', payload.transferBestand],
      ['Geplanter Bonus', payload.geplanterBonus],
      ['Monatliche Sammelrate', payload.monatlicheSammelrate],
      ['Szenario', payload.szenario],
      ['Sammelzeit laut Rechner', getResultValue('Sammelzeit')],
      ['Zeitlücke', context.gapLabel || 'nicht eindeutig'],
      ['Automatische Empfehlung', recommendation.choice]
    ];
    return fields.filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '').map(([label, value]) => `${label}: ${value}`).join('\n');
  }

  function renderLeadBox(payload, context) {
    const recommendation = getRecommendation(payload, context);
    const summary = buildSummary(payload, context, recommendation);
    const choices = getLeadChoices(recommendation.choice);
    return `
      <div class="result-section lead-request-box" data-enhanced-result="true">
        <p class="eyebrow">Persönlicher nächster Schritt</p>
        <span class="lead-segment-badge">${recommendation.label}</span>
        <h3>${recommendation.title}</h3>
        <p>${recommendation.text}</p>
        <form class="lead-request-form" action="${FORMSPREE_ENDPOINT}" method="POST">
          <input type="hidden" name="_subject" value="Rechner-Lead: ${escapeAttr(recommendation.choice)}" />
          <input type="hidden" name="_language" value="de" />
          <input type="hidden" name="segment" value="${escapeAttr(recommendation.label)}" />
          <input type="hidden" name="automatische_empfehlung" value="${escapeAttr(recommendation.choice)}" />
          <input type="hidden" name="rechner_zusammenfassung" value="${escapeAttr(summary)}" />
          <label for="leadName">Name</label>
          <input id="leadName" name="name" type="text" placeholder="Dein Name" autocomplete="name" required />
          <label for="leadEmail">E-Mail</label>
          <div class="lead-form-row">
            <input id="leadEmail" name="email" type="email" placeholder="deine@email.de" autocomplete="email" required />
            <button type="submit" class="btn btn-primary">${recommendation.choice}</button>
          </div>
          <label for="leadChoice">Was möchtest du erhalten?</label>
          <select id="leadChoice" name="wunsch">
            ${choices.map((choice) => `<option value="${escapeAttr(choice)}">${choice}</option>`).join('')}
          </select>
          <div class="hp-field" aria-hidden="true"><label>Bitte leer lassen</label><input type="text" name="_gotcha" tabindex="-1" autocomplete="off" /></div>
          <p class="lead-privacy-note">Du sendest deinen Namen, deine E-Mail und die Rechner-Zusammenfassung. Kein automatischer Kartenabschluss, keine harte Empfehlung. Bedingungen und Kosten werden vorab eingeordnet.</p>
          <div class="lead-form-status" aria-live="polite"></div>
        </form>
      </div>
    `;
  }

  function bindLeadForms() {
    document.querySelectorAll('.lead-request-form:not([data-bound="true"])').forEach((form) => {
      form.dataset.bound = 'true';
      const choiceSelect = form.querySelector('select[name="wunsch"]');
      const submitButton = form.querySelector('button[type="submit"]');
      const subjectInput = form.querySelector('input[name="_subject"]');

      function syncChoiceUi() {
        const choice = choiceSelect?.value || submitButton?.textContent || 'Anfrage senden';
        if (submitButton) submitButton.textContent = choice;
        if (subjectInput) subjectInput.value = `Rechner-Lead: ${choice}`;
      }

      choiceSelect?.addEventListener('change', syncChoiceUi);
      syncChoiceUi();

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        syncChoiceUi();
        const status = form.querySelector('.lead-form-status');
        if (status) {
          status.className = 'lead-form-status';
          status.textContent = 'Anfrage wird gesendet...';
        }
        try {
          const response = await fetch(form.action, { method: form.method, body: new FormData(form), headers: { Accept: 'application/json' } });
          if (response.ok) {
            form.reset();
            syncChoiceUi();
            if (status) {
              status.className = 'lead-form-status success';
              status.textContent = 'Danke! Deine Anfrage wurde gesendet. Ich melde mich mit einer passenden Einordnung.';
            }
          } else {
            if (status) {
              status.className = 'lead-form-status error';
              status.textContent = 'Beim Senden ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
            }
          }
        } catch (error) {
          if (status) {
            status.className = 'lead-form-status error';
            status.textContent = 'Technischer Fehler beim Senden. Bitte versuche es später erneut.';
          }
        }
      });
    });
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
    if (result.querySelector('.next-step-box')) {
      bindLeadForms();
      return;
    }

    const payload = getPayloadSafe();
    const context = getResultContext(payload);
    const affiliateBox = result.querySelector('.affiliate-box');
    const genericNextSteps = Array.from(result.querySelectorAll('.result-section')).find((section) => section.querySelector('h3')?.textContent?.trim() === 'Nächste Schritte');

    if (genericNextSteps) {
      genericNextSteps.insertAdjacentHTML('afterend', renderNextStepBox(payload.programm));
      const nextStepBox = result.querySelector('.next-step-box');
      nextStepBox?.insertAdjacentHTML('afterend', renderLeadBox(payload, context));
    } else if (affiliateBox) {
      affiliateBox.insertAdjacentHTML('beforebegin', renderNextStepBox(payload.programm));
      const nextStepBox = result.querySelector('.next-step-box');
      nextStepBox?.insertAdjacentHTML('afterend', renderLeadBox(payload, context));
    }

    if (affiliateBox && !affiliateBox.classList.contains('result-sammelwege-box')) {
      affiliateBox.classList.add('result-sammelwege-box');
      affiliateBox.innerHTML = renderSammelwegeBox();
    }

    bindLeadForms();
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
