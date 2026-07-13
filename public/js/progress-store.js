(function () {
  'use strict';

  const GD = window.GD = window.GD || {};
  const progressQueues = new Map();

  function cleanModuleId(moduleId) {
    const value = String(moduleId || '').trim();
    if (!value || value.length > 100) throw new Error('A valid module ID is required.');
    return value;
  }

  async function currentIdentity(requireApproval = false) {
    const state = GD.authState?.ready ? GD.authState : await GD.authReady;
    if (!state?.user) throw new Error('Sign in to save and view your learning progress.');
    if (requireApproval && !state.isAdmin && !state.profile?.approved) {
      throw new Error('Your account is awaiting teacher approval.');
    }
    return state;
  }

  function sectionList(payload, previous) {
    const supplied = Array.isArray(payload.visitedSections)
      ? payload.visitedSections
      : (Array.isArray(payload.visited) ? payload.visited : []);
    const current = payload.lastSection ?? payload.sectionId ?? payload.currentSection;
    const values = [...(previous?.visitedSections || []), ...supplied];
    if (current !== undefined && current !== null) values.push(current);
    return [...new Set(values.map(value => String(value).trim()).filter(Boolean))]
      .map(value => value.slice(0, 100))
      .slice(0, 40);
  }

  function normalizedProgress(payload, previous) {
    const visitedSections = sectionList(payload, previous);
    const requested = Number(payload.percent ?? payload.percentage ?? previous?.percent ?? 0);
    const percent = Math.max(
      Number(previous?.percent) || 0,
      Math.min(100, Math.max(0, Number.isFinite(requested) ? requested : 0))
    );
    const completed = Boolean(previous?.completed || payload.completed || percent >= 100);
    const finalPercent = completed ? 100 : percent;
    const lastSection = String(
      payload.lastSection ?? payload.sectionId ?? payload.currentSection ??
      previous?.lastSection ?? visitedSections.at(-1) ?? ''
    ).slice(0, 100);
    return { visitedSections, lastSection, percent: finalPercent, completed };
  }

  function normalizedQuiz(data) {
    const answers = Array.isArray(data?.answers) ? data.answers.map(Number) : [];
    const total = Number.isInteger(Number(data?.total)) ? Number(data.total) : answers.length;
    const score = Number(data?.score);
    if (!Number.isInteger(total) || total <= 0 || answers.length !== total || answers.some(answer => !Number.isFinite(answer))) {
      throw new Error('Quiz answers are incomplete or invalid.');
    }
    if (!Number.isFinite(score) || score < 0 || score > total) throw new Error('Quiz score is invalid.');
    const calculated = (score / total) * 100;
    return {
      score,
      total,
      // Firestore Rules recompute this value from the authoritative answer
      // key, so callers cannot supply a forged percentage.
      percentage: calculated,
      answers
    };
  }

  async function loadProgress(moduleId) {
    const id = cleanModuleId(moduleId);
    const state = await currentIdentity(false);
    const services = await GD.firebaseReady;
    return services.getProgress(state.user.uid, id);
  }

  async function saveProgress(moduleId, payload = {}) {
    const id = cleanModuleId(moduleId);
    const previousTask = progressQueues.get(id) || Promise.resolve();
    const task = previousTask.catch(() => {}).then(async () => {
      const state = await currentIdentity(true);
      const services = await GD.firebaseReady;
      const previous = await services.getProgress(state.user.uid, id);
      return services.saveProgress(state.user.uid, id, normalizedProgress(payload, previous));
    });
    progressQueues.set(id, task);
    try {
      return await task;
    } finally {
      if (progressQueues.get(id) === task) progressQueues.delete(id);
    }
  }

  async function loadQuizResult(moduleId) {
    const id = cleanModuleId(moduleId);
    const state = await currentIdentity(false);
    const services = await GD.firebaseReady;
    return services.getQuizResult(state.user.uid, id);
  }

  async function saveQuizResult(moduleId, data) {
    const id = cleanModuleId(moduleId);
    const state = await currentIdentity(true);
    const services = await GD.firebaseReady;
    const existing = await services.getQuizResult(state.user.uid, id);
    if (existing) throw new Error('This quiz has already been submitted. Each module allows one submission.');
    return services.createQuizResult(state.user.uid, id, normalizedQuiz(data));
  }

  async function loadDashboard() {
    const state = await currentIdentity(false);
    const services = await GD.firebaseReady;
    const [progress, quizResults] = await Promise.all([
      services.listProgress(state.user.uid),
      services.listQuizResults(state.user.uid)
    ]);
    return { progress, quizResults };
  }

  GD.progressStore = {
    loadProgress,
    saveProgress,
    loadQuizResult,
    saveQuizResult,
    loadDashboard,
    // Small aliases keep older lesson prototypes compatible with the shared API.
    get: loadProgress,
    save: saveProgress,
    getProgress: loadProgress,
    getQuizResult: loadQuizResult,
    createQuizResult: saveQuizResult
  };
})();
