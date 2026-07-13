(function () {
  'use strict';

  const activityRenderers = {};

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function control(labelText, input) {
    const label = element('label', 'lab-control');
    label.append(element('span', '', labelText), input);
    return label;
  }

  function range(min, max, value, step = 1) {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.value = value;
    input.step = step;
    return input;
  }

  function select(options, value) {
    const input = document.createElement('select');
    options.forEach(([optionValue, label]) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = label;
      option.selected = optionValue === value;
      input.append(option);
    });
    return input;
  }

  function color(value) {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value;
    return input;
  }

  function status(text = '') {
    const output = element('output', 'lab-status', text);
    output.setAttribute('aria-live', 'polite');
    return output;
  }

  function shell(activity, note) {
    const wrap = element('div', 'interactive-lab');
    const intro = element('div', 'lab-intro');
    intro.append(element('p', 'eyebrow', 'Interactive practice'), element('h2', '', activity.title), element('p', '', activity.instructions));
    if (note) intro.append(element('p', 'lab-note', note));
    const body = element('div', 'lab-body');
    wrap.append(intro, body);
    return { wrap, body };
  }

  activityRenderers['design-sandbox'] = function renderDesignSandbox(activity) {
    const { wrap, body } = shell(activity, 'Use hierarchy, alignment, color, and spacing together. There is no single correct poster.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'design-preview');
    const title = document.createElement('input');
    title.type = 'text'; title.value = 'MAKE IDEAS VISIBLE'; title.maxLength = 42;
    const align = select([['left', 'Left'], ['center', 'Center'], ['right', 'Right']], 'left');
    const size = range(38, 92, 64);
    const foreground = color('#111719');
    const background = color('#e9ff45');
    const result = status();

    preview.innerHTML = '<span>GD / 101</span><strong></strong><small>Graphic Design Foundations</small>';
    function update() {
      preview.querySelector('strong').textContent = title.value || 'Untitled';
      preview.style.setProperty('--poster-align', align.value);
      preview.style.setProperty('--poster-size', `${size.value}px`);
      preview.style.setProperty('--poster-ink', foreground.value);
      preview.style.setProperty('--poster-paper', background.value);
      const ratio = contrastRatio(foreground.value, background.value);
      result.textContent = `Text contrast: ${ratio.toFixed(2)}:1. ${ratio >= 4.5 ? 'Passes WCAG AA for normal text.' : 'Increase contrast for normal text.'}`;
    }
    [title, align, size, foreground, background].forEach(input => input.addEventListener('input', update));
    controls.append(control('Poster headline', title), control('Alignment', align), control('Headline size', size), control('Text color', foreground), control('Paper color', background), result);
    body.append(controls, preview); update();
    return wrap;
  };

  activityRenderers['element-lab'] = function renderElementLab(activity) {
    const { wrap, body } = shell(activity, 'Change one visual variable at a time, then describe the effect before changing another.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'element-preview');
    preview.append(element('div', 'element-shape'));
    const mode = select([['line', 'Line'], ['shape', 'Shape'], ['form', 'Form'], ['value', 'Value'], ['space', 'Space']], 'shape');
    const intensity = range(10, 100, 52);
    const roundness = range(0, 50, 8);
    const result = status();
    function update() {
      preview.dataset.mode = mode.value;
      preview.style.setProperty('--intensity', intensity.value / 100);
      preview.style.setProperty('--roundness', `${roundness.value}%`);
      result.textContent = `${mode.options[mode.selectedIndex].text}: intensity ${intensity.value}%, roundness ${roundness.value}%. What changed in visual weight or implied meaning?`;
    }
    [mode, intensity, roundness].forEach(input => input.addEventListener('input', update));
    controls.append(control('Element focus', mode), control('Visual intensity', intensity), control('Roundness', roundness), result);
    body.append(controls, preview); update();
    return wrap;
  };

  activityRenderers['principle-lab'] = function renderPrincipleLab(activity) {
    const { wrap, body } = shell(activity, 'Balance is relational: unequal objects can feel stable when position, color, and scale compensate for one another.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'principle-preview');
    preview.innerHTML = '<div class="principle-a"></div><div class="principle-b"></div><span></span>';
    const scale = range(40, 120, 82);
    const offset = range(15, 85, 68);
    const contrast = range(10, 100, 70);
    const result = status();
    function update() {
      preview.style.setProperty('--scale-b', scale.value / 100);
      preview.style.setProperty('--offset-b', `${offset.value}%`);
      preview.style.setProperty('--contrast', contrast.value / 100);
      const difference = Math.abs((scale.value / 100) * (offset.value / 50) - 1);
      result.textContent = difference < .35 ? 'The composition is approaching a stable asymmetrical balance.' : 'The visual weights feel uneven. Adjust scale or position to compensate.';
    }
    [scale, offset, contrast].forEach(input => input.addEventListener('input', update));
    controls.append(control('Secondary scale', scale), control('Secondary position', offset), control('Contrast', contrast), result);
    body.append(controls, preview); update();
    return wrap;
  };

  activityRenderers['type-lab'] = function renderTypeLab(activity) {
    const { wrap, body } = shell(activity, 'Typography guidance is contextual. Test the sample at the size and width where readers will actually encounter it.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'type-preview');
    preview.innerHTML = '<h3>Clarity gives language a voice.</h3><p>Typography organizes written language so readers can find, understand, and remember information.</p>';
    const family = select([['sans-serif', 'Sans serif'], ['Georgia, serif', 'Serif'], ['monospace', 'Monospace']], 'sans-serif');
    const size = range(14, 24, 17);
    const leading = range(1.1, 2, 1.5, .05);
    const tracking = range(-.04, .12, 0, .01);
    const result = status();
    function update() {
      preview.style.fontFamily = family.value;
      preview.querySelector('p').style.fontSize = `${size.value}px`;
      preview.style.lineHeight = leading.value;
      preview.style.letterSpacing = `${tracking.value}em`;
      result.textContent = `${size.value}px type, ${Number(leading.value).toFixed(2)} line height, ${Number(tracking.value).toFixed(2)}em tracking. Read the full paragraph before judging.`;
    }
    [family, size, leading, tracking].forEach(input => input.addEventListener('input', update));
    controls.append(control('Typeface category', family), control('Body size', size), control('Line height', leading), control('Tracking', tracking), result);
    body.append(controls, preview); update();
    return wrap;
  };

  activityRenderers['color-lab'] = function renderColorLab(activity) {
    const { wrap, body } = shell(activity, 'HSL is a convenient interface, not a perceptually uniform color model. Always test contrast and real viewing conditions.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'color-preview');
    const hue = range(0, 360, 174);
    const saturation = range(0, 100, 65);
    const lightness = range(10, 90, 55);
    const result = status();
    function update() {
      const h = Number(hue.value); const s = Number(saturation.value); const l = Number(lightness.value);
      const colors = [0, 30, 180, 210].map(offset => `hsl(${(h + offset) % 360} ${s}% ${l}%)`);
      preview.replaceChildren(...colors.map((value, index) => {
        const swatch = element('button', 'color-swatch', `${index + 1}`);
        swatch.type = 'button'; swatch.style.background = value; swatch.title = value;
        swatch.addEventListener('click', () => { navigator.clipboard?.writeText(value); result.textContent = `${value} copied when clipboard access is available.`; });
        return swatch;
      }));
      result.textContent = `Hue ${h}°, saturation ${s}%, lightness ${l}%. Compare the base, analogous, and complementary relationships.`;
    }
    [hue, saturation, lightness].forEach(input => input.addEventListener('input', update));
    controls.append(control('Hue', hue), control('Saturation', saturation), control('Lightness', lightness), result);
    body.append(controls, preview); update();
    return wrap;
  };

  activityRenderers['grid-lab'] = function renderGridLab(activity) {
    const { wrap, body } = shell(activity, 'A grid is a decision system, not a cage. Change the system, then decide which content relationships improve.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'grid-preview');
    for (let index = 0; index < 12; index += 1) preview.append(element('span'));
    const columns = range(2, 12, 6);
    const gutter = range(4, 32, 12);
    const margin = range(8, 48, 22);
    const result = status();
    function update() {
      preview.style.setProperty('--columns', columns.value);
      preview.style.setProperty('--gutter', `${gutter.value}px`);
      preview.style.setProperty('--margin', `${margin.value}px`);
      [...preview.children].forEach((item, index) => { item.hidden = index >= Number(columns.value); });
      result.textContent = `${columns.value} columns, ${gutter.value}px gutters, ${margin.value}px outer margins. Try grouping several columns into wider content spans.`;
    }
    [columns, gutter, margin].forEach(input => input.addEventListener('input', update));
    controls.append(control('Columns', columns), control('Gutter', gutter), control('Outer margin', margin), result);
    body.append(controls, preview); update();
    return wrap;
  };

  activityRenderers['contrast-lab'] = function renderContrastLab(activity) {
    const { wrap, body } = shell(activity, 'WCAG ratios are thresholds. A computed 4.499:1 does not meet a 4.5:1 requirement and should not be rounded up.');
    const controls = element('div', 'lab-controls');
    const preview = element('div', 'contrast-preview', 'Design for people, not perfect conditions.');
    const foreground = color('#17302a');
    const background = color('#f4f7f5');
    const size = select([['normal', 'Normal text'], ['large', 'Large text']], 'normal');
    const result = status();
    function update() {
      preview.style.color = foreground.value; preview.style.background = background.value;
      preview.classList.toggle('large', size.value === 'large');
      const ratio = contrastRatio(foreground.value, background.value);
      const aa = ratio >= (size.value === 'large' ? 3 : 4.5);
      const aaa = ratio >= (size.value === 'large' ? 4.5 : 7);
      result.textContent = `${ratio.toFixed(2)}:1 — AA ${aa ? 'passes' : 'does not pass'}; AAA ${aaa ? 'passes' : 'does not pass'} for ${size.value} text.`;
    }
    [foreground, background, size].forEach(input => input.addEventListener('input', update));
    controls.append(control('Text color', foreground), control('Background', background), control('Text category', size), result);
    body.append(controls, preview); update();
    return wrap;
  };

  function relativeLuminance(hex) {
    const channels = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  }

  function contrastRatio(first, second) {
    const one = relativeLuminance(first); const two = relativeLuminance(second);
    return (Math.max(one, two) + .05) / (Math.min(one, two) + .05);
  }

  window.GD = window.GD || {};
  window.GD.activities = {
    render(activity) {
      const renderer = activityRenderers[activity.type];
      if (!renderer) return element('p', 'empty-state', 'This activity is available in the original interactive deck.');
      return renderer(activity);
    },
    contrastRatio
  };
})();
