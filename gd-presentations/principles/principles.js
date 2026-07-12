/* app.js - 15 Principles of Design Slide Deck Engine & Interactive Widgets */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. PRESENTATION DECK ENGINE
  // ==========================================
  
  const slides = document.querySelectorAll('.slide');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const currentSlideNum = document.getElementById('current-slide-num');
  const totalSlideNum = document.getElementById('total-slide-num');
  const progressFill = document.getElementById('progress-fill');
  const btnOverview = document.getElementById('btn-overview');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const overviewModal = document.getElementById('overview-modal');
  const btnCloseOverview = document.getElementById('btn-close-overview');
  const overviewGrid = document.getElementById('overview-grid');
  
  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  totalSlideNum.textContent = totalSlides;

  // Build Overview Slide Grid
  function buildOverviewGrid() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide, idx) => {
      const titleEl = slide.querySelector('h2');
      const titleText = titleEl ? titleEl.textContent : (idx === 0 ? "Title Slide" : `Slide ${idx + 1}`);
      
      const card = document.createElement('div');
      card.className = `overview-card ${idx === currentSlideIndex ? 'active' : ''}`;
      card.innerHTML = `
        <span class="overview-card-num">Slide ${String(idx + 1).padStart(2, '0')}</span>
        <h4 class="overview-card-title">${titleText}</h4>
        <p class="overview-card-desc">Interactive details page</p>
      `;
      card.addEventListener('click', () => {
        goToSlide(idx);
        closeOverview();
      });
      overviewGrid.appendChild(card);
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Slide transition classes
    slides[currentSlideIndex].classList.remove('active');
    slides[currentSlideIndex].classList.remove('prev');
    
    for (let i = 0; i < totalSlides; i++) {
      if (i < index) {
        slides[i].classList.add('prev');
      } else {
        slides[i].classList.remove('prev');
      }
    }

    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');
    
    // Update labels & progress
    currentSlideNum.textContent = currentSlideIndex + 1;
    progressFill.style.width = `${(currentSlideIndex / (totalSlides - 1)) * 100}%`;
    
    // Boundary states
    btnPrev.disabled = currentSlideIndex === 0;
    btnNext.disabled = currentSlideIndex === totalSlides - 1;

    // Trigger custom redraw event
    document.dispatchEvent(new CustomEvent('slideChanged', { detail: { slideIndex: currentSlideIndex } }));
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // Key Bindings
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  
  document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
    
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key.toLowerCase() === 'o') {
      toggleOverview();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  // Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;
  const viewport = document.getElementById('slides-viewport');
  
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (Math.abs(touchStartX - touchEndX) > 60) {
      if (touchStartX > touchEndX) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Map Navigation click events (Slide 2 Map grid jumping)
  const mapItems = document.querySelectorAll('.map-item');
  mapItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetIndex = parseInt(item.getAttribute('data-goto'));
      goToSlide(targetIndex);
    });
  });

  // Overview toggles
  function toggleOverview() {
    if (overviewModal.classList.contains('hidden')) {
      buildOverviewGrid();
      overviewModal.classList.remove('hidden');
    } else {
      closeOverview();
    }
  }
  function closeOverview() {
    overviewModal.classList.add('hidden');
  }
  btnOverview.addEventListener('click', toggleOverview);
  btnCloseOverview.addEventListener('click', closeOverview);
  overviewModal.addEventListener('click', (e) => {
    if (e.target === overviewModal) closeOverview();
  });

  // Fullscreen support
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  }
  btnFullscreen.addEventListener('click', toggleFullscreen);

  // Initialize deck
  goToSlide(0);

  // ==========================================
  // 2. PRINCIPLES INTERACTIVE WIDGETS LOGIC
  // ==========================================

  // WIDGET 1: Balance Scale
  const balanceBeam = document.getElementById('balance-beam');
  const weightLeft = document.getElementById('weight-left');
  const weightRight = document.getElementById('weight-right');
  const btnBalanceSym = document.getElementById('btn-balance-sym');
  const btnBalanceAsym = document.getElementById('btn-balance-asym');

  btnBalanceSym.addEventListener('click', () => {
    balanceBeam.style.transform = 'rotate(0deg)';
    weightLeft.textContent = '60kg';
    weightLeft.style.transform = 'scale(1)';
    weightRight.textContent = '60kg';
    weightRight.style.transform = 'scale(1)';
    btnBalanceSym.classList.add('active');
    btnBalanceAsym.classList.remove('active');
  });

  btnBalanceAsym.addEventListener('click', () => {
    // Asymmetric balance weight: left heavier but pivot makes it look stable, 
    // or tilt beam slightly to represent asymmetry, or balance it using size variation.
    // Let's tilt it slightly (5deg) with heavy weight scale on left and light ball on right
    balanceBeam.style.transform = 'rotate(-6deg)';
    weightLeft.textContent = '100kg';
    weightLeft.style.transform = 'scale(1.4)';
    weightRight.textContent = '20kg';
    weightRight.style.transform = 'scale(0.7)';
    btnBalanceAsym.classList.add('active');
    btnBalanceSym.classList.remove('active');
  });

  // WIDGET 2: Contrast Slider
  const contrastSlider = document.getElementById('contrast-slider');
  const contrastBox = document.getElementById('contrast-box');
  const contrastText = document.getElementById('contrast-text');
  const contrastVal = document.getElementById('contrast-value');

  contrastSlider.addEventListener('input', () => {
    const val = parseInt(contrastSlider.value);
    if (val === 1) {
      contrastBox.style.backgroundColor = '#161929';
      contrastText.style.color = '#25293A';
      contrastVal.textContent = 'Low';
    } else if (val === 2) {
      contrastBox.style.backgroundColor = '#161929';
      contrastText.style.color = '#7F869A';
      contrastVal.textContent = 'Medium';
    } else if (val === 3) {
      contrastBox.style.backgroundColor = '#10B981'; // Emerald backdrop
      contrastText.style.color = '#0B0F17'; // Deep dark text
      contrastVal.textContent = 'High (Accessible)';
    }
  });

  // WIDGET 3: Alignment Grid Snap
  const btnToggleAlignment = document.getElementById('btn-toggle-alignment');
  const alignmentCanvas = document.querySelector('.alignment-demo-canvas');
  const alignAxisLine = document.getElementById('align-axis-line');

  btnToggleAlignment.addEventListener('click', () => {
    alignmentCanvas.classList.toggle('aligned');
    alignAxisLine.classList.toggle('hidden');
    btnToggleAlignment.classList.toggle('active');
  });

  // WIDGET 4: Hierarchy optimize
  const btnOptimizeHierarchy = document.getElementById('btn-optimize-hierarchy');
  const hierTitle = document.getElementById('hier-title');
  const hierSub = document.getElementById('hier-sub');
  const hierBody = document.getElementById('hier-body');

  btnOptimizeHierarchy.addEventListener('click', () => {
    btnOptimizeHierarchy.classList.toggle('active');
    if (btnOptimizeHierarchy.classList.contains('active')) {
      hierTitle.style.fontSize = '2.2rem';
      hierTitle.style.fontWeight = '800';
      hierTitle.style.color = 'var(--text-light)';
      
      hierSub.style.fontSize = '1.2rem';
      hierSub.style.fontWeight = '600';
      hierSub.style.color = 'var(--color-primary)';
      
      hierBody.style.fontSize = '0.85rem';
      hierBody.style.color = 'var(--text-muted)';
      btnOptimizeHierarchy.textContent = 'Reset Hierarchy';
    } else {
      hierTitle.style.fontSize = '1.25rem';
      hierTitle.style.fontWeight = '400';
      hierTitle.style.color = '';
      
      hierSub.style.fontSize = '1.1rem';
      hierSub.style.fontWeight = '';
      hierSub.style.color = 'var(--text-muted)';
      
      hierBody.style.fontSize = '0.95rem';
      hierBody.style.color = 'var(--text-muted)';
      btnOptimizeHierarchy.textContent = 'Optimize Hierarchy';
    }
  });

  // WIDGET 5: Repetition matrix
  const repetitionContainer = document.getElementById('repetition-container');
  const btnToggleRepetition = document.getElementById('btn-toggle-repetition');

  function renderRepetition(isConsistent) {
    repetitionContainer.innerHTML = '';
    const shapes = ['circle', 'square', 'triangle', 'badge', 'circle', 'square', 'triangle', 'badge'];
    const colors = ['#8B5CF6', '#10B981', '#EC4899', '#F59E0B', '#3B82F6', '#EF4444', '#06B6D4', '#A855F7'];

    for (let i = 0; i < 8; i++) {
      const card = document.createElement('div');
      card.className = 'rep-grid-card';
      
      const icon = document.createElement('span');
      icon.className = 'rep-icon';

      if (isConsistent) {
        card.style.borderColor = 'rgba(139, 92, 246, 0.3)';
        card.style.backgroundColor = 'rgba(139, 92, 246, 0.03)';
        icon.innerHTML = '✔';
        icon.style.color = 'var(--color-primary)';
      } else {
        card.style.borderColor = '';
        card.style.backgroundColor = '';
        icon.innerHTML = shapes[i] === 'circle' ? '●' : (shapes[i] === 'square' ? '■' : '▲');
        icon.style.color = colors[i];
      }
      
      card.appendChild(icon);
      repetitionContainer.appendChild(card);
    }
  }

  btnToggleRepetition.addEventListener('click', () => {
    btnToggleRepetition.classList.toggle('active');
    const isConsistent = btnToggleRepetition.classList.contains('active');
    renderRepetition(isConsistent);
    btnToggleRepetition.textContent = isConsistent ? 'Scramble Patterns' : 'Toggle Consistent Repetition';
  });

  // Initial draw repetition
  renderRepetition(false);

  // WIDGET 6: Proximity spacing
  const btnOrganizeProximity = document.getElementById('btn-organize-proximity');
  const proximityCanvas = document.querySelector('.proximity-canvas');

  btnOrganizeProximity.addEventListener('click', () => {
    proximityCanvas.classList.toggle('grouped');
    btnOrganizeProximity.classList.toggle('active');
    btnOrganizeProximity.textContent = proximityCanvas.classList.contains('grouped') ? 'Scramble Contacts' : 'Organize by Proximity';
  });

  // WIDGET 7: White Space padding slider
  const wsSlider = document.getElementById('ws-slider');
  const wsCard = document.getElementById('ws-card');
  const wsValLabel = document.getElementById('ws-val');

  wsSlider.addEventListener('input', () => {
    const val = wsSlider.value;
    wsCard.style.padding = `${val}px`;
    wsValLabel.textContent = `${val}px`;
  });

  // WIDGET 8: Proportion scaling
  const propSlider = document.getElementById('prop-slider');
  const propBox1 = document.getElementById('prop-box-1');
  const propValLabel = document.getElementById('prop-val');

  propSlider.addEventListener('input', () => {
    const scale = propSlider.value;
    propBox1.style.transform = `scale(${scale})`;
    propValLabel.textContent = `${scale}:1`;
  });

  // WIDGET 9: Movement Path Animator
  const btnTriggerMovement = document.getElementById('btn-trigger-movement');
  const flowDot = document.getElementById('flow-dot');

  // Waypoints for moving along Bezier curve (estimated coords)
  const pathWaypoints = [
    { left: 20, top: 170 },
    { left: 60, top: 110 },
    { left: 110, top: 65 },
    { left: 170, top: 50 },
    { left: 230, top: 65 },
    { left: 285, top: 110 },
    { left: 330, top: 170 }
  ];

  let moving = false;
  btnTriggerMovement.addEventListener('click', () => {
    if (moving) return;
    moving = true;
    btnTriggerMovement.disabled = true;
    
    let step = 0;
    flowDot.style.transition = 'all 0.15s linear';

    function runAnimation() {
      if (step < pathWaypoints.length) {
        flowDot.style.left = `${pathWaypoints[step].left}px`;
        flowDot.style.top = `${pathWaypoints[step].top}px`;
        step++;
        setTimeout(runAnimation, 150);
      } else {
        // Reset after short delay
        setTimeout(() => {
          flowDot.style.transition = 'all 0.5s ease-in-out';
          flowDot.style.left = '20px';
          flowDot.style.top = '170px';
          moving = false;
          btnTriggerMovement.disabled = false;
        }, 800);
      }
    }
    runAnimation();
  });

  // WIDGET 10: Rhythm Display
  const rhythmPanel = document.getElementById('rhythm-panel');
  const rhythmBtns = document.querySelectorAll('.rhythm-controls button');

  function renderRhythm(type) {
    rhythmPanel.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const block = document.createElement('div');
      block.className = 'rhythm-block';
      
      if (type === 'flowing') {
        // Wave pattern heights
        const h = 40 + Math.sin(i * 1.1) * 35;
        block.style.height = `${h}px`;
        block.style.backgroundColor = 'var(--color-primary)';
      } else if (type === 'progressive') {
        // Increasing scale & size
        const h = 20 + (i * 14);
        const w = 12 + (i * 3);
        block.style.height = `${h}px`;
        block.style.width = `${w}px`;
        block.style.backgroundColor = 'var(--color-accent)';
      } else {
        // Regular rhythm
        block.style.height = '60px';
        block.style.width = '24px';
        block.style.backgroundColor = 'var(--color-primary)';
      }
      rhythmPanel.appendChild(block);
    }
  }

  rhythmBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rhythmBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRhythm(btn.getAttribute('data-rhythm'));
    });
  });

  // Draw default regular rhythm
  renderRhythm('regular');

  // WIDGET 11: Unity Styles
  const btnToggleUnity = document.getElementById('btn-toggle-unity');
  const unityContainer = document.querySelector('.unity-demo-container');

  btnToggleUnity.addEventListener('click', () => {
    unityContainer.classList.toggle('unified');
    btnToggleUnity.classList.toggle('active');
    btnToggleUnity.textContent = unityContainer.classList.contains('unified') ? 'Scramble Styles (Chaos)' : 'Unify Styles';
  });

  // WIDGET 12: Variety Shapes
  const btnInjectVariety = document.getElementById('btn-inject-variety');
  const varietyRow = document.getElementById('variety-row');

  function renderVariety(hasVariety) {
    varietyRow.innerHTML = '';
    const shapes = ['square', 'square', 'square', 'square', 'square'];
    const varShapes = ['square', 'circle', 'triangle', 'badge', 'square'];
    const colors = ['#8B5CF6', '#10B981', '#EC4899', '#F59E0B', '#3B82F6'];

    for (let i = 0; i < 5; i++) {
      const shape = document.createElement('div');
      shape.className = 'variety-shape';
      
      const currentShape = hasVariety ? varShapes[i] : shapes[i];
      
      if (currentShape === 'circle') {
        shape.style.borderRadius = '50%';
        shape.style.backgroundColor = colors[i];
      } else if (currentShape === 'triangle') {
        shape.style.width = '0';
        shape.style.height = '0';
        shape.style.background = 'transparent';
        shape.style.borderLeft = '22px solid transparent';
        shape.style.borderRight = '22px solid transparent';
        shape.style.borderBottom = `44px solid ${colors[i]}`;
        shape.style.borderRadius = '0';
      } else if (currentShape === 'badge') {
        shape.style.borderRadius = '20px 4px 20px 4px';
        shape.style.backgroundColor = colors[i];
      } else {
        shape.style.borderRadius = '6px';
        shape.style.backgroundColor = hasVariety ? colors[i] : 'var(--color-primary)';
      }
      
      varietyRow.appendChild(shape);
    }
  }

  btnInjectVariety.addEventListener('click', () => {
    btnInjectVariety.classList.toggle('active');
    const hasVariety = btnInjectVariety.classList.contains('active');
    renderVariety(hasVariety);
    btnInjectVariety.textContent = hasVariety ? 'Restore Monotony' : 'Introduce Variety';
  });

  // Draw default monotone variety shapes
  renderVariety(false);

  // WIDGET 13: Pattern Wallpaper Background
  const patternCanvas = document.getElementById('pattern-canvas');
  const patternBtns = document.querySelectorAll('[data-pattern]');

  patternBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      patternBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const patType = btn.getAttribute('data-pattern');
      patternCanvas.className = 'pattern-generator-canvas';
      
      if (patType === 'grid') patternCanvas.classList.add('pat-grid');
      else if (patType === 'dot') patternCanvas.classList.add('pat-dot');
      else if (patType === 'strip') patternCanvas.classList.add('pat-strip');
    });
  });

  // Set default pattern layout
  patternCanvas.classList.add('pat-grid');

  // WIDGET 15: Simplicity Card Toggles
  const btnToggleSimplicity = document.getElementById('btn-toggle-simplicity');
  const simpCard = document.getElementById('simp-card');
  const simpBadge = document.getElementById('simp-badge');
  const simpTitle = document.getElementById('simp-title');
  const simpText = document.getElementById('simp-text');

  btnToggleSimplicity.addEventListener('click', () => {
    simpCard.classList.toggle('simplified');
    btnToggleSimplicity.classList.toggle('active');
    
    if (simpCard.classList.contains('simplified')) {
      simpBadge.textContent = 'MINIMAL';
      simpTitle.textContent = 'Simplicity';
      simpText.textContent = 'Only essential components remain.';
      btnToggleSimplicity.textContent = 'Add Decorative Noise';
    } else {
      simpBadge.textContent = 'OFFER';
      simpTitle.textContent = 'Design Simplicity Card Title Info';
      simpText.textContent = 'Visual decoration should support communication, not smother it in unnecessary details.';
      btnToggleSimplicity.textContent = 'Reduce Visual Clutter';
    }
  });

  // ==========================================
  // 3. INTERACTIVE REVIEW QUIZ
  // ==========================================
  
  const questionCard = document.getElementById('question-card');
  const resultsCard = document.getElementById('quiz-results');
  const quizQNum = document.getElementById('quiz-q-num');
  const quizQText = document.getElementById('quiz-q-text');
  const quizOptions = document.getElementById('quiz-options');
  const quizScoreVal = document.getElementById('quiz-score-val');
  const quizFeedbackText = document.getElementById('quiz-feedback-text');
  const btnResetQuiz = document.getElementById('btn-reset-quiz');

  const quizQuestions = [
    {
      question: "Which principle is demonstrated by mirroring visual weight along a central axis?",
      options: ["Asymmetrical Balance", "Symmetrical Balance", "Proportion", "Emphasis"],
      correctIndex: 1,
      explanation: "Symmetrical balance mirrors layouts directly along a central axis to establish order."
    },
    {
      question: "What does the principle of Proximity state?",
      options: [
        "Elements close together are seen as sharing a relationship.",
        "Scattering elements builds visual patterns.",
        "Adding negative space guides color contrast.",
        "Aligning content keeps columns clean."
      ],
      correctIndex: 0,
      explanation: "Proximity groups related elements close together so they are perceived as connected."
    },
    {
      question: "What is the primary objective of establishing visual Hierarchy in a layout?",
      options: [
        "To make fonts look stylish.",
        "To fill empty white space.",
        "To guide the scanning order of elements based on importance.",
        "To replicate brand color guidelines."
      ],
      correctIndex: 2,
      explanation: "Hierarchy controls size, weight, and position to direct the reader's scanning order."
    },
    {
      question: "Which principle refers to the distribution of visual weight in a composition?",
      options: ["Rhythm", "Variety", "Balance", "Unity"],
      correctIndex: 2,
      explanation: "Balance is the distribution of visual weight across a design to create stability."
    },
    {
      question: "What type of balance occurs when elements are arranged unequally but still achieve stability?",
      options: ["Symmetrical balance", "Radial balance", "Asymmetrical balance", "Discordant balance"],
      correctIndex: 2,
      explanation: "Asymmetrical balance uses elements of different weights or sizes arranged unequally but harmoniously."
    },
    {
      question: "Which principle uses high contrast or contrasting elements to make one object stand out?",
      options: ["Repetition", "Emphasis", "Scale", "Alignment"],
      correctIndex: 1,
      explanation: "Emphasis commands focus to a single point using contrast, color, or scale."
    },
    {
      question: "How is 'Visual Rhythm' created in a graphic design layout?",
      options: ["By using only monochromatic colors", "By repeating elements in a regular sequence or flowing interval", "By packing elements as densely as possible", "By eliminating empty spaces"],
      correctIndex: 1,
      explanation: "Rhythm is created by repeating elements at regular intervals, generating a visual tempo."
    },
    {
      question: "What is the term for a sense of completeness and visual cohesion where all elements belong?",
      options: ["Emphasis", "Variety", "Unity / Harmony", "Proportion"],
      correctIndex: 2,
      explanation: "Unity is the cohesion of design elements, making them feel like a singular matching system."
    },
    {
      question: "Which principle refers to the size relationship between different parts of a composition?",
      options: ["Contrast", "Proportion", "Repetition", "Alignment"],
      correctIndex: 1,
      explanation: "Proportion describes the scale relationships between elements, e.g. the golden ratio proportions."
    },
    {
      question: "Which principle relates to the scale of elements relative to a standard reference (like the human body)?",
      options: ["Scale", "Movement", "Balance", "White Space"],
      correctIndex: 0,
      explanation: "Scale describes the literal physical sizing of objects, comparing them to standard reference sizes."
    },
    {
      question: "What is the main difference between 'Pattern' and 'Rhythm'?",
      options: ["Pattern is 3D; Rhythm is 2D", "Pattern is exact duplication; Rhythm is flowing or alternating sequence intervals", "Pattern is grey; Rhythm is colorful", "There is no difference"],
      correctIndex: 1,
      explanation: "Pattern duplicates elements exactly. Rhythm repeats them with intervals or variations to convey motion."
    },
    {
      question: "Which principle guides the viewer's eye paths through a composition in a specific direction?",
      options: ["Movement", "Repetition", "Contrast", "Balance"],
      correctIndex: 0,
      explanation: "Movement guides eye paths using lines, gradients, or vectors pointing to focal actions."
    },
    {
      question: "Which principle refers to repeating elements (like colors or logo shapes) to establish brand consistency?",
      options: ["Scale", "Variety", "Repetition", "Emphasis"],
      correctIndex: 2,
      explanation: "Repetition uses recurring elements to unify layouts and cement brand identities."
    },
    {
      question: "What is 'radial balance'?",
      options: ["Visual weight mirrored left and right", "Visual weight radiating outwards from a central point", "Visual weight stacked vertically", "Unbalanced layout structures"],
      correctIndex: 1,
      explanation: "Radial balance arranges visual weight outwards from a central hub (like a clock or wheel)."
    },
    {
      question: "What is the primary benefit of incorporating 'Variety' alongside Unity in a design?",
      options: ["It reduces contrast ratios", "It adds visual interest and prevents layout monotony", "It ensures standard 12-column spans", "It shortens line tracking values"],
      correctIndex: 1,
      explanation: "Variety breaks exact duplication, adding unique details to keep compositions engaging."
    }
  ];

  let currentQuestionIdx = 0;
  let score = 0;
  let optionSelected = false;

  function loadQuestion() {
    optionSelected = false;
    const q = quizQuestions[currentQuestionIdx];
    quizQNum.textContent = `Question ${currentQuestionIdx + 1} of ${quizQuestions.length}`;
    quizQText.textContent = q.question;
    
    quizOptions.innerHTML = '';
    q.options.forEach((option, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = option;
      btn.addEventListener('click', () => selectOption(idx));
      quizOptions.appendChild(btn);
    });
  }

  function selectOption(selectedIndex) {
    if (optionSelected) return;
    optionSelected = true;
    
    const q = quizQuestions[currentQuestionIdx];
    const optionBtns = quizOptions.querySelectorAll('.quiz-option-btn');
    
    if (selectedIndex === q.correctIndex) {
      score++;
      optionBtns[selectedIndex].classList.add('correct');
    } else {
      optionBtns[selectedIndex].classList.add('incorrect');
      optionBtns[q.correctIndex].classList.add('correct'); // Highlight correct
    }

    // Go to next question after delay
    setTimeout(() => {
      currentQuestionIdx++;
      if (currentQuestionIdx < quizQuestions.length) {
        loadQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  function showResults() {
    questionCard.classList.add('hidden');
    resultsCard.classList.remove('hidden');
    quizScoreVal.textContent = `Score: ${score} / ${quizQuestions.length}`;
    
    if (score === quizQuestions.length) {
      quizFeedbackText.textContent = "Perfect score! You've mastered the 15 principles of graphic design.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in the rest of the principles.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand balance, proximity, and hierarchy.";
    }
  }

  function resetQuiz() {
    currentQuestionIdx = 0;
    score = 0;
    resultsCard.classList.add('hidden');
    questionCard.classList.remove('hidden');
    loadQuestion();
  }

  btnResetQuiz.addEventListener('click', resetQuiz);

  // Initialize review quiz
  loadQuestion();
});
