window.GDLessons = window.GDLessons || {};

window.GDLessons["typography"] = {
  id: "typography",
  title: "Typography",
  kicker: "Give written language a visible voice",
  description: "Typography organizes written language for reading, navigation, tone, and identity. Learn type classification, letter anatomy, hierarchy, spacing, measure, alignment, pairing, and accessibility through decisions that respond to actual content and context.",
  duration: "60 minutes",
  difficulty: "Beginner",
  accent: "#f2cf62",
  objectives: [
    "Distinguish major typeface classifications without treating them as rigid style rules.",
    "Identify core letter-anatomy terms and explain why they matter.",
    "Build a typographic hierarchy for scanning and sustained reading.",
    "Differentiate kerning, tracking, and leading and adjust each appropriately.",
    "Evaluate measure, alignment, pairing, and accessibility in context."
  ],
  terms: [
    { term: "Typeface", definition: "A designed system of letterforms and related characters, such as a named design family." },
    { term: "Font", definition: "A particular usable instance or file of a typeface, traditionally defined by style and size and digitally by style or variation settings." },
    { term: "Baseline", definition: "The reference line on which most letters sit." },
    { term: "x-height", definition: "The height of the main body of lowercase letters, conventionally measured by the lowercase x." },
    { term: "Kerning", definition: "The adjustment of space between a particular pair of characters." },
    { term: "Tracking", definition: "A consistent adjustment to spacing across a selected range of characters." },
    { term: "Leading", definition: "The vertical distance from one line's baseline to the next, commonly controlled as line height." },
    { term: "Measure", definition: "The length of a line or width of a text column, often discussed through average characters per line." },
    { term: "Hierarchy", definition: "The visible organization of text into levels of importance and sequence." }
  ],
  misconceptions: [
    { claim: "Serif type is always best for print and sans serif is always best for screens.", correction: "Well-designed examples of both categories can work in print and on screens; size, spacing, rendering, language, and reading context matter more than the category alone." },
    { claim: "Leading is the empty gap between two visible lines.", correction: "Leading is measured baseline to baseline, so the visible gap also depends on the typeface's size and metrics." },
    { claim: "A line should always contain exactly 45 to 75 characters.", correction: "That range is a useful starting point for continuous Latin-script body text, not a universal law. Typeface, size, language, device, audience, and text purpose affect a comfortable measure." },
    { claim: "Two different typefaces automatically create a good pairing.", correction: "A pairing succeeds when the typefaces have clear roles, sufficient distinction, compatible tone, needed language support, and reliable weights and styles." }
  ],
  sections: [
    {
      id: "purpose",
      eyebrow: "01 / Reading",
      title: "Typography mediates between language and reader",
      body: [
        "Typography is not merely choosing a font. It selects, sizes, spaces, aligns, and structures type so written language can be found, understood, and experienced in a particular medium.",
        "Legibility concerns recognizing characters; readability concerns comfortably processing words, lines, and longer passages. A decorative headline may be legible at display size yet unsuitable for extended reading."
      ],
      keyPoints: ["Typography gives language visible structure.", "Legibility and readability are related but distinct.", "Judge type in its real content and output."],
      example: "A condensed display face can make a short concert title memorable, while a quieter text face supports the schedule and venue details."
    },
    {
      id: "classification",
      eyebrow: "02 / Families",
      title: "Classification helps describe, not stereotype",
      body: [
        "Serif typefaces have finishing strokes or structural details called serifs; sans serif typefaces omit conventional serifs. Slab serifs often use sturdy, block-like serifs. Script faces draw from written forms, display faces are created for prominent sizes or specific expressive settings, and monospaced faces allocate equal advance width to each character.",
        "These categories contain enormous variety and sometimes overlap. Select a typeface by its actual forms, weights, language coverage, numerals, punctuation, licensing, and performance, not by a slogan such as 'serif means traditional.'"
      ],
      keyPoints: ["Classification is descriptive.", "Inspect the actual family, not just its label.", "Language and character support are production requirements."],
      example: "A humanist sans serif may feel warmer than a geometric sans, even though both belong to the same broad sans-serif category."
    },
    {
      id: "anatomy",
      eyebrow: "03 / Letterforms",
      title: "Anatomy names the structures designers compare",
      body: [
        "Most letters sit on the baseline. Cap height describes the height of flat-topped capitals; x-height describes the main lowercase body. Ascenders rise above the x-height, descenders extend below the baseline, and counters are enclosed or partly enclosed spaces inside letters.",
        "Anatomy affects performance. A generous x-height can make lowercase text appear larger at the same nominal size, while open counters and clear character distinctions can improve recognition under difficult viewing conditions."
      ],
      keyPoints: ["Baseline and x-height organize letter bodies.", "Ascenders and descenders aid word shape.", "Counters and character distinctions affect recognition."],
      example: "Compare lowercase 'a', 'e', and 's' at small size: if their counters close up, the typeface may need more size, weight, or a different choice."
    },
    {
      id: "hierarchy",
      eyebrow: "04 / Structure",
      title: "Hierarchy turns text into navigable information",
      body: [
        "A typographic hierarchy assigns visual roles to headings, subheadings, body text, captions, labels, and actions. Size, weight, style, color, case, position, and spacing can distinguish levels.",
        "Use the fewest distinctions that express the content structure. Strong spacing before a heading may communicate a new section more effectively than adding another color or typeface. Semantic document structure should match the visible hierarchy so assistive technology receives the same organization."
      ],
      keyPoints: ["Begin with content roles.", "Use a limited, repeatable type scale.", "Align visual and semantic hierarchy."],
      example: "A report uses one heading family and one text family, with three repeatable size-and-spacing levels rather than inventing a new style for every page."
    },
    {
      id: "spacing",
      eyebrow: "05 / Rhythm",
      title: "Kerning, tracking, and leading solve different spaces",
      body: [
        "Kerning adjusts a particular pair such as 'To' or 'VA.' Tracking changes spacing across a selected word, line, or passage. Leading controls the baseline-to-baseline distance between lines.",
        "Good spacing looks optically even rather than mathematically identical. Display type may need careful pair adjustments; all-cap labels often benefit from modest positive tracking; body text usually needs restrained tracking and enough leading for the eye to return to the next line without losing the paragraph's unity."
      ],
      keyPoints: ["Kerning works on pairs.", "Tracking works across a range.", "Leading establishes vertical reading rhythm.", "Spacing decisions depend on size and typeface."],
      example: "A large 'WAVE' headline may need pair-specific kerning, while an all-cap navigation label receives one controlled tracking value."
    },
    {
      id: "measure-alignment",
      eyebrow: "06 / Paragraphs",
      title: "Measure and alignment shape sustained reading",
      body: [
        "Measure is the line length of a text column. For continuous Latin-script body text, roughly 45 to 75 characters per line is a common starting range, but it must be tested with the chosen typeface, size, language, screen, and audience.",
        "Flush-left, ragged-right text supports familiar left-to-right reading and consistent word spaces. Justified text can create clean edges but needs enough measure and careful hyphenation to avoid rivers. Centered and right-aligned paragraphs are harder to follow across many lines because the starting point changes."
      ],
      keyPoints: ["Treat character ranges as starting points.", "A stable line start supports reading.", "Justification requires careful spacing and hyphenation."],
      example: "A responsive article sets a maximum text measure rather than stretching body copy across the full width of a large monitor."
    },
    {
      id: "pairing",
      eyebrow: "07 / Systems",
      title: "Pair typefaces by role, distinction, and compatibility",
      body: [
        "A single family with several weights and styles can provide a complete hierarchy. When two typefaces are useful, give them clear roles and enough contrast to appear intentional without making their proportions, tone, or texture fight the content.",
        "Test the entire character set you need, including accents, Philippine-language text, numerals, punctuation, and interface symbols. Confirm that licenses cover the planned media and that web fonts load efficiently with sensible fallbacks."
      ],
      keyPoints: ["One family may be enough.", "Give each face a clear role.", "Test language coverage, licensing, and performance."],
      example: "An editorial layout pairs a characterful serif for headlines with a restrained sans serif for metadata and body copy, then tests both with real names and dates."
    },
    {
      id: "accessibility",
      eyebrow: "08 / Verification",
      title: "Readable typography is tested, not assumed",
      body: [
        "Test type at actual size, distance, brightness, and device conditions. Check zoom and reflow, avoid embedding essential words in images, preserve sufficient text contrast, and do not use color or capitalization alone to convey status.",
        "Readable defaults should allow user preferences to work. Relative units, flexible containers, adequate line spacing, meaningful headings, and resilient fallbacks help content survive magnification, narrow screens, missing fonts, and assistive technologies."
      ],
      keyPoints: ["Test real output conditions.", "Support zoom and reflow.", "Keep semantic text as text.", "Let user settings remain effective."],
      example: "A mobile test at 200% text size reveals whether labels wrap cleanly, controls remain visible, and reading order still makes sense."
    }
  ],
  activity: {
    type: "type-lab",
    title: "Tune a reading system",
    instructions: "Set a heading, subheading, paragraph, caption, and action using one or two type families. Establish three hierarchy levels, then adjust leading, tracking, alignment, and column width. Test the paragraph at narrow and wide sizes. Record which change most improved scanning and which most improved sustained reading.",
    legacyPath: "typography/typography.html"
  },
  review: [
    { question: "How do typeface and font differ?", answer: "A typeface is the designed letterform system; a font is a usable instance or file representing a style or variation of that design." },
    { question: "What does x-height describe?", answer: "It describes the height of the main lowercase body, conventionally measured with the lowercase x." },
    { question: "How do kerning, tracking, and leading differ?", answer: "Kerning adjusts a character pair, tracking adjusts spacing across a range, and leading sets baseline-to-baseline distance between lines." },
    { question: "Why is 45 to 75 characters per line only a starting point?", answer: "Comfort also depends on the typeface, size, language, device, content, and audience." },
    { question: "When can one type family be better than a pairing?", answer: "When its weights and styles provide all needed roles with greater consistency, performance, or language coverage." },
    { question: "How should visible and semantic hierarchy relate?", answer: "The visual levels should reflect the document's actual heading and content structure so all readers receive the same organization." }
  ],
  quiz: [
    { question: "Which horizontal reference line supports most letterforms?", options: ["x-height", "Ascender line", "Baseline", "Cap height"], answer: 2, explanation: "Most letters sit on the baseline, while descenders extend below it." },
    { question: "Which range is a useful starting point for the measure of continuous Latin-script body text?", options: ["20 to 30 characters", "45 to 75 characters", "90 to 110 characters", "Any length works equally well"], answer: 1, explanation: "About 45 to 75 characters per line is a common starting range, but the best measure depends on the typeface, language, size, device, and reader." },
    { question: "What is leading?", options: ["Spacing across a selected range of text", "Spacing between one character pair", "Horizontal paragraph alignment", "Vertical distance from one baseline to the next"], answer: 3, explanation: "Leading establishes the baseline-to-baseline rhythm of consecutive lines." },
    { question: "Which broad type category has finishing strokes called serifs?", options: ["Sans serif", "Serif", "Monospaced", "Symbol"], answer: 1, explanation: "Serif typefaces include structural finishing strokes commonly called serifs." },
    { question: "Which broad type category omits conventional serifs?", options: ["Serif", "Script", "Blackletter", "Sans serif"], answer: 3, explanation: "Sans serif literally identifies type without conventional serif finishing strokes." },
    { question: "What is kerning?", options: ["Uniform spacing across a paragraph", "Adjustment of space between a particular character pair", "Baseline distance", "Stroke thickness"], answer: 1, explanation: "Kerning corrects the optical space of pairs such as 'AV' or 'To.'" },
    { question: "What is tracking?", options: ["A spacing adjustment across a selected range of characters", "The height of capital letters", "A method for finding missing files", "The alignment of columns"], answer: 0, explanation: "Tracking consistently increases or decreases spacing over selected text." },
    { question: "What is the part of a lowercase letter that rises above the x-height?", options: ["Descender", "Ascender", "Counter", "Terminal"], answer: 1, explanation: "An ascender is the portion of letters such as b, d, or h that extends above the x-height." },
    { question: "What is the part of a lowercase letter that extends below the baseline?", options: ["Ascender", "Descender", "Cap height", "Crossbar"], answer: 1, explanation: "A descender is the portion of letters such as g, p, or y that falls below the baseline." },
    { question: "Which category draws from connected or handwritten letterforms?", options: ["Serif", "Monospaced", "Script", "Geometric sans"], answer: 2, explanation: "Script typefaces draw from formal or informal writing traditions, though their forms vary widely." },
    { question: "What is a type family?", options: ["Every font by one designer", "A related system of styles or variations within one typeface design", "A list of heading levels", "Only the fonts preinstalled on a browser"], answer: 1, explanation: "A type family groups related styles such as regular, italic, bold, condensed, or variable instances of a design." },
    { question: "What does x-height refer to?", options: ["The width of a text block", "The height of the main lowercase body", "The height of capital letters", "The width of a crossbar"], answer: 1, explanation: "x-height is conventionally measured from the baseline to the top of the lowercase x." },
    { question: "Which typographic role is designed for sustained reading of the main text?", options: ["Display heading", "Section label", "Body copy", "Decorative initial only"], answer: 2, explanation: "Body copy carries the main continuous text and should prioritize comfortable reading." },
    { question: "What is a display typeface?", options: ["Any monospaced coding font", "A typeface intended primarily for prominent sizes or expressive short text", "A typeface that works only on screens", "A print-only file format"], answer: 1, explanation: "Display faces are designed for prominent, usually shorter settings; suitability depends on the particular design rather than a fixed point-size boundary." },
    { question: "What is font pairing?", options: ["Loading the same file twice", "Combining typefaces with clear, complementary roles", "Linking fonts to HTML only", "Adjusting one letter pair"], answer: 1, explanation: "A successful pairing assigns distinct roles while coordinating tone, proportions, language support, and hierarchy." }
  ],
  summary: {
    takeaways: [
      "Typography organizes language for recognition, navigation, reading, and expression.",
      "Classification and anatomy provide a vocabulary for comparing actual letterform systems.",
      "Hierarchy should reflect content structure through a limited set of repeatable cues.",
      "Kerning, tracking, and leading control different spacing relationships.",
      "Measure and alignment must be tested with real content, readers, and devices.",
      "Pairing, language coverage, licensing, performance, and accessibility belong to one typographic system."
    ],
    nextSteps: "Continue to Color Theory and connect typographic hierarchy with hue, value, saturation, harmony, and color accessibility."
  }
};
