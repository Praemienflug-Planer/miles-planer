(() => {
  const BASE = '/miles-planer';

  function normalizePath(path) {
    if (!path.endsWith('/') && !path.endsWith('.html')) return `${path}/`;
    return path;
  }

  function isPaybackGuidePage() {
    return normalizePath(window.location.pathname) === `${BASE}/meilen-sammeln/payback/`;
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
      <div class="seo-table-wrap">
        <table class="seo-table">
          <thead><tr><th>Bereich</th><th>Beispiele</th><th>Warum interessant?</th></tr></thead>
          <tbody>
            <tr><td><strong>Supermarkt &amp; Alltag</strong></td><td>EDEKA, Netto Marken-Discount</td><td>regelmäßige Einkäufe, Coupons und Aktionen können sich über das Jahr stark summieren</td></tr>
            <tr><td><strong>Drogerie</strong></td><td>dm und weitere Drogerie-/Alltagspartner</td><td>Windeln, Shampoo, Pflegeprodukte und Haushaltsartikel werden zu planbaren Punktequellen</td></tr>
            <tr><td><strong>Tanken &amp; Mobilität</strong></td><td>z. B. Tankstellen- und Mobilitätspartner</td><td>laufende Mobilitätskosten können über Coupons zusätzliche Punkte bringen</td></tr>
            <tr><td><strong>Online-Shopping</strong></td><td>Amazon- oder Online-Aktionen, je nach aktuellem PAYBACK-Angebot</td><td>Online-Einkäufe können über aktivierte Aktionen oder Gutscheinwege zusätzliche Punkte bringen</td></tr>
            <tr><td><strong>Gutscheine &amp; Aktionen</strong></td><td>Wunschgutschein, Cadooz und ähnliche Aktionswege</td><td>starke Hebel, wenn hohe Mehrfachpunkte oder Sonderaktionen verfügbar sind</td></tr>
          </tbody>
        </table>
      </div>
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

  function runEnhancements() {
    enhancePaybackMilesIntro();
    addPaybackPartnerOverview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEnhancements);
  } else {
    runEnhancements();
  }
})();
