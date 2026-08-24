(() => {
  const root = document.querySelector('[data-rev-calculator]');
  if (!root) return;

  const moneySendInput = root.querySelector('#rev-moneysend');
  const cardSpendInput = root.querySelector('#rev-card-spend');
  const planSelect = root.querySelector('#rev-plan');
  const note = root.querySelector('#rev-calc-note');

  const outputs = {
    mmMonth: root.querySelector('#rev-mm-month'),
    mmYear: root.querySelector('#rev-mm-year'),
    rpMonth: root.querySelector('#rev-rp-month'),
    rpYear: root.querySelector('#rev-rp-year'),
    feeYear: root.querySelector('#rev-fee-year'),
    extraYear: root.querySelector('#rev-extra-year')
  };

  const plans = {
    standard: { divisor: 10, monthlyFee: 0, label: 'Standard' },
    plus: { divisor: 10, monthlyFee: 2.99, label: 'Plus' },
    premium: { divisor: 4, monthlyFee: 8.99, label: 'Premium' },
    metal: { divisor: 2, monthlyFee: 15.99, label: 'Metal' },
    ultra: { divisor: 1, monthlyFee: 65, label: 'Ultra' }
  };

  const number = (value) => {
    const parsed = Number(String(value ?? '').replace(',', '.'));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  };

  const formatPoints = (value) => Math.floor(value).toLocaleString('de-DE');
  const formatEuro = (value) => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  function update() {
    const moneySend = number(moneySendInput?.value);
    const cardSpend = number(cardSpendInput?.value);
    const plan = plans[planSelect?.value] || plans.standard;

    const mmMonth = Math.min(moneySend / 2, 2500);
    const mmYear = mmMonth * 12;
    const rpMonth = cardSpend / plan.divisor;
    const rpYear = rpMonth * 12;
    const standardYear = (cardSpend / 10) * 12;
    const extraYear = Math.max(0, rpYear - standardYear);
    const feeYear = plan.monthlyFee * 12;

    if (outputs.mmMonth) outputs.mmMonth.textContent = formatPoints(mmMonth);
    if (outputs.mmYear) outputs.mmYear.textContent = formatPoints(mmYear);
    if (outputs.rpMonth) outputs.rpMonth.textContent = formatPoints(rpMonth);
    if (outputs.rpYear) outputs.rpYear.textContent = formatPoints(rpYear);
    if (outputs.feeYear) outputs.feeYear.textContent = formatEuro(feeYear);
    if (outputs.extraYear) outputs.extraYear.textContent = formatPoints(extraYear);

    const messages = [];
    if (moneySend > 5000) messages.push('Das Money-Send-Meilenmaximum ist bereits erreicht; zusätzlicher Money-Send-Umsatz erhöht die 2.500 M&M-Meilen in dieser Periode nicht.');
    if (cardSpend > moneySend && moneySend > 0) messages.push('Die berechtigten Kartenausgaben liegen über dem eingegebenen Money-Send-Betrag. Das ist nur plausibel, wenn zusätzlich anderes Revolut-Guthaben bzw. Einkommen genutzt wird.');
    if (plan.monthlyFee > 0 && extraYear > 0) {
      const cents = (feeYear / extraYear) * 100;
      messages.push(`${plan.label}: Die reine Abo-Gebühr entspricht bei diesem Kartenumsatz rund ${cents.toLocaleString('de-DE', { maximumFractionDigits: 1 })} Cent je zusätzlichem RevPoint gegenüber Standard. Andere Abo-Vorteile sind dabei nicht bewertet.`);
    }
    messages.push('Berechnung mit privater Miles-&-More-Karte (1 Meile je 2 €) und dem offiziellen Money-Send-Maximum von 2.500 Meilen je Monat/Abrechnungsperiode. RevPoints nur für berechtigte Kartenausgaben.');
    if (note) note.textContent = messages.join(' ');
  }

  [moneySendInput, cardSpendInput, planSelect].forEach((el) => {
    el?.addEventListener('input', update);
    el?.addEventListener('change', update);
  });

  update();
})();