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
    ['PAYBACK', `${BASE}/meilen-sammeln/payback/`], ['PAYBACK zu Miles & More', `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`],
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

  function injectCardImageStyles() {
    if (document.getElementById('official-card-image-style')) return;
    const style = document.createElement('style');
    style.id = 'official-card-image-style';
    style.textContent = `.official-card-image-wrap{background:#fff;padding:18px;display:flex;align-items:center;justify-content:center;min-height:170px}.official-card-img,.amex-card-image{display:block;width:100%;max-width:260px;height:auto}.amex-card-pair{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:center}.amex-card-pair .official-card-img,.amex-card-pair .amex-card-image{max-width:170px}.official-card-figure{margin:16px 0 20px;background:#fff;border-radius:16px;padding:18px;text-align:center}.official-card-figure img{display:block;max-width:280px;width:100%;height:auto;margin:0 auto}.official-card-figure figcaption{color:#475569;font-size:13px;margin-top:10px}.payback-amex-promo{margin:16px 0 22px;padding:18px;border:1px solid rgba(251,191,36,.34);border-radius:16px;background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(16,28,47,.96))}.payback-amex-promo-media{background:#fff;border-radius:14px;padding:18px;margin-bottom:14px;text-align:center}.payback-amex-promo-media img{display:block;max-width:300px;width:100%;height:auto;margin:0 auto}.payback-amex-promo strong{color:#fff}.payback-amex-promo ul{margin:10px 0 0;padding-left:18px;color:var(--muted)}.payback-amex-promo .btn{margin-top:14px}@media(max-width:560px){.amex-card-pair{grid-template-columns:1fr}.amex-card-pair .official-card-img,.amex-card-pair .amex-card-image{max-width:240px}}`;
    document.head.appendChild(style);
  }

  function setImage(selector, src, alt) {
    const img = document.querySelector(selector);
    if (!img) return null;
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);
    img.classList.add('official-card-img');
    img.parentElement?.classList.add('official-card-image-wrap');
    return img;
  }

  function improveAmexCardsPage() {
    const platinum = setImage('img[src$="/amex-platin.svg"]', officialCardImages.platinum, 'American Express Platinum Card');
    const rose = setImage('img[src$="/amex-rosegold.svg"]', officialCardImages.rose, 'American Express Rose Gold Card');
    if (rose && rose.parentElement && !rose.parentElement.querySelector('img[data-official-gold="true"]')) {
      rose.parentElement.classList.add('amex-card-pair');
      const gold = document.createElement('img');
      gold.className = 'amex-card-image official-card-img';
      gold.dataset.officialGold = 'true';
      gold.src = officialCardImages.gold;
      gold.alt = 'American Express Gold Card';
      gold.loading = 'lazy';
      rose.insertAdjacentElement('beforebegin', gold);
    }
    platinum?.parentElement?.classList.add('official-card-image-wrap');
  }

  function insertPaybackCardFigure() {
    if (document.querySelector('[data-official-payback-card="true"]')) return;
    const target = document.querySelector('[data-event*="payback_amex_contact"]')?.closest('.article-card, .result-action-box, .seo-card');
    if (!target) return;
    const block = document.createElement('div');
    block.className = 'payback-amex-promo';
    block.dataset.officialPaybackCard = 'true';
    block.innerHTML = `<div class="payback-amex-promo-media"><img src="${officialCardImages.payback}" alt="PAYBACK American Express Karte" loading="lazy"></div><p><strong>Aktuell über deinen Link:</strong> 4.000 PAYBACK Punkte möglich.</p><ul><li>PAYBACK Punkte verfallen durch aktive PAYBACK Amex nicht mehr.</li><li>Guter Basisbaustein, wenn du auf PAYBACK → Miles &amp; More sammelst.</li><li>Die Karte sammelt PAYBACK Punkte, nicht Membership Rewards.</li></ul><a class="btn btn-primary" href="${BASE}/kontakt.html" data-event="payback_amex_contact_inline">PAYBACK-Amex-Link anfragen</a>`;
    const headline = target.querySelector('h2, h3');
    if (headline) headline.insertAdjacentElement('afterend', block);
    else target.prepend(block);
  }

  function applyOfficialCardImages() {
    injectCardImageStyles();
    const path = window.location.pathname;
    if (path.includes('/meilen-sammeln/amex-kreditkarten/')) improveAmexCardsPage();
    if (path.includes('/meilen-sammeln/payback/') || path.includes('/amex-oder-payback/')) insertPaybackCardFigure();
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
    applyOfficialCardImages();

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