# Maintenance Standards

## Ziel
Die Website soll schlank, wartbar und konsistent bleiben. Neue Features sollen nicht wieder zu einer großen unübersichtlichen CSS-Datei, uneinheitlichen Headern/Footerern oder ungenutzten Bildbeständen führen.

## URL-Standard
Öffentliche Seiten, Assets und interne Links verwenden ausschließlich die aktuelle Domain und Root-Pfade:

- Domain: `https://praemienflug-planer.de`
- interne Links: z. B. `/rechner/`, `/meilen-sammeln/`, `/assets/css/site.css`
- keine neuen `/miles-planer/`-Pfade
- keine neuen Canonicals oder OG-URLs auf `praemienflug-planer.github.io`

Die Datei `_includes/legacy-github-redirect.html` bleibt ausschließlich als Kompatibilitäts-Redirect für alte GitHub-Pages-Aufrufe bestehen. Die Layouts sollen alte Pfade nicht mehr nachträglich im Seiteninhalt umschreiben.

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
Header und Hauptnavigation werden zentral über `_includes/header.html` gepflegt. Neue Seiten sollen keinen eigenen statischen Header mehr kopieren.

Aktuelle Top-Level-Navigation:

- Rechner
- Meilen sammeln
- Familien
- Reiseziele
- Ratgeber
- Tools

Unterpunkte werden ebenfalls zentral im Header gepflegt. Änderungen an der Informationsarchitektur deshalb immer dort und – falls noch relevant – im Legacy-Navigations-Shell synchron nachvollziehen.

In Layouts wird der Header so eingebunden:

```liquid
{% include header.html %}
```

## Footer-Standard
Der Footer wird zentral über `_includes/footer.html` gepflegt. Neue Seiten sollen keinen eigenen Footer duplizieren.

```liquid
{% include footer.html %}
```

Kontakt, Transparenz, Datenschutz und Impressum gehören in den zentralen Footer und nicht als zusätzliche Top-Level-Hauptnavigation in einzelne Seiten.

## Seitenstandard
Jede öffentliche Seite sollte enthalten:

- individuellen `<title>`
- individuelle Meta-Description
- Canonical-Link auf `https://praemienflug-planer.de/...`
- `meta name="robots" content="index,follow"`
- ein Haupt-`h1`
- zentrale Hauptnavigation über das Layout
- zentralen Footer über das Layout
- Root-Pfade für interne Links und Assets
- `site.css` und bei Bedarf `hero-background.css`

SEO-Titel und Meta-Description werden auf der jeweiligen Seite gepflegt. Die Layouts sollen dafür keine URL-spezifischen Titel- oder Description-Overrides enthalten. Damit gibt es pro Seite nur eine redaktionelle Quelle und spätere SEO-Optimierungen können nicht unbemerkt durch einen alten Layout-Wert überschrieben werden. Ein abweichender sichtbarer Kurztext kann bei Bedarf über `page.snippet_lead` gesetzt werden.

Neue strukturierte Seiten sollten nach Möglichkeit `layout: page` verwenden. Ältere statische HTML-Seiten können vorerst über `layout: default` laufen, sollen bei Überarbeitung aber ebenfalls direkte Root-Pfade verwenden.

## SEO-Artikelstandard
Neue Ratgeberseiten sollen nach Möglichkeit zusätzlich enthalten:

- klare Suchintention im ersten Absatz: für wen ist die Seite und welches Problem löst sie?
- sprechende URL mit Hauptkeyword, z. B. `/business-class-familie-meilen/`
- mindestens 3 interne Links zu passenden Cluster-Seiten
- sichtbarer CTA zum Rechner oberhalb der Seitenmitte und im Fazit
- Sidebar mit passenden Ratgeberlinks
- FAQ-Block mit 3 bis 5 echten Nutzerfragen
- strukturierte Daten: `Article`, bei FAQ zusätzlich `FAQPage`, bei Ratgeberclustern zusätzlich `BreadcrumbList`
- Eintrag in `sitemap.xml` mit aktuellem `lastmod`
- mindestens eine interne Verlinkung von Navigation, Hub-Seite oder thematisch passender Seite

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
