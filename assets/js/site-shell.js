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

  function enhanceAmexTurboSection() {
    if (normalizePath(window.location.pathname) !== `${BASE}/meilen-sammeln/amex/`) return;
    if (document.querySelector('[data-amex-turbo-details]')) return;

    const section = document.querySelector('#sammeln');
    if (!section) return;

    const intro = Array.from(section.querySelectorAll('p')).find((p) =>
      p.textContent.includes('Rewards Turbo') && p.textContent.includes('Punkteausbeute')
    );
    if (!intro) return;

    const detail = document.createElement('div');
    detail.setAttribute('data-amex-turbo-details', 'true');
    detail.innerHTML = `
      <div class="warning-box">
        <strong>Rewards Turbo aktivieren:</strong><br><br>
        Der Rewards Turbo ist nicht automatisch aktiv, sondern muss manuell aktiviert werden. Laut American Express kostet der Punkteturbo <strong>15&nbsp;€ pro Jahr</strong>. Er erhöht die Punkteausbeute auf <strong>1,5 Membership Rewards Punkte je 1&nbsp;€ Umsatz</strong> und gilt für Umsätze bis zu <strong>40.000&nbsp;€ pro Jahr</strong>. Maßgeblich sind immer die aktuellen Bedingungen von American Express.
      </div>
      <p>Für aktive Meilensammler ist der Rewards Turbo aus meiner Sicht sehr empfehlenswert, weil er aus ohnehin geplanten Kartenumsätzen deutlich mehr Punkte macht. Gerade bei regelmäßigen Alltagsausgaben, Reisen, Versicherungen oder größeren geplanten Zahlungen kann der Effekt über ein Jahr spürbar sein.</p>
      <div class="seo-table-wrap">
        <table class="seo-table">
          <thead><tr><th>Jahresumsatz mit Amex</th><th>Zusätzliche Punkte durch Turbo*</th><th>Einordnung</th></tr></thead>
          <tbody>
            <tr><td>5.000&nbsp;€</td><td>ca. 2.500 Punkte</td><td>kleiner, aber sichtbarer Zusatznutzen</td></tr>
            <tr><td>10.000&nbsp;€</td><td>ca. 5.000 Punkte</td><td>für aktive Sammler meist interessant</td></tr>
            <tr><td>20.000&nbsp;€</td><td>ca. 10.000 Punkte</td><td>deutlicher Hebel für langfristige Reiseziele</td></tr>
            <tr><td>40.000&nbsp;€</td><td>ca. 20.000 Punkte</td><td>maximaler Effekt bis zur genannten Jahresgrenze</td></tr>
          </tbody>
        </table>
      </div>
      <p class="image-note">*Vereinfachte Rechnung mit zusätzlich 0,5 Membership Rewards Punkten pro 1&nbsp;€ Umsatz durch den Rewards Turbo. Quelle/Hinweis: American Express Punkteturbo, 15&nbsp;€ pro Jahr und bis 40.000&nbsp;€ Jahresumsatz; Bedingungen können sich ändern.</p>
    `;

    intro.insertAdjacentElement('afterend', detail);
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
    enhanceAmexTurboSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountShell);
  } else {
    mountShell();
  }
})();
