(() => {
  const path = window.location.pathname.replace(/\/+$/, '/') || '/';

  const links = {
    rechner: { label: 'Prämienflug-Rechner starten', href: '/rechner/', text: 'Prüfe Meilenbedarf, Sammellücke und Zielmonat für deine Reiseidee.' },
    sammeln: { label: 'Meilen sammeln', href: '/meilen-sammeln/', text: 'Die zentrale Übersicht zu PAYBACK, Amex, Miles & More und alltagstauglichen Sammelwegen.' },
    payback: { label: 'PAYBACK Punkte sammeln', href: '/meilen-sammeln/payback/', text: 'Alltagspunkte, Coupons, Transferbonus und Miles-&-More-Strategie.' },
    paybackTransfer: { label: 'PAYBACK zu Miles & More', href: '/meilen-sammeln/payback-punkte-miles-and-more/', text: 'Schritt-für-Schritt-Einordnung zur Umwandlung von PAYBACK Punkten.' },
    mallorca: { label: 'Mit PAYBACK nach Mallorca', href: '/meilen-sammeln/payback-mallorca/', text: 'Praxisbeispiel mit Meilenbedarf, Zuzahlung, Cashpreis und Gegenwert.' },
    wunschgutschein: { label: 'Wunschgutschein Strategie', href: '/meilen-sammeln/wunschgutschein/', text: 'Gutscheinaktionen sinnvoll nutzen, ohne unnötige Ausgaben zu erzeugen.' },
    amex: { label: 'American Express Guide', href: '/meilen-sammeln/amex/', text: 'Flexible Punkte, Transferpartner, Turbo und Willkommensboni verstehen.' },
    amexCalc: { label: 'Amex Punkte umrechnen', href: '/amex-meilen-umrechnen/', text: 'Membership Rewards grob in Airline-Meilen einordnen.' },
    business: { label: 'Business Class mit Meilen', href: '/meilen-business-class/', text: 'Meilenbedarf, Gebühren und Verfügbarkeit realistisch einschätzen.' },
    thailand: { label: 'Thailand mit Meilen', href: '/meilen-thailand/', text: 'Praxisbeispiel für Familien, Premium Economy, Business Class und lange Vorlaufzeit.' },
    newyork: { label: 'New York mit Meilen', href: '/meilen-new-york/', text: 'Einordnung für USA-Ostküste, Programme und typische Meilenwerte.' },
    seats: { label: '4 Prämienflug-Plätze finden', href: '/vier-praemienflug-plaetze-finden/', text: 'Warum mehrere Award Seats der eigentliche Engpass für Familien sind.' },
    fees: { label: 'Steuern & Gebühren', href: '/praemienflug-steuern-gebuehren/', text: 'Warum Prämienflüge nicht kostenlos sind und wie du Zuzahlungen einordnest.' }
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
      .keyword-list{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.keyword-pill{display:inline-flex;border-radius:999px;background:rgba(37,99,235,.08);border:1px solid rgba(37,99,235,.14);color:#1e3a8a;padding:7px 10px;font-size:.9rem;font-weight:600}
      .keyword-faq{display:grid;gap:12px;margin-top:16px}.keyword-faq details{background:#fff;border:1px solid rgba(148,163,184,.24);border-radius:14px;padding:14px}.keyword-faq summary{cursor:pointer;font-weight:700;color:#0f172a}.keyword-faq p{margin:10px 0 0;color:#475569}
      @media(max-width:760px){.internal-link-grid,.internal-link-grid.three{grid-template-columns:1fr}.internal-link-boost{padding:18px}}
    `;
    document.head.appendChild(style);
  }

  function card(item) {
    return `<a class="internal-link-card" href="${item.href}"><strong>${item.label}</strong><span>${item.text}</span></a>`;
  }

  function block(items, headline, intro, three = false) {
    return `<section class="internal-link-boost" data-internal-link-boost="root"><p class="eyebrow">Interne Orientierung</p><h2>${headline}</h2><p>${intro}</p><div class="internal-link-grid${three ? ' three' : ''}">${items.map(card).join('')}</div></section>`;
  }

  function insertBeforeEnd(html) {
    if (document.querySelector('[data-internal-link-boost="root"]')) return;
    const marker = document.querySelector('.legal-note-section, .cta-section:last-of-type');
    const wrapper = document.createElement('div');
    wrapper.className = 'container';
    wrapper.innerHTML = html;
    if (marker) marker.insertAdjacentElement('beforebegin', wrapper);
    else document.querySelector('main')?.appendChild(wrapper);
  }

  function insertHome() {
    if (document.querySelector('[data-internal-link-boost="home-topics"]')) return;
    const target = document.querySelector('#so-funktioniert-es');
    const html = `<section class="section" data-internal-link-boost="home-topics"><div class="container"><div class="section-head"><p class="eyebrow">Beliebte Themen</p><h2>Direkt zu den wichtigsten Meilen-Themen</h2><p>Viele Besucher starten mit PAYBACK oder dem Rechner. Diese Einstiege führen dich schnell zu den passenden nächsten Schritten.</p></div><div class="internal-link-grid three">${[links.rechner, links.payback, links.mallorca, links.sammeln, links.amex, links.business].map(card).join('')}</div></div></section>`;
    if (target) target.insertAdjacentHTML('beforebegin', html);
  }

  function insertPaybackFaq() {
    if (document.querySelector('[data-internal-link-boost="payback-faq"]')) return;
    const target = document.querySelector('#historische-transferboni') || document.querySelector('.seo-content .article-card:last-of-type');
    if (!target) return;
    const html = `<div class="article-card seo-card" data-internal-link-boost="payback-faq"><p class="eyebrow">Häufig gesucht</p><h2>Häufige Fragen zu PAYBACK, Meilen und Miles & More</h2><p>Viele Besucher suchen zuerst nach konkreten PAYBACK-Fragen. Deshalb sind die wichtigsten Einstiege hier kurz gebündelt.</p><div class="keyword-list"><span class="keyword-pill">mit payback nach mallorca</span><span class="keyword-pill">payback punkte in meilen umwandeln</span><span class="keyword-pill">payback zu miles and more</span><span class="keyword-pill">payback punkte umrechnen</span></div><div class="keyword-faq"><details open><summary>Wie wandle ich PAYBACK Punkte in Meilen um?</summary><p>PAYBACK Punkte können zu Miles-&-More-Meilen übertragen werden. Vor dem Transfer sollte aber klar sein, ob eine konkrete Einlösung oder eine Bonusaktion ansteht.</p></details><details><summary>Kann ich mit PAYBACK nach Mallorca fliegen?</summary><p>Indirekt ja: PAYBACK Punkte können zu Miles-&-More-Meilen werden. Ob sich das lohnt, hängt von Cashpreis, Zuzahlung, Meilenbedarf und Verfügbarkeit ab.</p></details><details><summary>Ist Wunschgutschein mit PAYBACK sinnvoll?</summary><p>Ja, wenn du den Gutschein ohnehin bei einem passenden Händler nutzt. Nicht sinnvoll ist es, Gutscheine nur wegen Punkten zu kaufen.</p></details></div><div class="internal-link-grid three">${[links.mallorca, links.paybackTransfer, links.rechner].map(card).join('')}</div></div>`;
    target.insertAdjacentHTML('beforebegin', html);
  }

  function addSidebarLinks() {
    const sidebar = document.querySelector('.seo-sidebar .sidebar-links');
    if (!sidebar || sidebar.dataset.internalLinksEnhanced) return;
    sidebar.dataset.internalLinksEnhanced = 'true';
    const existing = Array.from(sidebar.querySelectorAll('a')).map(a => a.getAttribute('href'));
    [links.rechner, links.payback, links.mallorca, links.sammeln].forEach(item => {
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
    if (path === '/') insertHome();
    if (path === '/meilen-sammeln/payback/') insertPaybackFaq();
    if (path === '/meilen-business-class/') insertBeforeEnd(block([links.rechner, links.payback, links.amex, links.thailand], 'Business Class weiterplanen', 'Business Class ist meist kein einzelner Trick, sondern eine Kombination aus Meilenbedarf, Sammelweg, Zuzahlung und Verfügbarkeit.'));
    if (path === '/meilen-thailand/') insertBeforeEnd(block([links.rechner, links.payback, links.amex, links.seats], 'Thailand-Reise weiterplanen', 'Für Thailand mit Familie sind mehrere Programme, mehrere Sitzplätze und ein sauberer Punkteaufbau wichtiger als ein einzelner Beispielpreis.'));
    if (path === '/meilen-sammeln/') insertBeforeEnd(block([links.payback, links.mallorca, links.paybackTransfer, links.amex], 'Sammelwege vertiefen', 'Starte nicht mit allem gleichzeitig. Wähle erst den naheliegendsten Sammelweg und ergänze später gezielt weitere Bausteine.'));
    if (path === '/amex-oder-payback/') insertBeforeEnd(block([links.payback, links.mallorca, links.amex, links.rechner], 'PAYBACK und Amex konkret einordnen', 'Die Entscheidung wird leichter, wenn du sie mit deinem Ziel, deiner Personenzahl und deinem Sammeltempo verbindest.'));
    if (path === '/meilen-new-york/') insertBeforeEnd(block([links.rechner, links.payback, links.amexCalc, links.business], 'New York weiterplanen', 'New York ist ein gutes Testziel, um Programme, Zuzahlungen und flexible Punkte praktisch zu vergleichen.'));
    if (path === '/meilen-sammeln/payback-punkte-miles-and-more/') insertBeforeEnd(block([links.payback, links.mallorca, links.fees, links.rechner], 'PAYBACK-Transfer praktisch bewerten', 'Vor dem Transfer sollte klar sein, ob der spätere Flug wirklich einen guten Gegenwert bringt.'));
    addSidebarLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
