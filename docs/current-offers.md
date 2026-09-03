# Aktuelle Bonus- und Angebotsdaten

Die Datei `_data/offers.yml` ist die zentrale Quelle für volatile Kreditkarten- und Bonusdaten der Website. Zeitlich begrenzte redaktionelle Deals der Seite `/angebote/` werden getrennt in `_data/deals.yml` gepflegt.

## Was dort gepflegt wird

Aktuell enthält die Datei unter anderem:

- American Express Membership-Rewards-Boni und Monatsgebühren
- PAYBACK American Express Empfehlungsbonus
- Mindestumsatz, Angebotsart, offizieller Vergleichslink und Link-Anfragepfad
- Miles & More Credit Card Gold/Blue/MyFlex: Gebühren, Willkommenspakete und Aktionsfristen
- MoneySend-Sammelrate und monatliches Meilenmaximum
- Eurowings Kreditkarte Classic/Premium: Willkommensmeilen und Gebühren
- grundlegender PAYBACK → Miles & More Transferstand

## So wird aktualisiert

1. Anbieterbedingungen bzw. das aktuelle Empfehlungsangebot prüfen.
2. Nur die Werte in `_data/offers.yml` ändern.
3. Das `last_checked` und `last_checked_display` der betroffenen Produktfamilie aktualisieren. Die globalen Felder oben in der Datei dienen nur als Gesamt-Datenstand.
4. Prüfen, ob sich außer Zahlen auch Bedingungen oder redaktionelle Einordnungen geändert haben. Solche Textänderungen gehören weiterhin in die jeweilige Inhaltsseite.
5. Website nach dem Deploy auf den zentralen Kreditkartenseiten kurz visuell prüfen.

## Aktuelle Angebotsseite

Jeder Eintrag in `_data/deals.yml` enthält Frist, Bild, Eckdaten, Bedingungen, Einordnung sowie den offiziellen Anbieterlink. Die Seite `/angebote/` rendert daraus automatisch die Angebotskarten.

- Neue Screenshots erhalten sprechende Dateinamen unter `/images/` und dürfen keine persönlichen Daten zeigen.
- `last_checked` und `last_checked_display` werden bei jeder redaktionellen Prüfung aktualisiert.
- Das Enddatum wird als ISO-Datum in `expires` und zusätzlich lesbar in `expires_display` gepflegt.
- `/assets/js/deals-status.js` graut abgelaufene Karten automatisch aus, ersetzt den Status durch „Abgelaufen am …“ und deaktiviert den Anbieterbutton.
- Abgelaufene Angebote bleiben bewusst als sichtbares Archiv erhalten. Sie werden nur entfernt, wenn sie inhaltlich oder rechtlich keinen dokumentarischen Wert mehr haben.
- Persönliche Referral- oder Affiliate-Links werden nicht ungekennzeichnet als Angebotslink hinterlegt.

## Linktypen sauber trennen

- `official_url` verweist immer auf die öffentliche Produkt- oder Anbieterseite.
- `referral_terms_url` verweist auf die öffentliche Erklärung des Anbieters zur Freundschaftswerbung.
- `request_path` führt zur internen, einmaligen Link-Anfrage. Dort wird kein Kartenantrag ausgelöst.
- `offer_type: referral` bedeutet, dass der genannte Punktebonus aus einem aktuell geprüften Empfehlungsweg stammt. Entscheidend bleiben die Bedingungen im tatsächlich geöffneten Link.
- Persönliche Referral- oder Affiliate-Tracking-URLs gehören nicht in `_data/offers.yml`. Sie werden erst nach konkreter Anfrage versendet beziehungsweise bei einem späteren öffentlichen Affiliate-Einsatz ausdrücklich als vergütet gekennzeichnet.

Für Miles & More werden keine kommerziellen Freundschaftswerbungslinks vermittelt. Die Website verlinkt dort ausschließlich auf öffentliche Anbieterangebote und Bedingungen.

## Technische Einbindung

Die Layouts `_layouts/default.html` und `_layouts/page.html` schicken den Seiteninhalt durch `_includes/apply-current-offers.html`. Dadurch werden bekannte, wiederkehrende Angebotswerte beim Rendern mit den Daten aus `_data/offers.yml` ersetzt.

Neue oder überarbeitete Includes können die Werte auch direkt mit Liquid verwenden, zum Beispiel:

```liquid
{{ site.data.offers.amex.payback.bonus_display }}
{{ site.data.offers.miles_and_more_credit_card.gold.offer_display }}
{{ site.data.offers.eurowings_credit_card.premium.valid_until_display }}
```

Direkte Liquid-Verwendung ist für neue Inhalte vorzuziehen. Die Render-Ersetzungen dienen vor allem dazu, bereits vorhandene ältere Seiten ohne große Quelltext-Umbauten zentral pflegbar zu machen.

## Wichtig

Die zentrale Datei ersetzt keine fachliche Prüfung. Wenn sich z. B. Mindestumsatz, Neukundenbedingung, Haltefrist, Versicherungsumfang oder Sammellogik ändert, muss die jeweilige Seite redaktionell angepasst werden. Zahlen und Fristen allein reichen dann nicht aus.
