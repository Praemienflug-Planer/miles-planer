(() => {
  const $ = id => document.getElementById(id);
  const fmt = n => Number(n).toLocaleString('de-DE', { maximumFractionDigits: 0 });
  const euro = n => `${fmt(n)} €`;
  const decimal = n => Number(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const sourceNames = { 'Miles & More':'PAYBACK', Avios:'Membership Rewards', 'Flying Blue':'Membership Rewards', KrisFlyer:'Membership Rewards' };
  const ratios = { 'Miles & More':'1:1', Avios:'5:4 über Iberia', 'Flying Blue':'5:4', KrisFlyer:'3:2' };
  const durations = { 'Miles & More':'bis zu 5 Werktage', Avios:'bis zu 1 Werktag', 'Flying Blue':'bis zu 1 Werktag', KrisFlyer:'bis zu 15 Werktage' };
  const rows = () => window.MILES_PLANNER_AWARD_RATES?.rates || [];
  const state = { cashEdited:false, taxesEdited:false };

  function rateFor() { return rows().find(r => r.ziel === $('destination').value && r.programm === $('program').value && r.klasse === $('cabin').value); }
  function seasonFactor(rate) { return Number(rate[$('season').value === 'Ferien' ? 'faktorFerien' : $('season').value === 'Hauptreisezeit' ? 'faktorHauptsaison' : 'faktorNebensaison']); }
  function setSuggestedPrice() {
    const rate = rateFor(); if (!rate) return;
    const factor = seasonFactor(rate);
    if (!state.cashEdited) $('cashPp').value = Math.round(rate.cashPp * factor);
    if (!state.taxesEdited) $('taxesPp').value = Math.round(rate.realTaxesRtPp * factor);
    $('cashHint').textContent = state.cashEdited ? 'Dein eingetragener Vergleichspreis' : 'Vorschlagswert aus der Planungsmatrix';
    $('taxesHint').textContent = state.taxesEdited ? 'Deine eingetragene Zuzahlung' : 'Vorschlagswert für alle drei Szenarien';
  }
  function readInput() {
    const [year, month] = $('travelMonth').value.split('-').map(Number);
    return { adults:$('adults').value, children:$('children').value, season:$('season').value, month, year,
      program:$('program').value, nativePoints:$('nativePoints').value, sourcePoints:$('sourcePoints').value,
      monthlyPoints:$('monthlyPoints').value, bonus:$('bonus').value, cashPp:$('cashPp').value, taxesPp:$('taxesPp').value };
  }
  function monthAfter(amount) {
    if (!Number.isFinite(amount)) return 'mit dieser Sammelrate nicht erreichbar';
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + amount);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  function programCard(name) {
    const source = sourceNames[name];
    return `<article class="program-card${$('program').value === name ? ' active' : ''}"><span class="program-kicker">${source.toUpperCase()} → ${name.toUpperCase()}</span><h3>${name}</h3><div class="program-ratio">${ratios[name]}</div><p>Ab ${fmt(({'Miles & More':200, Avios:1000,'Flying Blue':625,KrisFlyer:1500})[name])} ${source} Punkten · Transfer ${durations[name]}</p><button type="button" data-program="${name}" aria-label="${name} im Rechner auswählen">Im Rechner vergleichen ↗</button></article>`;
  }
  function renderProgramCards() { $('programCards').innerHTML = ['Miles & More','Avios','Flying Blue','KrisFlyer'].map(programCard).join(''); }
  function render() {
    const rate = rateFor(), input = readInput();
    const source = sourceNames[input.program], ratio = ratios[input.program];
    $('nativeLabel').textContent = `${input.program} Meilen heute`;
    $('sourceLabel').textContent = `${source} Punkte übertragbar`;
    $('monthlyLabel').textContent = `${source} Punkte pro Monat`;
    $('transferHint').textContent = `${source} → ${input.program} · ${ratio}. Ein Bonus gilt nur für einen zukünftigen Transfer.`;
    $('resultTitle').textContent = `${$('destination').selectedOptions[0]?.textContent || ''} für ${Number(input.adults) + Number(input.children) || '—'}`;
    $('resultSubtitle').textContent = `${input.program} · ${$('cabin').value} · ${months[input.month - 1] || '—'} ${input.year || ''} · ${input.season}`;
    const result = FamilyPlanner.calculate(input, rate);
    const error = $('inputError');
    error.hidden = !result.error; error.textContent = result.error || '';
    if (result.error) { $('mobileStatusText').textContent = 'Eingaben prüfen'; $('resultContent').innerHTML = '<p>Prüfe die markierten Eingaben. Sobald sie gültig sind, erscheint der Vergleich hier.</p>'; renderProgramCards(); return; }
    const realistic = result.rows[1];
    $('mobileStatusText').textContent = `${fmt(realistic.needed)} ${input.program === 'Avios' ? 'Avios' : 'Meilen'} · ${realistic.light === 'green' ? 'Grün' : realistic.light === 'amber' ? 'Gelb' : 'Rot'}`;
    const leadText = result.lead === 0 ? 'dieser Reisemonat' : `${result.lead} Monat${result.lead === 1 ? '' : 'e'} bis zur Reise`;
    const card = s => `<article class="scenario-card${s.key === 'real' ? ' selected' : ''}"><div class="scenario-top"><div><strong>${s.title}</strong><small>${s.detail}</small></div><span class="light ${s.light}">${s.light === 'green' ? '● Grün' : s.light === 'amber' ? '● Gelb' : '● Rot'}</span></div><div class="scenario-stats"><div><span>Bedarf gesamt</span><b>${fmt(s.needed)}</b></div><div><span>Heute fehlen</span><b>${fmt(s.gap)}</b></div><div><span>Dealwert</span><b>${s.valueCt === null ? '—' : `${decimal(s.valueCt)} ct`}</b></div></div><p>${s.status}. ${s.projectedGap ? `Zum Reisemonat fehlen etwa ${fmt(s.projectedGap)} Meilen.` : `Ziel rechnerisch ${monthAfter(s.months)}.`}</p></article>`;
    const childNote = result.childDiscount ? '<p>Flying Blue: Für Kinder von 2–11 Jahren sind hier 25 % weniger Meilen als Planungsannahme berücksichtigt. Prüfe die Bedingungen für den konkreten Reward-Tarif. Zuzahlungen bleiben für jede Person voll angesetzt.</p>' : Number(input.children) ? '<p>Kinder von 2–11 Jahren werden hier vorsichtig mit vollem Meilenpreis gerechnet. Ein möglicher Child’s-Award-Rabatt hängt vom konkreten Programm und der Airline ab.</p>' : '';
    const transferNote = Number(input.bonus) > 0 ? `Der eingegebene Bonus von ${fmt(input.bonus)} % ist nur eine Annahme, keine bestätigte Aktion. ` : '';
    $('resultContent').innerHTML = `<div class="focus-result"><span class="overline">REALISTISCHER FAMILIENBEDARF</span><strong>${fmt(realistic.needed)} ${input.program === 'Miles & More' ? 'Meilen' : input.program === 'Avios' ? 'Avios' : 'Meilen'}</strong><p>${fmt(result.persons)} Personen · Hin- und Rückflug · ${leadText}</p></div>
      <div class="metric-line"><div class="metric"><span>Heute verfügbar*</span><strong>${fmt(result.available)}</strong></div><div class="metric"><span>Bis zur Reise*</span><strong>${fmt(result.projected)}</strong></div><div class="metric"><span>Realistische Lücke</span><strong>${fmt(realistic.gap)}</strong></div></div>
      <div class="scenario-heading"><h3>Drei Wege im Vergleich</h3><small>alle Werte für die Familie</small></div>${result.rows.map(card).join('')}
      <div class="deal-box"><h3>Der Cashvergleich</h3><div class="deal-grid"><div><span>Cashpreis gesamt</span><strong>${euro(realistic.cash)}</strong></div><div><span>Award-Zuzahlung gesamt</span><strong>${euro(realistic.taxes)}</strong></div><div><span>Preisunterschied</span><strong>${euro(realistic.net)}</strong></div><div><span>Rechnerisch pro Meile</span><strong>${realistic.valueCt === null ? '—' : `${decimal(realistic.valueCt)} ct`}</strong></div></div><p>Dealwert = (Cashpreis − Award-Zuzahlungen) ÷ eingesetzte Meilen × 100. ${realistic.net < 0 ? 'Hier ist der Award schon vor Bewertung der Meilen teurer als der Cashflug.' : 'Vergleiche dieselbe Strecke, Klasse, Gepäck und Tarifbedingungen.'}</p></div>
      <div class="result-foot"><strong>Meine Einordnung:</strong> ${transferNote}${source} → ${input.program}: ${ratio}, Mindesttransfer ${fmt(result.min)} Punkte. ${childNote}<p>* Bereits vorhandene ${input.program} Meilen plus nur transferierbare ${source} Punkte; monatliche Punkte werden bis zum Reisemonat hochgerechnet. Die Ampel bewertet rechnerische Punkte und Zeitpuffer, nicht Verfügbarkeit. Bei Flying Blue können Light, Standard und Flex verschiedene Leistungen enthalten. Datenbasis für Awardpreise: Planungsmatrix 10.05.2026; teils separat kalibriert 26.08.2026. Preise und Gebühren sind keine Liveangebote.</p></div>`;
    renderProgramCards();
  }
  function init() {
    const today = new Date();
    $('travelMonth').min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;
    if ($('travelMonth').value < $('travelMonth').min) $('travelMonth').value = `${today.getFullYear()+2}-07`;
    $('cashPp').addEventListener('input', () => { state.cashEdited = true; render(); });
    $('taxesPp').addEventListener('input', () => { state.taxesEdited = true; render(); });
    $('plannerForm').addEventListener('input', e => { if (e.target.id !== 'cashPp' && e.target.id !== 'taxesPp') render(); });
    $('plannerForm').addEventListener('change', e => { if (['destination','cabin','season'].includes(e.target.id)) setSuggestedPrice(); render(); });
    $('plannerForm').addEventListener('submit', e => e.preventDefault());
    $('programCards').addEventListener('click', e => { const button = e.target.closest('[data-program]'); if (!button) return; $('program').value = button.dataset.program; render(); $('planen').scrollIntoView({ behavior: 'smooth' }); $('program').focus({ preventScroll:true }); });
    setSuggestedPrice(); render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
