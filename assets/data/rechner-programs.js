window.MILES_PLANNER_PROGRAMS = {
  dataStand: "20.05.2026",
  source: "GitHub Stammdaten-Spiegel für den Prämienflug-Rechner. Bestehende Live-Berechnung läuft vorerst weiter über Google Apps Script / Google Sheets.",
  programs: {
    "Miles & More": {
      punktelabel: "Miles & More Meilen",
      kurzlabel: "M&M",
      transferquelle: "PAYBACK",
      faktor: 1,
      transferRatioLabel: "PAYBACK Punkte → Miles & More (1:1)",
      transferMinimum: 200,
      transferDuration: "sofort bis wenige Tage",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "PAYBACK ist als indirekter Sammelweg für Miles & More hinterlegt. Transferbonus-Aktionen separat prüfen."
    },
    "Avios": {
      punktelabel: "Avios",
      kurzlabel: "Avios",
      transferquelle: "Membership Rewards",
      faktor: 0.8,
      transferRatioLabel: "Membership Rewards → Avios (5:4)",
      transferMinimum: 1000,
      transferDuration: "bis zu 1 Werktag",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "Avios steht im Rechner als Sammelbegriff für relevante Avios-Programme. Konkrete Partnerprogramme separat prüfen."
    },
    "Flying Blue": {
      punktelabel: "Flying Blue Meilen",
      kurzlabel: "Flying Blue",
      transferquelle: "Membership Rewards",
      faktor: 0.8,
      transferRatioLabel: "Membership Rewards → Flying Blue (5:4)",
      transferMinimum: 625,
      transferDuration: "bis zu 1 Werktag",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "Flying Blue ist dynamisch bepreist. Rechnerwerte sind Planungswerte, keine Live-Awardpreise."
    },
    "KrisFlyer": {
      punktelabel: "KrisFlyer Meilen",
      kurzlabel: "KrisFlyer",
      transferquelle: "Membership Rewards",
      faktor: 0.6667,
      transferRatioLabel: "Membership Rewards → KrisFlyer (3:2)",
      transferMinimum: 1500,
      transferDuration: "bis zu 15 Werktage",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "KrisFlyer-Transfers können länger dauern. Verfügbarkeit vor Transfer besonders sorgfältig prüfen."
    },
    "Emirates Skywards": {
      punktelabel: "Emirates Skywards Meilen",
      kurzlabel: "Skywards",
      transferquelle: "Membership Rewards",
      faktor: 0.5,
      transferRatioLabel: "Membership Rewards → Emirates Skywards (2:1)",
      transferMinimum: 1000,
      transferDuration: "meist wenige Werktage",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "Emirates Skywards ist weiterhin als Amex-Transferpartner gelistet, aber für deutsche Amex-Karten gilt nach Emirates-Angabe ein Verhältnis von 2:1. Zusätzlich wurden Skywards-Classic-Rewards ab 20.05.2026 teurer."
    }
  }
};
