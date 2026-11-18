/* Shared site interactions: accessible JavaScript navigation, active-page
   highlighting, automatic footer links, and FAQ accordion behavior. */
(() => {
  'use strict';
  const pages = [
    { label: 'Home', file: 'index.html' },
    { label: 'FAQ', file: 'faq.html' },
    { label: 'Room Booking', file: 'roombooking.html' },
    { label: 'About', file: 'about.html' },
    { label: 'Contact / Help', file: 'contact.html' },
    { label: 'References', file: 'reference.html' }
  ];

  const currentFile = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  const navList = document.getElementById('nav-links');
  const footerList = document.getElementById('footer-links');

  // The navigation is generated from one source of truth on every page.
  if (navList) {
    pages.forEach(({ label, file }) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = file;
      link.textContent = label;
      if (currentFile === file) link.setAttribute('aria-current', 'page');
      item.append(link);
      navList.append(item);
    });
  }
  if (footerList) {
    pages.forEach(({ label, file }) => {
      const link = document.createElement('a');
      link.href = file;
      link.textContent = label;
      footerList.append(link);
    });
  }

  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  // FAQs also work without JavaScript because they use native <details>.
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.filter((other) => other !== item).forEach((other) => { other.open = false; });
    });
  });
})();
