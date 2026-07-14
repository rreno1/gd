(function () {
  'use strict';

  function setDrawer(open) {
    const drawer = document.querySelector('[data-mobile-drawer]');
    const toggle = document.querySelector('[data-mobile-toggle]');
    if (!drawer || !toggle) return;
    drawer.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('drawer-open', open);
    if (open) drawer.querySelector('a, button')?.focus();
    else toggle.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-mobile-toggle]')?.addEventListener('click', () => setDrawer(true));
    document.querySelectorAll('[data-mobile-close]').forEach(item => item.addEventListener('click', () => setDrawer(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.querySelector('[data-mobile-drawer].is-open')) setDrawer(false);
    });
    document.querySelector('[data-current-year]')?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
  });

  window.GD = window.GD || {};
  window.GD.toast = function toast(message, type = 'info') {
    let region = document.getElementById('toastRegion');
    if (!region) {
      region = document.createElement('div');
      region.id = 'toastRegion';
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.append(region);
    }
    const item = document.createElement('div');
    item.className = `toast toast-${type}`;
    item.textContent = message;
    region.append(item);
    setTimeout(() => item.remove(), 4200);
  };
})();
