(function () {
  'use strict';

  const root = document.documentElement;
  const saved = localStorage.getItem('gd-theme');
  const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = saved || preferred;

  // 1. Inject early loading style to prevent content flash during script load
  const style = document.createElement('style');
  style.id = 'pageLoaderInitStyle';
  style.textContent = `
    body { opacity: 0 !important; }
    body.loader-ready { opacity: 1 !important; }
    .page-loader { position: fixed; z-index: 9999; inset: 0; display: flex; align-items: center; justify-content: center; background: ${root.dataset.theme === 'light' ? '#f1f3ef' : '#0d1114'}; transition: opacity 0.25s ease, visibility 0.25s ease; }
    .page-loader.fade-out { opacity: 0; visibility: hidden; }
    .page-loader .spinner { width: 40px; height: 40px; border: 4px solid ${root.dataset.theme === 'light' ? '#cbd4cf' : '#2b373b'}; border-top-color: ${root.dataset.theme === 'light' ? '#087c65' : '#43d6b5'}; border-radius: 50%; animation: page-spin 0.75s linear infinite; }
    @keyframes page-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

  function syncButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const light = root.dataset.theme === 'light';
      button.setAttribute('aria-label', light ? 'Use dark theme' : 'Use light theme');
      button.setAttribute('title', light ? 'Use dark theme' : 'Use light theme');
      button.querySelector('[data-theme-icon]')?.replaceChildren(document.createTextNode(light ? 'Moon' : 'Sun'));
    });
  }

  // 2. Setup loader and transition interceptors on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    syncButtons();
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('gd-theme', root.dataset.theme);
        syncButtons();
      });
    });

    // Create and prepend loader element
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'page-loader';
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    loader.append(spinner);
    document.body.prepend(loader);
    document.body.classList.add('loader-ready');

    // Smoothly fade out loader
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 100);

    // Intercept clicks on links for smooth page-out transition
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Ignore anchors with targets, mod keys, hash links, or external protocols
      if (
        anchor.target === '_blank' ||
        event.ctrlKey || event.shiftKey || event.metaKey || event.altKey ||
        href.startsWith('#') ||
        /^(?:https?:|mailto:|tel:|javascript:)/i.test(href)
      ) {
        return;
      }

      event.preventDefault();
      loader.classList.remove('fade-out');
      setTimeout(() => {
        location.href = href;
      }, 220);
    });
  });

  // 3. Handle page cache restoring (e.g. back button navigation)
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('fade-out');
    }
  });
})();
