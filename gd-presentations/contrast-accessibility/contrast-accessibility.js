/* contrast-accessibility.js - Slide Deck Navigation & Accessibility Laboratory Engine */

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
  // 2. CONTRAST TYPES HIGH-LIGHTER
  // ==========================================
  
  const contrastBtns = document.querySelectorAll('[data-contrast]');
  const box1 = document.getElementById('contrast-box-1');
  const box2 = document.getElementById('contrast-box-2');
  const contrastDescCard = document.getElementById('contrast-desc-card');

  const contrastDetails = {
    size: {
      title: "Size Contrast",
      desc: "Scaling elements (e.g. big titles vs standard text) signals importance, guiding users to scan titles first.",
      style: () => {
        box1.style.fontSize = "3.2rem";
        box1.style.color = "var(--text-light)";
        box1.style.fontWeight = "700";
        box1.style.border = "none";
        box1.style.borderRadius = "0";
        box1.style.padding = "0";
        box1.style.backgroundColor = "transparent";
        
        box2.style.fontSize = "0.95rem";
        box2.style.color = "var(--text-muted)";
        box2.style.fontWeight = "400";
        box2.style.border = "none";
        box2.style.borderRadius = "0";
        box2.style.padding = "0";
        box2.style.backgroundColor = "transparent";
      }
    },
    color: {
      title: "Color Contrast",
      desc: "Using opposing hues (like dark indigo backdrop and bright gold text) highlights vital interactive segments instantly.",
      style: () => {
        box1.style.fontSize = "1.8rem";
        box1.style.color = "#FBBF24"; // Gold
        box1.style.fontWeight = "700";
        box1.style.border = "none";
        box1.style.borderRadius = "0";
        box1.style.padding = "10px";
        box1.style.backgroundColor = "#1E1B4B"; // Deep Navy
        
        box2.style.fontSize = "1.8rem";
        box2.style.color = "#6366F1"; // Indigo
        box2.style.fontWeight = "700";
        box2.style.border = "none";
        box2.style.borderRadius = "0";
        box2.style.padding = "10px";
        box2.style.backgroundColor = "#1E1B4B";
      }
    },
    weight: {
      title: "Weight Contrast",
      desc: "Pairing heavy bold headings with light body lines establishes typographic hierarchy even when colors are identical.",
      style: () => {
        box1.style.fontSize = "2rem";
        box1.style.color = "var(--text-light)";
        box1.style.fontWeight = "900";
        box1.style.border = "none";
        box1.style.borderRadius = "0";
        box1.style.padding = "0";
        box1.style.backgroundColor = "transparent";
        
        box2.style.fontSize = "2rem";
        box2.style.color = "var(--text-light)";
        box2.style.fontWeight = "300";
        box2.style.border = "none";
        box2.style.borderRadius = "0";
        box2.style.padding = "0";
        box2.style.backgroundColor = "transparent";
      }
    },
    shape: {
      title: "Shape Contrast",
      desc: "Breaking uniform sharp grids with circular elements commands immediate visual focus to key tags or CTA links.",
      style: () => {
        box1.style.fontSize = "1.1rem";
        box1.style.color = "var(--text-light)";
        box1.style.fontWeight = "700";
        box1.style.border = "1.5px solid var(--border-color)";
        box1.style.borderRadius = "8px";
        box1.style.padding = "15px 30px";
        box1.style.backgroundColor = "var(--bg-surface-light)";
        
        box2.style.fontSize = "1.1rem";
        box2.style.color = "#FFFFFF";
        box2.style.fontWeight = "700";
        box2.style.border = "none";
        box2.style.borderRadius = "50%";
        box2.style.padding = "25px";
        box2.style.backgroundColor = "var(--color-primary)";
      }
    }
  };

  contrastBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      contrastBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.getAttribute('data-contrast');
      const details = contrastDetails[type];
      
      if (details) {
        details.style();
        contrastDescCard.querySelector('h4').textContent = details.title;
        contrastDescCard.querySelector('p').textContent = details.desc;
      }
    });
  });

  // Initial trigger
  contrastDetails['size'].style();

  // ==========================================
  // 3. WCAG CONTRAST CALCULATOR
  // ==========================================
  
  const fgColorInput = document.getElementById('fg-color');
  const bgColorInput = document.getElementById('bg-color');
  const fgHexInput = document.getElementById('fg-color-text');
  const bgHexInput = document.getElementById('bg-color-text');
  
  const ratioPreview = document.getElementById('ratio-preview-card');
  const ratioValueLabel = document.getElementById('calc-ratio-val');
  const normalTextBadge = document.getElementById('normal-text-badge');
  const largeTextBadge = document.getElementById('large-text-badge');

  // Convert Hex to RGB object
  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Calculate relative luminance based on WCAG standard
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function calculateContrast() {
    const fgHex = fgHexInput.value;
    const bgHex = bgHexInput.value;
    
    const fgRgb = hexToRgb(fgHex);
    const bgRgb = hexToRgb(bgHex);
    
    if (!fgRgb || !bgRgb) return;

    // Apply color swatches to simulator element
    ratioPreview.style.color = fgHex;
    ratioPreview.style.backgroundColor = bgHex;

    const L1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const L2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    // Find lighter vs darker luminance
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const formattedRatio = ratio.toFixed(2);
    
    ratioValueLabel.textContent = `${formattedRatio}:1`;

    // Normal Text standards (limit 4.5:1 for AA)
    if (ratio >= 7.0) {
      normalTextBadge.textContent = "PASS (AAA)";
      normalTextBadge.className = "badge-status pass";
    } else if (ratio >= 4.5) {
      normalTextBadge.textContent = "PASS (AA)";
      normalTextBadge.className = "badge-status pass";
    } else {
      normalTextBadge.textContent = "FAIL";
      normalTextBadge.className = "badge-status fail";
    }

    // Large Text standards (limit 3.0:1 for AA)
    if (ratio >= 4.5) {
      largeTextBadge.textContent = "PASS (AAA)";
      largeTextBadge.className = "badge-status pass";
    } else if (ratio >= 3.0) {
      largeTextBadge.textContent = "PASS (AA)";
      largeTextBadge.className = "badge-status pass";
    } else {
      largeTextBadge.textContent = "FAIL";
      largeTextBadge.className = "badge-status fail";
    }
  }

  // Handle color swatch changes
  fgColorInput.addEventListener('input', (e) => {
    fgHexInput.value = e.target.value.toUpperCase();
    calculateContrast();
  });
  bgColorInput.addEventListener('input', (e) => {
    bgHexInput.value = e.target.value.toUpperCase();
    calculateContrast();
  });

  // Handle text hexadecimal inputs changes
  fgHexInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.match(/^#[0-9A-F]{6}$/i)) {
      fgColorInput.value = val;
      calculateContrast();
    }
  });
  bgHexInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (val.match(/^#[0-9A-F]{6}$/i)) {
      bgColorInput.value = val;
      calculateContrast();
    }
  });

  // Initialize Calculator
  calculateContrast();

  // ==========================================
  // 4. COLOR BLINDNESS SIMULATOR
  // ==========================================
  
  const cvdCanvas = document.getElementById('cvd-simulator-canvas');
  const cvdBtns = document.querySelectorAll('[data-cvd]');

  cvdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cvdBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-cvd');
      cvdCanvas.className = "cvd-simulation-panel"; // Reset default filter
      
      if (filterType !== 'normal') {
        cvdCanvas.classList.add(`cvd-filter-${filterType}`);
      }
    });
  });

  // ==========================================
  // 5. BEYOND COLOR COMPARISON
  // ==========================================
  
  const btnShowBad = document.getElementById('btn-show-bad-ui');
  const btnShowGood = document.getElementById('btn-show-good-ui');
  const comparisonWrapper = document.getElementById('comparison-card-wrapper');

  function renderComparison(isGood) {
    comparisonWrapper.innerHTML = '';
    
    if (isGood) {
      comparisonWrapper.innerHTML = `
        <div class="comp-status-row good-card status-error">
          <span class="comp-icon">🚫</span>
          <span class="comp-label">Payment Rejected: Missing digits</span>
        </div>
        <div class="comp-status-row good-card status-success">
          <span class="comp-icon">✔️</span>
          <span class="comp-label">Payment Accepted</span>
        </div>
      `;
    } else {
      // Bad color only
      comparisonWrapper.innerHTML = `
        <div class="comp-status-row bad-error">Rejected Status</div>
        <div class="comp-status-row bad-success">Successful Status</div>
      `;
    }
  }

  btnShowBad.addEventListener('click', () => {
    btnShowBad.classList.add('active');
    btnShowGood.classList.remove('active');
    renderComparison(false);
  });

  btnShowGood.addEventListener('click', () => {
    btnShowGood.classList.add('active');
    btnShowBad.classList.remove('active');
    renderComparison(true);
  });

  // Initialize
  renderComparison(false);

  // ==========================================
  // 6. TOUCH TARGET ACCURACIES
  // ==========================================
  
  const btnTargetSmall = document.getElementById('btn-target-small');
  const btnTargetStd = document.getElementById('btn-target-std');
  const targetClickStatus = document.getElementById('target-click-status');

  btnTargetSmall.addEventListener('click', (e) => {
    e.stopPropagation();
    // Simulate touch borders inaccuracy (randomized click fail rates)
    const seed = Math.random();
    if (seed > 0.5) {
      targetClickStatus.textContent = "Click Missed! Boundary is too small.";
      targetClickStatus.style.color = "var(--color-danger)";
    } else {
      targetClickStatus.textContent = "Click Registered (But layout boundary is narrow)";
      targetClickStatus.style.color = "var(--color-warning)";
    }
  });

  btnTargetStd.addEventListener('click', (e) => {
    e.stopPropagation();
    // Large targets are 100% accurate
    targetClickStatus.textContent = "Failsafe Click registered successfully! (44x44px target) (PASS)";
    targetClickStatus.style.color = "var(--color-accent)";
  });

  // Handle clicking outside buttons bounds
  document.querySelector('.touch-target-simulator').addEventListener('click', () => {
    targetClickStatus.textContent = "Click Missed! Clicked outside layout boundaries.";
    targetClickStatus.style.color = "var(--color-danger)";
  });

  // ==========================================
  // 7. ALT TEXT GRADER
  // ==========================================
  
  const altInput = document.getElementById('alt-text-input');
  const btnGradeAlt = document.getElementById('btn-grade-alt');
  const altGradeCritique = document.getElementById('alt-grade-critique');

  btnGradeAlt.addEventListener('click', () => {
    const val = altInput.value.trim().toLowerCase();
    const critiqueHeading = altGradeCritique.querySelector('h4');
    const critiqueDesc = altGradeCritique.querySelector('p');

    if (val === '') {
      critiqueHeading.textContent = "Grade: Fail (Missing Alt Text)";
      critiqueHeading.style.color = "var(--color-danger)";
      critiqueDesc.textContent = "Alt descriptions are required for images so screen readers can explain context.";
      return;
    }

    // Check redundant word prefixes
    if (val.includes("image of") || val.includes("picture of") || val.includes("photo of") || val.includes("graphic of")) {
      critiqueHeading.textContent = "Grade: Weak (Redundancy warning)";
      critiqueHeading.style.color = "var(--color-warning)";
      critiqueDesc.textContent = "Avoid prefixing description with 'image of' or 'picture of'. Screen readers automatically declare image elements.";
      return;
    }

    if (val.length < 8) {
      critiqueHeading.textContent = "Grade: Weak (Too Vague)";
      critiqueHeading.style.color = "var(--color-warning)";
      critiqueDesc.textContent = "Description is too short. Specify context. What is the graphic displaying?";
      return;
    }

    if (val.length > 120) {
      critiqueHeading.textContent = "Grade: Critique (Too Verbose)";
      critiqueHeading.style.color = "var(--color-warning)";
      critiqueDesc.textContent = "Alt descriptions should remain concise. Keep it under 100 characters.";
      return;
    }

    // Evaluate matching semantic keywords
    if (val.includes("check") || val.includes("checkmark") || val.includes("green") || val.includes("badge") || val.includes("success")) {
      critiqueHeading.textContent = "Grade: Excellent (Descriptive PASS)";
      critiqueHeading.style.color = "var(--color-accent)";
      critiqueDesc.textContent = "Perfect description! Explains color and badge context clearly to screen reader navigators.";
    } else {
      critiqueHeading.textContent = "Grade: Acceptable";
      critiqueHeading.style.color = "var(--text-light)";
      critiqueDesc.textContent = "The description works, but try adding functional context (e.g. 'Green checkmark success badge').";
    }
  });

  // ==========================================
  // 8. REVIEW QUIZ
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
      question: "What is the minimum contrast ratio required by WCAG AA standard for normal body text (under 18pt)?",
      options: ["3.0:1", "4.5:1", "7.0:1", "12.0:1"],
      correctIndex: 1,
      explanation: "WCAG AA standard normal body text requires a minimum contrast of 4.5:1. Large headings require 3.0:1."
    },
    {
      question: "Why should designers avoid using red and green colors as the ONLY indicators of form alerts?",
      options: [
        "Because green is too bright.",
        "Because users with Deuteranopia (green-blindness) cannot distinguish the colors, merging both statuses.",
        "Because red represents code errors.",
        "Color is never used in UI."
      ],
      correctIndex: 1,
      explanation: "Users with Deuteranopia cannot tell red from green alerts. Support color with text details and icons."
    },
    {
      question: "What is Apple and WCAG's recommended minimum touch target size for touchscreens buttons?",
      options: ["10x10 pixels", "24x24 pixels (or 44x44 pixels preferred)", "80x80 pixels", "Depends on the screen brightness"],
      correctIndex: 1,
      explanation: "Buttons must be at least 24px wide (preferably 44px) to accommodate finger touch boundaries and prevent mis-clicks."
    },
    {
      question: "What is the acronym 'a11y' short for in technology circles?",
      options: ["Alignment 1st to 12th Columns", "Accessibility (11 letters between 'a' and 'y')", "Alternative layout 1.1 Y-axis", "Adobe Illustrator 11th Version"],
      correctIndex: 1,
      explanation: "'a11y' is a common numeronym for 'Accessibility', representing the letter count between the starting 'A' and trailing 'Y'."
    },
    {
      question: "What is the global standard regulating digital web accessibility guidelines?",
      options: ["ISO 9001", "W3C HTML5 Specification", "WCAG (Web Content Accessibility Guidelines)", "Apple Human Interface Guidelines"],
      correctIndex: 2,
      explanation: "WCAG (Web Content Accessibility Guidelines), published by the W3C, is the global authority on accessibility rules."
    },
    {
      question: "What contrast ratio is required by WCAG AAA (highest standard) for normal body text?",
      options: ["4.5:1", "7.0:1", "3.0:1", "15.0:1"],
      correctIndex: 1,
      explanation: "WCAG AAA requires a high contrast ratio of at least 7.0:1 for standard body text."
    },
    {
      question: "What is the minimum contrast ratio required by WCAG AA standard for large headers text (18pt+)?",
      options: ["3.0:1", "4.5:1", "7.0:1", "2.0:1"],
      correctIndex: 0,
      explanation: "Large text (which is easier to read) has a lower AA contrast requirement of 3.0:1."
    },
    {
      question: "What color vision deficiency is commonly known as green-blindness?",
      options: ["Protanopia", "Tritanopia", "Deuteranopia", "Monochromacy"],
      correctIndex: 2,
      explanation: "Deuteranopia is green-blindness—the most common form of color deficiency."
    },
    {
      question: "What is the primary benefit of designing clear focus states (outlines) around buttons?",
      options: [
        "It improves page loading speeds",
        "It provides vital visual indicators for keyboard-only navigators (using Tab keys)",
        "It keeps color palettes analogous",
        "It increases touch screen accuracy"
      ],
      correctIndex: 1,
      explanation: "Keyboard users tab through links; visible focus rings show them exactly which element is currently selected."
    },
    {
      question: "What is 'Alt Text' in digital graphic design?",
      options: [
        "A script replacing fonts",
        "Descriptive text added to image tags read aloud by screen readers for blind users",
        "The CSS outline offset value",
        "The alternative color palette"
      ],
      correctIndex: 1,
      explanation: "Alt text describes image content to screen readers, providing blind or low-vision users with vital context."
    },
    {
      question: "Which of the following represents a BAD practice when writing Alt Text?",
      options: [
        "Starting descriptions with 'Image of...' or 'Picture of...'",
        "Describing the colors of objects",
        "Keeping description under 100 characters",
        "Adding functional labels for icon links"
      ],
      correctIndex: 0,
      explanation: "Screen readers already announce image tags as images. Saying 'Image of' is redundant and wastes screen reader time."
    },
    {
      question: "How should purely decorative background shapes or dividers be marked for screen readers?",
      options: [
        "With detailed layout descriptions",
        "With an empty alt attribute (alt=\"\") to tell screen readers to skip it",
        "By leaving the alt tag off completely",
        "By naming them 'decorative'"
      ],
      correctIndex: 1,
      explanation: "Setting an empty `alt=\"\"` tells screen readers the image has no semantic value, causing it to be silently skipped."
    },
    {
      question: "Which contrast type uses contrasting weights (bold vs thin lines) to show layout hierarchy?",
      options: ["Size Contrast", "Weight Contrast", "Color Contrast", "Shape Contrast"],
      correctIndex: 1,
      explanation: "Weight contrast uses line weight disparities (bold headers vs light body copy) to create structure."
    },
    {
      question: "What does the WCAG principle 'Perceivable' mean?",
      options: [
        "Content must not be invisible to all senses (e.g. providing audio/text fallbacks)",
        "Layouts must wrap inside responsive grids",
        "Interactive targets must fit 44px boundaries",
        "None of the above"
      ],
      correctIndex: 0,
      explanation: "'Perceivable' states that users must be able to perceive the information using at least one sense (sight, hearing, or touch)."
    },
    {
      question: "What is the recommended line height (leading) for body paragraphs to maintain reading comfort?",
      options: ["1.0 (Single line)", "1.5 times the font size", "3.0 (Triple line)", "0.5 (Overlapping text)"],
      correctIndex: 1,
      explanation: "WCAG recommends a line spacing (leading) of at least 1.5 to prevent rows from visually merging."
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
      quizFeedbackText.textContent = "Perfect score! You have mastered WCAG accessibility design guidelines.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in touch boundaries and contrast limits.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand accessibility checklists.";
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
