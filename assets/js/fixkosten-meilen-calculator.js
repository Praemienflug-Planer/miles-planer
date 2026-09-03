(() => {
  const root = document.querySelector('[data-fixkosten-calculator]');
  if (!root) return;

  const rows = Array.from(root.querySelectorAll('[data-fix-category]'));
  const turbo = root.querySelector('#fix-amex-turbo');
  const revolutPlan = root.querySelector('#fix-revolut-plan');
  const paybackMonth = root.querySelector('#fix-payback-month');
  const paybackBonusYear = root.querySelector('#fix-payback-bonus-year');

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
    routeBankDirect: root.querySelector('#fix-route-bank-direct'),
    strategyBody: root.querySelector('#fix-strategy-body'),
    note: root.querySelector('#fix-calc-note')
  };

  const parseValue = (value, fallback = 0) => {
    const parsed = Number(String(value ?? '').replace(',', '.'));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  };

  const mmEarnDivisor = parseValue(root.dataset.mmEarnDivisor, 2) || 2;
  const mmMoneySendCapMiles = parseValue(root.dataset.mmMoneysendCapMiles, 2500) || 2500;
  const moneySendEuroCap = mmEarnDivisor * mmMoneySendCapMiles;

  const plans = {
    standard: {
      divisor: parseValue(root.dataset.revStandardDivisor, 10) || 10,
      monthlyFee: parseValue(root.dataset.revStandardFee, 0),
      label: 'Standard'
    },
    plus: {
      divisor: parseValue(root.dataset.revPlusDivisor, 10) || 10,
      monthlyFee: parseValue(root.dataset.revPlusFee, 2.99),
      label: 'Plus'
    },
    premium: {
      divisor: parseValue(root.dataset.revPremiumDivisor, 4) || 4,
      monthlyFee: parseValue(root.dataset.revPremiumFee, 8.99),
      label: 'Premium'
    },
    metal: {
      divisor: parseValue(root.dataset.revMetalDivisor, 2) || 2,
      monthlyFee: parseValue(root.dataset.revMetalFee, 15.99),
      label: 'Metal'
    },
    ultra: {
      divisor: parseValue(root.dataset.revUltraDivisor, 1) || 1,
      monthlyFee: parseValue(root.dataset.revUltraFee, 65),
      label: 'Ultra'
    }
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
        payment: paymentField?.value || 'bank_direct',
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
        points: `M&M: 1 Meile je ${fmt(mmEarnDivisor)} €; kein regulärer RevPoints-Vorteil`
      };
    }

    if (category.payment === 'bank_revolut') {
      return {
        tag: 'M&M → Revolut → Bankzahlung',
        points: 'M&M via MoneySend bis zum Limit; Überweisung/Lastschrift selbst ohne RevPoints'
      };
    }

    return {
      tag: 'Normale Bankzahlung',
      points: 'In diesem Rechner keine Punkte- oder Meilengutschrift angesetzt'
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
    const paybackBonusPerYear = number(paybackBonusYear?.value);

    let totalMonth = 0;
    let amexMonth = 0;
    let revolutRoutedMonth = 0;
    let revEligibleCardMonth = 0;
    let mmDirectMonth = 0;
    let moneySendCandidateMonth = 0;
    let bankViaRevolutMonth = 0;
    let bankDirectMonth = 0;

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

      if (category.payment === 'bank_revolut') {
        bankViaRevolutMonth += category.amount;
        revolutRoutedMonth += category.amount;
        moneySendCandidateMonth += category.amount;
        return;
      }

      bankDirectMonth += category.amount;
    });

    const recommendedMoneySendMonth = Math.min(moneySendCandidateMonth, moneySendEuroCap);

    const amexYearSpend = amexMonth * 12;
    const mrBaseYear = amexYearSpend;
    const mrTurboExtraYear = turboOn ? Math.min(amexYearSpend, 40000) / 2 : 0;
    const mrYear = mrBaseYear + mrTurboExtraYear;

    const mmDirectYear = (mmDirectMonth / mmEarnDivisor) * 12;
    const mmMoneySendYear = (recommendedMoneySendMonth / mmEarnDivisor) * 12;
    const mmYear = mmDirectYear + mmMoneySendYear;

    const revYear = (revEligibleCardMonth / plan.divisor) * 12;
    const paybackYear = (paybackPerMonth * 12) + paybackBonusPerYear;
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
    if (outputs.routeBankDirect) outputs.routeBankDirect.textContent = `${euro(bankDirectMonth)} / Monat`;

    renderStrategy(categories, turboOn);

    const messages = [];

    if (!totalMonth) {
      messages.push('Trage zuerst deine echten monatlichen Ausgaben ein. Die Zahlungsarten sind nur Startwerte und sollten an die tatsächliche Akzeptanz deiner Anbieter angepasst werden.');
    }

    if (moneySendCandidateMonth > moneySendEuroCap) {
      messages.push(`Von ${euro(moneySendCandidateMonth)} grundsätzlich über Revolut finanzierbaren Ausgaben setzt der Rechner nur ${euro(moneySendEuroCap)} als MoneySend mit M&M-Meilengutschrift an, weil damit das offizielle Limit von ${fmt(mmMoneySendCapMiles)} Meilen bereits ausgeschöpft ist.`);
      if (revEligibleCardMonth > 0) {
        messages.push('RevPoints-fähige Kartenumsätze können im Szenario trotzdem weiter über Revolut laufen. Oberhalb des MoneySend-Limits vergleicht der Rechner aber nicht automatisch, ob direkte M&M-Zahlung oder zusätzliche RevPoints für dich wertvoller sind.');
      }
    } else if (moneySendCandidateMonth > 0 && moneySendCandidateMonth < moneySendEuroCap && amexMonth > 0) {
      messages.push(`Das MoneySend-Potenzial liegt mit ${euro(recommendedMoneySendMonth)} unter ${euro(moneySendEuroCap)}. Zusätzliche Amex-fähige Umsätze nur zum Auffüllen auf Revolut zu verschieben kann mehr M&M bringen, kostet aber Membership Rewards und wird deshalb nicht automatisch empfohlen.`);
    }

    if (turboOn && amexYearSpend > 40000) {
      messages.push('Der Amex Turbo wird nur auf die ersten 40.000 € Amex-Jahresumsatz mit der erhöhten Rate gerechnet; darüber gilt im Rechner 1 MR je 1 €.');
    }

    if (bankViaRevolutMonth > 0) {
      messages.push('Bei als „über Revolut möglich“ markierten Überweisungen und Lastschriften setzt das Szenario voraus, dass der Empfänger bzw. das Mandat praktisch über das Revolut-Konto abgewickelt werden kann. Die Bankzahlung selbst erzeugt keine RevPoints.');
    }

    if (bankDirectMonth > 0) {
      messages.push(`${euro(bankDirectMonth)} monatliche Bankzahlungen sind als „Revolut nicht möglich“ markiert und werden deshalb bewusst ohne Punkte- oder Meilengutschrift gerechnet.`);
    }

    if (plan.monthlyFee > 0) {
      messages.push(`Für Revolut ${plan.label} berücksichtigt der Rechner ${euro(plan.monthlyFee * 12, 2)} Jahreskosten. Das bedeutet nicht automatisch, dass sich das Abo allein wegen der zusätzlichen RevPoints lohnt.`);
    }

    if (paybackBonusPerYear > 0) {
      messages.push(`${fmt(paybackBonusPerYear)} PAYBACK Punkte aus Einmal- oder Aktionsboni werden genau einmal im Jahreswert berücksichtigt.`);
    }

    messages.push('Der Rechner ist eine regelbasierte Zahlungsweg-Planung, kein Euro-Wert-Optimizer: Membership Rewards, Miles-&-More-Meilen und RevPoints werden nicht künstlich zu einer gemeinsamen Währung verrechnet.');
    messages.push('Die ausgewiesenen Zusatzkosten enthalten nur Rewards Turbo und das gewählte Revolut-Abo. Kartenpreise einer Amex oder Miles-&-More-Kreditkarte sind nicht enthalten.');
    messages.push('PAYBACK bleibt ein separater Punktetopf und wird hier nur optional mit dem regulären 1:1-Transfer zu Miles & More in das M&M-Potenzial eingerechnet. Monatliche Punkte werden mit zwölf multipliziert; Einmalboni nicht.');

    if (outputs.note) outputs.note.textContent = messages.join(' ');
  }

  root.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', update);
    field.addEventListener('change', update);
  });

  update();
})();
