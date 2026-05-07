# Image Audit

## Stand
Aktualisiert nach dem technischen Cleanup und nach Entfernung der alten `styles.css`.

## Ergebnis in Kurzform
Die aktuell bekannten redaktionellen Screenshots werden aktiv genutzt. Es gibt derzeit keinen Bildkandidaten, der ohne vollständige Verzeichnisliste sicher gelöscht werden sollte.

Der GitHub-Connector kann Verzeichnisse wie `/images` nicht vollständig listen. Deshalb basiert diese Prüfung auf den aktuell sicher erkannten Referenzen in den HTML-Dateien. Keine Bilddatei sollte gelöscht werden, bevor nicht eine vollständige Dateiliste aus GitHub oder lokal gegen die HTML-/CSS-/JS-Referenzen geprüft wurde.

## Sicher genutzt
Diese Bilder sind aktuell in Seiten eingebunden oder als Klick-Ziel für größere Ansichten genutzt.

### PAYBACK-Seite
Aktiv genutzt auf `/meilen-sammeln/payback/`:

- `/images/payback_coupon_wunschgutschein.png`
- `/images/payback_coupon_dm_15xkauf.png`
- `/images/payback_coupon_aral.png`
- `/images/payback_sammeln_dmx15.png`
- `/images/payback_sammeln_netto_20fach.png`
- `/images/payback_sammeln_amazon.png`
- `/images/payback_sammeln_eon_strom.png`
- `/images/payback_sammeln_eon_gas.png`
- `/images/Eingabe_umwandlung_payback_MM_large.png`
- `/images/Eingabe_umwandlung_payback_MM_small.jpg`
- `/images/bestätigung_umwandlung_payback_MM_large.png`
- `/images/bestätigung_umwandlung_payback_MM_small.jpg`
- `/images/mm_umwandlung_payback.png`

Bewertung: behalten. Diese Screenshots sind wichtig für Vertrauen, Praxisnähe und die PAYBACK-Transferstrategie.

### Wunschgutschein-Seite
Aktiv genutzt auf `/meilen-sammeln/wunschgutschein/`:

- `/images/payback_coupon_wunschgutschein.png`
- `/images/wunschgutschein_partner_large.png`
- `/images/wunschgutschein_partner_small.jpg`
- `/images/wunschgutschein_einlösen_large.png`
- `/images/wunschgutschein_einlösen_small.jpg`
- `/images/payback_sammeln_wunschgutschein.png`
- `/images/payback_sammeln_wunschgutschein2.png`

Bewertung: behalten. Die Small/Large-Kombinationen sind sinnvoll, weil kleine Bilder eingebunden sind und große Versionen als Klickziel dienen.

### Amex-Seiten
Aktiv genutzt auf `/meilen-sammeln/amex/` und/oder `/amex-meilen-umrechnen/`:

- `/images/amexMR_übersicht_large.png`
- `/images/amexMR_willkommensbonus_amexgreen.png`
- `/images/AMEXMR_partner_small.jpg`
- `/images/iberia_transfer_small.jpg`

Bewertung: behalten. Diese Screenshots stützen die Amex-/Membership-Rewards-Erklärungen und sind für eine spätere Kreditkarten-Landingpage ebenfalls nutzbar.

### Miles-&-More-Kreditkarten-Seite
Aktiv genutzt auf `/meilen-sammeln/miles-and-more-kreditkarte/`:

- `/images/mm_sammeln_kkumsatz.png`
- `/images/mm_sammeln_willkommensmeilenKK.png`

Bewertung: behalten. Die Screenshots erklären direkte Umsatz- und Willkommensmeilen.

### Ziel-/Ratgeberseiten
Aktiv genutzt auf Ziel- und Ratgeberseiten:

- `/images/bangkok-award-full.png`
- `/images/bangkok-award-small.jpg`
- `/images/awardkalender_ny_small.jpg`
- `/images/ny_award_small.jpg`

Bewertung: behalten. Diese Screenshots visualisieren Award-Verfügbarkeit, Beispielpreise und Zuzahlungen.

### OG-Bilder
Mehrere Seiten referenzieren aktuell:

- `/assets/og/og-home.jpg`

Bewertung: behalten. Dieses Bild ist aktuell das zentrale Social-/Open-Graph-Bild.

## Sinnvoll weiter nutzbar
Diese Bildtypen sind für künftige Seiten weiterhin wertvoll:

- echte PAYBACK-Coupon-Screenshots
- echte Umwandlungs-Screenshots PAYBACK → Miles & More
- echte Amex-Transferpartner-/Transfer-Screenshots
- Awardkalender-/Awardbeispiel-Screenshots
- Wunschgutschein-Partner-/Einlöse-Screenshots
- Miles-&-More-Kreditkarten-Screenshots

## Potenziell für neue Seiten nutzbar
Für geplante Inhalte wären diese Motive sinnvoll:

- Zeitschriftenabo-/Meilenangebot-Screenshot für die neue Abo-Rechner-Seite
- Kreditkarten-/Punkteübersicht für spätere Kreditkarten-Landingpage
- neutrale Screenshots des eigenen Prämienflug-Rechners
- eigene OG-Bilder je Themencluster: Rechner, Meilen sammeln, Kreditkarten, Reiseziele

## Potenziell löschbar
Nur löschen, wenn eine vollständige Dateiliste zeigt, dass die Datei nirgends referenziert ist:

- doppelte Large-Dateien ohne zugehöriges Small-Bild oder ohne Linkziel
- alte Test-Hero-Bilder
- nicht eingebundene generierte Varianten
- sehr große PNGs, wenn JPG/WebP in ausreichender Qualität vorhanden ist
- Screenshots ohne redaktionellen Mehrwert
- Screenshots mit personenbezogenen Daten

## Keine Löschung ohne Gegenprüfung
Vor jeder Löschung:

1. vollständige Dateiliste aus `/images`, `/assets/og` und ggf. weiteren Asset-Ordnern exportieren
2. alle HTML-/CSS-/JS-Dateien nach Bildreferenzen durchsuchen
3. Differenz bilden: Datei vorhanden, aber nirgends referenziert
4. manuell entscheiden: löschen, behalten, komprimieren oder für neue Seite vormerken

## Praktische Empfehlung
Aktuell keine der sicher bekannten Bilddateien löschen.

Nächster sinnvoller Schritt ist nicht Löschung, sondern Ergänzung:

- Screenshot oder neutrales Bild für die Zeitschriftenabo-Rechner-Seite
- später eigene Visuals für die Kreditkarten-Landingpage
- ggf. eigene OG-Bilder je großer SEO-Seite statt überall `og-home.jpg`
