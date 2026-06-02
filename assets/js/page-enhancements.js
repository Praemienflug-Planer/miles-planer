(() => {
  const BASE = '';

  function normalizePath(path) {
    if (!path.endsWith('/') && !path.endsWith('.html')) return `${path}/`;
    return path;
  }

  function isPaybackGuidePage() {
    return normalizePath(window.location.pathname) === `${BASE}/meilen-sammeln/payback/`;
  }

  function isMilesMoreCardPage() {
    return normalizePath(window.location.pathname) === `${BASE}/meilen-sammeln/miles-and-more-kreditkarte/`;
  }

  function isAmexGuidePage() {
    return normalizePath(window.location.pathname) === `${BASE}/meilen-sammeln/amex/`;
  }

  function enhancePaybackMilesIntro() {
    if (!isPaybackGuidePage()) return;
    if (document.querySelector('[data-payback-miles-intro]')) return;

    const cards = Array.from(document.querySelectorAll('.article-card.seo-card'));
    const introCard = cards.find((card) => {
      const headline = card.querySelector('h2');
      return headline && headline.textContent.trim() === 'Warum PAYBACK so stark ist';
    });

    if (!introCard) return;

    const firstParagraph = introCard.querySelector('p:not(.eyebrow)');
    if (!firstParagraph) return;

    const note = document.createElement('div');
    note.className = 'warning-box';
    note.setAttribute('data-payback-miles-intro', 'true');
    note.innerHTML = `
      <strong>Der entscheidende PAYBACK-Hebel: Miles &amp; More</strong><br><br>
      Gerade die Umwandlung zu Miles &amp; More macht PAYBACK für Meilensammler so interessant: Aus ganz normalen Alltagsausgaben können später Flugmeilen werden. Windeln, Shampoo, Drogerieeinkäufe, Lebensmittel, Tanken oder Online-Shopping sind dann nicht nur Ausgaben, sondern Bausteine für den nächsten Prämienflug in den Urlaub.
      <br><br>
      Besonders stark wird diese Strategie, wenn PAYBACK Punkte gesammelt, Coupons konsequent aktiviert und später gezielt mit einem Miles-&amp;-More-Transferbonus übertragen werden.
    `;

    firstParagraph.insertAdjacentElement('afterend', note);
  }

  function addPaybackPartnerOverview() {
    if (!isPaybackGuidePage()) return;
    if (document.querySelector('[data-payback-partner-overview]')) return;

    const cards = Array.from(document.querySelectorAll('.article-card.seo-card'));
    const introCard = cards.find((card) => {
      const headline = card.querySelector('h2');
      return headline && headline.textContent.trim() === 'Warum PAYBACK so stark ist';
    });
    if (!introCard) return;

    const partnerCard = document.createElement('div');
    partnerCard.className = 'article-card seo-card';
    partnerCard.id = 'payback-partner';
    partnerCard.setAttribute('data-payback-partner-overview', 'true');
    partnerCard.innerHTML = `
      <p class="eyebrow">Partner &amp; Sammelstellen</p>
      <h2>Wichtige PAYBACK Partner im Alltag</h2>
      <p>PAYBACK wird vor allem dann stark, wenn du Punkte dort sammelst, wo ohnehin regelmäßig Geld ausgegeben wird. Besonders interessant sind deshalb Partner und Aktionen aus den Bereichen Supermarkt, Drogerie, Tanken, Online-Shopping und Gutscheine.</p>
      <div class="seo-table-wrap"><table class="seo-table"><thead><tr><th>Bereich</th><th>Beispiele</th><th>Warum interessant?</th></tr></thead><tbody><tr><td><strong>Supermarkt &amp; Alltag</strong></td><td>EDEKA, Netto Marken-Discount</td><td>regelmäßige Einkäufe, Coupons und Aktionen können sich über das Jahr stark summieren</td></tr><tr><td><strong>Drogerie</strong></td><td>dm und weitere Drogerie-/Alltagspartner</td><td>Windeln, Shampoo, Pflegeprodukte und Haushaltsartikel werden zu planbaren Punktequellen</td></tr><tr><td><strong>Tanken &amp; Mobilität</strong></td><td>z. B. Tankstellen- und Mobilitätspartner</td><td>laufende Mobilitätskosten können über Coupons zusätzliche Punkte bringen</td></tr><tr><td><strong>Online-Shopping</strong></td><td>Amazon- oder Online-Aktionen, je nach aktuellem PAYBACK-Angebot</td><td>Online-Einkäufe können über aktivierte Aktionen oder Gutscheinwege zusätzliche Punkte bringen</td></tr><tr><td><strong>Gutscheine &amp; Aktionen</strong></td><td>Wunschgutschein, Cadooz und ähnliche Aktionswege</td><td>starke Hebel, wenn hohe Mehrfachpunkte oder Sonderaktionen verfügbar sind</td></tr></tbody></table></div>
      <div class="warning-box"><strong>Partner können sich ändern:</strong><br><br>PAYBACK-Partner, Coupons und Online-Aktionen wechseln regelmäßig. Prüfe vor dem Einkauf immer, ob der Partner aktuell teilnimmt und ob ein Coupon aktiviert werden muss.</div>
      <p><a class="btn btn-secondary" href="https://www.payback.de/partner" target="_blank" rel="noopener noreferrer">Aktuelle PAYBACK Partnerübersicht öffnen</a></p>
    `;

    introCard.insertAdjacentElement('afterend', partnerCard);

    const sidebarLinks = document.querySelector('.seo-sidebar .sidebar-links');
    if (sidebarLinks && !sidebarLinks.querySelector('a[href="#payback-partner"]')) {
      const link = document.createElement('a');
      link.href = '#payback-partner';
      link.textContent = 'PAYBACK Partner';
      sidebarLinks.insertAdjacentElement('afterbegin', link);
    }
  }

  function addMilesMorePartnerOverview() {
    if (!isMilesMoreCardPage()) return;
    if (document.querySelector('[data-mm-partner-overview]')) return;

    const anchor = document.querySelector('.article-card.seo-card');
    if (!anchor || !anchor.parentNode) return;

    const card = document.createElement('div');
    card.className = 'article-card seo-card';
    card.id = 'miles-more-partner';
    card.setAttribute('data-mm-partner-overview', 'true');
    card.innerHTML = `
      <p class="eyebrow">Partner &amp; Sammelstellen</p>
      <h2>Wichtige Miles &amp; More Partner und Sammelwege</h2>
      <p>Miles &amp; More besteht nicht nur aus Flügen und Kreditkartenumsätzen. Zusätzliche Meilen können auch über Partner, Online-Shopping, Hotels, Mietwagen, Finanz- und Mobilitätsangebote oder zeitlich begrenzte Aktionen entstehen.</p>
      <div class="seo-table-wrap"><table class="seo-table"><thead><tr><th>Bereich</th><th>Beispiele</th><th>Warum interessant?</th></tr></thead><tbody><tr><td><strong>Flüge</strong></td><td>Lufthansa Group, Star Alliance und weitere Airline-Partner</td><td>klassischer Sammelweg, vor allem bei bezahlten Flügen und Status-/Prämienmeilen relevant</td></tr><tr><td><strong>Kreditkarte</strong></td><td>Miles-&amp;-More-Kreditkarten</td><td>direktes Sammeln über Alltagsumsätze, teilweise mit Willkommensmeilen und Zusatzleistungen</td></tr><tr><td><strong>Online-Shopping</strong></td><td>Miles &amp; More Online Shopping, temporäre Händleraktionen</td><td>zusätzliche Meilen bei ohnehin geplanten Online-Einkäufen</td></tr><tr><td><strong>Hotels &amp; Mietwagen</strong></td><td>Hotel-, Mietwagen- und Reiseanbieter</td><td>hilfreich bei Reisen, Stopovern, Airporthotels oder Mietwagenbuchungen</td></tr><tr><td><strong>Finanzen, Mobilität &amp; Alltag</strong></td><td>zeitlich befristete Aktionen, Challenges, Partnerangebote</td><td>können starke Meilen-Booster sein, wenn die Ausgabe ohnehin geplant ist</td></tr><tr><td><strong>PAYBACK</strong></td><td>PAYBACK Punkte 1:1 zu Miles &amp; More übertragen</td><td>besonders wichtig, weil Alltagsausgaben über PAYBACK später zu Miles-&amp;-More-Meilen werden können</td></tr></tbody></table></div>
      <div class="warning-box"><strong>Partner und Aktionen regelmäßig prüfen:</strong><br><br>Miles-&amp;-More-Partner, Meilenraten, Challenges und Bedingungen können sich ändern. Prüfe vor einem Kauf oder Abschluss immer, ob der Partner aktuell teilnimmt, ob eine Registrierung nötig ist und ob die Meilengutschrift zu deiner Strategie passt.</div>
      <p><a class="btn btn-secondary" href="https://www.miles-and-more.com/de/de/earn.html" target="_blank" rel="noopener noreferrer">Aktuelle Miles-&amp;-More-Sammelpartner öffnen</a></p>
    `;

    anchor.insertAdjacentElement('afterend', card);

    const sidebarLinks = document.querySelector('.seo-sidebar .sidebar-links');
    if (sidebarLinks && !sidebarLinks.querySelector('a[href="#miles-more-partner"]')) {
      const link = document.createElement('a');
      link.href = '#miles-more-partner';
      link.textContent = 'Miles & More Partner';
      sidebarLinks.insertAdjacentElement('afterbegin', link);
    }
  }

  function addAmexOffersSection() {
    if (!isAmexGuidePage()) return;
    if (document.querySelector('[data-amex-offers-section]')) return;

    const target = document.querySelector('#kosten-benefits') || document.querySelector('#willkommensbonus');
    if (!target || !target.parentNode) return;

    const card = document.createElement('div');
    card.className = 'article-card seo-card';
    card.id = 'amex-offers';
    card.setAttribute('data-amex-offers-section', 'true');
    card.innerHTML = `
      <p class="eyebrow">Zusätzlicher Vorteil</p><h2>Amex Offers: zusätzliche Guthaben und Aktionen nutzen</h2>
      <p>Amex Offers sind zeitlich begrenzte Angebote in deinem American-Express-Konto. Je nach Karte und Nutzerprofil können dort zum Beispiel Cashback-, Gutschein-, Punkte- oder Rabattaktionen bei ausgewählten Händlern erscheinen.</p>
      <p>Für Meilensammler sind Amex Offers interessant, weil sie den Kartenwert zusätzlich verbessern können. Wenn du einen Einkauf ohnehin geplant hast und ein passendes Offer aktivierst, kann daraus ein echter Zusatznutzen entstehen.</p>
      <div class="seo-table-wrap"><table class="seo-table"><thead><tr><th>Offer-Typ</th><th>Beispielhafte Wirkung</th><th>Einordnung</th></tr></thead><tbody><tr><td><strong>Cashback/Gutschrift</strong></td><td>z. B. Betrag zurück nach Mindestumsatz</td><td>kann die effektiven Kosten eines ohnehin geplanten Kaufs senken</td></tr><tr><td><strong>Zusatzpunkte</strong></td><td>mehr Membership Rewards Punkte bei ausgewählten Partnern</td><td>kann die Punkteausbeute zusätzlich zum Rewards Turbo erhöhen</td></tr><tr><td><strong>Reise &amp; Hotel</strong></td><td>Angebote bei Hotels, Reiseportalen oder Mobilitätspartnern</td><td>spannend, wenn es zur geplanten Reise passt</td></tr><tr><td><strong>Shopping &amp; Alltag</strong></td><td>Aktionen bei Online-Shops, Marken oder Services</td><td>nur sinnvoll, wenn kein unnötiger Mehrkonsum entsteht</td></tr></tbody></table></div>
      <div class="warning-box"><strong>Offers müssen meist aktiviert werden:</strong><br><br>Amex Offers sind häufig personalisiert, zeitlich begrenzt und an Bedingungen wie Mindestumsatz, Händler, Zeitraum oder Zahlungsart geknüpft. Vor dem Einkauf immer in der Amex App oder im Onlinekonto aktivieren und die Bedingungen prüfen.</div>
    `;

    target.insertAdjacentElement('afterend', card);

    const sidebarLinks = document.querySelector('.seo-sidebar .sidebar-links');
    if (sidebarLinks && !sidebarLinks.querySelector('a[href="#amex-offers"]')) {
      const link = document.createElement('a');
      link.href = '#amex-offers';
      link.textContent = 'Amex Offers';
      const before = sidebarLinks.querySelector('a[href="#transferpartner"]');
      if (before) before.insertAdjacentElement('beforebegin', link);
      else sidebarLinks.appendChild(link);
    }
  }

  function runEnhancements() {
    enhancePaybackMilesIntro();
    addPaybackPartnerOverview();
    addMilesMorePartnerOverview();
    addAmexOffersSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEnhancements);
  } else {
    runEnhancements();
  }
})();
