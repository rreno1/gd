(function () {
  'use strict';

  const GD = window.GD = window.GD || {};
  let renderSequence = 0;

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = String(text);
    return element;
  }

  function mergedModules(remoteModules) {
    const byId = new Map((remoteModules || []).map(module => [module.id, module]));
    return (GD.course?.modules || []).map(module => {
      const saved = byId.get(module.id) || {};
      return {
        ...module,
        ...saved,
        open: typeof saved.open === 'boolean' ? saved.open : module.number === 1,
        availableBatches: Array.isArray(saved.availableBatches)
          ? saved.availableBatches
          : (module.number === 1 ? ['A', 'B'] : []),
        // Static course metadata remains authoritative for card presentation.
        title: module.title,
        number: module.number,
        description: module.description,
        duration: module.duration,
        icon: module.icon,
        accent: module.accent
      };
    });
  }

  function accessFor(module, state, services, progress) {
    if (services.mode === 'unavailable') {
      return { allowed: false, status: 'Firebase setup required', reason: 'Firebase is not configured.' };
    }
    if (!state.user) {
      return { allowed: false, status: services.preview ? 'Enter preview' : 'Sign in to open', reason: 'Sign in is required.' };
    }
    if (state.isAdmin) {
      return { allowed: true, status: 'Admin preview', reason: '' };
    }
    if (!state.profile?.approved) {
      return { allowed: false, status: 'Approval pending', reason: 'Your student account is awaiting approval.' };
    }
    if (services.preview) {
      const percent = Math.max(0, Math.min(100, Number(progress?.percent) || 0));
      return { allowed: true, status: progress?.completed ? 'Completed' : (percent ? `Continue · ${Math.round(percent)}%` : 'Preview module'), reason: '' };
    }
    if (module.open === false) {
      return { allowed: false, status: 'Module closed', reason: 'Your teacher has not opened this module.' };
    }
    const batches = Array.isArray(module.availableBatches) ? module.availableBatches : [];
    if (batches.length && !batches.includes(state.profile.batch)) {
      const batch = state.profile.batch ? `Batch ${state.profile.batch}` : 'your batch';
      return { allowed: false, status: 'Not assigned', reason: `This module is not available to ${batch}.` };
    }
    const percent = Math.max(0, Math.min(100, Number(progress?.percent) || 0));
    return {
      allowed: true,
      status: progress?.completed ? 'Completed' : (percent ? `Continue · ${Math.round(percent)}%` : 'Start module'),
      reason: ''
    };
  }

  function makeCard(module, access) {
    const card = node(access.allowed ? 'a' : 'article', `module-card${access.allowed ? '' : ' locked'}`);
    card.style.setProperty('--module-accent', module.accent || 'var(--accent)');
    const titleId = `module-${module.id}-title`;
    const statusId = `module-${module.id}-status`;
    card.setAttribute('aria-labelledby', titleId);
    card.setAttribute('aria-describedby', statusId);
    if (access.allowed) {
      card.href = `lesson.html?module=${encodeURIComponent(module.id)}`;
    } else {
      card.setAttribute('aria-disabled', 'true');
      card.tabIndex = 0;
      card.title = access.reason;
    }

    const header = node('div', 'module-card-header');
    header.append(node('span', 'module-number', `Module ${String(module.number).padStart(2, '0')}`));
    const icon = node('span', 'module-icon', module.icon);
    icon.setAttribute('aria-hidden', 'true');
    header.append(icon);

    const body = node('div', 'module-card-body');
    const title = node('h3', '', module.title);
    title.id = titleId;
    body.append(title, node('p', '', module.description));

    const meta = node('div', 'module-meta');
    meta.append(node('span', '', `${module.duration} · ${module.lessonTotal} sections`));
    const status = node('span', `module-status${access.allowed ? '' : ' closed'}`, access.status);
    status.id = statusId;
    meta.append(status);
    card.append(header, body, meta);
    return card;
  }

  function updateAccessNote(state, services) {
    const note = document.getElementById('moduleAccessNote');
    if (!note) return;
    if (services.mode === 'unavailable') {
      note.textContent = 'Firebase configuration is required before accounts and course access can be used on this site.';
    } else if (!state.user) {
      note.textContent = services.preview
        ? 'Enter the local preview to test module access and browser-only progress.'
        : 'Sign in with an approved student account to open modules and save progress.';
    } else if (state.isAdmin) {
      note.textContent = 'Administrator preview is active. Module cards open for content review.';
    } else if (!state.profile?.approved) {
      note.textContent = 'Your profile is saved and awaiting teacher approval.';
    } else {
      note.textContent = `Approved${state.profile.batch ? ` · Batch ${state.profile.batch}` : ''}. Open modules save progress to your learning record.`;
    }
  }

  async function render() {
    const run = ++renderSequence;
    const grid = document.getElementById('moduleGrid');
    if (!grid) return;
    const [services, state] = await Promise.all([GD.firebaseReady, GD.authReady]);
    let remote = [];
    try {
      remote = await services.listModules();
    } catch (error) {
      console.error('Module availability could not be loaded.', error);
      if (typeof GD.toast === 'function') GD.toast('Live module availability could not be loaded.', 'error');
    }
    let progressRecords = [];
    if (state.user && (state.profile?.approved || state.isAdmin)) {
      try {
        progressRecords = await services.listProgress(state.user.uid);
      } catch (error) {
        console.error('Module progress could not be loaded.', error);
      }
    }
    if (run !== renderSequence) return;
    const progressById = new Map(progressRecords.map(record => [record.moduleId || record.id, record]));
    const fragment = document.createDocumentFragment();
    mergedModules(remote).forEach(module => {
      fragment.append(makeCard(module, accessFor(module, state, services, progressById.get(module.id))));
    });
    grid.replaceChildren(fragment);
    updateAccessNote(state, services);
  }

  render().catch(error => {
    console.error('The course catalogue could not be rendered.', error);
    const grid = document.getElementById('moduleGrid');
    if (grid) {
      const message = node('p', 'empty-state', 'The course catalogue could not be loaded. Refresh the page to try again.');
      message.setAttribute('role', 'alert');
      grid.replaceChildren(message);
    }
  });
  window.addEventListener('gd:auth-ready', () => {
    render().catch(error => console.error('The course catalogue could not be refreshed.', error));
  });
})();
