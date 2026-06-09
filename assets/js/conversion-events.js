(() => {
  if (window.__pfpConversionEventsLoaded) return;
  window.__pfpConversionEventsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.ppEvents = window.ppEvents || [];

  const EVENT_MAP = {
    nav_start_calculator: 'calculator_start',
    start_calculator: 'calculator_start',
    click_rechner: 'calculator_start',
    submit_calculator: 'calculator_submit',
    result_view: 'calculator_result_view',
    cta_click: 'cta_click',
    form_start: 'form_start',
    form_submit: 'form_submit',
    lead_request_start: 'lead_request_start',
    lead_request_submit: 'lead_request_submit',
    click_contact: 'contact_click',
    contact_referral_request: 'referral_request',
    click_next_step_payback: 'next_step_payback',
    click_next_step_amex: 'next_step_amex',
    click_next_step_miles_more_card: 'next_step_miles_more_card',
    click_next_step_flying_blue: 'next_step_flying_blue',
    click_next_step_avios: 'next_step_avios'
  };

  const ROUTE_EVENTS = [
    { test: (href) => href.includes('/rechner/'), event: 'calculator_start' },
    { test: (href) => href.includes('kontakt.html'), event: 'contact_click' },
    { test: (href) => href.includes('/meilen-sammeln/payback'), event: 'next_step_payback' },
    { test: (href) => href.includes('/meilen-sammeln/amex') || href.includes('/amex-meilen-umrechnen') || href.includes('/amex-oder-payback'), event: 'next_step_amex' },
    { test: (href) => href.includes('/miles-and-more-kreditkarte'), event: 'next_step_miles_more_card' },
    { test: (href) => href.toLowerCase().includes('flying'), event: 'next_step_flying_blue' },
    { test: (href) => href.toLowerCase().includes('avios'), event: 'next_step_avios' }
  ];

  const seen = new Set();

  function cleanProps(props = {}) {
    const safe = {};
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (/email|mail|name|message|nachricht/i.test(key)) return;
      safe[key] = String(value).replace(/\s+/g, ' ').trim().slice(0, 160);
    });
    return safe;
  }

  function getPageType() {
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path.includes('/rechner/')) return 'calculator';
    if (path.includes('/tools/')) return 'tools';
    if (path.includes('/meilen-sammeln/')) return 'collecting';
    if (path.includes('/praemienfluege-familie/') || path.includes('familie') || path.includes('kindern')) return 'family';
    if (path.includes('/meilen-thailand/') || path.includes('/meilen-new-york/') || path.includes('/florida-mit-meilen/')) return 'destination';
    return 'content';
  }

  function sendEvent(rawName, props = {}) {
    const eventName = EVENT_MAP[rawName] || rawName;
    const payload = cleanProps({
      event: eventName,
      source_path: window.location.pathname,
      page_type: getPageType(),
      ...props
    });

    const eventObject = { event: eventName, ...payload };
    window.dataLayer.push(eventObject);
    window.ppEvents.push({ ...eventObject, ts: new Date().toISOString() });

    if (typeof window.gtag === 'function' && eventName !== 'page_view') {
      window.gtag('event', eventName, payload);
    }

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
    return match?.event || 'cta_click';
  }

  function getFormName(form) {
    if (form.classList.contains('lead-request-form')) return 'calculator_lead_request';
    if (form.id === 'milesForm') return 'calculator';
    if (form.id === 'contactForm') return 'contact';
    return form.getAttribute('name') || form.id || 'unknown_form';
  }

  function getLeadMeta(form) {
    return {
      form_name: getFormName(form),
      segment: form.querySelector('[name="segment"]')?.value || '',
      recommendation: form.querySelector('[name="empfehlung"]')?.value || form.querySelector('[name="wunsch"]')?.value || ''
    };
  }

  function trackFormStart(form) {
    const formName = getFormName(form);
    const key = `form_start:${formName}:${window.location.pathname}`;
    if (seen.has(key)) return;
    seen.add(key);
    const eventName = form.classList.contains('lead-request-form') ? 'lead_request_start' : 'form_start';
    sendEvent(eventName, getLeadMeta(form));
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-event], a[href], button[type="submit"]');
    if (!target) return;

    if (target.matches('button[type="submit"]')) {
      const form = target.closest('form');
      if (form) trackFormStart(form);
      return;
    }

    const eventName = inferEventName(target);
    if (!eventName) return;

    sendEvent(eventName, {
      link_text: target.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
      link_target: target.getAttribute('href') || ''
    });
  });

  document.addEventListener('focusin', (event) => {
    const form = event.target.closest('form');
    if (!form) return;
    if (event.target.matches('input, select, textarea')) trackFormStart(form);
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form || !form.matches('form')) return;

    if (form.id === 'milesForm') {
      sendEvent('calculator_submit', { form_name: 'calculator' });
      return;
    }

    if (form.classList.contains('lead-request-form')) {
      sendEvent('lead_request_submit', getLeadMeta(form));
      return;
    }

    sendEvent('form_submit', { form_name: getFormName(form) });
  }, true);

  function watchCalculatorResult() {
    const resultNode = document.getElementById('result');
    if (!resultNode) return;
    const observer = new MutationObserver(() => {
      if (resultNode.querySelector('.result-card') && !resultNode.dataset.resultTracked) {
        resultNode.dataset.resultTracked = 'true';
        const decision = resultNode.querySelector('.decision-card-good') ? 'good' : resultNode.querySelector('.decision-card-medium') ? 'medium' : resultNode.querySelector('.decision-card-bad') ? 'bad' : 'unknown';
        sendEvent('calculator_result_view', { result_decision: decision });
      }
    });
    observer.observe(resultNode, { childList: true, subtree: true });
  }

  function init() {
    sendEvent('page_view', { referrer: document.referrer || '' });
    sendEvent('tracking_ready', { tracking_version: '20260609-events-3' });
    if (window.location.pathname.includes('/rechner/')) {
      sendEvent('calculator_start', { trigger: 'calculator_page_loaded' });
    }
    watchCalculatorResult();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.pfpTrackConversion = sendEvent;
})();
