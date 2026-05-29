(() => {
  const BASE_PATH = '/miles-planer';
  const SITE_ORIGIN = 'https://praemienflug-planer.github.io';
  const HOME_NAME = 'Prämienflug-Planer';

  const explicitLabels = new Map([
    ['/', HOME_NAME],
    ['/rechner/', 'Prämienflug-Rechner'],
    ['/meilen-sammeln/', 'Meilen sammeln'],
    ['/meilen-sammeln/anfaenger/', 'Meilen sammeln für Anfänger'],
    ['/meilen-sammeln/payback/', 'PAYBACK Punkte sammeln'],
    ['/meilen-sammeln/payback-punkte-miles-and-more/', 'PAYBACK Punkte zu Miles & More übertragen'],
    ['/meilen-sammeln/miles-and-more/', 'Miles & More Meilen sammeln'],
    ['/meilen-sammeln/amex/', 'Amex Membership Rewards sammeln'],
    ['/meilen-sammeln/amex-kreditkarten/', 'Amex Kreditkarten'],
    ['/meilen-sammeln/miles-and-more-kreditkarte/', 'Miles & More Kreditkarte'],
    ['/meilen-sammeln/wunschgutschein/', 'Wunschgutschein Punkte sammeln'],
    ['/meilen-sammeln/zeitschriftenabo/', 'Zeitschriftenabo-Meilen sammeln'],
    ['/amex-oder-payback/', 'Amex oder PAYBACK?'],
    ['/amex-meilen-umrechnen/', 'Amex Punkte in Meilen umrechnen'],
    ['/meilen-thailand/', 'Thailand mit Meilen'],
    ['/meilen-new-york/', 'New York mit Meilen'],
    ['/meilen-business-class/', 'Business Class mit Meilen'],
    ['/vier-praemienflug-plaetze-finden/', '4 Prämienflug-Plätze finden'],
    ['/praemienflug-steuern-gebuehren/', 'Prämienflug Steuern & Gebühren'],
    ['/business-class-mit-kindern/', 'Business Class mit Kindern'],
    ['/premium-economy-mit-kindern/', 'Premium Economy mit Kindern'],
    ['/business-class-familie-meilen/', 'Business Class für Familien mit Meilen'],
    ['/premium-economy-oder-business-class/', 'Premium Economy oder Business Class?'],
    ['/meilen-sammeln-familie/', 'Meilen sammeln als Familie'],
    ['/payback-punkte-sammeln-familie/', 'PAYBACK Punkte sammeln als Familie'],
    ['/tools/', 'Tools'],
    ['/faq/', 'FAQ'],
    ['/ueber-das-projekt/', 'Über das Projekt'],
    ['/kontakt.html', 'Kontakt'],
    ['/impressum.html', 'Impressum'],
    ['/datenschutz.html', 'Datenschutz'],
    ['/transparenz.html', 'Transparenz']
  ]);

  const categoryRoutes = [
    { prefix: '/meilen-sammeln/', name: 'Meilen sammeln', path: '/meilen-sammeln/' },
    { prefix: '/tools/', name: 'Tools', path: '/tools/' },
    { prefix: '/meilen-thailand/', name: 'Beispiele', path: '/meilen-thailand/' },
    { prefix: '/meilen-new-york/', name: 'Beispiele', path: '/meilen-thailand/' },
    { prefix: '/meilen-business-class/', name: 'Beispiele', path: '/meilen-thailand/' },
    { prefix: '/vier-praemienflug-plaetze-finden/', name: 'Beispiele', path: '/meilen-thailand/' },
    { prefix: '/praemienflug-steuern-gebuehren/', name: 'Beispiele', path: '/meilen-thailand/' },
    { prefix: '/business-class-mit-kindern/', name: 'Ratgeber', path: '/meilen-sammeln-familie/' },
    { prefix: '/premium-economy-mit-kindern/', name: 'Ratgeber', path: '/meilen-sammeln-familie/' },
    { prefix: '/business-class-familie-meilen/', name: 'Ratgeber', path: '/meilen-sammeln-familie/' },
    { prefix: '/premium-economy-oder-business-class/', name: 'Ratgeber', path: '/meilen-sammeln-familie/' },
    { prefix: '/payback-punkte-sammeln-familie/', name: 'Ratgeber', path: '/meilen-sammeln-familie/' }
  ];

  function stripBase(pathname) {
    let path = pathname || '/';
    if (path.startsWith(BASE_PATH)) path = path.slice(BASE_PATH.length) || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/') && !path.endsWith('.html')) path += '/';
    return path;
  }

  function absoluteUrl(path) {
    if (path === '/') return `${SITE_ORIGIN}${BASE_PATH}/`;
    return `${SITE_ORIGIN}${BASE_PATH}${path}`;
  }

  function humanize(path) {
    const clean = path.replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '');
    if (!clean) return HOME_NAME;
    return clean
      .split('/')
      .pop()
      .split('-')
      .filter(Boolean)
      .map(part => {
        const lower = part.toLowerCase();
        const special = {
          amex: 'Amex',
          payback: 'PAYBACK',
          miles: 'Miles',
          more: 'More',
          faq: 'FAQ',
          new: 'New',
          york: 'York'
        };
        return special[lower] || part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  }

  function labelFor(path) {
    return explicitLabels.get(path) || humanize(path);
  }

  function buildBreadcrumbs(path) {
    const items = [{ name: HOME_NAME, path: '/' }];
    if (path === '/') return items;

    const category = categoryRoutes.find(route => path.startsWith(route.prefix) && path !== route.path);
    if (category) items.push({ name: category.name, path: category.path });

    if (path.startsWith('/meilen-sammeln/') && path !== '/meilen-sammeln/' && !items.some(item => item.path === '/meilen-sammeln/')) {
      items.push({ name: 'Meilen sammeln', path: '/meilen-sammeln/' });
    }

    items.push({ name: labelFor(path), path });
    return items.filter((item, index, arr) => arr.findIndex(other => other.path === item.path) === index);
  }

  function injectBreadcrumbSchema() {
    if (document.querySelector('script[data-schema="breadcrumb"]')) return;
    const path = stripBase(window.location.pathname);
    const breadcrumbs = buildBreadcrumbs(path);
    if (breadcrumbs.length < 2) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path)
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.schema = 'breadcrumb';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  injectBreadcrumbSchema();
})();
