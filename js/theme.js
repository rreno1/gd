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
      const container = button.querySelector('[data-theme-icon]');
      if (container) {
        container.innerHTML = light
          ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
          : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
      }
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

    // Safety fallback: auto-hide after 5.0 seconds in case page loading script fails or crashes
    const fallbackTimeout = setTimeout(() => {
      loader.classList.add('fade-out');
    }, 5000);

    // Expose control API globally on window.GD
    const GD = window.GD = window.GD || {};
    GD.showLoader = () => {
      clearTimeout(fallbackTimeout);
      loader.classList.remove('fade-out');
    };
    GD.hideLoader = () => {
      clearTimeout(fallbackTimeout);
      loader.classList.add('fade-out');
    };

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
