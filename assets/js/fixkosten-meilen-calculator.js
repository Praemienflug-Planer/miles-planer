(() => {
  const root = document.querySelector('[data-fixkosten-calculator]');
  if (!root) return;

  const rows = Array.from(root.querySelectorAll('[data-fix-category]'));
  const turbo = root.querySelector('#fix-amex-turbo');
  const revolutPlan = root.querySelector('#fix-revolut-plan');
  const paybackMonth = root.querySelector('#fix-payback-month');

  const outputs = {
    totalMonth: root.querySelector('#fix-total-month'),
    moneySendMonth: root.querySelector('#fix-moneysend-month'),
    mrYear: root.querySelector('#fix-mr-year'),
    mmYear: root.querySelector('#fix-mm-year'),
    revYear: root.querySelector('#fix-rev-year'),
    paybackYear: root.querySelector('#fix-payback-year'),
    mmWithPayback: root.querySelector('#fix-mm-with-payback'),
    feesYear: root.querySelector('#fix-fees-year'),
    routeAmex: root.querySelector('#fix-route-amex'),
    routeRevolut: root.querySelector('#fix-route-revolut'),
    routeMmDirect: root.querySelector('#fix-route-mm-direct'),
    strategyBody: root.querySelector('#fix-strategy-body'),
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
  const euro = (value, digits = 0) => value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });

  function readCategories() {
    return rows.map((row) => {
      const amountField = row.querySelector('[data-amount]');
      const paymentField = row.querySelector('[data-payment]');
      return {
        key: row.dataset.fixCategory || '',
        label: row.querySelector('.fix-category-name strong')?.textContent?.trim() || 'Ausgabe',
        amount: number(amountField?.value),
        payment: paymentField?.value || 'bank',
        revEligible: row.dataset.revEligible === 'true'
      };
    });
  }

  function routeFor(category, turboOn) {
    if (category.payment === 'amex') {
      return {
        tag: 'Amex direkt',
        points: turboOn ? 'MR: 1,5 Punkte/€ bis zum Turbo-Limit' : 'MR: 1 Punkt/€'
      };
    }

    if (category.payment === 'card') {
      if (category.revEligible) {
        return {
          tag: 'M&M → Revolut → Karte',
          points: 'M&M via MoneySend bis zum Limit + RevPoints beim berechtigten Einkauf'
        };
      }
      return {
        tag: 'M&M Kreditkarte direkt',
        points: 'M&M: 1 Meile je 2 €; kein regulärer RevPoints-Vorteil'
      };
    }

    return {
      tag: 'M&M → Revolut → Bankzahlung',
      points: 'M&M via MoneySend bis zum Limit; Überweisung/Lastschrift selbst ohne RevPoints'
    };
  }

  function renderStrategy(categories, turboOn) {
    if (!outputs.strategyBody) return;
    const active = categories.filter((category) => category.amount > 0);
    if (!active.length) {
      outputs.strategyBody.innerHTML = '<tr><td colspan="4">Trage oben deine monatlichen Ausgaben ein.</td></tr>';
      return;
    }

    outputs.strategyBody.innerHTML = active.map((category) => {
      const route = routeFor(category, turboOn);
      return `<tr><td>${category.label}</td><td>${euro(category.amount)}</td><td><span class="fix-route-tag">${route.tag}</span></td><td>${route.points}</td></tr>`;
    }).join('');
  }

  function update() {
    const categories = readCategories();
    const turboOn = Boolean(turbo?.checked);
    const plan = plans[revolutPlan?.value] || plans.standard;
    const paybackPerMonth = number(paybackMonth?.value);

    let totalMonth = 0;
    let amexMonth = 0;
    let revolutRoutedMonth = 0;
    let revEligibleCardMonth = 0;
    let mmDirectMonth = 0;
    let moneySendCandidateMonth = 0;
    let bankMonth = 0;

    categories.forEach((category) => {
      totalMonth += category.amount;
      if (!category.amount) return;

      if (category.payment === 'amex') {
        amexMonth += category.amount;
        return;
      }

      if (category.payment === 'card') {
        if (category.revEligible) {
          revolutRoutedMonth += category.amount;
          revEligibleCardMonth += category.amount;
          moneySendCandidateMonth += category.amount;
        } else {
          mmDirectMonth += category.amount;
        }
        return;
      }

      bankMonth += category.amount;
      revolutRoutedMonth += category.amount;
      moneySendCandidateMonth += category.amount;
    });

    const recommendedMoneySendMonth = Math.min(moneySendCandidateMonth, 5000);

    const amexYearSpend = amexMonth * 12;
    const mrBaseYear = amexYearSpend;
    const mrTurboExtraYear = turboOn ? Math.min(amexYearSpend, 40000) / 2 : 0;
    const mrYear = mrBaseYear + mrTurboExtraYear;

    const mmDirectYear = (mmDirectMonth / 2) * 12;
    const mmMoneySendYear = (recommendedMoneySendMonth / 2) * 12;
    const mmYear = mmDirectYear + mmMoneySendYear;

    const revYear = (revEligibleCardMonth / plan.divisor) * 12;
    const paybackYear = paybackPerMonth * 12;
    const mmWithPayback = mmYear + paybackYear;
    const feesYear = (plan.monthlyFee * 12) + (turboOn ? 15 : 0);

    if (outputs.totalMonth) outputs.totalMonth.textContent = euro(totalMonth);
    if (outputs.moneySendMonth) outputs.moneySendMonth.textContent = euro(recommendedMoneySendMonth);
    if (outputs.mrYear) outputs.mrYear.textContent = fmt(mrYear);
    if (outputs.mmYear) outputs.mmYear.textContent = fmt(mmYear);
    if (outputs.revYear) outputs.revYear.textContent = fmt(revYear);
    if (outputs.paybackYear) outputs.paybackYear.textContent = fmt(paybackYear);
    if (outputs.mmWithPayback) outputs.mmWithPayback.textContent = fmt(mmWithPayback);
    if (outputs.feesYear) outputs.feesYear.textContent = euro(feesYear, 2);
    if (outputs.routeAmex) outputs.routeAmex.textContent = `${euro(amexMonth)} / Monat`;
    if (outputs.routeRevolut) outputs.routeRevolut.textContent = `${euro(revolutRoutedMonth)} / Monat`;
    if (outputs.routeMmDirect) outputs.routeMmDirect.textContent = `${euro(mmDirectMonth)} / Monat`;

    renderStrategy(categories, turboOn);

    const messages = [];

    if (!totalMonth) {
      messages.push('Trage zuerst deine echten monatlichen Ausgaben ein. Die Zahlungsarten sind nur Startwerte und sollten an die tatsächliche Akzeptanz deiner Anbieter angepasst werden.');
    }

    if (moneySendCandidateMonth > 5000) {
      messages.push(`Von ${euro(moneySendCandidateMonth)} grundsätzlich über Revolut finanzierbaren Ausgaben setzt der Rechner nur ${euro(5000)} als empfohlenes MoneySend an, weil damit das monatliche M&M-Limit bereits ausgeschöpft ist.`);
    } else if (moneySendCandidateMonth > 0 && moneySendCandidateMonth < 5000 && amexMonth > 0) {
      messages.push(`Das MoneySend-Potenzial liegt mit ${euro(recommendedMoneySendMonth)} unter 5.000 €. Zusätzliche Amex-fähige Umsätze nur zum Auffüllen auf Revolut zu verschieben kann mehr M&M bringen, kostet aber Membership Rewards und sollte deshalb nicht automatisch erfolgen.`);
    }

    if (turboOn && amexYearSpend > 40000) {
      messages.push('Der Amex Turbo wird nur auf die ersten 40.000 € Amex-Jahresumsatz mit der erhöhten Rate gerechnet; darüber gilt im Rechner 1 MR je 1 €.');
    }

    if (bankMonth > 0) {
      messages.push('Bei Überweisungen und Lastschriften setzt die Empfehlung voraus, dass der Empfänger bzw. das Mandat praktisch über das Revolut-Konto abgewickelt werden kann. Die Bankzahlung selbst erzeugt keine RevPoints.');
    }

    if (plan.monthlyFee > 0) {
      messages.push(`Für Revolut ${plan.label} berücksichtigt der Rechner ${euro(plan.monthlyFee * 12, 2)} Jahreskosten. Das bedeutet nicht automatisch, dass sich das Abo allein wegen der zusätzlichen RevPoints lohnt.`);
    }

    messages.push('Die ausgewiesenen Zusatzkosten enthalten nur Rewards Turbo und das gewählte Revolut-Abo. Kartenpreise einer Amex oder Miles-&-More-Kreditkarte sind nicht enthalten.');
    messages.push('PAYBACK bleibt ein separater Punktetopf und wird hier nur optional mit dem regulären 1:1-Transfer zu Miles & More in das M&M-Potenzial eingerechnet.');

    if (outputs.note) outputs.note.textContent = messages.join(' ');
  }

  root.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', update);
    field.addEventListener('change', update);
  });

  update();
})();