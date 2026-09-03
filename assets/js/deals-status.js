(() => {
  function initDealStatus() {
    const cards = Array.from(document.querySelectorAll('[data-deal-card]'));
    const activeCount = document.querySelector('[data-active-deal-count]');
    if (!cards.length) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let activeDeals = 0;

    cards.forEach((card) => {
      const expires = card.dataset.expires;
      const expiresDisplay = card.dataset.expiresDisplay;
      const status = card.querySelector('[data-deal-status]');
      const cta = card.querySelector('[data-deal-cta]');
      if (!expires || !status) return;

      const expiryDate = new Date(`${expires}T23:59:59`);
      const expired = today.getTime() > expiryDate.getTime();

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
