# Rechner-Stammdaten

Diese Dateien enthalten die versionierten Stammdaten für den Prämienflug-Rechner.

## Aktueller Status

Der Live-Rechner nutzt inzwischen für alle Kombinationen mit passendem GitHub-Awardwert zuerst die Daten aus `assets/data/`. Nur wenn keine passende Kombination vorhanden ist oder die GitHub-Berechnung fehlschlägt, wird auf die ältere Google-Apps-Script-/Google-Sheets-Berechnung zurückgefallen.

Damit ist GitHub die primäre Datenquelle für die meisten angebotenen Kombinationen; Google Sheets bleibt vorerst als Fallback bestehen.

## Dateien

### `rechner-lists.js`

Enthält die Dropdown-Stammdaten:

- Ziele
- Reiseklassen
- Reisezeiten
- Reisemonate
- Programme
- Szenarien
- Personenanzahl

### `rechner-programs.js`

Enthält Programm-Stammdaten:

- Punktelabel
- Kurzlabel
- Transferquelle
- Transferfaktor
- Transferhinweis
- Mindesttransfer
- Transferdauer
- Bonusannahmen
- Hinweise

Die dortigen Transferregeln werden getrennt von den Award-Planungswerten gepflegt und tragen einen eigenen Datenstand.

### `rechner-award-rates.js`

Enthält Award-Planungswerte:

- Ziel
- Programm
- Reiseklasse
- Best / Realistisch / Konservativ Meilen pro Person Return
- Best / Realistisch / Konservativ Steuern und Gebühren pro Person Return
- Saisonfaktoren
- Cashpreis pro Person
- Quelle
- Hinweis

Diese Werte sind Planungswerte und keine Live-Verfügbarkeiten oder garantierten Awardpreise.

### `rechner-award-extra-destinations.js`, `rechner-award-overrides.js`, `rechner-award-emirates.js`

Ergänzen zusätzliche Ziele, gezielte Overrides und Emirates-Skywards-Planungswerte. Der globale Award-Datenstand bleibt bewusst beim tatsächlichen Stand der zuletzt inhaltlich geprüften Preiswerte.

### `amex-transfer-partners.js`

Diese Datei liegt aktuell unter `assets/js/`, nicht in `assets/data/`, weil sie bereits direkt von der Amex-Umrechner-Seite eingebunden wird.

Sie enthält die bereinigte Liste der deutschen American-Express-Membership-Rewards-Transferpartner.

## Familienlogik

- Flying Blue: Der Rechner berücksichtigt für Kinder von 2–11 Jahren einen 25-%-Abschlag als Planungswert, wenn sie mit einem Erwachsenen reisen. Flying Blue verlangt für diesen Vorteil die Buchung über Air France oder KLM.
- Miles & More: Der 25-%-Child’s-Award-Rabatt gilt nur bei bestimmten ausführenden Airlines. Da der Rechner aktuell keine Airline abfragt, wird bei Miles & More konservativ mit dem vollen Meilenbedarf gerechnet.
- Andere Programme: Ohne eine allgemein belegte Regel wird kein automatischer Kinderrabatt unterstellt.

Die ausführliche Prüfung vom 26.08.2026 ist unter `docs/rechner-data-audit-2026-08-26.md` dokumentiert.

## Pflege-Regeln

1. Programm-/Transferregeln und Award-Planungswerte haben getrennte Datenstände.
2. Ein `dataStand` darf nur aktualisiert werden, wenn die zugehörigen Inhalte tatsächlich geprüft wurden.
3. Änderungen an Transferquoten oder Awardwerten müssen mit Quelle oder Hinweis dokumentiert werden.
4. Dynamische Programme wie Flying Blue sowie dynamisch bepreiste Miles-&-More-Awards dürfen nicht als garantierte Fixpreise dargestellt werden.
5. Werte pro Person beziehen sich grundsätzlich auf Hin- und Rückflug, sofern nicht anders angegeben.
6. Cashpreise sind grobe Vergleichswerte für die Dealbewertung.
7. Kinderrabatte dürfen nur automatisch angewendet werden, wenn die dafür notwendigen Bedingungen im Rechner bekannt sind.
8. Vor Transfer oder Buchung muss der Nutzer immer auf die reale Verfügbarkeit und Zuzahlung beim jeweiligen Programm hingewiesen werden.

## Datenfluss

1. Dropdowns und Programm-Metadaten werden aus den GitHub-Dateien geladen.
2. Der Rechner sucht eine passende Kombination in `window.MILES_PLANNER_AWARD_RATES`.
3. Wenn ein GitHub-Wert vorhanden ist, wird damit gerechnet.
4. Wenn kein Wert vorhanden ist oder die Berechnung fehlschlägt, wird auf den bisherigen Google-Sheets-/Apps-Script-Weg zurückgefallen.

## Nächste sinnvolle Ausbaustufe

- Award-Planungswerte blockweise neu validieren statt pauschal umzudatieren.
- Optional eine Airline-Auswahl ergänzen, damit Miles-&-More-Child’s-Award-Regeln präziser abgebildet werden können.
- Danach den Google-Sheets-Fallback schrittweise entfernen.
