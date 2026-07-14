/* color-theory.js - Presentation Slide Deck Engine & Interactive Color Labs */

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

  // Overview Modal Builder
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
  // 2. INTERACTIVE MIXER: RGB vs CMYK
  // ==========================================
  
  const mixerContainer = document.getElementById('mixer-container');
  const mixDisplayArea = document.querySelector('.mix-display-area');
  const btnMixRgb = document.getElementById('btn-mix-rgb');
  const btnMixCmyk = document.getElementById('btn-mix-cmyk');

  function renderMixer(isCmyk) {
    mixerContainer.innerHTML = '';
    
    if (isCmyk) {
      mixDisplayArea.classList.add('cmyk-mode');
      btnMixCmyk.classList.add('active');
      btnMixRgb.classList.remove('active');
      
      // Cyan, Magenta, Yellow overlapping
      mixerContainer.innerHTML = `
        <div class="mixer-light-circle c-red" title="Cyan (subtracted Red)"></div>
        <div class="mixer-light-circle c-green" title="Magenta (subtracted Green)"></div>
        <div class="mixer-light-circle c-blue" title="Yellow (subtracted Blue)"></div>
      `;
    } else {
      mixDisplayArea.classList.remove('cmyk-mode');
      btnMixRgb.classList.add('active');
      btnMixCmyk.classList.remove('active');
      
      // Red, Green, Blue overlapping
      mixerContainer.innerHTML = `
        <div class="mixer-light-circle c-red" title="Red Light"></div>
        <div class="mixer-light-circle c-green" title="Green Light"></div>
        <div class="mixer-light-circle c-blue" title="Blue Light"></div>
      `;
    }
  }

  btnMixRgb.addEventListener('click', () => renderMixer(false));
  btnMixCmyk.addEventListener('click', () => renderMixer(true));

  // Initialize RGB Mixer default
  renderMixer(false);

  // ==========================================
  // 3. INTERACTIVE 12-HUE COLOR WHEEL
  // ==========================================
  
  const colorWheel = document.getElementById('color-wheel');
  const wheelDetails = document.getElementById('wheel-details');
  const wheelColorTitle = document.getElementById('wheel-color-title');
  const wheelColorDesc = document.getElementById('wheel-color-desc');

  const wheelHues = [
    { name: "Red", type: "Primary", hex: "#FF0000", desc: "A primary color. Stimulates urgency, excitement, and hunger. Used heavily in clearance sales and fast food branding." },
    { name: "Red-Orange", type: "Tertiary", hex: "#FF4500", desc: "A tertiary color. Combines the intensity of red with the friendliness of orange. High energy and active." },
    { name: "Orange", type: "Secondary", hex: "#FFA500", desc: "A secondary color. Represents playfulness, creativity, and enthusiasm. Perfect for inviting call-to-actions." },
    { name: "Yellow-Orange", type: "Tertiary", hex: "#FFD700", desc: "A tertiary color. Golden tint associated with warmth, optimism, premium quality, and sunshine." },
    { name: "Yellow", type: "Primary", hex: "#FFFF00", desc: "A primary color. Commands optimism, clarity, and warning. Seen immediately by the human eye; grabs focus." },
    { name: "Yellow-Green", type: "Tertiary", hex: "#98FB98", desc: "A tertiary color. Represents fresh growth, youth, and vibrant natural energy. Highly organic tone." },
    { name: "Green", type: "Secondary", hex: "#008000", desc: "A secondary color. Communicates health, peace, environment, and wealth. Deeply soothing and ecological." },
    { name: "Blue-Green", type: "Tertiary", hex: "#00FFFF", desc: "A tertiary color (Teal). Associated with clarity, digital modernity, tranquility, and clean design." },
    { name: "Blue", type: "Primary", hex: "#0000FF", desc: "A primary color. Represents trust, security, stability, and intelligence. The most preferred global corporate tone." },
    { name: "Blue-Violet", type: "Tertiary", hex: "#4B0082", desc: "A tertiary color (Indigo). Communicates cosmic depth, modern tech structures, and intelligence values." },
    { name: "Violet", type: "Secondary", hex: "#8F00FF", desc: "A secondary color. Represents royalty, mystery, luxury, and wisdom. Directs premium value associations." },
    { name: "Red-Violet", type: "Tertiary", hex: "#C71585", desc: "A tertiary color (Magenta). Represents creative energy, bold presence, passion, and artistic balance." }
  ];

  function drawColorWheel() {
    colorWheel.innerHTML = '';
    const svgNS = "http://www.w3.org/2000/svg";
    const svgEl = document.createElementNS(svgNS, "svg");
    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "100%");
    svgEl.setAttribute("viewBox", "0 0 300 300");
    svgEl.style.display = "block";

    const cx = 150;
    const cy = 150;
    const r = 135;

    // Helper to generate arc segments
    function getWedgePath(cx, cy, r, startAngle, endAngle) {
      const x1 = cx + r * Math.cos(startAngle * Math.PI / 180);
      const y1 = cy + r * Math.sin(startAngle * Math.PI / 180);
      const x2 = cx + r * Math.cos(endAngle * Math.PI / 180);
      const y2 = cy + r * Math.sin(endAngle * Math.PI / 180);
      const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
      return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    // 12 wedges of 30 degrees each (offsetting by -90 to start Red at the top)
    const wedgeAngle = 30;
    wheelHues.forEach((hue, idx) => {
      const startAngle = idx * wedgeAngle - 105;
      const endAngle = (idx + 1) * wedgeAngle - 105;

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", getWedgePath(cx, cy, r, startAngle, endAngle));
      path.setAttribute("fill", hue.hex);
      path.setAttribute("stroke", "#121522");
      path.setAttribute("stroke-width", "2");
      path.style.cursor = "pointer";
      path.style.transition = "transform 0.2s ease";

      path.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove scale highlight on paths
        const paths = svgEl.querySelectorAll('path');
        paths.forEach(p => {
          p.style.transform = 'scale(1)';
          p.setAttribute("stroke", "#121522");
        });

        // Highlight selected
        path.setAttribute("stroke", "#FFFFFF");
        
        // Render details card
        wheelColorTitle.textContent = `${hue.name} (${hue.type})`;
        wheelColorTitle.style.color = hue.hex;
        wheelColorDesc.innerHTML = `
          <strong>HEX Code:</strong> <span style="font-family: monospace;">${hue.hex}</span><br><br>
          ${hue.desc}
        `;
      });
      
      svgEl.appendChild(path);
    });

    // Add a dark inner circle for clean donut visual wheel look
    const innerCircle = document.createElementNS(svgNS, "circle");
    innerCircle.setAttribute("cx", cx);
    innerCircle.setAttribute("cy", cy);
    innerCircle.setAttribute("r", "50");
    innerCircle.setAttribute("fill", "#121522");
    svgEl.appendChild(innerCircle);

    colorWheel.appendChild(svgEl);
  }

  drawColorWheel();

  // ==========================================
  // 4. HSL PROPERTIES LABORATORY
  // ==========================================
  
  const sliderHue = document.getElementById('hsl-hue');
  const sliderSat = document.getElementById('hsl-sat');
  const sliderLight = document.getElementById('hsl-light');
  
  const valHue = document.getElementById('hsl-val-hue');
  const valSat = document.getElementById('hsl-val-sat');
  const valLight = document.getElementById('hsl-val-light');
  
  const propertiesCard = document.getElementById('properties-demo-card');

  function updateHslProperties() {
    const h = sliderHue.value;
    const s = sliderSat.value;
    const l = sliderLight.value;

    valHue.textContent = `${h}°`;
    valSat.textContent = `${s}%`;
    valLight.textContent = `${l}%`;

    // Apply color as background
    propertiesCard.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;

    // Ensure accessible contrast for text inside sample card based on lightness
    if (l < 45) {
      propertiesCard.style.color = '#F3F4F6';
      propertiesCard.querySelector('.card-badge').style.backgroundColor = 'rgba(255,255,255,0.15)';
      propertiesCard.querySelector('.card-badge').style.color = '#F3F4F6';
    } else {
      propertiesCard.style.color = '#0B0F17';
      propertiesCard.querySelector('.card-badge').style.backgroundColor = 'rgba(0,0,0,0.1)';
      propertiesCard.querySelector('.card-badge').style.color = '#0B0F17';
    }
  }

  sliderHue.addEventListener('input', updateHslProperties);
  sliderSat.addEventListener('input', updateHslProperties);
  sliderLight.addEventListener('input', updateHslProperties);

  // Initial update
  updateHslProperties();

  // ==========================================
  // 5. COLOR HARMONIES PALETTE GENERATOR
  // ==========================================
  
  const basePicker = document.getElementById('base-picker');
  const harmonyBtns = document.querySelectorAll('.h-selector-btn');
  const harmonyDisplay = document.getElementById('harmony-display');
  const harmonyDescCard = document.getElementById('harmony-desc-card');

  let activeHarmonyRule = 'analogous';

  const harmonyDescriptions = {
    analogous: {
      title: "Analogous Harmony",
      desc: "Uses adjacent colors on the color wheel. This creates low contrast and visual comfort, ideal for backgrounds and unified branding."
    },
    complementary: {
      title: "Complementary Harmony",
      desc: "Uses opposite colors on the color wheel. Creates high contrast and dramatic visual impact, great for CTA buttons and highlights."
    },
    triadic: {
      title: "Triadic Harmony",
      desc: "Three evenly spaced colors forming a triangle. Balanced and vibrant, providing contrast while maintaining order."
    },
    monochromatic: {
      title: "Monochromatic Harmony",
      desc: "Uses different values and saturation of a single base color. Minimalist, unified, and highly clean for corporate layouts."
    }
  };

  // Utilities
  function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`.toUpperCase();
  }

  function generateHarmonyPalettes() {
    const baseColor = basePicker.value;
    const hsl = hexToHsl(baseColor);
    let colors = [baseColor];

    if (activeHarmonyRule === 'complementary') {
      const compH = (hsl.h + 180) % 360;
      colors.push(hslToHex(compH, hsl.s, hsl.l));
      colors.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 95)));
      colors.push(hslToHex(compH, hsl.s, Math.max(hsl.l - 25, 10)));
    } else if (activeHarmonyRule === 'analogous') {
      const h1 = (hsl.h - 30 + 360) % 360;
      const h2 = (hsl.h + 30) % 360;
      colors.push(hslToHex(h1, hsl.s, hsl.l));
      colors.push(hslToHex(h2, hsl.s, hsl.l));
      colors.push(hslToHex(hsl.h, Math.max(hsl.s - 25, 10), Math.min(hsl.l + 20, 90)));
    } else if (activeHarmonyRule === 'triadic') {
      const h1 = (hsl.h + 120) % 360;
      const h2 = (hsl.h + 240) % 360;
      colors.push(hslToHex(h1, hsl.s, hsl.l));
      colors.push(hslToHex(h2, hsl.s, hsl.l));
      colors.push(hslToHex(hsl.h, Math.max(hsl.s - 15, 10), Math.max(hsl.l - 20, 15)));
    } else if (activeHarmonyRule === 'monochromatic') {
      colors.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 95)));
      colors.push(hslToHex(hsl.h, Math.max(hsl.s - 30, 10), hsl.l));
      colors.push(hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 25, 10)));
    }

    // Render swatches
    harmonyDisplay.innerHTML = '';
    colors.forEach(c => {
      const container = document.createElement('div');
      container.className = 'swatch-box';
      
      const swatch = document.createElement('div');
      swatch.className = 'swatch-col';
      swatch.style.backgroundColor = c;
      swatch.title = `Click to copy HEX ${c}`;
      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(c).then(() => alert(`Copied color ${c} to clipboard!`));
      });

      const label = document.createElement('span');
      label.className = 'swatch-hex';
      label.textContent = c;

      container.appendChild(swatch);
      container.appendChild(label);
      harmonyDisplay.appendChild(container);
    });

    // Update details card
    const info = harmonyDescriptions[activeHarmonyRule];
    harmonyDescCard.querySelector('h4').textContent = info.title;
    harmonyDescCard.querySelector('p').textContent = info.desc;
  }

  basePicker.addEventListener('input', generateHarmonyPalettes);

  harmonyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      harmonyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeHarmonyRule = btn.getAttribute('data-harmony');
      generateHarmonyPalettes();
    });
  });

  // Initial draw harmonies
  generateHarmonyPalettes();

  // ==========================================
  // 6. COLOR PSYCHOLOGY CARDS FLIP
  // ==========================================
  
  const psychCards = document.querySelectorAll('.psych-card');
  psychCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // ==========================================
  // 7. COLOR ACCESSIBILITY CVD SIMULATOR
  // ==========================================
  
  const cvdCanvas = document.getElementById('cvd-canvas');
  const cvdBtns = document.querySelectorAll('.select-cvd-controls button');

  cvdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cvdBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cvdType = btn.getAttribute('data-cvd');
      cvdCanvas.className = 'cvd-simulation-panel'; // Reset
      
      if (cvdType !== 'normal') {
        cvdCanvas.classList.add(`cvd-filter-${cvdType}`);
      }
    });
  });

  // ==========================================
  // 8. BRAND EXPLORER (TOP 10 GLOBAL BRANDS)
  // ==========================================
  
  const brandBtns = document.querySelectorAll('.brand-btn');
  const brandName = document.getElementById('brand-name');
  const brandHarmonyLabel = document.getElementById('brand-harmony');
  const brandSwatches = document.getElementById('brand-swatches');
  const brandDesc = document.getElementById('brand-desc');

  const brandData = {
    apple: {
      name: "Apple",
      harmony: "Monochromatic",
      colors: ["#000000", "#555555", "#CCCCCC", "#FFFFFF"],
      desc: "Apple relies on clean, monochromatic tones (blacks, greys, and whites) to communicate ultimate luxury, sleek minimalism, and premium material quality. Limiting color presence forces concentration on product contours and interface content."
    },
    google: {
      name: "Google",
      harmony: "Tetradic (Four Colors)",
      colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
      desc: "Google uses four primary/secondary colors (blue, red, yellow, green) arranged in an unaligned sequence. It represents visual playground energy, accessible friendliness, and a breaking of standard rigid corporate rules."
    },
    microsoft: {
      name: "Microsoft",
      harmony: "Tetradic (Four Colors)",
      colors: ["#F25022", "#7FBA00", "#00A4EF", "#FFB900"],
      desc: "Microsoft's four squares combine red (Office), green (Xbox), blue (Windows), and yellow (Bing) to communicate the vast diversity of their computing ecosystems and a structured, productive workplace."
    },
    amazon: {
      name: "Amazon",
      harmony: "Complementary Accent",
      colors: ["#11161F", "#FF9900", "#232F3E", "#FFFFFF"],
      desc: "Amazon uses deep dark slate for primary structure, paired with a sunset orange/amber accent (the smile arrow) representing friendly customer service, speed, warmth, and high active commerce energy."
    },
    samsung: {
      name: "Samsung",
      harmony: "Monochromatic Accent",
      colors: ["#0A47A3", "#073475", "#1866D6", "#FFFFFF"],
      desc: "Samsung relies on solid, reliable deep corporate blue. It anchors their brand identity around trust, technological precision, device safety, and secure global infrastructure."
    },
    toyota: {
      name: "Toyota",
      harmony: "High Contrast Complementary",
      colors: ["#EB0A1E", "#58595B", "#CCCCCC", "#FFFFFF"],
      desc: "Toyota pairs dynamic racing red with steel silver and dark grey. Red invokes active speed, driving excitement, and passion, while silver projects industrial precision and vehicle safety."
    },
    cocacola: {
      name: "Coca-Cola",
      harmony: "High Contrast Accent",
      colors: ["#F40009", "#000000", "#FFFFFF"],
      desc: "Coca-Cola's signature red triggers appetite, high excitement, warmth, and social energy. The extreme contrast against white script evokes a nostalgic, iconic visual identity."
    },
    mcdonalds: {
      name: "McDonald's",
      harmony: "Warm Complementary",
      colors: ["#DA291C", "#FFC72C", "#27251F", "#FFFFFF"],
      desc: "McDonald's combines red and yellow. Red stimulates appetite, pulse rates, and urgency, while yellow evokes friendly warmth and optimism. Together, they trigger subconscious hunger and fast traffic turnover."
    },
    nike: {
      name: "Nike",
      harmony: "Monochromatic Bold",
      colors: ["#000000", "#111111", "#F3F3F3", "#FFFFFF"],
      desc: "Nike relies on bold black and white. The absolute contrast projects athletic strength, premium product craftsmanship, and focus, allowing athletes' colored sportswear to capture attention."
    },
    disney: {
      name: "Disney",
      harmony: "Analogous Luxury",
      colors: ["#0B1B3D", "#8A6D3B", "#1C4E80", "#FFFFFF"],
      desc: "Disney uses a deep royal blue combined with metallic gold details. Royal blue invokes midnight dreaming and cosmic magic, while gold elements represent legacy, nostalgia, and premium entertainment."
    }
  };

  function displayBrandDetails(key) {
    const brand = brandData[key];
    if (!brand) return;

    brandName.textContent = brand.name;
    brandHarmonyLabel.textContent = brand.harmony;
    brandDesc.textContent = brand.desc;

    // Render brand color pills
    brandSwatches.innerHTML = '';
    brand.colors.forEach(c => {
      const pill = document.createElement('div');
      pill.className = 'brand-color-pill';
      
      const swatch = document.createElement('div');
      swatch.className = 'brand-pill-color';
      swatch.style.backgroundColor = c;
      swatch.title = `HEX: ${c}`;

      const label = document.createElement('span');
      label.className = 'brand-pill-label';
      label.textContent = c;

      pill.appendChild(swatch);
      pill.appendChild(label);
      brandSwatches.appendChild(pill);
    });
  }

  brandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      brandBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const brandKey = btn.getAttribute('data-brand');
      displayBrandDetails(brandKey);
    });
  });

  // Display default Apple on load
  displayBrandDetails('apple');

  // ==========================================
  // 9. COLOR REVIEW QUIZ
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
      question: "Which color model is additive and used for digital display monitors?",
      options: ["RGB", "CMYK", "HSL", "Pantone"],
      correctIndex: 0,
      explanation: "RGB is additive color using red, green, and blue light waves projected on screens."
    },
    {
      question: "Which color harmony is formed by selecting colors directly opposite each other on the color wheel?",
      options: ["Analogous", "Triadic", "Complementary", "Monochromatic"],
      correctIndex: 2,
      explanation: "Complementary colors are opposite hues (180° offset), creating dramatic contrast."
    },
    {
      question: "Under the WCAG 2.1 guidelines, what is the minimum contrast ratio required for normal body text (under 18pt)?",
      options: ["3.0:1", "4.5:1", "7.0:1", "1.5:1"],
      correctIndex: 1,
      explanation: "WCAG AA standards require a minimum contrast ratio of 4.5:1 for normal body text."
    },
    {
      question: "What are the three primary colors in the subtractive color model (RYB)?",
      options: ["Red, Green, Blue", "Red, Yellow, Blue", "Cyan, Magenta, Yellow", "Orange, Green, Violet"],
      correctIndex: 1,
      explanation: "In traditional artistic painting, the primary colors are Red, Yellow, and Blue."
    },
    {
      question: "Which color model is used for physical paper printing?",
      options: ["RGB", "CMYK", "HSL", "Hexadecimal"],
      correctIndex: 1,
      explanation: "CMYK (Cyan, Magenta, Yellow, Key Black) is the subtractive color model used in printing."
    },
    {
      question: "What is the term for the pure state of a color, or its core name?",
      options: ["Tint", "Tone", "Shade", "Hue"],
      correctIndex: 3,
      explanation: "Hue describes the pure color wavelength, such as pure red, blue, or yellow."
    },
    {
      question: "How do you create a 'Tint' of a color?",
      options: ["By adding black", "By adding white", "By adding grey", "By mixing with complementary hues"],
      correctIndex: 1,
      explanation: "Adding white to a pure hue creates a Tint, increasing its value (brightness)."
    },
    {
      question: "How do you create a 'Shade' of a color?",
      options: ["By adding black", "By adding white", "By adding grey", "By increasing saturation"],
      correctIndex: 0,
      explanation: "Adding black to a pure hue creates a Shade, reducing its value (making it darker)."
    },
    {
      question: "How do you create a 'Tone' of a color?",
      options: ["By adding black", "By adding white", "By adding grey", "By adding yellow"],
      correctIndex: 2,
      explanation: "Adding grey (or both black and white) to a pure hue creates a Tone, desaturating the color."
    },
    {
      question: "What color harmony is formed by three colors adjacent to each other on the color wheel?",
      options: ["Analogous", "Complementary", "Triadic", "Split-Complementary"],
      correctIndex: 0,
      explanation: "Analogous colors are adjacent on the wheel (e.g. Yellow, Yellow-Green, Green), offering calming harmony."
    },
    {
      question: "What does the 'S' in HSL stand for?",
      options: ["Spectrum", "Shade", "Saturation", "Structure"],
      correctIndex: 2,
      explanation: "HSL stands for Hue, Saturation, and Lightness. Saturation is the intensity/purity of the color."
    },
    {
      question: "Which color is most commonly associated with trust, security, and professionalism in brand psychology?",
      options: ["Red", "Yellow", "Blue", "Black"],
      correctIndex: 2,
      explanation: "Blue is widely used by corporate, financial, and tech brands to project security, trust, and intelligence."
    },
    {
      question: "Which color vision deficiency is commonly known as red-blindness?",
      options: ["Protanopia", "Deuteranopia", "Tritanopia", "Monochromacy"],
      correctIndex: 0,
      explanation: "Protanopia is red-blindness (difficulty perceiving red light wavelengths)."
    },
    {
      question: "What color harmony consists of three colors spaced equally around the color wheel?",
      options: ["Triadic", "Analogous", "Complementary", "Tetradic"],
      correctIndex: 0,
      explanation: "A triadic harmony uses three colors spaced 120° apart (forming an equilateral triangle, like Red, Yellow, Blue)."
    },
    {
      question: "What is the term for color schemes that use different values (lightness) of a single hue?",
      options: ["Analogous", "Complementary", "Monochromatic", "Achromatic"],
      correctIndex: 2,
      explanation: "Monochromatic schemes use a single base hue with varying tints, shades, and tones."
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
      quizFeedbackText.textContent = "Perfect score! You've mastered Color Theory & brand systems.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in the rest of color psychology.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand RGB mixing and WCAG guidelines.";
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
