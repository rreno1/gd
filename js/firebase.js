(function () {
  'use strict';

  const GD = window.GD = window.GD || {};
  const config = window.GD_FIREBASE_CONFIG || {};
  const configured = ['apiKey', 'projectId', 'appId'].every(key =>
    typeof config[key] === 'string' && config[key].trim()
  );
  const localPreview = location.protocol === 'file:' ||
    ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
  const SDK = 'https://www.gstatic.com/firebasejs/12.15.0';
  const PREVIEW_KEY = 'gd-preview-v1';

  function friendlyError(message, code) {
    const error = new Error(message);
    if (code) error.code = code;
    return error;
  }

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function toDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value.toDate === 'function') return value.toDate();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function publicRecord(snapshot) {
    return { id: snapshot.id, ...snapshot.data() };
  }

  function previewStorage() {
    if (!localPreview) return null;
    try {
      const parsed = JSON.parse(localStorage.getItem(PREVIEW_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      console.warn('GD preview data could not be read.', error);
      return {};
    }
  }

  function writePreview(data) {
    if (!localPreview) return;
    try {
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(data));
    } catch (error) {
      throw friendlyError('Preview progress could not be saved in this browser.', 'preview/storage-failed');
    }
  }

  function createUnavailableAdapter(initializationError) {
    const reason = initializationError
      ? 'Firebase could not start. Check the configuration and your connection.'
      : 'Firebase is not configured for this published site.';
    const fail = async () => { throw friendlyError(reason, 'gd/firebase-unavailable'); };
    return {
      configured,
      preview: false,
      mode: 'unavailable',
      initializationError: initializationError || null,
      todayKey,
      toDate,
      signIn: fail,
      signOut: async () => {},
      onAuthChanged(callback) {
        queueMicrotask(() => callback(null));
        return () => {};
      },
      getTokenResult: async () => ({ claims: {} }),
      getProfile: async () => null,
      ensureProfile: fail,
      markAttendance: fail,
      listModules: async () => [],
      listProgress: fail,
      listQuizResults: fail,
      getProgress: fail,
      getQuizResult: fail,
      saveProgress: fail,
      createQuizResult: fail,
      listUsers: fail,
      updateUser: fail,
      deleteUser: fail,
      listAllProgress: fail,
      listAllQuizResults: fail,
      listAllAttendance: fail,
      saveModule: fail,
      setAttendance: fail
    };
  }

  function createPreviewAdapter() {
    let state = previewStorage() || {};
    state.profiles = state.profiles || {};
    state.progress = state.progress || {};
    state.quizzes = state.quizzes || {};
    state.attendance = state.attendance || {};
    state.modules = state.modules || {};
    const listeners = new Set();
    let user = state.signedIn ? {
      uid: 'preview-student',
      email: 'student@preview.local',
      displayName: 'Preview Student',
      photoURL: null
    } : null;

    const notify = () => listeners.forEach(callback => queueMicrotask(() => callback(user)));
    const requireUser = uid => {
      if (!user || (uid && uid !== user.uid)) {
        throw friendlyError('Sign in to the local preview before saving progress.', 'auth/required');
      }
    };
    const persist = () => writePreview(state);
    const stamp = () => new Date().toISOString();

    return {
      configured: false,
      preview: true,
      mode: 'preview',
      initializationError: null,
      todayKey,
      toDate,
      async signIn() {
        user = {
          uid: 'preview-student',
          email: 'student@preview.local',
          displayName: 'Preview Student',
          photoURL: null
        };
        state.signedIn = true;
        persist();
        notify();
        return user;
      },
      async signOut() {
        user = null;
        state.signedIn = false;
        persist();
        notify();
      },
      onAuthChanged(callback) {
        listeners.add(callback);
        queueMicrotask(() => callback(user));
        return () => listeners.delete(callback);
      },
      getTokenResult: async () => ({ claims: { admin: false } }),
      async getProfile(uid) {
        requireUser(uid);
        return state.profiles[uid] || null;
      },
      async ensureProfile(currentUser) {
        requireUser(currentUser && currentUser.uid);
        const now = stamp();
        const existing = state.profiles[currentUser.uid];
        state.profiles[currentUser.uid] = existing ? {
          ...existing,
          displayName: currentUser.displayName || existing.displayName,
          photoURL: currentUser.photoURL || null,
          lastActiveAt: now
        } : {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Preview Student',
          photoURL: currentUser.photoURL || null,
          role: 'student',
          approved: true,
          batch: 'A',
          createdAt: now,
          lastActiveAt: now
        };
        persist();
        return state.profiles[currentUser.uid];
      },
      async markAttendance(uid, date = todayKey()) {
        requireUser(uid);
        state.attendance[uid] = state.attendance[uid] || {};
        if (!state.attendance[uid][date]) {
          state.attendance[uid][date] = { date, status: 'present', checkedInAt: stamp() };
          persist();
        }
        return state.attendance[uid][date];
      },
      async listModules() {
        return Object.values(state.modules);
      },
      async listProgress(uid) {
        requireUser(uid);
        return Object.values(state.progress[uid] || {});
      },
      async listQuizResults(uid) {
        requireUser(uid);
        return Object.values(state.quizzes[uid] || {});
      },
      async getProgress(uid, moduleId) {
        requireUser(uid);
        return state.progress[uid]?.[moduleId] || null;
      },
      async getQuizResult(uid, moduleId) {
        requireUser(uid);
        return state.quizzes[uid]?.[moduleId] || null;
      },
      async saveProgress(uid, moduleId, data) {
        requireUser(uid);
        const now = stamp();
        state.progress[uid] = state.progress[uid] || {};
        const existing = state.progress[uid][moduleId];
        const record = {
          moduleId,
          visitedSections: data.visitedSections,
          lastSection: data.lastSection,
          percent: data.percent,
          completed: data.completed,
          startedAt: existing?.startedAt || now,
          updatedAt: now,
          completedAt: data.completed ? (existing?.completedAt || now) : null
        };
        state.progress[uid][moduleId] = record;
        persist();
        return record;
      },
      async createQuizResult(uid, moduleId, data) {
        requireUser(uid);
        state.quizzes[uid] = state.quizzes[uid] || {};
        if (state.quizzes[uid][moduleId]) {
          throw friendlyError('This quiz has already been submitted. Each module allows one submission.', 'quiz/already-submitted');
        }
        const record = {
          moduleId,
          score: data.score,
          total: data.total,
          percentage: data.percentage,
          answers: data.answers,
          attempts: 1,
          submittedAt: stamp()
        };
        state.quizzes[uid][moduleId] = record;
        persist();
        return record;
      },
      async listUsers() { return Object.values(state.profiles); },
      async updateUser(uid, patch) {
        if (!state.profiles[uid]) throw friendlyError('Student profile not found.', 'profile/not-found');
        state.profiles[uid] = { ...state.profiles[uid], ...patch };
        persist();
        return state.profiles[uid];
      },
      async deleteUser(uid) {
        if (!state.profiles[uid]) throw friendlyError('Student profile not found.', 'profile/not-found');
        delete state.profiles[uid];
        delete state.progress[uid];
        delete state.quizzes[uid];
        delete state.attendance[uid];
        persist();
      },
      async listAllProgress() {
        return Object.entries(state.progress).flatMap(([uid, records]) =>
          Object.values(records).map(record => ({ uid, ...record }))
        );
      },
      async listAllQuizResults() {
        return Object.entries(state.quizzes).flatMap(([uid, records]) =>
          Object.values(records).map(record => ({ uid, ...record }))
        );
      },
      async listAllAttendance(date) {
        return Object.entries(state.attendance).flatMap(([uid, records]) =>
          Object.values(records)
            .filter(record => !date || record.date === date)
            .map(record => ({ uid, ...record }))
        );
      },
      async saveModule(module) {
        const record = { ...module, updatedAt: stamp(), updatedBy: 'preview-admin' };
        state.modules[module.id] = record;
        persist();
        return record;
      },
      async setAttendance(uid, date, value) {
        const input = typeof value === 'string' ? { status: value } : (value || {});
        state.attendance[uid] = state.attendance[uid] || {};
        const previous = state.attendance[uid][date];
        const status = input.status || 'present';
        const record = {
          date,
          status,
          checkedInAt: ['present', 'late'].includes(status)
            ? (previous?.checkedInAt || stamp())
            : null,
          ...(input.note ? { note: input.note } : {})
        };
        state.attendance[uid][date] = record;
        persist();
        return record;
      }
    };
  }

  async function createFirebaseAdapter() {
    const [appApi, authApi, dbApi] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`)
    ]);
    const app = appApi.initializeApp(config);
    const auth = authApi.getAuth(app);
    const db = dbApi.getFirestore(app);
    const provider = new authApi.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await authApi.setPersistence(auth, authApi.browserLocalPersistence);
      await authApi.getRedirectResult(auth);
    } catch (error) {
      console.error('Firebase redirect sign-in could not be completed.', error);
    }

    const documentData = async reference => {
      const snapshot = await dbApi.getDoc(reference);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    };
    const queryRecords = async reference => {
      const snapshot = await dbApi.getDocs(reference);
      return snapshot.docs.map(publicRecord);
    };
    const userDoc = uid => dbApi.doc(db, 'users', uid);
    const progressDoc = (uid, moduleId) => dbApi.doc(db, 'users', uid, 'progress', moduleId);
    const quizDoc = (uid, moduleId) => dbApi.doc(db, 'users', uid, 'quizResults', moduleId);

    const adapter = {
      configured: true,
      preview: false,
      mode: 'firebase',
      initializationError: null,
      todayKey,
      toDate,
      firebase: { app, auth, db, appApi, authApi, dbApi },
      async signIn() {
        try {
          return (await authApi.signInWithPopup(auth, provider)).user;
        } catch (error) {
          const cancellation = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(error.code);
          if (cancellation) throw friendlyError('Google sign-in was cancelled.', error.code);
          try {
            await authApi.signInWithRedirect(auth, provider);
            return null;
          } catch (redirectError) {
            console.error('Google sign-in failed.', redirectError);
            throw friendlyError('Google sign-in could not start. Check the authorized domain and try again.', redirectError.code || error.code);
          }
        }
      },
      signOut: () => authApi.signOut(auth),
      onAuthChanged: callback => authApi.onAuthStateChanged(auth, callback),
      getTokenResult: (currentUser, forceRefresh = false) => authApi.getIdTokenResult(currentUser, forceRefresh),
      getProfile: uid => documentData(userDoc(uid)),
      async ensureProfile(currentUser) {
        if (!currentUser) throw friendlyError('Sign in before creating a profile.', 'auth/required');
        const reference = userDoc(currentUser.uid);
        const snapshot = await dbApi.getDoc(reference);
        if (!snapshot.exists()) {
          const profile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || '',
            photoURL: currentUser.photoURL || null,
            role: 'student',
            approved: false,
            batch: '',
            createdAt: dbApi.serverTimestamp(),
            lastActiveAt: dbApi.serverTimestamp()
          };
          try {
            await dbApi.setDoc(reference, profile);
          } catch (error) {
            // A second open tab can win the create race. Re-read before failing.
            const raced = await dbApi.getDoc(reference);
            if (!raced.exists()) throw error;
          }
        } else {
          await dbApi.updateDoc(reference, {
            displayName: currentUser.displayName || snapshot.data().displayName || '',
            photoURL: currentUser.photoURL || null,
            lastActiveAt: dbApi.serverTimestamp()
          });
        }
        return documentData(reference);
      },
      async markAttendance(uid, date = todayKey()) {
        const reference = dbApi.doc(db, 'users', uid, 'attendance', date);
        const existing = await dbApi.getDoc(reference);
        if (existing.exists()) return { id: existing.id, ...existing.data() };
        try {
          await dbApi.setDoc(reference, {
            date,
            status: 'present',
            checkedInAt: dbApi.serverTimestamp()
          });
        } catch (error) {
          const raced = await dbApi.getDoc(reference);
          if (!raced.exists()) throw error;
        }
        return documentData(reference);
      },
      listModules: () => queryRecords(dbApi.collection(db, 'modules')),
      listProgress: uid => queryRecords(dbApi.collection(db, 'users', uid, 'progress')),
      listQuizResults: uid => queryRecords(dbApi.collection(db, 'users', uid, 'quizResults')),
      getProgress: (uid, moduleId) => documentData(progressDoc(uid, moduleId)),
      getQuizResult: (uid, moduleId) => documentData(quizDoc(uid, moduleId)),
      async saveProgress(uid, moduleId, data) {
        const reference = progressDoc(uid, moduleId);
        const snapshot = await dbApi.getDoc(reference);
        const now = dbApi.serverTimestamp();
        const record = {
          moduleId,
          visitedSections: data.visitedSections,
          lastSection: data.lastSection,
          percent: data.percent,
          completed: data.completed,
          startedAt: snapshot.exists() ? snapshot.data().startedAt : now,
          updatedAt: now,
          completedAt: data.completed
            ? (snapshot.exists() && snapshot.data().completedAt ? snapshot.data().completedAt : now)
            : null
        };
        await dbApi.setDoc(reference, record);
        return documentData(reference);
      },
      async createQuizResult(uid, moduleId, data) {
        const reference = quizDoc(uid, moduleId);
        if ((await dbApi.getDoc(reference)).exists()) {
          throw friendlyError('This quiz has already been submitted. Each module allows one submission.', 'quiz/already-submitted');
        }
        const record = {
          moduleId,
          score: data.score,
          total: data.total,
          percentage: data.percentage,
          answers: data.answers,
          attempts: 1,
          submittedAt: dbApi.serverTimestamp()
        };
        try {
          await dbApi.setDoc(reference, record);
        } catch (error) {
          if ((await dbApi.getDoc(reference)).exists()) {
            throw friendlyError('This quiz has already been submitted. Each module allows one submission.', 'quiz/already-submitted');
          }
          throw error;
        }
        return documentData(reference);
      },
      listUsers: () => queryRecords(dbApi.collection(db, 'users')),
      async updateUser(uid, patch) {
        await dbApi.updateDoc(userDoc(uid), patch);
        return documentData(userDoc(uid));
      },
      async deleteUser(uid) {
        await dbApi.deleteDoc(userDoc(uid));
      },
      async listAllProgress() {
        const snapshot = await dbApi.getDocs(dbApi.collectionGroup(db, 'progress'));
        return snapshot.docs.map(item => ({ uid: item.ref.parent.parent.id, id: item.id, ...item.data() }));
      },
      async listAllQuizResults() {
        const snapshot = await dbApi.getDocs(dbApi.collectionGroup(db, 'quizResults'));
        return snapshot.docs.map(item => ({ uid: item.ref.parent.parent.id, id: item.id, ...item.data() }));
      },
      async listAllAttendance(date) {
        const reference = dbApi.collectionGroup(db, 'attendance');
        const snapshot = await dbApi.getDocs(reference);
        const records = snapshot.docs.map(item => ({ uid: item.ref.parent.parent.id, id: item.id, ...item.data() }));
        return date ? records.filter(item => item.date === date) : records;
      },
      async saveModule(module) {
        const currentUser = auth.currentUser;
        if (!currentUser) throw friendlyError('Administrator sign-in is required.', 'auth/required');
        const record = {
          id: module.id,
          title: module.title,
          order: module.order,
          open: Boolean(module.open),
          availableBatches: Array.isArray(module.availableBatches) ? module.availableBatches : [],
          updatedAt: dbApi.serverTimestamp(),
          updatedBy: currentUser.uid
        };
        await dbApi.setDoc(dbApi.doc(db, 'modules', module.id), record);
        return documentData(dbApi.doc(db, 'modules', module.id));
      },
      async setAttendance(uid, date, value) {
        const input = typeof value === 'string' ? { status: value } : (value || {});
        const reference = dbApi.doc(db, 'users', uid, 'attendance', date);
        const snapshot = await dbApi.getDoc(reference);
        const status = input.status || 'present';
        const record = {
          date,
          status,
          checkedInAt: ['present', 'late'].includes(status)
            ? (snapshot.exists() && snapshot.data().checkedInAt ? snapshot.data().checkedInAt : dbApi.serverTimestamp())
            : null,
          ...(input.note ? { note: String(input.note).slice(0, 500) } : {})
        };
        await dbApi.setDoc(reference, record);
        return documentData(reference);
      }
    };

    // Preserve modular handles for carefully scoped administrative queries.
    GD.firebase = adapter.firebase;
    return adapter;
  }

  async function initialize() {
    let services;
    if (!configured) {
      services = localPreview ? createPreviewAdapter() : createUnavailableAdapter(null);
    } else {
      try {
        services = await createFirebaseAdapter();
      } catch (error) {
        console.error('Firebase initialization failed.', error);
        services = createUnavailableAdapter(error);
      }
    }
    GD.services = services;
    return services;
  }

  GD.firebaseReady = initialize();
})();
