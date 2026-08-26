(() => {
  const rates = window.MILES_PLANNER_AWARD_RATES?.rates || [];
  const calibrationDate = "26.08.2026";
  const chartStand = "03.03.2026";

  // Aktuell öffentlich verifizierbare Miles-&-More-Basis.
  // Die am 26.08.2026 von Miles & More verlinkte Award-Flight-Tabelle trägt den Stand 03.03.2026.
  // Ihre Werte gelten für Hin- und Rückflug. Für ausschließlich mit Air Dolomiti, Austrian,
  // Discover, Lufthansa, Lufthansa City oder SWISS durchgeführte interkontinentale Verbindungen
  // werden die Meilenwerte dagegen dynamisch in der Buchung angezeigt.
  // "miles-only" bedeutet: Der Chart-Meilenwert bleibt fix, vorhandene Saisonfaktoren dürfen
  // aber weiterhin Gebühren und Cash-Planungswerte skalieren. Die Laufzeitkorrektur dafür sitzt
  // in assets/js/rechner-review-fixes.js.
  const calibrations = [
    {
      ziel: "Thailand",
      programm: "Miles & More",
      klasse: "Premium Economy",
      bestMilesRtPp: 110000,
      realMilesRtPp: 110000,
      consMilesRtPp: 110000,
      seasonFactorMode: "miles-only",
      calibrationDate,
      feesLiveChecked: false,
      calibrationBasis: `Aktuell von Miles & More verlinkte Award-Flight-Tabelle (Stand ${chartStand}): Europa–Südostasien Premium Economy 110.000 Meilen Return.`,
      calibrationNote: "Der Meilenwert ist der aktuelle offizielle Partnerchart-Anker. Bei dynamisch bepreisten Lufthansa-Group-Verbindungen kann der tatsächlich angezeigte Wert abweichen. Gebühren und Cashpreis wurden nicht live neu abgefragt."
    },
    {
      ziel: "Thailand",
      programm: "Miles & More",
      klasse: "Business",
      bestMilesRtPp: 200000,
      realMilesRtPp: 200000,
      consMilesRtPp: 200000,
      seasonFactorMode: "miles-only",
      calibrationDate,
      feesLiveChecked: false,
      calibrationBasis: `Aktuell von Miles & More verlinkte Award-Flight-Tabelle (Stand ${chartStand}): Europa–Südostasien Business 200.000 Meilen Return.`,
      calibrationNote: "Der Meilenwert ist der aktuelle offizielle Partnerchart-Anker. Bei dynamisch bepreisten Lufthansa-Group-Verbindungen kann der tatsächlich angezeigte Wert abweichen. Gebühren und Cashpreis wurden nicht live neu abgefragt."
    },
    {
      ziel: "USA East",
      programm: "Miles & More",
      klasse: "Premium Economy",
      bestMilesRtPp: 85000,
      realMilesRtPp: 85000,
      consMilesRtPp: 85000,
      seasonFactorMode: "miles-only",
      calibrationDate,
      feesLiveChecked: false,
      calibrationBasis: `Aktuell von Miles & More verlinkte Award-Flight-Tabelle (Stand ${chartStand}): Europa–Nordamerika Premium Economy 85.000 Meilen Return.`,
      calibrationNote: "Der Meilenwert ist der aktuelle offizielle Partnerchart-Anker. Bei dynamisch bepreisten Lufthansa-Group-Verbindungen kann der tatsächlich angezeigte Wert abweichen. Gebühren und Cashpreis wurden nicht live neu abgefragt."
    },
    {
      ziel: "USA East",
      programm: "Miles & More",
      klasse: "Business",
      bestMilesRtPp: 125000,
      realMilesRtPp: 125000,
      consMilesRtPp: 125000,
      seasonFactorMode: "miles-only",
      calibrationDate,
      feesLiveChecked: false,
      calibrationBasis: `Aktuell von Miles & More verlinkte Award-Flight-Tabelle (Stand ${chartStand}): Europa–Nordamerika Business 125.000 Meilen Return.`,
      calibrationNote: "Der Meilenwert ist der aktuelle offizielle Partnerchart-Anker. Bei dynamisch bepreisten Lufthansa-Group-Verbindungen kann der tatsächlich angezeigte Wert abweichen. Gebühren und Cashpreis wurden nicht live neu abgefragt."
    },
    {
      ziel: "Singapur",
      programm: "Miles & More",
      klasse: "Premium Economy",
      bestMilesRtPp: 110000,
      realMilesRtPp: 110000,
      consMilesRtPp: 110000,
      seasonFactorMode: "miles-only",
      calibrationDate,
      feesLiveChecked: false,
      calibrationBasis: `Aktuell von Miles & More verlinkte Award-Flight-Tabelle (Stand ${chartStand}): Europa–Südostasien Premium Economy 110.000 Meilen Return.`,
      calibrationNote: "Der Meilenwert ist der aktuelle offizielle Partnerchart-Anker. Die tatsächliche Airline und Buchungslogik entscheiden darüber, ob dieser Chartwert anwendbar ist. Gebühren und Cashpreis wurden nicht live neu abgefragt."
    },
    {
      ziel: "Singapur",
      programm: "Miles & More",
      klasse: "Business",
      bestMilesRtPp: 200000,
      realMilesRtPp: 200000,
      consMilesRtPp: 200000,
      seasonFactorMode: "miles-only",
      calibrationDate,
      feesLiveChecked: false,
      calibrationBasis: `Aktuell von Miles & More verlinkte Award-Flight-Tabelle (Stand ${chartStand}): Europa–Südostasien Business 200.000 Meilen Return.`,
      calibrationNote: "Der Meilenwert ist der aktuelle offizielle Partnerchart-Anker. Bei dynamisch bepreisten Lufthansa-Group-Verbindungen kann der tatsächlich angezeigte Wert abweichen. Gebühren und Cashpreis wurden nicht live neu abgefragt."
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
    rate.quelle = `Miles & More Award-Flight-Tabelle, aktuell verlinkt am ${calibrationDate}, Tabellenstand ${chartStand}.`;
    rate.hinweis = calibration.calibrationNote;
  });

  if (window.MILES_PLANNER_AWARD_RATES) {
    window.MILES_PLANNER_AWARD_RATES.source = `${window.MILES_PLANNER_AWARD_RATES.source || "GitHub Planungswerte"} Miles-&-More-Meilenbasis für Thailand, USA East und Singapur am ${calibrationDate} gegen die aktuell verlinkte offizielle Award-Flight-Tabelle geprüft; Gebühren/Cashwerte nicht live verifiziert.`;
  }
})();
