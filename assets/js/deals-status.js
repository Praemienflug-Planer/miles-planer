(() => {
  const DEAL_TIME_ZONE = 'Europe/Berlin';

  function getIsoDateInTimeZone(date, timeZone) {
    const parts = {};

    new Intl.DateTimeFormat('de-DE', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date).forEach(({ type, value }) => {
      if (type !== 'literal') parts[type] = value;
    });

    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function initDealStatus() {
    const cards = Array.from(document.querySelectorAll('[data-deal-card]'));
    const activeCount = document.querySelector('[data-active-deal-count]');
    if (!cards.length) return;

    const todayInGermany = getIsoDateInTimeZone(new Date(), DEAL_TIME_ZONE);
    let activeDeals = 0;

    cards.forEach((card) => {
      const expires = card.dataset.expires;
      const expiresDisplay = card.dataset.expiresDisplay;
      const status = card.querySelector('[data-deal-status]');
      const cta = card.querySelector('[data-deal-cta]');
      if (!expires || !status) return;

      const expired = todayInGermany > expires;

      if (!expired) {
        activeDeals += 1;
        return;
      }

      card.classList.add('is-expired');
      status.lastChild.textContent = `Abgelaufen am ${expiresDisplay}`;

      if (cta) {
        cta.removeAttribute('href');
        cta.removeAttribute('target');
        cta.setAttribute('aria-disabled', 'true');
        cta.textContent = 'Angebot abgelaufen';
      }
    });

    if (activeCount) activeCount.textContent = String(activeDeals);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDealStatus);
  } else {
    initDealStatus();
  }
})();
