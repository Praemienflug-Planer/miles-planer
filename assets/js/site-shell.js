(() => {
  const navItems = [
    { label: 'Rechner', href: '/rechner/' },
    { label: 'Tools', href: '/tools/' },
    { label: 'Business Class', href: '/meilen-business-class/' },
    { label: 'Thailand', href: '/meilen-thailand/' },
    { label: 'New York', href: '/meilen-new-york/' },
    { label: 'Florida', href: '/florida-mit-meilen/' },
    { label: 'Meilen sammeln', href: '/meilen-sammeln/' },
    { label: 'FAQ', href: '/faq/' },
    { label: 'Kontakt', href: '/kontakt.html' }
  ];

  const legalItems = [
    { label: 'Impressum', href: '/impressum.html' },
    { label: 'Datenschutz', href: '/datenschutz.html' },
    { label: 'Transparenz', href: '/transparenz.html' },
    { label: 'Kontakt', href: '/kontakt.html' }
  ];

  function normalizePath(path) {
    if (!path.endsWith('/') && !path.endsWith('.html')) return `${path}/`;
    return path;
  }

  function isActive(href) {
    const current = normalizePath(window.location.pathname.replace('/miles-planer', ''));
    const target = normalizePath(new URL(href, window.location.origin).pathname);
    if (target === '/meilen-sammeln/') return current === target || current.startsWith('/meilen-sammeln/');
    return current === target;
  }

  function renderNavLinks(items, extraClass = '') {
    return items.map((item) => {
      const active = isActive(item.href) ? ' aria-current="page"' : '';
      return `<a${extraClass ? ` class="${extraClass}"` : ''} href="${item.href}"${active}>${item.label}</a>`;
    }).join('');
  }

  function createHeader() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="container nav">
        <a class="brand" href="/" aria-label="Startseite Prämienflug-Planer">Prämienflug-Planer</a>
        <nav class="main-nav" aria-label="Hauptnavigation">${renderNavLinks(navItems)}</nav>
      </div>
    `;
    return header;
  }

  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="container footer-grid">
        <div><div class="brand footer-brand">Prämienflug-Planer</div><p class="footer-text">Planungstool für Prämienflüge mit Fokus auf Familien, Sammellücke und realistische Umsetzbarkeit.</p></div>
        <div><h4>Navigation</h4><ul class="footer-links">${navItems.filter((item) => item.label !== 'Kontakt').map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}</ul></div>
        <div><h4>Rechtliches</h4><ul class="footer-links">${legalItems.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}</ul></div>
      </div>
    `;
    return footer;
  }

  function mountShell() {
    document.querySelectorAll('a[href^="/miles-planer/"]').forEach((link) => {
      link.setAttribute('href', link.getAttribute('href').replace('/miles-planer/', '/'));
    });

    const existingHeader = document.querySelector('header.site-header');
    const existingFooter = document.querySelector('footer.site-footer');
    if (!existingHeader) {
      const skipLink = document.querySelector('.skip-link');
      const header = createHeader();
      if (skipLink && skipLink.parentNode === document.body) skipLink.insertAdjacentElement('afterend', header);
      else document.body.prepend(header);
    }
    if (!existingFooter) document.body.appendChild(createFooter());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountShell);
  else mountShell();
})();
