(() => {
  const STORAGE_KEY = 'pfp_conversion_events';
  const MAX_EVENTS = 80;

  function readEvents() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (_) {
      return [];
    }
  }

  function writeEvent(eventName, meta = {}) {
    const events = readEvents();
    events.push({
      event: eventName,
      path: window.location.pathname,
      ts: new Date().toISOString(),
      meta
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-event], a[href*="kontakt.html"], a[href*="/rechner/"]');
    if (!target) return;

    const explicit = target.getAttribute('data-event');
    const href = target.getAttribute('href') || '';
    let eventName = explicit;

    if (!eventName && href.includes('/rechner/')) eventName = 'click_rechner';
    if (!eventName && href.includes('kontakt.html')) eventName = 'click_contact';

    if (eventName) {
      writeEvent(eventName, {
        text: target.textContent.trim().slice(0, 80),
        href
      });
    }
  });

  window.pfpConversionEvents = {
    list: readEvents,
    clear: () => localStorage.removeItem(STORAGE_KEY)
  };
})();
