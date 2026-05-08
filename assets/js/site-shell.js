(() => {
  const BASE = '/miles-planer';

  const navItems = [
    { label: 'Rechner', href: `${BASE}/rechner/` },
    { label: 'Tools', href: `${BASE}/tools/` },
    { label: 'Business Class', href: `${BASE}/meilen-business-class/` },
    { label: 'Thailand', href: `${BASE}/meilen-thailand/` },
    { label: 'New York', href: `${BASE}/meilen-new-york/` },
    { label: 'Amex umrechnen', href: `${BASE}/amex-meilen-umrechnen/` },
    { label: 'Meilen sammeln', href: `${BASE}/meilen-sammeln/` },
    { label: 'FAQ', href: `${BASE}/faq/` },
    { label: 'Kontakt', href: `${BASE}/kontakt.html` }
  ];

  const legalItems = [
    { label: 'Impressum', href: `${BASE}/impressum.html` },
    { label: 'Datenschutz', href: `${BASE}/datenschutz.html` },
    { label: 'Transparenz', href: `${BASE}/transparenz.html` },
    { label: 'Kontakt', href: `${BASE}/kontakt.html` }
  ];

  function normalizePath(path) {
    if (!path.endsWith('/') && !path.endsWith('.html')) return `${path}/`;
    return path;
  }

  function isActive(href) {
    const current = normalizePath(window.location.pathname);
    const target = normalizePath(new URL(href, window.location.origin).pathname);

    if (target === `${BASE}/meilen-sammeln/`) {
      return current === target || current.startsWith(`${BASE}/meilen-sammeln/`);
    }

    return current === target;
  }

  function renderNavLinks(items, extraClass = '') {
    return items
      .map((item) => {
        const active = isActive(item.href) ? ' aria-current="page"' : '';
        return `<a${extraClass ? ` class="${extraClass}"` : ''} href="${item.href}"${active}>${item.label}</a>`;
      })
      .join('');
  }

  function createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav">
        <a class="brand" href="${BASE}/" aria-label="Startseite Prämienflug-Planer">Prämienflug-Planer</a>
        <nav class="main-nav" aria-label="Hauptnavigation">
          ${renderNavLinks(navItems)}
        </nav>
      </div>
    `;
    return header;
  }

  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          <div class="brand footer-brand">Prämienflug-Planer</div>
          <p class="footer-text">Planungstool für Prämienflüge mit Fokus auf Familien, Sammellücke und realistische Umsetzbarkeit.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul class="footer-links">
            ${navItems
              .filter((item) => item.label !== 'Kontakt')
              .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
              .join('')}
          </ul>
        </div>
        <div>
          <h4>Rechtliches</h4>
          <ul class="footer-links">
            ${legalItems.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    return footer;
  }

  function mountShell() {
    document.querySelector('header.site-header')?.remove();
    document.querySelector('footer.site-footer')?.remove();

    const header = createHeader();
    const footer = createFooter();
    const skipLink = document.querySelector('.skip-link');

    if (skipLink && skipLink.parentNode === document.body) {
      skipLink.insertAdjacentElement('afterend', header);
    } else {
      document.body.prepend(header);
    }

    document.body.appendChild(footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountShell);
  } else {
    mountShell();
  }
})();
