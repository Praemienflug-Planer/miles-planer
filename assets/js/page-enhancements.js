(() => {
  const BASE = '/miles-planer';

  function normalizePath(path) {
    if (!path.endsWith('/') && !path.endsWith('.html')) return `${path}/`;
    return path;
  }

  function enhancePaybackMilesIntro() {
    if (normalizePath(window.location.pathname) !== `${BASE}/meilen-sammeln/payback/`) return;
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

  function runEnhancements() {
    enhancePaybackMilesIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEnhancements);
  } else {
    runEnhancements();
  }
})();
