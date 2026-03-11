const API_URL =
  "https://script.google.com/macros/s/AKfycbyfyZtqZyRrQlQWmTMK-IbKc7J4KCGK4A1huw2F9ZOVdSm7hw9mN3BVSYlRmDnF8o1h/exec";

async function loadData() {
  const resultBox = document.getElementById("result");
  const rawBox = document.getElementById("raw");

  resultBox.innerHTML = "Lade Daten aus Google Sheets...";
  rawBox.textContent = "";

  try {
    const response = await fetch(SHEET_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("HTTP-Fehler: " + response.status);
    }

    const text = await response.text();

    rawBox.textContent = text;

    const rows = text
      .split(/\r?\n/)
      .map((row) => row.trim())
      .filter((row) => row.length > 0)
      .map((row) => {
        const cells = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < row.length; i++) {
          const char = row[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            cells.push(current.trim().replace(/^"|"$/g, ""));
            current = "";
          } else {
            current += char;
          }
        }

        cells.push(current.trim().replace(/^"|"$/g, ""));
        return cells;
      });

    let html = "";

    rows.forEach((row) => {
      const label = row[0] || "";
      const value = row.slice(1).join(" | ").trim();

      if (label && value) {
        html += `<p><strong>${label}</strong>: ${value}</p>`;
      }
    });

    resultBox.innerHTML =
      html || "<p>Es konnten keine auswertbaren Daten gelesen werden.</p>";
  } catch (error) {
    resultBox.innerHTML = `
      <p><strong>Fehler:</strong> ${error.message}</p>
      <p>Teste die Seite bitte über GitHub Pages und nicht per Doppelklick.</p>
    `;
    rawBox.textContent = "Fehler beim Laden der CSV.";
    console.error(error);
  }
}


loadData();
