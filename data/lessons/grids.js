window.GDLessons = window.GDLessons || {};

window.GDLessons["grids"] = {
  id: "grids",
  title: "Grid Systems",
  kicker: "Structure content without freezing it",
  description: "Grid systems coordinate alignment, spacing, and repetition across a composition. This lesson develops the anatomy of margins, columns, gutters, flowlines, modules, and spatial zones; compares common grid types; and connects editorial structures to responsive CSS Grid and Flexbox decisions.",
  duration: "60 minutes",
  difficulty: "Beginner",
  accent: "#5eb7ff",
  objectives: [
    "Explain how a grid supports alignment, hierarchy, consistency, and production efficiency.",
    "Identify margins, columns, gutters, flowlines, modules, and spatial zones in a layout.",
    "Compare manuscript, column, modular, and hierarchical grid structures.",
    "Build flexible column spans and use the rule of thirds as a compositional experiment rather than a guarantee.",
    "Adapt a grid across content and viewport changes instead of relying on device labels alone.",
    "Choose CSS Grid, Flexbox, or a combination based on the relationships a layout must express."
  ],
  terms: [
    { term: "Grid", definition: "A system of alignment lines, tracks, and intervals used to organize content within a format." },
    { term: "Margin", definition: "The space between the outer boundary of a format and its principal content area." },
    { term: "Column", definition: "A vertical track that aligns or contains content; several columns can be combined into wider spans." },
    { term: "Gutter", definition: "The interval separating adjacent columns or rows so their content remains distinct." },
    { term: "Flowline", definition: "A horizontal alignment line that creates shared starting, ending, or pause points across a layout." },
    { term: "Module", definition: "A repeated unit formed where column and row divisions define a cell in a modular grid." },
    { term: "Spatial zone", definition: "A larger field created by grouping adjacent modules or tracks for a recurring content role." },
    { term: "Breakpoint", definition: "A condition, often based on available space, at which layout rules change to preserve content and usability." }
  ],
  misconceptions: [
    { claim: "A grid makes every layout look rigid and identical.", correction: "A grid establishes shared relationships; varied spans, offsets, scale, layers, and deliberate exceptions can produce many distinct compositions." },
    { claim: "Web layouts should always use twelve columns.", correction: "Twelve is a common, divisible choice, but the appropriate track count follows the content, format, team workflow, and required spans." },
    { claim: "CSS Grid is always for pages and Flexbox is always for components.", correction: "Grid often helps when two-dimensional tracks matter and Flexbox often helps along one main axis, but either can solve many layouts and they are frequently nested together." },
    { claim: "The rule of thirds automatically creates a balanced composition.", correction: "Thirds offer candidate alignments for exploration; subject matter, cropping, hierarchy, movement, and context determine whether the result works." }
  ],
  sections: [
    {
      id: "grid-purpose",
      eyebrow: "01 / Structure",
      title: "A grid coordinates relationships",
      body: [
        "A grid is a planning system for positioning text, images, controls, and empty space. Repeated alignment boundaries help viewers connect related material and help designers make consistent decisions across pages or screens.",
        "A grid does not decide the hierarchy. Content, type, scale, contrast, and sequence still determine emphasis. The designer selects a structure that suits the format and can deliberately cross or break it when the exception communicates a clear purpose."
      ],
      keyPoints: ["Use grids to coordinate, not merely to decorate.", "Choose structure from content and format.", "Make exceptions deliberate and legible."],
      example: "A report aligns headings, body text, charts, captions, and folios to shared boundaries while allowing one opening image to span the page."
    },
    {
      id: "grid-anatomy",
      eyebrow: "02 / Anatomy",
      title: "Margins, columns, gutters, and flowlines define the field",
      body: [
        "Margins frame the main content field. Columns divide that field vertically, while gutters preserve separation between neighboring tracks. In multicolumn layouts, text and images may occupy one column or span several.",
        "Flowlines provide horizontal alignments across columns. They can establish where titles begin, where an image edge repeats, or where a reader experiences a pause. Together, vertical columns and horizontal flowlines make relationships visible without requiring every region to be boxed."
      ],
      keyPoints: ["Margins define the outer content boundary.", "Gutters separate tracks; they are not columns.", "Flowlines coordinate horizontal positions across the format."],
      example: "Across a magazine spread, an image caption and a neighboring article heading can share a flowline even when they occupy different column spans."
    },
    {
      id: "modules-and-zones",
      eyebrow: "03 / Units",
      title: "Modules combine into spatial zones",
      body: [
        "When recurring horizontal divisions cross columns, the resulting units are modules. A modular grid supports content with repeated dimensions, such as calendars, catalogs, dashboards, or data cards, while still allowing items to span multiple units.",
        "Adjacent modules can form spatial zones assigned to recurring roles such as navigation, features, side notes, or metadata. These zones are relationships rather than mandatory containers; content should not be forced into a module if the fit harms reading or meaning."
      ],
      keyPoints: ["Modules are repeated row-and-column units.", "Spatial zones group units into meaningful fields.", "Let content needs test the module dimensions."],
      example: "A dashboard groups four modules for a trend chart, one for each summary metric, and two for a recent-activity list."
    },
    {
      id: "grid-types",
      eyebrow: "04 / Systems",
      title: "Different content suggests different grid types",
      body: [
        "A manuscript grid provides one main text block and suits continuous reading. Column grids support independent or spanning content streams. Modular grids add regular horizontal divisions. Hierarchical grids derive varied alignments from the relative importance and proportions of content rather than repeating uniform modules.",
        "These categories are analytical tools, not exclusive boxes. A publication might use a column grid for articles, modular rows for listings, and a hierarchical opening spread. Consistent margins and recurring alignments can unite the mixed structures."
      ],
      keyPoints: ["Match the grid to content behavior.", "Grid categories can overlap in one system.", "Preserve a few shared relationships when structures vary."],
      example: "A news homepage uses a hierarchical feature area above a more regular modular list of recent stories."
    },
    {
      id: "columns-and-thirds",
      eyebrow: "05 / Composition",
      title: "Column spans and thirds generate alternatives",
      body: [
        "A twelve-column grid is common because twelve divides into halves, thirds, quarters, and sixths, making many spans easy to describe. It is one useful convention rather than the universal web standard; four, six, eight, or content-defined tracks may be clearer for a given format.",
        "A three-by-three overlay suggests rule-of-thirds lines and intersections for potential focal placement. Moving a subject toward an intersection can introduce asymmetry or directional space, but centering, edge alignment, or another proportion may better fit the image and message."
      ],
      keyPoints: ["Use twelve columns when its divisibility serves required spans.", "Test several arrangements before choosing.", "Treat the rule of thirds as a prompt, not a law."],
      example: "A landing page can give copy five of twelve columns and imagery seven, then switch to one content column when the side-by-side relationship becomes cramped."
    },
    {
      id: "responsive-grids",
      eyebrow: "06 / Adaptation",
      title: "Responsive grids change when content needs change",
      body: [
        "A responsive layout can adjust margins, track count, gutter size, content order, and component behavior as available space changes. Breakpoints are most defensible where the content begins to wrap, collide, become too narrow, or lose a useful relationship—not merely at a list of named devices.",
        "Some relationships should persist while others transform. A card group may move from four columns to two and then one, while its internal spacing and heading hierarchy remain consistent. Flexible units, minimum and maximum sizes, and intrinsic wrapping can reduce the number of abrupt breakpoint changes."
      ],
      keyPoints: ["Choose breakpoints from content pressure.", "Allow track count and order to adapt.", "Combine fluid sizing with targeted layout changes."],
      example: "A gallery uses `repeat(auto-fit, minmax(...))` so cards wrap when their minimum useful width cannot fit, then uses a media query only for a navigation change."
    },
    {
      id: "grid-and-flexbox",
      eyebrow: "07 / CSS",
      title: "CSS Grid and Flexbox express different relationships",
      body: [
        "CSS Grid is often effective when items should align to explicit rows and columns or named areas. Flexbox is often effective when items distribute along one main axis and their sizes or count can vary, such as a toolbar, navigation list, or row of tags.",
        "The one-dimensional versus two-dimensional distinction is a useful heuristic, not a restriction. Grid can create a single row, Flexbox can wrap into multiple lines, and each has different source-order, sizing, overflow, and alignment behavior. Many robust interfaces use Grid for an outer region and Flexbox inside components, or the reverse."
      ],
      keyPoints: ["Select the tool from the relationship to express.", "Treat 1D versus 2D as a heuristic.", "Nest Grid and Flexbox when that makes the structure clearer."],
      example: "A product gallery uses Grid to align cards in tracks; each card uses Flexbox to keep its title, price, and action arranged vertically."
    },
    {
      id: "testing-grids",
      eyebrow: "08 / Evaluation",
      title: "Test grids with real and difficult content",
      body: [
        "A convincing placeholder layout can fail when headings wrap, translations expand, images have different proportions, data is missing, or users zoom text. Populate the system with short, long, empty, and unexpected content before treating the grid as finished.",
        "Inspect alignment and reading order at several widths, but also check keyboard sequence, zoom, reflow, and whether visual rearrangement still matches the underlying document order. Refine the grid when the structure obscures relationships or forces content into unusable dimensions."
      ],
      keyPoints: ["Test content extremes, not only ideal samples.", "Preserve a meaningful reading and focus order.", "Revise the grid when content exposes a weak rule."],
      example: "A card layout is tested with a one-word title, a four-line title, no image, a translated button label, and 200% browser zoom."
    }
  ],
  activity: {
    type: "grid-lab",
    title: "Construct a responsive content grid",
    instructions: "Build a layout for one feature story, three supporting items, and one action. Define margins, columns, gutters, at least two flowlines, and one spatial zone. Compare a 12-column version with another track count, then create wide, medium, and narrow arrangements based on where the real content becomes cramped. Explain one place where CSS Grid, Flexbox, or a deliberate combination best expresses the relationships.",
  },
  review: [
    { question: "What does a grid contribute to a composition?", answer: "It supplies shared alignment, spacing, and repetition relationships that support consistency and efficient placement." },
    { question: "How does a gutter differ from a column?", answer: "A column is a track for aligning or containing content; a gutter is the separating interval between tracks." },
    { question: "What is a flowline?", answer: "A horizontal alignment line that coordinates starts, ends, edges, or pauses across columns." },
    { question: "When is a modular grid useful?", answer: "It is useful when repeated horizontal and vertical units can organize recurring content such as cards, calendar entries, or catalog items." },
    { question: "Why are twelve-column grids common but not required?", answer: "Twelve divides into several useful equal spans, but another track count may fit the content and format more clearly." },
    { question: "How should a designer choose responsive breakpoints?", answer: "Add a breakpoint when content or interaction reveals a need—such as collision, poor measure, or lost hierarchy—rather than relying only on device names." },
    { question: "What is the qualified Grid-versus-Flexbox heuristic?", answer: "Grid often suits explicit two-dimensional track relationships, while Flexbox often suits distribution along a main axis, but their capabilities overlap and they can be combined." }
  ],
  quiz: [
    { question: "What are the spaces that separate adjacent grid columns called?", options: ["Margins", "Gutters", "Flowlines", "Spatial zones"], answer: 1, explanation: "Gutters are the intervals between columns or rows that keep neighboring content distinct." },
    { question: "What does a margin define in a grid?", options: ["The space around the principal content field", "A line of body copy", "A merged group of modules", "A CSS animation"], answer: 0, explanation: "Margins separate the main content area from the outer boundary of the format." },
    { question: "What is the role of a flowline?", options: ["To divide only vertical tracks", "To coordinate horizontal alignments across the layout", "To set every image to the same color", "To replace gutters"], answer: 1, explanation: "Flowlines provide horizontal reference positions for starts, ends, edges, and pauses across columns." },
    { question: "What is a module?", options: ["The outer page margin", "A unit formed by recurring column and row divisions", "Any decorative line", "A device breakpoint"], answer: 1, explanation: "In a modular grid, intersecting row and column divisions create repeated units called modules." },
    { question: "What is a spatial zone?", options: ["A group of adjacent modules or tracks assigned to a content role", "The gap between letters", "A single breakpoint value", "An unaligned image"], answer: 0, explanation: "Spatial zones combine units into larger recurring fields for content such as features, navigation, or metadata." },
    { question: "Which grid type begins with one principal block for continuous text?", options: ["Manuscript grid", "Modular grid", "Hierarchical grid", "Twelve-column framework"], answer: 0, explanation: "A manuscript grid centers on a main text area and is common in books, essays, and other continuous reading formats." },
    { question: "Which grid adds repeated horizontal divisions to columns?", options: ["Manuscript", "Modular", "Baseline-free", "Unstructured"], answer: 1, explanation: "A modular grid combines column and row divisions to create repeated cells." },
    { question: "What distinguishes a hierarchical grid?", options: ["It must contain twelve equal columns", "It derives varied alignments from content importance and proportion", "It prohibits image spans", "It is identical to a manuscript grid"], answer: 1, explanation: "Hierarchical grids use content-driven, often varied fields rather than a uniform repeated module." },
    { question: "Why is twelve a common column count?", options: ["Every viewport is 1200 pixels", "It divides conveniently into halves, thirds, quarters, and sixths", "CSS requires it", "It guarantees readable text"], answer: 1, explanation: "Twelve supports several equal span combinations, but that convenience does not make it mandatory." },
    { question: "How should the rule of thirds be treated?", options: ["As a guaranteed formula for balance", "As one compositional prompt to test against alternatives", "As a requirement for all interfaces", "As a replacement for hierarchy"], answer: 1, explanation: "Thirds suggest possible focal alignments, but content, cropping, movement, and purpose determine whether they work." },
    { question: "What is the strongest basis for adding a responsive breakpoint?", options: ["A popular device name alone", "A point where the content or interaction no longer works well", "Every 100 pixels", "The number of colors in the design"], answer: 1, explanation: "Content-driven breakpoints respond to an observed layout or usability need." },
    { question: "Which statement is a useful, qualified CSS layout heuristic?", options: ["Flexbox can never wrap", "Grid often suits explicit rows and columns; Flexbox often suits a main-axis distribution", "Grid is only for full pages", "The two systems must never be nested"], answer: 1, explanation: "The heuristic describes common strengths without imposing a hard boundary on either layout system." },
    { question: "When might CSS Grid and Flexbox be used together?", options: ["Never", "When an outer track system and an inner component need different alignment behavior", "Only in print", "Only when there are exactly twelve items"], answer: 1, explanation: "Nested layout methods are common—for example, Grid can place cards while Flexbox arranges content inside each card." },
    { question: "Which test is most likely to expose a weak grid?", options: ["Using only identical placeholder cards", "Trying long headings, missing images, translation, and zoom", "Hiding all gutters", "Counting guide lines"], answer: 1, explanation: "Content extremes and changed viewing conditions reveal where tracks, order, or spacing rules fail." },
    { question: "What should remain meaningful when responsive CSS visually rearranges content?", options: ["Only the background color", "The document, reading, and keyboard focus order", "A fixed desktop column count", "The rule-of-thirds intersections"], answer: 1, explanation: "Visual rearrangement should not create a confusing mismatch with semantic reading and interaction order." }
  ],
  summary: {
    takeaways: [
      "Grids coordinate alignment, spacing, and repetition while leaving room for varied spans and purposeful exceptions.",
      "Margins, columns, gutters, flowlines, modules, and spatial zones describe distinct structural roles.",
      "Manuscript, column, modular, and hierarchical grids can be selected and combined according to content.",
      "Twelve-column systems and rule-of-thirds overlays are useful options, not universal laws.",
      "Responsive layouts and CSS tools should be chosen from content behavior and tested with real extremes."
    ],
    nextSteps: "Continue to Contrast and Accessibility to ensure the structure remains perceivable, operable, understandable, and robust for a wider range of users."
  }
};
