# Maintenance Standards

## Ziel
Die Website soll schlank, wartbar und konsistent bleiben. Neue Features sollen nicht wieder zu einer großen unübersichtlichen CSS-Datei, uneinheitlichen Headern/Footerern oder ungenutzten Bildbeständen führen.

## CSS-Struktur
Die zentrale Datei `/assets/css/site.css` bleibt ein kleiner Import-Hub.

Aktuelle Struktur:

- `/assets/css/base.css` – Variablen, Grundtypografie, Buttons, Basis-Formularstatus
- `/assets/css/layout.css` – Header, Footer, Hero, Karten, Sections, Kontaktlayout
- `/assets/css/articles.css` – SEO-/Artikel-Layouts, Tabellen, FAQ, Sidebars, Bilder, Hinweisboxen
- `/assets/css/tools.css` – Rechner, Ergebnisboxen, Deal-Kacheln, Tool-Formulare, Ampeln
- `/assets/css/hero-background.css` – Hero-Hintergründe und Bildwelten

Regel: Keine neuen großen Blöcke mehr direkt in `site.css` einfügen.

## Header-Standard
Neue und überarbeitete Seiten sollen diese Hauptnavigation verwenden:

```html
<header class="site-header">
  <div class="container nav">
    <a class="brand" href="/miles-planer/">Prämienflug-Planer</a>
    <nav class="main-nav" aria-label="Hauptnavigation">
      <a href="/miles-planer/rechner/">Rechner</a>
      <a href="/miles-planer/meilen-business-class/">Business Class</a>
      <a href="/miles-planer/meilen-thailand/">Thailand</a>
      <a href="/miles-planer/meilen-new-york/">New York</a>
      <a href="/miles-planer/amex-meilen-umrechnen/">Amex umrechnen</a>
      <a href="/miles-planer/meilen-sammeln/">Meilen sammeln</a>
      <a href="/miles-planer/faq/">FAQ</a>
      <a href="/miles-planer/kontakt.html">Kontakt</a>
    </nav>
  </div>
</header>
```

## Footer-Standard
Neue und überarbeitete Seiten sollen diesen Footer verwenden:

```html
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <div class="brand footer-brand">Prämienflug-Planer</div>
      <p class="footer-text">Planungstool für Prämienflüge mit Fokus auf Familien, Sammellücke und realistische Umsetzbarkeit.</p>
    </div>
    <div>
      <h4>Navigation</h4>
      <ul class="footer-links">
        <li><a href="/miles-planer/rechner/">Rechner</a></li>
        <li><a href="/miles-planer/meilen-business-class/">Business Class</a></li>
        <li><a href="/miles-planer/meilen-thailand/">Thailand</a></li>
        <li><a href="/miles-planer/meilen-new-york/">New York</a></li>
        <li><a href="/miles-planer/amex-meilen-umrechnen/">Amex umrechnen</a></li>
        <li><a href="/miles-planer/meilen-sammeln/">Meilen sammeln</a></li>
        <li><a href="/miles-planer/faq/">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h4>Rechtliches</h4>
      <ul class="footer-links">
        <li><a href="/miles-planer/impressum.html">Impressum</a></li>
        <li><a href="/miles-planer/datenschutz.html">Datenschutz</a></li>
        <li><a href="/miles-planer/transparenz.html">Transparenz</a></li>
        <li><a href="/miles-planer/kontakt.html">Kontakt</a></li>
      </ul>
    </div>
  </div>
</footer>
```

## Seitenstandard
Jede öffentliche Seite sollte enthalten:

- individuellen `<title>`
- individuelle Meta-Description
- Canonical-Link
- `meta name="robots" content="index,follow"`
- ein Haupt-`h1`
- einheitliche Hauptnavigation inkl. FAQ und Kontakt
- einheitlichen Footer
- `site.css` und bei Bedarf `hero-background.css`

## Bildstandard
Bilder nur behalten, wenn sie mindestens eine der folgenden Funktionen erfüllen:

1. direkt auf einer Seite eingebunden
2. als große Klickversion zu einem kleinen Screenshot genutzt
3. als OG-/Hero-Bild genutzt
4. realistisch für eine geplante Seite wiederverwendbar

Nicht behalten:

- doppelte Screenshots ohne unterschiedliche Funktion
- sehr große PNGs ohne sichtbaren Mehrwert
- alte Testbilder
- Screenshots mit personenbezogenen Daten
- generierte Varianten, die nicht eingebunden werden

## Workflow
Größere Änderungen immer auf Branch + PR:

1. Branch anlegen
2. betroffene Dateien frisch fetchen
3. kleine, thematische Commits
4. PR prüfen
5. mergen

Keine großen Direktänderungen mehr auf `main`, wenn mehrere Dateien betroffen sind.
