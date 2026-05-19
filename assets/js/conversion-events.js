(() => {
  if (window.__pfpConversionEventsLoaded) return;
  window.__pfpConversionEventsLoaded = true;

  const EVENT_MAP = {
    nav_start_calculator: 'Start Calculator',
    start_calculator: 'Start Calculator',
    click_rechner: 'Start Calculator',
    submit_calculator: 'Submit Calculator',
    result_view: 'View Result',
    click_contact: 'Contact Click',
    contact_referral_request: 'Referral Request',
    click_next_step_payback: 'Next Step PAYBACK',
    click_next_step_amex: 'Next Step Amex',
    click_next_step_miles_more_card: 'Next Step Miles More Card',
    click_next_step_flying_blue: 'Next Step Flying Blue',
    click_next_step_avios: 'Next Step Avios'
  };

  const ROUTE_EVENTS = [
    { test: (href) => href.includes('/rechner/'), event: 'start_calculator' },
    { test: (href) => href.includes('kontakt.html'), event: 'click_contact' },
    { test: (href) => href.includes('/meilen-sammeln/payback'), event: 'click_next_step_payback' },
    { test: (href) => href.includes('/meilen-sammeln/amex') || href.includes('/amex-meilen-umrechnen') || href.includes('/amex-oder-payback'), event: 'click_next_step_amex' },
    { test: (href) => href.includes('/miles-and-more-kreditkarte'), event: 'click_next_step_miles_more_card' },
    { test: (href) => href.toLowerCase().includes('flying'), event: 'click_next_step_flying_blue' },
    { test: (href) => href.toLowerCase().includes('avios'), event: 'click_next_step_avios' }
  ];

  function cleanProps(props = {}) {
    const safe = {};
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      safe[key] = String(value).slice(0, 120);
    });
    return safe;
  }

  function sendEvent(rawName, props = {}) {
    const eventName = EVENT_MAP[rawName] || rawName;
    const payload = cleanProps({
      source_path: window.location.pathname,
      ...props
    });

    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: payload });
    }

    window.dispatchEvent(new CustomEvent('pfp:conversion-event', {
      detail: { event: eventName, props: payload }
    }));
  }

  function inferEventName(target) {
    const explicit = target.getAttribute('data-event');
    if (explicit) return explicit;

    const href = target.getAttribute('href') || '';
    const match = ROUTE_EVENTS.find((rule) => rule.test(href));
    return match?.event || '';
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-event], a[href]');
    if (!target) return;

    const eventName = inferEventName(target);
    if (!eventName) return;

    sendEvent(eventName, {
      link_text: target.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
      link_target: target.getAttribute('href') || ''
    });
  });

  document.addEventListener('submit', (event) => {
    if (event.target?.id === 'milesForm') {
      sendEvent('submit_calculator');
    }
  }, true);

  const resultNode = document.getElementById('result');
  if (resultNode) {
    const observer = new MutationObserver(() => {
      if (resultNode.querySelector('.result-card') && !resultNode.dataset.resultTracked) {
        resultNode.dataset.resultTracked = 'true';
        sendEvent('result_view');
      }
    });
    observer.observe(resultNode, { childList: true, subtree: true });
  }

  window.pfpTrackConversion = sendEvent;
})();
