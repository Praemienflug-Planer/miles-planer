(() => {
  const BASE = '';

  const mainNav = [
    { label: 'Rechner', href: `${BASE}/rechner/` },
    { label: 'Meilen sammeln', href: `${BASE}/meilen-sammeln/`, groups: [
      { label: 'Start & Strategie', children: [
        { label: 'Übersicht', href: `${BASE}/meilen-sammeln/` },
        { label: 'Kostenlos starten', href: `${BASE}/meilen-sammeln/anfaenger/` },
        { label: 'Fixkosten & Alltagsausgaben', href: `${BASE}/meilen-sammeln/fixkosten-meilen/` },
        { label: 'Amex oder PAYBACK?', href: `${BASE}/amex-oder-payback/` }
      ] },
      { label: 'Programme', children: [
        { label: 'PAYBACK', href: `${BASE}/meilen-sammeln/payback/` },
        { label: 'Amex Membership Rewards', href: `${BASE}/meilen-sammeln/amex/` },
        { label: 'Miles & More', href: `${BASE}/meilen-sammeln/miles-and-more/` },
        { label: 'Revolut & RevPoints', href: `${BASE}/meilen-sammeln/revolut-revpoints/` }
      ] },
      { label: 'Kreditkarten', children: [
        { label: 'Amex Kreditkarten', href: `${BASE}/meilen-sammeln/amex-kreditkarten/` },
        { label: 'Miles & More Kreditkarte', href: `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/` },
        { label: 'Eurowings Kreditkarte', href: `${BASE}/meilen-sammeln/eurowings-kreditkarte/` }
      ] },
      { label: 'Booster & Transfer', children: [
        { label: 'PAYBACK → Miles & More', href: `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/` },
        { label: 'PAYBACK Transferbonus', href: `${BASE}/meilen-sammeln/payback-transferbonus/` },
        { label: 'Wunschgutschein', href: `${BASE}/meilen-sammeln/wunschgutschein/` },
        { label: 'Zeitschriftenabo-Meilen', href: `${BASE}/meilen-sammeln/zeitschriftenabo/` }
      ] }
    ] },
    { label: 'Familien', href: `${BASE}/praemienfluege-familie/`, children: [
      { label: 'Prämienflüge für Familien', href: `${BASE}/praemienfluege-familie/` },
      { label: 'Meilen sammeln als Familie', href: `${BASE}/meilen-sammeln-familie/` },
      { label: 'Miles & More Meilenpooling', href: `${BASE}/miles-and-more-meilenpooling-familie/` },
      { label: 'Child’s Award Flight', href: `${BASE}/childs-award-flight-kinder-meilen/` },
      { label: 'Meilen für Familie einlösen', href: `${BASE}/meilen-fuer-familienmitglieder-einloesen/` },
      { label: 'Business Class als Familie', href: `${BASE}/business-class-familie-meilen/` },
      { label: 'Business Class mit Kindern', href: `${BASE}/business-class-mit-kindern/` },
      { label: 'Premium Economy mit Kindern', href: `${BASE}/premium-economy-mit-kindern/` }
    ] },
    { label: 'Reiseziele', href: `${BASE}/meilen-thailand/`, children: [
      { label: 'Thailand mit Meilen', href: `${BASE}/meilen-thailand/` },
      { label: 'Mallorca mit PAYBACK', href: `${BASE}/meilen-sammeln/payback-mallorca/` },
      { label: 'New York mit Meilen', href: `${BASE}/meilen-new-york/` },
      { label: 'Florida mit Meilen', href: `${BASE}/florida-mit-meilen/` }
    ] },
    { label: 'Ratgeber', href: `${BASE}/meilen-business-class/`, children: [
      { label: 'Business Class mit Meilen', href: `${BASE}/meilen-business-class/` },
      { label: 'Premium Economy oder Business?', href: `${BASE}/premium-economy-oder-business-class/` },
      { label: '4 Prämienflug-Plätze finden', href: `${BASE}/vier-praemienflug-plaetze-finden/` },
      { label: 'Steuern & Gebühren', href: `${BASE}/praemienflug-steuern-gebuehren/` },
      { label: 'FAQ', href: `${BASE}/faq/` }
    ] },
    { label: 'Tools', href: `${BASE}/tools/`, children: [
      { label: 'Alle Tools', href: `${BASE}/tools/` },
      { label: 'Prämienflug-Rechner', href: `${BASE}/rechner/` },
      { label: 'Fixkosten-Meilenrechner', href: `${BASE}/meilen-sammeln/fixkosten-meilen/#rechner` },
      { label: 'RevPoints-Rechner', href: `${BASE}/meilen-sammeln/revolut-revpoints/#rechner` },
      { label: 'Amex Punkte umrechnen', href: `${BASE}/amex-meilen-umrechnen/#mr-rechner` },
      { label: 'Zeitschriftenabo-Meilenrechner', href: `${BASE}/meilen-sammeln/zeitschriftenabo/#abo-rechner` }
    ] }
  ];

  const footerNav = [
    ['Prämienflug-Rechner', `${BASE}/rechner/`],
    ['Meilen sammeln', `${BASE}/meilen-sammeln/`],
    ['Familien', `${BASE}/praemienfluege-familie/`],
    ['Reiseziele', `${BASE}/meilen-thailand/`],
    ['Ratgeber', `${BASE}/meilen-business-class/`],
    ['Tools & Rechner', `${BASE}/tools/`],
    ['Kostenlos starten', `${BASE}/meilen-sammeln/anfaenger/`],
    ['Fixkosten & Alltagsausgaben', `${BASE}/meilen-sammeln/fixkosten-meilen/`]
  ];

  const projectNav = [
    ['Warum diese Seite?', `${BASE}/ueber-das-projekt/`],
    ['Kontakt', `${BASE}/kontakt.html`],
    ['FAQ', `${BASE}/faq/`],
    ['Transparenz', `${BASE}/transparenz.html`],
    ['Impressum', `${BASE}/impressum.html`],
    ['Datenschutz', `${BASE}/datenschutz.html`]
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

  function itemLinks(item) {
    if (item.groups) return item.groups.flatMap(group => group.children || []);
    return item.children || [];
  }

  function activeFor(item) {
    const current = normalize(window.location.pathname);
    const exactOwners = {
      Rechner: [`${BASE}/rechner/`],
      Familien: [
        `${BASE}/praemienfluege-familie/`,
        `${BASE}/meilen-sammeln-familie/`,
        `${BASE}/miles-and-more-meilenpooling-familie/`,
        `${BASE}/childs-award-flight-kinder-meilen/`,
        `${BASE}/meilen-fuer-familienmitglieder-einloesen/`,
        `${BASE}/business-class-familie-meilen/`,
        `${BASE}/business-class-mit-kindern/`,
        `${BASE}/premium-economy-mit-kindern/`
      ],
      Reiseziele: [
        `${BASE}/meilen-thailand/`,
        `${BASE}/meilen-sammeln/payback-mallorca/`,
        `${BASE}/meilen-new-york/`,
        `${BASE}/florida-mit-meilen/`
      ],
      Ratgeber: [
        `${BASE}/meilen-business-class/`,
        `${BASE}/premium-economy-oder-business-class/`,
        `${BASE}/vier-praemienflug-plaetze-finden/`,
        `${BASE}/praemienflug-steuern-gebuehren/`,
        `${BASE}/faq/`
      ],
      Tools: [`${BASE}/tools/`, `${BASE}/amex-meilen-umrechnen/`]
    };

    if (item.label === 'Meilen sammeln') {
      if (current === normalize(`${BASE}/amex-oder-payback/`)) return true;
      if (current === normalize(`${BASE}/meilen-sammeln/payback-mallorca/`)) return false;
      return current.startsWith(normalize(`${BASE}/meilen-sammeln/`));
    }

    const owned = exactOwners[item.label];
    if (owned) return owned.some(path => current === normalize(path));

    const paths = [item.href, ...itemLinks(item).map(child => child.href)]
      .map(href => normalize(new URL(href, window.location.origin).pathname));
    return paths.some(path => current === path || (path !== `${BASE}/` && current.startsWith(path)));
  }

  function renderDropdown(item) {
    if (item.groups) {
      const groups = item.groups.map(group => `
        <div class="nav-group">
          <span class="nav-group-title">${group.label}</span>
          ${(group.children || []).map(child => `<a href="${child.href}">${child.label}</a>`).join('')}
        </div>`).join('');
      return `<div class="nav-dropdown nav-mega">${groups}</div>`;
    }
    if (!item.children) return '';
    return `<div class="nav-dropdown">${item.children.map(child => `<a href="${child.href}">${child.label}</a>`).join('')}</div>`;
  }

  function renderMainNav() {
    return mainNav.map(item => {
      const active = activeFor(item) ? ' aria-current="page"' : '';
      const hasDropdown = Boolean(item.children || item.groups);
      const dropdown = hasDropdown ? ' has-dropdown' : '';
      const toggle = hasDropdown ? `<button class="submenu-toggle" type="button" aria-label="Untermenü ${item.label} öffnen" aria-expanded="false">⌄</button>` : '';
      return `<div class="nav-item${dropdown}"><a class="nav-link" href="${item.href}"${active}>${item.label}</a>${toggle}${renderDropdown(item)}</div>`;
    }).join('');
  }

  function createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav">
        <a class="brand" href="${BASE}/" aria-label="Startseite Prämienflug-Planer">
          <img class="brand-logo" src="${BASE}/assets/brand/praemienflug-planer-logo.svg" alt="" aria-hidden="true" width="40" height="40" loading="eager" decoding="async">
          <span class="brand-name">Prämienflug-Planer</span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span></button>
        <nav id="site-navigation" class="main-nav" aria-label="Hauptnavigation">${renderMainNav()}</nav>
      </div>`;
    return header;
  }

  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="container footer-grid">
      <div><div class="brand footer-brand">Prämienflug-Planer</div><p class="footer-text">Planungstool für Prämienflüge mit Fokus auf Familien, Sammellücke und realistische Umsetzbarkeit.</p></div>
      <div><h4>Bereiche</h4><ul class="footer-links">${footerNav.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div>
      <div><h4>Projekt & Service</h4><ul class="footer-links">${projectNav.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></div>
    </div>`;
    return footer;
  }

  function injectCardImageStyles() {
    if (document.getElementById('official-card-image-style')) return;
    const style = document.createElement('style');
    style.id = 'official-card-image-style';
    style.textContent = `.official-card-image-wrap{background:#fff;padding:18px;display:flex;align-items:center;justify-content:center;min-height:170px}.official-card-img,.amex-card-image{display:block;width:100%;max-width:260px;height:auto}.amex-card-pair{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:center}.amex-card-pair .official-card-img,.amex-card-pair .amex-card-image{max-width:170px}.official-card-figure{margin:16px 0 20px;background:#fff;border-radius:16px;padding:18px;text-align:center}.official-card-figure img{display:block;max-width:280px;width:100%;height:auto;margin:0 auto}.official-card-figure figcaption{color:#475569;font-size:13px;margin-top:10px}.payback-amex-promo{margin:16px 0 22px;padding:18px;border:1px solid rgba(251,191,36,.34);border-radius:16px;background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(16,28,47,.96))}.payback-amex-promo-media{background:#fff;border-radius:14px;padding:18px;margin-bottom:14px;text-align:center}.payback-amex-promo-media img{display:block;max-width:300px;width:100%;height:auto;margin:0 auto}.payback-amex-promo strong{color:#fff}.payback-amex-promo ul{margin:10px 0 0;padding-left:18px;color:var(--muted)}.payback-amex-promo .btn{margin-top:14px}@media(max-width:560px){.amex-card-pair{grid-template-columns:1fr}.amex-card-pair .official-card-img,.amex-card-pair .amex-card-image{max-width:240px}}`;
    document.head.appendChild(style);
  }

  function injectReadableInfoBoxStyles() {
    if (document.getElementById('readable-info-box-style')) return;
    const style = document.createElement('style');
    style.id = 'readable-info-box-style';
    style.textContent = `.fee-highlight,.fee-metric,.metric-card,.trust-box,.ny-note,.program-result,.upgrade-box,.cash-highlight,.formula-box,.verdict-card,.example-summary div{background:#fff!important;color:#0f172a!important}.trust-box,.ny-note,.program-result,.cash-highlight,.formula-box{background:#f8fafc!important}.fee-highlight *,.fee-metric *,.metric-card *,.trust-box *,.ny-note *,.program-result *,.upgrade-box *,.cash-highlight *,.formula-box *,.verdict-card *,.example-summary div *{color:#0f172a!important}.fee-warning,.decision-box{background:#fff7ed!important;color:#7c2d12!important}.fee-warning *,.decision-box *{color:#7c2d12!important}.fee-table-note,.small-note,.article-image figcaption{color:#475569!important}`;
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
    block.innerHTML = `<div class="payback-amex-promo-media"><img src="${officialCardImages.payback}" alt="PAYBACK American Express Karte" loading="lazy"></div><p><strong>Aktuell über meinen Empfehlungslink:</strong> 4.000 PAYBACK Punkte für den Geworbenen (Stand 29.08.2026).</p><ul><li>PAYBACK Punkte verfallen durch aktive PAYBACK Amex nicht mehr.</li><li>Guter Basisbaustein, wenn du auf PAYBACK → Miles & More sammelst.</li><li>Die Karte sammelt PAYBACK Punkte, nicht Membership Rewards.</li></ul><a class="btn btn-primary" href="${BASE}/kreditkarten-link/?karte=payback-amex&quelle=payback-inline" data-event="card_offer_click">4.000-Punkte-Link erhalten</a>`;
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

  function closeSubmenus(header) {
    header.querySelectorAll('.submenu-open').forEach(item => item.classList.remove('submenu-open'));
    header.querySelectorAll('.submenu-toggle[aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
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
    injectReadableInfoBoxStyles();
    applyOfficialCardImages();

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.main-nav');
    toggle?.addEventListener('click', () => {
      const open = !header.classList.contains('nav-open');
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      if (!open) closeSubmenus(header);
    });

    header.querySelectorAll('.submenu-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.nav-item');
        const wasOpen = item?.classList.contains('submenu-open');
        closeSubmenus(header);
        if (item && !wasOpen) {
          item.classList.add('submenu-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });

    nav?.addEventListener('click', event => {
      if (event.target instanceof HTMLAnchorElement && window.matchMedia('(max-width: 900px)').matches) {
        header.classList.remove('nav-open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', 'Menü öffnen');
        closeSubmenus(header);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        header.classList.remove('nav-open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', 'Menü öffnen');
        closeSubmenus(header);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
