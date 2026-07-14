window.GDLessons = window.GDLessons || {};

window.GDLessons["contrast-accessibility"] = {
  "id": "contrast-accessibility",
  "title": "Contrast & Accessibility",
  "kicker": "Make information perceivable and usable",
  "description": "Accessible design removes barriers before they become part of the interface. This lesson connects visual contrast and hierarchy with WCAG 2.2 text and non-text contrast requirements, color-independent communication, readable layouts, pointer targets, focus visibility, and meaningful image alternatives.",
  "duration": "70 minutes",
  "difficulty": "Beginner",
  "accent": "#7cdd7a",
  "terms": [
    {
      "term": "Accessibility",
      "definition": "The practice of designing content, products, and environments so people with diverse abilities can perceive, understand, navigate, and use them."
    },
    {
      "term": "WCAG",
      "definition": "Web Content Accessibility Guidelines, organized around testable success criteria for making web content more accessible."
    },
    {
      "term": "Contrast ratio",
      "definition": "A comparison of the relative luminance of a lighter and darker color, expressed on a scale from 1:1 (no contrast, same color) to 21:1 (maximum contrast, pure black and white)."
    },
    {
      "term": "Relative luminance",
      "definition": "A calculated measure of the light output of an encoded color after its channels are transformed and weighted for the contrast formula, reflecting human visual sensitivity to different wavelengths."
    },
    {
      "term": "Large-scale text",
      "definition": "For WCAG contrast criteria, text at least 18 point regular or at least 14 point bold, approximately 24 CSS px or 18.7 CSS px respectively."
    },
    {
      "term": "Color vision deficiency",
      "definition": "A variation in color perception that can reduce the distinguishability of particular hue combinations, most commonly affecting red-green distinctions."
    },
    {
      "term": "Focus indicator",
      "definition": "A visible change (such as an outline or border ring) that identifies which interactive element currently has keyboard or other input focus."
    },
    {
      "term": "Alternative text",
      "definition": "A text alternative (the alt attribute in HTML) that communicates the purpose or relevant content of a non-text item in its specific context."
    },
    {
      "term": "POUR Principles",
      "definition": "The four foundational pillars of web accessibility: Perceivable (users must be able to see or hear the info), Operable (users can use the interface), Understandable (users can comprehend the info), and Robust (content works with assistive tech)."
    },
    {
      "term": "Non-text Contrast",
      "definition": "The WCAG requirement that essential graphical objects and interface components have a contrast ratio of at least 3:1 against adjacent colors."
    },
    {
      "term": "Target Size",
      "definition": "The physical or virtual area of an interactive element that responds to pointer inputs, with WCAG 2.2 AA specifying a minimum of 24x24 CSS pixels."
    },
    {
      "term": "Screen Reader",
      "definition": "An assistive software technology that converts text and image alternative descriptions on screens into spoken audio or braille output."
    },
    {
      "term": "Focus Order",
      "definition": "The sequential path that keyboard navigation follows when a user moves through interactive elements using the Tab key."
    },
    {
      "term": "Alt Attribute",
      "definition": "The HTML attribute (`alt=\"...\"`) used to provide alternative text descriptions for images, ensuring they are accessible to screen readers."
    },
    {
      "term": "Reflow",
      "definition": "The process of layout wrapping and adjusting cleanly to fit varying viewport widths or text zooms (up to 400% zoom) without content clipping."
    }
  ],
  "objectives": [
    "Explain accessibility through the WCAG principles of perceivable, operable, understandable, and robust content.",
    "Use size, value, weight, shape, spacing, and color contrast to create visual hierarchy without sacrificing clarity.",
    "Apply WCAG 2.2 contrast thresholds accurately to normal text, large text, interface components, and essential graphics.",
    "Calculate or verify a contrast ratio without rounding a near-threshold result into a pass.",
    "Communicate status and meaning with cues that do not rely on color alone.",
    "Distinguish WCAG pointer-target requirements from platform-specific touch-target guidance.",
    "Provide visible focus and context-appropriate text alternatives for images."
  ],
  "misconceptions": [
    {
      "claim": "A contrast checker rounds 4.499:1 to 4.5:1, so normal text passes AA.",
      "correction": "WCAG thresholds are exact minimums; 4.499:1 is below 4.5:1 and fails even if a display rounds the label."
    },
    {
      "claim": "Meeting color contrast makes a page accessible.",
      "correction": "Contrast addresses only part of accessibility; structure, keyboard operation, focus, language, alternatives, zoom, motion, errors, and many other needs still matter."
    },
    {
      "claim": "A color-vision simulator reproduces exactly what all color-blind people see.",
      "correction": "Simulation is approximate and cannot represent every individual, device, or viewing condition; use it alongside non-color cues, measurement, and testing."
    },
    {
      "claim": "WCAG and Apple's interface guidance both require the same 44-pixel target.",
      "correction": "WCAG 2.2 AA Target Size (Minimum) uses 24 by 24 CSS pixels with defined exceptions, while Apple's 44 by 44 point guidance is a separate platform recommendation; WCAG also has a distinct 44 by 44 CSS pixel AAA criterion."
    }
  ],
  "sections": [
    {
      "id": "accessibility-foundations",
      "eyebrow": "01 / Foundations",
      "title": "Accessibility is a design requirement, not a final filter",
      "body": [
        "Accessibility is the practice of designing environments, products, and interfaces to be usable by everyone, regardless of physical, sensory, cognitive, or neurological abilities. In graphic and digital design, accessibility ensures that visual and interactive information does not exclude users with low vision, color blindness, learning differences, or motor impairments. Accessibility is a fundamental requirement of communication design. Designing accessibly is a legal and ethical imperative that broadens audience reach and improves overall usability. To systematize accessibility, the World Wide Web Consortium (W3C) established the Web Content Accessibility Guidelines (WCAG). WCAG is organized around four core principles, represented by the acronym POUR: Perceivable (information must be presented in ways all users can see or hear), Operable (interface components must be usable via keyboard, mouse, or touch), Understandable (content and operation must be clear and predictable), and Robust (interfaces must work reliably across diverse user agents and assistive technologies). A design must satisfy all four principles to be considered accessible.",
        "A common industry mistake is treating accessibility as a checklist applied at the end of a project. This retrospective approach leads to clunky, band-aid fixes that disrupt visual hierarchy and code structure. When accessibility is integrated into the initial design phase — planning color contrast, typographic hierarchy, responsive grid reflow, and keyboard states from the brief — it leads to cleaner, more elegant, and more usable products for everyone. Accessible design is simply good design, resolving user friction before it becomes part of the interface. Designers must also recognize that barriers can be permanent, temporary, or situational. A permanent barrier is a user with complete color-blindness or motor paralysis. A temporary barrier is a user recovering from eye surgery or navigating with a broken arm. A situational barrier is a user reading a mobile screen in bright, outdoor sunlight or holding a baby while ordering groceries. By designing interfaces that accommodate permanent constraints, designers naturally improve the experience for users navigating temporary and situational constraints."
      ],
      "keyPoints": [
        "Accessibility ensures products and content are usable by individuals with diverse abilities.",
        "WCAG POUR principles form the foundation of digital design: Perceivable, Operable, Understandable, Robust.",
        "Integrate accessibility rules early in the design brief and style guide phases to prevent clunky retrofits.",
        "Barriers can be permanent, temporary, or situational — designing for permanent constraints helps everyone.",
        "Automated tools can detect common accessibility errors, but human code review and user testing are mandatory.",
        "Inclusive design is a legal requirement in many industries, ensuring equal access to information and services."
      ],
      "example": "A university redesigns its student portal. Instead of checking accessibility only during final QA, they plan a typography scale using relative rem units, test text contrast ratios during color palette exploration, and write alt text rules for their media library. The resulting portal launches on time, works perfectly for screen-reader users, and sees a significant drop in support calls from mobile users.",
      "detailedNotes": [
        "In legal contexts, meeting accessibility standards is increasingly mandated by regulations worldwide, such as Section 508 of the Rehabilitation Act in the United States, the European Accessibility Act (EAA), and regional web accessibility laws in Canada and Australia. Non-compliance can result in substantial lawsuits, civil penalties, and public damage to corporate reputation. For government, educational, and public-facing organizations, achieving WCAG 2.1 or 2.2 Level AA compliance is typically the baseline legal standard. The POUR principles are broken down into testable success criteria, graded into three levels of conformance: A (minimum accessibility requirements), AA (the global standard for mid-level accessibility, resolving the most common barriers), and AAA (the enhanced standard for specialized or high-level accessibility). Most design contracts and corporate policies target Level AA compliance, which provides a highly inclusive experience without placing excessive restrictions on visual aesthetics.",
        "Inclusive design extends beyond digital screens. In environmental graphic design, accessibility dictates the height of signage, the contrast of text on wayfinding panels, the choice of highly legible sans-serif typefaces, and the integration of tactile braille characters. The same structural thinking — ensuring message accessibility under all viewing conditions — drives both sign fabrication and interface engineering."
      ],
      "important": "Accessibility is not a secondary feature or final check. It is a core design requirement that must be built into the style system, typography scale, and layout grids from day one.",
      "tip": "When presenting design systems to clients or stakeholders, explain accessibility decisions (like large text sizes and high-contrast buttons) in terms of usability and conversion. High contrast makes interfaces faster to read and use for all customers.",
      "check": {
        "question": "Which WCAG principle requires that content must be presented in a way that users can see or hear, meaning it cannot be invisible to all their senses?",
        "options": [
          "Operable",
          "Robust",
          "Understandable",
          "Perceivable"
        ],
        "answer": 3,
        "explanation": "The Perceivable principle of the WCAG POUR framework states that information and user interface components must be presentable to users in ways they can perceive. This means essential content cannot rely on a single sensory channel (like sight alone) and must support screen readers, captions, and text alternatives."
      }
    },
    {
      "id": "visual-contrast",
      "eyebrow": "02 / Hierarchy",
      "title": "Contrast can come from several visual differences",
      "body": [
        "Contrast is the perceived difference between two or more visual elements in a composition. In visual communication, contrast is the primary mechanism for establishing hierarchy, grouping related content, and indicating interactivity. Without sufficient contrast, a layout is a flat, uniform grid where all elements compete equally for attention, leading to reader fatigue and confusion. Designers create contrast using multiple visual variables, including size, value, weight, color hue, shape, texture, direction, and spatial isolation. Size contrast pairs large headlines with small body copy, immediately signaling where the reading path begins. Value contrast uses light and dark tones to separate active subjects from the background, which is the most critical element for text legibility. Weight contrast utilizes bold type to draw focus to headings or inline terms, while lighter weights recede. Hue contrast pairs warm colors (like red or orange) with cool colors (like blue or green) to create visual energy and direct the eye to action-oriented elements.",
        "While contrast is essential, the key to professional layout design is restraint. If every element on a page is given maximum contrast — using five different colors, massive fonts, and thick borders simultaneously — the composition becomes chaotic and the visual hierarchy collapses. Contrast operates as a currency: you must spend it wisely. A designer uses strong contrast for critical components (headlines, call-to-action buttons) and soft, subtle contrast for supporting information (metadata, border lines, secondary labels). Contrast also defines interactive states in user interfaces. When a user hovers over a button, focuses on a text input, or clicks a checkbox, the element must display a perceptible contrast change to confirm the interaction. This state differentiation is achieved using value changes (making a button slightly darker on hover), adding outlines (a focus ring), or shifting shapes (adding an active indicator dot). The contrast shift must be strong enough to be recognizable under poor screen lighting or glare."
      ],
      "keyPoints": [
        "Contrast is the perceptible difference between elements, used to build hierarchy and group content.",
        "Visual variables for contrast include size, value, weight, color, shape, spacing, and position.",
        "Value contrast (lightness/darkness) is the most critical factor for paragraph readability and legibility.",
        "Do not over-design: too much contrast across all elements creates visual noise and destroys hierarchy.",
        "Spend contrast wisely — reserve maximum differences for primary headings and critical action points.",
        "Interactive states (default, hover, focus, active, disabled) require distinct, visible contrast updates."
      ],
      "example": "A corporate landing page uses contrast effectively. The page body is clean white with dark charcoal text (high value contrast). The main headline is set in large, bold serif type (size and weight contrast). The primary 'Sign Up' button is a solid, saturated brand green with white text (hue and value contrast), immediately capturing the user's attention.",
      "detailedNotes": [
        "The Gestalt principle of similarity describes how humans naturally group elements that share visual characteristics like size, color, or shape. Conversely, the principle of anomaly states that when an element deviates from an established pattern, it immediately stands out. Designers use these principles to organize layouts, using similarity to group list items and anomaly to highlight a single featured item using contrast. Designing state transitions requires establishing a consistent interactive style. For example, a button hover state might be styled with a CSS transition that reduces lightness by 10% (e.g., `background-color: hsl(200, 80%, 40%)` transitioning to `hsl(200, 80%, 30%)`). Using HSL controls makes these state variations mathematically precise and easy to implement in code, ensuring that hover and active states maintain a consistent visual relationship across all brand colors.",
        "In physical print media, contrast also incorporates material tactile qualities. A catalog cover might combine a rough, matte paper stock with a high-gloss spot varnish on the main title. This texture contrast creates a sensory experience that draws the hand and eye to the logo, showing how contrast can transcend visual hue and value."
      ],
      "important": "If everything stands out, nothing does. Organize your layout contrast so there is a single primary focal point, clear secondary navigation, and quiet, highly readable body copy.",
      "tip": "Apply the 'squint test' to your interactive screens: blur your eyes and look at the layout. Your primary action button and primary heading should remain distinct focal points. If they blend into the background, increase their value contrast.",
      "check": {
        "question": "Which visual variable is the most critical for ensuring text legibility against a background?",
        "options": [
          "Hue contrast",
          "Value contrast",
          "Texture contrast",
          "Directional contrast"
        ],
        "answer": 1,
        "explanation": "Value contrast (the relative difference in lightness or darkness) is the primary driver of text legibility. A high value difference (like black text on a white background) is easily perceivable, whereas high hue difference with low value difference (like red text on a green background of equal value) is nearly unreadable."
      }
    },
    {
      "id": "text-contrast",
      "eyebrow": "03 / WCAG 2.2",
      "title": "Text contrast thresholds are exact minimums",
      "body": [
        "When designing text layouts, accessibility guidelines specify exact mathematical thresholds for contrast. Under WCAG 2.2 Level AA, normal text (under 18 point regular or 14 point bold) must have a contrast ratio of at least 4.5:1 against its background. Large-scale text requires a contrast ratio of at least 3:1. For the enhanced Level AAA standard, these requirements increase to at least 7:1 for normal text and at least 4.5:1 for large-scale text. These ratios are non-negotiable minimum standards. To apply these rules, designers must understand how WCAG defines text scale. Large-scale text is defined as text that is at least 18 point (approximately 24 CSS pixels) at regular weight, or at least 14 point (approximately 18.67 CSS pixels) at bold weight. Any text smaller than these dimensions is classified as normal text and must meet the higher 4.5:1 contrast requirement. Designers must avoid the common mistake of assuming that any heading is automatically 'large' under the guidelines; check the actual rendered CSS font size and weight.",
        "WCAG contrast thresholds are exact boundaries, not approximate goals. In digital contrast checking, a result of 4.499:1 is below the 4.5:1 minimum and represents a failure, even if a consumer screen or automated checker rounds the visual label to '4.5'. Rounding must never be used to convert a near-threshold failure into a pass. The designer's job is to adjust the color values (typically by darkening the text or lightening the background) until the raw, unrounded calculation meets or exceeds the success criteria. Maintaining accessible text contrast becomes more challenging when text is placed over background images, gradients, or transparent overlays. If the image features areas of high and low values (like a photo with bright sky and dark trees), text placed over it will fail contrast requirements in the light regions. To resolve this, designers place solid or high-opacity background containers behind the text, apply dark gradients below white text, or use CSS backdrops to blur and darken the image, ensuring the contrast ratio holds across the entire text field."
      ],
      "keyPoints": [
        "WCAG 2.2 AA text contrast rules: 4.5:1 minimum for normal text, 3:1 minimum for large text.",
        "WCAG 2.2 AAA text contrast rules: 7:1 minimum for normal text, 4.5:1 minimum for large text.",
        "Large text is defined as at least 18pt regular (24px) or 14pt bold (18.67px); smaller text is normal.",
        "Thresholds are absolute minimums: 4.49:1 fails the 4.5:1 standard and must not be rounded up to pass.",
        "Text over images or gradients requires solid backing plates, dark overlays, or drop-shadow containers to preserve contrast.",
        "Designing below contrast minimums locks out low-vision users and violates web accessibility standards."
      ],
      "example": "A web button uses light gray text (#9E9E9E) on a white background (#FFFFFF). A contrast check reveals a ratio of 2.5:1, failing Level AA. The designer darkens the gray text to charcoal (#616161), yielding a contrast ratio of 4.54:1. The button text now passes the Level AA standard for normal text without altering the clean, minimal aesthetic.",
      "detailedNotes": [
        "The units used to define text size vary between design tools (points, pt) and web code (pixels, px). WCAG text definitions are based on print points (pt), which date back to physical metal type sizing. In digital web browsers, point sizes are converted to CSS pixels at a standard ratio of 1pt = 1.333px. Therefore, 14pt equals 18.67px, and 18pt equals 24px. Web designers must check their CSS files using pixel values to verify they meet the large text threshold. Font weight and typeface geometry also influence perceived contrast. A very thin, light-weight typeface (like Helvetica Neue Ultra Light) may mathematically meet the 4.5:1 contrast ratio, but because the strokes are extremely narrow, it remains highly difficult to read for low-vision users. In contrast, thick, bold fonts are easier to read. WCAG guidelines recognize this by allowing bold text (14pt/18.67px) to use the lower 3:1 contrast ratio, reflecting that weight enhances legibility.",
        "When designing for high contrast, the maximum possible ratio is 21:1 (black text on a white background). While high contrast is essential for accessibility, some users with cognitive differences or dyslexia find pure black on pure white painful to read because it creates a harsh glare. To support these users, many accessibility specialists recommend using very dark gray (like #1A1A1A) instead of pure black (#000000) on white, yielding a highly readable contrast ratio of around 15:1."
      ],
      "important": "WCAG contrast standards are absolute minimums. A measured value of 4.499:1 fails Level AA. Darken your text or lighten your background until your unrounded contrast calculation is at least 4.50:1.",
      "tip": "When designing text over images, add a linear gradient overlay that fades from transparent at the top to 60% black at the bottom, and place your white text at the bottom. This guarantees high contrast even if the background image is bright or busy.",
      "visual": {
        "type": "contrast-ratio-tester",
        "title": "WCAG Contrast Ratio Validator",
        "instructions": "Choose custom foreground and background colors. Observe the calculated contrast ratio and check whether it passes AA and AAA thresholds."
      },
      "check": {
        "question": "According to WCAG 2.2 AA guidelines, what is the minimum contrast ratio required for normal-scale text (under 18pt regular/24px) against its background?",
        "options": [
          "3.0:1",
          "4.5:1",
          "7.0:1",
          "21:1"
        ],
        "answer": 1,
        "explanation": "Under WCAG 2.2 Level AA success criteria, normal-scale body text requires a minimum contrast ratio of 4.5:1 against the background to be accessible. Large-scale text requires at least 3:1."
      }
    },
    {
      "id": "measuring-contrast",
      "eyebrow": "04 / Measurement",
      "title": "Contrast compares relative luminance, not hue names",
      "body": [
        "To evaluate contrast accurately, designers must look beyond hue differences and measure relative luminance. Relative luminance is the perceived brightness of a color, calculated based on the amount of light the color emits, weighted to match the spectral sensitivity of the human eye. The WCAG contrast formula is `(L1 + 0.05) / (L2 + 0.05)`, where `L1` is the relative luminance of the lighter color and `L2` is the relative luminance of the darker color. The resulting ratio ranges from 1:1 (identical colors, zero contrast) to 21:1 (black and white, maximum contrast). Because relative luminance is weighted for human vision, the eye is far more sensitive to green and red light than to blue light. This has practical consequences in design: a pure yellow (#FFFF00) has a high relative luminance, while a pure blue (#0000FF) has a very low relative luminance. Consequently, white text (#FFFFFF) on a yellow background fails contrast checks completely, while white text on a blue background passes easily. Designers must evaluate relative luminance rather than relying on how different two hues appear on the color wheel.",
        "Hue contrast is not a substitute for luminance contrast. A classic accessibility pitfall is pairing saturated complementary colors, like red text on a green background. While these colors appear vividly different in hue, their relative luminance values are nearly identical, resulting in a contrast ratio near 1.2:1. This combination is unreadable for colorblind users, creates severe visual vibration for standard observers, and fails all accessibility standards. Designs must establish a strong value difference between foreground and background. Measuring contrast requires checking the final rendered state of the elements. Transparency settings (CSS opacity), gradients, antialiasing filters, and background images can all lower the effective contrast ratio of text. For example, if a dark gray text is placed over a light gray card container that has 50% opacity, the text contrast must be measured against the blended background color, not the card's base hex value. Designers use programmatic eyedropper tools and browser developers tab audits to verify these actual rendered values."
      ],
      "keyPoints": [
        "Contrast is calculated based on relative luminance — the perceived brightness of colors.",
        "The WCAG contrast formula is (L1 + 0.05) / (L2 + 0.05), yielding a ratio from 1:1 to 21:1.",
        "L1 must always represent the lighter color's luminance; L2 represents the darker color's luminance.",
        "The human eye is highly sensitive to green and red, and less sensitive to blue, shaping relative luminance values.",
        "Complementary hues of equal value (like red on green) lack luminance contrast and fail accessibility checks.",
        "Verify contrast using the final rendered color state, accounting for opacity, gradients, and anti-aliasing."
      ],
      "example": "A designer pairs orange text (#FF9800) with a light gray background (#F5F5F5). Visually, the orange looks distinct. However, a relative luminance calculator reveals a contrast ratio of 1.9:1, failing Level AA. Darkening the orange to a deep rust tone (#C65100) increases the contrast ratio to 4.7:1, passing the accessibility standard.",
      "detailedNotes": [
        "The math behind relative luminance involves converting digital sRGB values from their non-linear gamma-encoded state back into linear light intensity. The formula applies specific weights to each channel: `L = 0.2126 * R + 0.7152 * G + 0.0722 * B`. The green channel carries over 71% of the weight, reflecting that human eyes possess far more green-sensitive cones. This explains why dark text on green backgrounds remains highly readable, whereas dark text on blue backgrounds requires a very light shade of blue. When calculating contrast for gradient backgrounds, the designer must identify the worst-case scenario. If a text block sits over a gradient that shifts from white to light gray, the contrast ratio must be measured using the light gray value (the darkest point under the text), ensuring that the contrast remains above 4.5:1 across the entire text container. If the gradient shift is too wide, the layout must be adjusted or the text placed in a solid card.",
        "Subpixel rendering and text antialiasing can soften the edges of letterforms on low-resolution screens, blending the text color with the background color at the margins. On thin typefaces, this blending reduces the perceived contrast. Contrast measurement calculators assume solid fill colors, so designers should maintain a safety margin (e.g., aiming for 4.8:1 instead of exactly 4.5:1) to account for rendering variations across browsers and operating systems."
      ],
      "important": "Hue difference is not luminance contrast. Saturated red text on a green background has high color difference but nearly identical relative luminance, yielding a failing 1.2:1 contrast ratio that is illegible to many users.",
      "tip": "Use browser developer tools (like Chrome DevTools) to inspect elements. When you inspect a text element, the dev tools automatically calculate the contrast ratio and show a green checkmark if it passes WCAG AA or AAA guidelines, speeding up verification.",
      "check": {
        "question": "In the WCAG contrast ratio formula (L1 + 0.05) / (L2 + 0.05), what does L1 represent?",
        "options": [
          "The font size of the text",
          "The relative luminance of the lighter color",
          "The relative luminance of the darker color",
          "The opacity percentage of the container"
        ],
        "answer": 1,
        "explanation": "In the WCAG contrast formula, L1 is the relative luminance of the lighter color, and L2 is the relative luminance of the darker color. The constant 0.05 is added to prevent division-by-zero errors when calculating contrast against pitch black."
      }
    },
    {
      "id": "non-text-and-color",
      "eyebrow": "05 / Redundancy",
      "title": "Essential graphics need contrast and non-color meaning",
      "body": [
        "Accessibility requirements extend beyond text legibility to encompass user interface components and graphical objects. Under WCAG 2.2 Level AA Non-text Contrast guidelines, visual information needed to identify interactive components (such as input borders, buttons, and state indicators) and essential parts of graphics (such as charts, diagrams, and maps) must have a contrast ratio of at least 3:1 against their adjacent colors. This ensures that users with low vision can locate controls and comprehend visual data. This non-text contrast requirement applies to active user interface components in all their states (default, hover, focus, active, selected). For example, a text input border must have at least 3:1 contrast against the surrounding background so a user can identify it as a form field. If the border is a faint light gray on white, it fails. Similarly, checkmarks, radio button centers, and tab indicators require 3:1 contrast to show their state. Decorative details, icons that repeat text labels, and inactive (disabled) controls are exempt.",
        "A cornerstone of inclusive design is the rule of redundancy: color must never be the sole visual means of conveying information, prompting a response, or distinguishing an element. If a software application indicates a warning status with a red dot, a success status with a green dot, and a normal status with a blue dot, color-blind users will struggle to differentiate them. The system must pair the color changes with distinct shapes (a circle, a triangle, a square), text labels ('Warning', 'Success', 'Normal'), or icons. When designing charts and graphs, this redundancy rule is particularly critical. Rather than coding a line graph with five colored lines that rely on a separate color legend, designers place text labels directly adjacent to the lines, use different dash styles (solid, dashed, dotted), or apply distinct marker shapes (circles, triangles, squares) to the data points. This ensures the data relationships remain perceivable in grayscale, when printed in black and white, or by users with color vision deficiencies."
      ],
      "keyPoints": [
        "WCAG 2.2 AA Non-text Contrast requires at least 3:1 contrast for essential UI boundaries and graphical parts.",
        "Active input borders, checkboxes, and state indicators must stand out against their backgrounds by 3:1.",
        "Color must not be the only indicator of information, status, or action — pair color with shape, text, or icons.",
        "Interactive states (hover, focus, active) require accessible contrast transitions to be perceivable.",
        "Design charts and data graphics using direct labels, varying line styles, or distinct patterns rather than color coding alone.",
        "CVD simulations are valuable diagnostic aids but do not certify compliance or represent all visual ranges."
      ],
      "example": "An online booking form indicates required fields using red borders. To meet accessibility requirements, the designer adds a red asterisk (*) to the field label and includes the text description '(required)' in the input placeholder, ensuring the requirement is clear to all users.",
      "detailedNotes": [
        "The Non-text Contrast guideline (Success Criterion 1.4.11) was introduced in WCAG 2.1 to address the trend of low-contrast digital interfaces (like light gray input borders and flat, boundary-free buttons). While these designs looked clean, they created severe usability barriers for users with low vision, who could not distinguish interactive fields from static page backgrounds. Enforcing the 3:1 contrast minimum restored the visibility of interface controls. Color-vision deficiency (CVD) simulators (like the Coblis color blindness simulator) model how light wavelengths are shifted or ignored by protanopic, deuteranopic, and tritanopic vision. While helpful, designers must remember that simulators are mathematical approximations. Real-world color perception varies based on screen calibration, room glare, and individual health. Simulators should be used as a quick diagnostic check to find obvious color collisions, not as a replacement for contrast calculations.",
        "When designing map interfaces, relying on color coding alone to indicate transit routes or zoning areas is a common accessibility barrier. To resolve this, map designers use distinct patterns (hatching, dots, stripes), borders, and clear text labels placed along the routes. This design approach is visible in professional transit maps (like the Tokyo Metro or London Underground maps), where lines use both distinct colors and pattern styling."
      ],
      "important": "Color is an enhancer, not a single channel. Never use color alone to convey error, success, status, or links — always pair the color change with an icon, a text label, a pattern, or a positional change.",
      "tip": "When designing form fields, keep the input border contrast at 3:1 or higher in its default state, and increase it to 4.5:1 or add a thick focus ring when selected. This ensures that users can easily locate and track active fields.",
      "check": {
        "question": "According to WCAG 2.2 Level AA Non-text Contrast guidelines, what is the minimum contrast ratio required for active user interface components (like input borders) against their background?",
        "options": [
          "1.5:1",
          "3.0:1",
          "4.5:1",
          "7.0:1"
        ],
        "answer": 1,
        "explanation": "Under WCAG 2.2 AA SC 1.4.11, visual information required to identify user interface components and their states (such as active borders, select outlines, and buttons) must have a contrast ratio of at least 3.0:1 against adjacent colors."
      }
    },
    {
      "id": "readable-layouts",
      "eyebrow": "06 / Reading",
      "title": "Readable layouts tolerate user-controlled text",
      "body": [
        "Typographic legibility in digital design requires flexibility. Because screen sizes, viewing distances, user preferences, and individual vision vary, a fixed, rigid text layout is a major barrier to accessibility. Accessible layouts must tolerate user customization, allowing text to scale, wrap, and reflow without breaking the interface structure, clipping words, or hiding critical controls. Designers must build responsive, fluid layouts that adapt to the reader's needs rather than enforcing a static design. Web browsers and mobile operating systems allow users to increase the default font size (e.g., from 16px to 32px) or magnify the screen zoom up to 400%. Under WCAG success criteria, content must remain readable and functional when zoomed to 200% without requiring horizontal scrolling to read a single line of text (except for elements that naturally require two dimensions, like data tables or maps). This reflow capability is achieved by using responsive CSS grids, flexible containers (`max-width: 100%`), and relative sizing units.",
        "Relative CSS units, like `rem` (root em) and `em`, define font sizes and spacings relative to the user's browser settings rather than as absolute pixels (`px`). If a designer defines body copy as `1rem` (which defaults to 16px) and spacing as `2rem`, and a user increases their browser font size setting to 24px, the entire typographic system scales proportionally. If the designer specifies sizes in absolute pixels (`font-size: 16px;`), the text will ignore the user's settings, locking out readers who require larger type. Another critical layout rule is avoiding images of text. Text that is flattened or rasterized inside a JPEG or PNG image cannot be resized by the browser without pixelation, cannot be read by screen readers, cannot be highlighted or translated, and does not reflow on mobile screens. Designers should always use real, semantic HTML text styled with CSS. If a decorative display typeface is necessary, load it as a web font rather than embedding the words in an image, ensuring the content remains accessible."
      ],
      "keyPoints": [
        "Accessible layouts must tolerate user customizations like font size scaling and browser zoom.",
        "Digital text must reflow cleanly up to 200% zoom without clipping, overlapping, or requiring horizontal scrolling.",
        "Use relative CSS units (rem, em) instead of absolute pixels (px) so layouts scale with user settings.",
        "Avoid using images of text (flattened words in JPEGs) — use real, semantic HTML text styled with CSS.",
        "Real text is selectable, indexable by search engines, translatable, and readable by screen readers.",
        "Build flexible layout containers using max-width and min-height to accommodate text expansion."
      ],
      "example": "A user with moderate visual impairment increases their browser zoom to 200%. On a well-designed responsive website, the layout reflows from a three-column grid into a single-column column, and the text wraps cleanly within the viewport. No sentences are clipped, and no horizontal scrollbar appears, allowing for comfortable, accessible reading.",
      "detailedNotes": [
        "The CSS property `ch` represents the width of the '0' character in the selected font, making it an excellent relative unit for paragraph containers. By defining a container width as `max-width: 65ch;`, the designer ensures that the column width automatically scales to maintain the optimal 45-75 character reading measure, regardless of how much the user changes their font size or which typeface loads. This combine responsive layout with optimal typography. When text size is scaled, layout overlap often occurs if containers have fixed height settings. For example, a card container styled with `height: 250px;` will clip the text or cause it to overlap adjacent elements if the font size is doubled. To prevent this, designers use fluid height controls, specifying minimum height (`min-height: 250px;`) and allowing the container height to expand automatically (`height: auto;`) as the text expands.",
        "Typographic layout accessibility also requires supporting custom user stylesheets. Dyslexic users frequently load custom fonts (like OpenDyslexic) or adjust line and letter spacing to improve readability. Web layouts must be resilient, avoiding rigid positioning rules that break if the text dimensions shift. Standard-compliant CSS ensures that the layout handles these user adjustments gracefully."
      ],
      "important": "Never embed essential text inside images. Flattened text cannot be read by screen readers, cannot be selected or translated, and pixelates when zoomed. Always use real HTML text styled with CSS web fonts.",
      "tip": "Define all your font sizes, line heights, paddings, and margins using `rem` or `em` units. This creates a fully relative system that scales harmoniously whenever a user adjusts their default browser or device font settings.",
      "check": {
        "question": "Why should web designers specify font sizes in relative units (like rem or em) rather than absolute units (like px)?",
        "options": [
          "Relative units reduce the loading time of the font files",
          "Relative units allow the text to scale proportionally based on the user's browser font size settings",
          "Relative units are required to display color gradients on text",
          "Absolute pixels are not supported by mobile operating systems"
        ],
        "answer": 1,
        "explanation": "Relative CSS units (rem/em) scale dynamically relative to the user's default browser settings. If a user increases their browser font size for readability, text set in rem units scales up automatically, whereas text set in absolute pixels (px) ignores the setting, causing accessibility barriers."
      }
    },
    {
      "id": "targets-and-focus",
      "eyebrow": "07 / Operation",
      "title": "Pointer targets and focus indicators solve different barriers",
      "body": [
        "Accessible interfaces must be operable by all users, which requires designing for diverse input methods. For mouse and touch screen users, pointer targets (buttons, links, form controls) must be large enough to target easily. For keyboard, screen reader, and switch control users, interfaces must provide a logical navigation sequence and a highly visible focus indicator. These operability requirements resolve separate visual and physical barriers. Under WCAG 2.2 Level AA Target Size (Minimum) guidelines, pointer targets must be at least 24 by 24 CSS pixels in size, or include a 24-pixel diameter spacing circle around them, with defined exceptions (such as inline links within text paragraphs). This standard prevents target overlap, making elements easy to click or tap without accidental selection. Note that this WCAG AA standard differs from Apple's iOS human interface guidelines, which separately recommend a larger 44 by 44 point touch target for its specific platform.",
        "Interactive controls must also support keyboard navigation. When a user presses the Tab key, the keyboard focus must move through interactive elements in a logical, predictable sequence (typically matching the reading order: left to right, top to bottom). If a layout uses styling rules to position elements out of code sequence, the keyboard navigation will hop erratically around the screen, confusing the user. The developer must align the HTML source order with the visual layout structure. A highly visible focus indicator (typically an outline or border ring) is mandatory to show keyboard users which element is currently active. If a designer disables default browser focus outlines (using CSS `outline: none;`) without replacing them with custom focus rings, keyboard users become blind to their location on the page. The focus indicator must have sufficient contrast (at least 3:1) and remain visible, never obscured by adjacent layers, sticky headers, or side menus."
      ],
      "keyPoints": [
        "Accessible operation accommodates diverse inputs: mouse pointers, touch screens, keyboards, and switch controls.",
        "WCAG 2.2 AA requires pointer targets to be at least 24x24 CSS pixels, or satisfy spacing exceptions.",
        "Keep Apple's 44x44 point touch target guidance distinct from WCAG's base 24px success criteria.",
        "Keyboard navigation requires a logical focus order that matches the visual page hierarchy.",
        "Visible focus indicators (focus outlines) are mandatory; never disable default outlines without a replacement.",
        "Focus rings must have at least 3:1 contrast and remain visible above surrounding elements."
      ],
      "example": "A shopping cart icon button is placed in a website header. While the icon image is only 16x16px, the developer increases the padding around the icon to create a clickable target area of 32x32px. They configure a custom focus ring (`outline: 3px solid #005A9C`) that displays when a user navigates via keyboard, satisfying both pointer target and focus visibility rules.",
      "detailedNotes": [
        "The WCAG 2.2 Target Size (Minimum) Success Criterion (2.5.8) addresses the challenge of small interactive elements (like close buttons or social media icons) on mobile viewports. If buttons are placed too close together, users with tremors or temporary situational constraints (like riding a bumpy bus) will frequently tap the wrong action. The 24px minimum size or spacing buffer ensures that active target boundaries do not collide. The CSS pseudo-class `:focus-visible` is a valuable tool for styling focus indicators. Default focus styling (`:focus`) displays focus outlines for both mouse clicks and keyboard navigation. Because some stakeholders object to focus rings displaying on mouse clicks, designers use `:focus-visible` to restrict the focus ring display to keyboard users (such as when the user presses Tab), ensuring accessibility for those who need it without affecting mouse layouts.",
        "For complex interactive components (like dropdown menus, sliders, or modals), keyboard navigation must support standard keyboard interactions. For example, opening a modal should automatically move the focus inside the modal, trap the focus there so the user cannot Tab back to the background page, and close the modal when the Escape key is pressed. The developer must manage this focus loop in JavaScript."
      ],
      "important": "Never use 'outline: none;' in your CSS files without immediately replacing it with a custom focus indicator. Removing focus outlines blindfolds keyboard users, making the interface completely inoperable for them.",
      "tip": "When styling text links, ensure the focus indicator extends around the entire link block and has a high-contrast border. This makes it easy for keyboard users to track their progress through the page content.",
      "visual": {
        "type": "touch-target-size",
        "title": "Touch Target Size Usability",
        "instructions": "Adjust the target size slider. Observe how the tap area compares to the standard Android 48px guidelines and iOS 44px boundaries."
      },
      "check": {
        "question": "What is the minimum pointer target size specified by WCAG 2.2 Level AA guidelines (excluding spacing exceptions)?",
        "options": [
          "12x12 CSS pixels",
          "24x24 CSS pixels",
          "44x44 point coordinates",
          "80x80 CSS pixels"
        ],
        "answer": 1,
        "explanation": "WCAG 2.2 Level AA SC 2.5.8 (Target Size - Minimum) requires that pointer targets be at least 24 by 24 CSS pixels in size, or include a spacing circle that meets the criterion's exceptions. This is separate from Apple's platform-specific 44x44 point recommendation."
      }
    },
    {
      "id": "image-alternatives",
      "eyebrow": "08 / Images",
      "title": "Text alternatives follow the image's purpose",
      "body": [
        "Non-text content, such as images, icons, and illustrations, must have text alternatives to ensure the information is accessible to screen readers, braille displays, and search engines. Writing alternative text (the HTML `alt` attribute) is not a mechanical copy task; it is an editorial decision. The content of the alternative text must respond directly to the image's purpose and the information it contributes within its specific layout context. Visual elements are classified into three primary roles. Informative images convey relevant content (like a photo of a specific product). The alt text should describe the key visual details that the reader needs to know. Functional images represent actions or destinations (like a magnifying glass icon inside a search button). The alt text must describe the function of the button ('Search') rather than describing the graphic ('magnifying glass'). Decorative images add visual styling but contain no info (like a background pattern). These should have an empty alt attribute (`alt=\"\"`) so screen readers ignore them.",
        "When writing alternative text, designers must avoid common writing errors. Do not begin description text with phrases like 'image of' or 'graphic representing'; screen readers automatically announce the element as an image, making these phrases redundant. Keep description text concise, avoiding the repetition of details already supplied by adjacent text captions or body copy. Only include specific visual details (like colors or textures) if they are relevant to the message or brand story. For complex images, like charts, graphs, or infographics, a simple alt text description is insufficient. These require a multi-layered approach. The designer provides a concise summary of the chart's main takeaway in the alt text (e.g., 'Bar chart showing a 15% increase in annual enrollment from 2024 to 2026'), and provides the raw data in an adjacent HTML table or a separate linked document. This ensures that the detailed data is navigable and accessible to screen readers."
      ],
      "keyPoints": [
        "Text alternatives (alt attributes) make non-text content accessible to screen readers and search engines.",
        "Alt text must reflect the image's purpose and context, not just provide a literal description.",
        "Informative images require descriptions of key content; functional images require description of the action.",
        "Decorative images must use empty alt text (alt=\"\") so screen readers skip them without reading filename noise.",
        "Avoid redundant phrases like 'image of' or 'photo of' in alt text — screen readers announce this automatically.",
        "Complex graphics (charts, diagrams) require a summary alt text plus a nearby tabular or text data source."
      ],
      "example": "An article discusses a new eco-friendly package. The page features a photo of the cardboard box. Because the image is informative, the designer writes: `alt=\"A biodegradable kraft-paper box with a green leaf logo printed on the lid.\"`. Below, a decorative divider line features `alt=\"\"`, ensuring screen readers skip it.",
      "detailedNotes": [
        "Screen readers handle images that lack an alt attribute completely differently from images that have an empty alt attribute (`alt=\"\"`). If the alt attribute is completely missing, the screen reader will attempt to read the image filename (e.g., 'IMG_48291_final_v2_edit.jpg') to the user. This creates severe audio clutter. Including `alt=\"\"` tells the screen reader to silent and skip the element, making it a critical requirement for code cleanliness. The context of the image changes what alt text is appropriate. Consider a photo of a brown dog catching a frisbee. In an article about dog training, the alt text might be: 'A trainer using a frisbee to teach a dog retrieval.' In a veterinary article about canine anatomy, it might be: 'A healthy adult Labrador Retriever showing athletic musculature.' In a general blog layout where the image is just placeholder decoration, it should be decorative (`alt=\"\"`). The content of the alternative text is dictated by the surrounding discussion.",
        "A common misconception is that alt text can be replaced by titles or captions. The `title` attribute in HTML creates a visual tooltip on mouse hover, but is not reliably read by screen readers and is invisible to touch screen users. The `figcaption` element provides a visible description below the image that is read by everyone. If a caption is present, the alt text should be highly concise to avoid repeating the caption text to screen reader users, balancing the visual and audio experience."
      ],
      "important": "Every image in your HTML code must have an alt attribute. Informative and functional images require descriptive alt text; decorative images require an empty alt attribute (alt=\"\") so screen readers skip them.",
      "tip": "When writing alt text for icons used inside buttons, ask yourself: 'If this icon was replaced by a text label, what would the label say?' That label is your alternative text. A trash can icon button is named 'Delete', not 'trash can'.",
      "check": {
        "question": "How should a purely decorative image (like a background flourish) be treated in HTML to ensure accessibility?",
        "options": [
          "Provide a detailed description of the decorative patterns",
          "Omit the alt attribute entirely from the image tag",
          "Provide an empty alt attribute (alt=\"\") so screen readers know to ignore it",
          "Set the alt text to the filename of the graphic file"
        ],
        "answer": 2,
        "explanation": "Decorative images do not add content and should be skipped by screen readers. Providing an empty alt attribute (alt=\"\") instructs assistive devices to ignore the image. Omitting the alt attribute entirely is an error that causes screen readers to read the filename aloud."
      }
    }
  ],
  "activity": {
    "type": "contrast-lab",
    "title": "Audit an accessible interface state set",
    "instructions": "Choose text and background colors, then record the unrounded contrast ratio and classify the pair for WCAG 2.2 AA normal text, AA large-scale text, and AAA normal text. Build default, hover, focus, error, success, and disabled states; give every essential status a non-color cue and mark the lab's color-vision views as approximate. Finally, compare a 24 by 24 CSS pixel WCAG AA target check with separate 44 by 44 point Apple platform guidance, and document which rule you are evaluating."
  },
  "review": [
    {
      "question": "What are the four core principles of web accessibility under WCAG?",
      "answer": "Perceivable, Operable, Understandable, and Robust (POUR)."
    },
    {
      "question": "What are the WCAG 2.2 Level AA contrast requirements for text?",
      "answer": "At least 4.5:1 for normal-sized text and at least 3:1 for large-scale text."
    },
    {
      "question": "What is the WCAG Level AAA contrast requirement for normal text?",
      "answer": "At least 7:1 contrast against the background."
    },
    {
      "question": "Why is a contrast check of 4.499:1 considered a failure?",
      "answer": "Because WCAG thresholds are absolute minimums. Visual values must not be rounded up to pass, and color adjustments must be made until it meets or exceeds 4.5:1."
    },
    {
      "question": "What contrast requirement applies to essential UI components and graphical parts?",
      "answer": "Under Non-text Contrast, they must have at least a 3:1 contrast ratio against adjacent colors."
    },
    {
      "question": "How should status changes be communicated in an accessible design?",
      "answer": "Never depend on color alone; always pair color changes with text labels, distinct icons, shapes, patterns, or positional changes."
    },
    {
      "question": "How do WCAG AA pointer target minimums and Apple touch target guidelines differ?",
      "answer": "WCAG 2.2 AA specifies a minimum target size of 24x24 CSS pixels or spacing exceptions. Apple's guideline recommends a larger 44x44 point size for iOS interfaces."
    },
    {
      "question": "What determines the content of alternative text for an image?",
      "answer": "The image's functional purpose and the information it contributes within the surrounding context."
    }
  ],
  "quiz": [
    {
      "question": "What is the WCAG 2.2 Level AA minimum contrast ratio for normal-sized body text?",
      "options": [
        "3.0:1",
        "4.5:1",
        "7.0:1",
        "21:1"
      ],
      "answer": 1,
      "explanation": "Under Level AA success criteria, normal text requires a contrast ratio of at least 4.5:1 against the background."
    },
    {
      "question": "What is the WCAG 2.2 Level AA minimum contrast ratio for large-scale text?",
      "options": [
        "2.0:1",
        "3.0:1",
        "4.5:1",
        "7.0:1"
      ],
      "answer": 1,
      "explanation": "Large-scale text (18pt/24px and above, or 14pt/18.67px bold) requires at least a 3:1 contrast ratio for Level AA."
    },
    {
      "question": "What is the WCAG Level AAA minimum contrast ratio for normal-sized text?",
      "options": [
        "3.0:1",
        "4.5:1",
        "7.0:1",
        "12:1"
      ],
      "answer": 2,
      "explanation": "The enhanced Level AAA standard requires a minimum contrast ratio of 7:1 for normal-sized text."
    },
    {
      "question": "Which text size and weight qualifies as large-scale under WCAG guidelines?",
      "options": [
        "Any text set in a bold heading element",
        "At least 18 point regular or at least 14 point bold",
        "Any text rendering above 14 CSS pixels",
        "Only text in the main page H1 title"
      ],
      "answer": 1,
      "explanation": "WCAG defines large-scale text as text at least 18pt regular (approx. 24px) or 14pt bold (approx. 18.67px)."
    },
    {
      "question": "A text-background combination has a measured contrast of 4.495:1. Does it pass the AA normal text standard?",
      "options": [
        "Yes, because it rounds up to 4.5",
        "Yes, if the color used is accessibility-compliant green",
        "No, it fails because it is below the exact 4.5:1 minimum and rounding is not permitted",
        "Only if viewed on high-resolution screens"
      ],
      "answer": 2,
      "explanation": "WCAG thresholds are exact minimums. A ratio of 4.495:1 is a failure, and the colors must be adjusted to meet or exceed 4.5:1."
    },
    {
      "question": "In the WCAG contrast formula, what does L1 represent?",
      "options": [
        "The relative luminance of the darker color",
        "The relative luminance of the lighter color",
        "The size of the font in pixels",
        "The width of the text column"
      ],
      "answer": 1,
      "explanation": "L1 represents the relative luminance of the lighter color, placed as the numerator in the contrast formula."
    },
    {
      "question": "What is the maximum contrast ratio possible under the WCAG formula?",
      "options": [
        "4.5:1",
        "7.0:1",
        "10.0:1",
        "21.1:1 (commonly written as 21:1)"
      ],
      "answer": 3,
      "explanation": "Pure black against pure white yields the maximum contrast ratio of 21:1."
    },
    {
      "question": "What minimum contrast is required for active UI controls and essential graphics under WCAG Non-text Contrast?",
      "options": [
        "1.5:1",
        "3.0:1",
        "4.5:1",
        "7.0:1"
      ],
      "answer": 1,
      "explanation": "Essential visual components, input boundaries, and graphical parts require a contrast ratio of at least 3:1 against adjacent colors."
    },
    {
      "question": "Why is it an accessibility violation to use red and green color changes as the only indicator of success or error?",
      "options": [
        "Red and green are not corporate colors",
        "Color-blind users may not distinguish the colors, meaning color is the sole carrier of information",
        "Red-green combinations automatically slow down loading times",
        "The contrast ratio is always exactly 21:1"
      ],
      "answer": 1,
      "explanation": "Accessible design must not rely on color alone to convey meaning. It must use redundant cues (like icons, text, or shapes) so colorblind users can perceive the information."
    },
    {
      "question": "How should colorblindness simulators be used in the design process?",
      "options": [
        "To verify that contrast ratios are mathematically correct",
        "To prove that the design conforms to all legal laws",
        "As an approximate diagnostic aid to identify potential color conflicts",
        "To automatically translate print files to screen colors"
      ],
      "answer": 2,
      "explanation": "Simulators are diagnostic tools that help designers spot obvious color conflicts, but they are approximate and do not replace contrast checks."
    },
    {
      "question": "What is the base target size required under WCAG 2.2 Level AA Target Size (Minimum)?",
      "options": [
        "10x10 device pixels",
        "24x24 CSS pixels, or a spacing exception",
        "44x44 points in all cases",
        "100x100 CSS pixels"
      ],
      "answer": 1,
      "explanation": "WCAG 2.2 AA SC 2.5.8 requires a target size of at least 24x24 CSS pixels, or spacing circles that meet exceptions."
    },
    {
      "question": "How do WCAG 2.2 AA target size rules and Apple design recommendations differ?",
      "options": [
        "WCAG requires 24 CSS pixels, while Apple recommends 44 points for its iOS platform",
        "They are identical rules using different terms",
        "WCAG applies to screens, Apple applies only to print",
        "Apple guidelines override WCAG standards legally"
      ],
      "answer": 0,
      "explanation": "WCAG 2.2 AA specifies a 24x24 CSS pixel minimum. Apple's guidelines recommend a larger 44x44 point size, which is a separate platform guideline."
    },
    {
      "question": "What is the primary function of a visible focus indicator?",
      "options": [
        "To highlight decorative images on mouse hover",
        "To show keyboard users which element currently has input focus",
        "To show the download progress of web files",
        "To convert RGB hex codes to CMYK print targets"
      ],
      "answer": 1,
      "explanation": "A visible focus indicator (like an outline focus ring) tells keyboard navigators exactly where they are on the screen."
    },
    {
      "question": "How should a purely decorative image be configured in HTML to ensure accessibility?",
      "options": [
        "Describe the decorative shapes in detail in the alt text",
        "Set the alt text to the filename of the image file",
        "Provide an empty alt attribute (alt=\"\") so screen readers ignore it",
        "Omit the alt attribute entirely from the image tag"
      ],
      "answer": 2,
      "explanation": "Decorative images must use an empty alt attribute (alt=\"\"), which tells screen readers to silently skip the image. Omitting the alt attribute causes screen readers to read the filename."
    },
    {
      "question": "What is the best practice for writing alternative text for images?",
      "options": [
        "Always start with the phrase 'image of' or 'photo of'",
        "Limit all descriptions to exactly 50 characters",
        "Write text that communicates the image's relevant content or function in the surrounding context",
        "Repeat the caption text exactly to ensure redundancy"
      ],
      "answer": 2,
      "explanation": "Alt text should convey the image's purpose or function in context, keeping it concise and avoiding redundant caption repetitions."
    }
  ],
  "summary": {
    "takeaways": [
      "Accessibility covers perceivable, operable, understandable, and robust interfaces, not contrast alone.",
      "WCAG 2.2 AA requires at least 4.5:1 contrast for normal text and 3:1 for large text; AAA requires 7:1 for normal text.",
      "Do not round near-threshold values to pass, and test rendered colors in all active interaction states.",
      "Color-coded meaning must be accompanied by redundant cues (text, icons, patterns, shapes) for accessibility.",
      "Accessible layouts use relative units (rem/em) and flexible containers to support zoom and text reflow.",
      "Provide visible, high-contrast keyboard focus indicators, accessible target sizes, and purpose-driven alt text."
    ],
    "nextSteps": "You have completed all seven modules of the Graphic Design course. Continue to the Progress page to review your learning record and complete any pending activities."
  }
};
