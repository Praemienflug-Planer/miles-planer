(() => {
  const BASE_PATH = '';

  const faqSets = {
    calculator: [
      ['Wie funktioniert der Prämienflug-Rechner?', 'Du wählst Ziel, Personen, Reiseklasse, Reisezeit und Programm aus. Der Rechner vergleicht deinen aktuellen Punkte- oder Meilenstand mit einem realistischen Zielwert.'],
      ['Sind die Werte garantiert?', 'Nein. Die Ergebnisse sind Planungswerte. Verfügbarkeit, Steuern, Gebühren und dynamische Award-Preise können je nach Programm und Reisezeit abweichen.'],
      ['Für wen ist der Rechner gedacht?', 'Vor allem für Familien und Einsteiger, die mehrere Prämienflug-Plätze planen und früh einschätzen möchten, ob ihr Ziel realistisch ist.']
    ],
    collect: [
      ['Wie sammelt man als Familie sinnvoll Meilen?', 'Am besten über wiederkehrende Alltagsausgaben, PAYBACK Aktionen, Kreditkartenumsätze und gezielte Transferboni. Wichtig ist ein klares Reiseziel.'],
      ['PAYBACK oder Amex: Was ist besser?', 'PAYBACK ist stark für Miles & More. Amex Membership Rewards sind flexibler, weil sie zu mehreren Airline-Programmen übertragen werden können.'],
      ['Wie lange sollte man planen?', 'Für mehrere Personen sind oft ein bis drei Jahre Vorlauf sinnvoll, besonders bei Fernreisen in Ferienzeiten.']
    ],
    payback: [
      ['Wie sammelt man PAYBACK Punkte für Flüge?', 'PAYBACK Punkte entstehen über Partner, Coupons, Aktionen und teilweise Kreditkarten. Besonders spannend sind hohe Multiplikatoren und spätere Transfers zu Miles & More.'],
      ['Wann sollte man PAYBACK Punkte übertragen?', 'Meist lohnt es sich, auf Transferaktionen mit Bonus zu warten, sofern die Meilen nicht sofort für eine konkrete Buchung benötigt werden.'],
      ['Lohnt sich PAYBACK für Familien?', 'Ja, wenn ohnehin viele Alltagsausgaben bei PAYBACK Partnern anfallen. Dann kann über Zeit ein stabiler Meilenbaustein entstehen.']
    ],
    amex: [
      ['Was sind Amex Membership Rewards Punkte?', 'Das sind Punkte von American Express, die zu verschiedenen Airline- und Hotelprogrammen übertragen werden können. Dadurch bleiben sie flexibel.'],
      ['Sollte man Amex Punkte sofort übertragen?', 'Meist nicht. Ein Transfer ist oft erst sinnvoll, wenn konkrete Prämienflug-Verfügbarkeit gefunden wurde.'],
      ['Ist Amex besser als PAYBACK?', 'Nicht pauschal. Amex ist flexibler, PAYBACK ist direkter für Miles & More nutzbar. Oft ist eine Kombination sinnvoll.']
    ],
    milesMore: [
      ['Wie sammelt man Miles & More Meilen im Alltag?', 'Miles & More Meilen lassen sich unter anderem über PAYBACK Transfers, Kreditkartenumsätze, Aktionen und Partnerangebote sammeln.'],
      ['Sind Miles & More Meilen gut für Familienreisen?', 'Ja, wenn genügend Verfügbarkeit vorhanden ist. Die größte Herausforderung sind mehrere Prämienplätze auf derselben Verbindung.'],
      ['Was muss man zusätzlich beachten?', 'Neben den Meilen fallen häufig Steuern, Gebühren und Zuschläge an. Diese Cash-Komponente sollte immer eingeplant werden.']
    ],
    examples: [
      ['Warum sind Beispielseiten hilfreich?', 'Beispiele zeigen realistischer als reine Tabellen, wie viele Meilen, welche Programme und welche Risiken bei einer konkreten Reise relevant sind.'],
      ['Was ist bei Familien besonders schwierig?', 'Familien brauchen mehrere Plätze auf derselben Verbindung und sind oft an Ferienzeiten gebunden. Dadurch wird frühe Planung wichtiger.'],
      ['Sollte man flexibel bleiben?', 'Ja. Alternative Flughäfen, Programme, Reisetage und Reiseklassen erhöhen die Chance, passende Prämienflüge zu finden.']
    ],
    thailand: [
      ['Kann man Thailand mit Meilen als Familie buchen?', 'Ja, aber vier Prämienplätze in Ferienzeiten erfordern viel Vorlauf, flexible Programme und einen realistischen Plan für Zubringer und Gebühren.'],
      ['Welche Programme sind für Thailand interessant?', 'Je nach Abflugort und Verfügbarkeit können Flying Blue, Miles & More, Avios oder andere Programme interessant sein.'],
      ['Sollte man Koh Samui direkt mit Meilen buchen?', 'Oft ist es praktischer, Bangkok separat mit Meilen zu buchen und den Weiterflug nach Koh Samui als Cash-Ticket zu planen.']
    ],
    business: [
      ['Lohnt sich Business Class mit Meilen?', 'Business Class kann mit Meilen sehr attraktiv sein, weil der Gegenwert gegenüber Cash-Tickets oft hoch ist. Verfügbarkeit und Zuschläge bleiben entscheidend.'],
      ['Warum ist Business Class für Familien schwieriger?', 'Mehrere Business-Class-Prämienplätze auf derselben Verbindung sind begrenzter als einzelne Sitze. Familien brauchen daher mehr Vorlauf und Alternativen.'],
      ['Ist Premium Economy manchmal sinnvoller?', 'Ja. Premium Economy kann realistischer sein, wenn vier Business-Class-Plätze nicht verfügbar sind oder die Meilenlücke zu groß wird.']
    ],
    family: [
      ['Warum ist Meilen sammeln als Familie anders?', 'Familien brauchen mehrere Plätze auf derselben Verbindung und haben oft feste Ferienzeiten. Planung, Puffer und flexible Programme sind daher besonders wichtig.'],
      ['Wie viele Meilen braucht eine Familie?', 'Das hängt von Ziel, Reiseklasse und Programm ab. Für Fernreisen mit vier Personen sind oft mehrere hunderttausend Meilen oder Punkte nötig.'],
      ['Was ist der größte Fehler?', 'Ohne klares Ziel zu sammeln. Besser ist ein konkreter Reiseplan mit Zielprogramm, realistischem Meilenbedarf und Cash-Puffer.']
    ],
    fees: [
      ['Warum sind Prämienflüge nicht kostenlos?', 'Auch bei Meilenbuchungen fallen häufig Steuern, Gebühren und Airline-Zuschläge an. Die Höhe hängt von Airline, Strecke, Programm und Reiseklasse ab.'],
      ['Wie sollte man Gebühren einplanen?', 'Neben den Meilen sollte immer ein Cash-Budget pro Person eingeplant werden. Gerade Langstrecken und Premiumklassen können teuer werden.'],
      ['Kann ein anderes Programm günstiger sein?', 'Ja. Deshalb lohnt sich der Vergleich verschiedener Programme, bevor Punkte endgültig übertragen werden.']
    ],
    tools: [
      ['Wofür sind die Tools gedacht?', 'Die Tools sollen schnell zeigen, ob ein Meilenziel realistisch ist und wie groß die Lücke zwischen aktuellem Stand und Zielwert ungefähr ist.'],
      ['Ersetzen die Tools eine echte Verfügbarkeitssuche?', 'Nein. Sie helfen bei der Planung, ersetzen aber keine Suche im jeweiligen Vielfliegerprogramm.'],
      ['Warum sind Annahmen wichtig?', 'Meilenpreise, Gebühren und Verfügbarkeiten ändern sich. Deshalb arbeitet der Planer mit transparenten Annahmen statt mit Garantien.']
    ]
  };

  const pathToSet = new Map([
    ['/rechner/', 'calculator'], ['/tools/', 'tools'], ['/meilen-sammeln/', 'collect'], ['/meilen-sammeln/anfaenger/', 'collect'],
    ['/meilen-sammeln/payback/', 'payback'], ['/meilen-sammeln/payback-punkte-miles-and-more/', 'payback'], ['/payback-punkte-sammeln-familie/', 'payback'], ['/meilen-sammeln/wunschgutschein/', 'payback'], ['/meilen-sammeln/zeitschriftenabo/', 'payback'],
    ['/meilen-sammeln/amex/', 'amex'], ['/meilen-sammeln/amex-kreditkarten/', 'amex'], ['/amex-oder-payback/', 'amex'], ['/amex-meilen-umrechnen/', 'amex'],
    ['/meilen-sammeln/miles-and-more/', 'milesMore'], ['/meilen-sammeln/miles-and-more-kreditkarte/', 'milesMore'],
    ['/meilen-thailand/', 'thailand'], ['/meilen-new-york/', 'examples'], ['/florida-mit-meilen/', 'examples'], ['/meilen-business-class/', 'business'],
    ['/vier-praemienflug-plaetze-finden/', 'family'], ['/praemienflug-steuern-gebuehren/', 'fees'], ['/meilen-sammeln-familie/', 'family'],
    ['/business-class-mit-kindern/', 'business'], ['/premium-economy-mit-kindern/', 'business'], ['/business-class-familie-meilen/', 'business'], ['/premium-economy-oder-business-class/', 'business']
  ]);

  function stripBase(pathname) {
    let path = pathname || '/';
    if (BASE_PATH && path.startsWith(BASE_PATH)) path = path.slice(BASE_PATH.length) || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/') && !path.endsWith('.html')) path += '/';
    return path;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function injectStyles() {
    if (document.getElementById('contextual-faq-style')) return;
    const style = document.createElement('style');
    style.id = 'contextual-faq-style';
    style.textContent = `.contextual-faq{padding:48px 0}.faq-mini-grid{display:grid;gap:12px}.faq-mini-item{border:1px solid rgba(148,163,184,.28);border-radius:16px;background:rgba(255,255,255,.78);box-shadow:0 12px 30px rgba(15,23,42,.06);overflow:hidden}.faq-mini-item summary{cursor:pointer;font-weight:700;padding:16px 18px;color:#0f172a}.faq-mini-item p{margin:0;padding:0 18px 18px;color:#475569;line-height:1.65}.faq-mini-item[open] summary{color:#0f766e}@media(min-width:780px){.faq-mini-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.faq-mini-item p{font-size:14px}}`;
    document.head.appendChild(style);
  }

  function injectFaqSection(faqs) {
    if (document.querySelector('[data-contextual-faq="true"]')) return;
    const main = document.querySelector('main') || document.body;
    const section = document.createElement('section');
    section.className = 'contextual-faq section';
    section.dataset.contextualFaq = 'true';
    section.innerHTML = `<div class="container"><div class="section-heading"><span class="eyebrow">Kurz erklärt</span><h2>Häufige Fragen</h2></div><div class="faq-mini-grid">${faqs.map(([question, answer]) => `<details class="faq-mini-item"><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join('')}</div></div>`;
    const lastSection = main.querySelector('.section:last-of-type, article:last-of-type, .container:last-of-type');
    if (lastSection && lastSection.parentElement === main) lastSection.insertAdjacentElement('afterend', section);
    else main.appendChild(section);
  }

  function mount() {
    const path = stripBase(window.location.pathname);
    const faqs = faqSets[pathToSet.get(path)];
    if (!faqs || faqs.length === 0) return;
    injectStyles();
    injectFaqSection(faqs);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
