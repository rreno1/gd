(function () {
  'use strict';

  const state = {
    module: null,
    lesson: null,
    steps: [],
    index: 0,
    visited: new Set(),
    quizResult: null
  };

  const dom = {};

  function node(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  }

  function button(text, className = '') {
    const item = node('button', className, text);
    item.type = 'button';
    return item;
  }

  function getModuleId() {
    const id = new URLSearchParams(location.search).get('module') || '';
    return window.GD.course.modules.some(module => module.id === id) ? id : '';
  }

  function loadDataset(moduleId) {
    if (window.GDLessons[moduleId]) return Promise.resolve(window.GDLessons[moduleId]);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `data/lessons/${encodeURIComponent(moduleId)}.js`;
      script.onload = () => window.GDLessons[moduleId] ? resolve(window.GDLessons[moduleId]) : reject(new Error('Dataset did not register.'));
      script.onerror = () => reject(new Error('Dataset could not be loaded.'));
      document.head.append(script);
    });
  }

  async function lessonAccess(module) {
    const services = await window.GD.firebaseReady;
    // Local preview keeps every lesson inspectable. Live course gates
    // enforce the same approval/module rules as Home.
    if (!services.configured) return { allowed: true };
    const authState = window.GD.authState?.ready ? window.GD.authState : await window.GD.authReady;
    if (!authState.user) return { allowed: false, title: 'Sign in required', reason: 'Sign in with your approved student account before opening this lesson.' };
    if (authState.isAdmin) return { allowed: true };
    if (!authState.profile?.approved) return { allowed: false, title: 'Approval pending', reason: 'Your teacher needs to approve this account before lessons open.' };
    const savedModules = await services.listModules();
    const saved = savedModules.find(item => item.id === module.id) || {};
    const open = typeof saved.open === 'boolean' ? saved.open : module.number === 1;
    const batches = Array.isArray(saved.availableBatches) ? saved.availableBatches : (module.number === 1 ? ['A', 'B'] : []);
    if (!open) return { allowed: false, title: 'Module closed', reason: 'Your teacher has not opened this module yet.' };
    if (batches.length && !batches.includes(authState.profile.batch)) {
      return { allowed: false, title: 'Module not assigned', reason: 'This lesson is not assigned to your batch.' };
    }
    return { allowed: true };
  }

  function showLessonError(title, reason) {
    dom.error.hidden = false;
    const heading = dom.error.querySelector('h1');
    const copy = dom.error.querySelector('p');
    if (heading) heading.textContent = title;
    if (copy) copy.textContent = reason;
    window.GD?.hideLoader?.();
  }

  function buildSteps(lesson) {
    return [
      { id: 'welcome', type: 'cover', label: 'Welcome' },
      { id: 'objectives', type: 'objectives', label: 'Learning objectives' },
      ...lesson.sections.map(section => ({ ...section, type: 'section', label: section.title })),
      { id: 'activity', type: 'activity', label: 'Interactive activity' },
      { id: 'terms', type: 'terms', label: 'Key terminology' },
      { id: 'review', type: 'review', label: 'Review & misconceptions' },
      { id: 'quiz', type: 'quiz', label: 'Module quiz' },
      { id: 'summary', type: 'summary', label: 'Summary' }
    ];
  }

  function renderOutline() {
    dom.outlineList.replaceChildren();
    state.steps.forEach((step, index) => {
      const item = button('', 'outline-link');
      const number = node('span', '', String(index + 1).padStart(2, '0'));
      const label = node('span', '', step.label);
      item.append(number, label);
      item.dataset.step = index;
      item.setAttribute('aria-current', index === state.index ? 'step' : 'false');
      if (state.visited.has(step.id)) item.classList.add('visited');
      item.addEventListener('click', () => goTo(index));
      dom.outlineList.append(item);
    });
  }

  function headerBlock(eyebrow, title, description) {
    const header = node('header', 'lesson-section-header');
    header.append(node('p', 'eyebrow', eyebrow), node('h1', '', title));
    if (description) header.append(node('p', 'section-lede', description));
    return header;
  }

  function renderCover() {
    const wrap = node('section', 'lesson-cover');
    const copy = node('div', 'lesson-cover-copy');
    copy.append(node('p', 'eyebrow', `${state.module.number.toString().padStart(2, '0')} / Graphic Design Foundations`), node('h1', '', state.lesson.title), node('p', 'cover-kicker', state.lesson.kicker), node('p', 'section-lede', state.lesson.description));
    const meta = node('ul', 'lesson-meta');
    [['Duration', state.lesson.duration], ['Level', state.lesson.difficulty], ['Assessment', '15 questions']].forEach(([label, value]) => {
      const item = node('li'); item.append(node('span', '', label), node('strong', '', value)); meta.append(item);
    });
    copy.append(meta);
    const art = node('div', 'lesson-cover-art'); art.setAttribute('aria-hidden', 'true');
    const iconSpan = node('span');
    if (state.module.icon && state.module.icon.startsWith('<svg')) {
      iconSpan.innerHTML = state.module.icon;
    } else {
      iconSpan.textContent = state.module.icon;
    }
    art.append(iconSpan, node('strong', '', String(state.module.number).padStart(2, '0')));
    wrap.append(copy, art);
    return wrap;
  }

  function renderObjectives() {
    const wrap = node('section', 'lesson-section');
    wrap.append(headerBlock('What you will learn', 'Learning objectives', 'By the end of this module, you should be able to explain the concepts and apply them in a design decision.'));
    const list = node('ol', 'objective-list');
    state.lesson.objectives.forEach((objective, index) => {
      const item = node('li'); item.append(node('span', '', String(index + 1).padStart(2, '0')), node('p', '', objective)); list.append(item);
    });
    wrap.append(list);
    return wrap;
  }

  function renderSection(step) {
    const wrap = node('section', 'lesson-section');
    wrap.append(headerBlock(step.eyebrow, step.title));
    const columns = node('div', 'lesson-reading-grid');
    const prose = node('div', 'lesson-prose');
    step.body.forEach(paragraph => prose.append(node('p', '', paragraph)));

    // Important callout — renders after body paragraphs
    if (step.important) {
      const callout = node('aside', 'callout-important');
      callout.append(node('span', 'callout-icon', '⚠'), node('div'));
      callout.lastChild.append(node('strong', '', 'Important'), node('p', '', step.important));
      prose.append(callout);
    }

    // Detailed lecture notes — deeper exploration below the main prose
    if (Array.isArray(step.detailedNotes) && step.detailedNotes.length) {
      const notes = node('div', 'lecture-notes');
      notes.append(node('p', 'eyebrow', 'Lecture notes'));
      step.detailedNotes.forEach(paragraph => notes.append(node('p', '', paragraph)));
      prose.append(notes);
    }

    const aside = node('aside', 'key-points'); aside.append(node('p', 'eyebrow', 'Key points'));
    const list = node('ul'); step.keyPoints.forEach(point => list.append(node('li', '', point))); aside.append(list);

    // Pro Tip callout — inside the sidebar
    if (step.tip) {
      const tipBox = node('div', 'callout-tip');
      tipBox.append(node('span', 'callout-icon', '💡'), node('div'));
      tipBox.lastChild.append(node('strong', '', 'Pro Tip'), node('p', '', step.tip));
      aside.append(tipBox);
    }

    columns.append(prose, aside); wrap.append(columns);

    if (step.visual) {
      const visualBox = node('div', 'section-visual-box');
      if (window.GD && window.GD.visuals && window.GD.visuals.render) {
        try {
          const renderedVisual = window.GD.visuals.render(step.visual);
          if (renderedVisual) {
            visualBox.append(renderedVisual);
            wrap.append(visualBox);
          }
        } catch (err) {
          console.error("Error rendering visual:", err);
        }
      }
    }

    const example = node('div', 'lesson-example'); example.append(node('span', '', 'Example'), node('p', '', step.example)); wrap.append(example);

    // Inline knowledge check — formative, not graded
    if (step.check) {
      const check = node('div', 'knowledge-check');
      check.append(node('p', 'eyebrow', 'Check your understanding'));
      check.append(node('p', 'check-question', step.check.question));
      const options = node('div', 'check-options');
      step.check.options.forEach((option, optionIndex) => {
        const label = node('label', 'check-option');
        const input = document.createElement('input');
        input.type = 'radio'; input.name = `check-${step.id}`; input.value = optionIndex;
        label.append(input, node('span', 'option-letter', String.fromCharCode(65 + optionIndex)), node('span', '', option));
        options.append(label);
      });
      check.append(options);
      const feedback = node('div', 'check-feedback');
      const revealBtn = button('Check Answer', 'button secondary compact');
      revealBtn.addEventListener('click', () => {
        const selected = options.querySelector('input:checked');
        if (!selected) return;
        const correct = Number(selected.value) === step.check.answer;
        check.classList.add('revealed');
        feedback.replaceChildren();
        feedback.append(node('p', correct ? 'check-correct' : 'check-incorrect',
          correct ? '✓ Correct!' : '✗ Not quite.'));
        if (step.check.explanation) feedback.append(node('p', 'check-explanation', step.check.explanation));
        revealBtn.disabled = true;
        options.querySelectorAll('input').forEach(input => { input.disabled = true; });
        // Highlight correct option
        options.querySelectorAll('.check-option').forEach((label, index) => {
          if (index === step.check.answer) label.classList.add('is-correct');
          else if (label.querySelector('input:checked')) label.classList.add('is-wrong');
        });
      });
      check.append(revealBtn, feedback);
      wrap.append(check);
    }

    return wrap;
  }

  function renderActivity() {
    const wrap = node('section', 'lesson-section activity-section');
    wrap.append(window.GD.activities.render(state.lesson.activity));
    return wrap;
  }

  function renderTerms() {
    const wrap = node('section', 'lesson-section');
    wrap.append(headerBlock('Vocabulary', 'Key terminology', 'Use precise language to describe what you see and why a visual decision works.'));
    const list = node('dl', 'term-grid');
    state.lesson.terms.forEach(item => { const card = node('div'); card.append(node('dt', '', item.term), node('dd', '', item.definition)); list.append(card); });
    wrap.append(list); return wrap;
  }

  function renderReview() {
    const wrap = node('section', 'lesson-section');
    wrap.append(headerBlock('Check your understanding', 'Review & misconceptions', 'Open each prompt, explain it in your own words, then compare your reasoning with the answer.'));
    const subheading = node('h2', 'review-heading', 'Common misconceptions'); wrap.append(subheading);
    const myths = node('div', 'misconception-list');
    state.lesson.misconceptions.forEach(item => {
      const card = node('article');
      card.append(
        node('p', 'myth', item.claim || item.myth || ''),
        node('p', 'correction', item.correction || item.reality || '')
      );
      myths.append(card);
    });
    wrap.append(myths, node('h2', 'review-heading', 'Review prompts'));
    const review = node('div', 'review-list');
    state.lesson.review.forEach((item, index) => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const isObj = typeof item === 'object' && item !== null;
      const questionText = isObj ? item.question : item;
      const answerText = isObj ? item.answer : "Reflect on this prompt based on your readings. Think about how this concept applies to your design decisions, visual consistency, and user communication hierarchy.";
      summary.textContent = `${index + 1}. ${questionText}`;
      details.append(summary, node('p', '', answerText));
      review.append(details);
    });
    wrap.append(review); return wrap;
  }

  function renderQuiz() {
    const wrap = node('section', 'lesson-section quiz-section');
    wrap.append(headerBlock('Assessment', 'Module quiz', 'Answer every question, then submit once. Explanations appear after submission so you can learn from each decision.'));
    const region = node('div', 'quiz-region'); wrap.append(region);
    const store = window.GD.progressStore;
    Promise.resolve(store?.loadQuizResult?.(state.module.id)).then(existing => {
      state.quizResult = existing || null;
      if (existing) renderQuizResult(region, existing);
      else renderQuizForm(region);
    }).catch(() => renderQuizForm(region));
    return wrap;
  }

  function renderQuizForm(region) {
    const form = document.createElement('form'); form.className = 'quiz-form';
    state.lesson.quiz.forEach((question, index) => {
      const fieldset = document.createElement('fieldset'); fieldset.className = 'quiz-question';
      const legend = document.createElement('legend'); legend.append(node('span', '', `${index + 1} / ${state.lesson.quiz.length}`), document.createTextNode(question.question)); fieldset.append(legend);
      const options = node('div', 'quiz-options');
      question.options.forEach((option, optionIndex) => {
        const label = node('label', 'quiz-option'); const input = document.createElement('input'); input.type = 'radio'; input.name = `question-${index}`; input.value = optionIndex; input.required = true;
        label.append(input, node('span', 'option-letter', String.fromCharCode(65 + optionIndex)), node('span', '', option)); options.append(label);
      });
      fieldset.append(options); form.append(fieldset);
    });
    const submitRow = node('div', 'quiz-submit'); const submit = button('Submit assessment', 'button primary'); submit.type = 'submit'; submitRow.append(node('p', '', 'Your first submission is final unless an instructor resets it.'), submit); form.append(submitRow);
    let submitting = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting) return;
      const data = new FormData(form);
      const answers = state.lesson.quiz.map((_, index) => Number(data.get(`question-${index}`)));
      if (answers.some(Number.isNaN)) { window.GD.toast('Answer every question before submitting.', 'error'); return; }
      submitting = true;
      submit.disabled = true; submit.textContent = 'Saving…';
      const score = answers.reduce((total, answer, index) => total + (answer === state.lesson.quiz[index].answer ? 1 : 0), 0);
      const result = { score, total: state.lesson.quiz.length, percentage: Math.round(score / state.lesson.quiz.length * 100), answers, submittedAt: new Date().toISOString(), attempts: 1 };
      try {
        const saved = await window.GD.progressStore?.saveQuizResult?.(state.module.id, result);
        state.quizResult = saved || result; region.replaceChildren(); renderQuizResult(region, state.quizResult); await recordProgress();
      } catch (error) {
        submitting = false;
        submit.disabled = false; submit.textContent = 'Submit assessment'; window.GD.toast(error.message || 'The quiz could not be saved.', 'error');
      }
    });
    region.replaceChildren(form);
  }

  function renderQuizResult(region, result) {
    region.replaceChildren();
    const score = Number(result.score || 0); const total = Number(result.total || state.lesson.quiz.length); const percent = Number(result.percentage ?? (score / total * 100));
    const summary = node('div', 'quiz-score'); summary.append(node('span', '', percent >= 80 ? 'Assessment complete' : 'Assessment submitted'), node('strong', '', `${score} / ${total}`), node('p', '', `${Math.round(percent)}% · ${percent >= 80 ? 'Strong understanding. Review the explanations to consolidate it.' : 'Review the explanations and revisit the sections that need attention.'}`)); region.append(summary);
    const feedback = node('div', 'quiz-feedback');
    state.lesson.quiz.forEach((question, index) => {
      const answer = Array.isArray(result.answers) ? Number(result.answers[index]) : null; const correct = answer === question.answer;
      const card = node('article', `feedback-card ${correct ? 'correct' : 'incorrect'}`);
      card.append(node('h2', '', `${index + 1}. ${question.question}`), node('p', 'feedback-answer', correct ? `Correct: ${question.options[question.answer]}` : `Correct answer: ${question.options[question.answer]}`), node('p', '', question.explanation)); feedback.append(card);
    });
    region.append(feedback);
  }

  function renderSummary() {
    const wrap = node('section', 'lesson-section summary-section');
    wrap.append(headerBlock('Module complete', 'What to carry forward', 'Strong designers connect concepts across modules and test choices in the context where people will use them.'));
    const grid = node('div', 'summary-grid'); const takeaways = node('div'); takeaways.append(node('h2', '', 'Key takeaways'));
    const list = node('ul'); state.lesson.summary.takeaways.forEach(item => list.append(node('li', '', item))); takeaways.append(list);
    const next = node('div', 'next-step-card'); next.append(node('p', 'eyebrow', 'Continue the pathway'), node('h2', '', 'Next step'), node('p', '', state.lesson.summary.nextSteps));
    const nextModule = window.GD.course.modules[state.module.number];
    const link = document.createElement('a'); link.className = 'button primary'; link.href = nextModule ? `lesson.html?module=${encodeURIComponent(nextModule.id)}` : 'progress.html'; link.textContent = nextModule ? `Continue to ${nextModule.shortTitle}` : 'View my progress'; next.append(link);
    grid.append(takeaways, next); wrap.append(grid); return wrap;
  }

  function renderStep() {
    const step = state.steps[state.index];
    let content;
    if (step.type === 'cover') content = renderCover();
    else if (step.type === 'objectives') content = renderObjectives();
    else if (step.type === 'section') content = renderSection(step);
    else if (step.type === 'activity') content = renderActivity();
    else if (step.type === 'terms') content = renderTerms();
    else if (step.type === 'review') content = renderReview();
    else if (step.type === 'quiz') content = renderQuiz();
    else content = renderSummary();

    dom.stage.replaceChildren(content);
    state.visited.add(step.id);
    const progress = Math.round((state.index + 1) / state.steps.length * 100);
    dom.position.textContent = `Section ${state.index + 1} of ${state.steps.length}`;
    dom.controlPosition.textContent = `${state.index + 1} / ${state.steps.length}`;
    dom.miniProgress.style.width = `${progress}%`;
    dom.previous.disabled = state.index === 0;
    dom.next.disabled = state.index === state.steps.length - 1;
    document.title = `${step.label} — ${state.lesson.title}`;
    history.replaceState(null, '', `?module=${encodeURIComponent(state.module.id)}&section=${encodeURIComponent(step.id)}`);
    renderOutline();
    dom.content.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    recordProgress();
  }

  let lastSavedPayload = null;
  let savingProgress = false;
  let pendingSavePayload = null;

  async function recordProgress() {
    if (!window.GD.progressStore?.saveProgress) return;
    const total = state.steps.length;
    const completed = state.steps.every(step => state.visited.has(step.id)) && !!state.quizResult;
    const payload = {
      visitedSections: [...state.visited],
      lastSection: state.steps[state.index].id,
      percent: completed ? 100 : Math.min(99, Math.round(state.visited.size / total * 100)),
      completed
    };
    const payloadJson = JSON.stringify(payload);
    if (lastSavedPayload === payloadJson) return;
    if (savingProgress) {
      pendingSavePayload = payload;
      return;
    }
    savingProgress = true;
    lastSavedPayload = payloadJson;
    try {
      await window.GD.progressStore.saveProgress(state.module.id, payload);
    } catch {
      lastSavedPayload = null;
    } finally {
      savingProgress = false;
      if (pendingSavePayload) {
        const nextPayload = pendingSavePayload;
        pendingSavePayload = null;
        recordProgress();
      }
    }
  }

  function goTo(index) {
    const next = Math.max(0, Math.min(state.steps.length - 1, Number(index)));
    if (next === state.index) return;
    state.index = next; renderStep(); dom.content.focus({ preventScroll: true }); closeOutline();
  }

  function openOutline() { dom.outline.classList.add('is-open'); dom.outlineToggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('outline-open'); dom.outline.querySelector('button')?.focus(); }
  function closeOutline(restoreFocus = false) {
    const wasOpen = dom.outline.classList.contains('is-open');
    dom.outline.classList.remove('is-open');
    dom.outlineToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('outline-open');
    if (restoreFocus && wasOpen) dom.outlineToggle.focus();
  }

  async function init() {
    Object.assign(dom, {
      error: document.getElementById('lessonError'), layout: document.getElementById('lessonLayout'), stage: document.getElementById('lessonStage'), content: document.getElementById('lessonContent'),
      navTitle: document.getElementById('lessonNavTitle'), position: document.getElementById('lessonPosition'), controlPosition: document.getElementById('controlPosition'), miniProgress: document.getElementById('miniProgressBar'), previous: document.getElementById('previousSection'), next: document.getElementById('nextSection'),
      outline: document.getElementById('lessonOutline'), outlineList: document.getElementById('outlineList'), outlineTitle: document.getElementById('outlineTitle'), outlineToggle: document.getElementById('outlineToggle'), outlineClose: document.getElementById('outlineClose'), outlineOverlay: document.getElementById('outlineOverlay')
    });
    const moduleId = getModuleId();
    if (!moduleId) { showLessonError('Lesson not found', 'Choose one of the seven course modules from the home page.'); return; }
    try {
      state.module = window.GD.course.modules.find(module => module.id === moduleId);
      const access = await lessonAccess(state.module);
      if (!access.allowed) { showLessonError(access.title, access.reason); return; }
      state.lesson = await loadDataset(moduleId);
      state.steps = buildSteps(state.lesson);
      const requested = new URLSearchParams(location.search).get('section');
      state.index = Math.max(0, state.steps.findIndex(step => step.id === requested));
      const saved = await window.GD.progressStore?.loadProgress?.(moduleId).catch?.(() => null);
      const validStepIds = new Set(state.steps.map(step => step.id));
      (saved?.visitedSections || []).filter(id => validStepIds.has(id)).forEach(id => state.visited.add(id));
      state.quizResult = await window.GD.progressStore?.loadQuizResult?.(moduleId).catch?.(() => null) || null;
      document.documentElement.style.setProperty('--accent', state.lesson.accent || state.module.accent);
      dom.navTitle.textContent = state.lesson.title; dom.outlineTitle.textContent = state.lesson.title;
      dom.layout.hidden = false;
      renderStep();
      window.GD?.hideLoader?.();
      dom.previous.addEventListener('click', () => goTo(state.index - 1)); dom.next.addEventListener('click', () => goTo(state.index + 1));
      dom.outlineToggle.addEventListener('click', openOutline); dom.outlineClose.addEventListener('click', () => closeOutline(true)); dom.outlineOverlay.addEventListener('click', () => closeOutline(true));
      document.addEventListener('keydown', event => {
        if (event.key === 'Tab' && dom.outline.classList.contains('is-open')) {
          const focusable = [...dom.outline.querySelectorAll('button:not(:disabled), a[href]')];
          const first = focusable[0]; const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          return;
        }
        const interactive = event.target.closest?.('button, a, input, select, textarea, summary, [contenteditable="true"]');
        if (event.key === 'Escape') closeOutline(true);
        if (interactive || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowLeft') goTo(state.index - 1);
        if (event.key === 'ArrowRight') goTo(state.index + 1);
      });
    } catch (error) {
      console.error(error); showLessonError('Lesson unavailable', 'The lesson could not be prepared. Check your connection and try again.');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
