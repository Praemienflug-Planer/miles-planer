(() => {
  const rates = window.MILES_PLANNER_AWARD_RATES?.rates || [];
  const calibrationDate = "26.08.2026";

  // Selektive Kalibrierung: nur Kombinationen mit belastbarer Praxis- oder Chart-Basis.
  // Die Werte gelten pro Person für Hin- und Rückflug als Planungsbereich.
  // Bei aus One-Way-Suchen abgeleiteten Werten ist die Verdopplung ausdrücklich nur ein RT-Planungsäquivalent.
  const calibrations = [
    {
      ziel: "Thailand",
      programm: "Miles & More",
      klasse: "Premium Economy",
      bestMilesRtPp: 74738,
      realMilesRtPp: 110000,
      consMilesRtPp: 150000,
      bestTaxesRtPp: 687,
      realTaxesRtPp: 900,
      consTaxesRtPp: 1250,
      cashPp: 1875,
      seasonFactorMode: "included",
      calibrationDate,
      calibrationBasis: "Dokumentierte DUS–MUC–BKK-Suche vom 17.01.2027: 37.369 Meilen + 343,61 € One-Way in Premium Economy; als RT-Planungsäquivalent verdoppelt.",
      calibrationNote: "Der Best-Case basiert auf einer dokumentierten One-Way-Suche und ist kein garantierter Return-Preis. Saisonaufschläge werden für diese kalibrierte Zeile nicht zusätzlich multipliziert, damit Nachfrageeffekte nicht doppelt eingerechnet werden."
    },
    {
      ziel: "Thailand",
      programm: "Miles & More",
      klasse: "Business",
      bestMilesRtPp: 136198,
      realMilesRtPp: 200000,
      consMilesRtPp: 240000,
      bestTaxesRtPp: 962,
      realTaxesRtPp: 1250,
      consTaxesRtPp: 1700,
      cashPp: 3220,
      seasonFactorMode: "included",
      calibrationDate,
      calibrationBasis: "Dokumentierte DUS–ZRH–BKK-Suche vom 03.05.2027: 68.099 Meilen + 480,80 € One-Way in Business; zusätzlich offizieller Miles-&-More-Partnerchart-Anker Europa–Südostasien: 200.000 Meilen Return Business.",
      calibrationNote: "Der Best-Case ist ein verdoppeltes One-Way-Praxisbeispiel; 200.000 Meilen dienen als stabiler Partnerchart-Anker. Lufthansa-Group-Awards können dynamisch darunter oder darüber liegen."
    },
    {
      ziel: "USA East",
      programm: "Miles & More",
      klasse: "Business",
      bestMilesRtPp: 125000,
      realMilesRtPp: 125422,
      consMilesRtPp: 180000,
      bestTaxesRtPp: 1500,
      realTaxesRtPp: 2062,
      consTaxesRtPp: 2600,
      cashPp: 3870,
      seasonFactorMode: "included",
      calibrationDate,
      calibrationBasis: "Dokumentierte Familien-Suche DUS–JFK Return: 501.688 Meilen + 8.247,72 € für 4 Personen = 125.422 Meilen + 2.061,93 € p.P.; offizieller Partnerchart Europa–Nordamerika: 125.000 Meilen Return Business.",
      calibrationNote: "Praxiswert und offizieller Partnerchart liegen beim Meilenbedarf nahezu gleichauf. Die sehr hohe dokumentierte Zuzahlung wird deshalb jetzt im realistischen Szenario berücksichtigt."
    },
    {
      ziel: "Singapur",
      programm: "Miles & More",
      klasse: "Business",
      bestMilesRtPp: 200000,
      realMilesRtPp: 200000,
      consMilesRtPp: 240000,
      bestTaxesRtPp: 750,
      realTaxesRtPp: 950,
      consTaxesRtPp: 1250,
      cashPp: 3800,
      seasonFactorMode: "included",
      calibrationDate,
      calibrationBasis: "Offizieller Miles-&-More-Award-Flight-Chart, Stand 03.03.2026: Europa–Südostasien 200.000 Meilen Return in Business bei Partner-Airlines; Singapur gehört zur Region Südostasien.",
      calibrationNote: "Der Meilenanker ist offiziell; Zuzahlungs- und Cashwerte wurden für Singapur in diesem Schritt nicht mit einer neuen Live-Suche erhoben und bleiben deshalb Planungswerte."
    }
  ];

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  calibrations.forEach((calibration) => {
    const rate = rates.find((item) =>
      normalize(item.ziel) === normalize(calibration.ziel) &&
      normalize(item.programm) === normalize(calibration.programm) &&
      normalize(item.klasse) === normalize(calibration.klasse)
    );

    if (!rate) return;

    Object.assign(rate, calibration);
    rate.quelle = `${rate.quelle || "Miles & More Planungswert"} | Selektiv kalibriert am ${calibrationDate}.`;
    rate.hinweis = `${rate.hinweis || ""} ${calibration.calibrationNote}`.trim();
  });

  if (window.MILES_PLANNER_AWARD_RATES) {
    window.MILES_PLANNER_AWARD_RATES.source = `${window.MILES_PLANNER_AWARD_RATES.source || "GitHub Planungswerte"} Selektive Miles-&-More-Kalibrierung für Thailand, USA East und Singapur vom ${calibrationDate}; globaler Datenstand bleibt unverändert, weil nicht die gesamte Matrix neu erhoben wurde.`;
  }
})();
