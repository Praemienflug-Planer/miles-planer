(() => {
  const BASE = '';

  const mainNav = [
    { label: 'Rechner', href: `${BASE}/rechner/` },
    { label: 'Meilen sammeln', href: `${BASE}/meilen-sammeln/`, children: [
      { label: 'Übersicht', href: `${BASE}/meilen-sammeln/` },
      { label: 'Amex oder PAYBACK?', href: `${BASE}/amex-oder-payback/` },
      { label: 'PAYBACK Punkte sammeln', href: `${BASE}/meilen-sammeln/payback/` },
      { label: 'Meilen sammeln im Alltag', href: `${BASE}/meilen-sammeln/payback-alltag/` },
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
      { label: 'Mit PAYBACK nach Mallorca', href: `${BASE}/meilen-sammeln/payback-mallorca/` },
      { label: '4 Prämienflug-Plätze finden', href: `${BASE}/vier-praemienflug-plaetze-finden/` },
      { label: 'Steuern & Gebühren', href: `${BASE}/praemienflug-steuern-gebuehren/` }
    ] },
    { label: 'Tools', href: `${BASE}/tools/`, children: [
      { label: 'Alle Tools', href: `${BASE}/tools/` },
      { label: 'Amex Punkte umrechnen', href: `${BASE}/amex-meilen-umrechnen/#mr-rechner` },
      { label: 'Zeitschriftenabo-Meilenrechner', href: `${BASE}/meilen-sammeln/zeitschriftenabo/#abo-rechner` }
    ] },
    { label: 'FAQ', href: `${BASE}/faq/` },
    { label: 'Warum diese Seite?', href: `${BASE}/ueber-das-projekt/` }
  ];

  const footerNav = [
    ['Rechner', `${BASE}/rechner/`], ['Meilen sammeln', `${BASE}/meilen-sammeln/`], ['Amex oder PAYBACK?', `${BASE}/amex-oder-payback/`],
    ['PAYBACK', `${BASE}/meilen-sammeln/payback/`], ['Meilen sammeln im Alltag', `${BASE}/meilen-sammeln/payback-alltag/`], ['PAYBACK zu Miles & More', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`],
    ['Amex Membership Rewards', `${BASE}/meilen-sammeln/amex/`], ['Amex Kreditkarten', `${BASE}/meilen-sammeln/amex-kreditkarten/`], ['Miles & More Kreditkarte', `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`],
    ['Thailand', `${BASE}/meilen-thailand/`], ['New York', `${BASE}/meilen-new-york/`], ['Business Class', `${BASE}/meilen-business-class/`], ['Mit PAYBACK nach Mallorca', `${BASE}/meilen-sammeln/payback-mallorca/`],
    ['4 Prämienflug-Plätze finden', `${BASE}/vier-praemienflug-plaetze-finden/`], ['Steuern & Gebühren', `${BASE}/praemienflug-steuern-gebuehren/`], ['Tools', `${BASE}/tools/`],
    ['Amex umrechnen', `${BASE}/amex-meilen-umrechnen/`], ['Zeitschriftenabo-Meilenrechner', `${BASE}/meilen-sammeln/zeitschriftenabo/#abo-rechner`],
    ['Warum diese Seite?', `${BASE}/ueber-das-projekt/`], ['FAQ', `${BASE}/faq/`]
  ];

  const legalNav = [
    ['Impressum', `${BASE}/impressum.html`], ['Datenschutz', `${BASE}/datenschutz.html`],
    ['Transparenz', `${BASE}/transparenz.html`], ['Kontakt', `${BASE}/kontakt.html`]
  ];

  const officialCardImages = {
    platinum: 'https://icm.aexp-static.com/Internet/internationalcardshop/de_de/images/cards/platinum-card.png',
    green: 'https://icm.aexp-static.com/Internet/internationalcardshop/de_de/images/cards/american-express-card.png',
    rose: 'https://icm.aexp-static.com/Internet/internationalcardshop/de_de/images/cards/rose-gold-card.png',
    gold: 'https://icm.aexp-static.com/Internet/internationalcardshop/de_de/images/cards/goldcard.png',
    payback: 'https://icm.aexp-static.com/Internet/internationalcardshop/de_de/images/cards/payback-karte.png'
  };

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

  function renderFooterLinks(links) {
    return links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('');
  }

  function initNavigation() {
    const header = document.querySelector('.site-header');
    if (header) {
      header.innerHTML = `<div class="container nav"><a class="brand" href="${BASE}/">Prämienflug-Planer</a><nav class="main-nav" aria-label="Hauptnavigation">${renderMainNav()}</nav></div>`;
    }

    const footer = document.querySelector('.site-footer');
    if (footer) {
      footer.innerHTML = `<div class="container footer-grid"><div><div class="brand footer-brand">Prämienflug-Planer</div><p class="footer-text">Planungstool für Prämienflüge mit Fokus auf Familien, Sammellücke und realistische Umsetzbarkeit.</p></div><div><h4>Navigation</h4><ul class="footer-links">${renderFooterLinks(footerNav)}</ul></div><div><h4>Rechtliches</h4><ul class="footer-links">${renderFooterLinks(legalNav)}</ul></div></div>`;
    }
  }

  function initOfficialCardImages() {
    document.querySelectorAll('[data-card-image]').forEach(img => {
      const key = img.getAttribute('data-card-image');
      if (officialCardImages[key]) img.src = officialCardImages[key];
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initOfficialCardImages();
  });
})();
