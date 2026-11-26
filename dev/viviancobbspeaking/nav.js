(() => {
  // Paths are relative to this file. Keep nav.js beside the homepage.
  const siteRoot = new URL('.', document.currentScript.src);
  const menuLinks = [
    { label: 'Speaking', path: 'speaking/' },
    { label: 'The Book', path: 'index.html#book' },
    { label: 'Workshops', path: 'workshops/' },
    { label: 'Meet Vivian', path: 'meet-vivian/' },
    { label: 'Read & Listen', path: 'index.html#resources' },
    { label: 'Book Vivian', path: 'https://viviancobbspeaking.com/book-vivian', button: true },
  ];

  function pagePath(url) {
    return url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  }

  const currentPage = new URL(document.URL);

  document.querySelectorAll('[data-shared-nav]').forEach(nav => {
    const links = menuLinks.map(({ label, path, button }) => {
      const target = new URL(path, siteRoot);
      const samePage = target.origin === currentPage.origin && pagePath(target) === pagePath(currentPage);
      const link = document.createElement('a');

      link.href = samePage && target.hash ? target.hash : target.href;
      link.textContent = label;
      if (button) link.classList.add('button');
      if (samePage && !target.hash) link.setAttribute('aria-current', 'page');
      return link;
    });
    nav.replaceChildren(...links);
  });

  const mobileMenu = document.querySelector('.mobile-nav');
  if (!mobileMenu) return;

  const summary = mobileMenu.querySelector('summary');
  mobileMenu.addEventListener('click', event => {
    if (!event.target.closest('a')) return;

    mobileMenu.open = false;
    summary.focus();
  });
  mobileMenu.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !mobileMenu.open) return;

    mobileMenu.open = false;
    summary.focus();
  });
})();
