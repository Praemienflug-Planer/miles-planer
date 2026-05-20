(() => {
  if (!window.MILES_PLANNER_AWARD_RATES) return;

  const rates = window.MILES_PLANNER_AWARD_RATES.rates || [];

  const factors = {
    "Dubai": [1.00, 1.05, 1.12],
    "Japan": [1.00, 1.12, 1.25],
    "Malediven": [1.00, 1.12, 1.28],
    "Südafrika": [1.00, 1.10, 1.20],
    "Thailand": [1.00, 1.12, 1.25],
    "USA East": [1.00, 1.08, 1.18],
    "USA West": [1.00, 1.08, 1.20],
    "Singapur": [1.00, 1.12, 1.25],
    "Karibik": [1.00, 1.12, 1.25],
    "Kanada": [1.00, 1.08, 1.18],
    "Australien": [1.00, 1.15, 1.32],
    "Mauritius": [1.00, 1.12, 1.28],
    "Seychellen": [1.00, 1.12, 1.28],
    "Bali": [1.00, 1.12, 1.25],
    "Vietnam": [1.00, 1.10, 1.22],
    "Oman": [1.00, 1.08, 1.18],
    "Mexiko": [1.00, 1.12, 1.25],
    "Sri Lanka": [1.00, 1.10, 1.22]
  };

  // Format: [ziel, klasse, bestMilesRtPp, realMilesRtPp, consMilesRtPp, bestTaxesRtPp, realTaxesRtPp, consTaxesRtPp, cashPp]
  // Werte gelten pro Person für Hin- und Rückflug als Planungswerte.
  // Dubai Business wurde nach der Skywards-Anpassung ab 20.05.2026 konkret von ca. 87.000 auf 100.000 Meilen angehoben.
  const emiratesRows = [
    ["Dubai", "Premium Economy", 75000, 90000, 105000, 250, 350, 500, 900],
    ["Dubai", "Business", 100000, 115000, 130000, 450, 600, 800, 2200],

    ["Japan", "Premium Economy", 170000, 220000, 290000, 380, 550, 800, 1700],
    ["Japan", "Business", 300000, 420000, 560000, 600, 850, 1200, 3800],

    ["Malediven", "Premium Economy", 150000, 200000, 270000, 380, 550, 850, 1700],
    ["Malediven", "Business", 260000, 360000, 500000, 650, 900, 1300, 3900],

    ["Südafrika", "Premium Economy", 150000, 200000, 270000, 380, 550, 800, 1500],
    ["Südafrika", "Business", 260000, 360000, 500000, 650, 900, 1250, 3300],

    ["Thailand", "Premium Economy", 160000, 220000, 300000, 380, 550, 850, 1600],
    ["Thailand", "Business", 280000, 400000, 560000, 650, 950, 1350, 3500],

    ["USA East", "Premium Economy", 160000, 220000, 300000, 350, 550, 800, 1300],
    ["USA East", "Business", 280000, 400000, 560000, 600, 900, 1250, 2800],

    ["USA West", "Premium Economy", 180000, 240000, 330000, 380, 580, 850, 1500],
    ["USA West", "Business", 320000, 460000, 620000, 650, 950, 1350, 3300],

    ["Singapur", "Premium Economy", 180000, 240000, 330000, 380, 580, 850, 1700],
    ["Singapur", "Business", 320000, 460000, 640000, 650, 950, 1350, 3900],

    ["Karibik", "Premium Economy", 180000, 240000, 330000, 380, 600, 900, 1700],
    ["Karibik", "Business", 320000, 460000, 640000, 650, 980, 1400, 3900],

    ["Kanada", "Premium Economy", 150000, 200000, 270000, 350, 520, 780, 1400],
    ["Kanada", "Business", 260000, 360000, 500000, 600, 850, 1200, 3000],

    ["Australien", "Premium Economy", 240000, 330000, 450000, 450, 700, 1000, 2200],
    ["Australien", "Business", 440000, 650000, 850000, 750, 1100, 1600, 5000],

    ["Mauritius", "Premium Economy", 150000, 200000, 270000, 380, 580, 850, 1800],
    ["Mauritius", "Business", 260000, 360000, 500000, 650, 950, 1350, 4200],

    ["Seychellen", "Premium Economy", 150000, 200000, 270000, 380, 580, 850, 1900],
    ["Seychellen", "Business", 260000, 360000, 500000, 650, 950, 1350, 4300],

    ["Bali", "Premium Economy", 180000, 240000, 330000, 380, 580, 850, 1750],
    ["Bali", "Business", 320000, 460000, 640000, 650, 950, 1350, 4100],

    ["Vietnam", "Premium Economy", 170000, 230000, 310000, 360, 550, 820, 1500],
    ["Vietnam", "Business", 300000, 430000, 600000, 620, 900, 1300, 3300],

    ["Oman", "Premium Economy", 85000, 105000, 130000, 260, 380, 550, 950],
    ["Oman", "Business", 120000, 150000, 190000, 480, 650, 900, 2400],

    ["Mexiko", "Premium Economy", 190000, 260000, 350000, 400, 620, 900, 1700],
    ["Mexiko", "Business", 340000, 500000, 680000, 700, 1000, 1450, 3800],

    ["Sri Lanka", "Premium Economy", 150000, 200000, 270000, 360, 550, 820, 1450],
    ["Sri Lanka", "Business", 260000, 360000, 500000, 620, 900, 1300, 3200]
  ];

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  emiratesRows.forEach(([ziel, klasse, bm, rm, cm, bt, rt, ct, cash]) => {
    const existingIndex = rates.findIndex((item) =>
      normalize(item.ziel) === normalize(ziel) &&
      normalize(item.programm) === "emirates skywards" &&
      normalize(item.klasse) === normalize(klasse)
    );

    const [fn, fh, ff] = factors[ziel] || [1, 1.10, 1.25];
    const row = {
      ziel,
      programm: "Emirates Skywards",
      code: "EK",
      klasse,
      bestMilesRtPp: bm,
      realMilesRtPp: rm,
      consMilesRtPp: cm,
      bestTaxesRtPp: bt,
      realTaxesRtPp: rt,
      consTaxesRtPp: ct,
      faktorNebensaison: fn,
      faktorHauptsaison: fh,
      faktorFerien: ff,
      cashPp: cash,
      quelle: "Emirates Skywards Classic Rewards / Planungswerte nach Anpassung ab 20.05.2026",
      hinweis: "Emirates Skywards wurde ab 20.05.2026 teurer. Zusätzlich ist der Amex-Transfer für deutsche Karten mit 2:1 schwächer als bei Flying Blue oder Avios. Werte sind Planungswerte; maßgeblich ist immer die Emirates-Buchungsmaske."
    };

    if (existingIndex >= 0) {
      rates[existingIndex] = { ...rates[existingIndex], ...row };
    } else {
      rates.push(row);
    }
  });

  window.MILES_PLANNER_AWARD_RATES.dataStand = "20.05.2026";
  window.MILES_PLANNER_AWARD_RATES.source = `${window.MILES_PLANNER_AWARD_RATES.source || "GitHub Planungswerte"} Emirates Skywards ergänzt; Dubai Business nach neuer Preislogik mit 100.000 Meilen Return p.P. als Basiswert hinterlegt.`;
})();
