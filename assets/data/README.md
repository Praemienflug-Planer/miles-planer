# Rechner-Stammdaten

Diese Dateien enthalten den GitHub-Stammdaten-Spiegel für den Prämienflug-Rechner.

## Aktueller Status

Der Live-Rechner nutzt aktuell weiterhin Google Apps Script / Google Sheets als Berechnungsquelle.

Die Dateien in diesem Ordner sind zunächst ein versionierter Daten-Spiegel. Sie dienen dazu, Stammdaten künftig einfacher prüfen, aktualisieren und später schrittweise aus Google Sheets herauslösen zu können.

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

Diese Datei ist die künftige Basis für die Auswahlfelder im Rechner.

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

Diese Datei ist die künftige Basis für Programmlogik und Transferhinweise.

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

Diese Werte sind Planungswerte und keine Live-Verfügbarkeiten.

### `amex-transfer-partners.js`

Diese Datei liegt aktuell unter `assets/js/`, nicht in `assets/data/`, weil sie bereits direkt von der Amex-Umrechner-Seite eingebunden wird.

Sie enthält die bereinigte Liste der deutschen American-Express-Membership-Rewards-Transferpartner.

## Pflege-Regeln

1. Jede Datei enthält einen `dataStand`.
2. Änderungen an Transferquoten oder Awardwerten müssen mit Quelle oder Hinweis dokumentiert werden.
3. Dynamische Programme wie Flying Blue sollten als Planungsbereich gepflegt werden, nicht als garantierter Fixpreis.
4. Werte pro Person beziehen sich grundsätzlich auf Hin- und Rückflug, sofern nicht anders angegeben.
5. Cashpreise sind grobe Vergleichswerte für die Dealbewertung.
6. Google Sheets bleibt bis zur Umstellung weiterhin die operative Live-Quelle.

## Geplante Migration

### Phase 1

GitHub-Spiegel der Stammdaten anlegen.  
Status: umgesetzt.

### Phase 1b

Datenstruktur dokumentieren und fehlende Planungswerte ergänzen.  
Status: gestartet.

### Phase 2

Rechner-Dropdowns aus GitHub-Daten laden, Google Sheets bleibt für die Berechnung zuständig.

### Phase 3

Awardwerte und Programmlogik aus GitHub-Daten lesen. Google Sheets wird nur noch als internes Arbeitsmodell verwendet.

### Phase 4

Optional: Google Sheets vollständig ablösen.
