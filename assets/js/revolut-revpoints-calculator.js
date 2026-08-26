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

  const numericData = (name, fallback) => {
    const parsed = Number(root.dataset[name]);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const mmEarnDivisor = numericData('mmEarnDivisor', 2);
  const mmCap = numericData('mmCap', 2500);
  const plans = {
    standard: { divisor: numericData('standardDivisor', 10), monthlyFee: numericData('standardFee', 0), label: 'Standard' },
    plus: { divisor: numericData('plusDivisor', 10), monthlyFee: numericData('plusFee', 2.99), label: 'Plus' },
    premium: { divisor: numericData('premiumDivisor', 4), monthlyFee: numericData('premiumFee', 8.99), label: 'Premium' },
    metal: { divisor: numericData('metalDivisor', 2), monthlyFee: numericData('metalFee', 15.99), label: 'Metal' },
    ultra: { divisor: numericData('ultraDivisor', 1), monthlyFee: numericData('ultraFee', 65), label: 'Ultra' }
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

    const mmMonth = Math.min(moneySend / mmEarnDivisor, mmCap);
    const mmYear = mmMonth * 12;
    const rpMonth = cardSpend / plan.divisor;
    const rpYear = rpMonth * 12;
    const standardYear = (cardSpend / plans.standard.divisor) * 12;
    const extraYear = Math.max(0, rpYear - standardYear);
    const feeYear = plan.monthlyFee * 12;
    const moneySendAmountAtCap = mmCap * mmEarnDivisor;

    if (outputs.mmMonth) outputs.mmMonth.textContent = formatPoints(mmMonth);
    if (outputs.mmYear) outputs.mmYear.textContent = formatPoints(mmYear);
    if (outputs.rpMonth) outputs.rpMonth.textContent = formatPoints(rpMonth);
    if (outputs.rpYear) outputs.rpYear.textContent = formatPoints(rpYear);
    if (outputs.feeYear) outputs.feeYear.textContent = formatEuro(feeYear);
    if (outputs.extraYear) outputs.extraYear.textContent = formatPoints(extraYear);

    const messages = [];
    if (moneySend > moneySendAmountAtCap) messages.push(`Das Money-Send-Meilenmaximum ist bereits erreicht; zusätzlicher Money-Send-Umsatz erhöht die ${formatPoints(mmCap)} M&M-Meilen in dieser Periode nicht.`);
    if (cardSpend > moneySend && moneySend > 0) messages.push('Die berechtigten Kartenausgaben liegen über dem eingegebenen Money-Send-Betrag. Das ist nur plausibel, wenn zusätzlich anderes Revolut-Guthaben bzw. Einkommen genutzt wird.');
    if (plan.monthlyFee > 0 && extraYear > 0) {
      const cents = (feeYear / extraYear) * 100;
      messages.push(`${plan.label}: Die reine Abo-Gebühr entspricht bei diesem Kartenumsatz rund ${cents.toLocaleString('de-DE', { maximumFractionDigits: 1 })} Cent je zusätzlichem RevPoint gegenüber Standard. Andere Abo-Vorteile sind dabei nicht bewertet.`);
    }
    messages.push(`Berechnung mit privater Miles-&-More-Karte (1 Meile je ${mmEarnDivisor.toLocaleString('de-DE')} €) und dem offiziellen Money-Send-Maximum von ${formatPoints(mmCap)} Meilen je Monat/Abrechnungsperiode. RevPoints nur für berechtigte Kartenausgaben.`);
    if (note) note.textContent = messages.join(' ');
  }

  [moneySendInput, cardSpendInput, planSelect].forEach((el) => {
    el?.addEventListener('input', update);
    el?.addEventListener('change', update);
  });

  update();
})();