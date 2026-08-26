# Rechner-Daten-Audit – 26.08.2026

## Ziel

Der Prämienflug-Rechner soll bewusst als Planungswerkzeug arbeiten und keine Live-Verfügbarkeit oder garantierten Awardpreise vortäuschen. Dieses Audit trennt deshalb drei Ebenen klar voneinander:

1. Programm- und Transferregeln, die sich offiziell prüfen lassen.
2. Familienregeln, die nur unter bestimmten Buchungsbedingungen gelten.
3. Award- und Cashwerte, die im Rechner weiterhin als Planungsbereiche hinterlegt sind.

## Geprüfte Programm- und Transferregeln

### PAYBACK → Miles & More

Quelle: PAYBACK, https://www.payback.de/partner/miles-and-more

- 1 PAYBACK Punkt = 1 Miles & More Meile.
- Mindesttransfer: 200 PAYBACK Punkte.
- Maximal 999.999 Punkte je Transaktion.
- Laut PAYBACK FAQ kann die Gutschrift bis zu 5 Werktage dauern.
- Ein Rücktransfer ist nicht möglich.

### Membership Rewards → British Airways / Iberia Avios

Quelle: American Express Deutschland, https://www.americanexpress.com/de-de/rewards/membership-rewards/travel/all

- British Airways Club: 5 MR = 4 Avios, Mindesttransfer 1.000 MR, bis zu 1 Werktag.
- Iberia Club: 5 MR = 4 Avios, Mindesttransfer 1.000 MR, bis zu 1 Werktag.
- Direkter Qatar-Transfer ist abweichend: 3 MR = 2 Avios, Mindesttransfer 900 MR, ca. 7 Werktage.
- Der Rechner verwendet für die Sammelrechnung beim generischen Eintrag „Avios“ den 5:4-Weg über British Airways/Iberia. Das wird im Transferhinweis ausdrücklich genannt.

### Membership Rewards → Flying Blue

Quelle: American Express Deutschland, https://www.americanexpress.com/de-de/rewards/membership-rewards/travel/all

- 5 MR = 4 Flying Blue Meilen.
- Mindesttransfer: 625 MR.
- Transferdauer: bis zu 1 Werktag.

### Membership Rewards → KrisFlyer

Quelle: American Express Deutschland, https://www.americanexpress.com/de-de/rewards/membership-rewards/travel/all

- 3 MR = 2 KrisFlyer Meilen.
- Mindesttransfer: 1.500 MR.
- Transferdauer: bis zu 15 Werktage.

### Membership Rewards → Emirates Skywards

Quelle: American Express Deutschland, https://www.americanexpress.com/de-de/rewards/membership-rewards/travel/all

- 2 MR = 1 Skywards Meile.
- Mindesttransfer: 1.000 MR.
- Transferdauer: bis zu 1 Werktag.

## Familienlogik

### Flying Blue

Quelle: Flying Blue Family & youth benefits, https://www.flyingblue.com/en/landing-page/informative/family-youngs

Flying Blue nennt 25 % Rabatt auf Reward Tickets für Kinder von 2 bis 11 Jahren, die mit einem Erwachsenen reisen. Für den Rabatt soll über die Website von Air France oder KLM gebucht werden.

Der Rechner berücksichtigt diesen 25-%-Abschlag weiterhin automatisch als Planungswert und weist auf die Bedingung hin.

### Miles & More

Quelle: Miles & More – Terms and conditions for Award Flights, https://www.miles-and-more.com/row/en/general-information/terms-and-conditions/flight-awards.html

Der Child’s Award Flight mit 25 % Meilenreduzierung für Kinder von 2 bis 11 Jahren gilt nicht pauschal für jeden Miles-&-More-Award, sondern nur bei bestimmten ausführenden Airlines. Miles & More nennt dafür Austrian Airlines, Air Dolomiti, Brussels Airlines, Croatia Airlines, Eurowings, Discover Airlines, LOT Polish Airlines, Lufthansa, Lufthansa City Airlines, Luxair und SWISS.

Da der Rechner aktuell keine ausführende Airline abfragt, darf er den 25-%-Rabatt nicht pauschal auf alle Miles-&-More-Buchungen anwenden. Seit diesem Audit rechnet der Rechner bei Miles & More konservativ mit dem vollen Meilenbedarf und weist auf die mögliche Ermäßigung bei berechtigten Child’s Award Flights hin.

## Miles-&-More-Preismodell

Quelle: Miles & More Award Flight Bedingungen und Award Flight Suche.

Für Award Flights mit Austrian Airlines, Air Dolomiti, Discover Airlines, Lufthansa, Lufthansa City Airlines und SWISS kann der benötigte Meilenwert variabel auf Basis des aktuellen Online-Angebots berechnet werden. Für andere Partnerbuchungen gelten weiterhin feste Werte aus der Award Flight Tabelle, soweit die jeweiligen Bedingungen nichts anderes vorsehen.

Daraus folgt für den Rechner:

- Miles-&-More-Werte im Rechner sind Planungsbereiche und keine festen Chartpreise.
- Der konkrete Onlinepreis kann deutlich abweichen.
- Vor Transfer oder Buchung muss immer die reale Miles-&-More-Suche geprüft werden.

## Award- und Cashwerte

Die hinterlegten Award-, Gebühren- und Cashwerte wurden in diesem Audit nicht pauschal auf den 26.08.2026 umdatiert. Sie bleiben bewusst mit ihrem tatsächlichen Datenstand aus Mai 2026 versehen. Eine neue Datumsangabe wäre nur dann zulässig, wenn die jeweilige Matrix auch inhaltlich neu geprüft wurde.

Der Rechner zeigt deshalb künftig den Datenstand der Planungswerte sichtbar im Ergebnis und trennt ihn vom aktuelleren Prüfdatum der Programm- und Transferregeln.

## Live-Berechnungsweg

Der Rechner nutzt für Kombinationen, zu denen ein GitHub-Awardwert vorhanden ist, die versionierten GitHub-Planungsdaten. Nur wenn keine passende Kombination gefunden wird oder die GitHub-Berechnung fehlschlägt, wird auf die ältere Google-Sheets-/Apps-Script-Berechnung zurückgefallen.

Damit ist GitHub inzwischen die primäre Datenquelle für die meisten im Rechner angebotenen Kombinationen und Google Sheets nur noch Fallback.
