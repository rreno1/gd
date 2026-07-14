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

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
  }

  function dateOf(value, services) {
    return services.toDate(value);
  }

  function formatDate(value, services, includeTime = false) {
    const date = dateOf(value, services);
    if (!date) return '—';
    return new Intl.DateTimeFormat(undefined, includeTime
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : { dateStyle: 'medium' }
    ).format(date);
  }

  function latestTimestamp(records, fields, services) {
    return records.reduce((latest, record) => {
      for (const field of fields) {
        const date = dateOf(record[field], services);
        if (date && (!latest || date > latest)) latest = date;
      }
      return latest;
    }, null);
  }

  function showState(name) {
    const loading = document.getElementById('progressLoading');
    const signedOut = document.getElementById('progressSignedOut');
    const approval = document.getElementById('approvalNotice');
    const content = document.getElementById('progressContent');
    if (loading) loading.hidden = name !== 'loading';
    if (signedOut) signedOut.hidden = name !== 'signedOut';
    if (approval) approval.hidden = name !== 'approval';
    if (content) content.hidden = name !== 'content';
  }

  function renderModuleProgress(modules, progressById, moduleSettings, authState) {
    const list = document.getElementById('progressList');
    if (!list) return;
    const fragment = document.createDocumentFragment();
    modules.forEach(module => {
      const record = progressById.get(module.id);
      const percent = Math.max(0, Math.min(100, Number(record?.percent) || 0));
      const item = node('article', 'progress-item');
      item.style.setProperty('--item-accent', module.accent || 'var(--accent)');

      const copy = node('div');
      copy.append(node('h3', '', module.title), node('small', '',
        record?.completed ? 'Completed' : (percent ? 'In progress' : 'Not started')
      ));

      const track = node('div', 'linear-progress');
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-label', `${module.title} progress`);
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', '100');
      track.setAttribute('aria-valuenow', String(Math.round(percent)));
      const fill = node('span');
      fill.style.setProperty('--value', `${percent}%`);
      track.append(fill);

      const saved = moduleSettings.get(module.id) || {};
      const isOpen = authState.isAdmin || (typeof saved.open === 'boolean' ? saved.open : module.number === 1);
      const batches = Array.isArray(saved.availableBatches) ? saved.availableBatches : (module.number === 1 ? ['A', 'B'] : []);
      const assigned = authState.isAdmin || !batches.length || batches.includes(authState.profile?.batch);
      const available = authState.configured === false || (isOpen && assigned);
      const link = node(available ? 'a' : 'span', `button secondary compact${available ? '' : ' disabled'}`, available ? (percent ? 'Continue' : 'Start') : (isOpen ? 'Not assigned' : 'Closed'));
      if (available) {
        link.href = `lesson.html?module=${encodeURIComponent(module.id)}`;
        link.setAttribute('aria-label', `${percent ? 'Continue' : 'Start'} ${module.title}`);
      } else {
        link.setAttribute('aria-disabled', 'true');
      }
      item.append(copy, track, link);
      fragment.append(item);
    });
    list.replaceChildren(fragment);
  }

  function renderActivities(modulesById, progress, quizzes, services) {
    const list = document.getElementById('activityList');
    if (!list) return;
    const activities = [];
    progress.forEach(record => {
      if (!record.updatedAt) return;
      activities.push({
        date: dateOf(record.updatedAt, services),
        icon: record.completed ? '✓' : '→',
        title: record.completed ? 'Module completed' : 'Lesson progress saved',
        detail: modulesById.get(record.moduleId)?.title || record.moduleId
      });
    });
    quizzes.forEach(record => {
      activities.push({
        date: dateOf(record.submittedAt, services),
        icon: 'Q',
        title: `Quiz submitted · ${Math.round(Number(record.percentage) || 0)}%`,
        detail: modulesById.get(record.moduleId)?.title || record.moduleId
      });
    });
    activities.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
    if (!activities.length) {
      list.replaceChildren(node('p', 'empty-state', 'Your recent lesson and quiz activity will appear here.'));
      return;
    }
    const fragment = document.createDocumentFragment();
    activities.slice(0, 8).forEach(activity => {
      const item = node('div', 'activity-item');
      const icon = node('span', '', activity.icon);
      icon.setAttribute('aria-hidden', 'true');
      const copy = node('div');
      copy.append(node('strong', '', activity.title), node('small', '',
        `${activity.detail} · ${formatDate(activity.date, services, true)}`
      ));
      item.append(icon, copy);
      fragment.append(item);
    });
    list.replaceChildren(fragment);
  }

  function renderResults(modules, quizzes, services) {
    const body = document.getElementById('resultsBody');
    if (!body) return;
    const moduleOrder = new Map(modules.map(module => [module.id, module.number]));
    const modulesById = new Map(modules.map(module => [module.id, module]));
    const sorted = [...quizzes].sort((a, b) =>
      (moduleOrder.get(a.moduleId) || 999) - (moduleOrder.get(b.moduleId) || 999)
    );
    if (!sorted.length) {
      const row = node('tr');
      const cell = node('td', 'empty-state', 'No quizzes submitted yet. Your first result will appear here.');
      cell.colSpan = 4;
      row.append(cell);
      body.replaceChildren(row);
      return;
    }
    const fragment = document.createDocumentFragment();
    sorted.forEach(result => {
      const row = node('tr');
      const title = modulesById.get(result.moduleId)?.title || result.moduleId;
      const moduleCell = node('td');
      moduleCell.append(node('strong', '', title));
      row.append(
        moduleCell,
        node('td', '', `${result.score} / ${result.total}`),
        node('td', '', `${Math.round(Number(result.percentage) || 0)}%`),
        node('td', '', formatDate(result.submittedAt, services, true))
      );
      fragment.append(row);
    });
    body.replaceChildren(fragment);
  }

  function renderOverview(modules, progress, quizzes, services) {
    const progressById = new Map(progress.map(record => [record.moduleId || record.id, record]));
    const completed = modules.filter(module => progressById.get(module.id)?.completed).length;
    const active = modules.filter(module => {
      const record = progressById.get(module.id);
      return record && !record.completed && Number(record.percent) > 0;
    }).length;
    const sum = modules.reduce((total, module) =>
      total + Math.max(0, Math.min(100, Number(progressById.get(module.id)?.percent) || 0)), 0
    );
    const overall = modules.length ? Math.round(sum / modules.length) : 0;
    const average = quizzes.length
      ? Math.round(quizzes.reduce((total, item) => total + (Number(item.percentage) || 0), 0) / quizzes.length)
      : null;
    const latest = latestTimestamp([...progress, ...quizzes], ['updatedAt', 'submittedAt'], services);

    const ring = document.getElementById('overallRing');
    if (ring) {
      ring.style.setProperty('--progress', String(overall));
      ring.setAttribute('aria-label', `Overall progress: ${overall} percent`);
    }
    setText('overallPercent', `${overall}%`);
    setText('completedCount', completed);
    setText('activeCount', active);
    setText('quizAverage', average === null ? '—' : `${average}%`);
    setText('latestActivity', latest ? formatDate(latest, services) : '—');
    setText('overallSummary', completed === modules.length && modules.length
      ? 'You have completed every module in Graphic Design Foundations.'
      : completed
        ? `${completed} of ${modules.length} modules complete. Keep building on your progress.`
        : active
          ? `${active} module${active === 1 ? '' : 's'} in progress. Continue where you left off.`
          : 'Start a module to begin your learning record.'
    );
    return progressById;
  }

  async function render(state = GD.authState) {
    const run = ++renderSequence;
    const services = await GD.firebaseReady;
    if (!state?.ready) state = await GD.authReady;
    if (run !== renderSequence) return;
    if (!state.user) {
      showState('signedOut');
      return;
    }
    if (!state.isAdmin && !state.profile?.approved) {
      showState('approval');
      return;
    }
    showState('loading');
    try {
      const [progress, quizzes, moduleRecords] = await Promise.all([
        services.listProgress(state.user.uid),
        services.listQuizResults(state.user.uid),
        services.listModules()
      ]);
      if (run !== renderSequence) return;
      const modules = GD.course?.modules || [];
      const modulesById = new Map(modules.map(module => [module.id, module]));
      const progressById = renderOverview(modules, progress, quizzes, services);
      renderModuleProgress(modules, progressById, new Map(moduleRecords.map(record => [record.id, record])), state);
      renderActivities(modulesById, progress, quizzes, services);
      renderResults(modules, quizzes, services);
      showState('content');
    } catch (error) {
      console.error('Progress dashboard could not be loaded.', error);
      const panel = document.getElementById('progressLoading');
      if (panel) {
        panel.querySelector('.spinner')?.remove();
        const heading = panel.querySelector('h2');
        const copy = panel.querySelector('p');
        if (heading) heading.textContent = 'Progress unavailable';
        if (copy) copy.textContent = error?.message || 'Refresh the page to try again.';
        panel.setAttribute('role', 'alert');
      }
      showState('loading');
    }
  }

  window.addEventListener('gd:auth-ready', event => {
    render({ ready: true, ...event.detail }).catch(error => console.error(error));
  });
  render().catch(error => console.error('Progress page initialization failed.', error));
})();
