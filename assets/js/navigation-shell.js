(() => {
  const BASE = '/miles-planer';

  const mainNav = [
    { label: 'Rechner', href: `${BASE}/rechner/` },
    { label: 'Meilen sammeln', href: `${BASE}/meilen-sammeln/`, children: [
      { label: 'Übersicht', href: `${BASE}/meilen-sammeln/` },
      { label: 'Amex oder PAYBACK?', href: `${BASE}/amex-oder-payback/` },
      { label: 'PAYBACK Punkte sammeln', href: `${BASE}/meilen-sammeln/payback/` },
      { label: 'PAYBACK zu Miles & More', href: `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/` },
      { label: 'Amex Membership Rewards', href: `${BASE}/meilen-sammeln/amex/` },
      { label: 'Amex Kreditkarten', href: `${BASE}/meilen-sammeln/amex-kreditkarten/` },
      { label: 'Miles & More Kreditkarte', href: `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/` },
      { label: 'Wunschgutschein', href: `${BASE}/meilen-sammeln/wunschgutschein/` },
      { label: 'Zeitschriftenabo-Meilen', href: `${BASE}/meilen-sammeln/zeitschriftenabo/` }
    ] },
    { label: 'Beispiele', href: `${BASE}/meilen-thailand/`, children: [
      { label: 'Thailand mit Meilen', href: `${BASE}/meilen-thailand/` },
      { label: 'New York mit Meilen', href: `${BASE}/meilen-new-york/` },
      { label: 'Business Class mit Meilen', href: `${BASE}/meilen-business-class/` },
      { label: '4 Prämienflug-Plätze finden', href: `${BASE}/vier-praemienflug-plaetze-finden/` }
    ] },
    { label: 'Tools', href: `${BASE}/tools/`, children: [
      { label: 'Alle Tools', href: `${BASE}/tools/` },
      { label: 'Amex Punkte umrechnen', href: `${BASE}/amex-meilen-umrechnen/` },
      { label: 'Steuern & Gebühren', href: `${BASE}/praemienflug-steuern-gebuehren/` }
    ] },
    { label: 'FAQ', href: `${BASE}/faq/` },
    { label: 'Warum diese Seite?', href: `${BASE}/ueber-das-projekt/` }
  ];

  const footerNav = [
    ['Rechner', `${BASE}/rechner/`], ['Meilen sammeln', `${BASE}/meilen-sammeln/`], ['Amex oder PAYBACK?', `${BASE}/amex-oder-payback/`],
    ['PAYBACK', `${BASE}/meilen-sammeln/payback/`], ['PAYBACK zu Miles & More', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`],
    ['Amex Membership Rewards', `${BASE}/meilen-sammeln/amex/`], ['Amex Kreditkarten', `${BASE}/meilen-sammeln/amex-kreditkarten/`], ['Miles & More Kreditkarte', `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`],
    ['Thailand', `${BASE}/meilen-thailand/`], ['New York', `${BASE}/meilen-new-york/`], ['Business Class', `${BASE}/meilen-business-class/`],
    ['4 Prämienflug-Plätze finden', `${BASE}/vier-praemienflug-plaetze-finden/`], ['Tools', `${BASE}/tools/`],
    ['Amex umrechnen', `${BASE}/amex-meilen-umrechnen/`], ['Steuern & Gebühren', `${BASE}/praemienflug-steuern-gebuehren/`],
    ['Warum diese Seite?', `${BASE}/ueber-das-projekt/`], ['FAQ', `${BASE}/faq/`]
  ];

  const legalNav = [
    ['Impressum', `${BASE}/impressum.html`], ['Datenschutz', `${BASE}/datenschutz.html`],
    ['Transparenz', `${BASE}/transparenz.html`], ['Kontakt', `${BASE}/kontakt.html`]
  ];

  function normalize(path) {
    return (!path.endsWith('/') && !path.endsWith('.html')) ? `${path}/` : path;
  }

  function activeFor(item) {
    const current = normalize(window.location.pathname);
    const paths = [item.href, ...(item.children || []).map(child => child.href)]
      .map(href => normalize(new URL(href, window.location.origin).pathname));
    return paths.some(path => current === path || (path !== `${BASE}/` && current.startsWith(path)));
  }

  function renderDropdown(children) {
    if (!children) return '';
    return `<div class="nav-dropdown">${children.map(child => `<a href="${child.href}">${child.label}</a>`).join('')}</div>`;
  }

  function renderMainNav() {
    const items = mainNav.map(item => {
      const active = activeFor(item) ? ' aria-current="page"' : '';
      const dropdown = item.children ? ' has-dropdown' : '';
      return `<div class="nav-item${dropdown}"><a class="nav-link" href="${item.href}"${active}>${item.label}</a>${renderDropdown(item.children)}</div>`;
    });
    items.push(`<div class="nav-item nav-item-cta"><a class="btn btn-primary nav-cta" href="${BASE}/rechner/" data-event="nav_start_calculator">Kostenlos prüfen</a></div>`);
    return items.join('');
  }

  function createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav">
        <a class="brand" href="${BASE}/" aria-label="Startseite Prämienflug-Planer">Prämienflug-Planer</a>
        <button class="nav-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span></button>
        <nav id="site-navigation" class="main-nav" aria-label="Hauptnavigation">${renderMainNav()}</nav>
      </div>`;
    return header;
  }

  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="container footer-grid"><div><div class="brand footer-brand">Prämienflug-Planer</div><p class="footer-text">Planungstool für Prämienflüge mit Fokus auf Familien, Sammellücke und realistische Umsetzbarkeit.</p></div><div><h4>Navigation</h4><ul class="footer-links">${footerNav.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div><div><h4>Rechtliches</h4><ul class="footer-links">${legalNav.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div></div>`;
    return footer;
  }

  function mount() {
    document.querySelector('header.site-header')?.remove();
    document.querySelector('footer.site-footer')?.remove();
    const header = createHeader();
    const footer = createFooter();
    const skip = document.querySelector('.skip-link');
    if (skip && skip.parentNode === document.body) skip.insertAdjacentElement('afterend', header);
    else document.body.prepend(header);
    document.body.appendChild(footer);

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.main-nav');
    toggle?.addEventListener('click', () => {
      const open = !header.classList.contains('nav-open');
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    nav?.addEventListener('click', event => {
      if (event.target instanceof HTMLAnchorElement) header.classList.remove('nav-open');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') header.classList.remove('nav-open');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();