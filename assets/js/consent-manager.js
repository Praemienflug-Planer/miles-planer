(() => {
  if (window.__pfpConsentManagerLoaded) return;
  window.__pfpConsentManagerLoaded = true;

  const STORAGE_KEY = 'pfp_analytics_consent';
  const GA_ID = 'G-HX9T5TXN7G';
  const VALID_CHOICES = new Set(['granted', 'denied']);
  let analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function readChoice() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return VALID_CHOICES.has(value) ? value : '';
    } catch (error) {
      return '';
    }
  }

  function storeChoice(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch (error) {
      // The decision still applies for this page view if storage is unavailable.
    }
  }

  function deleteAnalyticsCookies() {
    document.cookie.split(';').forEach((item) => {
      const name = item.split('=')[0]?.trim();
      if (!name || (!name.startsWith('_ga') && name !== '_gid')) return;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.praemienflug-planer.de; SameSite=Lax`;
    });
  }

  function loadAnalytics() {
    if (analyticsLoaded || document.querySelector(`script[data-pfp-ga="${GA_ID}"]`)) return;
    analyticsLoaded = true;
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    script.dataset.pfpGa = GA_ID;
    document.head.appendChild(script);
  }

  function updateConsent(choice, { persist = true } = {}) {
    const granted = choice === 'granted';
    window.pfpAnalyticsConsent = choice;
    if (persist) storeChoice(choice);
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    if (granted) loadAnalytics();
    else deleteAnalyticsCookies();
    window.dispatchEvent(new CustomEvent('pfp:analytics-consent', { detail: { choice } }));
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    dialog.hidden = true;
    document.body.classList.remove('consent-dialog-open');
  }

  function buildDialog() {
    if (document.getElementById('consentDialog')) return document.getElementById('consentDialog');
    const dialog = document.createElement('section');
    dialog.id = 'consentDialog';
    dialog.className = 'consent-dialog';
    dialog.hidden = true;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'consentTitle');
    dialog.innerHTML = `
      <div class="consent-dialog-card">
        <p class="eyebrow">Datenschutz-Einstellung</p>
        <h2 id="consentTitle">Darf optionale Statistik helfen?</h2>
        <p>Notwendige Funktionen laufen immer. Google Analytics wird erst geladen, wenn du Statistik erlaubst. Es gibt keine Werbeprofile, Heatmaps oder Session-Aufzeichnungen.</p>
        <div class="consent-actions">
          <button class="btn btn-secondary" type="button" data-consent-choice="denied">Nur notwendige</button>
          <button class="btn btn-primary" type="button" data-consent-choice="granted">Statistik erlauben</button>
        </div>
        <p class="consent-note"><a href="/datenschutz.html#google-analytics">Details im Datenschutz</a>. Du kannst die Auswahl jederzeit im Footer ändern.</p>
      </div>`;
    document.body.appendChild(dialog);
    dialog.addEventListener('click', (event) => {
      const button = event.target.closest('[data-consent-choice]');
      if (!button) return;
      updateConsent(button.dataset.consentChoice);
      closeDialog(dialog);
    });
    return dialog;
  }

  function openDialog() {
    const dialog = buildDialog();
    dialog.hidden = false;
    document.body.classList.add('consent-dialog-open');
    window.setTimeout(() => dialog.querySelector('[data-consent-choice="denied"]')?.focus(), 0);
  }

  function init() {
    const choice = readChoice();
    if (choice) updateConsent(choice, { persist: false });
    else openDialog();

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-cookie-settings]');
      if (!trigger) return;
      event.preventDefault();
      openDialog();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
