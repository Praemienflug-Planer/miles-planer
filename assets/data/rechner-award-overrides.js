(() => {
  const rates = window.MILES_PLANNER_AWARD_RATES?.rates || [];

  const overrides = [
    {
      ziel: "USA East",
      programm: "Miles & More",
      klasse: "Premium Economy",
      bestTaxesRtPp: 700,
      realTaxesRtPp: 850,
      consTaxesRtPp: 1000,
      hinweisAddendum: "Zuzahlungen für Miles & More Richtung USA bewusst erhöht, da Lufthansa-Group-Awards hohe Steuern, Gebühren und Airline-/Partnerzuschläge enthalten können."
    },
    {
      ziel: "USA East",
      programm: "Miles & More",
      klasse: "Business",
      bestTaxesRtPp: 900,
      realTaxesRtPp: 1100,
      consTaxesRtPp: 1300,
      hinweisAddendum: "Zuzahlungen für Miles & More Business Richtung USA bewusst erhöht, da Lufthansa-Group-Awards hohe Steuern, Gebühren und Airline-/Partnerzuschläge enthalten können."
    },
    {
      ziel: "USA West",
      programm: "Miles & More",
      klasse: "Premium Economy",
      bestTaxesRtPp: 750,
      realTaxesRtPp: 900,
      consTaxesRtPp: 1050,
      hinweisAddendum: "Zuzahlungen für Miles & More Richtung USA West bewusst erhöht, da Lufthansa-Group-Awards hohe Steuern, Gebühren und Airline-/Partnerzuschläge enthalten können."
    },
    {
      ziel: "USA West",
      programm: "Miles & More",
      klasse: "Business",
      bestTaxesRtPp: 950,
      realTaxesRtPp: 1150,
      consTaxesRtPp: 1350,
      hinweisAddendum: "Zuzahlungen für Miles & More Business Richtung USA West bewusst erhöht, da Lufthansa-Group-Awards hohe Steuern, Gebühren und Airline-/Partnerzuschläge enthalten können."
    }
  ];

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  overrides.forEach((override) => {
    const rate = rates.find((item) =>
      normalize(item.ziel) === normalize(override.ziel) &&
      normalize(item.programm) === normalize(override.programm) &&
      normalize(item.klasse) === normalize(override.klasse)
    );

    if (!rate) return;

    rate.bestTaxesRtPp = override.bestTaxesRtPp;
    rate.realTaxesRtPp = override.realTaxesRtPp;
    rate.consTaxesRtPp = override.consTaxesRtPp;
    rate.hinweis = `${rate.hinweis || ""} ${override.hinweisAddendum}`.trim();
  });

  if (window.MILES_PLANNER_AWARD_RATES) {
    window.MILES_PLANNER_AWARD_RATES.dataStand = "10.05.2026";
    window.MILES_PLANNER_AWARD_RATES.source = `${window.MILES_PLANNER_AWARD_RATES.source || "GitHub Planungswerte"} Miles-&-More-USA-Zuzahlungen per Override erhöht.`;
  }
})();
