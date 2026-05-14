(() => {
  const meta = {
    "Miles & More": ["MAM", "Miles & More Awardchart / Planungswert je Zielregion", "M&M nutzt Regionen/Awardchart; Zuschläge, Routing und Airline können stark abweichen."],
    "Avios": ["AVIOS", "Avios-Programme / Planungswert je Routing und Partner-Airline", "Avios-Werte sind routing-, Airline- und Peak-/Off-Peak-abhängig; BA/IB/QR separat prüfen."],
    "Flying Blue": ["FB", "Flying Blue dynamische Awardpreise / Planungsbereich", "Flying Blue ist dynamisch bepreist; Werte sind grobe Planungsbereiche."],
    "KrisFlyer": ["KF", "Singapore Airlines KrisFlyer Award Charts / Planungsbereich", "KrisFlyer-Werte hängen von Saver/Advantage, Routing und Verfügbarkeit ab."]
  };
  const f = {
    "Seychellen": [1, 1.12, 1.28], "Bali": [1, 1.12, 1.25], "Vietnam": [1, 1.10, 1.22],
    "Oman": [1, 1.08, 1.18], "Mexiko": [1, 1.12, 1.25], "Sri Lanka": [1, 1.10, 1.22]
  };
  // programm, ziel, klasse, bestMiles, realMiles, consMiles, bestTaxes, realTaxes, consTaxes, cashPp
  const rows = [
    ["Miles & More","Seychellen","Premium Economy",90000,110000,135000,520,700,950,1900],["Miles & More","Seychellen","Business",170000,205000,250000,850,1100,1450,4300],
    ["Miles & More","Bali","Premium Economy",95000,120000,145000,480,650,900,1750],["Miles & More","Bali","Business",180000,220000,270000,800,1050,1400,4100],
    ["Miles & More","Vietnam","Premium Economy",90000,110000,135000,430,580,780,1500],["Miles & More","Vietnam","Business",170000,205000,245000,720,920,1200,3300],
    ["Miles & More","Oman","Premium Economy",60000,75000,90000,280,380,520,950],["Miles & More","Oman","Business",105000,135000,165000,500,680,900,2400],
    ["Miles & More","Mexiko","Premium Economy",85000,105000,130000,500,700,950,1700],["Miles & More","Mexiko","Business",155000,195000,240000,800,1050,1400,3800],
    ["Miles & More","Sri Lanka","Premium Economy",85000,105000,130000,430,580,780,1450],["Miles & More","Sri Lanka","Business",160000,195000,235000,700,900,1200,3200],

    ["Avios","Seychellen","Premium Economy",120000,165000,220000,350,580,900,1900],["Avios","Seychellen","Business",220000,310000,410000,500,820,1250,4300],
    ["Avios","Bali","Premium Economy",125000,175000,240000,380,600,900,1750],["Avios","Bali","Business",230000,330000,440000,520,850,1250,4100],
    ["Avios","Vietnam","Premium Economy",115000,160000,215000,330,520,800,1500],["Avios","Vietnam","Business",210000,300000,390000,450,750,1100,3300],
    ["Avios","Oman","Premium Economy",75000,100000,135000,250,400,620,950],["Avios","Oman","Business",120000,165000,220000,350,580,850,2400],
    ["Avios","Mexiko","Premium Economy",105000,145000,195000,360,580,900,1700],["Avios","Mexiko","Business",195000,270000,360000,480,780,1150,3800],
    ["Avios","Sri Lanka","Premium Economy",105000,145000,195000,320,520,780,1450],["Avios","Sri Lanka","Business",195000,270000,350000,440,720,1050,3200],

    ["Flying Blue","Seychellen","Premium Economy",240000,360000,520000,380,600,900,1900],["Flying Blue","Seychellen","Business",500000,800000,1100000,520,850,1300,4300],
    ["Flying Blue","Bali","Premium Economy",250000,360000,520000,360,580,850,1750],["Flying Blue","Bali","Business",520000,800000,1100000,520,850,1250,4100],
    ["Flying Blue","Vietnam","Premium Economy",220000,320000,460000,330,520,780,1500],["Flying Blue","Vietnam","Business",460000,700000,980000,480,760,1150,3300],
    ["Flying Blue","Oman","Premium Economy",100000,150000,220000,260,420,620,950],["Flying Blue","Oman","Business",200000,320000,480000,380,620,950,2400],
    ["Flying Blue","Mexiko","Premium Economy",200000,300000,450000,340,550,850,1700],["Flying Blue","Mexiko","Business",420000,680000,950000,480,800,1200,3800],
    ["Flying Blue","Sri Lanka","Premium Economy",210000,310000,450000,330,520,780,1450],["Flying Blue","Sri Lanka","Business",440000,680000,950000,460,740,1100,3200],

    ["KrisFlyer","Seychellen","Premium Economy",170000,240000,330000,380,600,900,1900],["KrisFlyer","Seychellen","Business",280000,400000,540000,500,780,1150,4300],
    ["KrisFlyer","Bali","Premium Economy",155000,220000,300000,360,540,800,1750],["KrisFlyer","Bali","Business",255000,360000,490000,460,720,1050,4100],
    ["KrisFlyer","Vietnam","Premium Economy",145000,200000,270000,330,500,750,1500],["KrisFlyer","Vietnam","Business",235000,330000,440000,430,660,980,3300],
    ["KrisFlyer","Oman","Premium Economy",95000,130000,175000,280,420,620,950],["KrisFlyer","Oman","Business",155000,220000,300000,360,560,850,2400],
    ["KrisFlyer","Mexiko","Premium Economy",170000,240000,320000,380,600,900,1700],["KrisFlyer","Mexiko","Business",280000,410000,560000,500,800,1200,3800],
    ["KrisFlyer","Sri Lanka","Premium Economy",140000,195000,260000,330,500,750,1450],["KrisFlyer","Sri Lanka","Business",230000,320000,430000,420,650,950,3200]
  ];
  if (!window.MILES_PLANNER_AWARD_RATES) window.MILES_PLANNER_AWARD_RATES = { dataStand: "14.05.2026", source: "GitHub Planungswerte", currency: "EUR", rates: [] };
  window.MILES_PLANNER_AWARD_RATES.dataStand = "14.05.2026";
  window.MILES_PLANNER_AWARD_RATES.rates.push(...rows.map(([programm,ziel,klasse,bm,rm,cm,bt,rt,ct,cash]) => {
    const [code, quelle, hinweis] = meta[programm];
    const [fn, fh, ff] = f[ziel];
    return { ziel, programm, code, klasse, bestMilesRtPp: bm, realMilesRtPp: rm, consMilesRtPp: cm, bestTaxesRtPp: bt, realTaxesRtPp: rt, consTaxesRtPp: ct, faktorNebensaison: fn, faktorHauptsaison: fh, faktorFerien: ff, cashPp: cash, quelle, hinweis };
  }));
  window.MILES_PLANNER_AWARD_RATES.source = `${window.MILES_PLANNER_AWARD_RATES.source || "GitHub Planungswerte"} Familien-Zusatzziele Seychellen, Bali, Vietnam, Oman, Mexiko und Sri Lanka ergänzt.`;
})();
