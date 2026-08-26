# Aktuelle Bonus- und Angebotsdaten

Die Datei `_data/offers.yml` ist die zentrale Quelle für volatile Kreditkarten- und Bonusdaten der Website.

## Was dort gepflegt wird

Aktuell enthält die Datei unter anderem:

- American Express Membership-Rewards-Boni und Monatsgebühren
- PAYBACK American Express Empfehlungsbonus
- Miles & More Credit Card Gold/Blue/MyFlex: Gebühren, Willkommenspakete und Aktionsfristen
- MoneySend-Sammelrate und monatliches Meilenmaximum
- Eurowings Kreditkarte Classic/Premium: Willkommensmeilen und Gebühren
- grundlegender PAYBACK → Miles & More Transferstand

## So wird aktualisiert

1. Anbieterbedingungen bzw. das aktuelle Empfehlungsangebot prüfen.
2. Nur die Werte in `_data/offers.yml` ändern.
3. `last_checked` und `last_checked_display` aktualisieren.
4. Prüfen, ob sich außer Zahlen auch Bedingungen oder redaktionelle Einordnungen geändert haben. Solche Textänderungen gehören weiterhin in die jeweilige Inhaltsseite.
5. Website nach dem Deploy auf den zentralen Kreditkartenseiten kurz visuell prüfen.

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
