(() => {
  const dataStand = "10.05.2026";

  const factors = {
    "Dubai": [1.00, 1.05, 1.12],
    "Japan": [1.00, 1.12, 1.25],
    "Malediven": [1.00, 1.12, 1.28],
    "Südafrika": [1.00, 1.10, 1.20],
    "Thailand": [1.00, 1.12, 1.25],
    "USA East": [1.00, 1.08, 1.18],
    "USA West": [1.00, 1.08, 1.20]
  };

  const programMeta = {
    "Miles & More": {
      code: "MAM",
      quelle: "Miles & More Star Alliance flight award table / Planungswert je Zielregion",
      hinweis: "M&M nutzt Regionen/Awardchart; Zuschläge und Routing können stark abweichen."
    },
    "Avios": {
      code: "AVIOS",
      quelle: "British Airways Club Reward Flight Beispiele und Avios-Partnerlogik / Planungswert je Routing",
      hinweis: "Avios-Werte sind routing-, Airline- und Peak-/Off-Peak-abhängig; BA/IB/QR separat prüfen."
    },
    "Flying Blue": {
      code: "FB",
      quelle: "Flying Blue dynamische Awardpreise / Planungsbereich aus typischen Flying-Blue-Spannen",
      hinweis: "Flying Blue ist dynamisch bepreist; Werte sind bewusst als grober Planungsbereich gepflegt."
    },
    "KrisFlyer": {
      code: "KF",
      quelle: "Singapore Airlines KrisFlyer Award Charts / Planungswert je Zone und Partnerlogik",
      hinweis: "KrisFlyer-Werte hängen von Saver/Advantage, Routing und Verfügbarkeit ab; Transferdauer beachten."
    }
  };

  // Format pro Kombination:
  // [bestMiles, realMiles, consMiles, bestTaxes, realTaxes, consTaxes, cashPp]
  // Alle Werte gelten pro Person für Hin- und Rückflug.
  const matrix = {
    "Miles & More": {
      "Dubai": {
        "Premium Economy": [33000, 40000, 47000, 200, 220, 260, 900],
        "Business": [72000, 88000, 104000, 500, 550, 660, 2200]
      },
      "Japan": {
        "Premium Economy": [90000, 110000, 130000, 450, 600, 800, 1700],
        "Business": [170000, 200000, 240000, 750, 950, 1250, 3800]
      },
      "Malediven": {
        "Premium Economy": [90000, 110000, 130000, 500, 650, 850, 1700],
        "Business": [170000, 200000, 240000, 800, 1000, 1300, 3900]
      },
      "Südafrika": {
        "Premium Economy": [80000, 100000, 120000, 420, 550, 750, 1500],
        "Business": [150000, 185000, 220000, 700, 900, 1200, 3300]
      },
      "Thailand": {
        "Premium Economy": [90000, 110000, 130000, 450, 550, 700, 1600],
        "Business": [170000, 200000, 240000, 700, 850, 1100, 3500]
      },
      "USA East": {
        "Premium Economy": [70000, 90000, 110000, 380, 500, 650, 1300],
        "Business": [112000, 150000, 180000, 600, 780, 1000, 2800]
      },
      "USA West": {
        "Premium Economy": [80000, 100000, 120000, 420, 550, 750, 1500],
        "Business": [140000, 175000, 210000, 650, 850, 1100, 3300]
      }
    },

    "Avios": {
      "Dubai": {
        "Premium Economy": [70000, 90000, 115000, 220, 350, 520, 900],
        "Business": [110000, 145000, 180000, 300, 500, 750, 2200]
      },
      "Japan": {
        "Premium Economy": [120000, 160000, 210000, 350, 550, 800, 1700],
        "Business": [220000, 300000, 380000, 450, 750, 1100, 3800]
      },
      "Malediven": {
        "Premium Economy": [110000, 150000, 200000, 300, 500, 800, 1700],
        "Business": [200000, 280000, 360000, 420, 700, 1050, 3900]
      },
      "Südafrika": {
        "Premium Economy": [100000, 135000, 180000, 320, 520, 780, 1500],
        "Business": [180000, 250000, 320000, 420, 700, 1050, 3300]
      },
      "Thailand": {
        "Premium Economy": [120000, 170000, 230000, 350, 550, 850, 1600],
        "Business": [220000, 320000, 420000, 480, 800, 1200, 3500]
      },
      "USA East": {
        "Premium Economy": [93500, 120000, 150000, 350, 430, 650, 1300],
        "Business": [176000, 210000, 260000, 399, 550, 800, 2800]
      },
      "USA West": {
        "Premium Economy": [110000, 145000, 185000, 380, 550, 800, 1500],
        "Business": [200000, 260000, 330000, 450, 700, 1000, 3300]
      }
    },

    "Flying Blue": {
      "Dubai": {
        "Premium Economy": [90000, 130000, 190000, 250, 400, 600, 900],
        "Business": [180000, 280000, 420000, 350, 550, 850, 2200]
      },
      "Japan": {
        "Premium Economy": [220000, 320000, 450000, 350, 550, 800, 1700],
        "Business": [450000, 700000, 950000, 450, 750, 1100, 3800]
      },
      "Malediven": {
        "Premium Economy": [220000, 330000, 480000, 350, 550, 850, 1700],
        "Business": [450000, 720000, 1000000, 480, 800, 1200, 3900]
      },
      "Südafrika": {
        "Premium Economy": [180000, 280000, 400000, 320, 520, 800, 1500],
        "Business": [380000, 620000, 900000, 450, 750, 1100, 3300]
      },
      "Thailand": {
        "Premium Economy": [240000, 320000, 420000, 350, 500, 700, 1600],
        "Business": [500000, 750000, 1050000, 500, 800, 1200, 3500]
      },
      "USA East": {
        "Premium Economy": [120000, 180000, 260000, 250, 420, 650, 1300],
        "Business": [240000, 380000, 600000, 350, 600, 900, 2800]
      },
      "USA West": {
        "Premium Economy": [150000, 230000, 320000, 280, 450, 700, 1500],
        "Business": [300000, 480000, 720000, 380, 650, 950, 3300]
      }
    },

    "KrisFlyer": {
      "Dubai": {
        "Premium Economy": [90000, 120000, 160000, 220, 320, 480, 900],
        "Business": [150000, 210000, 280000, 300, 450, 700, 2200]
      },
      "Japan": {
        "Premium Economy": [150000, 210000, 280000, 350, 500, 750, 1700],
        "Business": [240000, 340000, 450000, 450, 650, 950, 3800]
      },
      "Malediven": {
        "Premium Economy": [150000, 210000, 290000, 350, 550, 800, 1700],
        "Business": [250000, 350000, 470000, 450, 700, 1000, 3900]
      },
      "Südafrika": {
        "Premium Economy": [170000, 240000, 320000, 380, 550, 800, 1500],
        "Business": [280000, 400000, 540000, 500, 750, 1100, 3300]
      },
      "Thailand": {
        "Premium Economy": [150000, 210000, 280000, 350, 500, 750, 1600],
        "Business": [240000, 340000, 450000, 450, 650, 950, 3500]
      },
      "USA East": {
        "Premium Economy": [130000, 180000, 240000, 300, 450, 650, 1300],
        "Business": [220000, 320000, 430000, 400, 650, 900, 2800]
      },
      "USA West": {
        "Premium Economy": [150000, 210000, 280000, 320, 500, 750, 1500],
        "Business": [260000, 380000, 520000, 450, 700, 1000, 3300]
      }
    }
  };

  function buildRates() {
    const rates = [];

    Object.entries(matrix).forEach(([programm, targets]) => {
      Object.entries(targets).forEach(([ziel, classes]) => {
        Object.entries(classes).forEach(([klasse, values]) => {
          const [bestMiles, realMiles, consMiles, bestTaxes, realTaxes, consTaxes, cashPp] = values;
          const [faktorNebensaison, faktorHauptsaison, faktorFerien] = factors[ziel] || [1, 1.08, 1.18];
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

  window.MILES_PLANNER_AWARD_RATES = {
    dataStand,
    source: "GitHub Planungswerte für Phase 3. Werte sind konservative Szenario-Spannen und keine Live-Verfügbarkeiten.",
    currency: "EUR",
    rates: buildRates()
  };
})();
