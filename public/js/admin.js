(function () {
  'use strict';

  const PAGE_SIZE = 20;
  const BATCHES = ['A', 'B'];
  const ATTENDANCE_STATUSES = ['present', 'late', 'absent', 'excused'];
  const state = {
    preview: false,
    auth: null,
    users: [],
    modules: [],
    progress: [],
    results: [],
    attendance: [],
    todayAttendance: [],
    attendanceDate: '',
    today: localDateKey(new Date()),
    pages: { grades: 1, attendance: 1, accounts: 1 },
    demoAttendance: new Map(),
  };
  
  let resolveAuthReady;
  let bootstrapped = false;
  let dashboardOpen = false;
  let latestAuthDetail = null;
  const authReadyEvent = new Promise(resolve => { resolveAuthReady = resolve; });

  function captureAuth(event) {
    const detail = event?.detail || {};
    latestAuthDetail = detail;
    resolveAuthReady(detail);
    if (bootstrapped && !state.preview) handleLaterAuthChange(detail);
  }

  // Register immediately: auth.js may finish while Firebase's initialization
  // promise is still settling.
  document.addEventListener('gd:auth-ready', captureAuth);
  window.addEventListener('gd:auth-ready', captureAuth);

  function byId(id) {
    return document.getElementById(id);
  }

  function make(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = String(text);
    return item;
  }

  function appendText(parent, text) {
    parent.append(document.createTextNode(String(text)));
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function toDate(value) {
    if (!value) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value.toDate === 'function') return value.toDate();
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatDate(value, includeTime = false) {
    const date = toDate(value);
    if (!date) return '—';
    const options = includeTime
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : { dateStyle: 'medium' };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }

  function formatPercent(value) {
    const number = Number(value);
    return Number.isFinite(number) ? `${Math.round(number)}%` : '—';
  }

  function toast(message, type) {
    if (typeof window.GD?.toast === 'function') {
      window.GD.toast(message, type);
      return;
    }
    const region = byId('toastRegion');
    if (!region) return;
    const item = make('div', `toast toast-${type || 'info'}`, message);
    region.append(item);
    setTimeout(() => item.remove(), 4200);
  }

  function normalizedSearch(value) {
    return String(value || '').trim().toLocaleLowerCase();
  }

  function matchesUser(user, query) {
    if (!query) return true;
    return [user.displayName, user.email, user.batch, user.role]
      .some(value => normalizedSearch(value).includes(query));
  }

  function setGate(title, message, kind) {
    const gate = byId('adminGate');
    const content = make('div');
    const eyebrow = make('p', 'eyebrow', kind || 'Protected area');
    const heading = make('h1', '', title);
    const body = make('p', '', message);
    content.append(eyebrow, heading, body);
    gate?.replaceChildren(content);
    if (gate) gate.hidden = false;
    const shell = byId('adminShell');
    if (shell) shell.hidden = true;
    dashboardOpen = false;
  }

  function showDashboard() {
    const gate = byId('adminGate');
    const shell = byId('adminShell');
    if (gate) gate.hidden = true;
    if (shell) shell.hidden = false;
    dashboardOpen = true;
  }

  function existingAuthDetail() {
    const gd = window.GD || {};
    const candidates = [gd.authState, gd.auth?.state, gd.currentAuth, gd.services?.authState];
    return candidates.find(candidate => candidate && typeof candidate === 'object' &&
      (candidate.ready === true || !Object.prototype.hasOwnProperty.call(candidate, 'ready'))) || null;
  }

  async function waitForFirebaseReady() {
    while (!window.GD || !Object.prototype.hasOwnProperty.call(window.GD, 'firebaseReady')) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    return Promise.resolve(window.GD.firebaseReady);
  }

  async function waitForAuthReady() {
    if (latestAuthDetail) return latestAuthDetail;
    const existing = existingAuthDetail();
    if (existing) return existing;
    const ready = window.GD?.authReady;
    if (ready && typeof ready.then === 'function') {
      const result = await ready;
      return result || latestAuthDetail || existingAuthDetail() || {};
    }
    return authReadyEvent;
  }

  function firebaseConfigured() {
    const services = window.GD?.services;
    const firebase = window.GD?.firebase;
    if (typeof services?.configured === 'boolean') return services.configured;
    if (typeof firebase?.configured === 'boolean') return firebase.configured;
    const config = window.GD_FIREBASE_CONFIG || {};
    return Boolean(config.apiKey && config.projectId && config.appId);
  }

  async function handleLaterAuthChange(detail) {
    if (detail?.isAdmin !== true) {
      setGate(
        'Administrator access required',
        'This dashboard is available only when the signed-in Firebase ID token has the admin custom claim.',
        'Access denied',
      );
      return;
    }
    state.auth = detail;
    setAdminIdentity();
    if (!dashboardOpen) {
      showDashboard();
      await loadDashboard();
    }
  }

  function serviceMethod(name) {
    const services = window.GD?.services || {};
    for (const owner of [services.admin, services]) {
      if (owner && typeof owner[name] === 'function') return owner[name].bind(owner);
    }
    return null;
  }

  function firebasePart(name) {
    const firebase = window.GD?.firebase || {};
    const sources = [
      firebase,
      firebase.dbApi,
      firebase.authApi,
      firebase.appApi,
      firebase.api,
      firebase.firestoreApi,
      firebase.firestoreFns,
      window.GD?.firebaseModules,
    ];
    for (const source of sources) {
      if (source && source[name] !== undefined) return source[name];
    }
    return undefined;
  }

  function firestoreDb() {
    return firebasePart('db') || firebasePart('firestore');
  }

  function requireFirestoreParts(names) {
    const parts = {};
    names.forEach(name => { parts[name] = firebasePart(name); });
    if (!firestoreDb() || names.some(name => typeof parts[name] !== 'function')) {
      throw new Error('The Firebase service adapter does not expose the required administrative read/write helpers.');
    }
    return parts;
  }

  function snapshotRows(value) {
    const input = Array.isArray(value) ? value : (Array.isArray(value?.docs) ? value.docs : []);
    return input.map(item => {
      const fromFunction = typeof item?.data === 'function' ? item.data() : null;
      const fromProperty = item?.data && typeof item.data === 'object' ? item.data : null;
      const data = fromFunction || fromProperty || item || {};
      const uidFromPath = item?.ref?.parent?.parent?.id || item?.parent?.parent?.id;
      return {
        ...data,
        id: data.id || item?.id,
        uid: data.uid || data.userId || item?.uid || uidFromPath,
      };
    });
  }

  async function listUsers() {
    const method = serviceMethod('listUsers');
    if (method) return snapshotRows(await method());
    const { collection, getDocs } = requireFirestoreParts(['collection', 'getDocs']);
    return snapshotRows(await getDocs(collection(firestoreDb(), 'users')));
  }

  async function listModules() {
    const method = serviceMethod('listModules');
    if (method) return snapshotRows(await method());
    const { collection, getDocs } = requireFirestoreParts(['collection', 'getDocs']);
    return snapshotRows(await getDocs(collection(firestoreDb(), 'modules')));
  }

  async function listCollectionGroup(groupName, serviceName, argument) {
    const method = serviceMethod(serviceName);
    if (method) return snapshotRows(await method(argument));
    const { collectionGroup, getDocs } = requireFirestoreParts(['collectionGroup', 'getDocs']);
    return snapshotRows(await getDocs(collectionGroup(firestoreDb(), groupName)));
  }

  async function updateUser(uid, patch) {
    if (state.preview) {
      const user = state.users.find(item => item.uid === uid);
      if (!user) throw new Error('Account not found.');
      Object.assign(user, patch, { lastActiveAt: user.lastActiveAt });
      return;
    }
    const method = serviceMethod('updateUser');
    if (method) return method(uid, patch);
    const { doc, updateDoc } = requireFirestoreParts(['doc', 'updateDoc']);
    return updateDoc(doc(firestoreDb(), 'users', uid), patch);
  }

  async function saveModule(module) {
    if (state.preview) return;
    const record = {
      id: module.id,
      title: module.title,
      order: module.order,
      open: Boolean(module.open),
      availableBatches: [...module.availableBatches],
    };
    const method = serviceMethod('saveModule');
    if (method) return method(record);
    const { doc, setDoc, serverTimestamp } = requireFirestoreParts(['doc', 'setDoc', 'serverTimestamp']);
    return setDoc(doc(firestoreDb(), 'modules', module.id), {
      ...record,
      updatedAt: serverTimestamp(),
      updatedBy: state.auth?.user?.uid || '',
    });
  }

  async function saveAttendance(uid, date, status) {
    const record = { date, status };
    if (state.preview) return;
    const method = serviceMethod('setAttendance');
    if (method) return method(uid, date, record);
    const { doc, setDoc, serverTimestamp } = requireFirestoreParts(['doc', 'setDoc', 'serverTimestamp']);
    return setDoc(doc(firestoreDb(), 'users', uid, 'attendance', date), {
      ...record,
      checkedInAt: serverTimestamp(),
    }, { merge: true });
  }

  function courseModules() {
    return Array.isArray(window.GD?.course?.modules) ? window.GD.course.modules : [];
  }

  function mergeModules(records) {
    const remote = new Map(records.map(item => [item.id, item]));
    return courseModules().map((module, index) => {
      const saved = remote.get(module.id) || {};
      const savedBatches = Array.isArray(saved.availableBatches)
        ? saved.availableBatches.filter(batch => BATCHES.includes(batch))
        : [];
      return {
        ...module,
        order: Number.isFinite(Number(saved.order)) ? Number(saved.order) : index + 1,
        open: typeof saved.open === 'boolean' ? saved.open : module.number === 1,
        // Missing records use the same safe defaults as the student catalogue:
        // only Module 1 is open, with both batches selected.
        availableBatches: savedBatches.length ? savedBatches : [...BATCHES],
      };
    });
  }

  async function ensureModuleRecords(records) {
    const merged = mergeModules(records);
    const existingIds = new Set(records.map(record => record.id));
    const missing = merged.filter(module => !existingIds.has(module.id));
    if (missing.length) await Promise.all(missing.map(module => saveModule(module)));
    return merged;
  }

  function setLoadingStates() {
    replaceWithState(byId('modulePerformance'), 'Loading module performance…', 'loading');
    replaceWithState(byId('attentionList'), 'Loading action queue…', 'loading');
    replaceWithState(byId('moduleControls'), 'Loading module controls…', 'loading');
    tableState(byId('approvalBody'), 4, 'Loading pending accounts…', 'loading');
    tableState(byId('gradeBody'), Math.max(3, courseModules().length + 3), 'Loading gradebook…', 'loading');
    tableState(byId('attendanceBody'), 4, 'Loading attendance…', 'loading');
    tableState(byId('accountBody'), 6, 'Loading accounts…', 'loading');
  }

  function replaceWithState(container, message, kind) {
    if (!container) return;
    const item = make('div', `empty-state state-${kind || 'empty'}`, message);
    if (kind === 'loading') item.setAttribute('aria-busy', 'true');
    container.replaceChildren(item);
  }

  function tableState(body, columns, message, kind) {
    if (!body) return;
    const row = make('tr');
    const cell = make('td', `empty-state state-${kind || 'empty'}`, message);
    cell.colSpan = columns;
    if (kind === 'loading') cell.setAttribute('aria-busy', 'true');
    row.append(cell);
    body.replaceChildren(row);
  }

  function renderLoadError(error) {
    const message = error?.message || 'The dashboard data could not be loaded.';
    replaceWithState(byId('modulePerformance'), message, 'error');
    replaceWithState(byId('attentionList'), message, 'error');
    replaceWithState(byId('moduleControls'), message, 'error');
    tableState(byId('approvalBody'), 4, message, 'error');
    tableState(byId('gradeBody'), Math.max(3, courseModules().length + 3), message, 'error');
    tableState(byId('attendanceBody'), 4, message, 'error');
    tableState(byId('accountBody'), 6, message, 'error');
    toast(message, 'error');
  }

  function demoData() {
    const names = [
      'Alyssa Bautista', 'Marco Reyes', 'Janelle Santos', 'Paolo Mendoza',
      'Bea Villanueva', 'Luis Navarro', 'Camille Garcia', 'Rafael Cruz',
      'Sofia Ramos', 'Miguel Flores', 'Angela Castillo', 'Nico Fernandez',
      'Trisha Aquino', 'Gabriel Torres', 'Mia Santiago', 'Enzo Domingo',
      'Katrina Lim', 'Andre Mercado', 'Isabel Dela Cruz', 'Joshua Manalo',
      'Patricia Valdez', 'Diego Salazar', 'Nicole Pascual', 'Carlo Soriano',
      'Francesca David', 'Adrian Evangelista', 'Leah Gonzales', 'Joaquin Herrera',
      'Bianca Marquez', 'Sean Padilla', 'Chloe Rivera', 'Nathan Tan',
    ];
    const now = Date.now();
    const users = names.map((name, index) => {
      const emailName = name.toLocaleLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '');
      const approved = index < 28;
      return {
        uid: `demo-student-${String(index + 1).padStart(2, '0')}`,
        displayName: name,
        email: `${emailName}@students.mlg.edu.ph`,
        role: 'student',
        approved,
        batch: approved ? (index % 2 === 0 ? 'A' : 'B') : '',
        createdAt: new Date(now - (index + 3) * 86400000),
        lastActiveAt: approved ? new Date(now - (index % 8) * 3600000) : new Date(now - index * 7200000),
      };
    });
    const modules = courseModules().map((module, index) => ({
      ...module,
      order: index + 1,
      open: index < 5,
      availableBatches: index === 4 ? ['A'] : ['A', 'B'],
    }));
    const progress = [];
    const results = [];
    users.filter(user => user.approved).forEach((user, studentIndex) => {
      modules.forEach((module, moduleIndex) => {
        const percent = Math.max(0, Math.min(100, 108 - moduleIndex * 14 - (studentIndex % 6) * 7));
        if (moduleIndex <= (studentIndex % 7)) {
          progress.push({
            uid: user.uid,
            moduleId: module.id,
            percent,
            completed: percent === 100,
            updatedAt: new Date(now - (moduleIndex + studentIndex % 5) * 86400000),
          });
        }
        if (moduleIndex < 3 + (studentIndex % 5) && moduleIndex < modules.length) {
          const percentage = Math.min(100, 58 + ((studentIndex * 9 + moduleIndex * 13) % 43));
          results.push({
            uid: user.uid,
            moduleId: module.id,
            score: Math.round(percentage * 15 / 100),
            total: 15,
            percentage,
            attempts: 1,
            submittedAt: new Date(now - (studentIndex % 12 + moduleIndex) * 86400000),
          });
        }
      });
    });
    return { users, modules, progress, results };
  }

  function demoAttendance(date) {
    if (state.demoAttendance.has(date)) return state.demoAttendance.get(date);
    const baseDate = new Date(`${date}T08:00:00`);
    const rows = state.users.filter(user => user.approved).map((user, index) => {
      let status = 'present';
      if (index % 13 === 0) status = 'absent';
      else if (index % 8 === 0) status = 'late';
      else if (index % 17 === 0) status = 'excused';
      const checkedInAt = ['present', 'late'].includes(status)
        ? new Date(baseDate.getTime() + (index % 7) * 7 * 60000)
        : null;
      return { uid: user.uid, id: date, date, status, checkedInAt };
    });
    state.demoAttendance.set(date, rows);
    return rows;
  }

  async function loadDashboard() {
    byId('adminMain')?.setAttribute('aria-busy', 'true');
    setLoadingStates();
    try {
      if (state.preview) {
        const demo = demoData();
        state.users = demo.users;
        state.modules = demo.modules;
        state.progress = demo.progress;
        state.results = demo.results;
        state.attendance = demoAttendance(state.attendanceDate);
      } else {
        const [users, modules, progress, results, attendance] = await Promise.all([
          listUsers(),
          listModules(),
          listCollectionGroup('progress', 'listAllProgress'),
          listCollectionGroup('quizResults', 'listAllQuizResults'),
          listCollectionGroup('attendance', 'listAllAttendance', state.attendanceDate),
        ]);
        state.users = users;
        state.modules = await ensureModuleRecords(modules);
        state.progress = progress;
        state.results = results;
        state.attendance = attendance.filter(item => !item.date || item.date === state.attendanceDate);
      }
      state.todayAttendance = state.attendanceDate === state.today ? state.attendance : [];
      renderAll();
    } catch (error) {
      console.error('Unable to load the admin dashboard.', error);
      renderLoadError(error);
    } finally {
      byId('adminMain')?.removeAttribute('aria-busy');
    }
  }

  function renderAll() {
    renderOverview();
    renderModules();
    renderApprovals();
    renderGradebook();
    renderAttendance();
    renderAccounts();
  }

  function students() {
    const currentAdminUid = state.auth?.user?.uid;
    return state.users.filter(user => user.role !== 'admin' && user.uid !== currentAdminUid);
  }

  function approvedStudents() {
    return students().filter(user => user.approved === true);
  }

  function pendingStudents() {
    return students().filter(user => user.approved !== true);
  }

  function renderOverview() {
    const studentRows = students();
    const approved = approvedStudents();
    const pending = pendingStudents();
    const approvedIds = new Set(approved.map(user => user.uid));
    const resultPercentages = state.results
      .filter(result => approvedIds.has(result.uid))
      .map(result => Number(result.percentage))
      .filter(Number.isFinite);
    const average = resultPercentages.length
      ? resultPercentages.reduce((sum, value) => sum + value, 0) / resultPercentages.length
      : null;
    const present = state.todayAttendance.filter(record => approvedIds.has(record.uid) && record.status === 'present').length;
    byId('statStudents').textContent = String(studentRows.length);
    byId('statApproved').textContent = `${approved.length} approved`;
    byId('statPending').textContent = String(pending.length);
    byId('statAverage').textContent = formatPercent(average);
    byId('statPresent').textContent = String(present);
    byId('statDate').textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(`${state.today}T12:00:00`));

    const performance = byId('modulePerformance');
    const performanceRows = state.modules.map(module => {
      const records = state.progress.filter(record => approvedIds.has(record.uid) && record.moduleId === module.id);
      const completed = records.filter(record => record.completed === true || Number(record.percent) >= 100).length;
      const percent = approved.length ? (completed / approved.length) * 100 : 0;
      const row = make('div', 'performance-row');
      row.append(make('strong', '', module.shortTitle || module.title));
      const bar = make('div', 'linear-progress');
      const fill = make('span');
      fill.style.setProperty('--value', `${Math.max(0, Math.min(100, percent))}%`);
      fill.style.setProperty('--item-accent', module.accent || 'var(--accent)');
      bar.append(fill);
      row.append(bar, make('span', '', formatPercent(percent)));
      return row;
    });
    performance.replaceChildren(...(performanceRows.length ? performanceRows : [make('div', 'empty-state', 'No modules are configured.') ]));

    const lowScores = state.results.filter(result => approvedIds.has(result.uid) && Number(result.percentage) < 60).length;
    const missingBatch = approved.filter(user => !BATCHES.includes(user.batch)).length;
    const attendanceByUid = new Map(state.todayAttendance.map(record => [record.uid, record]));
    const absent = approved.filter(user => (attendanceByUid.get(user.uid)?.status || 'absent') === 'absent').length;
    const items = [
      { count: pending.length, title: 'Pending approvals', detail: 'New accounts need review' },
      { count: missingBatch, title: 'Missing batch', detail: 'Approved students need a batch' },
      { count: lowScores, title: 'Scores below 60%', detail: 'Submitted quizzes to review' },
      { count: absent, title: 'Absent today', detail: 'Attendance records marked absent' },
    ].filter(item => item.count > 0);
    const attention = byId('attentionList');
    if (!items.length) {
      replaceWithState(attention, 'No urgent items. Everything looks up to date.', 'empty');
    } else {
      attention.replaceChildren(...items.map(item => {
        const row = make('div', 'activity-item');
        const detail = make('div');
        detail.append(make('strong', '', item.title), make('small', '', item.detail));
        row.append(make('span', '', item.count), detail);
        return row;
      }));
    }
    const badge = byId('approvalBadge');
    badge.textContent = String(pending.length);
    badge.hidden = pending.length === 0;
  }

  function renderModules() {
    const container = byId('moduleControls');
    if (!state.modules.length) {
      replaceWithState(container, 'No course modules are configured.', 'empty');
      return;
    }
    const cards = state.modules.map(module => {
      const card = make('article', 'module-control');
      card.style.setProperty('--module-accent', module.accent || 'var(--accent)');
      card.append(make('span', '', module.icon || String(module.order).padStart(2, '0')));
      const content = make('div');
      content.append(make('h2', '', module.title));
      const status = make('p', '', module.open ? 'Open' : 'Closed');
      const batches = make('div');
      batches.setAttribute('aria-label', `Available batches for ${module.title}`);
      appendText(batches, 'Available to ');
      BATCHES.forEach(batch => {
        const label = make('label');
        const checkbox = make('input');
        checkbox.type = 'checkbox';
        checkbox.style.minHeight = 'auto';
        checkbox.style.margin = '0 .25rem 0 .65rem';
        checkbox.style.padding = '0';
        checkbox.checked = module.availableBatches.includes(batch);
        checkbox.dataset.moduleBatch = batch;
        checkbox.addEventListener('change', async () => {
          const previous = [...module.availableBatches];
          const nextBatches = BATCHES.filter(value => {
            const input = batches.querySelector(`[data-module-batch="${value}"]`);
            return input?.checked;
          });
          if (!nextBatches.length) {
            checkbox.checked = true;
            toast('Keep at least one batch selected, or close the module for everyone.', 'error');
            return;
          }
          module.availableBatches = nextBatches;
          setModuleInputsDisabled(card, true);
          try {
            await saveModule(module);
            toast(`${module.shortTitle || module.title} batch access updated.`, 'success');
          } catch (error) {
            module.availableBatches = previous;
            BATCHES.forEach(value => {
              const input = batches.querySelector(`[data-module-batch="${value}"]`);
              if (input) input.checked = previous.includes(value);
            });
            toast(error?.message || 'Unable to update module batches.', 'error');
          } finally {
            setModuleInputsDisabled(card, false);
          }
        });
        label.append(checkbox, document.createTextNode(` Batch ${batch}`));
        batches.append(label);
      });
      content.append(status, batches);
      card.append(content);
      const toggle = make('button', 'switch');
      toggle.type = 'button';
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('aria-checked', String(module.open));
      toggle.setAttribute('aria-label', `${module.open ? 'Close' : 'Open'} ${module.title}`);
      toggle.addEventListener('click', async () => {
        const previous = module.open;
        module.open = !previous;
        toggle.setAttribute('aria-checked', String(module.open));
        toggle.setAttribute('aria-label', `${module.open ? 'Close' : 'Open'} ${module.title}`);
        status.textContent = module.open ? 'Open' : 'Closed';
        setModuleInputsDisabled(card, true);
        try {
          await saveModule(module);
          toast(`${module.shortTitle || module.title} is now ${module.open ? 'open' : 'closed'}.`, 'success');
        } catch (error) {
          module.open = previous;
          toggle.setAttribute('aria-checked', String(previous));
          toggle.setAttribute('aria-label', `${previous ? 'Close' : 'Open'} ${module.title}`);
          status.textContent = previous ? 'Open' : 'Closed';
          toast(error?.message || 'Unable to update module availability.', 'error');
        } finally {
          setModuleInputsDisabled(card, false);
        }
      });
      card.append(toggle);
      return card;
    });
    container.replaceChildren(...cards);
  }

  function setModuleInputsDisabled(card, disabled) {
    card.querySelectorAll('button, input').forEach(control => { control.disabled = disabled; });
  }

  function userCell(user) {
    const cell = make('td');
    cell.append(make('strong', '', user.displayName || 'Unnamed student'), make('small', '', user.email || 'No email'));
    return cell;
  }

  function batchSelect(user, defaultBatch, onChange) {
    const select = make('select');
    select.setAttribute('aria-label', `Batch for ${user.displayName || user.email || 'student'}`);
    const none = make('option', '', 'Unassigned');
    none.value = '';
    select.append(none);
    BATCHES.forEach(batch => {
      const option = make('option', '', `Batch ${batch}`);
      option.value = batch;
      select.append(option);
    });
    select.value = user.batch || defaultBatch || '';
    if (onChange) select.addEventListener('change', onChange);
    return select;
  }

  function renderApprovals() {
    const body = byId('approvalBody');
    const query = normalizedSearch(byId('approvalSearch')?.value);
    const pending = pendingStudents()
      .filter(user => matchesUser(user, query))
      .sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
    if (!pending.length) {
      tableState(body, 4, query ? 'No pending accounts match this filter.' : 'No accounts are waiting for approval.', 'empty');
      return;
    }
    body.replaceChildren(...pending.map(user => {
      const row = make('tr');
      const date = make('td', '', formatDate(user.createdAt));
      const batchCell = make('td');
      const select = batchSelect(user, 'A');
      batchCell.append(select);
      const action = make('td');
      const approve = make('button', 'button primary compact', 'Approve');
      approve.type = 'button';
      approve.addEventListener('click', async () => {
        if (!BATCHES.includes(select.value)) {
          toast('Choose Batch A or Batch B before approving this account.', 'error');
          select.focus();
          return;
        }
        approve.disabled = true;
        select.disabled = true;
        try {
          await updateUser(user.uid, { approved: true, batch: select.value });
          user.approved = true;
          user.batch = select.value;
          toast(`${user.displayName || user.email} approved for Batch ${select.value}.`, 'success');
          renderAll();
        } catch (error) {
          approve.disabled = false;
          select.disabled = false;
          toast(error?.message || 'Unable to approve this account.', 'error');
        }
      });
      action.append(approve);
      row.append(userCell(user), date, batchCell, action);
      return row;
    }));
  }

  function resultMap() {
    const map = new Map();
    state.results.forEach(result => {
      if (result.uid && result.moduleId) map.set(`${result.uid}:${result.moduleId}`, result);
    });
    return map;
  }

  function filteredGradeRows() {
    const query = normalizedSearch(byId('gradeSearch')?.value);
    const batch = byId('gradeBatch')?.value || '';
    const resultsByUser = new Set(state.results.map(result => result.uid));
    return approvedStudents()
      .filter(user => resultsByUser.has(user.uid))
      .filter(user => (!batch || user.batch === batch) && matchesUser(user, query))
      .sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')));
  }

  function renderGradebook() {
    const head = byId('gradeHead');
    const header = make('tr');
    ['Student', 'Batch'].forEach(label => header.append(make('th', '', label)));
    state.modules.forEach(module => header.append(make('th', '', module.shortTitle || module.title)));
    header.append(make('th', '', 'Average'));
    head.replaceChildren(header);

    const rows = filteredGradeRows();
    const pageRows = paged(rows, 'grades');
    const body = byId('gradeBody');
    if (!pageRows.length) {
      tableState(body, state.modules.length + 3, 'No submitted quiz results match this view.', 'empty');
    } else {
      const map = resultMap();
      body.replaceChildren(...pageRows.map(user => {
        const row = make('tr');
        row.append(userCell(user), make('td', '', user.batch ? `Batch ${user.batch}` : '—'));
        const percentages = [];
        state.modules.forEach(module => {
          const result = map.get(`${user.uid}:${module.id}`);
          if (Number.isFinite(Number(result?.percentage))) percentages.push(Number(result.percentage));
          const cell = make('td', '', result ? formatPercent(result.percentage) : '—');
          if (result) cell.title = `${result.score ?? '—'} / ${result.total ?? '—'}`;
          row.append(cell);
        });
        const average = percentages.length
          ? percentages.reduce((sum, value) => sum + value, 0) / percentages.length
          : null;
        row.append(make('td', '', formatPercent(average)));
        return row;
      }));
    }
    renderPagination(byId('gradePagination'), rows.length, 'grades', renderGradebook);
  }

  function attendanceMap() {
    const map = new Map();
    state.attendance.forEach(record => {
      if (record.uid && (!record.date || record.date === state.attendanceDate)) map.set(record.uid, record);
    });
    return map;
  }

  function attendanceRows() {
    const map = attendanceMap();
    return approvedStudents()
      .slice()
      .sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')))
      .map(user => ({ user, record: map.get(user.uid) || { uid: user.uid, date: state.attendanceDate, status: 'absent', checkedInAt: null } }));
  }

  function renderAttendance() {
    const rows = attendanceRows();
    const pageRows = paged(rows, 'attendance');
    const body = byId('attendanceBody');
    if (!pageRows.length) {
      tableState(body, 4, 'No approved students are available for attendance.', 'empty');
    } else {
      body.replaceChildren(...pageRows.map(({ user, record }) => {
        const row = make('tr');
        const statusCell = make('td');
        const select = make('select');
        select.setAttribute('aria-label', `Attendance status for ${user.displayName || user.email}`);
        ATTENDANCE_STATUSES.forEach(status => {
          const option = make('option', '', status[0].toUpperCase() + status.slice(1));
          option.value = status;
          select.append(option);
        });
        select.value = ATTENDANCE_STATUSES.includes(record.status) ? record.status : 'absent';
        select.addEventListener('change', async () => {
          const previous = record.status || 'absent';
          const next = select.value;
          select.disabled = true;
          try {
            await saveAttendance(user.uid, state.attendanceDate, next);
            record.status = next;
            record.checkedInAt = ['present', 'late'].includes(next)
              ? (record.checkedInAt || new Date())
              : null;
            const existing = state.attendance.find(item => item.uid === user.uid);
            if (!existing) state.attendance.push(record);
            if (state.attendanceDate === state.today) state.todayAttendance = state.attendance;
            toast(`${user.displayName || user.email} marked ${next}.`, 'success');
            renderOverview();
            renderAttendance();
          } catch (error) {
            select.value = previous;
            select.disabled = false;
            toast(error?.message || 'Unable to update attendance.', 'error');
          }
        });
        statusCell.append(select);
        row.append(
          userCell(user),
          make('td', '', user.batch ? `Batch ${user.batch}` : '—'),
          statusCell,
          make('td', '', formatDate(record.checkedInAt, true)),
        );
        return row;
      }));
    }
    renderPagination(byId('attendancePagination'), rows.length, 'attendance', renderAttendance);
  }

  function ensureAccountFilters() {
    const search = byId('accountSearch');
    const toolbar = search?.closest('.table-toolbar');
    if (!toolbar || byId('accountStatus')) return;
    const statusLabel = make('label', '', 'Status ');
    const status = make('select');
    status.id = 'accountStatus';
    [['', 'All statuses'], ['approved', 'Approved'], ['pending', 'Pending']].forEach(([value, label]) => {
      const option = make('option', '', label);
      option.value = value;
      status.append(option);
    });
    status.addEventListener('change', () => { state.pages.accounts = 1; renderAccounts(); });
    statusLabel.append(status);
    const batchLabel = make('label', '', 'Batch ');
    const batch = make('select');
    batch.id = 'accountBatch';
    [['', 'All batches'], ['A', 'Batch A'], ['B', 'Batch B'], ['unassigned', 'Unassigned']].forEach(([value, label]) => {
      const option = make('option', '', label);
      option.value = value;
      batch.append(option);
    });
    batch.addEventListener('change', () => { state.pages.accounts = 1; renderAccounts(); });
    batchLabel.append(batch);
    toolbar.append(statusLabel, batchLabel);
  }

  function filteredAccounts() {
    const query = normalizedSearch(byId('accountSearch')?.value);
    const status = byId('accountStatus')?.value || '';
    const batch = byId('accountBatch')?.value || '';
    return students()
      .filter(user => matchesUser(user, query))
      .filter(user => !status || (status === 'approved' ? user.approved === true : user.approved !== true))
      .filter(user => !batch || (batch === 'unassigned' ? !user.batch : user.batch === batch))
      .sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')));
  }

  function renderAccounts() {
    ensureAccountFilters();
    const rows = filteredAccounts();
    const pageRows = paged(rows, 'accounts');
    const body = byId('accountBody');
    if (!pageRows.length) {
      tableState(body, 6, 'No accounts match these filters.', 'empty');
    } else {
      body.replaceChildren(...pageRows.map(user => {
        const row = make('tr');
        const role = make('td', '', user.role || 'student');
        const statusCell = make('td');
        statusCell.append(make('span', `status-pill ${user.approved ? 'approved' : 'pending'}`, user.approved ? 'Approved' : 'Pending'));
        const batchCell = make('td');
        const select = batchSelect(user, '');
        select.addEventListener('change', async () => {
          const previous = user.batch || '';
          select.disabled = true;
          try {
            await updateUser(user.uid, { batch: select.value });
            user.batch = select.value;
            toast(`${user.displayName || user.email} moved to ${select.value ? `Batch ${select.value}` : 'unassigned'}.`, 'success');
            renderOverview();
            renderApprovals();
            renderGradebook();
            renderAttendance();
            renderAccounts();
          } catch (error) {
            select.value = previous;
            toast(error?.message || 'Unable to update the account batch.', 'error');
          } finally {
            select.disabled = false;
          }
        });
        batchCell.append(select);
        const actions = make('td');
        const approval = make('button', `button ${user.approved ? 'ghost' : 'primary'} compact`, user.approved ? 'Revoke' : 'Approve');
        approval.type = 'button';
        approval.addEventListener('click', async () => {
          const next = !user.approved;
          const chosenBatch = select.value;
          if (next && !BATCHES.includes(chosenBatch)) {
            toast('Assign Batch A or Batch B before approving this account.', 'error');
            select.focus();
            return;
          }
          approval.disabled = true;
          select.disabled = true;
          try {
            await updateUser(user.uid, { approved: next, batch: chosenBatch });
            user.approved = next;
            user.batch = chosenBatch;
            toast(`${user.displayName || user.email} access ${next ? 'approved' : 'revoked'}.`, 'success');
            renderAll();
          } catch (error) {
            approval.disabled = false;
            select.disabled = false;
            toast(error?.message || 'Unable to update account access.', 'error');
          }
        });
        actions.append(approval);
        row.append(
          userCell(user),
          role,
          statusCell,
          batchCell,
          make('td', '', formatDate(user.lastActiveAt, true)),
          actions,
        );
        return row;
      }));
    }
    renderPagination(byId('accountPagination'), rows.length, 'accounts', renderAccounts);
  }

  function paged(rows, key) {
    const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    state.pages[key] = Math.min(Math.max(1, state.pages[key] || 1), pages);
    const start = (state.pages[key] - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }

  function renderPagination(container, total, key, rerender) {
    if (!container) return;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const current = Math.min(state.pages[key], pages);
    const previous = make('button', '', '‹');
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Previous page');
    previous.disabled = current <= 1;
    previous.addEventListener('click', () => { state.pages[key] -= 1; rerender(); });
    const label = make('span', '', total ? `Page ${current} of ${pages} · ${total} records` : '0 records');
    const next = make('button', '', '›');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next page');
    next.disabled = current >= pages;
    next.addEventListener('click', () => { state.pages[key] += 1; rerender(); });
    container.replaceChildren(previous, label, next);
  }

  function csvCell(value) {
    let text = value === null || value === undefined ? '' : String(value);
    // Spreadsheet programs can execute formula-looking cells. Prefixing with an
    // apostrophe keeps exported remote profile text inert.
    if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportGrades() {
    const users = filteredGradeRows();
    const map = resultMap();
    const headings = ['Student', 'Email', 'Batch', ...state.modules.map(module => module.shortTitle || module.title), 'Average'];
    const rows = users.map(user => {
      const values = [];
      state.modules.forEach(module => {
        const result = map.get(`${user.uid}:${module.id}`);
        values.push(result && Number.isFinite(Number(result.percentage)) ? Number(result.percentage).toFixed(2) : '');
      });
      const present = values.map(Number).filter((value, index) => values[index] !== '' && Number.isFinite(value));
      const average = present.length ? (present.reduce((sum, value) => sum + value, 0) / present.length).toFixed(2) : '';
      return [user.displayName || '', user.email || '', user.batch || '', ...values, average];
    });
    const csv = [headings, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = make('a');
    link.href = url;
    link.download = `gd-101-gradebook-${state.today}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    toast(`Exported ${rows.length} gradebook rows.`, 'success');
  }

  async function changeAttendanceDate() {
    const input = byId('attendanceDate');
    if (!input?.value) return;
    state.attendanceDate = input.value;
    state.pages.attendance = 1;
    tableState(byId('attendanceBody'), 4, 'Loading attendance…', 'loading');
    byId('attendancePagination')?.replaceChildren();
    try {
      if (state.preview) {
        state.attendance = demoAttendance(state.attendanceDate);
      } else {
        const records = await listCollectionGroup('attendance', 'listAllAttendance', state.attendanceDate);
        state.attendance = records.filter(item => !item.date || item.date === state.attendanceDate);
      }
      if (state.attendanceDate === state.today) {
        state.todayAttendance = state.attendance;
        renderOverview();
      }
      renderAttendance();
    } catch (error) {
      tableState(byId('attendanceBody'), 4, error?.message || 'Unable to load attendance.', 'error');
      toast(error?.message || 'Unable to load attendance.', 'error');
    }
  }

  function setupTabs() {
    document.querySelectorAll('[data-admin-tab]').forEach(button => {
      button.addEventListener('click', () => {
        const name = button.dataset.adminTab;
        document.querySelectorAll('[data-admin-tab]').forEach(item => item.classList.toggle('active', item === button));
        document.querySelectorAll('[data-panel]').forEach(panel => {
          const active = panel.dataset.panel === name;
          panel.hidden = !active;
          panel.classList.toggle('active', active);
        });
        byId('adminNavigation')?.classList.remove('is-open');
        document.body.classList.remove('drawer-open');
        document.querySelector('[data-mobile-toggle]')?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function setupFilters() {
    byId('approvalSearch')?.addEventListener('input', renderApprovals);
    byId('gradeSearch')?.addEventListener('input', () => { state.pages.grades = 1; renderGradebook(); });
    byId('gradeBatch')?.addEventListener('change', () => { state.pages.grades = 1; renderGradebook(); });
    byId('accountSearch')?.addEventListener('input', () => { state.pages.accounts = 1; renderAccounts(); });
    byId('attendanceDate')?.addEventListener('change', changeAttendanceDate);
    byId('exportGrades')?.addEventListener('click', exportGrades);
  }

  function setAdminIdentity() {
    const user = state.auth?.user || {};
    byId('adminName').textContent = state.preview ? 'Admin Preview' : (user.displayName || 'Instructor');
    byId('adminEmail').textContent = state.preview ? 'In-memory demo data' : (user.email || '');
  }

  async function signOut() {
    if (state.preview) {
      window.location.assign('index.html');
      return;
    }
    const method = serviceMethod('signOut');
    try {
      if (method) await method();
      else {
        const auth = firebasePart('auth');
        const signOutMethod = firebasePart('signOut');
        if (!auth || typeof signOutMethod !== 'function') throw new Error('Sign-out is unavailable.');
        await signOutMethod(auth);
      }
      window.location.assign('index.html');
    } catch (error) {
      toast(error?.message || 'Unable to sign out.', 'error');
    }
  }

  function markPreview() {
    const badge = document.querySelector('.admin-badge');
    if (badge) badge.textContent = 'Preview';
    document.querySelectorAll('.live-status').forEach(status => {
      status.replaceChildren(make('span'), document.createTextNode('Preview data — no Firebase writes'));
    });
    document.title = `Preview — ${document.title}`;
  }

  async function bootstrap() {
    await waitForFirebaseReady();
    const authDetail = await waitForAuthReady();
    bootstrapped = true;
    state.attendanceDate = state.today;
    const attendanceDate = byId('attendanceDate');
    if (attendanceDate) attendanceDate.value = state.today;

    const configured = firebaseConfigured();
    const previewRequested = new URLSearchParams(window.location.search).get('preview') === 'admin';
    if (!configured) {
      if (!previewRequested) {
        setGate(
          'Firebase is not configured',
          'Connect this site to Firebase before using the instructor dashboard. A local, read-only-style demonstration is available only with ?preview=admin.',
          'Setup required',
        );
        return;
      }
      state.preview = true;
      state.auth = { user: { displayName: 'Admin Preview', email: '' }, isAdmin: false };
      markPreview();
    } else {
      // This value is produced by auth.js from the Firebase ID token custom
      // claim. A profile role or email address is deliberately never accepted.
      if (authDetail?.isAdmin !== true) {
        setGate(
          'Administrator access required',
          'This dashboard is available only when the signed-in Firebase ID token has the admin custom claim.',
          'Access denied',
        );
        return;
      }
      state.auth = authDetail;
    }

    setupTabs();
    setupFilters();
    ensureAccountFilters();
    byId('signOutButton')?.addEventListener('click', signOut);
    setAdminIdentity();
    showDashboard();
    await loadDashboard();
  }

  bootstrap().catch(error => {
    console.error('Unable to initialize the admin dashboard.', error);
    setGate(
      'Dashboard unavailable',
      error?.message || 'The dashboard could not be initialized.',
      'Error',
    );
  });
})();
