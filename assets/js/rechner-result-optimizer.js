(() => {
  function getBookingWindowNote(payload) {
    const zeit = String(payload.reisezeit || '').toLowerCase();
    const personen = Number(payload.personen || 0);

    if (zeit.includes('ferien') || personen >= 4) {
      return 'Gerade bei Familien, Ferienzeiten und mehreren Sitzen zählt frühe Planung. Rechne nicht nur die Meilenmenge, sondern auch Verfügbarkeit, Buchungsfenster und mögliche Alternativen mit ein.';
    }

    return 'Neben dem rechnerischen Meilenziel bleibt die tatsächliche Prämienverfügbarkeit entscheidend. Prüfe deshalb frühzeitig mehrere Daten, Programme und Abflughäfen.';
  }

  function buildOptimizedAffiliateBox(payload) {
    const programm = escapeHtml(payload?.programm || 'dein Programm');
    return `
      <div class="result-action-box affiliate-box optimized-affiliate-box">
        <p class="eyebrow">Punkte schneller aufbauen</p>
        <h3>Kreditkarten, PAYBACK und Sammelstrategie</h3>
        <p>
          Wenn dein Ergebnis zeigt, dass noch Punkte fehlen, können passende Sammelwege helfen – zum Beispiel PAYBACK, Miles & More oder flexible Punkteprogramme wie Amex Membership Rewards.
        </p>
        <p>
          Ob sich eine Kreditkarte für dich lohnt, hängt von deinem Ziel, deinem Ausgabeverhalten und deiner Zahlungsdisziplin ab. Bei Interesse kann ich dir einen passenden Empfehlungslink gerne über das <a href="/miles-planer/kontakt.html">Kontaktformular</a> zur Verfügung stellen.
        </p>
        <p class="affiliate-disclosure">
          Wenn du über einen solchen Link bestellst, kann ich davon profitieren. Für dich entstehen dadurch keine zusätzlichen Kosten.
        </p>
        <div class="result-action-buttons">
          <a class="btn btn-primary" href="/miles-planer/kontakt.html">Empfehlungslink anfragen</a>
          <a class="btn btn-secondary" href="/miles-planer/meilen-sammeln/">Sammelwege ansehen</a>
        </div>
      </div>
    `;
  }

  function buildScenarioAdvice(chart, payload, data, cfg) {
    const key = chart?.key || 'bad';
    const ziel = escapeHtml(payload.ziel || 'dein Ziel');
    const klasse = escapeHtml(payload.reiseklasse || 'deine Reiseklasse');
    const programm = escapeHtml(payload.programm || 'das gewählte Programm');
    const fehlend = escapeHtml(data.fehlend || '—');
    const label = escapeHtml(cfg.kurzlabel || 'Punkte');

    if (key === 'good') {
      return `
        <div class="result-action-box result-action-good">
          <p class="eyebrow">Einschätzung</p>
          <h3>Dein Plan wirkt machbar – jetzt Verfügbarkeit absichern</h3>
          <p>Für ${ziel} in ${klasse} sieht die Punkteplanung zeitlich gut aus. Der nächste Hebel ist nicht mehr nur Sammeln, sondern die konkrete Award-Suche.</p>
          <ul>
            <li>Prüfe frühzeitig Verfügbarkeiten bei ${programm}.</li>
            <li>Halte Alternativen bei Reisetag, Abflughafen und Routing offen.</li>
            <li>Übertrage Punkte erst, wenn du die Buchungslogik und Verfügbarkeit geprüft hast.</li>
          </ul>
        </div>
      `;
    }

    if (key === 'medium') {
      return `
        <div class="result-action-box result-action-medium">
          <p class="eyebrow">Einschätzung</p>
          <h3>Knapp, aber nicht aussichtslos</h3>
          <p>Es fehlen noch ${fehlend} ${label}. Dein Plan kann funktionieren, braucht aber Puffer und vermutlich zusätzliche Sammelbausteine.</p>
          <ul>
            <li>Prüfe, ob Premium Economy statt Business Class realistischer ist.</li>
            <li>Vergleiche alternative Programme und One-Way-Strategien.</li>
            <li>Nutze planbare Aktionen, aber vermeide hektische Punktetransfers ohne konkrete Verfügbarkeit.</li>
          </ul>
        </div>
      `;
    }

    return `
      <div class="result-action-box result-action-bad">
        <p class="eyebrow">Einschätzung</p>
        <h3>Der Plan braucht wahrscheinlich eine Anpassung</h3>
        <p>Mit den aktuellen Eingaben wirkt ${ziel} in ${klasse} bis zum geplanten Zeitpunkt eher zu ambitioniert. Das ist kein Scheitern, sondern genau der Sinn des Rechners: früh erkennen, bevor du in die falsche Richtung sammelst.</p>
        <ul>
          <li>Reiseklasse prüfen: Premium Economy kann für Familien deutlich realistischer sein.</li>
          <li>Reiseziel oder Programm vergleichen.</li>
          <li>Sammelrate, Bonusaktionen und vorhandene Punktebasis realistisch erhöhen.</li>
        </ul>
      </div>
    `;
  }

  function buildRelatedResultLinks(payload) {
    const klasse = String(payload.reiseklasse || '').toLowerCase();
    const ziel = String(payload.ziel || '').toLowerCase();

    const links = [
      ['4 Prämienflug-Plätze finden', '/miles-planer/vier-praemienflug-plaetze-finden/'],
      ['Steuern & Gebühren verstehen', '/miles-planer/praemienflug-steuern-gebuehren/'],
      ['Meilen sammeln im Alltag', '/miles-planer/meilen-sammeln/']
    ];

    if (klasse.includes('business')) links.unshift(['Business Class mit Kindern', '/miles-planer/business-class-mit-kindern/']);
    if (klasse.includes('premium')) links.unshift(['Premium Economy mit Kindern', '/miles-planer/premium-economy-mit-kindern/']);
    if (ziel.includes('thailand')) links.unshift(['Thailand mit Meilen planen', '/miles-planer/meilen-thailand/']);

    return `
      <div class="result-section result-links-section">
        <h3>Passende nächste Inhalte</h3>
        <div class="result-link-grid">
          ${links.slice(0, 5).map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
        </div>
      </div>
    `;
  }

  window.buildAffiliateBox = function buildAffiliateBoxOverride() {
    return buildOptimizedAffiliateBox(collectPayload());
  };

  window.berechneMilesPlaner = async function berechneMilesPlanerOptimized() {
    clearValidationUI();

    const resultBox = $('result');
    if (!resultBox) {
      alert('Ergebnisbereich nicht gefunden.');
      return;
    }

    const payload = collectPayload();
    const errors = validatePayload(payload);

    if (errors.length > 0) {
      showValidationErrors(errors);
      return;
    }

    const calcButton = $('calcButton');
    if (calcButton) {
      calcButton.disabled = true;
      calcButton.textContent = 'Berechne…';
    }

    zeigeErgebnisView();
    resultBox.innerHTML = '<div class="result-loading">Berechne deinen Familien-Plan…</div>';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP-Fehler ${response.status}`);

      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message || 'Unbekannter Fehler aus Apps Script.');

      const cfg = getProgramConfig(payload.programm);
      const chart = classifyAmpel(data.monate, payload);
      const missingRaw = extractNumber(data.fehlend);
      const isComplete = missingRaw <= 0;

      resultBox.innerHTML = `
        <div class="result-card optimized-result-card">
          <div class="result-hero-summary decision-card decision-card-${escapeHtml(chart.key)}">
            <div>
              <div class="decision-badge">${escapeHtml(chart.badge)} ${escapeHtml(chart.title)}</div>
              <h2>${escapeHtml(chart.text)}</h2>
              <p>
                ${escapeHtml(payload.personen)} Reisende · ${escapeHtml(payload.ziel)} · ${escapeHtml(payload.reiseklasse)} · ${escapeHtml(payload.programm)}
              </p>
            </div>
            <div class="result-main-number">
              <span>Noch fehlend</span>
              <strong>${isComplete ? '0' : escapeHtml(data.fehlend || '—')}</strong>
              <small>${escapeHtml(cfg.kurzlabel || 'Punkte')}</small>
            </div>
          </div>

          <div class="result-section result-priority-section">
            <h3>Die wichtigsten Zahlen</h3>
            <div class="result-grid result-grid-priority">
              <div class="result-item result-item-highlight">
                <div class="label">Zielbedarf gesamt</div>
                <div class="value">${escapeHtml(data.zielbedarf || '—')} ${escapeHtml(cfg.kurzlabel || '')}</div>
              </div>
              <div class="result-item result-item-highlight">
                <div class="label">Sammelzeit</div>
                <div class="value">${escapeHtml(data.monate || '—')} Monate</div>
              </div>
              <div class="result-item result-item-highlight">
                <div class="label">Ziel erreicht ca.</div>
                <div class="value">${escapeHtml(data.zielErreicht || '—')}</div>
              </div>
              <div class="result-item result-item-highlight">
                <div class="label">Geplante Reise</div>
                <div class="value">${escapeHtml(data.reise || `${payload.reisemonat} ${payload.reisejahr}`)}</div>
              </div>
            </div>
            <p class="result-context-note">${escapeHtml(getBookingWindowNote(payload))}</p>
          </div>

          ${buildScenarioAdvice(chart, payload, data, cfg)}

          <div class="result-section deal-section">
            <h3>Cash-Vergleich und Dealwert</h3>
            <div class="result-grid deal-grid">
              <div class="result-item"><div class="label">Cashpreis gesamt</div><div class="value">${formatEuro(data.cash_total)}</div></div>
              <div class="result-item"><div class="label">Award-Zuzahlung gesamt</div><div class="value">${formatEuro(data.award_total)}</div></div>
              <div class="result-item"><div class="label">Ersparnis gesamt</div><div class="value">${formatEuro(data.savings_total)}</div></div>
              <div class="result-item"><div class="label">Wert pro Meile</div><div class="value">${escapeHtml(data.cpm || '—')}</div><div class="value-note">${escapeHtml(data.deal || '')}</div></div>
            </div>
            <p class="result-context-note">Der Cash-Vergleich ist eine grobe Orientierung. Verfügbarkeiten, Gepäck, Sitzplätze, Routing und Zuschläge können den echten Gegenwert deutlich verändern.</p>
          </div>

          <div class="result-section">
            <h3>Detailwerte</h3>
            <div class="result-grid detail-grid">
              <div class="result-item"><div class="label">Bestand heute</div><div class="value">${escapeHtml(data.bestand || '—')}</div></div>
              <div class="result-item"><div class="label">Fehlende Punkte</div><div class="value">${isComplete ? '0' : escapeHtml(data.fehlend || '—')} ${escapeHtml(cfg.kurzlabel || '')}</div></div>
              <div class="result-item"><div class="label">Szenario</div><div class="value">${escapeHtml(payload.szenario || 'realistisch')}</div></div>
              <div class="result-item"><div class="label">Transferweg</div><div class="value">${escapeHtml(buildTransferInfo(cfg))}</div></div>
            </div>
          </div>

          ${buildOptimizedAffiliateBox(payload)}
          ${buildRelatedResultLinks(payload)}
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
        calcButton.textContent = 'Jetzt berechnen';
      }
    }
  };
})();
