(() => {
  const form = document.getElementById('referralLinkForm');
  if (!form) return;

  const cardSelect = document.getElementById('referralCard');
  const sourceInput = document.getElementById('referralSource');
  const subjectInput = document.getElementById('referralSubject');
  const submitButton = document.getElementById('referralSubmit');
  const statusBox = document.getElementById('referralFormStatus');
  const summary = document.getElementById('referralSelectionSummary');
  const params = new URLSearchParams(window.location.search);
  const validCards = new Set(Array.from(cardSelect.options).map((option) => option.value));

  function safeSource(value) {
    const cleaned = String(value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 80);
    return cleaned || 'direkt';
  }

  function syncSelection() {
    const selected = cardSelect.options[cardSelect.selectedIndex];
    const label = selected?.textContent?.trim() || 'Kreditkarte';
    subjectInput.value = `Kreditkarten-Link-Anfrage: ${label}`;
    submitButton.textContent = selected?.value === 'payback-amex' ? '4.000-Punkte-Link anfragen' : 'Ausgewählten Link anfragen';
    summary.textContent = `${label} ist ausgewählt. Du kannst die Auswahl jederzeit ändern.`;
  }

  const requestedCard = params.get('karte');
  if (requestedCard && validCards.has(requestedCard)) cardSelect.value = requestedCard;
  sourceInput.value = safeSource(params.get('quelle'));
  cardSelect.addEventListener('change', syncSelection);
  syncSelection();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    syncSelection();
    submitButton.disabled = true;
    statusBox.className = 'form-status';
    statusBox.style.display = 'block';
    statusBox.textContent = 'Anfrage wird gesendet …';
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Formspree request failed');
      if (typeof window.pfpTrackConversion === 'function') {
        window.pfpTrackConversion('referral_link_success', {
          card_offer: cardSelect.value,
          request_source: sourceInput.value
        });
      }
      form.reset();
      if (requestedCard && validCards.has(requestedCard)) cardSelect.value = requestedCard;
      sourceInput.value = safeSource(params.get('quelle'));
      syncSelection();
      statusBox.className = 'form-status success';
      statusBox.style.display = '';
      statusBox.textContent = 'Danke! Deine Anfrage ist angekommen. Du erhältst den geprüften Link per E-Mail.';
    } catch (error) {
      statusBox.className = 'form-status error';
      statusBox.style.display = '';
      statusBox.textContent = 'Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal.';
    } finally {
      submitButton.disabled = false;
    }
  });
})();
