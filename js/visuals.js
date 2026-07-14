(function () {
  'use strict';

  const visuals = {};

  // Helper: Create element with class and text
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Helper: Create slider control group
  function rangeControl(labelText, min, max, value, step = 1) {
    const input = el('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.value = value;
    input.step = step;
    
    const grp = el('div', 'visual-control-group');
    const label = el('label');
    label.append(el('span', '', labelText), el('span', 'val-display', ` (${value})`));
    grp.append(label, input);

    input.addEventListener('input', () => {
      grp.querySelector('.val-display').textContent = ` (${input.value})`;
    });

    return { grp, input };
  }

  // Helper: Create select control group
  function selectControl(labelText, options, value) {
    const select = el('select');
    options.forEach(([val, text]) => {
      const opt = el('option');
      opt.value = val;
      opt.textContent = text;
      opt.selected = val === value;
      select.append(opt);
    });

    const grp = el('div', 'visual-control-group');
    const label = el('label', '', labelText);
    grp.append(label, select);
    return { grp, select };
  }

  // Helper: Create toggle buttons
  function toggleControl(labelText, options, activeValue) {
    const grp = el('div', 'visual-control-group');
    const label = el('label', '', labelText);
    const wrap = el('div', 'visual-toggle-btns');
    
    const buttons = options.map(([val, text]) => {
      const btn = el('button', `visual-btn ${val === activeValue ? 'active' : ''}`, text);
      btn.type = 'button';
      btn.dataset.value = val;
      wrap.append(btn);
      return btn;
    });

    grp.append(label, wrap);

    function onChange(callback) {
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          callback(btn.dataset.value);
        });
      });
    }

    return { grp, onChange, getValue: () => wrap.querySelector('.visual-btn.active').dataset.value };
  }

  // Helper: Create basic visual card skeleton
  function shell(visual) {
    const container = el('div', 'visual-inner');
    const header = el('div', 'visual-header');
    header.append(el('h3', '', visual.title), el('p', '', visual.instructions));
    
    const body = el('div', 'visual-body');
    const preview = el('div', 'visual-preview');
    const controls = el('div', 'visual-controls');
    
    body.append(preview, controls);
    container.append(header, body);
    return { container, preview, controls };
  }

  // 1. Layout Comparer (Introduction Section 1)
  visuals['layout-comparer'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const toggle = toggleControl('Layout structure', [['unstructured', 'Raw Text'], ['structured', 'Structured']], 'unstructured');
    
    const outer = el('div', 'comparer-container');
    const previewLayout = el('div', 'comparer-layout');
    outer.append(previewLayout);
    preview.append(outer);
    
    const status = el('div', 'visual-status');
    controls.append(toggle.grp, status);

    function update() {
      const mode = toggle.getValue();
      if (mode === 'unstructured') {
        previewLayout.className = 'comparer-layout layout-unstructured';
        previewLayout.innerHTML = `
          <strong>MLG Cafeteria Menu</strong>
          <div>Coffee $3.50 Hot and brewed fresh every morning.</div>
          <div>Sandwich $6.50 Turkey breast and fresh Swiss cheese.</div>
          <div>Salad $7.00 Local organic greens with vinegar glaze.</div>
        `;
        status.textContent = 'Without hierarchy, spacing, or clear alignment, everything competes for the viewer\'s attention equally. Reading requires effort.';
      } else {
        previewLayout.className = 'comparer-layout layout-structured';
        previewLayout.innerHTML = `
          <div class="menu-header">
            <h4>DAILY MENU</h4>
            <small>MLG COLLEGE</small>
          </div>
          <div class="menu-item">
            <span>Coffee</span>
            <span>$3.50</span>
          </div>
          <div class="menu-item">
            <span>Turkey Sandwich</span>
            <span>$6.50</span>
          </div>
          <div class="menu-item">
            <span>Organic Salad</span>
            <span>$7.00</span>
          </div>
        `;
        status.textContent = 'Structured design uses alignment, spacing, and typographic weight to direct the eye instantly to what matters. The dot leaders bridge items and prices.';
      }
    }

    toggle.onChange(update);
    update();
    return container;
  };

  // 2. Visual Language Explorer (Introduction Section 3)
  visuals['visual-language-explorer'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    
    const toggleGrid = toggleControl('Grid Guides', [['off', 'Off'], ['on', 'On']], 'off');
    const toggleColor = toggleControl('Color fill', [['off', 'Grayscale'], ['on', 'Accent Color']], 'off');
    const toggleType = toggleControl('Typography', [['off', 'Default Serif'], ['on', 'Modern Sans']], 'off');

    const explorerCanvas = el('div', 'language-explorer-canvas');
    explorerCanvas.innerHTML = `
      <div class="explorer-grid-guides" hidden><span></span><span></span><span></span><span></span></div>
      <div class="explorer-header" style="display:flex; justify-content:space-between; font-size:0.6rem; letter-spacing:0.1em; font-family:serif;">
        <span>BAUHAUS 1923</span>
        <span>EXHIBITION</span>
      </div>
      <div class="explorer-graphic" style="flex:1; display:flex; align-items:center; justify-content:center; position:relative; margin:1rem 0;">
        <div class="ex-circle" style="width:70px; height:70px; border-radius:50%; background:#222; transition:all 0.3s ease;"></div>
        <div class="ex-bar" style="position:absolute; width:100px; height:12px; background:#444; transform:rotate(-25deg); transition:all 0.3s ease;"></div>
      </div>
      <strong class="explorer-headline" style="font-size:1.4rem; line-height:1; font-family:serif; font-weight:normal; transition:all 0.3s ease;">ART & TECHNOLOGY</strong>
    `;
    preview.append(explorerCanvas);

    const status = el('div', 'visual-status');
    controls.append(toggleGrid.grp, toggleColor.grp, toggleType.grp, status);

    function update() {
      const showGrid = toggleGrid.getValue() === 'on';
      const showColor = toggleColor.getValue() === 'on';
      const showType = toggleType.getValue() === 'on';

      explorerCanvas.querySelector('.explorer-grid-guides').hidden = !showGrid;
      
      const circle = explorerCanvas.querySelector('.ex-circle');
      const bar = explorerCanvas.querySelector('.ex-bar');
      if (showColor) {
        circle.style.background = 'var(--accent)';
        bar.style.background = '#111719';
      } else {
        circle.style.background = '#222';
        bar.style.background = '#444';
      }

      const headline = explorerCanvas.querySelector('.explorer-headline');
      const header = explorerCanvas.querySelector('.explorer-header');
      if (showType) {
        headline.style.fontFamily = 'var(--font-heading, "Outfit", sans-serif)';
        headline.style.fontWeight = '900';
        headline.style.letterSpacing = '-0.03em';
        header.style.fontFamily = 'var(--font-mono)';
      } else {
        headline.style.fontFamily = 'serif';
        headline.style.fontWeight = 'normal';
        headline.style.letterSpacing = 'normal';
        header.style.fontFamily = 'serif';
      }

      status.textContent = `Applied elements: ${showGrid ? 'Grid guides' : ''} ${showColor ? 'Color' : ''} ${showType ? 'Typography' : ''}. Combined purposefully, they create a unified design system.`;
    }

    [toggleGrid, toggleColor, toggleType].forEach(t => t.onChange(update));
    update();
    return container;
  };

  // 3. Vector vs Raster Zoom (Introduction Section 5)
  visuals['vector-raster-zoom'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const zoomSlider = rangeControl('Zoom Level', 1, 8, 1, 0.5);
    
    const canvas = el('div', 'zoom-canvas');
    canvas.innerHTML = `
      <div class="zoom-half">
        <div class="zoom-label">Raster (32x32 PNG)</div>
        <canvas class="raster-view" width="128" height="128" style="image-rendering: pixelated; width: 120px; height: 120px; transition: transform 0.1s ease;"></canvas>
      </div>
      <div class="zoom-half">
        <div class="zoom-label">Vector (SVG Path)</div>
        <div class="vector-view-wrap" style="width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; transition: transform 0.1s ease;">
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#43d6b5" stroke-width="8" stroke-linecap="round">
            <circle cx="50" cy="50" r="30" />
            <path d="M50 20 v60 M20 50 h60" stroke-width="4" stroke-dasharray="3 3"/>
          </svg>
        </div>
      </div>
    `;
    
    const rCanvas = canvas.querySelector('.raster-view');
    const ctx = rCanvas.getContext('2d');
    
    // Draw initial small bitmap representation on canvas
    function drawBitmap() {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#ff9d5c';
      ctx.beginPath();
      ctx.arc(64, 64, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(64, 20); ctx.lineTo(64, 108);
      ctx.moveTo(20, 64); ctx.lineTo(108, 64);
      ctx.stroke();
    }
    
    preview.append(canvas);
    
    const status = el('div', 'visual-status');
    controls.append(zoomSlider.grp, status);

    function update() {
      const zoom = parseFloat(zoomSlider.input.value);
      rCanvas.style.transform = `scale(${zoom})`;
      canvas.querySelector('.vector-view-wrap').style.transform = `scale(${zoom})`;
      
      status.textContent = `Zoom: ${zoom}x. Raster graphics pixelate and blur under magnification because they store colors in a fixed pixel grid. Vector graphics remain perfectly crisp at any scale because they are drawn from mathematical formulas.`;
    }

    zoomSlider.input.addEventListener('input', update);
    drawBitmap();
    update();
    return container;
  };

  // 4. Line Weight and Curves (Elements Section 1)
  visuals['line-weight-curves'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const weight = rangeControl('Line Weight', 1, 16, 4);
    const curve = rangeControl('Curvature (Bend)', -60, 60, 0);
    const dash = rangeControl('Dash spacing', 0, 30, 0);

    const svgWrap = el('div');
    svgWrap.style.width = '100%';
    svgWrap.style.height = '100%';
    svgWrap.style.display = 'grid';
    svgWrap.style.placeItems = 'center';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '180');
    svg.setAttribute('height', '180');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', 'var(--accent)');
    path.setAttribute('fill', 'none');
    svg.append(path);
    svgWrap.append(svg);
    preview.append(svgWrap);

    const status = el('div', 'visual-status');
    controls.append(weight.grp, curve.grp, dash.grp, status);

    function update() {
      const w = weight.input.value;
      const c = curve.input.value;
      const d = dash.input.value;

      // Start at (30, 100), curve mid point through control point (100, 100 + c), end at (170, 100)
      path.setAttribute('d', `M 30 100 Q 100 ${100 + Number(c)} 170 100`);
      path.setAttribute('stroke-width', w);
      
      if (Number(d) > 0) {
        path.setAttribute('stroke-dasharray', `${d} ${d}`);
      } else {
        path.removeAttribute('stroke-dasharray');
      }

      let mood = 'neutral';
      if (c === '0') mood = 'rigid, structured, stable';
      else if (Math.abs(c) > 40) mood = 'dynamic, energetic, dramatic';
      else mood = 'organic, fluid, gentle';

      status.textContent = `Weight: ${w}px, bend: ${c}px. The line's visual character represents different states: a flat line feels ${mood}, while adjustments changes its visual weight and implication.`;
    }

    [weight, curve, dash].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 5. Positive vs Negative Space (Elements Section 2)
  visuals['positive-negative-space'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const spaceMode = toggleControl('Space visualization', [['positive', 'Positive Shapes'], ['negative', 'Negative Contours']], 'positive');

    const spaceCanvas = el('div', 'space-canvas');
    spaceCanvas.innerHTML = `
      <div class="space-shape-wrap">
        <!-- Two columns of circles forming a shape in the middle -->
        <div class="sp-circle" style="position:absolute; width:45px; height:45px; border-radius:50%; background:#222; top:15px; left:15px; transition:all 0.3s ease;"></div>
        <div class="sp-circle" style="position:absolute; width:45px; height:45px; border-radius:50%; background:#222; top:70px; left:15px; transition:all 0.3s ease;"></div>
        <div class="sp-circle" style="position:absolute; width:45px; height:45px; border-radius:50%; background:#222; top:125px; left:15px; transition:all 0.3s ease;"></div>
        
        <div class="sp-circle" style="position:absolute; width:45px; height:45px; border-radius:50%; background:#222; top:15px; right:15px; transition:all 0.3s ease;"></div>
        <div class="sp-circle" style="position:absolute; width:45px; height:45px; border-radius:50%; background:#222; top:70px; right:15px; transition:all 0.3s ease;"></div>
        <div class="sp-circle" style="position:absolute; width:45px; height:45px; border-radius:50%; background:#222; top:125px; right:15px; transition:all 0.3s ease;"></div>
        
        <!-- Negative space shape showing through (like an arrow or column) -->
        <div class="sp-negative-arrow" style="position:absolute; width:30px; height:90px; background:#43d6b5; top:45px; left:75px; opacity:0; transition:all 0.3s ease; border-radius:4px; clip-path: polygon(50% 0%, 0% 40%, 30% 40%, 30% 100%, 70% 100%, 70% 40%, 100% 40%);"></div>
      </div>
    `;
    preview.append(spaceCanvas);

    const status = el('div', 'visual-status');
    controls.append(spaceMode.grp, status);

    function update() {
      const mode = spaceMode.getValue();
      const circles = spaceCanvas.querySelectorAll('.sp-circle');
      const arrow = spaceCanvas.querySelector('.sp-negative-arrow');

      if (mode === 'positive') {
        circles.forEach(c => {
          c.style.background = 'var(--accent, #43d6b5)';
          c.style.transform = 'scale(1)';
        });
        arrow.style.opacity = '0';
        status.textContent = 'Positive space contains the active subjects (the colored circles). Our eyes naturally focus on them first.';
      } else {
        circles.forEach(c => {
          c.style.background = '#cbd5e1';
          c.style.transform = 'scale(0.95)';
        });
        arrow.style.opacity = '1';
        status.textContent = 'Negative space is the surrounding ground. Strategic spacing can carve the negative space into secondary symbols — here forming an arrow.';
      }
    }

    spaceMode.onChange(update);
    update();
    return container;
  };

  // 6. Form and Light Source (Elements Section 3)
  visuals['form-light-source'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const lightX = rangeControl('Light Source X', 0, 100, 30);
    const lightY = rangeControl('Light Source Y', 0, 100, 30);
    const ambient = rangeControl('Ambient Light', 0, 50, 15);

    const canvas = el('div', 'form-canvas');
    const sphere = el('div', 'form-sphere');
    canvas.append(sphere);
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(lightX.grp, lightY.grp, ambient.grp, status);

    function update() {
      const lx = lightX.input.value;
      const ly = lightY.input.value;
      const amb = ambient.input.value;

      // Create realistic 3D volumetric shading using CSS radial gradients
      sphere.style.background = `radial-gradient(circle at ${lx}% ${ly}%, #ffffff 0%, var(--accent) 40%, #030712 85%)`;
      sphere.style.boxShadow = `${(50 - lx) * 0.4}px ${(50 - ly) * 0.4}px 40px rgba(0, 0, 0, ${1 - amb/100})`;
      status.textContent = `Light source at: (${lx}%, ${ly}%). Shading translates a flat 2D shape (circle) into a 3D form (sphere) by simulating light rays and occlusion.`;
    }

    [lightX, lightY, ambient].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 7. Space and Proximity (Elements Section 4)
  visuals['space-proximity'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const gap = rangeControl('Element Proximity (Gap)', 2, 48, 8);
    const groupGap = rangeControl('Group Isolation (Margin)', 8, 80, 24);

    const canvas = el('div', 'proximity-canvas');
    canvas.innerHTML = `
      <div class="proximity-group group-1">
        <div class="proximity-item header"></div>
        <div class="proximity-item body"></div>
      </div>
      <div class="proximity-group group-2">
        <div class="proximity-item header"></div>
        <div class="proximity-item body"></div>
      </div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(gap.grp, groupGap.grp, status);

    function update() {
      const g = gap.input.value;
      const gg = groupGap.input.value;

      canvas.querySelectorAll('.proximity-group').forEach(grp => {
        grp.style.setProperty('--prox-gap', `${g}px`);
        grp.style.setProperty('--group-gap', `${gg}px`);
      });

      if (Number(g) >= Number(gg)) {
        status.textContent = `Gap: ${g}px, isolation: ${gg}px. Because the space between elements inside a group is equal to or larger than the spacing between the groups, proximity fails. The page looks like a disorganized list.`;
      } else {
        status.textContent = `Gap: ${g}px, isolation: ${gg}px. Proximity succeeds. Related elements sit close together, and wide outer margins cluster them into distinct, readable cards without lines.`;
      }
    }

    [gap, groupGap].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 8. Balance Scale (Principles Section 1)
  visuals['balance-scale'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const weightB = rangeControl('Right Object Scale', 30, 80, 50);
    const posB = rangeControl('Right Object Position', 50, 95, 75);

    const canvas = el('div', 'balance-canvas');
    canvas.innerHTML = `
      <div class="scale-beam">
        <div class="scale-weight-a"></div>
        <div class="scale-weight-b"></div>
      </div>
      <div class="scale-fulcrum"></div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(weightB.grp, posB.grp, status);

    function update() {
      const wSize = weightB.input.value;
      const rPos = posB.input.value;

      // Balance equation: A is at 15% (dist is 35 from center 50) with weight value = 50. Torque A = 50 * 35 = 1750
      // B is at rPos% (dist is rPos - 50) with weight value = wSize. Torque B = wSize * (rPos - 50)
      const torqueA = 50 * 35;
      const torqueB = wSize * (rPos - 50);
      
      const difference = torqueB - torqueA;
      // Map torque difference to rotation angle (-20deg to 20deg)
      const angle = Math.min(20, Math.max(-20, difference / 150));

      canvas.querySelector('.scale-beam').style.setProperty('--beam-angle', `${angle}deg`);
      
      const bNode = canvas.querySelector('.scale-weight-b');
      bNode.style.setProperty('--weight-pos', `${rPos}%`);
      bNode.style.setProperty('--weight-size', `${wSize}px`);

      if (Math.abs(angle) < 1.5) {
        status.textContent = 'Perfect Asymmetrical Balance! An unequal size balances stable because the smaller object is positioned farther from the center fulcrum.';
      } else if (angle > 0) {
        status.textContent = 'Right-heavy composition. The right object has too much visual weight (due to size or leverage). Move it inward or reduce size.';
      } else {
        status.textContent = 'Left-heavy composition. The right object lacks visual weight. Increase its size or move it outward to compensate.';
      }
    }

    [weightB, posB].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 9. Hierarchy Adjuster (Principles Section 3)
  visuals['hierarchy-adjuster'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const headingSize = rangeControl('Heading Scale', 14, 52, 22);
    const subContrast = toggleControl('Subheading contrast', [['low', 'Low (Gray)'], ['high', 'High (Bold Accent)']], 'low');
    const bodySpc = rangeControl('Body Spacing', 4, 32, 8);

    const canvas = el('div', 'hierarchy-canvas');
    canvas.innerHTML = `
      <h4 class="h-title" style="margin:0; font-weight:800; font-family:var(--font-heading); transition:font-size 0.1s ease;">EXHIBIT PREVIEW</h4>
      <div class="h-sub" style="margin:0.25rem 0 0.75rem; font-size:0.75rem; transition:all 0.2s ease;">Starts tomorrow in MLG Hall</div>
      <p class="h-body" style="margin:0; font-size:0.85rem; color:#475569; transition:margin-top 0.1s ease;">Explore thirty years of print design and digital user interfaces in our student-led summer showcase.</p>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(headingSize.grp, subContrast.grp, bodySpc.grp, status);

    function update() {
      const hSize = headingSize.input.value;
      const subMode = subContrast.getValue();
      const bSpc = bodySpc.input.value;

      const titleNode = canvas.querySelector('.h-title');
      const subNode = canvas.querySelector('.h-sub');
      const bodyNode = canvas.querySelector('.h-body');

      titleNode.style.fontSize = `${hSize}px`;
      bodyNode.style.marginTop = `${bSpc}px`;

      if (subMode === 'low') {
        subNode.style.color = '#94a3b8';
        subNode.style.fontWeight = 'normal';
      } else {
        subNode.style.color = 'var(--accent-strong, #43d6b5)';
        subNode.style.fontWeight = 'bold';
      }

      if (hSize >= 34 && subMode === 'high') {
        status.textContent = 'Strong hierarchy. Visual weights are dramatically differentiated, making it obvious which information to read first, second, and third.';
      } else {
        status.textContent = 'Weak hierarchy. Headline size is too similar to body text, causing content to blend. Try increasing the Heading Scale.';
      }
    }

    headingSize.input.addEventListener('input', update);
    subContrast.onChange(update);
    bodySpc.input.addEventListener('input', update);
    update();
    return container;
  };

  // 10. Alignment Guides (Principles Section 5)
  visuals['alignment-guides'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const alignMode = toggleControl('Alignment Mode', [['random', 'Chaotic'], ['aligned', 'Grid Aligned']], 'random');

    const canvas = el('div', 'alignment-canvas');
    canvas.innerHTML = `
      <div class="alignment-line" hidden></div>
      <div class="alignment-element el-1" style="align-self: flex-start;">HEADER</div>
      <div class="alignment-element el-2" style="align-self: flex-start;">CONTENT</div>
      <div class="alignment-element el-3" style="align-self: flex-start;">BUTTON</div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(alignMode.grp, status);

    function update() {
      const mode = alignMode.getValue();
      const line = canvas.querySelector('.alignment-line');
      const e1 = canvas.querySelector('.el-1');
      const e2 = canvas.querySelector('.el-2');
      const e3 = canvas.querySelector('.el-3');

      if (mode === 'random') {
        line.hidden = true;
        e1.style.transform = 'translateX(20px)';
        e2.style.transform = 'translateX(90px)';
        e3.style.transform = 'translateX(40px)';
        status.textContent = 'Elements are placed without a shared axis. The eye must calculate a new starting coordinate for every row, looking unprofessional.';
      } else {
        line.hidden = false;
        line.style.setProperty('--line-pos', '25%');
        e1.style.transform = 'translateX(23px)';
        e2.style.transform = 'translateX(23px)';
        e3.style.transform = 'translateX(23px)';
        status.textContent = 'Grid aligned! A single vertical axis connects the starting edges, anchoring elements and allowing the eye to sweep down the page smoothly.';
      }
    }

    alignMode.onChange(update);
    update();
    return container;
  };

  // 11. Typeface Anatomy (Typography Section 1)
  visuals['typeface-anatomy'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const typeMode = toggleControl('Typeface class', [['serif', 'Georgia (Serif)'], ['sans', 'Arial (Sans-Serif)']], 'serif');

    const canvas = el('div', 'anatomy-canvas');
    canvas.innerHTML = `
      <div class="anatomy-text-container" style="font-family: Georgia, serif;">
        <span>Ag</span>
        <!-- Clickable dots to highlight details -->
        <div class="anatomy-label-dot dot-serif" style="top: 88%; left: 16%;" data-anatomy="Serif: Terminal decorative feet flanking the base of the letter strokes. Helps guide horizontal flow in text blocks."></div>
        <div class="anatomy-label-dot dot-ear" style="top: 15%; left: 91%;" data-anatomy="Ear: Small terminal stroke projecting from the top bowl of the lowercase g."></div>
        <div class="anatomy-label-dot dot-desc" style="top: 92%; left: 74%;" data-anatomy="Descender: Loop or stroke that plunges below the typographic baseline."></div>
      </div>
      <div class="anatomy-tooltip">Click red dots to discover anatomy details</div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(typeMode.grp, status);

    const tooltip = canvas.querySelector('.anatomy-tooltip');
    canvas.querySelectorAll('.anatomy-label-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        tooltip.textContent = dot.dataset.anatomy;
      });
    });

    function update() {
      const mode = typeMode.getValue();
      const containerNode = canvas.querySelector('.anatomy-text-container');
      const serifDot = canvas.querySelector('.dot-serif');
      const earDot = canvas.querySelector('.dot-ear');

      if (mode === 'serif') {
        containerNode.style.fontFamily = 'Georgia, serif';
        serifDot.style.display = 'block';
        earDot.style.display = 'block';
        status.textContent = 'Serif typefaces have high stroke contrast and small feet (serifs). They are traditional and highly legible at long reading lengths.';
      } else {
        containerNode.style.fontFamily = 'Arial, sans-serif';
        serifDot.style.display = 'none';
        earDot.style.display = 'none';
        status.textContent = 'Sans-serif typefaces have uniform stroke weights and clean endings without feet. They appear modern, digital-native, and highly legible on small displays.';
      }
    }

    typeMode.onChange(update);
    update();
    return container;
  };

  // 12. Typographic Spacing (Typography Section 5)
  visuals['typographic-spacing'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const leading = rangeControl('Line Height (Leading)', 1.0, 2.2, 1.4, 0.1);
    const tracking = rangeControl('Letter spacing (Tracking)', -0.05, 0.25, 0, 0.02);

    const canvas = el('div', 'spacing-canvas');
    canvas.innerHTML = `
      <div class="spacing-text-block">
        <h4 style="margin: 0 0 0.5rem 0; font-family: var(--font-heading); font-weight: 800;">Typographic rhythm is proportional</h4>
        <p class="sp-para" style="font-size:0.8rem; line-height:1.45; transition:all 0.1s ease;">Typography regulates spacing as much as it designs letterforms. Without proportional leading and tracking, letter sequences clash or float away in fragments.</p>
      </div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(leading.grp, tracking.grp, status);

    function update() {
      const lh = leading.input.value;
      const ls = tracking.input.value;
      
      const pNode = canvas.querySelector('.sp-para');
      pNode.style.lineHeight = lh;
      pNode.style.letterSpacing = `${ls}em`;

      if (lh >= 1.35 && lh <= 1.65 && ls >= -0.01 && ls <= 0.06) {
        status.textContent = `Leading: ${lh}, tracking: ${ls}em. Optimal spacing! The lines have breathing room to guide the eye horizontally, and letters are clustered legibly.`;
      } else if (lh < 1.3) {
        status.textContent = `Leading: ${lh} is too tight. The lines collide, causing "double reading" where the eye jumps rows. Increase Line Height.`;
      } else {
        status.textContent = `Spacing is unproportional. Letters or lines are drifting too far, breaking reading flow. Revert to standard scales.`;
      }
    }

    [leading, tracking].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 13. Line Length & Readability (Typography Section 6)
  visuals['line-length-readability'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const widthSlider = rangeControl('Text Block Width', 120, 360, 260, 10);

    const canvas = el('div', 'length-canvas');
    canvas.innerHTML = `
      <div class="length-wrapper">
        <div class="length-text-container" style="transition: width 0.15s ease;">
          The ideal typographic measure contains forty-five to seventy-five characters per line, including spacing. When columns stretch too wide, the eye struggles to track back to the correct starting edge.
        </div>
      </div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(widthSlider.grp, status);

    function update() {
      const w = widthSlider.input.value;
      const textContainer = canvas.querySelector('.length-text-container');
      textContainer.style.width = `${w}px`;

      // Measure character count in the first line approximately
      // We can map width to character ranges
      const charCount = Math.round(w / 4.4); // rough approximation
      let rating = '';
      if (charCount < 45) {
        rating = 'Too narrow (approx. ' + charCount + ' chars/line). The eye has to jump back and forth constantly, fracturing sentences.';
      } else if (charCount > 75) {
        rating = 'Too wide (approx. ' + charCount + ' chars/line). The reader gets lost tracing their way back to the left edge.';
      } else {
        rating = 'Optimal measure (approx. ' + charCount + ' chars/line). Comfortable horizontal sweep for standard reading.';
      }

      status.textContent = rating;
    }

    widthSlider.input.addEventListener('input', update);
    update();
    return container;
  };

  // 14. Simultaneous Contrast (Color Theory Section 1)
  visuals['simultaneous-contrast'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const bgSlider = rangeControl('Background Shade', 0, 255, 30);

    const canvas = el('div', 'contrast-sim-canvas');
    canvas.innerHTML = `
      <div class="contrast-sim-outer" style="width: 180px; height: 180px; display: grid; place-items: center; border-radius: 8px;">
        <div class="contrast-sim-inner" style="width: 45px; height: 45px; background: rgb(128, 128, 128); border-radius: 4px;"></div>
      </div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(bgSlider.grp, status);

    function update() {
      const val = bgSlider.input.value;
      canvas.querySelector('.contrast-sim-outer').style.background = `rgb(${val}, ${val}, ${val})`;
      
      const text = val < 128 
        ? `The center gray box looks noticeably lighter when surrounded by a dark field.`
        : `The center gray box looks noticeably darker when surrounded by a light field.`;

      status.textContent = `${text} Notice that the center box's RGB values are constant (RGB 128). Visual perception is relative.`;
    }

    bgSlider.input.addEventListener('input', update);
    update();
    return container;
  };

  // 15. RGB vs CMYK Mixer (Color Theory Section 2)
  visuals['rgb-cmyk-mixer'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const modeToggle = toggleControl('Color Model', [['rgb', 'RGB Light (Additive)'], ['cmyk', 'CMYK Ink (Subtractive)']], 'rgb');
    
    const slider1 = rangeControl('Red / Cyan', 0, 100, 100);
    const slider2 = rangeControl('Green / Magenta', 0, 100, 100);
    const slider3 = rangeControl('Blue / Yellow', 0, 100, 100);

    const canvas = el('div', 'mixer-canvas');
    canvas.innerHTML = `<div class="mixer-display"></div>`;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(modeToggle.grp, slider1.grp, slider2.grp, slider3.grp, status);

    function update() {
      const mode = modeToggle.getValue();
      const v1 = slider1.input.value / 100;
      const v2 = slider2.input.value / 100;
      const v3 = slider3.input.value / 100;
      
      const display = canvas.querySelector('.mixer-display');

      if (mode === 'rgb') {
        slider1.grp.querySelector('label span:first-child').textContent = 'Red light channel';
        slider2.grp.querySelector('label span:first-child').textContent = 'Green light channel';
        slider3.grp.querySelector('label span:first-child').textContent = 'Blue light channel';
        
        display.style.background = 'transparent';
        canvas.style.background = '#090d10';
        display.innerHTML = `
          <div class="beam beam-r" style="--val-r: ${v1};"></div>
          <div class="beam beam-g" style="--val-g: ${v2};"></div>
          <div class="beam beam-b" style="--val-b: ${v3};"></div>
        `;
        status.textContent = 'Additive light channels overlap to create lighter colors. All three at 100% create white light.';
      } else {
        slider1.grp.querySelector('label span:first-child').textContent = 'Cyan ink absorption';
        slider2.grp.querySelector('label span:first-child').textContent = 'Magenta ink absorption';
        slider3.grp.querySelector('label span:first-child').textContent = 'Yellow ink absorption';
        
        display.style.background = '#fff';
        canvas.style.background = '#e2e8f0';
        display.innerHTML = `
          <div class="ink ink-c" style="--val-c: ${v1};"></div>
          <div class="ink ink-m" style="--val-m: ${v2};"></div>
          <div class="ink ink-y" style="--val-y: ${v3};"></div>
        `;
        status.textContent = 'Subtractive inks absorb light wavelengths. Overlapping them subtracts light reflected from white paper, creating dark mud.';
      }
    }

    modeToggle.onChange(update);
    [slider1, slider2, slider3].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 16. Harmony Color Wheel (Color Theory Section 3)
  visuals['harmony-color-wheel'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const mode = selectControl('Harmony mode', [
      ['complementary', 'Complementary (180°)'],
      ['analogous', 'Analogous (±30°)'],
      ['triadic', 'Triadic (120°)']
    ], 'complementary');
    const hue = rangeControl('Base Hue angle', 0, 360, 180);

    const canvas = el('div', 'wheel-canvas');
    const svgWrap = el('div', 'wheel-svg-wrap');
    canvas.append(svgWrap);
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(mode.grp, hue.grp, status);

    function update() {
      const modeVal = mode.select.value;
      const baseH = Number(hue.input.value);
      
      let hues = [baseH];
      if (modeVal === 'complementary') {
        hues.push((baseH + 180) % 360);
      } else if (modeVal === 'analogous') {
        hues.push((baseH - 30 + 360) % 360, (baseH + 30) % 360);
      } else {
        hues.push((baseH + 120) % 360, (baseH + 240) % 360);
      }

      // Draw SVG wheel with colored pie slices, highlighting chosen coordinates
      let svgHtml = `<svg viewBox="0 0 200 200" width="100%" height="100%">`;
      
      // Draw color wheel background rings
      for (let i = 0; i < 12; i++) {
        const angle = i * 30;
        const color = `hsl(${angle}, 85%, 55%)`;
        const active = hues.some(h => Math.min(Math.abs(h - angle), 360 - Math.abs(h - angle)) <= 15);
        const scale = active ? 1.05 : 0.9;
        
        const rad1 = (angle - 15) * Math.PI / 180;
        const rad2 = (angle + 15) * Math.PI / 180;
        
        const r1 = 45 * scale;
        const r2 = 85 * scale;
        
        const x1 = 100 + r1 * Math.cos(rad1);
        const y1 = 100 + r1 * Math.sin(rad1);
        const x2 = 100 + r2 * Math.cos(rad1);
        const y2 = 100 + r2 * Math.sin(rad1);
        const x3 = 100 + r2 * Math.cos(rad2);
        const y3 = 100 + r2 * Math.sin(rad2);
        const x4 = 100 + r1 * Math.cos(rad2);
        const y4 = 100 + r1 * Math.sin(rad2);
        
        svgHtml += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}" fill="${color}" stroke="${active ? '#fff' : 'rgba(0,0,0,0.2)'}" stroke-width="${active ? '2.5' : '0.5'}" />`;
      }
      
      svgHtml += `<circle cx="100" cy="100" r="10" fill="#fff" /></svg>`;
      svgWrap.innerHTML = svgHtml;

      status.textContent = `Base: ${baseH}°. Selected harmony: ${hues.map(h => Math.round(h) + '°').join(', ')}. Color schemes align hues mathematically to ensure balanced distribution.`;
    }

    mode.select.addEventListener('change', update);
    hue.input.addEventListener('input', update);
    update();
    return container;
  };

  // 17. Grid Builder (Grids Section 1)
  visuals['grid-builder'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const cols = rangeControl('Columns', 2, 12, 6);
    const gutters = rangeControl('Gutter spacing', 4, 24, 12);
    const margins = rangeControl('Outer margins', 4, 32, 16);

    const outerWrap = el('div', 'grid-builder-preview');
    outerWrap.innerHTML = `
      <div class="grid-builder-canvas" style="display:grid; width:100%; height:100%; transition:all 0.1s ease;"></div>
    `;
    preview.append(outerWrap);

    const status = el('div', 'visual-status');
    controls.append(cols.grp, gutters.grp, margins.grp, status);

    function update() {
      const c = cols.input.value;
      const g = gutters.input.value;
      const m = margins.input.value;

      const gridCanvas = outerWrap.querySelector('.grid-builder-canvas');
      gridCanvas.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
      gridCanvas.style.gap = `${g}px`;
      gridCanvas.style.padding = `${m}px`;

      gridCanvas.replaceChildren();
      for (let i = 0; i < c; i++) {
        gridCanvas.append(el('span', 'grid-builder-col'));
      }

      status.textContent = `${c} columns, ${g}px gutters, ${m}px outer margins. Grids partition visual space consistently, creating clean columns for layout elements.`;
    }

    [cols, gutters, margins].forEach(ctrl => ctrl.input.addEventListener('input', update));
    update();
    return container;
  };

  // 18. CSS Grid vs Flexbox (Grids Section 3)
  visuals['grid-flexbox-flow'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const flowToggle = toggleControl('Layout Engine', [['flex', 'Flexbox (1D Flow)'], ['grid', 'CSS Grid (2D Placement)']], 'flex');

    const canvas = el('div', 'grid-flex-canvas');
    const listWrap = el('div', 'grid-flex-container');
    listWrap.innerHTML = `
      <div class="grid-flex-item">1</div>
      <div class="grid-flex-item">2</div>
      <div class="grid-flex-item">3</div>
      <div class="grid-flex-item">4</div>
    `;
    canvas.append(listWrap);
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(flowToggle.grp, status);

    function update() {
      const mode = flowToggle.getValue();
      const items = listWrap.querySelectorAll('.grid-flex-item');

      if (mode === 'flex') {
        listWrap.style.display = 'flex';
        listWrap.style.flexWrap = 'wrap';
        listWrap.style.gap = '0.5rem';
        listWrap.style.gridTemplateColumns = 'none';
        
        items.forEach(item => {
          item.style.flex = '1 1 100px';
        });
        status.textContent = 'Flexbox organizes items in a single dimension (content-out). Items wrap dynamically depending on their individual widths.';
      } else {
        listWrap.style.display = 'grid';
        listWrap.style.gridTemplateColumns = 'repeat(2, 1fr)';
        listWrap.style.gap = '0.5rem';
        
        items.forEach(item => {
          item.style.flex = 'none';
        });
        status.textContent = 'CSS Grid structures layout in two dimensions simultaneously (layout-in). Items align strictly to defined rows and columns regardless of content.';
      }
    }

    flowToggle.onChange(update);
    update();
    return container;
  };

  // 19. Contrast Ratio Tester (Contrast Section 2)
  visuals['contrast-ratio-tester'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    
    // Create actual color pickers for testing contrast
    const fPicker = el('input');
    fPicker.type = 'color'; fPicker.value = '#1e293b';
    const fGrp = el('div', 'visual-control-group');
    fGrp.append(el('label', '', 'Text Color'), fPicker);

    const bPicker = el('input');
    bPicker.type = 'color'; bPicker.value = '#43d6b5';
    const bGrp = el('div', 'visual-control-group');
    bGrp.append(el('label', '', 'Background Color'), bPicker);

    const displayCanvas = el('div', 'contrast-tester-canvas', 'Legible text matches contrast requirements.');
    preview.append(displayCanvas);

    const status = el('div', 'visual-status');
    controls.append(fGrp, bGrp, status);

    function relativeLuminance(hex) {
      const channels = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    }

    function update() {
      const textCol = fPicker.value;
      const bgCol = bPicker.value;

      displayCanvas.style.color = textCol;
      displayCanvas.style.background = bgCol;

      const lum1 = relativeLuminance(textCol);
      const lum2 = relativeLuminance(bgCol);
      const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

      const passAA_Normal = ratio >= 4.5;
      const passAA_Large = ratio >= 3;
      const passAAA_Normal = ratio >= 7;

      status.textContent = `Contrast Ratio: ${ratio.toFixed(2)}:1. WCAG AA: Normal text ${passAA_Normal ? 'Passes' : 'Fails'}, Large text ${passAA_Large ? 'Passes' : 'Fails'}. WCAG AAA: Normal text ${passAAA_Normal ? 'Passes' : 'Fails'}.`;
    }

    [fPicker, bPicker].forEach(picker => picker.addEventListener('input', update));
    update();
    return container;
  };

  // 20. Touch Target Usability (Contrast Section 4)
  visuals['touch-target-size'] = function (visual) {
    const { container, preview, controls } = shell(visual);
    const size = rangeControl('Target Size (px)', 20, 64, 48);

    const canvas = el('div', 'target-canvas');
    canvas.innerHTML = `
      <div class="target-grid-bg"></div>
      <div class="target-button-wrapper">
        <button class="target-clickable-btn" style="transition:all 0.1s ease;">TAP</button>
        <div class="target-outline-overlay" style="transition:all 0.1s ease;"></div>
      </div>
    `;
    preview.append(canvas);

    const status = el('div', 'visual-status');
    controls.append(size.grp, status);

    function update() {
      const sVal = size.input.value;
      const btn = canvas.querySelector('.target-clickable-btn');
      const overlay = canvas.querySelector('.target-outline-overlay');

      btn.style.width = `${sVal}px`;
      btn.style.height = `${sVal}px`;

      // Android guidelines specify 48x48px target size minimum
      overlay.style.width = '48px';
      overlay.style.height = '48px';
      overlay.innerHTML = '<span>48px</span>';

      if (sVal >= 48) {
        status.textContent = `Size: ${sVal}px. Passes guidelines! Large enough to prevent accidental mis-taps on mobile devices for users with varying dexterity.`;
      } else if (sVal >= 44) {
        status.textContent = `Size: ${sVal}px. Passes iOS minimum (44px) but fails Android minimum (48px). May be difficult for some finger sizes.`;
      } else {
        status.textContent = `Size: ${sVal}px. Fails accessibility thresholds! High risk of missing or hitting adjacent items.`;
      }
    }

    size.input.addEventListener('input', update);
    update();
    return container;
  };

  // Dispatcher
  window.GD = window.GD || {};
  window.GD.visuals = {
    render(config) {
      const renderer = visuals[config.type];
      if (!renderer) {
        console.warn(`No interactive visual renderer found for type: ${config.type}`);
        return null;
      }
      return renderer(config);
    }
  };

})();
