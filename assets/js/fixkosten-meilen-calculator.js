(() => {
  const root = document.querySelector('[data-fixkosten-calculator]');
  if (!root) return;

  const fields = {
    amexSpend: root.querySelector('#fix-amex-spend'),
    turbo: root.querySelector('#fix-amex-turbo'),
    mmSpend: root.querySelector('#fix-mm-spend'),
    moneySend: root.querySelector('#fix-moneysend'),
    revolutSpend: root.querySelector('#fix-revolut-spend'),
    revolutPlan: root.querySelector('#fix-revolut-plan'),
    paybackMonth: root.querySelector('#fix-payback-month')
  };

  const outputs = {
    mrYear: root.querySelector('#fix-mr-year'),
    mmYear: root.querySelector('#fix-mm-year'),
    revYear: root.querySelector('#fix-rev-year'),
    paybackYear: root.querySelector('#fix-payback-year'),
    mmWithPayback: root.querySelector('#fix-mm-with-payback'),
    feesYear: root.querySelector('#fix-fees-year'),
    note: root.querySelector('#fix-calc-note')
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

  const fmt = (value) => Math.floor(value).toLocaleString('de-DE');
  const euro = (value) => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  function update() {
    const amexMonth = number(fields.amexSpend?.value);
    const turboOn = Boolean(fields.turbo?.checked);
    const mmMonthSpend = number(fields.mmSpend?.value);
    const moneySendMonth = number(fields.moneySend?.value);
    const revolutEligibleMonth = number(fields.revolutSpend?.value);
    const paybackMonth = number(fields.paybackMonth?.value);
    const plan = plans[fields.revolutPlan?.value] || plans.standard;

    const amexYearSpend = amexMonth * 12;
    const mrBaseYear = amexYearSpend;
    const mrTurboExtraYear = turboOn ? Math.min(amexYearSpend, 40000) / 2 : 0;
    const mrYear = mrBaseYear + mrTurboExtraYear;

    const mmDirectYear = (mmMonthSpend / 2) * 12;
    const mmMoneySendMonth = Math.min(moneySendMonth / 2, 2500);
    const mmMoneySendYear = mmMoneySendMonth * 12;
    const mmYear = mmDirectYear + mmMoneySendYear;

    const revYear = (revolutEligibleMonth / plan.divisor) * 12;
    const paybackYear = paybackMonth * 12;
    const mmWithPayback = mmYear + paybackYear;
    const feesYear = (plan.monthlyFee * 12) + (turboOn ? 15 : 0);

    if (outputs.mrYear) outputs.mrYear.textContent = fmt(mrYear);
    if (outputs.mmYear) outputs.mmYear.textContent = fmt(mmYear);
    if (outputs.revYear) outputs.revYear.textContent = fmt(revYear);
    if (outputs.paybackYear) outputs.paybackYear.textContent = fmt(paybackYear);
    if (outputs.mmWithPayback) outputs.mmWithPayback.textContent = fmt(mmWithPayback);
    if (outputs.feesYear) outputs.feesYear.textContent = euro(feesYear);

    const messages = [];
    if (moneySendMonth > 5000) {
      messages.push('Beim Money-Send-Weg ist das offizielle Maximum von 2.500 Miles-&-More-Meilen je Monat/Abrechnungsperiode bereits ausgeschöpft; mehr als 5.000 € erhöhen bei der privaten Sammelrate von 1 Meile je 2 € die Meilengutschrift nicht weiter.');
    }
    if (turboOn && amexYearSpend > 40000) {
      messages.push('Beim Amex Turbo gilt die erhöhte Sammelrate nur für die ersten 40.000 € Jahresumsatz; darüber rechnet der Rechner mit der normalen Rate von 1 Membership-Rewards-Punkt je 1 €.');
    }
    if (revolutEligibleMonth > moneySendMonth && moneySendMonth > 0) {
      messages.push('Die eingegebenen RevPoints-berechtigten Revolut-Ausgaben liegen über dem Money-Send-Betrag. Das ist möglich, wenn zusätzlich anderes Revolut-Guthaben oder Einkommen genutzt wird.');
    }
    messages.push('Die Geldbeträge dürfen sich überschneiden: Ein Einkauf kann z. B. aus zuvor per MoneySend aufgeladenem Revolut-Guthaben bezahlt werden. Dann entstehen die M&M-Meilen beim Aufladen und – sofern der Händler qualifiziert – zusätzlich RevPoints beim Bezahlen.');
    messages.push('Die ausgewiesenen Zusatzkosten enthalten nur den Amex Turbo und das gewählte Revolut-Abo. Kartenpreise von Amex- oder Miles-&-More-Karten sind nicht enthalten. PAYBACK wird mit dem regulären 1:1-Transfer zu Miles & More gerechnet.');
    if (outputs.note) outputs.note.textContent = messages.join(' ');
  }

  Object.values(fields).forEach((field) => {
    field?.addEventListener('input', update);
    field?.addEventListener('change', update);
  });

  update();
})();