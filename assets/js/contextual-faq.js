(() => {
  const BASE_PATH = '/miles-planer';
  const SITE_ORIGIN = 'https://praemienflug-planer.github.io';

  const faqByPath = new Map([
    ['/rechner/', [
      ['Wie funktioniert der Prämienflug-Rechner?', 'Du wählst Ziel, Personen, Reiseklasse, Reisezeit und Vielfliegerprogramm aus. Der Rechner vergleicht deinen aktuellen Meilenstand mit einem realistischen Zielwert und zeigt, ob dein Plan eher grün, gelb oder rot ist.'],
      ['Für wen ist der Rechner gedacht?', 'Der Rechner richtet sich vor allem an Familien und Einsteiger, die mehrere Prämienflug-Plätze planen und früh wissen möchten, ob ihre Meilenstrategie realistisch ist.'],
      ['Sind die angezeigten Meilenwerte garantiert?', 'Nein. Die Werte sind Planungswerte. Verfügbarkeit, Steuern, Gebühren und dynamische Award-Preise können je nach Programm, Strecke und Reisezeit abweichen.']
    ]],
    ['/meilen-sammeln/', [
      ['Wie sammelt man als Familie sinnvoll Meilen?', 'Am besten über wiederkehrende Alltagsausgaben, PAYBACK Aktionen, Kreditkartenumsätze und gezielte Transferboni. Entscheidend ist ein klares Ziel, damit Punkte nicht wahllos gesammelt werden.'],
      ['Sollte man zuerst PAYBACK oder Amex Punkte sammeln?', 'PAYBACK ist besonders stark für Miles & More. Amex Membership Rewards sind flexibler, weil sie zu mehreren Airline-Programmen übertragen werden können. Die bessere Wahl hängt vom Zielprogramm ab.'],
      ['Wie lange sollte man für eine Fernreise mit Meilen planen?', 'Für mehrere Personen sind oft ein bis drei Jahre Vorlauf sinnvoll. Gerade Familien brauchen genug Puffer, weil mehrere Prämienplätze auf derselben Verbindung schwieriger zu finden sind.']
    ]],
    ['/meilen-sammeln/payback/', [
      ['Wie sammelt man mit PAYBACK Punkte für Flüge?', 'PAYBACK Punkte können regelmäßig bei Partnern, Coupons und Aktionen gesammelt werden. Besonders interessant sind hohe Punkte-Multiplikatoren und spätere Transfers zu Miles & More.'],
      ['Lohnt sich PAYBACK für Miles & More?', 'Ja, vor allem wenn du ohnehin bei PAYBACK Partnern einkaufst und Transfers zu Miles & More mit Bonusaktionen kombinierst. Für Familien kann PAYBACK ein stabiler Basisbaustein sein.'],
      ['Wann sollte man PAYBACK Punkte zu Miles & More übertragen?', 'In der Regel lohnt es sich, auf Transferaktionen mit Bonus zu warten, sofern die Meilen nicht sofort für eine konkrete Buchung benötigt werden.']
    ]],
    ['/meilen-sammeln/payback-punkte-miles-and-more/', [
      ['Wie werden PAYBACK Punkte zu Miles & More Meilen?', 'PAYBACK Punkte können im PAYBACK Konto zu Miles & More übertragen werden. Häufig entspricht ein PAYBACK Punkt einer Miles & More Meile, zeitweise gibt es zusätzliche Transferboni.'],
      ['Sollte man PAYBACK Punkte automatisch übertragen lassen?', 'Für viele Sammler ist ein manueller Transfer besser, weil man Bonusaktionen abwarten kann. Automatische Transfers sind bequemer, aber weniger flexibel.'],
      ['Verfallen Miles & More Meilen nach dem Transfer?', 'Miles & More Meilen können grundsätzlich verfallen. Ob ein Verfallsschutz besteht, hängt zum Beispiel von Status, Kreditkarte oder den aktuellen Programmbedingungen ab.']
    ]],
    ['/meilen-sammeln/amex/', [
      ['Was sind Amex Membership Rewards Punkte?', 'Membership Rewards Punkte sind das Punkteprogramm von American Express. Sie können zu verschiedenen Airline- und Hotelprogrammen übertragen werden und sind deshalb flexibel einsetzbar.'],
      ['Sind Amex Punkte besser als PAYBACK Punkte?', 'Amex Punkte sind flexibler, PAYBACK Punkte sind direkter für Miles & More nutzbar. Für viele Familien kann eine Kombination aus beiden Systemen sinnvoll sein.'],
      ['Wann sollte man Amex Punkte übertragen?', 'Amex Punkte sollte man meist erst übertragen, wenn eine konkrete Prämienflugbuchung geplant ist. So bleibt man flexibel und vermeidet unnötigen Programm-Lock-in.']
    ]],
    ['/meilen-sammeln/amex-kreditkarten/', [
      ['Welche Amex Karte eignet sich zum Meilen sammeln?', 'Das hängt von Jahresgebühr, Willkommensbonus, Akzeptanz und deinen Ausgaben ab. Wichtig ist, dass die Karte zum eigenen Alltag passt und nicht zu unnötigem Mehrkonsum führt.'],
      ['Zählt die PAYBACK Amex zu Membership Rewards?', 'Nein. Die PAYBACK American Express sammelt PAYBACK Punkte und keine Membership Rewards Punkte. Sie kann trotzdem für Miles & More Sammler interessant sein.'],
      ['Lohnt sich eine Amex nur wegen des Willkommensbonus?', 'Ein Willkommensbonus kann stark sein, sollte aber immer zusammen mit Jahresgebühr, Nutzen der Vorteile und realistischem Punktebedarf bewertet werden.']
    ]],
    ['/meilen-sammeln/miles-and-more/', [
      ['Wie sammelt man Miles & More Meilen im Alltag?', 'Miles & More Meilen lassen sich unter anderem über PAYBACK Transfers, Kreditkartenumsätze, Aktionen und Partnerangebote sammeln. Für Familien ist ein planbarer monatlicher Sammelpfad wichtig.'],
      ['Sind Miles & More Meilen gut für Familienreisen?', 'Miles & More kann für Familien interessant sein, wenn genügend Verfügbarkeit vorhanden ist. Die größte Herausforderung sind mehrere Prämienplätze auf derselben Strecke.'],
      ['Was muss man bei Miles & More zusätzlich beachten?', 'Neben den Meilen fallen oft Steuern, Gebühren und Zuschläge an. Diese Cash-Komponente sollte bei der Planung immer mitgerechnet werden.']
    ]],
    ['/meilen-sammeln/miles-and-more-kreditkarte/', [
      ['Wofür ist die Miles & More Kreditkarte sinnvoll?', 'Sie kann beim Sammeln von Miles & More Meilen helfen und je nach Kartenmodell Vorteile wie Meilenverfallsschutz bieten. Ob sie sich lohnt, hängt von Kosten und Nutzung ab.'],
      ['Kann die Kreditkarte den Meilenverfall verhindern?', 'Je nach Kartenmodell und Bedingungen kann ein Meilenverfallsschutz bestehen. Die aktuellen Regeln sollten vor Abschluss immer direkt beim Anbieter geprüft werden.'],
      ['Ist die Miles & More Kreditkarte besser als PAYBACK?', 'Nicht pauschal. PAYBACK kann bei Aktionen sehr stark sein, die Kreditkarte punktet eher bei laufenden Kartenumsätzen und möglichen Zusatzleistungen.']
    ]],
    ['/meilen-sammeln/wunschgutschein/', [
      ['Warum sind Wunschgutschein-Aktionen für Meilensammler interessant?', 'Bei hohen PAYBACK Multiplikatoren können Wunschgutscheine helfen, Alltagsausgaben wie Amazon oder Supermarkt-Einkäufe in zusätzliche Punkte umzuwandeln.'],
      ['Worauf sollte man bei Wunschgutschein achten?', 'Wichtig sind Einlösebedingungen, verfügbare Händler, Aktivierungsfristen und die Frage, ob der Kauf wirklich ohnehin geplant war.'],
      ['Lohnt sich Wunschgutschein immer?', 'Nein. Es lohnt sich vor allem, wenn du den Gutschein sicher nutzt und der Punktebonus hoch genug ist. Gutscheine sollten keinen unnötigen Mehrkonsum auslösen.']
    ]],
    ['/amex-oder-payback/', [
      ['Was ist besser: Amex oder PAYBACK?', 'PAYBACK ist oft einfacher und stark für Miles & More. Amex ist flexibler, weil Membership Rewards zu mehreren Programmen übertragen werden können. Die beste Wahl hängt vom Reiseziel ab.'],
      ['Kann man Amex und PAYBACK kombinieren?', 'Ja. Viele Strategien kombinieren PAYBACK für Miles & More mit Amex Membership Rewards für flexible Programme wie Flying Blue oder Avios.'],
      ['Welche Strategie passt für Familien?', 'Familien profitieren meist von einem Mix aus planbaren PAYBACK Punkten, flexiblen Amex Punkten und ausreichend Vorlaufzeit für mehrere Prämienplätze.']
    ]],
    ['/amex-meilen-umrechnen/', [
      ['Wie rechnet man Amex Punkte in Meilen um?', 'Amex Membership Rewards werden je nach Transferpartner mit unterschiedlichen Faktoren übertragen. Der Rechner hilft, aus Punkten einen ungefähren Meilenwert abzuleiten.'],
      ['Sind Amex Punkte eins zu eins Airline-Meilen?', 'Nein. Die Umrechnung hängt vom jeweiligen Transferpartner ab. Deshalb sollte man vor einem Transfer prüfen, wie viele Meilen tatsächlich ankommen.'],
      ['Sollte man Amex Punkte sofort transferieren?', 'Meist nicht. Ein Transfer ist oft erst sinnvoll, wenn konkrete Verfügbarkeit für den gewünschten Prämienflug gefunden wurde.']
    ]],
    ['/meilen-thailand/', [
      ['Kann man Thailand mit Meilen als Familie buchen?', 'Ja, aber vier Prämienplätze in Ferienzeiten erfordern viel Vorlauf, flexible Programme und einen realistischen Plan für Zubringer, Steuern und Gebühren.'],
      ['Welche Programme sind für Thailand interessant?', 'Je nach Abflugort und Verfügbarkeit können Flying Blue, Miles & More, Avios oder andere Programme interessant sein. Für Familien zählt vor allem die Verfügbarkeit mehrerer Sitze.'],
      ['Sollte man Koh Samui direkt mit Meilen buchen?', 'Koh Samui ist oft separat zu planen, weil der Weiterflug ab Bangkok häufig besser als separates Cash-Ticket funktioniert.']
    ]],
    ['/meilen-new-york/', [
      ['Ist New York ein gutes Ziel für Prämienflüge?', 'Ja. New York hat viele Verbindungen und ist deshalb ein gutes Beispielziel, um Verfügbarkeit, Meilenpreise und Steuern zu vergleichen.'],
      ['Wie viele Meilen braucht man für New York?', 'Das hängt stark von Programm, Reiseklasse, Saison und Verfügbarkeit ab. Dynamische Programme können deutlich schwanken.'],
      ['Ist New York einfacher als Thailand?', 'Oft ja, weil es mehr Direktverbindungen und höhere Frequenzen gibt. Für Familien bleibt die Suche nach mehreren Prämienplätzen trotzdem wichtig.']
    ]],
    ['/meilen-business-class/', [
      ['Lohnt sich Business Class mit Meilen?', 'Business Class kann mit Meilen sehr attraktiv sein, weil der Gegenwert gegenüber Cash-Tickets oft hoch ist. Verfügbarkeit und Zuschläge müssen aber realistisch eingeplant werden.'],
      ['Warum ist Business Class für Familien schwieriger?', 'Mehrere Business-Class-Prämienplätze auf derselben Verbindung sind begrenzter als einzelne Sitze. Deshalb brauchen Familien besonders viel Vorlauf und Alternativen.'],
      ['Ist Premium Economy manchmal sinnvoller?', 'Ja. Premium Economy kann für Familien realistischer sein, wenn vier Business-Class-Plätze nicht verfügbar sind oder die Meilenlücke zu groß wird.']
    ]],
    ['/vier-praemienflug-plaetze-finden/', [
      ['Wie findet man vier Prämienflug-Plätze?', 'Man braucht frühe Suche, flexible Flughäfen, mehrere Programme und realistische Reiseklassen. Gerade in Ferienzeiten sollte man Alternativen einplanen.'],
      ['Sind vier Plätze in Business Class realistisch?', 'Es ist möglich, aber deutlich schwieriger als ein oder zwei Plätze. Premium Economy oder gemischte Strategien können realistischer sein.'],
      ['Wann sollte man mit der Suche beginnen?', 'Idealerweise sobald der Buchungskalender des Programms öffnet. Für viele Programme bedeutet das ungefähr elf bis zwölf Monate vor Abflug.']
    ]],
    ['/praemienflug-steuern-gebuehren/', [
      ['Warum sind Prämienflüge nicht kostenlos?', 'Auch bei Meilenbuchungen fallen häufig Steuern, Gebühren und Airline-Zuschläge an. Die Höhe hängt von Airline, Strecke, Programm und Reiseklasse ab.'],
      ['Welche Programme haben hohe Zuschläge?', 'Das ist je nach Airline und Programm unterschiedlich. Besonders bei manchen Langstrecken und Premiumklassen können Zuschläge spürbar sein.'],
      ['Wie sollte man Gebühren einplanen?', 'Man sollte neben den Meilen immer ein Cash-Budget pro Person einplanen und verschiedene Programme vergleichen, bevor Punkte übertragen werden.']
    ]],
    ['/meilen-sammeln-familie/', [
      ['Warum ist Meilen sammeln als Familie anders?', 'Familien brauchen mehrere Plätze auf derselben Verbindung und oft feste Ferienzeiten. Dadurch sind Planung, Puffer und flexible Programme wichtiger als bei Alleinreisenden.'],
      ['Wie viele Meilen sollte eine Familie sammeln?', 'Das hängt von Ziel, Reiseklasse und Programm ab. Für Fernreisen mit vier Personen sind oft mehrere hunderttausend Meilen oder Punkte nötig.'],
      ['Was ist der größte Fehler beim Familiensammeln?', 'Ohne konkretes Ziel zu sammeln. Besser ist ein klarer Reiseplan mit Zielprogramm, realistischem Meilenbedarf und Cash-Puffer.']
    ]],
    ['/business-class-mit-kindern/', [
      ['Ist Business Class mit Kindern sinnvoll?', 'Auf langen Strecken kann Business Class mit Kindern sehr angenehm sein. Der Engpass ist aber meist nicht der Komfort, sondern die Verfügbarkeit mehrerer Prämienplätze.'],
      ['Dürfen Kinder in der Business Class sitzen?', 'Ja, Kinder dürfen grundsätzlich in der Business Class reisen. Sitzplatzwahl, Betreuung und Airline-Regeln sollten aber vorab geprüft werden.'],
      ['Welche Sitzplätze sind mit Kindern praktisch?', 'Oft sind Plätze nah beieinander oder zwei Reihen hintereinander sinnvoll. Exit Row ist mit kleinen Kindern in der Regel keine Option.']
    ]],
    ['/premium-economy-mit-kindern/', [
      ['Ist Premium Economy mit Kindern sinnvoll?', 'Premium Economy kann ein guter Kompromiss sein: mehr Komfort als Economy, aber meist realistischer und günstiger als Business Class.'],
      ['Ist Premium Economy für Nachtflüge ausreichend?', 'Für viele Familien ja, besonders wenn der Flug nicht extrem lang ist. Schlafkomfort und Sitzabstand sind besser als in Economy, aber nicht mit Business Class vergleichbar.'],
      ['Lässt sich Premium Economy gut mit Meilen buchen?', 'Je nach Programm und Strecke ja. Für Familien kann Premium Economy oft realistischer sein als vier Business-Class-Prämienplätze.']
    ]],
    ['/business-class-familie-meilen/', [
      ['Kann eine Familie Business Class mit Meilen buchen?', 'Ja, aber vier Plätze sind anspruchsvoll. Entscheidend sind frühe Suche, flexible Programme, alternative Flughäfen und ein ausreichender Meilenpuffer.'],
      ['Welche Strategie hilft bei vier Business-Class-Plätzen?', 'Sinnvoll sind mehrere Programme, flexible Reisedaten, frühe Buchung und die Bereitschaft, Premium Economy als Alternative zu prüfen.'],
      ['Sollte man Meilen vorab übertragen?', 'Meist erst, wenn konkrete Verfügbarkeit sichtbar ist. Vorzeitige Transfers können Punkte in einem Programm binden, ohne dass passende Plätze verfügbar sind.']
    ]],
    ['/premium-economy-oder-business-class/', [
      ['Premium Economy oder Business Class: Was ist besser?', 'Business Class bietet mehr Komfort, Premium Economy ist oft realistischer und meilengünstiger. Für Familien kann Premium Economy der bessere Kompromiss sein.'],
      ['Wann lohnt sich Business Class besonders?', 'Vor allem auf langen Nachtflügen, bei gutem Meilenwert und wenn genügend Plätze verfügbar sind. Die Cash-Zuzahlungen sollten aber mitgerechnet werden.'],
      ['Wann ist Premium Economy sinnvoller?', 'Wenn vier Business-Class-Plätze unrealistisch sind oder die Meilenlücke zu groß wird, kann Premium Economy die entspanntere Planung sein.']
    ]],
    ['/payback-punkte-sammeln-familie/', [
      ['Wie können Familien viele PAYBACK Punkte sammeln?', 'Über wiederkehrende Haushaltsausgaben, Coupons, Aktionen und Partner wie Supermärkte oder Gutscheine. Wichtig ist, nur ohnehin geplante Ausgaben zu bepunkten.'],
      ['Warum ist PAYBACK für Familien interessant?', 'Familien haben oft planbare Alltagsausgaben. Dadurch können über Zeit viele Punkte entstehen, die später zu Miles & More übertragen werden können.'],
      ['Welche PAYBACK Aktionen sind besonders stark?', 'Hohe Multiplikatoren, Willkommenspunkte, Gutscheinaktionen und Transferboni zu Miles & More können besonders attraktiv sein.']
    ]]
  ]);

  function stripBase(pathname) {
    let path = pathname || '/';
    if (path.startsWith(BASE_PATH)) path = path.slice(BASE_PATH.length) || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/') && !path.endsWith('.html')) path += '/';
    return path;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function pageAlreadyHasFaqSchema() {
    return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some(script => /"@type"\s*:\s*"FAQPage"|FAQPage/.test(script.textContent || ''));
  }

  function injectFaqSection(faqs) {
    if (document.querySelector('[data-contextual-faq="true"]')) return;
    const main = document.querySelector('main') || document.body;
    const section = document.createElement('section');
    section.className = 'contextual-faq section';
    section.dataset.contextualFaq = 'true';
    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">Kurz erklärt</span>
          <h2>Häufige Fragen</h2>
        </div>
        <div class="faq-mini-grid">
          ${faqs.map(([question, answer]) => `
            <details class="faq-mini-item">
              <summary>${escapeHtml(question)}</summary>
              <p>${escapeHtml(answer)}</p>
            </details>
          `).join('')}
        </div>
      </div>`;

    const lastSection = main.querySelector('.section:last-of-type, article:last-of-type, .container:last-of-type');
    if (lastSection && lastSection.parentElement === main) lastSection.insertAdjacentElement('afterend', section);
    else main.appendChild(section);
  }

  function injectStyles() {
    if (document.getElementById('contextual-faq-style')) return;
    const style = document.createElement('style');
    style.id = 'contextual-faq-style';
    style.textContent = `.contextual-faq{padding:48px 0}.faq-mini-grid{display:grid;gap:12px}.faq-mini-item{border:1px solid rgba(148,163,184,.28);border-radius:16px;background:rgba(255,255,255,.78);box-shadow:0 12px 30px rgba(15,23,42,.06);overflow:hidden}.faq-mini-item summary{cursor:pointer;font-weight:700;padding:16px 18px;color:#0f172a}.faq-mini-item p{margin:0;padding:0 18px 18px;color:#475569;line-height:1.65}.faq-mini-item[open] summary{color:#0f766e}@media(min-width:780px){.faq-mini-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.faq-mini-item p{font-size:14px}}`;
    document.head.appendChild(style);
  }

  function injectFaqSchema(faqs) {
    if (pageAlreadyHasFaqSchema() || document.querySelector('script[data-schema="contextual-faq"]')) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.schema = 'contextual-faq';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function mount() {
    const path = stripBase(window.location.pathname);
    const faqs = faqByPath.get(path);
    if (!faqs || faqs.length === 0) return;
    injectStyles();
    injectFaqSection(faqs);
    injectFaqSchema(faqs);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
