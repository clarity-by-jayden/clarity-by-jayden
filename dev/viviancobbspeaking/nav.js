(() => {
  // Paths are relative to nav.js, which sits beside the homepage.
  const siteRoot = new URL('.', document.currentScript.src);
  const menuLinks = [
    { label: 'Speaking', path: 'speaking/index.html', children: [
      { label: 'Workshops', path: 'workshops/index.html' },
      { label: 'Retreats', path: 'retreats/index.html' },
    ] },
    { label: 'The Book', path: 'index.html#book' },
    { label: 'Meet Vivian', path: 'meet-vivian/index.html' },
    { label: 'Read & Listen', path: 'index.html#resources' },
    { label: 'Book Vivian', path: 'https://viviancobbspeaking.com/book-vivian', button: true },
  ];

  const styles = document.createElement('style');
  styles.textContent = `
    .nav-group{position:relative}
    .nav-group-row{display:flex;align-items:center}
    .nav-expand{
      display:grid;place-items:center;min-width:32px;min-height:44px;padding:0;
      border:0;background:transparent;color:inherit;cursor:pointer
    }
    .nav-expand::after{
      content:"";width:7px;height:7px;border-right:2px solid;border-bottom:2px solid;
      transform:translateY(-2px) rotate(45deg)
    }
    .nav-expand[aria-expanded="true"]::after{transform:translateY(2px) rotate(225deg)}
    .nav-expand:focus-visible{outline:3px solid currentColor;outline-offset:-2px}
    .nav-submenu{
      position:absolute;top:100%;left:0;z-index:5;display:grid;min-width:10rem;
      background:var(--white,#fff);border:1px solid var(--line,#bbc3c8);
      border-top:3px solid var(--teal,#1b9aa3);box-shadow:0 .45rem 1.1rem #1c3b4a25
    }
    .nav-submenu[hidden]{display:none}
    .nav-submenu a{display:flex;align-items:center;min-height:44px;padding:.35rem .8rem;white-space:nowrap}
    .nav-submenu a:hover,.nav-submenu a:focus-visible{background:var(--lavender,#d8c1e8)}
    .nav-submenu a:focus-visible{outline-offset:-3px}
    .mobile-nav .nav-group-row>a{display:flex;align-items:center;min-height:44px}
    .mobile-nav .nav-expand{min-width:44px}
    .mobile-nav .nav-submenu{position:static;border:0;border-left:3px solid var(--teal,#1b9aa3);box-shadow:none;margin-left:.4rem}
    .mobile-nav .nav-submenu [aria-current]{text-decoration:underline;text-underline-offset:4px}
  `;
  document.head.append(styles);

  function pagePath(url) {
    return url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  }

  const currentPage = new URL(document.URL);
  function createLink({ label, path, button }) {
    const target = new URL(path, siteRoot);
    const samePage = target.origin === currentPage.origin && pagePath(target) === pagePath(currentPage);
    const link = document.createElement('a');
    link.href = samePage && target.hash ? target.hash : target.href;
    link.textContent = label;
    if (button) link.classList.add('button');
    if (samePage && !target.hash) link.setAttribute('aria-current', 'page');
    return link;
  }

  function createGroup(item, navigationIndex) {
    const group = document.createElement('div');
    group.className = 'nav-group';
    const row = document.createElement('div');
    row.className = 'nav-group-row';
    const toggle = document.createElement('button');
    toggle.className = 'nav-expand';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Speaking submenu');

    const submenu = document.createElement('div');
    submenu.className = 'nav-submenu';
    submenu.id = 'speaking-submenu-' + navigationIndex;
    toggle.setAttribute('aria-controls', submenu.id);
    submenu.append(...item.children.map(createLink));

    function setOpen(open) {
      submenu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    }

    setOpen(false);
    toggle.addEventListener('click', () => setOpen(submenu.hidden));
    group.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') setOpen(true);
    });
    group.addEventListener('pointerleave', () => {
      if (!group.contains(document.activeElement)) setOpen(false);
    });
    group.addEventListener('focusout', event => {
      if (!group.contains(event.relatedTarget)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || submenu.hidden || !group.getClientRects().length) return;

      const focusInside = group.contains(document.activeElement);
      setOpen(false);
      if (focusInside) {
        event.stopPropagation();
        toggle.focus();
      }
    }, true);
    group.addEventListener('keydown', event => {
      if (event.target !== toggle || event.key !== 'ArrowDown') return;

      event.preventDefault();
      setOpen(true);
      submenu.firstElementChild.focus();
    });

    row.append(createLink(item), toggle);
    group.append(row, submenu);
    return group;
  }

  document.querySelectorAll('[data-shared-nav]').forEach((nav, index) => {
    nav.replaceChildren(...menuLinks.map(item => item.children ? createGroup(item, index) : createLink(item)));
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
