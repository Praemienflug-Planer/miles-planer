(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.FamilyPlanner = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STEPS = { 'Miles & More': 1, Avios: 500, 'Flying Blue': 5, KrisFlyer: 3 };
  const MINIMUMS = { 'Miles & More': 200, Avios: 1000, 'Flying Blue': 625, KrisFlyer: 1500 };
  const RATIOS = { 'Miles & More': [1, 1], Avios: [4, 5], 'Flying Blue': [4, 5], KrisFlyer: [2, 3] };
  const SCENARIOS = [
    { key: 'best', title: 'Günstig', detail: 'niedriger Planungswert' },
    { key: 'real', title: 'Realistisch', detail: 'mittlerer Planungswert' },
    { key: 'cons', title: 'Vorsichtig', detail: 'höherer Planungswert' }
  ];
  function whole(value) { const n = Number(value); return Number.isInteger(n) && n >= 0 ? n : NaN; }
  function converted(source, program, bonus = 0) {
    const points = whole(source), pct = Number(bonus);
    if (!Number.isFinite(points) || !Number.isFinite(pct) || pct < 0 || pct > 100 || !RATIOS[program]) return NaN;
    if (points < MINIMUMS[program]) return 0;
    const transferable = Math.floor(points / STEPS[program]) * STEPS[program];
    const [numerator, denominator] = RATIOS[program];
    return Math.floor((transferable * numerator / denominator) * (1 + pct / 100));
  }
  function monthsBetween(now, year, month) {
    const y = Number(year), m = Number(month);
    if (!Number.isInteger(y) || !Number.isInteger(m) || m < 1 || m > 12) return NaN;
    return (y - now.getFullYear()) * 12 + m - (now.getMonth() + 1);
  }
  function monthReached(input, needed, now = new Date()) {
    const native = whole(input.nativePoints), source = whole(input.sourcePoints), rate = whole(input.monthlyPoints);
    if (![native, source, rate].every(Number.isFinite)) return NaN;
    if (native + converted(source, input.program, input.bonus) >= needed) return 0;
    if (rate === 0) return Infinity;
    // Monotone search respects minimum transfers and steps without rounding every month's accrual.
    let low = 0, high = 1;
    const at = n => native + converted(source + rate * n, input.program, input.bonus);
    while (high < 1200 && at(high) < needed) high *= 2;
    if (high >= 1200 && at(high) < needed) return Infinity;
    while (low + 1 < high) { const mid = Math.floor((low + high) / 2); if (at(mid) >= needed) high = mid; else low = mid; }
    return high;
  }
  function calculate(input, rate, now = new Date()) {
    const adults = whole(input.adults), children = whole(input.children), native = whole(input.nativePoints), source = whole(input.sourcePoints), monthly = whole(input.monthlyPoints);
    const cashPp = Number(input.cashPp), taxesPp = Number(input.taxesPp), bonus = Number(input.bonus);
    if (!rate || !RATIOS[input.program]) return { error: 'Bitte Ziel, Reiseklasse und Programm wählen.' };
    if (![adults, children, native, source, monthly, cashPp, taxesPp, bonus].every(Number.isFinite) || adults < 1 || adults + children < 2 || adults + children > 8 || cashPp < 0 || taxesPp < 0 || bonus < 0 || bonus > 100) return { error: 'Bitte gültige Werte eintragen: 2–8 Personen, mindestens ein Erwachsener und keine negativen Beträge.' };
    const lead = monthsBetween(now, input.year, input.month);
    if (!Number.isFinite(lead) || lead < 0) return { error: 'Bitte einen Reisemonat ab dem aktuellen Monat wählen.' };
    const persons = adults + children;
    const factor = input.season === 'Ferien' ? Number(rate.faktorFerien) : input.season === 'Hauptreisezeit' ? Number(rate.faktorHauptsaison) : Number(rate.faktorNebensaison);
    const childShare = input.program === 'Flying Blue' ? adults + 0.75 * children : persons;
    const available = native + converted(source, input.program, bonus);
    const projected = native + converted(source + monthly * lead, input.program, bonus);
    const rows = SCENARIOS.map(s => {
      const milesFactor = rate.seasonFactorMode === 'miles-only' || rate.seasonFactorMode === 'included' ? 1 : factor;
      const needed = Math.ceil(Number(rate[s.key + 'MilesRtPp']) * milesFactor * childShare);
      const taxes = Math.round(taxesPp * persons);
      const cash = Math.round(cashPp * persons);
      const net = cash - taxes;
      const months = monthReached(input, needed, now);
      const gap = Math.max(0, needed - available);
      const projectedGap = Math.max(0, needed - projected);
      const valueCt = cashPp > 0 ? net / needed * 100 : null;
      let light = 'red', status = 'Punkte reichen bis zur Reise voraussichtlich nicht';
      if (projectedGap === 0 && months <= lead) {
        light = lead - months >= 3 ? 'green' : 'amber';
        status = light === 'green' ? 'Punkte rechnerisch mit Zeitpuffer erreichbar' : 'Punkte rechnerisch erst knapp vor der Reise erreichbar';
      }
      return { ...s, needed, gap, projectedGap, months, taxes, cash, net, valueCt, light, status, pp: Math.ceil(needed / childShare) };
    });
    return { persons, childDiscount: input.program === 'Flying Blue' && children > 0, available, projected, lead, factor, rows, ratio: RATIOS[input.program], min: MINIMUMS[input.program], step: STEPS[input.program] };
  }
  return { calculate, converted, monthsBetween, monthReached, SCENARIOS };
});
