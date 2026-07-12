/* elements-of-design.js - Presentation Slide Deck Engine & Elements Visual Laboratories */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. PRESENTATION ENGINE
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

  // Overview Modal Grid Builder
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
    
    // Progress fill & labels
    currentSlideNum.textContent = currentSlideIndex + 1;
    progressFill.style.width = `${(currentSlideIndex / (totalSlides - 1)) * 100}%`;
    
    // Boundary button status
    btnPrev.disabled = currentSlideIndex === 0;
    btnNext.disabled = currentSlideIndex === totalSlides - 1;

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

  // Keyboard navigation
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

  // Touch navigation
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

  // Initialize
  goToSlide(0);

  // ==========================================
  // 2. LINE DIRECTION CANVAS
  // ==========================================
  
  const lineCanvas = document.getElementById('line-canvas');
  const lineBtns = document.querySelectorAll('.line-btn');
  const lineDescCard = document.getElementById('line-desc-card');

  const lineDescriptions = {
    horizontal: {
      title: "Horizontal Line",
      desc: "Represents calmness, quiet, horizons, and rest. Aligning elements on horizontal paths anchors layouts, projecting a peaceful, structured aesthetic.",
      svg: `<svg width="100%" height="100%" viewBox="0 0 200 200">
              <line x1="20" y1="100" x2="180" y2="100" stroke="var(--color-primary)" stroke-width="5" stroke-linecap="round" />
            </svg>`
    },
    vertical: {
      title: "Vertical Line",
      desc: "Represents stature, height, strength, and structure. Directs eyes upward. Ideal for column dividers, skyscraper formats, and projecting authority.",
      svg: `<svg width="100%" height="100%" viewBox="0 0 200 200">
              <line x1="100" y1="20" x2="100" y2="180" stroke="var(--color-primary)" stroke-width="5" stroke-linecap="round" />
            </svg>`
    },
    diagonal: {
      title: "Diagonal Line",
      desc: "Represents motion, action, speed, and energetic movement. Tilted paths break flat canvas monotony, evoking speed and dynamic sports aesthetics.",
      svg: `<svg width="100%" height="100%" viewBox="0 0 200 200">
              <line x1="30" y1="170" x2="170" y2="30" stroke="var(--color-primary)" stroke-width="5" stroke-linecap="round" />
            </svg>`
    },
    curved: {
      title: "Curved Line",
      desc: "Represents flowing movement, natural organic rhythm, and elegance. Commonly used in branding curves, waves, and natural aesthetic compositions.",
      svg: `<svg width="100%" height="100%" viewBox="0 0 200 200">
              <path d="M 30 150 C 70 30, 130 30, 170 150" fill="none" stroke="var(--color-primary)" stroke-width="5" stroke-linecap="round" />
            </svg>`
    }
  };

  function updateLineCanvas(type) {
    const data = lineDescriptions[type];
    if (!data) return;

    lineCanvas.innerHTML = data.svg;
    lineDescCard.querySelector('h4').textContent = data.title;
    lineDescCard.querySelector('p').textContent = data.desc;
  }

  lineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lineBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const lineType = btn.getAttribute('data-line');
      updateLineCanvas(lineType);
    });
  });

  // Initial load
  updateLineCanvas('horizontal');

  // ==========================================
  // 3. SHAPE MORPHER STUDIO
  // ==========================================
  
  const sliderRadius = document.getElementById('shape-radius');
  const sliderSkew = document.getElementById('shape-skew');
  const valRadius = document.getElementById('val-shape-radius');
  const valSkew = document.getElementById('val-shape-skew');
  const morphShape = document.getElementById('morph-shape');

  function updateMorphShape() {
    const rad = sliderRadius.value;
    const skew = sliderSkew.value;

    valRadius.textContent = `${rad}%`;
    valSkew.textContent = `${skew}°`;

    morphShape.style.borderRadius = `${rad}%`;
    morphShape.style.transform = `rotate(${skew}deg) skew(${skew}deg)`;
  }

  sliderRadius.addEventListener('input', updateMorphShape);
  sliderSkew.addEventListener('input', updateMorphShape);

  // Initial morph
  updateMorphShape();

  // ==========================================
  // 4. 3D SHADING SIMULATOR (FORM)
  // ==========================================
  
  const sliderLight = document.getElementById('light-source');
  const valLight = document.getElementById('val-light-source');
  const shadingSphere = document.getElementById('shading-sphere');

  sliderLight.addEventListener('input', () => {
    const angle = sliderLight.value;
    valLight.textContent = `${angle}°`;

    // Translate angle into X and Y percentages on the circular light sphere
    const offset = Math.round(angle);
    shadingSphere.style.background = `radial-gradient(circle at ${offset}% ${offset}%, #FFFFFF 0%, #3B82F6 42%, #04060C 100%)`;
  });

  // ==========================================
  // 5. COLOR UI THEMER TESTER
  // ==========================================
  
  const themeBtns = document.querySelectorAll('[data-theme]');
  const uiThemeCard = document.getElementById('ui-theme-card');

  const themeColors = {
    teal: { primary: "#10B981", glow: "rgba(16, 185, 129, 0.25)" },
    coral: { primary: "#FB7185", glow: "rgba(251, 113, 133, 0.25)" },
    violet: { primary: "#8B5CF6", glow: "rgba(139, 92, 246, 0.25)" }
  };

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const themeKey = btn.getAttribute('data-theme');
      const colors = themeColors[themeKey];
      
      uiThemeCard.style.setProperty('--accent-color', colors.primary);
      uiThemeCard.style.setProperty('--accent-color-glow', colors.glow);
    });
  });

  // Set violet as initial accent state
  uiThemeCard.style.setProperty('--accent-color', "#10B981");

  // ==========================================
  // 6. LANDSCAPE VALUE CONTRAST
  // ==========================================
  
  const sliderContrast = document.getElementById('value-contrast');
  const valContrastLabel = document.getElementById('val-value-contrast');
  
  const landBack = document.getElementById('land-back');
  const landMid = document.getElementById('land-mid');
  const landFront = document.getElementById('land-front');
  const landscapeSky = document.querySelector('.landscape-sky');

  sliderContrast.addEventListener('input', () => {
    const val = parseInt(sliderContrast.value);
    
    if (val === 1) {
      valContrastLabel.textContent = "Low Contrast (Flat)";
      landscapeSky.style.backgroundColor = "#555A6B";
      landBack.style.backgroundColor = "#5E6375";
      landMid.style.backgroundColor = "#5B6071";
      landFront.style.backgroundColor = "#555A68";
    } else if (val === 2) {
      valContrastLabel.textContent = "Medium Contrast";
      landscapeSky.style.backgroundColor = "#1A1C30";
      landBack.style.backgroundColor = "#4B5563";
      landMid.style.backgroundColor = "#374151";
      landFront.style.backgroundColor = "#1F2937";
    } else if (val === 3) {
      valContrastLabel.textContent = "High Contrast (Clear)";
      landscapeSky.style.backgroundColor = "#FFFFFF";
      landBack.style.backgroundColor = "#CCCCCC";
      landMid.style.backgroundColor = "#666666";
      landFront.style.backgroundColor = "#0F1115";
    }
  });

  // ==========================================
  // 7. TEXTURE EXPLORER CARDS
  // ==========================================
  
  const texBtns = document.querySelectorAll('.texture-preview-btn');
  const textureCanvas = document.getElementById('texture-canvas');
  const textureOverlayName = document.getElementById('texture-overlay-name');

  texBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      texBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const texType = btn.getAttribute('data-tex');
      textureCanvas.className = "texture-display-canvas"; // Reset class names
      
      if (texType === 'brushed') {
        textureCanvas.classList.add('tex-brushed');
        textureOverlayName.textContent = "BRUSHED METAL";
      } else if (texType === 'rough') {
        textureCanvas.classList.add('tex-rough');
        textureOverlayName.textContent = "ROUGH PAPER";
      } else if (texType === 'carbon') {
        textureCanvas.classList.add('tex-carbon');
        textureOverlayName.textContent = "CARBON FIBER";
      }
    });
  });

  // Load default brushed metal
  textureCanvas.classList.add('tex-brushed');

  // ==========================================
  // 8. SPACE OVERLAYS LABORATORY
  // ==========================================
  
  const sliderWsSpacing = document.getElementById('ws-spacing-slider');
  const valWsSpacing = document.getElementById('val-ws-spacing');
  const wsIndicatorOverlay = document.getElementById('ws-indicator-overlay');
  const btnToggleWsOverlay = document.getElementById('btn-toggle-ws-overlay');

  sliderWsSpacing.addEventListener('input', () => {
    const val = sliderWsSpacing.value;
    valWsSpacing.textContent = `${val}px`;
    
    // Apply gap padding to spacing indicator
    wsIndicatorOverlay.style.height = `${val}px`;
  });

  btnToggleWsOverlay.addEventListener('click', () => {
    btnToggleWsOverlay.classList.toggle('active');
    wsIndicatorOverlay.classList.toggle('active');
    
    if (wsIndicatorOverlay.classList.contains('active')) {
      btnToggleWsOverlay.textContent = "Hide Spacing Guides";
    } else {
      btnToggleWsOverlay.textContent = "Toggle Negative Space Guide";
    }
  });

  // ==========================================
  // 9. INTERACTIVE QUIZ
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
      question: "Which type of line expresses dynamic speed, motion, and active direction?",
      options: ["Horizontal line", "Vertical line", "Diagonal line", "Symmetrical curve"],
      correctIndex: 2,
      explanation: "Diagonal lines imply angle tilts, generating speed, action, and active energy."
    },
    {
      question: "What is the key difference between Shape and Form in design elements?",
      options: [
        "Shape is colored, Form is grayscale.",
        "Shape is two-dimensional (2D), Form is three-dimensional (3D).",
        "Shape is organic, Form is geometric.",
        "There is no difference."
      ],
      correctIndex: 1,
      explanation: "Shape describes flat 2D boundaries, while Form describes 3D volume (implied by shading)."
    },
    {
      question: "What does Negative Space refer to in layout design?",
      options: [
        "Empty space that provides breathing room and margins around elements.",
        "Layout areas colored pitch black.",
        "Unapproved margins causing errors.",
        "Grid column lines."
      ],
      correctIndex: 0,
      explanation: "Negative space is the empty space around visual subjects that coordinates focus and readability."
    },
    {
      question: "Which element is defined as a continuous point moving through space?",
      options: ["Shape", "Line", "Value", "Texture"],
      correctIndex: 1,
      explanation: "A line is a point moving in space, connecting points and directing eye movements."
    },
    {
      question: "What does a vertical line typically project in a visual layout?",
      options: ["Rest and calmness", "Height, stability, and stature", "Action and speed", "Flowing natural rhythms"],
      correctIndex: 1,
      explanation: "Vertical lines suggest strength, height, and structure, directing the viewer's eyes upward."
    },
    {
      question: "What type of shapes are regular, mathematical, and precise (like circles and squares)?",
      options: ["Organic shapes", "Abstract shapes", "Geometric shapes", "Asymmetric shapes"],
      correctIndex: 2,
      explanation: "Geometric shapes are defined by mathematical equations (circles, squares, triangles)."
    },
    {
      question: "What type of shapes are irregular, freeform, and mimic nature?",
      options: ["Geometric shapes", "Abstract shapes", "Organic shapes", "Mathematical shapes"],
      correctIndex: 2,
      explanation: "Organic shapes are freeform, irregular, and often represent natural objects (leaves, puddles)."
    },
    {
      question: "How is 3D Form visually implied on a flat 2D design canvas?",
      options: ["By adding borders", "By using lights, highlights, and radial shading gradients", "By changing the font family", "By using monochromatic colors"],
      correctIndex: 1,
      explanation: "Form (implied 3D volume) is rendered in 2D using color values gradients, highlights, and shadows."
    },
    {
      question: "Which element refers to the tactile or visual surface quality of a design?",
      options: ["Value", "Shape", "Texture", "Space"],
      correctIndex: 2,
      explanation: "Texture is the surface quality—either tactile (physically felt) or visual (implied pattern/rendering)."
    },
    {
      question: "What is 'positive space' in a composition?",
      options: ["The empty background margin space", "The space occupied by the active subject elements", "A layout filled with bright colors", "Grid gutters spacing"],
      correctIndex: 1,
      explanation: "Positive space is the area filled by active visual subjects, while negative space is the surrounding background."
    },
    {
      question: "Which element describes the relative lightness or darkness of a hue?",
      options: ["Value", "Texture", "Line", "Color Wheel"],
      correctIndex: 0,
      explanation: "Value describes light levels (brightness), independent of the hue color itself."
    },
    {
      question: "What is the primary role of Value contrast in layout depth?",
      options: ["It determines font sizes", "It creates foreground/background layer separation and locks focal zones", "It establishes responsive grids", "It sets line height values"],
      correctIndex: 1,
      explanation: "Value contrast separates overlapping layout objects, generating a sense of depth and hierarchy."
    },
    {
      question: "What is 'tactile texture'?",
      options: ["An implied pattern drawn on a screen", "A physical surface texture that can actually be felt by hand", "A high contrast value scale", "None of the above"],
      correctIndex: 1,
      explanation: "Tactile texture is physical and can be felt (e.g. textured paper, embossed letterpress)."
    },
    {
      question: "What is 'visual texture'?",
      options: ["A physical surface texture that can be felt", "An implied or simulated surface texture represented in 2D design", "A color blindness SVG filter", "A grid column alignment line"],
      correctIndex: 1,
      explanation: "Visual texture is implied on a flat canvas (e.g. rendering a carbon fiber pattern or rough paper image)."
    },
    {
      question: "Which element describes a defined boundary in 2D flat space?",
      options: ["Form", "Line", "Shape", "Value"],
      correctIndex: 2,
      explanation: "A shape is a two-dimensional area enclosed by lines or defined by boundaries."
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
      optionBtns[q.correctIndex].classList.add('correct');
    }

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
      quizFeedbackText.textContent = "Perfect score! You've mastered the 7 elements of design.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in form shading principles.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand lines, 3D forms, and negative space.";
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

  loadQuestion();
});
