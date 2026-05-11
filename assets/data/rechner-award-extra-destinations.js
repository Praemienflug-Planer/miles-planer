(() => {
  const extraFactors = {
    "Singapur": [1.00, 1.12, 1.25],
    "Karibik": [1.00, 1.12, 1.28],
    "Kanada": [1.00, 1.08, 1.18],
    "Australien": [1.00, 1.15, 1.30],
    "Mauritius": [1.00, 1.12, 1.25]
  };

  const programMeta = {
    "Miles & More": {
      code: "MAM",
      quelle: "Miles & More Awardchart / Planungswert je Zielregion",
      hinweis: "M&M nutzt Regionen/Awardchart; Zuschläge, Routing und Airline können stark abweichen."
    },
    "Avios": {
      code: "AVIOS",
      quelle: "Avios-Programme / Planungswert je Routing und Partner-Airline",
      hinweis: "Avios-Werte sind routing-, Airline- und Peak-/Off-Peak-abhängig; BA/IB/QR separat prüfen."
    },
    "Flying Blue": {
      code: "FB",
      quelle: "Flying Blue dynamische Awardpreise / Planungsbereich",
      hinweis: "Flying Blue ist dynamisch bepreist; Werte sind grobe Planungsbereiche."
    },
    "KrisFlyer": {
      code: "KF",
      quelle: "Singapore Airlines KrisFlyer Award Charts / Planungsbereich",
      hinweis: "KrisFlyer-Werte hängen von Saver/Advantage, Routing und Verfügbarkeit ab."
    }
  };

  // [bestMiles, realMiles, consMiles, bestTaxes, realTaxes, consTaxes, cashPp]
  const extraMatrix = {
    "Miles & More": {
      "Singapur": {
        "Premium Economy": [90000, 110000, 130000, 450, 600, 800, 1700],
        "Business": [170000, 200000, 240000, 750, 950, 1250, 3800]
      },
      "Karibik": {
        "Premium Economy": [80000, 100000, 120000, 500, 700, 950, 1600],
        "Business": [150000, 185000, 220000, 800, 1050, 1350, 3600]
      },
      "Kanada": {
        "Premium Economy": [70000, 90000, 110000, 700, 850, 1000, 1300],
        "Business": [112000, 150000, 180000, 900, 1100, 1300, 2800]
      },
      "Australien": {
        "Premium Economy": [140000, 180000, 230000, 650, 850, 1100, 2300],
        "Business": [280000, 360000, 460000, 950, 1250, 1600, 5200]
      },
      "Mauritius": {
        "Premium Economy": [90000, 110000, 130000, 500, 650, 850, 1700],
        "Business": [170000, 200000, 240000, 800, 1000, 1300, 3900]
      }
    },

    "Avios": {
      "Singapur": {
        "Premium Economy": [120000, 170000, 230000, 350, 550, 850, 1700],
        "Business": [220000, 320000, 420000, 480, 800, 1200, 3800]
      },
      "Karibik": {
        "Premium Economy": [95000, 130000, 175000, 350, 550, 850, 1600],
        "Business": [180000, 250000, 330000, 450, 750, 1100, 3600]
      },
      "Kanada": {
        "Premium Economy": [93500, 120000, 150000, 350, 430, 650, 1300],
        "Business": [176000, 210000, 260000, 399, 550, 800, 2800]
      },
      "Australien": {
        "Premium Economy": [180000, 260000, 350000, 450, 750, 1100, 2300],
        "Business": [360000, 520000, 700000, 650, 1000, 1500, 5200]
      },
      "Mauritius": {
        "Premium Economy": [110000, 150000, 200000, 300, 500, 800, 1700],
        "Business": [200000, 280000, 360000, 420, 700, 1050, 3900]
      }
    },

    "Flying Blue": {
      "Singapur": {
        "Premium Economy": [240000, 340000, 480000, 350, 550, 850, 1700],
        "Business": [500000, 760000, 1050000, 500, 800, 1200, 3800]
      },
      "Karibik": {
        "Premium Economy": [180000, 280000, 420000, 320, 520, 800, 1600],
        "Business": [380000, 620000, 900000, 450, 750, 1100, 3600]
      },
      "Kanada": {
        "Premium Economy": [120000, 180000, 260000, 250, 420, 650, 1300],
        "Business": [240000, 380000, 600000, 350, 600, 900, 2800]
      },
      "Australien": {
        "Premium Economy": [320000, 500000, 750000, 450, 750, 1100, 2300],
        "Business": [800000, 1200000, 1600000, 700, 1100, 1600, 5200]
      },
      "Mauritius": {
        "Premium Economy": [220000, 330000, 480000, 350, 550, 850, 1700],
        "Business": [450000, 720000, 1000000, 480, 800, 1200, 3900]
      }
    },

    "KrisFlyer": {
      "Singapur": {
        "Premium Economy": [130000, 180000, 240000, 320, 480, 700, 1700],
        "Business": [220000, 300000, 400000, 420, 650, 950, 3800]
      },
      "Karibik": {
        "Premium Economy": [180000, 250000, 340000, 420, 650, 950, 1600],
        "Business": [300000, 430000, 580000, 550, 850, 1250, 3600]
      },
      "Kanada": {
        "Premium Economy": [130000, 180000, 240000, 300, 450, 650, 1300],
        "Business": [220000, 320000, 430000, 400, 650, 900, 2800]
      },
      "Australien": {
        "Premium Economy": [220000, 320000, 430000, 450, 700, 1000, 2300],
        "Business": [360000, 520000, 700000, 650, 950, 1400, 5200]
      },
      "Mauritius": {
        "Premium Economy": [150000, 210000, 290000, 350, 550, 800, 1700],
        "Business": [250000, 350000, 470000, 450, 700, 1000, 3900]
      }
    }
  };

  function buildExtraRates() {
    const rates = [];

    Object.entries(extraMatrix).forEach(([programm, targets]) => {
      Object.entries(targets).forEach(([ziel, classes]) => {
        Object.entries(classes).forEach(([klasse, values]) => {
          const [bestMiles, realMiles, consMiles, bestTaxes, realTaxes, consTaxes, cashPp] = values;
          const [faktorNebensaison, faktorHauptsaison, faktorFerien] = extraFactors[ziel] || [1, 1.10, 1.22];
          const meta = programMeta[programm];

          rates.push({
            ziel,
            programm,
            code: meta.code,
            klasse,
            bestMilesRtPp: bestMiles,
            realMilesRtPp: realMiles,
            consMilesRtPp: consMiles,
            bestTaxesRtPp: bestTaxes,
            realTaxesRtPp: realTaxes,
            consTaxesRtPp: consTaxes,
            faktorNebensaison,
            faktorHauptsaison,
            faktorFerien,
            cashPp,
            quelle: meta.quelle,
            hinweis: meta.hinweis
          });
        });
      });
    });

    return rates;
  }

  if (!window.MILES_PLANNER_AWARD_RATES) {
    window.MILES_PLANNER_AWARD_RATES = {
      dataStand: "10.05.2026",
      source: "GitHub Zusatz-Planungswerte für neue Ziele.",
      currency: "EUR",
      rates: []
    };
  }

  window.MILES_PLANNER_AWARD_RATES.rates.push(...buildExtraRates());
  window.MILES_PLANNER_AWARD_RATES.source = `${window.MILES_PLANNER_AWARD_RATES.source || "GitHub Planungswerte"} Zusatz-Ziele Singapur, Karibik, Kanada, Australien und Mauritius ergänzt.`;
})();
