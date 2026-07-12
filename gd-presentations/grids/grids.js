/* grids.js - Presentation Slide Deck Engine & Grid Visual Laboratories */

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
  // 2. GRID ANATOMY GUIDE OVERLAYS (TOOLTIP)
  // ==========================================
  
  const anatomyBtns = document.querySelectorAll('.anatomy-term-btn');
  const tooltip = document.getElementById('anatomy-tooltip');
  
  const highlights = {
    margin: [
      document.getElementById('high-margin-l'),
      document.getElementById('high-margin-r'),
      document.getElementById('high-margin-t'),
      document.getElementById('high-margin-b')
    ],
    gutter: [
      document.getElementById('high-gutter-1'),
      document.getElementById('high-gutter-2')
    ],
    column: [
      document.getElementById('col-1'),
      document.getElementById('col-2'),
      document.getElementById('col-3')
    ],
    cell: [
      document.getElementById('high-cell')
    ]
  };

  const anatomyDescriptions = {
    margin: {
      title: "Margins",
      desc: "The blank space surrounding the outer edges of the grid canvas, framing content fields safely."
    },
    column: {
      title: "Columns",
      desc: "Vertical tracks of space stretching from margin to margin. They form column divisions."
    },
    gutter: {
      title: "Gutters",
      desc: "The blank vertical columns separating layouts column margins to prevent overlapping elements."
    },
    cell: {
      title: "Grid Cells / Modules",
      desc: "Individual cells formed by the horizontal and vertical line intersections. Ideal for modular grids."
    }
  };

  // Cursor Tooltip coordinates listener
  document.addEventListener('mousemove', (e) => {
    if (tooltip.classList.contains('visible')) {
      let x = e.clientX + 15;
      let y = e.clientY + 15;
      // Boundaries checks
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
      
      // Highlight matching anatomy sections
      if (highlights[part]) {
        highlights[part].forEach(element => {
          if (part === 'column') {
            element.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
            element.style.borderColor = 'var(--color-primary)';
          } else {
            element.classList.add('active');
          }
        });
      }

      // Update tooltip text
      const data = anatomyDescriptions[part];
      if (data) {
        tooltip.innerHTML = `<strong>${data.title}</strong>${data.desc}`;
        tooltip.classList.add('visible');
      }
    }

    function deactivatePart() {
      btn.classList.remove('active');
      
      // Reset highlights
      Object.values(highlights).flat().forEach(element => {
        element.classList.remove('active');
        element.style.backgroundColor = '';
        element.style.borderColor = '';
      });

      tooltip.classList.remove('visible');
    }

    btn.addEventListener('mouseenter', activatePart);
    btn.addEventListener('mouseleave', deactivatePart);
    
    // Touch support click
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
    Object.values(highlights).flat().forEach(element => {
      element.classList.remove('active');
      element.style.backgroundColor = '';
      element.style.borderColor = '';
    });
    tooltip.classList.remove('visible');
  });

  // ==========================================
  // 3. 12-COLUMN WEB GRID SPAN EXPLORER
  // ==========================================
  
  const spanBtns = document.querySelectorAll('[data-span]');
  const spanWrapper = document.getElementById('span-elements-wrapper');

  function renderSpanBlocks(spanType) {
    spanWrapper.innerHTML = '';
    
    if (spanType === '6-6') {
      spanWrapper.innerHTML = `
        <div class="span-mock-card" style="grid-column: span 6;">Span 6 (50%)</div>
        <div class="span-mock-card" style="grid-column: span 6;">Span 6 (50%)</div>
      `;
    } else if (spanType === '4-4-4') {
      spanWrapper.innerHTML = `
        <div class="span-mock-card" style="grid-column: span 4;">Span 4 (33%)</div>
        <div class="span-mock-card" style="grid-column: span 4;">Span 4 (33%)</div>
        <div class="span-mock-card" style="grid-column: span 4;">Span 4 (33%)</div>
      `;
    } else if (spanType === '3-3-3-3') {
      spanWrapper.innerHTML = `
        <div class="span-mock-card" style="grid-column: span 3;">Span 3 (25%)</div>
        <div class="span-mock-card" style="grid-column: span 3;">Span 3 (25%)</div>
        <div class="span-mock-card" style="grid-column: span 3;">Span 3 (25%)</div>
        <div class="span-mock-card" style="grid-column: span 3;">Span 3 (25%)</div>
      `;
    } else if (spanType === '3-9') {
      spanWrapper.innerHTML = `
        <div class="span-mock-card" style="grid-column: span 3;">Span 3 (Sidebar)</div>
        <div class="span-mock-card" style="grid-column: span 9; background-color: var(--color-accent); box-shadow: 0 4px 15px var(--color-accent-glow);">Span 9 (Content)</div>
      `;
    }
  }

  spanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      spanBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const spanType = btn.getAttribute('data-span');
      renderSpanBlocks(spanType);
    });
  });

  // Initial draw 6-6 span
  renderSpanBlocks('6-6');

  // ==========================================
  // 4. MODULAR GRID GENERATOR
  // ==========================================
  
  const sliderModCols = document.getElementById('mod-cols');
  const sliderModRows = document.getElementById('mod-rows');
  const valModCols = document.getElementById('val-mod-cols');
  const valModRows = document.getElementById('val-mod-rows');
  const modularGridCanvas = document.getElementById('modular-grid-canvas');

  function generateModularGrid() {
    const cols = parseInt(sliderModCols.value);
    const rows = parseInt(sliderModRows.value);

    valModCols.textContent = cols;
    valModRows.textContent = rows;

    modularGridCanvas.innerHTML = '';
    modularGridCanvas.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    modularGridCanvas.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Generate grid modules
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'modular-cell';
        cell.textContent = `C${c}-R${r}`;
        modularGridCanvas.appendChild(cell);
      }
    }
  }

  sliderModCols.addEventListener('input', generateModularGrid);
  sliderModRows.addEventListener('input', generateModularGrid);

  // Initial modular draw
  generateModularGrid();

  // ==========================================
  // 5. RULE OF THIRDS ALIGNER
  // ==========================================
  
  const nodes = document.querySelectorAll('.intersection-node');
  const thirdsFocal = document.getElementById('thirds-focal');
  const thirdsScore = document.getElementById('thirds-score');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const targetTop = node.style.top;
      const targetLeft = node.style.left;

      thirdsFocal.style.top = targetTop;
      thirdsFocal.style.left = targetLeft;

      // Update balance score details
      if (node.id === 'node-center') {
        thirdsScore.textContent = "Stable Center Composition (Neutral)";
        thirdsScore.className = 'badge-status warning';
        thirdsFocal.style.backgroundColor = 'var(--color-primary)';
      } else {
        thirdsScore.textContent = "Excellent Focal Tension (Rule of Thirds Intersection) (PASS)";
        thirdsScore.className = 'badge-status pass';
        thirdsFocal.style.backgroundColor = 'var(--color-accent)';
      }
    });
  });

  // ==========================================
  // 6. VIEWPORT SIMULATOR BREAKPOINTS
  // ==========================================
  
  const widthSlider = document.getElementById('sim-width-slider');
  const valWidth = document.getElementById('val-sim-width');
  const simWrapper = document.getElementById('sim-wrapper');

  widthSlider.addEventListener('input', () => {
    const val = widthSlider.value;
    simWrapper.style.width = `${val}%`;

    // Breakpoints classifications
    if (val > 80) {
      valWidth.textContent = `${val}% (Desktop - 3 Columns)`;
      simWrapper.className = 'responsive-sim-wrapper';
    } else if (val <= 80 && val > 55) {
      valWidth.textContent = `${val}% (Tablet - 2 Columns)`;
      simWrapper.className = 'responsive-sim-wrapper tablet-sim';
    } else {
      valWidth.textContent = `${val}% (Mobile - 1 Column Stack)`;
      simWrapper.className = 'responsive-sim-wrapper mobile-sim';
    }
  });

  // ==========================================
  // 7. GRID VS FLEXBOX SIMULATOR
  // ==========================================
  
  const btnShowGrid = document.getElementById('btn-show-grid');
  const btnShowFlex = document.getElementById('btn-show-flex');
  const gfWrapper = document.getElementById('grid-flex-wrapper');

  btnShowGrid.addEventListener('click', () => {
    gfWrapper.className = 'grid-flex-demo-wrapper show-grid';
    btnShowGrid.classList.add('active');
    btnShowFlex.classList.remove('active');
  });

  btnShowFlex.addEventListener('click', () => {
    gfWrapper.className = 'grid-flex-demo-wrapper show-flex';
    btnShowFlex.classList.add('active');
    btnShowGrid.classList.remove('active');
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
      question: "What are the spacing gaps between columns in a grid anatomy called?",
      options: ["Margins", "Flowlines", "Gutters", "Cells"],
      correctIndex: 2,
      explanation: "Gutters are the empty spacing bands separating column tracks to prevent text columns merging."
    },
    {
      question: "Why is a 12-column grid standard for web layout frameworks?",
      options: [
        "Because it spans exactly 1200px wide.",
        "Because 12 is easily divided by 2, 3, 4, and 6, enabling versatile layout divisions.",
        "Because mobile screens require 12 columns.",
        "Because Josef Müller-Brockmann codified it."
      ],
      correctIndex: 1,
      explanation: "A 12-column grid is highly versatile because it can split symmetrically, in thirds, or in quarters."
    },
    {
      question: "When should you use CSS Grid instead of Flexbox in frontend development?",
      options: [
        "When aligning items only horizontally.",
        "When designing single-dimensional (1D) menus.",
        "When structuring complex two-dimensional (2D) rows and columns layout shells.",
        "They are identical."
      ],
      correctIndex: 2,
      explanation: "CSS Grid is built for 2D structures (columns and rows), while Flexbox handles 1D axes layout lists."
    },
    {
      question: "What are the horizontal and vertical margins boundaries of a grid canvas called?",
      options: ["Gutters", "Flowlines", "Margins", "Spatial zones"],
      correctIndex: 2,
      explanation: "Margins represent the negative outer border spacing framing the entire layout grid."
    },
    {
      question: "What are the vertical division tracks of content in a layout grid?",
      options: ["Rows", "Columns", "Gutters", "Flowlines"],
      correctIndex: 1,
      explanation: "Columns represent vertical content alignment tracks stretching from margin to margin."
    },
    {
      question: "What are the horizontal alignment bands called in typographic grids?",
      options: ["Margins", "Gutters", "Flowlines", "Columns"],
      correctIndex: 2,
      explanation: "Flowlines represent horizontal layout tracks, coordinating consistent vertical starting points for titles and images."
    },
    {
      question: "What are the individual grid cells formed by row/column intersections?",
      options: ["Margins", "Gutters", "Modules", "Tracks"],
      correctIndex: 2,
      explanation: "Modules (or grid cells) represent individual rectangular areas formed by rows and columns intersections."
    },
    {
      question: "What is a group of adjacent modules merged to form a larger content section?",
      options: ["Gutter line", "Spatial Zone or Field", "Grid Column", "Flex block"],
      correctIndex: 1,
      explanation: "A Spatial Zone is a larger field formed by grouping multiple cells together to host large images or cards."
    },
    {
      question: "What type of grid uses irregular, content-driven tracks rather than uniform columns?",
      options: ["Modular Grid", "Hierarchical Grid", "12-Column Grid", "Symmetrical Grid"],
      correctIndex: 1,
      explanation: "Hierarchical grids use custom, content-driven layouts (common in creative portfolios and newspaper layouts)."
    },
    {
      question: "What is the 'Rule of Thirds' composition style?",
      options: [
        "Using exactly three colors in a palette",
        "Dividing the layout with a 3x3 grid and placing key subjects on the line intersections",
        "Sizing headers exactly three times the body font",
        "Limiting designs to 3 elements"
      ],
      correctIndex: 1,
      explanation: "The Rule of Thirds divides a composition into thirds (horizontally and vertically) to align focal targets with intersection nodes."
    },
    {
      question: "What composition balance score is typically achieved by placing subjects at rule-of-thirds intersections?",
      options: ["Stable but boring center composition", "High visual interest and tension balance", "Overcrowded unbalanced structure", "Negative contrast ratios"],
      correctIndex: 1,
      explanation: "Aligning subjects to intersections creates dynamic visual tension, making compositions feel more natural and active."
    },
    {
      question: "What is a 'responsive breakpoint'?",
      options: [
        "The CSS grid line separating headers",
        "The screen width threshold where a layout collapses columns for mobile",
        "A coding error breaking browser compiling",
        "The space size of page margins"
      ],
      correctIndex: 1,
      explanation: "Breakpoints are browser viewport widths where stylesheet media queries adapt columns structures."
    },
    {
      question: "How does a 3-column desktop layout adapt to a mobile phone screen?",
      options: ["By scaling colors monochromatic", "By collapsing columns into a single vertical stack", "By hiding gutters", "It stays identical and requires horizontal scrolling"],
      correctIndex: 1,
      explanation: "To maintain readable fonts, multi-column desktop layouts collapse into a single-column stack on mobile."
    },
    {
      question: "What layout engine is best for 2-dimensional grid tracks (rows and columns)?",
      options: ["Flexbox", "float: left", "CSS Grid", "Bootstrap Inline-block"],
      correctIndex: 2,
      explanation: "CSS Grid is built specifically for two-dimensional layouts, controlling rows and columns simultaneously."
    },
    {
      question: "Who was the prominent Swiss designer who codified typographic grid systems in the 1950s/60s?",
      options: ["Paul Rand", "Josef Müller-Brockmann", "Stefan Sagmeister", "Saul Bass"],
      correctIndex: 1,
      explanation: "Josef Müller-Brockmann was a pioneer of the International Typographic Style, writing the seminal book 'Grid Systems in Graphic Design'."
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
      quizFeedbackText.textContent = "Perfect score! You've mastered Grid Systems & layout frameworks.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in CSS Grid vs Flexbox details.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand gutters and 12-column subdivisions.";
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
