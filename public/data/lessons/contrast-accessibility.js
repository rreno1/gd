window.GDLessons = window.GDLessons || {};

window.GDLessons["contrast-accessibility"] = {
  id: "contrast-accessibility",
  title: "Contrast & Accessibility",
  kicker: "Make information perceivable and usable",
  description: "Accessible design removes barriers before they become part of the interface. This lesson connects visual contrast and hierarchy with WCAG 2.2 text and non-text contrast requirements, color-independent communication, readable layouts, pointer targets, focus visibility, and meaningful image alternatives.",
  duration: "70 minutes",
  difficulty: "Beginner",
  accent: "#7cdd7a",
  objectives: [
    "Explain accessibility through the WCAG principles of perceivable, operable, understandable, and robust content.",
    "Use size, value, weight, shape, spacing, and color contrast to create visual hierarchy without sacrificing clarity.",
    "Apply WCAG 2.2 contrast thresholds accurately to normal text, large text, interface components, and essential graphics.",
    "Calculate or verify a contrast ratio without rounding a near-threshold result into a pass.",
    "Communicate status and meaning with cues that do not rely on color alone.",
    "Distinguish WCAG pointer-target requirements from platform-specific touch-target guidance.",
    "Provide visible focus and context-appropriate text alternatives for images."
  ],
  terms: [
    { term: "Accessibility", definition: "The practice of designing content, products, and environments so people with diverse abilities can perceive, understand, navigate, and use them." },
    { term: "WCAG", definition: "Web Content Accessibility Guidelines, organized around testable success criteria for making web content more accessible." },
    { term: "Contrast ratio", definition: "A comparison of the relative luminance of a lighter and darker color, expressed from 1:1 to 21:1." },
    { term: "Relative luminance", definition: "A calculated measure of the light output of an encoded color after its channels are transformed and weighted for the contrast formula." },
    { term: "Large-scale text", definition: "For WCAG contrast criteria, text at least 18 point regular or at least 14 point bold, approximately 24 CSS px or 18.7 CSS px respectively." },
    { term: "Color vision deficiency", definition: "A variation in color perception that can reduce the distinguishability of particular hue combinations." },
    { term: "Focus indicator", definition: "A visible change that identifies which interactive element currently has keyboard or other input focus." },
    { term: "Alternative text", definition: "A text alternative that communicates the purpose or relevant content of a non-text item in its specific context." }
  ],
  misconceptions: [
    { claim: "A contrast checker rounds 4.499:1 to 4.5:1, so normal text passes AA.", correction: "WCAG thresholds are exact minimums; 4.499:1 is below 4.5:1 and fails even if a display rounds the label." },
    { claim: "Meeting color contrast makes a page accessible.", correction: "Contrast addresses only part of accessibility; structure, keyboard operation, focus, language, alternatives, zoom, motion, errors, and many other needs still matter." },
    { claim: "A color-vision simulator reproduces exactly what all color-blind people see.", correction: "Simulation is approximate and cannot represent every individual, device, or viewing condition; use it alongside non-color cues, measurement, and testing." },
    { claim: "WCAG and Apple's interface guidance both require the same 44-pixel target.", correction: "WCAG 2.2 AA Target Size (Minimum) uses 24 by 24 CSS pixels with defined exceptions, while Apple's 44 by 44 point guidance is a separate platform recommendation; WCAG also has a distinct 44 by 44 CSS pixel AAA criterion." }
  ],
  sections: [
    {
      id: "accessibility-foundations",
      eyebrow: "01 / Foundations",
      title: "Accessibility is a design requirement, not a final filter",
      body: [
        "Accessibility considers whether people with diverse visual, auditory, motor, speech, cognitive, and neurological abilities can participate. Barriers can be permanent, temporary, or situational, and a design often becomes easier for many users when those barriers are removed early.",
        "WCAG organizes guidance around four principles: content should be perceivable, interfaces operable, information and interaction understandable, and implementation robust enough for different user agents and assistive technologies. A single visual score cannot establish all four."
      ],
      keyPoints: ["Include accessibility in the brief and prototypes.", "Use the POUR principles to inspect different kinds of barriers.", "Combine automated checks with inspection and human testing."],
      example: "A high-contrast checkout still blocks users if its address fields have no labels and its submit control cannot be reached by keyboard."
    },
    {
      id: "visual-contrast",
      eyebrow: "02 / Hierarchy",
      title: "Contrast can come from several visual differences",
      body: [
        "Contrast is a perceptible difference between elements. Designers create it through size, value, weight, hue, shape, texture, direction, spacing, and position. Coordinated differences can establish hierarchy, group related content, and distinguish interactive states.",
        "More contrast is not automatically better. If every element is maximally different, the layout loses grouping and priority. Use strong contrast for meaningful distinctions, preserve sufficient contrast for readability, and avoid using a subtle difference as the only signal for an important state."
      ],
      keyPoints: ["Match the type of contrast to the distinction.", "Reserve strong differences for meaningful hierarchy.", "Evaluate contrast within the complete composition."],
      example: "A section heading differs from body text through size, weight, spacing, and position, so its role remains clear without depending on hue alone."
    },
    {
      id: "text-contrast",
      eyebrow: "03 / WCAG 2.2",
      title: "Text contrast thresholds are exact minimums",
      body: [
        "For WCAG 2.2 level AA, normal text and images of normal text require at least 4.5:1 contrast. Large-scale text requires at least 3:1. For level AAA, normal text requires at least 7:1 and large-scale text at least 4.5:1, subject to the criteria's stated exceptions.",
        "Large-scale text means at least 18 point regular or at least 14 point bold—approximately 24 CSS px or 18.7 CSS px. Do not treat every heading as large, and do not round a measured value upward to pass: 4.499:1 is below 4.5:1. Increase the difference until the unrounded result meets or exceeds the threshold."
      ],
      keyPoints: ["AA normal text: at least 4.5:1.", "AA large-scale text: at least 3:1.", "AAA normal text: at least 7:1; AAA large-scale text: at least 4.5:1.", "Never round a near-threshold failure into a pass."],
      example: "Body copy measured at 4.49:1 fails AA for normal text even if an interface displays the rounded label '4.5.'"
    },
    {
      id: "measuring-contrast",
      eyebrow: "04 / Measurement",
      title: "Contrast compares relative luminance, not hue names",
      body: [
        "The contrast formula is (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter relative luminance and L2 the darker. Identical luminances produce 1:1; black and white reach 21:1. The order of foreground and background does not change the ratio.",
        "Measure the final rendered colors. Transparency, gradients, images, antialiasing, state changes, and overlays can change the effective combination. A color pair that appears vivid may still have weak luminance contrast, while two different hues can share nearly the same luminance."
      ],
      keyPoints: ["Use the lighter luminance as L1.", "Test final color combinations and states.", "Hue difference is not a substitute for luminance contrast."],
      example: "Saturated red and green labels may look different in hue yet provide insufficient text contrast against the same background."
    },
    {
      id: "non-text-and-color",
      eyebrow: "05 / Redundancy",
      title: "Essential graphics need contrast and non-color meaning",
      body: [
        "WCAG 2.2 level AA Non-text Contrast requires at least 3:1 against adjacent colors for visual information needed to identify user-interface components and their states, and for parts of graphics required to understand the content, with stated exceptions. Decorative details and inactive controls are treated differently from essential visual information.",
        "Color must not be the only visual means of conveying information, prompting a response, or distinguishing an element. Pair status colors with explicit text, icons, patterns, line styles, or position. Approximate color-vision simulations can help reveal collisions, but they do not certify a design or reproduce every person's experience."
      ],
      keyPoints: ["Essential component boundaries, states, and graphic parts may need 3:1 non-text contrast.", "Add a second visual cue to color-coded meaning.", "Label color-vision simulation as approximate."],
      example: "A chart differentiates series with color plus direct labels and dash patterns, so it remains understandable when hues are indistinguishable."
    },
    {
      id: "readable-layouts",
      eyebrow: "06 / Reading",
      title: "Readable layouts tolerate user-controlled text",
      body: [
        "Legibility depends on typeface, font size, weight, spacing, line length, language, screen, and viewing conditions; no single body size or character count fits every context. Use a comfortable measure, clear hierarchy, and spacing that supports scanning, then test with the actual audience and content.",
        "Web content should withstand zoom, text enlargement, and user spacing adjustments without clipping, overlap, or lost functionality. Do not place essential text inside images when real text can provide adaptation, selection, translation, and assistive-technology access."
      ],
      keyPoints: ["Treat reading recommendations as context-dependent ranges, not universal constants.", "Test zoom, reflow, and long content.", "Prefer adaptable real text to images of text."],
      example: "At 200% zoom, a responsive article reflows into a wider-reading single column instead of hiding sentences behind a fixed-height card."
    },
    {
      id: "targets-and-focus",
      eyebrow: "07 / Operation",
      title: "Pointer targets and focus indicators solve different barriers",
      body: [
        "WCAG 2.2 level AA Target Size (Minimum) requires pointer targets to be at least 24 by 24 CSS pixels, or to satisfy its spacing or other defined exceptions. WCAG level AAA has a separate 44 by 44 CSS pixel target-size criterion. Apple's 44 by 44 point touch-target recommendation is platform guidance measured in points, not the wording of the WCAG AA rule.",
        "Target dimensions alone do not support keyboard users. Interactive controls need a logical focus order and a visible focus indicator that is not obscured. Preserve familiar keyboard behavior, ensure labels identify the action, and test controls at zoom and in dense groups."
      ],
      keyPoints: ["WCAG 2.2 AA target minimum: 24 by 24 CSS px or a defined exception.", "Keep Apple 44 by 44 point guidance separate from WCAG.", "Provide visible, unobscured focus in a logical order."],
      example: "An icon action uses a generous clickable area and a visible keyboard focus ring; its accessible name describes the action rather than the icon's shape."
    },
    {
      id: "image-alternatives",
      eyebrow: "08 / Images",
      title: "Text alternatives follow the image's purpose",
      body: [
        "Alternative text should communicate what an image contributes in its current context. A functional image describes the action or destination, an informative image conveys relevant content, and a complex chart may need a concise alternative plus nearby data or a longer explanation.",
        "A purely decorative HTML image should normally use an empty alt attribute so assistive technology can ignore it. Do not apply a fixed character limit or mechanically begin every description with 'image of.' Avoid repeating information already supplied by adjacent text, and include details such as color only when they matter to the purpose."
      ],
      keyPoints: ["Write for purpose and context.", "Use empty alt text for truly decorative images.", "Provide fuller equivalents for complex visual information."],
      example: "A search button containing a magnifying-glass image is named 'Search'; the name communicates the function rather than describing a black circular lens."
    }
  ],
  activity: {
    type: "contrast-lab",
    title: "Audit an accessible interface state set",
    instructions: "Choose text and background colors, then record the unrounded contrast ratio and classify the pair for WCAG 2.2 AA normal text, AA large-scale text, and AAA normal text. Build default, hover, focus, error, success, and disabled states; give every essential status a non-color cue and mark the lab's color-vision views as approximate. Finally, compare a 24 by 24 CSS pixel WCAG AA target check with separate 44 by 44 point Apple platform guidance, and document which rule you are evaluating.",
    legacyPath: "legacy/contrast-accessibility/contrast-accessibility.html"
  },
  review: [
    { question: "What are the four WCAG principles?", answer: "Perceivable, operable, understandable, and robust." },
    { question: "What are the WCAG 2.2 AA text contrast minimums?", answer: "At least 4.5:1 for normal text and at least 3:1 for large-scale text." },
    { question: "What is the AAA minimum for normal text?", answer: "At least 7:1." },
    { question: "Does a measured 4.499:1 pass a 4.5:1 requirement?", answer: "No. The value is below the exact minimum and must not be rounded into a pass." },
    { question: "What contrast commonly applies to essential interface visuals and graphic parts under Non-text Contrast?", answer: "At least 3:1 against adjacent colors, subject to the criterion's stated scope and exceptions." },
    { question: "How should color communicate status?", answer: "Combine it with a distinguishable cue such as text, an icon, a pattern, position, or line style." },
    { question: "How do WCAG AA and Apple target-size guidance differ?", answer: "WCAG 2.2 AA uses 24 by 24 CSS pixels or defined exceptions; Apple separately recommends 44 by 44 points for its platform." },
    { question: "What determines useful alternative text?", answer: "The image's purpose and the information it adds in the surrounding context." }
  ],
  quiz: [
    { question: "What is the WCAG 2.2 level AA minimum contrast ratio for normal text?", options: ["3:1", "4.5:1", "7:1", "21:1"], answer: 1, explanation: "Normal text requires at least 4.5:1 for level AA, apart from the criterion's stated exceptions." },
    { question: "What is the WCAG 2.2 level AA minimum for large-scale text?", options: ["2:1", "3:1", "4.5:1", "7:1"], answer: 1, explanation: "Large-scale text requires at least 3:1 for level AA." },
    { question: "What is the WCAG level AAA minimum for normal text?", options: ["3:1", "4.5:1", "7:1", "12:1"], answer: 2, explanation: "Normal text requires at least 7:1 for the enhanced level AAA contrast criterion." },
    { question: "Which text qualifies as large-scale for WCAG contrast evaluation?", options: ["Any bold heading", "At least 18 pt regular or at least 14 pt bold", "Any text above 14 CSS px", "Only text in an H1 element"], answer: 1, explanation: "WCAG defines large-scale text by rendered size and weight, not by the HTML heading element alone." },
    { question: "A normal-text pair measures 4.499:1 before display rounding. Does it pass AA?", options: ["Yes, because it displays as 4.5", "Yes, if the hue is blue", "No, because it is below 4.5:1", "Only on mobile"], answer: 2, explanation: "A result below the exact threshold fails; rounding must not convert a failure into a pass." },
    { question: "In the contrast formula, what is L1?", options: ["The darker relative luminance", "The lighter relative luminance", "The font size", "The hue angle"], answer: 1, explanation: "The formula places the lighter relative luminance in the numerator as L1." },
    { question: "What is the maximum contrast ratio represented by the WCAG formula?", options: ["4.5:1", "7:1", "10:1", "21:1"], answer: 3, explanation: "Ideal encoded black and white produce the maximum ratio of 21:1." },
    { question: "What minimum contrast applies to essential component visuals and graphical objects under WCAG 2.2 Non-text Contrast?", options: ["1.5:1", "3:1", "4.5:1", "7:1"], answer: 1, explanation: "Required visual information in component identification or states and essential graphical parts needs at least 3:1 against adjacent colors, within the criterion's scope and exceptions." },
    { question: "Why is red text versus green text insufficient as the only status difference?", options: ["Color can never be used", "Some users may not distinguish the hues, so another cue is needed", "Green always means money", "Both colors always have 21:1 contrast"], answer: 1, explanation: "Essential meaning cannot depend on color perception alone; text, icons, patterns, or other cues should reinforce the status." },
    { question: "What can an approximate color-vision simulation do?", options: ["Certify complete WCAG conformance", "Show exactly what every person sees", "Reveal possible hue collisions for further testing", "Replace contrast measurement"], answer: 2, explanation: "Simulation is a diagnostic aid, not an exact reproduction or accessibility certification." },
    { question: "What does WCAG 2.2 level AA Target Size (Minimum) specify as its base size?", options: ["10 by 10 device pixels", "24 by 24 CSS pixels, or a defined exception", "44 by 44 points in every case", "80 by 80 CSS pixels"], answer: 1, explanation: "The AA criterion uses 24 by 24 CSS pixels and includes specified alternatives and exceptions." },
    { question: "Which statement keeps platform and WCAG guidance distinct?", options: ["Apple's 44 points and WCAG AA's 24 CSS pixels are separate guidance", "Both always require exactly 44 pixels", "WCAG measures all targets in Apple points", "Apple guidance replaces WCAG"], answer: 0, explanation: "Apple's 44 by 44 point recommendation is separate from WCAG 2.2 AA's 24 by 24 CSS pixel criterion." },
    { question: "What is the primary purpose of a visible focus indicator?", options: ["To increase download speed", "To show keyboard and other users which control currently has focus", "To label decorative images", "To convert RGB to CMYK"], answer: 1, explanation: "A visible focus indicator makes the current interaction location perceivable." },
    { question: "How should a purely decorative HTML image usually be exposed to assistive technology?", options: ["With a long visual description", "With an empty alt attribute", "With the filename as alt text", "By repeating the caption"], answer: 1, explanation: "An empty alt attribute tells assistive technology that the image adds no content and can be skipped." },
    { question: "What is the best basis for writing alternative text?", options: ["A fixed 100-character formula", "The image's purpose and surrounding context", "Every visible pixel", "Always starting with 'image of'"], answer: 1, explanation: "A useful text alternative conveys the image's relevant content or function in context without redundant detail." }
  ],
  summary: {
    takeaways: [
      "Accessibility requires attention to perceivable, operable, understandable, and robust experiences—not contrast alone.",
      "WCAG 2.2 AA requires at least 4.5:1 for normal text and 3:1 for large-scale text; AAA normal text requires at least 7:1.",
      "Do not round near-threshold ratios into a pass, and test the colors actually rendered in every essential state.",
      "Color-coded meaning needs another cue, and color-vision simulations must be labeled approximate.",
      "WCAG target-size criteria and Apple platform guidance use different levels and units and should be documented separately.",
      "Visible focus, adaptable text, and purpose-driven image alternatives are essential parts of usable visual design."
    ],
    nextSteps: "Apply the lesson by auditing a complete portal screen across text, graphics, controls, keyboard focus, zoom, color-independent states, and image alternatives."
  }
};
