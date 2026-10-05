(() => {
  const form = document.getElementById('referralLinkForm');
  if (!form) return;

  const cardSelect = document.getElementById('referralCard');
  const sourceInput = document.getElementById('referralSource');
  const subjectInput = document.getElementById('referralSubject');
  const submitButton = document.getElementById('referralSubmit');
  const statusBox = document.getElementById('referralFormStatus');
  const summary = document.getElementById('referralSelectionSummary');
  const offerSummary = document.getElementById('referralOfferSummary');
  const offerPanels = Array.from(document.querySelectorAll('[data-referral-card]'));
  let sending = false;
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
    submitButton.textContent = 'Link per E-Mail anfragen';
    offerPanels.forEach((panel) => { panel.hidden = panel.dataset.referralCard !== cardSelect.value; });
    if (offerSummary) offerSummary.hidden = false;
    summary.textContent = `${label} ist ausgewählt. Du kannst die Auswahl jederzeit ändern.`;
  }

  const requestedCard = params.get('karte');
  if (requestedCard && validCards.has(requestedCard)) cardSelect.value = requestedCard;
  sourceInput.value = safeSource(params.get('quelle'));
  cardSelect.addEventListener('change', syncSelection);
  syncSelection();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!form.reportValidity()) return;
    syncSelection();
    const submittedCard = cardSelect.value;
    const submittedSource = sourceInput.value;
    const submittedData = new FormData(form);
    sending = true;
    submitButton.disabled = true;
    cardSelect.disabled = true;
    submitButton.textContent = 'Wird gesendet …';
    form.setAttribute('aria-busy', 'true');
    statusBox.className = 'form-status';
    statusBox.style.display = 'block';
    statusBox.textContent = 'Anfrage wird gesendet …';
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: submittedData,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Formspree request failed');
      try {
      if (typeof window.pfpTrackConversion === 'function') {
        window.pfpTrackConversion('referral_link_success', {
          card_offer: submittedCard,
          request_source: submittedSource
        });
      }
      } catch (trackingError) { /* Tracking must never change a successful submission. */ }
      form.reset();
      cardSelect.value = submittedCard;
      sourceInput.value = safeSource(params.get('quelle'));
      syncSelection();
      statusBox.className = 'form-status success';
      statusBox.style.display = '';
      statusBox.textContent = 'Danke! Deine Anfrage wurde erfolgreich übermittelt. Ich prüfe das Angebot und antworte dir per E-Mail. Schau auch in deinen Spam-Ordner. Ein Kartenantrag wurde damit noch nicht gestellt.';
    } catch (error) {
      statusBox.className = 'form-status error';
      statusBox.style.display = '';
      statusBox.textContent = 'Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal.';
    } finally {
      sending = false;
      submitButton.disabled = false;
      cardSelect.disabled = false;
      form.removeAttribute('aria-busy');
      syncSelection();
      statusBox.focus();
    }
  });
})();
