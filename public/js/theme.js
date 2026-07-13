(function () {
  'use strict';

  const root = document.documentElement;
  const saved = localStorage.getItem('gd-theme');
  const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = saved || preferred;

  function syncButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const light = root.dataset.theme === 'light';
      button.setAttribute('aria-label', light ? 'Use dark theme' : 'Use light theme');
      button.setAttribute('title', light ? 'Use dark theme' : 'Use light theme');
      button.querySelector('[data-theme-icon]')?.replaceChildren(document.createTextNode(light ? 'Moon' : 'Sun'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncButtons();
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('gd-theme', root.dataset.theme);
        syncButtons();
      });
    });
  });
})();
