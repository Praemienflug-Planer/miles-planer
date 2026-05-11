(() => {
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-navigation, .main-nav');

    if (!header || !toggle || !nav) return;

    function setOpen(isOpen) {
      header.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    }

    toggle.addEventListener('click', () => {
      setOpen(!header.classList.contains('nav-open'));
    });

    nav.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
