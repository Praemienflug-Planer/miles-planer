(() => {
  const BASE = '/miles-planer';
  const currentPath = window.location.pathname.replace(/\/+$/, '/') || `${BASE}/`;

  const links = {
    rechner: { label: 'Prämienflug-Rechner starten', href: `${BASE}/rechner/`, text: 'Prüfe Meilenbedarf, Sammellücke und Zielmonat für deine Reiseidee.' },
    payback: { label: 'PAYBACK Punkte sammeln', href: `${BASE}/meilen-sammeln/payback/`, text: 'Alltagspunkte, Coupons, Transferbonus und Miles & More Strategie.' },
    paybackTransfer: { label: 'PAYBACK zu Miles & More übertragen', href: `${BASE}/meilen-sammeln/payback-punkte-miles-and-more/`, text: 'Schritt-für-Schritt-Anleitung zur Umwandlung inklusive typischer Fehler.' },
    sammeln: { label: 'Meilen sammeln', href: `${BASE}/meilen-sammeln/`, text: 'Die zentrale Übersicht zu PAYBACK, Amex, Miles & More und alltagstauglichen Sammelwegen.' },
    amex: { label: 'Amex Punkte umrechnen', href: `${BASE}/amex-meilen-umrechnen/`, text: 'Membership Rewards einordnen und grob in Airline-Meilen umrechnen.' },
    amexGuide: { label: 'American Express Guide', href: `${BASE}/meilen-sammeln/amex/`, text: 'Flexible Punkte, Transferpartner, Turbo und Willkommensboni verstehen.' },
    business: { label: 'Business Class mit Meilen', href: `${BASE}/meilen-business-class/`, text: 'Meilenbedarf, Gebühren und Verfügbarkeit realistisch einschätzen.' },
    thailand: { label: 'Thailand mit Meilen', href: `${BASE}/meilen-thailand/`, text: 'Praxisbeispiel für Familien, Premium Economy, Business Class und lange Vorlaufzeit.' },
    newyork: { label: 'New York mit Meilen', href: `${BASE}/meilen-new-york/`, text: 'Einordnung für USA-Ostküste, Programme und typische Meilenwerte.' },
    wunschgutschein: { label: 'Wunschgutschein Strategie', href: `${BASE}/meilen-sammeln/wunschgutschein/`, text: 'Gutscheinaktionen sinnvoll nutzen, ohne unnötige Ausgaben zu erzeugen.' },
    steuer: { label: 'Steuern & Gebühren', href: `${BASE}/praemienflug-steuern-gebuehren/`, text: 'Warum Prämienflüge nicht kostenlos sind und wie du Zuzahlungen einordnest.' },
    seats: { label: '4 Prämienflug-Plätze finden', href: `${BASE}/vier-praemienflug-plaetze-finden/`, text: 'Warum mehrere Award Seats der eigentliche Engpass für Familien sind.' }
  };

  function addStyle() {
    if (document.getElementById('internal-link-boost-style')) return;
    const style = document.createElement('style');
    style.id = 'internal-link-boost-style';
    style.textContent = `
      .internal-link-boost{margin:28px 0;padding:22px;border:1px solid rgba(148,163,184,.22);border-radius:22px;background:linear-gradient(135deg,rgba(14,165,233,.08),rgba(15,23,42,.03));box-shadow:0 14px 34px rgba(15,23,42,.06)}
      .internal-link-boost h2,.internal-link-boost h3{margin-top:0}.internal-link-boost p{margin-bottom:14px}
      .internal-link-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}.internal-link-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}
      .internal-link-card{display:block;text-decoration:none;color:inherit;background:#fff;border:1px solid rgba(148,163,184,.24);border-radius:16px;padding:16px;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.internal-link-card:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(15,23,42,.10);border-color:rgba(37,99,235,.35)}
      .internal-link-card strong{display:block;margin-bottom:6px;color:#0f172a}.internal-link-card span{display:block;color:#475569;font-size:.95rem;line-height:1.45}
      .payback-hub-extra .mini-table{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}.payback-hub-extra .mini-table div{background:#fff;border:1px solid rgba(148,163,184,.24);border-radius:14px;padding:14px}.payback-hub-extra .mini-table strong{display:block;margin-bottom:6px;color:#0f172a}
      .payback-toc{margin:22px 0;padding:18px;border-radius:18px;background:#fff;border:1px solid rgba(148,163,184,.24)}.payback-toc ul{margin:10px 0 0;padding-left:18px}.payback-toc li{margin:6px 0}
      .keyword-faq{display:grid;gap:12px;margin-top:16px}.keyword-faq details{background:#fff;border:1px solid rgba(148,163,184,.24);border-radius:14px;padding:14px}.keyword-faq summary{cursor:pointer;font-weight:700;color:#0f172a}.keyword-faq p{margin:10px 0 0;color:#475569}.keyword-list{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}.keyword-pill{display:inline-flex;align-items:center;border-radius:999px;background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.14);color:#1e3a8a;padding:7px 10px;font-size:.9rem;font-weight:600}
      @media(max-width:760px){.internal-link-grid,.internal-link-grid.three,.payback-hub-extra .mini-table{grid-template-columns:1fr}.internal-link-boost{padding:18px}}
    `;
    document.head.appendChild(style);
  }

  function card(item) {
    return `<a class="internal-link-card" href="${item.href}"><strong>${item.label}</strong><span>${item.text}</span></a>`;
  }

  function makeRelated(items, headline = 'Passend dazu weiterplanen', intro = 'Diese Seiten passen thematisch zu diesem Artikel und helfen dir, vom Lesen direkt in die konkrete Planung zu kommen.') {
    return `<section class="internal-link-boost" data-internal-link-boost="related"><p class="eyebrow">Interne Orientierung</p><h2>${headline}</h2><p>${intro}</p><div class="internal-link-grid">${items.map(card).join('')}</div></section>`;
  }

  function insertBeforeLegal(html) {
    const marker = document.querySelector('.legal-note-section, .cta-section:last-of-type');
    const wrapper = document.createElement('div');
    wrapper.className = 'container';
    wrapper.innerHTML = html;
    if (marker) marker.insertAdjacentElement('beforebegin', wrapper);
    else document.querySelector('main')?.appendChild(wrapper);
  }

  function insertAfterFirstArticle(html) {
    const target = document.querySelector('.seo-content .article-card, article .article-card');
    if (!target) return;
    target.insertAdjacentHTML('afterend', html);
  }

  function enhancePaybackHub() {
    if (document.querySelector('[data-internal-link-boost="payback-hub"]')) return;
    const html = `
      <div class="article-card seo-card payback-hub-extra" data-internal-link-boost="payback-hub">
        <p class="eyebrow">PAYBACK Hub</p>
        <h2>So nutzt du diese PAYBACK-Seite, ohne dich zu verlieren</h2>
        <p>Diese Seite ist bewusst die zentrale PAYBACK-Übersicht. Für einzelne Spezialthemen gibt es eigene Vertiefungen. So bleibt der Hauptartikel stark, aber du kannst bei Bedarf gezielt weiterklicken.</p>
        <div class="payback-toc"><strong>Schnelleinstieg auf dieser Seite:</strong><ul><li>Erst Alltag und Coupons verstehen</li><li>Dann Wunschgutschein, Verträge und PAYBACK Amex einordnen</li><li>Zum Schluss Transferzeitpunkt und Miles-&amp;-More-Logik prüfen</li></ul></div>
        <div class="mini-table"><div><strong>Für Einsteiger</strong>PAYBACK-Konto, Coupons und normale Einkäufe konsequent nutzen.</div><div><strong>Für Familien</strong>Größere Haushaltsausgaben, Verträge und Gutscheinaktionen planvoll bündeln.</div><div><strong>Für Miles &amp; More</strong>Punkte nicht vorschnell übertragen, sondern Transferbonus und konkrete Einlösung abwarten.</div></div>
        <div class="internal-link-grid three">
          ${card(links.paybackTransfer)}
          ${card(links.wunschgutschein)}
          ${card(links.rechner)}
        </div>
      </div>`;
    insertAfterFirstArticle(html);

    const familyExample = `
      <div class="article-card seo-card payback-hub-extra" data-internal-link-boost="payback-family-example">
        <p class="eyebrow">Familienbeispiel</p>
        <h2>Warum PAYBACK gerade für Familien spannend sein kann</h2>
        <p>Bei vier Personen reicht ein einzelner Kartenbonus selten aus. Spannend wird PAYBACK, wenn Alltag, Coupons, Wunschgutscheine, Vertragsaktionen und ein guter Transferbonus zusammenkommen. Genau dann wird aus vielen kleinen Punkten ein Baustein für einen echten Prämienflug-Plan.</p>
        <div class="mini-table"><div><strong>10.000 Punkte</strong>Solider Start, aber noch kein Fernreiseziel.</div><div><strong>50.000 Punkte</strong>Mit Transferbonus schon ein relevanter Miles-&amp;-More-Baustein.</div><div><strong>100.000 Punkte</strong>Für Familien ein ernstzunehmender Zwischenschritt, aber weiterhin nur Teil der Gesamtplanung.</div></div>
        <p>Ob diese Größenordnung für dein Ziel reicht, hängt von Strecke, Reiseklasse, Personenanzahl und Zuzahlungen ab. Genau dafür ist der Rechner als nächster Schritt gedacht.</p>
      </div>`;
    const transferBlock = document.querySelector('#historische-transferboni');
    if (transferBlock) transferBlock.insertAdjacentHTML('beforebegin', familyExample);
  }

  function enhancePaybackSearchDemand() {
    if (document.querySelector('[data-internal-link-boost="payback-keyword-faq"]')) return;
    const target = document.querySelector('#historische-transferboni') || document.querySelector('.seo-content .article-card:last-of-type');
    if (!target) return;
    const html = `
      <div class="article-card seo-card payback-hub-extra" data-internal-link-boost="payback-keyword-faq">
        <p class="eyebrow">Häufig gesucht</p>
        <h2>Häufige Fragen zu PAYBACK, Meilen und Miles &amp; More</h2>
        <p>Viele suchen nicht direkt nach einem Prämienflug-Rechner, sondern erst nach ganz konkreten PAYBACK-Fragen. Deshalb findest du hier die wichtigsten Antworten kurz und verständlich gebündelt.</p>
        <div class="keyword-list" aria-label="Häufig gesuchte Begriffe"><span class="keyword-pill">wunschgutschein payback</span><span class="keyword-pill">payback punkte in meilen umwandeln</span><span class="keyword-pill">payback zu miles and more</span><span class="keyword-pill">payback punkte umrechnen</span><span class="keyword-pill">payback punkte meilen aktion</span></div>
        <div class="keyword-faq">
          <details open><summary>Wie wandle ich PAYBACK Punkte in Meilen um?</summary><p>PAYBACK Punkte können zu Miles-&amp;-More-Meilen übertragen werden. Standardmäßig gilt die einfache Logik: 1 PAYBACK Punkt entspricht grundsätzlich 1 Miles-&amp;-More-Meile. Vor dem Transfer solltest du aber prüfen, ob eine konkrete Einlösung oder eine Bonusaktion ansteht.</p></details>
          <details><summary>Lohnt sich PAYBACK zu Miles &amp; More?</summary><p>Es lohnt sich vor allem dann, wenn du die Meilen später wirklich für einen sinnvollen Prämienflug nutzt. Wenn du keinen Flug planst, kann der einfache PAYBACK-Gegenwert manchmal entspannter sein.</p></details>
          <details><summary>Sollte man auf eine PAYBACK-Meilen-Aktion warten?</summary><p>Wenn du nicht sofort buchen musst, kann Warten sinnvoll sein. Transferbonus-Aktionen erhöhen die Meilenmenge, ändern aber nichts daran, dass Verfügbarkeit, Steuern und Gebühren vorher geprüft werden sollten.</p></details>
          <details><summary>Was bedeutet PAYBACK Punkte umrechnen?</summary><p>Beim Umrechnen geht es meistens um zwei Fragen: Wie viel Euro-Gegenwert haben die Punkte? Und wie viele Miles-&amp;-More-Meilen entstehen daraus? Für Prämienflüge ist die zweite Frage nur dann wertvoll, wenn der spätere Flug einen guten Gegenwert liefert.</p></details>
          <details><summary>Ist Wunschgutschein mit PAYBACK sinnvoll?</summary><p>Ja, wenn du den Gutschein ohnehin bei einem passenden Händler nutzt. Nicht sinnvoll ist es, Gutscheine nur wegen Punkten zu kaufen und später keinen klaren Einsatz dafür zu haben.</p></details>
          <details><summary>Kann ich mit PAYBACK eine Familienreise finanzieren?</summary><p>PAYBACK kann ein Baustein sein, ersetzt aber selten die komplette Reiseplanung. Für Familien zählen vor allem mehrere Sitzplätze, lange Vorlaufzeit, realistische Reiseklasse und ein gutes Verhältnis aus Meilen und Zuzahlungen.</p></details>
        </div>
        <div class="internal-link-grid three">
          ${card(links.paybackTransfer)}
          ${card(links.wunschgutschein)}
          ${card(links.rechner)}
        </div>
      </div>`;
    target.insertAdjacentHTML('beforebegin', html);
  }

  function enhanceHome() {
    if (document.querySelector('[data-internal-link-boost="home-topics"]')) return;
    const target = document.querySelector('#so-funktioniert-es');
    const html = `<section class="section" data-internal-link-boost="home-topics"><div class="container"><div class="section-head"><p class="eyebrow">Beliebte Themen</p><h2>Direkt zu den wichtigsten Meilen-Themen</h2><p>Viele Besucher starten mit PAYBACK oder dem Rechner. Diese Einstiege führen dich schnell zu den passenden nächsten Schritten.</p></div><div class="internal-link-grid three">${[links.rechner, links.payback, links.sammeln, links.amex, links.business, links.thailand].map(card).join('')}</div></div></section>`;
    if (target) target.insertAdjacentHTML('beforebegin', html);
  }

  function enhanceContextLinks() {
    if (document.querySelector('[data-internal-link-boost="context"]')) return;
    let html = '';
    if (currentPath === `${BASE}/meilen-business-class/`) {
      html = makeRelated([links.rechner, links.payback, links.amex, links.thailand], 'Business Class weiterplanen', 'Business Class ist meist kein einzelner Trick, sondern eine Kombination aus Meilenbedarf, Sammelweg, Zuzahlung und Verfügbarkeit.');
    } else if (currentPath === `${BASE}/meilen-thailand/`) {
      html = makeRelated([links.rechner, links.payback, links.amex, links.seats], 'Thailand-Reise weiterplanen', 'Für Thailand mit Familie sind mehrere Programme, mehrere Sitzplätze und ein sauberer Punkteaufbau wichtiger als ein einzelner Beispielpreis.');
    } else if (currentPath === `${BASE}/meilen-sammeln/`) {
      html = makeRelated([links.payback, links.paybackTransfer, links.amexGuide, links.wunschgutschein], 'Sammelwege vertiefen', 'Starte nicht mit allem gleichzeitig. Wähle erst den naheliegendsten Sammelweg und ergänze später gezielt weitere Bausteine.');
    } else if (currentPath === `${BASE}/amex-oder-payback/`) {
      html = makeRelated([links.payback, links.amexGuide, links.rechner, links.sammeln], 'PAYBACK und Amex konkret einordnen', 'Die Entscheidung wird leichter, wenn du sie mit deinem Ziel, deiner Personenzahl und deinem Sammeltempo verbindest.');
    } else if (currentPath === `${BASE}/meilen-new-york/`) {
      html = makeRelated([links.rechner, links.payback, links.amex, links.business], 'New York weiterplanen', 'New York ist ein gutes Testziel, um Programme, Zuzahlungen und flexible Punkte praktisch zu vergleichen.');
    }
    if (html) insertBeforeLegal(html.replace('data-internal-link-boost="related"', 'data-internal-link-boost="context"'));
  }

  function enhanceSidebars() {
    const sidebar = document.querySelector('.seo-sidebar .sidebar-links');
    if (!sidebar || sidebar.dataset.internalLinksEnhanced) return;
    sidebar.dataset.internalLinksEnhanced = 'true';
    const existing = Array.from(sidebar.querySelectorAll('a')).map(a => a.getAttribute('href'));
    [links.payback, links.rechner, links.sammeln].forEach(item => {
      if (!existing.includes(item.href)) {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        sidebar.appendChild(a);
      }
    });
  }

  function mount() {
    addStyle();
    if (currentPath === `${BASE}/`) enhanceHome();
    if (currentPath === `${BASE}/meilen-sammeln/payback/`) {
      enhancePaybackHub();
      enhancePaybackSearchDemand();
    }
    enhanceContextLinks();
    enhanceSidebars();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
