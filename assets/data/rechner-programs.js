window.MILES_PLANNER_PROGRAMS = {
  dataStand: "26.08.2026",
  source: "Programm- und Transferregeln für den Prämienflug-Rechner. Verifiziert am 26.08.2026 anhand offizieller Angaben von PAYBACK, American Express, Flying Blue und Miles & More.",
  programs: {
    "Miles & More": {
      punktelabel: "Miles & More Meilen",
      kurzlabel: "M&M",
      transferquelle: "PAYBACK",
      faktor: 1,
      transferRatioLabel: "PAYBACK Punkte → Miles & More (1:1)",
      transferMinimum: 200,
      transferDuration: "bis zu 5 Werktage",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "PAYBACK kann ab 200 Punkten im Verhältnis 1:1 zu Miles & More übertragen werden. Maximal 999.999 Punkte je Transaktion; ein Rücktransfer ist nicht möglich. Transferbonus-Aktionen separat prüfen."
    },
    "Avios": {
      punktelabel: "Avios",
      kurzlabel: "Avios",
      transferquelle: "Membership Rewards",
      faktor: 0.8,
      transferRatioLabel: "Membership Rewards → Avios über British Airways/Iberia (5:4)",
      transferMinimum: 1000,
      transferDuration: "bis zu 1 Werktag",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "Der Rechner nutzt für den generischen Avios-Eintrag den 5:4-Transferweg über British Airways oder Iberia. Ein direkter Transfer zu Qatar Privilege Club ist bei deutscher Amex mit 3:2 schwächer und dauert laut Amex ca. 7 Werktage."
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
      hinweis: "KrisFlyer-Transfers können bis zu 15 Werktage dauern. Verfügbarkeit vor Transfer besonders sorgfältig prüfen."
    },
    "Emirates Skywards": {
      punktelabel: "Emirates Skywards Meilen",
      kurzlabel: "Skywards",
      transferquelle: "Membership Rewards",
      faktor: 0.5,
      transferRatioLabel: "Membership Rewards → Emirates Skywards (2:1)",
      transferMinimum: 1000,
      transferDuration: "bis zu 1 Werktag",
      transferBonusPct: { konservativ: 0, realistisch: 0, best: 0 },
      hinweis: "Für deutsche Amex-Karten gilt aktuell 2:1 zu Emirates Skywards. Awardpreise können sich dynamisch ändern; maßgeblich ist immer die konkrete Emirates-Buchungsmaske."
    }
  }
};
