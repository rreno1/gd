/* app.js - Presentation Slide Deck Engine and Interactive Lab Components */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. CORE PRESENTATION ENGINE
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

  // Render Slide Overview Grid in Modal
  function buildOverviewGrid() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide, idx) => {
      const titleEl = slide.querySelector('h2');
      const titleText = titleEl ? titleEl.textContent : (idx === 0 ? "Title Slide" : `Slide ${idx + 1}`);
      
      let description = "Introduction and basics";
      if (idx === 1) description = "Visual communication fundamentals";
      else if (idx === 2) description = "Point, line, shape, and spaces";
      else if (idx === 3) description = "Composition & alignment rules";
      else if (idx === 4) description = "Font pairings & type laboratory";
      else if (idx === 5) description = "Hue, values, and palettes generator";
      else if (idx === 6) description = "Invisible layouts skeleton";
      else if (idx === 7) description = "WCAG standards & accessibility tool";
      else if (idx === 8) description = "Interactive drag & drop poster challenge";
      else if (idx === 9) description = "Next steps & student references";

      const card = document.createElement('div');
      card.className = `overview-card ${idx === currentSlideIndex ? 'active' : ''}`;
      card.innerHTML = `
        <span class="overview-card-num">Slide ${String(idx + 1).padStart(2, '0')}</span>
        <h4 class="overview-card-title">${titleText}</h4>
        <p class="overview-card-desc">${description}</p>
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
    
    // Deactivate current slide
    slides[currentSlideIndex].classList.remove('active');
    slides[currentSlideIndex].classList.remove('prev');
    
    // Tag previous slides for reverse animation handling if needed
    for (let i = 0; i < totalSlides; i++) {
      if (i < index) {
        slides[i].classList.add('prev');
      } else {
        slides[i].classList.remove('prev');
      }
    }

    currentSlideIndex = index;
    slides[currentSlideIndex].classList.add('active');
    
    // Update controls
    currentSlideNum.textContent = currentSlideIndex + 1;
    progressFill.style.width = `${(currentSlideIndex / (totalSlides - 1)) * 100}%`;
    
    // Disable/enable controls at boundary
    btnPrev.disabled = currentSlideIndex === 0;
    btnNext.disabled = currentSlideIndex === totalSlides - 1;

    // Dispatch custom slide-changed event for widget initializations if on visible slide
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

  // Event Listeners
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  
  document.addEventListener('keydown', (e) => {
    // Prevent arrow keys scrolling in interactive elements
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT' || document.activeElement.getAttribute('contenteditable') === 'true') {
      return;
    }
    
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

  // Touch Swipe navigation
  let touchStartX = 0;
  let touchEndX = 0;
  
  const viewport = document.getElementById('slides-viewport');
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    // Ignore small movements
    if (Math.abs(touchStartX - touchEndX) < 60) return;
    
    // Ignore swipes originating in draggable sandbox items
    if (document.activeElement && document.activeElement.classList.contains('sandbox-item')) return;

    if (touchStartX > touchEndX) {
      nextSlide(); // Swipe left
    } else {
      prevSlide(); // Swipe right
    }
  }

  // Fullscreen support
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  btnFullscreen.addEventListener('click', toggleFullscreen);

  // Overview Modal
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

  // Initialize navigation status
  goToSlide(0);

  // ==========================================
  // 2. SLIDE 4: PRINCIPLES DEMONSTRATION WIDGET
  // ==========================================
  
  const principleItems = document.querySelectorAll('.principle-item');
  const demoVisual = document.getElementById('principle-demo-visual');
  const demoDesc = document.getElementById('principle-demo-desc');

  const principleDemos = {
    balance: {
      desc: "Symmetrical balance distributes weight evenly along a central axis, creating stability and formal layout symmetry.",
      html: `
        <div class="demo-balance-symmetric">
          <div class="bal-left"></div>
          <div class="bal-pivot"></div>
          <div class="bal-right"></div>
        </div>
      `
    },
    contrast: {
      desc: "Contrast highlights differences to guide the eye. Good contrast (high accessibility contrast) stands out instantly, while poor contrast disappears.",
      html: `
        <div class="demo-contrast-grid">
          <div class="contrast-bad">No contrast</div>
          <div class="contrast-good">Contrast!</div>
        </div>
      `
    },
    hierarchy: {
      desc: "Visual hierarchy prioritizes content size, weight, and positioning so the reader's eye naturally scans elements in a predefined order.",
      html: `
        <div class="demo-hierarchy-box">
          <div class="hier-1">1. READ ME FIRST</div>
          <div class="hier-2">2. Read me second</div>
          <div class="hier-3">3. Finally, read this details paragraph that explains the supporting background information in smaller body font.</div>
        </div>
      `
    },
    repetition: {
      desc: "Repetition creates structure and consistency. Repeating shapes, margins, and accent colors makes a design feel united and intentional.",
      html: `
        <div class="demo-repetition-box">
          <div class="rep-shape"></div>
          <div class="rep-shape"></div>
          <div class="rep-shape"></div>
          <div class="rep-shape accent"></div>
          <div class="rep-shape"></div>
        </div>
      `
    }
  };

  principleItems.forEach(item => {
    item.addEventListener('click', () => {
      principleItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const key = item.getAttribute('data-principle');
      if (principleDemos[key]) {
        // Trigger fade effect during content swapping
        demoVisual.style.opacity = 0;
        setTimeout(() => {
          demoVisual.innerHTML = principleDemos[key].html;
          demoDesc.textContent = principleDemos[key].desc;
          demoVisual.style.opacity = 1;
        }, 150);
      }
    });
  });

  // ==========================================
  // 3. SLIDE 5: INTERACTIVE TYPOGRAPHY LABORATORY
  // ==========================================
  
  const fontBtns = document.querySelectorAll('.font-btn');
  const typoPreview = document.getElementById('typo-preview-text');
  const sliderWeight = document.getElementById('slider-weight');
  const sliderLeading = document.getElementById('slider-leading');
  const sliderTracking = document.getElementById('slider-tracking');
  const valWeight = document.getElementById('val-weight');
  const valLeading = document.getElementById('val-leading');
  const valTracking = document.getElementById('val-tracking');

  function updateTypography() {
    const weight = sliderWeight.value;
    const leading = sliderLeading.value;
    const tracking = sliderTracking.value;

    valWeight.textContent = weight;
    valLeading.textContent = leading;
    valTracking.textContent = tracking + 'px';

    typoPreview.style.fontWeight = weight;
    typoPreview.style.lineHeight = leading;
    typoPreview.style.letterSpacing = tracking + 'px';
  }

  sliderWeight.addEventListener('input', updateTypography);
  sliderLeading.addEventListener('input', updateTypography);
  sliderTracking.addEventListener('input', updateTypography);

  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const fontType = btn.getAttribute('data-font');
      typoPreview.className = 'typo-preview'; // Reset
      
      if (fontType === 'sans') {
        typoPreview.classList.add('font-sans');
      } else if (fontType === 'serif') {
        typoPreview.classList.add('font-serif');
      } else if (fontType === 'mono') {
        typoPreview.classList.add('font-mono');
      }
    });
  });

  // ==========================================
  // 4. SLIDE 6: INTERACTIVE COLOR THEORY HARMONY
  // ==========================================
  
  const baseColorInput = document.getElementById('base-color');
  const harmonySelect = document.getElementById('harmony-select');
  const paletteDisplay = document.getElementById('palette-display');
  const harmonyConcepts = document.querySelectorAll('.h-concept');
  const paletteTitle = document.getElementById('palette-title');
  const paletteDesc = document.getElementById('palette-desc');

  const harmonyDescriptions = {
    analogous: {
      title: "Analogous Harmony",
      desc: "Uses colors that are adjacent on the color wheel (e.g., 30° offsets). Highly serene, unified, and matching. Common in nature landscapes."
    },
    complementary: {
      title: "Complementary Harmony",
      desc: "Uses colors directly opposite each other on the color wheel (180° offset). High contrast, high-energy impact. Perfect for CTA buttons or poster highlights."
    },
    triadic: {
      title: "Triadic Harmony",
      desc: "Uses three colors evenly spaced at 120° offsets around the wheel. Offers high visual contrast while maintaining balance and vibrance."
    },
    monochromatic: {
      title: "Monochromatic Harmony",
      desc: "Varies the lightness and saturation of a single base color. Minimalist, sophisticated, and incredibly easy to pair with text."
    }
  };

  // Hex to HSL utility
  function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
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

  // HSL to Hex utility
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`.toUpperCase();
  }

  function generatePalette() {
    const baseHex = baseColorInput.value;
    const rule = harmonySelect.value;
    const baseHsl = hexToHsl(baseHex);
    let colors = [];

    // Base color is always swatch 1
    colors.push(baseHex);

    if (rule === 'complementary') {
      const compHue = (baseHsl.h + 180) % 360;
      colors.push(hslToHex(compHue, baseHsl.s, baseHsl.l));
      
      // Add supportive tints/shades
      colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 25, 95)));
      colors.push(hslToHex(compHue, baseHsl.s, Math.max(baseHsl.l - 25, 10)));
    } else if (rule === 'analogous') {
      const hue1 = (baseHsl.h - 30 + 360) % 360;
      const hue2 = (baseHsl.h + 30) % 360;
      colors.push(hslToHex(hue1, baseHsl.s, baseHsl.l));
      colors.push(hslToHex(hue2, baseHsl.s, baseHsl.l));
      colors.push(hslToHex(baseHsl.h, Math.max(baseHsl.s - 20, 20), Math.min(baseHsl.l + 20, 90)));
    } else if (rule === 'triadic') {
      const hue1 = (baseHsl.h + 120) % 360;
      const hue2 = (baseHsl.h + 240) % 360;
      colors.push(hslToHex(hue1, baseHsl.s, baseHsl.l));
      colors.push(hslToHex(hue2, baseHsl.s, baseHsl.l));
      colors.push(hslToHex(baseHsl.h, Math.max(baseHsl.s - 15, 10), Math.max(baseHsl.l - 20, 15)));
    } else if (rule === 'monochromatic') {
      colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 30, 95)));
      colors.push(hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 25, 10)));
      colors.push(hslToHex(baseHsl.h, Math.max(baseHsl.s - 40, 10), baseHsl.l));
    }

    // Render Swatches
    paletteDisplay.innerHTML = '';
    colors.forEach(color => {
      const wrapper = document.createElement('div');
      wrapper.className = 'color-swatch-box';
      
      const swatch = document.createElement('div');
      swatch.className = 'swatch';
      swatch.style.backgroundColor = color;
      swatch.title = `Click to copy HEX ${color}`;
      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(color).then(() => {
          alert(`Copied color ${color} to clipboard!`);
        });
      });
      
      const label = document.createElement('span');
      label.className = 'swatch-label';
      label.textContent = color;

      wrapper.appendChild(swatch);
      wrapper.appendChild(label);
      paletteDisplay.appendChild(wrapper);
    });

    // Update details card
    const info = harmonyDescriptions[rule];
    paletteTitle.textContent = info.title;
    paletteDesc.textContent = info.desc;

    // Sync concept list highlight
    harmonyConcepts.forEach(c => {
      if (c.getAttribute('data-rule') === rule) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  baseColorInput.addEventListener('input', generatePalette);
  harmonySelect.addEventListener('change', generatePalette);

  harmonyConcepts.forEach(concept => {
    concept.addEventListener('click', () => {
      harmonySelect.value = concept.getAttribute('data-rule');
      generatePalette();
    });
  });

  // Initial draw
  generatePalette();

  // ==========================================
  // 5. SLIDE 7: GRID OVERLAY TOGGLE
  // ==========================================
  
  const btnToggleGrid = document.getElementById('btn-toggle-grid');
  const gridOverlay = document.getElementById('grid-overlay');

  btnToggleGrid.addEventListener('click', () => {
    gridOverlay.classList.toggle('hidden');
    btnToggleGrid.classList.toggle('active');
    
    if (btnToggleGrid.classList.contains('active')) {
      btnToggleGrid.style.backgroundColor = 'var(--color-accent)';
      btnToggleGrid.style.borderColor = 'var(--color-accent)';
    } else {
      btnToggleGrid.style.backgroundColor = '';
      btnToggleGrid.style.borderColor = '';
    }
  });

  // Automatically close grid overlay if moving away from Slide 7 to prevent clutter
  document.addEventListener('slideChanged', (e) => {
    if (e.detail.slideIndex !== 6 && !gridOverlay.classList.contains('hidden')) {
      gridOverlay.classList.add('hidden');
      btnToggleGrid.classList.remove('active');
      btnToggleGrid.style.backgroundColor = '';
      btnToggleGrid.style.borderColor = '';
    }
  });

  // ==========================================
  // 6. SLIDE 8: ACCESSIBILITY CONTRAST TESTER
  // ==========================================
  
  const colorFg = document.getElementById('color-fg');
  const colorBg = document.getElementById('color-bg');
  const colorFgText = document.getElementById('color-fg-text');
  const colorBgText = document.getElementById('color-bg-text');
  const previewBlock = document.getElementById('contrast-preview-block');
  const contrastRatioVal = document.getElementById('contrast-ratio-val');
  const ratingNormal = document.getElementById('rating-normal');
  const ratingLarge = document.getElementById('rating-large');

  // Relative luminance calculation helper
  function getLuminance(r, g, b) {
    let a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  function calculateContrast() {
    const fgHex = colorFg.value;
    const bgHex = colorBg.value;

    const fgRgb = hexToRgb(fgHex);
    const bgRgb = hexToRgb(bgHex);

    const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
    const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    const ratio = (brightest + 0.05) / (darkest + 0.05);
    const ratioRounded = Math.round(ratio * 100) / 100;

    // Update ratio label
    contrastRatioVal.textContent = `${ratioRounded}:1`;

    // Normal text rating (AA threshold is 4.5:1)
    if (ratioRounded >= 4.5) {
      ratingNormal.textContent = "PASS";
      ratingNormal.className = "badge-status pass";
    } else {
      ratingNormal.textContent = "FAIL";
      ratingNormal.className = "badge-status fail";
    }

    // Large text rating (AA threshold is 3.0:1)
    if (ratioRounded >= 3.0) {
      ratingLarge.textContent = "PASS";
      ratingLarge.className = "badge-status pass";
    } else {
      ratingLarge.textContent = "FAIL";
      ratingLarge.className = "badge-status fail";
    }

    // Update preview block inline styling
    previewBlock.style.color = fgHex;
    previewBlock.style.backgroundColor = bgHex;
  }

  // Double sync color picker & text inputs
  colorFg.addEventListener('input', () => {
    colorFgText.value = colorFg.value.toUpperCase();
    calculateContrast();
  });
  colorBg.addEventListener('input', () => {
    colorBgText.value = colorBg.value.toUpperCase();
    calculateContrast();
  });

  colorFgText.addEventListener('change', () => {
    let hex = colorFgText.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      colorFg.value = hex;
      calculateContrast();
    } else {
      colorFgText.value = colorFg.value.toUpperCase();
    }
  });

  colorBgText.addEventListener('change', () => {
    let hex = colorBgText.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      colorBg.value = hex;
      calculateContrast();
    } else {
      colorBgText.value = colorBg.value.toUpperCase();
    }
  });

  // Initial contrast evaluation
  calculateContrast();

  // ==========================================
  // 7. SLIDE 9: DESIGN SANDBOX WIDGET
  // ==========================================
  
  const sandboxCanvas = document.getElementById('sandbox-canvas');
  const sbColorTheme = document.getElementById('sb-color-theme');
  const sbBtnReset = document.getElementById('sb-btn-reset');
  const sbBtnExport = document.getElementById('sb-btn-export');
  const addAssetBtns = document.querySelectorAll('.add-asset-btn');

  let selectedItem = null;

  // Sandbox Presets Configuration
  const defaultAssets = [
    { type: 'badge', text: 'CREATIVE HUB', top: 50, left: 180 },
    { type: 'title', text: 'DESIGN IS A SOLVED PROBLEM', top: 90, left: 50 },
    { type: 'subtitle', text: 'A study of typography & layouts', top: 220, left: 50 },
    { type: 'text', text: 'Graphic design uses grids, colors, and type scale to build visual hierarchy. Align elements neatly to establish structure.', top: 280, left: 50 },
    { type: 'card', text: '', top: 380, left: 50, width: 400, height: 80 }
  ];

  function createSandboxItem(data) {
    const item = document.createElement('div');
    item.className = `sandbox-item item-${data.type}`;
    item.style.top = `${data.top}px`;
    item.style.left = `${data.left}px`;
    
    // Explicit sizing for cards
    if (data.width) item.style.width = `${data.width}px`;
    if (data.height) item.style.height = `${data.height}px`;

    // Make content editable for text assets
    if (data.type !== 'card') {
      const contentEl = document.createElement('div');
      contentEl.className = 'item-editable-content';
      contentEl.textContent = data.text;
      contentEl.setAttribute('contenteditable', 'true');
      contentEl.addEventListener('focus', () => {
        item.classList.add('selected');
        selectedItem = item;
      });
      contentEl.addEventListener('blur', () => {
        item.classList.remove('selected');
      });
      item.appendChild(contentEl);
    } else {
      // Cards/Frames have resize styling
      item.style.minWidth = '50px';
      item.style.minHeight = '30px';
    }

    // Close/Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'item-delete';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = "Delete Asset";
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      item.remove();
      if (selectedItem === item) selectedItem = null;
    });
    item.appendChild(deleteBtn);

    // Draggable Functionality
    item.addEventListener('mousedown', dragStart);
    item.addEventListener('touchstart', dragStart, { passive: false });

    function dragStart(e) {
      if (e.target.className === 'item-delete' || e.target.getAttribute('contenteditable') === 'true') {
        return; // Don't drag when deleting or typing
      }
      e.preventDefault();

      // Clear previous selection
      document.querySelectorAll('.sandbox-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      selectedItem = item;

      // Bring to front
      sandboxCanvas.appendChild(item);

      let clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

      let shiftX = clientX - item.getBoundingClientRect().left;
      let shiftY = clientY - item.getBoundingClientRect().top;

      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('touchend', dragEnd);

      function dragMove(e) {
        e.preventDefault();
        let moveX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let moveY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const canvasRect = sandboxCanvas.getBoundingClientRect();
        
        let x = moveX - canvasRect.left - shiftX;
        let y = moveY - canvasRect.top - shiftY;

        // Boundary constraint checks
        x = Math.max(0, Math.min(x, canvasRect.width - item.offsetWidth));
        y = Math.max(0, Math.min(y, canvasRect.height - item.offsetHeight));

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
      }

      function dragEnd() {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEnd);
      }
    }

    sandboxCanvas.appendChild(item);
  }

  function resetSandbox() {
    sandboxCanvas.innerHTML = '';
    defaultAssets.forEach(asset => createSandboxItem(asset));
  }

  // Sync palette presets
  sbColorTheme.addEventListener('change', () => {
    sandboxCanvas.className = 'sandbox-canvas';
    sandboxCanvas.classList.add(sbColorTheme.value);
  });

  // Button handlers for additions
  addAssetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      let text = "Sample Text";
      if (type === 'title') text = "HEADING TITLE";
      else if (type === 'subtitle') text = "Sub-Heading Text Label";
      else if (type === 'badge') text = "PILL BADGE";
      else if (type === 'text') text = "Add body details here describing secondary details.";

      const offsetTop = 150 + Math.random() * 80;
      const offsetLeft = 100 + Math.random() * 80;

      createSandboxItem({
        type: type,
        text: text,
        top: offsetTop,
        left: offsetLeft,
        width: type === 'card' ? 120 : null,
        height: type === 'card' ? 80 : null
      });
    });
  });

  sbBtnReset.addEventListener('click', resetSandbox);
  
  // HTML Canvas Exporter using html2canvas CDN
  sbBtnExport.addEventListener('click', () => {
    // Temporarily hide delete x markers during screenshotting to look clean
    const deletes = sandboxCanvas.querySelectorAll('.item-delete');
    deletes.forEach(d => d.style.display = 'none');
    
    // De-select items
    const selected = sandboxCanvas.querySelector('.sandbox-item.selected');
    if (selected) selected.classList.remove('selected');

    html2canvas(sandboxCanvas, {
      scale: 2, // High resolution rendering output
      backgroundColor: null
    }).then(canvas => {
      // Re-enable delete markers
      deletes.forEach(d => d.style.display = '');

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = 'mlg-student-design.png';
      link.href = image;
      link.click();
    }).catch(err => {
      alert("Error generating sandbox image screenshot: " + err);
      // Re-enable delete markers in case of error
      deletes.forEach(d => d.style.display = '');
    });
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
      question: "What is the main purpose of graphic design?",
      options: ["Self-expression and pure fine art", "Visual communication to solve a problem or deliver a message", "To paint realistic representations", "To build interactive software databases"],
      correctIndex: 1,
      explanation: "Graphic design is problem-solving. It uses visuals to communicate specific objectives to an audience."
    },
    {
      question: "How does graphic design differ fundamentally from fine art?",
      options: ["Fine art answers questions, design asks them", "Fine art is objective, design is subjective", "Fine art is self-expression; design is driven by external goals", "There is no difference"],
      correctIndex: 2,
      explanation: "Art is personal and subjective; design is goal-driven, functional, and objective."
    },
    {
      question: "Which of the following is NOT one of the 6 basic elements of design introduced?",
      options: ["Line", "Texture", "Feedback", "Value"],
      correctIndex: 2,
      explanation: "The elements of design are Line, Shape, Color, Value, Texture, and Space. Feedback is not an element."
    },
    {
      question: "What does the term 'composition' refer to in graphic design?",
      options: ["The writing style of the body text copy", "The arrangement of visual elements on the canvas layout", "The file size compression ratio", "The color blindness testing method"],
      correctIndex: 1,
      explanation: "Composition is the arrangement and organization of design elements to form a cohesive whole."
    },
    {
      question: "Which design school/movement from the early 20th century popularized 'form follows function'?",
      options: ["Art Nouveau", "Bauhaus", "Dadaism", "Pop Art"],
      correctIndex: 1,
      explanation: "The German Bauhaus school popularized 'form follows function', merging fine art and functional industrial crafts."
    },
    {
      question: "What is the primary focus of 'Swiss Design' (International Typographic Style)?",
      options: ["Handwritten script fonts and symmetrical floral borders", "Asymmetric layouts, grid structures, and clean sans-serif typefaces", "Vibrant gradient backgrounds and 3D form shading", "Unstructured collage compositions"],
      correctIndex: 1,
      explanation: "Swiss Design (codified in the 1950s) emphasized clean layout grids, sans-serif fonts, and asymmetric structures."
    },
    {
      question: "In the design workflow, what is the purpose of a 'moodboard'?",
      options: ["To test browser viewport breakpoints responsiveness", "To map typographic ascenders and descenders parameters", "To gather visual assets representing a style and theme direction", "To calculate foreground relative luminance ratios"],
      correctIndex: 2,
      explanation: "A moodboard compiles color palettes, type samples, and references to set the aesthetic direction of a project."
    },
    {
      question: "What is the key difference between raster and vector graphics?",
      options: ["Raster uses paths; vector uses pixels", "Raster uses pixels; vector uses mathematical coordinate paths", "Raster is black and white; vector is color", "There is no difference in image scaling"],
      correctIndex: 1,
      explanation: "Raster images are made of fixed pixel grids (lose quality when zoomed). Vector graphics use mathematical paths (infinitely scalable)."
    },
    {
      question: "Which vector-drawing software is the standard industry tool for layout icons and branding design?",
      options: ["Adobe Photoshop", "Adobe Illustrator", "Microsoft Word", "HTML5 Canvas Editor"],
      correctIndex: 1,
      explanation: "Adobe Illustrator is the industry-standard software for creating vector graphics (logos, illustrations, icons)."
    },
    {
      question: "Which software is industry-standard for raster photo editing and digital painting?",
      options: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "CSS Flexbox Editor"],
      correctIndex: 1,
      explanation: "Adobe Photoshop is the standard raster editor used for photo retouching, pixel editing, and web mockups."
    },
    {
      question: "What is the definition of 'visual hierarchy'?",
      options: ["The total amount of colors in a palette", "The order in which the human eye perceives layout elements", "The file structure directory hierarchy", "The spacing size of line columns gutters"],
      correctIndex: 1,
      explanation: "Visual hierarchy is the arrangement of elements to signal relative importance, letting viewers read the main message first."
    },
    {
      question: "Why is negative space (white space) important in design layouts?",
      options: ["It indicates coding errors in CSS grid tracks", "It provides breathing room and coordinates viewer focal paths", "It fills empty pages with colored grids", "It reduces file download size"],
      correctIndex: 1,
      explanation: "Negative space is the empty space around visual elements. It prevents clutter and helps guide viewer attention."
    },
    {
      question: "What is the term for a quick, blocky sketch layout mapping content areas without details?",
      options: ["Moodboard", "Wireframe", "Color wheel", "High fidelity mockup"],
      correctIndex: 1,
      explanation: "A wireframe is a simplified structural layout skeleton displaying structural blocks without colors or fonts."
    },
    {
      question: "Which element is defined as a continuous point moving through space?",
      options: ["Shape", "Line", "Value", "Texture"],
      correctIndex: 1,
      explanation: "A line is a point moving in space. It is the most basic element, connecting objects and directing eye tracking paths."
    },
    {
      question: "What does the term 'RGB' stand for in digital layout design?",
      options: ["Resolution, Gradient, Brightness", "Red, Green, Blue", "Raster, Grid, Boundary", "Refraction, Gamut, Balance"],
      correctIndex: 1,
      explanation: "RGB represents Red, Green, and Blue—the primary colors of additive light used to display color on digital screens."
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
      quizFeedbackText.textContent = "Perfect score! You've mastered Graphic Design Fundamentals.";
    } else if (score >= 10) {
      quizFeedbackText.textContent = "Great job! A quick review will lock in raster/vector and Swiss movement history details.";
    } else {
      quizFeedbackText.textContent = "Review the slides to better understand visual hierarchy, design elements, and composition.";
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

  // Initial draw sandbox components
  resetSandbox();
  loadQuestion();
});
