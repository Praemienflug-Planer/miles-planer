(() => {
  const href = '/miles-planer/meilen-sammeln/anfaenger/';
  const label = 'Kostenlos starten';

  function addQuickstartLinks() {
    const dropdown = [...document.querySelectorAll('.nav-dropdown')].find(menu =>
      [...menu.querySelectorAll('a')].some(a => a.getAttribute('href') === '/miles-planer/meilen-sammeln/')
    );

    if (dropdown && !dropdown.querySelector(`a[href="${href}"]`)) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      const overview = dropdown.querySelector('a[href="/miles-planer/meilen-sammeln/"]');
      if (overview) overview.insertAdjacentElement('afterend', link);
      else dropdown.prepend(link);
    }

    const footerList = document.querySelector('.footer-links');
    if (footerList && !footerList.querySelector(`a[href="${href}"]`)) {
      const item = document.createElement('li');
      item.innerHTML = `<a href="${href}">${label}</a>`;
      const meilenLink = footerList.querySelector('a[href="/miles-planer/meilen-sammeln/"]');
      if (meilenLink?.parentElement) meilenLink.parentElement.insertAdjacentElement('afterend', item);
      else footerList.prepend(item);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addQuickstartLinks);
  else addQuickstartLinks();

  window.addEventListener('load', addQuickstartLinks);
})();