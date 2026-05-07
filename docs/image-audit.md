# Image Audit

## Hinweis zur Prüfung
Der GitHub-Connector konnte im Audit keine vollständige Verzeichnisliste von `/images` liefern. Die folgende Übersicht basiert deshalb auf den Bildreferenzen, die in den geprüften HTML-Dateien sicher erkannt wurden.

## Sicher genutzt
Diese Bilder sind aktuell in Seiten eingebunden oder als Klick-Ziel für größere Ansichten genutzt:

### PAYBACK-Seite
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

### Wunschgutschein-Seite
- `/images/wunschgutschein_partner_large.png`
- `/images/wunschgutschein_partner_small.jpg`
- `/images/wunschgutschein_einlösen_large.png`
- `/images/wunschgutschein_einlösen_small.jpg`
- `/images/payback_sammeln_wunschgutschein.png`
- `/images/payback_sammeln_wunschgutschein2.png`

### Amex-Seiten
- `/images/amexMR_übersicht_large.png`
- `/images/amexMR_willkommensbonus_amexgreen.png`
- `/images/AMEXMR_partner_small.jpg`
- `/images/iberia_transfer_small.jpg`

### Miles-&-More-Kreditkarten-Seite
- `/images/mm_sammeln_kkumsatz.png`
- `/images/mm_sammeln_willkommensmeilenKK.png`

### Ziel-/Ratgeberseiten
- `/images/bangkok-award-full.png`
- `/images/bangkok-award-small.jpg`
- `/images/awardkalender_ny_small.jpg`
- `/images/ny_award_small.jpg`

## Sinnvoll weiter nutzbar
Diese Bildtypen sind wertvoll, weil sie Vertrauen schaffen und eigene Screenshots zeigen:

- echte PAYBACK-Coupon-Screenshots
- echte Umwandlungs-Screenshots PAYBACK → Miles & More
- echte Amex-Transferpartner-/Transfer-Screenshots
- Awardkalender-/Awardbeispiel-Screenshots
- Wunschgutschein-Partner-/Einlöse-Screenshots

## Potenziell für neue Seiten nutzbar
Falls vorhanden, wären diese Motive sinnvoll wiederverwendbar oder neu zu erstellen:

- Zeitschriftenabo-/Meilenangebot-Screenshot für die neue Abo-Rechner-Seite
- Kreditkarten-/Punkteübersicht für spätere Kreditkarten-Landingpage
- neutrale Tool-Screenshots des eigenen Rechners
- Hero-/OG-Bilder je Themencluster: Rechner, Meilen sammeln, Kreditkarten, Reiseziele

## Potenziell löschbar
Nur löschen, wenn sie nach vollständiger Verzeichnisliste wirklich nicht referenziert sind:

- doppelte Large-Dateien ohne zugehöriges Small-Bild oder ohne Linkziel
- alte Test-Hero-Bilder
- nicht eingebundene generierte Varianten
- sehr große PNGs, wenn JPG/WebP in ausreichender Qualität vorhanden ist
- Screenshots ohne redaktionellen Mehrwert

## Nächste technische Prüfung
Für einen vollständigen Bild-Cleanup sollte lokal oder über GitHub-Weboberfläche eine Verzeichnisliste von `/images` und `/assets/og` exportiert werden. Danach kann man automatisiert prüfen:

1. alle Bilddateien im Repo listen
2. alle HTML/CSS/JS-Referenzen extrahieren
3. Differenz bilden: Datei vorhanden, aber nirgends referenziert
4. manuell entscheiden: löschen, behalten oder komprimieren

Keine Bilddatei sollte ohne diese Gegenprüfung gelöscht werden.
