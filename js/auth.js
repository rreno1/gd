(function () {
  'use strict';

  const GD = window.GD = window.GD || {};
  let sequence = 0;
  let resolveInitial;
  let initialResolved = false;

  GD.authState = {
    ready: false,
    user: null,
    profile: null,
    isAdmin: false,
    configured: false
  };
  GD.authReady = new Promise(resolve => { resolveInitial = resolve; });

  function initials(name) {
    const parts = String(name || 'Student').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'S';
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function updateNavigation(state, services) {
    const signIn = document.getElementById('signInButton');
    const account = document.getElementById('accountMenu');
    const adminLink = document.getElementById('adminLink');
    const banner = document.getElementById('configBanner');
    if (banner) banner.hidden = services.configured;
    if (adminLink) adminLink.hidden = !state.isAdmin;

    if (state.user) {
      if (signIn) signIn.hidden = true;
      if (account) account.hidden = false;
      const displayName = state.profile?.displayName || state.user.displayName || state.user.email || 'Student';
      setText('accountName', displayName);
      setText('accountAvatar', initials(displayName));
    } else {
      if (account) account.hidden = true;
      if (signIn) {
        signIn.hidden = false;
        signIn.disabled = services.mode === 'unavailable';
        signIn.textContent = services.preview
          ? 'Enter local preview'
          : (services.mode === 'unavailable' ? 'Firebase setup required' : 'Sign in with Google');
      }
    }
  }

  function reportError(error, fallback) {
    console.error(fallback, error);
    const message = error?.message || fallback;
    if (typeof GD.toast === 'function') GD.toast(message, 'error');
  }

  function emit(state) {
    GD.authState = state;
    window.dispatchEvent(new CustomEvent('gd:auth-ready', {
      detail: {
        user: state.user,
        profile: state.profile,
        isAdmin: state.isAdmin,
        configured: state.configured
      }
    }));
    if (!initialResolved) {
      initialResolved = true;
      resolveInitial(state);
    }
  }

  async function bind() {
    const services = await GD.firebaseReady;
    updateNavigation(GD.authState, services);

    let signingIn = false;
    const signIn = async () => {
      if (signingIn) return;
      signingIn = true;
      const buttons = [
        document.getElementById('signInButton'),
        document.getElementById('progressSignInButton')
      ].filter(Boolean);
      buttons.forEach(btn => {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Connecting…';
      });
      try {
        await services.signIn();
      } catch (error) {
        reportError(error, 'Sign-in failed.');
        buttons.forEach(btn => {
          btn.disabled = services.mode === 'unavailable';
          btn.textContent = btn.dataset.originalText || 'Sign in with Google';
        });
        signingIn = false;
      }
    };

    document.getElementById('signInButton')?.addEventListener('click', signIn);
    document.getElementById('progressSignInButton')?.addEventListener('click', signIn);
    const signOut = async () => {
      try {
        await services.signOut();
      } catch (error) {
        reportError(error, 'Sign-out failed.');
      }
    };
    // The admin dashboard owns its sign-out button because it also redirects
    // and tears down dashboard state. Other pages use the shared handler.
    if (!document.getElementById('adminShell')) {
      document.getElementById('signOutButton')?.addEventListener('click', signOut);
    }
    document.getElementById('adminSignOut')?.addEventListener('click', signOut);

    services.onAuthChanged(async user => {
      const run = ++sequence;
      let profile = null;
      let isAdmin = false;
      if (user) {
        try {
          const token = await services.getTokenResult(user);
          const adminEmails = window.GD_ADMIN_EMAILS || [];
          isAdmin = token?.claims?.admin === true || adminEmails.includes(user.email);
          profile = await services.ensureProfile(user);
          // Attendance is a create-once record. A failure should not hide a
          // successfully authenticated account or its approval state.
          if (!isAdmin && profile?.approved) {
            services.markAttendance(user.uid).catch(error =>
              console.error('Daily attendance could not be recorded.', error)
            );
          }
        } catch (error) {
          reportError(error, 'Your student profile could not be loaded.');
          try { profile = await services.getProfile(user.uid); } catch (_) { /* keep null */ }
        }
      }
      if (run !== sequence) return;
      const state = {
        ready: true,
        user: user || null,
        profile,
        isAdmin,
        configured: services.configured
      };
      updateNavigation(state, services);
      emit(state);
    });
  }

  bind().catch(error => {
    reportError(error, 'Authentication could not be initialized.');
    const state = { ready: true, user: null, profile: null, isAdmin: false, configured: false };
    emit(state);
  });
})();
