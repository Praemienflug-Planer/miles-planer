const API_URL =
  "https://script.google.com/macros/s/AKfycbyfyZtqZyRrQlQWmTMK-IbKc7J4KCGK4A1huw2F9ZOVdSm7hw9mN3BVSYlRmDnF8o1h/exec";

function zeigeErgebnisView() {
  document.getElementById("inputView").classList.remove("active");
  document.getElementById("resultView").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function zurueckZuEingaben() {
  document.getElementById("resultView").classList.remove("active");
  document.getElementById("inputView").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function berechneMilesPlaner() {
  const resultBox = document.getElementById("result");

  zeigeErgebnisView();
  resultBox.innerHTML = "<p>Berechne...</p>";

  const payload = {
    ziel: document.getElementById("ziel").value,
    personen: document.getElementById("personen").value,
    programm: document.getElementById("programm").value,
    reiseklasse: document.getElementById("reiseklasse").value,
    reisezeit: document.getElementById("reisezeit").value,
    reisejahr: document.getElementById("reisejahr").value,
    reisemonat: document.getElementById("reisemonat").value,
    bestandAktuell: document.getElementById("bestandAktuell").value,
    transferBestand: document.getElementById("transferBestand").value,
    geplanterBonus: document.getElementById("geplanterBonus").value,
    monatlicheSammelrate: document.getElementById("monatlicheSammelrate").value,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("HTTP-Fehler: " + response.status);
    }

    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Unbekannter Fehler aus Apps Script");
    }

    resultBox.innerHTML = `
      <div class="result-card">
        <h2>${data.headline || "Ergebnis"}</h2>
        <p class="subline">${data.subline || ""}</p>

        <div class="result-section">
          <p><strong>${data.status || ""}</strong></p>
          <p>${data.risiken || ""}</p>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Bestand heute</div>
            <div class="value">${data.bestand || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Bonus geplant</div>
            <div class="value">${data.bonus || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Zielbedarf</div>
            <div class="value">${data.zielbedarf || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Fehlend</div>
            <div class="value">${data.fehlend || ""}</div>
          </div>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Monate bis Ziel</div>
            <div class="value">${data.monate || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Ziel erreicht ca.</div>
            <div class="value">${data.zielErreicht || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Geplante Reise</div>
            <div class="value">${data.reise || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Reisebewertung</div>
            <div class="value">${data.bewertung || ""}</div>
          </div>
        </div>

        <div class="result-section">
          <h3>Deal & Kosten</h3>
          <p>${data.deal || ""}</p>
          <p>${data.taxes || ""}</p>
          <p>${data.taxRange || ""}</p>
          <p>${data.cash || ""}</p>
        </div>

        <div class="result-grid">
          <div class="result-item">
            <div class="label">Fortschritt heute</div>
            <div class="value">${data.progress || ""}</div>
          </div>
          <div class="result-item">
            <div class="label">Fortschritt inkl. Bonus</div>
            <div class="value">${data.progressBonus || ""}</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    resultBox.innerHTML = `
      <p><strong>Fehler:</strong> ${error.message}</p>
      <p>Bitte prüfe die Apps-Script-Web-App und die Sheet-Verknüpfung.</p>
    `;
    console.error(error);
  }
}
