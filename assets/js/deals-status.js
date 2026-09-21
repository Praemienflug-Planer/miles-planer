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

    const grid = document.querySelector('.deal-grid');
    if (grid) {
      const offers = Array.from(grid.querySelectorAll(':scope > [data-deal-card]'));
      const current = offers.filter((card) => !card.classList.contains('is-expired'));
      const archive = offers.filter((card) => card.classList.contains('is-expired'));
      grid.append(...current, ...archive);
    }

    document.querySelectorAll('[data-deal-comparison]').forEach((comparison) => {
      const expires = comparison.dataset.comparisonExpires;
      if (!expires || todayInGermany <= expires) return;

      const heading = comparison.querySelector('[data-comparison-heading]');
      const text = comparison.querySelector('[data-comparison-text]');
      const link = comparison.querySelector('[data-comparison-link]');
      if (heading && comparison.dataset.expiredHeading) heading.textContent = comparison.dataset.expiredHeading;
      if (text && comparison.dataset.expiredText) text.textContent = comparison.dataset.expiredText;
      if (link && comparison.dataset.expiredUrl && comparison.dataset.expiredLabel) {
        link.setAttribute('href', comparison.dataset.expiredUrl);
        link.textContent = comparison.dataset.expiredLabel;
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
