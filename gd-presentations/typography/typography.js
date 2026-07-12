/* typography.js - Presentation Slide Deck Engine & Spacing Labs */

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
  // 2. FONT CLASSIFICATION SWITCHER
  // ==========================================
  
  const classBtns = document.querySelectorAll('.class-btn');
  const classPreviewText = document.getElementById('class-preview-text');
  const classTitle = document.getElementById('class-title');
  const classDesc = document.getElementById('class-desc');

  const classificationData = {
    serif: {
      title: "Serif Typefaces",
      fontClass: "font-serif",
      desc: "Features small decorative strokes (serifs) at the ends of character lines. Historically originating from stone chisel carvings. Communicates heritage, authority, credibility, and comfortable editorial reading."
    },
    sans: {
      title: "Sans-Serif Typefaces",
      fontClass: "font-sans",
      desc: "Lacks decorative strokes ('sans' means without in French). Features clean geometric shapes, uniform thicknesses, and high modern readability. Promotes simplicity, tech innovation, and friendly UI aesthetics."
    },
    mono: {
      title: "Monospace Typefaces",
      fontClass: "font-mono",
      desc: "Every character occupies the exact same horizontal width. Extremely useful for code listings, terminal readouts, data tables, and structured alignment displays."
    },
    script: {
      title: "Display / Script Typefaces",
      fontClass: "font-serif", // uses stylized serif as fallback, styled script text
      desc: "Features high-personality, calligraphic strokes, or decorative designs. Designed for massive headings or logo wordmarks. Avoid using script fonts for body copy due to severe reading strain."
    }
  };

  classBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      classBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const classKey = btn.getAttribute('data-class');
      const data = classificationData[classKey];
      
      classPreviewText.className = `class-preview-display ${data.fontClass}`;
      
      if (classKey === 'script') {
        classPreviewText.style.fontFamily = "'Playfair Display', cursive";
        classPreviewText.style.fontStyle = "italic";
        classPreviewText.textContent = "Aa";
      } else {
        classPreviewText.style.fontFamily = "";
        classPreviewText.style.fontStyle = "";
        classPreviewText.textContent = "Aa";
      }
      
      classTitle.textContent = data.title;
      classDesc.textContent = data.desc;
    });
  });

  // ==========================================
  // 3. TYPOGRAPHIC ANATOMY HOVER ENGINE
  // ==========================================
  
  const anatomyBtns = document.querySelectorAll('.anatomy-term-btn');
  
  const guides = {
    baseline: document.getElementById('guide-baseline'),
    capheight: document.getElementById('guide-capheight'),
    xheight: document.getElementById('guide-xheight'),
    ascender: document.getElementById('guide-ascender'),
    descender: document.getElementById('guide-descender')
  };

  const highlights = {
    ascender: document.getElementById('high-ascender'),
    descender: document.getElementById('high-descender'),
    bowl: document.getElementById('high-bowl'),
    counter: document.getElementById('high-counter'),
    'serif-foot': document.getElementById('high-serif-foot')
  };

  const anatomyDescriptions = {
    baseline: {
      title: "Baseline",
      desc: "The invisible horizontal line where the bodies of all character letters rest."
    },
    capheight: {
      title: "Cap Height",
      desc: "The height of capital letters from the baseline (typically measured on flat letters like H or I)."
    },
    xheight: {
      title: "x-Height",
      desc: "The height of lowercase letters, excluding ascenders and descenders (measured from the lowercase x)."
    },
    ascender: {
      title: "Ascender",
      desc: "The vertical portion of a lowercase letter that extends above the x-height line (e.g. h, b, d, k)."
    },
    descender: {
      title: "Descender",
      desc: "The vertical portion of a lowercase letter that extends below the baseline (e.g. p, g, y, q, j)."
    },
    bowl: {
      title: "Bowl",
      desc: "The fully closed, curved structural shape of a letter enclosing a counter space (e.g. the loop of p or d)."
    },
    counter: {
      title: "Counter",
      desc: "The empty negative space enclosed inside a letter's bowl (e.g. the open center of o, a, or the loop of p)."
    },
    'serif-foot': {
      title: "Serif / Terminal",
      desc: "Serifs are the decorative feet/strokes at the ends of letter stems. Terminals are the ends of strokes without serifs."
    }
  };

  const tooltip = document.getElementById('anatomy-tooltip');

  document.addEventListener('mousemove', (e) => {
    if (tooltip.classList.contains('visible')) {
      let x = e.clientX + 15;
      let y = e.clientY + 15;
      // Prevent off-screen overflow
      if (x + 290 > window.innerWidth) {
        x = e.clientX - 295;
      }
      if (y + 130 > window.innerHeight) {
        y = e.clientY - 120;
      }
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    }
  });

  anatomyBtns.forEach(btn => {
    const part = btn.getAttribute('data-part');

    function activatePart() {
      btn.classList.add('active');
      
      // Highlight matching guideline
      if (guides[part]) guides[part].classList.add('active');
      
      // If it's a structural highlight part
      if (highlights[part]) highlights[part].classList.add('active');
      
      // Helper behaviors
      if (part === 'ascender') guides.ascender.classList.add('active');
      if (part === 'descender') guides.descender.classList.add('active');
      if (part === 'xheight') guides.xheight.classList.add('active');
      if (part === 'capheight') guides.capheight.classList.add('active');
      if (part === 'baseline') guides.baseline.classList.add('active');

      // Update tooltip content & show
      const data = anatomyDescriptions[part];
      if (data) {
        tooltip.innerHTML = `<strong>${data.title}</strong>${data.desc}`;
        tooltip.classList.add('visible');
      }
    }

    function deactivatePart() {
      btn.classList.remove('active');
      
      // Reset guidelines
      Object.values(guides).forEach(g => g.classList.remove('active'));
      
      // Reset highlights
      Object.values(highlights).forEach(h => h.classList.remove('active'));

      // Hide tooltip
      tooltip.classList.remove('visible');
    }

    btn.addEventListener('mouseenter', activatePart);
    btn.addEventListener('mouseleave', deactivatePart);
    
    // Support toggle click on touch screens
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = btn.classList.contains('active');
      deactivatePart();
      if (!isActive) activatePart();
    });
  });

  // Reset anatomy triggers when clicking canvas
  document.querySelector('.anatomy-diagram-canvas').addEventListener('click', () => {
    anatomyBtns.forEach(btn => btn.classList.remove('active'));
    Object.values(guides).forEach(g => g.classList.remove('active'));
    Object.values(highlights).forEach(h => h.classList.remove('active'));
    tooltip.classList.remove('visible');
  });

  // ==========================================
  // 4. HIERARCHY SCALE BUILDER
  // ==========================================
  
  const sliderSize = document.getElementById('hier-title-slider');
  const sliderWeight = document.getElementById('hier-weight-slider');
  const valSize = document.getElementById('val-hier-title');
  const valWeight = document.getElementById('val-hier-weight');
  
  const hierCard = document.getElementById('hier-lab-card');
  const hierCardH = document.getElementById('hier-lab-h');
  const hierEvalStatus = document.getElementById('hier-eval-status');

  function updateHierarchyLab() {
    const size = parseFloat(sliderSize.value);
    const weight = parseInt(sliderWeight.value);

    valSize.textContent = `${size}rem`;
    valWeight.textContent = `${weight}`;

    // Apply styles
    hierCardH.style.fontSize = `${size}rem`;
    hierCardH.style.fontWeight = weight;

    // Evaluate Hierarchy Score
    // Body is 0.85rem. Title size range: 1.1 to 2.8. Title weight range: 300 to 800.
    if (size <= 1.4 && weight <= 400) {
      hierEvalStatus.className = 'badge-status fail';
      hierEvalStatus.textContent = 'POOR CONTRAST (FAIL)';
      hierCard.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    } else if ((size <= 1.8 && weight <= 500) || (size > 1.8 && weight <= 300)) {
      hierEvalStatus.className = 'badge-status warning';
      hierEvalStatus.textContent = 'WEAK CONTRAST (WARN)';
      hierCard.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    } else {
      hierEvalStatus.className = 'badge-status pass';
      hierEvalStatus.textContent = 'EXCELLENT SCALING (PASS)';
      hierCard.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    }
  }

  sliderSize.addEventListener('input', updateHierarchyLab);
  sliderWeight.addEventListener('input', updateHierarchyLab);

  // Initial draw hierarchy
  updateHierarchyLab();

  // ==========================================
  // 5. SPACING LABORATORY (LEADING & TRACKING)
  // ==========================================
  
  const sliderLeading = document.getElementById('space-leading');
  const sliderTracking = document.getElementById('space-tracking');
  const valLeading = document.getElementById('val-space-leading');
  const valTracking = document.getElementById('val-space-tracking');
  const spacingPreviewText = document.getElementById('spacing-preview-p');

  function updateSpacingLab() {
    const lead = parseFloat(sliderLeading.value);
    const track = parseFloat(sliderTracking.value);

    valLeading.textContent = `${lead}`;
    valTracking.textContent = `${track}px`;

    // Apply to paragraph copy
    spacingPreviewText.style.lineHeight = lead;
    spacingPreviewText.style.letterSpacing = `${track}px`;

    // Visual helper feedback
    const box = spacingPreviewText.parentElement;
    if (lead < 1.1 || track < -1) {
      box.style.borderColor = 'rgba(239, 68, 68, 0.4)'; // Cramped alert
    } else if (lead > 2.0 || track > 6) {
      box.style.borderColor = 'rgba(245, 158, 11, 0.4)'; // Disconnected warning
    } else {
      box.style.borderColor = 'rgba(16, 185, 129, 0.3)'; // Perfect
    }
  }

  sliderLeading.addEventListener('input', updateSpacingLab);
  sliderTracking.addEventListener('input', updateSpacingLab);

  // Initial draw spacing
  updateSpacingLab();

  // ==========================================
  // 6. ALIGNMENT & LINE LENGTH FATIGUE CALCULATOR
  // ==========================================
  
  const alignBtns = document.querySelectorAll('.align-btn');
  const resizableCard = document.getElementById('resizable-card');
  const widthSlider = document.getElementById('width-slider');
  const valWidth = document.getElementById('val-col-width');
  const calcCharNum = document.getElementById('calc-char-num');
  const fatigueBadge = document.getElementById('fatigue-badge');
  const resizableP = document.getElementById('resizable-p');

  // Change alignments
  alignBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alignBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const alignment = btn.getAttribute('data-align');
      resizableP.style.textAlign = alignment;
    });
  });

  // Slider width logic
  function updateLineLengthWidth() {
    const width = parseInt(widthSlider.value);
    resizableCard.style.width = `${width}px`;
    valWidth.textContent = `${width}px`;

    // Formula mapping pixels width to average characters per line
    const charsPerLine = Math.round(width / 5.4);
    calcCharNum.textContent = charsPerLine;

    // Evaluate Fatigue levels
    if (charsPerLine < 45) {
      fatigueBadge.className = 'badge-status warning';
      fatigueBadge.textContent = 'TOO NARROW (WARN)';
      resizableCard.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    } else if (charsPerLine >= 45 && charsPerLine <= 75) {
      fatigueBadge.className = 'badge-status pass';
      fatigueBadge.textContent = 'PERFECT (PASS)';
      resizableCard.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
      fatigueBadge.className = 'badge-status fail';
      fatigueBadge.textContent = 'TOO WIDE (FAIL)';
      resizableCard.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    }
  }

  widthSlider.addEventListener('input', updateLineLengthWidth);

  // Initial draw alignment column width
  updateLineLengthWidth();

  // ==========================================
  // 7. FONT PAIRING CRITIC WIDGET
  // ==========================================
  
  const selectPairing = document.getElementById('select-pairing');
  const pairingPreview = document.getElementById('pairing-preview');
  const pairingCritique = document.getElementById('pairing-critique');

  const pairingData = {
    editorial: {
      headerFont: "'Playfair Display', serif",
      bodyFont: "'Outfit', sans-serif",
      title: "Editorial Design",
      body: "Serif headings contrast beautifully against modern geometric body text to guide scanning layout order.",
      critiqueTitle: "Editorial Classic Critique",
      critiqueText: "A highly premium combination. The high-elegance Serif heading draws attention, while the geometric Sans-Serif body remains legible at small sizes."
    },
    tech: {
      headerFont: "'Outfit', sans-serif",
      bodyFont: "'Space Mono', monospace",
      title: "Developer Console UI",
      body: "Bold Sans-Serif headlines paired with monospaced paragraphs create a precise technical dashboard layout.",
      critiqueTitle: "Modern Technical Critique",
      critiqueText: "Excellent layout for IT, documentation, and data-dense dashboards. Monospace provides high readability for metrics, while the Sans header anchors structure."
    },
    corporate: {
      headerFont: "'Outfit', sans-serif",
      bodyFont: "'Playfair Display', serif",
      title: "Academic Report Layout",
      body: "A clean modern header introduces dense editorial serif paragraph columns for longer reading materials.",
      critiqueTitle: "Clean Corporate Critique",
      critiqueText: "A reversed classic. Useful for books and long-form articles. The Sans header keeps section titles clean, while the Serif body supports reading comfort over paragraphs."
    },
    conflict: {
      headerFont: "'Space Mono', monospace",
      bodyFont: "'Playfair Display', serif",
      title: "Mismatched Visual Hierarchy",
      body: "Using a wide code font for headings next to historical serif body text creates heavy visual discord.",
      critiqueTitle: "Mismatched Conflict Critique",
      critiqueText: "Avoid this setup. Space Mono and Playfair Display clash in historic references, geometries, and weights, creating immediate reading friction and looking amateur."
    }
  };

  selectPairing.addEventListener('change', () => {
    const val = selectPairing.value;
    const data = pairingData[val];
    if (!data) return;

    // Apply fonts directly
    pairingPreview.querySelector('.pair-h').style.fontFamily = data.headerFont;
    pairingPreview.querySelector('.pair-h').textContent = data.title;
    
    pairingPreview.querySelector('.pair-p').style.fontFamily = data.bodyFont;
    pairingPreview.querySelector('.pair-p').textContent = data.body;

    pairingCritique.querySelector('h4').textContent = data.critiqueTitle;
    pairingCritique.querySelector('p').textContent = data.critiqueText;
    
    // Alert styling if it's conflict
    if (val === 'conflict') {
      pairingCritique.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      pairingCritique.style.backgroundColor = 'rgba(239, 68, 68, 0.02)';
    } else {
      pairingCritique.style.borderColor = '';
      pairingCritique.style.backgroundColor = '';
    }
  });

  // ==========================================
  // 8. TYPOGRAPHY REVIEW QUIZ
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
      question: "Which term describes the horizontal line where all letter characters rest?",
      options: ["x-Height", "Ascender line", "Baseline", "Cap height"],
      correctIndex: 2,
      explanation: "The Baseline is the invisible grid line where the bodies of all letters sit."
    },
    {
      question: "For optimal body copy readability, what is the golden character count range per line?",
      options: ["20 - 30 characters", "45 - 75 characters", "90 - 110 characters", "No character limit"],
      correctIndex: 1,
      explanation: "A line length of 45-75 characters maintains visual comfort and reduces scanning fatigue."
    },
    {
      question: "What is Leading in typographic layout?",
      options: [
        "The overall spacing across a block of text.",
        "The space adjustment between two specific character letters.",
        "The horizontal alignment rules.",
        "The vertical distance between line baselines."
      ],
      correctIndex: 3,
      explanation: "Leading is line height, representing the vertical spacing between baselines."
    },
    {
      question: "Which category of typefaces has small decorative feet or strokes at the ends of letterforms?",
      options: ["Sans-Serif", "Serif", "Display", "Monospace"],
      correctIndex: 1,
      explanation: "Serif fonts feature decorative feet or brackets at the end of letter strokes (e.g. Times New Roman)."
    },
    {
      question: "What is the name of typefaces without small decorative feet (e.g. Helvetica, Arial)?",
      options: ["Serif", "Script", "Display", "Sans-Serif"],
      correctIndex: 3,
      explanation: "Sans-Serif fonts (from French 'sans' meaning 'without') lack decorative feet, creating a modern visual style."
    },
    {
      question: "What is 'Kerning' in typography?",
      options: ["The overall spacing across a block of text", "The adjustment of spacing between individual character pairs", "The vertical distance between line baselines", "The thickness of letter weights"],
      correctIndex: 1,
      explanation: "Kerning is the micro-adjustment of spacing between specific pairs of letters (like 'VA' or 'AV') to prevent awkward gaps."
    },
    {
      question: "What is 'Tracking' in typography?",
      options: ["The uniform adjustment of spacing across a range of text characters", "The vertical height of uppercase letters", "Tracking down missing fonts", "The alignment of text blocks to columns"],
      correctIndex: 0,
      explanation: "Tracking (letter-spacing) applies uniform spacing adjustments across an entire block of text."
    },
    {
      question: "What is the name for the portion of a lowercase letter that rises above the x-height?",
      options: ["Descender", "Ascender", "Counter", "Stem"],
      correctIndex: 1,
      explanation: "An ascender is the portion of a lowercase letter (like 'd', 'b', 'h') that extends above the main body line (x-height)."
    },
    {
      question: "What is the portion of a lowercase letter that drops below the baseline?",
      options: ["Ascender", "Descender", "Loop", "Terminal"],
      correctIndex: 1,
      explanation: "A descender is the portion of a lowercase letter (like 'g', 'p', 'y') that extends below the baseline."
    },
    {
      question: "Which typeface classification mimics elegant handwriting?",
      options: ["Serif", "Monospace", "Script", "Slab Serif"],
      correctIndex: 2,
      explanation: "Script fonts mimic formal or casual cursive handwriting, often used for invitations and certificates."
    },
    {
      question: "What is a 'font family'?",
      options: ["Fonts designed by the same person", "A collection of related fonts sharing the same style but differing in weight or slant", "The hierarchy of headers", "Default web safe fonts"],
      correctIndex: 1,
      explanation: "A font family includes related variations (e.g. Regular, Italic, Bold, Bold Italic) of a single typeface design."
    },
    {
      question: "What does the term 'x-height' refer to in typography anatomy?",
      options: ["The width of letter blocks", "The height of lowercase letters (excluding ascenders/descenders)", "The height of capitalized letters", "The crossbar width"],
      correctIndex: 1,
      explanation: "x-height is the height of the body of lowercase letters (specifically the letter 'x') sitting on the baseline."
    },
    {
      question: "In typographic hierarchy, which level is designed for primary body copy reading?",
      options: ["Level 1 (Headings)", "Level 2 (Sub-headings)", "Level 3 (Body copy details)", "Level 4 (Footnotes)"],
      correctIndex: 2,
      explanation: "Level 3 hierarchy is body copy—the bulk of the text designed for comfortable reading at small sizes (16px)."
    },
    {
      question: "What is a 'display typeface'?",
      options: ["A monospace coding font", "A typeface designed for large headlines (typically decorative)", "A font that displays on mobile screens", "A print-only font"],
      correctIndex: 1,
      explanation: "Display fonts are highly stylized typefaces meant for large headline use (18pt+), lacking legibility at small body copy sizes."
    },
    {
      question: "What is 'font pairing'?",
      options: ["Loading two identical fonts", "Combining two complementary typefaces to create hierarchy (e.g. Serif head + Sans body)", "Linking fonts to HTML layouts", "The spacing between two letters"],
      correctIndex: 1,
      explanation: "Font pairing is combining two distinct typefaces (often a sans-serif and a serif) to establish clear hierarchy and character."
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
      quizFeedbackText.textContent = "Perfect score! You've mastered Typographic Anatomy and layout hierarchy.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in spacing rules.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand baselines and line-length limits.";
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
