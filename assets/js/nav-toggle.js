(() => {
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('#site-navigation, .main-nav');

    if (!header || !toggle || !nav) return;

    function closeSubmenus(exceptItem = null) {
      header.querySelectorAll('.nav-item.submenu-open').forEach((item) => {
        if (item === exceptItem) return;
        item.classList.remove('submenu-open');
        const button = item.querySelector(':scope > .submenu-toggle');
        button?.setAttribute('aria-expanded', 'false');
      });
    }

    function setOpen(isOpen) {
      header.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
      if (!isOpen) closeSubmenus();
    }

    toggle.addEventListener('click', () => {
      setOpen(!header.classList.contains('nav-open'));
    });

    header.querySelectorAll('.submenu-toggle').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const item = button.closest('.nav-item.has-dropdown');
        if (!item) return;

        const shouldOpen = !item.classList.contains('submenu-open');
        closeSubmenus(item);
        item.classList.toggle('submenu-open', shouldOpen);
        button.setAttribute('aria-expanded', String(shouldOpen));
        button.setAttribute(
          'aria-label',
          shouldOpen
            ? button.getAttribute('aria-label')?.replace(' öffnen', ' schließen') || 'Untermenü schließen'
            : button.getAttribute('aria-label')?.replace(' schließen', ' öffnen') || 'Untermenü öffnen'
        );
      });
    });

    nav.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) closeSubmenus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeSubmenus();
        setOpen(false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
