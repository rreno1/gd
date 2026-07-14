window.GDLessons = window.GDLessons || {};

window.GDLessons["principles"] = {
  id: "principles",
  title: "Principles of Design",
  kicker: "Relationships that organize visual meaning",
  description: "Principles describe how visual elements work together. Explore balance, contrast, emphasis, hierarchy, alignment, proximity, repetition, pattern, rhythm, movement, proportion, scale, unity, and variety as flexible strategies rather than rigid formulas.",
  duration: "75 minutes",
  difficulty: "Beginner",
  accent: "#9f8cff",
  objectives: [
    "Explain how design principles organize visual relationships.",
    "Compare symmetrical, asymmetrical, and radial balance.",
    "Use contrast, emphasis, and hierarchy to control reading order.",
    "Apply alignment and proximity to clarify groups and structure.",
    "Balance unity with variety in a coherent composition."
  ],
  terms: [
    { term: "Balance", definition: "The distribution of perceived visual weight within a composition." },
    { term: "Contrast", definition: "A noticeable difference between elements, such as light and dark, large and small, or dense and open." },
    { term: "Hierarchy", definition: "The ordered levels of importance and reading sequence communicated by visual differences." },
    { term: "Proximity", definition: "The use of spatial distance to imply grouping, separation, or relationship." },
    { term: "Rhythm", definition: "A perceived pace or flow produced by repetition, interval, sequence, and variation." },
    { term: "Proportion", definition: "The size relationship among parts of an object or composition." },
    { term: "Scale", definition: "The perceived or actual size of an element, often understood relative to another element, the format, or the viewer." },
    { term: "Unity", definition: "The sense that a composition's parts belong together as a coherent whole." }
  ],
  misconceptions: [
    { claim: "Balance means both sides must match.", correction: "Symmetry is one form of balance. Unequal elements can balance through differences in size, value, color, position, texture, and surrounding space." },
    { claim: "Contrast means using opposite colors.", correction: "Color opposition is only one kind of contrast; scale, value, type, shape, direction, density, and texture can also create difference." },
    { claim: "Hierarchy is the same as making the title large.", correction: "Size helps, but hierarchy emerges from the combined effects of position, spacing, weight, color, contrast, sequence, and content." },
    { claim: "Unity requires every element to look identical.", correction: "Unity needs meaningful consistency, while controlled variety preserves distinction, interest, and function." }
  ],
  sections: [
    {
      id: "balance",
      eyebrow: "01 / Stability",
      title: "Balance distributes visual weight",
      body: [
        "Visual weight is the degree to which an element attracts attention. Size, value contrast, saturation, detail, isolation, position, and subject matter can make one element feel heavier than another.",
        "Symmetrical balance mirrors or closely corresponds across an axis; asymmetrical balance stabilizes unlike elements; radial balance organizes weight around a center. Balance can feel calm or energetic and does not require perfect equality."
      ],
      keyPoints: ["Weight is perceptual, not physical.", "Symmetry is only one balancing strategy.", "Space and position affect weight."],
      example: "One large quiet photograph on the left can balance three small, high-contrast text blocks on the right."
    },
    {
      id: "contrast-emphasis",
      eyebrow: "02 / Attention",
      title: "Contrast creates distinction; emphasis creates focus",
      body: [
        "Contrast is a difference that viewers can perceive: light against dark, large against small, serif against sans serif, rough against smooth, or dense against open. Useful contrast clarifies roles and boundaries.",
        "Emphasis makes one area especially prominent. A focal point may emerge through contrast, isolation, position, direction, or meaningful imagery. If everything demands attention, nothing receives clear emphasis."
      ],
      keyPoints: ["Contrast compares unlike qualities.", "Emphasis establishes a focal area.", "Reserve the strongest contrast for the most important information."],
      example: "A single warm button in a restrained cool interface is emphasized by color difference and isolation, not simply by brightness."
    },
    {
      id: "hierarchy",
      eyebrow: "03 / Reading Order",
      title: "Hierarchy stages information by importance",
      body: [
        "Hierarchy lets viewers distinguish levels such as title, section, body, caption, and action. It is constructed through combined cues including size, weight, placement, spacing, value, color, and repetition.",
        "A clear hierarchy supports both scanning and careful reading. The visual order should reinforce the content order; an oversized decoration should not outrank the information needed to act."
      ],
      keyPoints: ["Use multiple reinforcing cues.", "Make visual order match content importance.", "Test the first, second, and third points of attention."],
      example: "On a public notice, the hazard, required action, and date form three deliberate levels before explanatory details."
    },
    {
      id: "alignment-proximity",
      eyebrow: "04 / Structure",
      title: "Alignment and proximity reveal relationships",
      body: [
        "Alignment creates visible connections along shared edges, centers, or baselines. Consistent alignment reduces arbitrary placement and helps the eye travel through related content.",
        "Proximity uses distance to group information. Related items should generally sit closer to each other than to unrelated items, but spacing must still support legibility and touch access. Alignment and proximity work best when they express the same grouping logic."
      ],
      keyPoints: ["Align to meaningful anchors.", "Distance communicates grouping.", "Spacing systems should reflect content structure."],
      example: "A form becomes easier to scan when each label aligns with its field and the gap inside each label-field pair is smaller than the gap between questions."
    },
    {
      id: "repetition-pattern-rhythm",
      eyebrow: "05 / Continuity",
      title: "Repetition creates consistency, pattern, and rhythm",
      body: [
        "Repetition returns a visual feature such as color, shape, type treatment, rule, or spacing interval. It can unify pages, identify components, and teach users what to expect.",
        "A pattern organizes repeating motifs into a recognizable system. Rhythm is the pace or flow viewers perceive through repetitions, intervals, alternation, progression, and pauses. Variation within repetition can produce a more active rhythm without destroying consistency."
      ],
      keyPoints: ["Repeat features that carry a role.", "Pattern is an organized recurring motif.", "Rhythm depends on interval and variation as well as repetition."],
      example: "A publication repeats folios and headings for consistency, while changing image widths across a sequence creates visual rhythm."
    },
    {
      id: "movement",
      eyebrow: "06 / Flow",
      title: "Movement guides the eye through a sequence",
      body: [
        "Movement is the implied path of attention through a composition. Directional lines, gazes, gestures, perspective, cropping, gradients, sequential positions, and animated transitions can all encourage a route.",
        "Movement should serve comprehension. A strong directional cue that leads away from a call to action or creates a confusing loop works against the message."
      ],
      keyPoints: ["Movement may be implied or animated.", "Directional cues should lead toward meaningful content.", "Reading conventions and context influence eye paths."],
      example: "A figure looking toward a headline can redirect attention to it; a figure looking off the page may pull attention away."
    },
    {
      id: "proportion-scale",
      eyebrow: "07 / Size Relationships",
      title: "Proportion compares parts; scale establishes size",
      body: [
        "Proportion concerns the relationships among dimensions, such as the width of a column relative to its page or the head relative to a drawn body. Scale concerns how large something is or appears relative to the format, nearby objects, a known reference, or the viewer.",
        "Designers can use realistic scale for clarity or exaggerated scale for emphasis and expression. Ratios such as the golden ratio are optional tools, not automatic guarantees of quality. Content, use, and perception remain the test."
      ],
      keyPoints: ["Proportion relates parts to one another.", "Scale depends on a reference.", "No single ratio makes a composition successful."],
      example: "An oversized product detail changes perceived scale for emphasis, while the proportions within the product image remain believable."
    },
    {
      id: "unity-variety",
      eyebrow: "08 / Coherence",
      title: "Unity and variety work in tension",
      body: [
        "Unity is the sense that parts belong to one system. Shared grids, type families, colors, shapes, image treatments, and spacing rules can create that cohesion.",
        "Variety introduces meaningful differences so content remains distinguishable and engaging. The goal is not maximum consistency or maximum novelty, but enough repetition to establish a system and enough variation to express roles, sequence, and character."
      ],
      keyPoints: ["Unity creates belonging.", "Variety creates distinction and interest.", "Vary within a recognizable system."],
      example: "A festival series uses one grid and type family across every poster, then varies a central illustration and accent color for each event."
    }
  ],
  activity: {
    type: "principle-lab",
    title: "Rebalance and reprioritize",
    instructions: "Arrange a title, image, date, description, and action in the lab. First build a symmetrical version, then an asymmetrical version using the same content. In each, identify the first three points of attention. Adjust contrast, proximity, and alignment until the reading order matches the message, then explain how unity and variety coexist.",
  },
  review: [
    { question: "What creates visual weight?", answer: "Factors include size, value contrast, saturation, detail, isolation, position, texture, and subject matter." },
    { question: "How are contrast and emphasis related?", answer: "Contrast creates perceptible difference; a strategically strong difference can emphasize a focal area." },
    { question: "How do proximity and alignment support grouping?", answer: "Distance suggests which items belong together, while shared anchors make those relationships visible and orderly." },
    { question: "How does rhythm differ from repetition?", answer: "Repetition returns a feature; rhythm is the perceived pace or flow created by its sequence, interval, and variation." },
    { question: "How do proportion and scale differ?", answer: "Proportion compares dimensions among parts; scale describes size relative to an object, format, reference, or viewer." },
    { question: "Why does unity need variety?", answer: "Unity makes a system coherent, while controlled variety distinguishes roles and prevents monotony." }
  ],
  quiz: [
    { question: "Which principle is demonstrated by mirroring visual weight across a central axis?", options: ["Asymmetrical balance", "Symmetrical balance", "Proportion", "Emphasis"], answer: 1, explanation: "Symmetrical balance creates corresponding visual weight on opposite sides of an axis." },
    { question: "What does proximity communicate?", options: ["Elements placed near one another are likely related", "Scattered elements always form a pattern", "Empty space automatically creates contrast", "Every object must share one edge"], answer: 0, explanation: "Viewers tend to perceive nearby elements as a group, especially when the spacing pattern is consistent." },
    { question: "What is the main purpose of visual hierarchy?", options: ["To make every font decorative", "To eliminate open space", "To guide attention through levels of importance", "To copy a brand palette"], answer: 2, explanation: "Hierarchy signals relative importance and an intended reading sequence." },
    { question: "Which principle concerns the distribution of visual weight?", options: ["Rhythm", "Variety", "Balance", "Unity"], answer: 2, explanation: "Balance describes how perceived weight is distributed within a composition." },
    { question: "Which balance uses unequal elements while still creating stability?", options: ["Symmetrical balance", "Radial balance", "Asymmetrical balance", "Discordant balance"], answer: 2, explanation: "Asymmetrical balance stabilizes unlike elements through their combined size, contrast, position, and space." },
    { question: "Which principle makes one area stand out as a focal point?", options: ["Repetition", "Emphasis", "Alignment", "Proximity"], answer: 1, explanation: "Emphasis gives an element or area special prominence, often through contrast or isolation." },
    { question: "How is visual rhythm created?", options: ["By using one hue only", "Through repetition, intervals, sequence, and variation", "By filling every available space", "By removing all recurring features"], answer: 1, explanation: "Rhythm is the pace or flow perceived in a sequence of repeated and varied elements." },
    { question: "What term describes a coherent sense that all parts belong together?", options: ["Emphasis", "Variety", "Unity", "Proportion"], answer: 2, explanation: "Unity is the perceived cohesion of the composition as a whole." },
    { question: "Which principle concerns size relationships among parts?", options: ["Contrast", "Proportion", "Repetition", "Alignment"], answer: 1, explanation: "Proportion compares dimensions among parts of an object or composition." },
    { question: "Which principle concerns how large an element is or appears relative to a reference?", options: ["Scale", "Movement", "Balance", "Negative space"], answer: 0, explanation: "Scale is understood relative to nearby elements, the format, a familiar object, or the viewer." },
    { question: "How do pattern and rhythm differ?", options: ["Pattern is always 3D", "Pattern organizes recurring motifs; rhythm is the perceived pace or flow", "Pattern is neutral and rhythm is colorful", "They cannot occur together"], answer: 1, explanation: "Pattern describes an organized recurrence, while rhythm describes the movement or pace perceived through a sequence." },
    { question: "Which principle guides the eye along an implied path?", options: ["Movement", "Repetition", "Contrast", "Balance"], answer: 0, explanation: "Movement uses directional and sequential cues to guide attention through a composition." },
    { question: "Which principle uses recurring features to build consistency?", options: ["Scale", "Variety", "Repetition", "Emphasis"], answer: 2, explanation: "Repetition returns colors, forms, type treatments, or spacing rules so separate parts feel related." },
    { question: "What is radial balance?", options: ["Weight mirrored only left to right", "Weight organized around a central point", "Weight stacked only from top to bottom", "A composition without any center"], answer: 1, explanation: "Radial balance arranges elements or perceived weight around a center, as in a wheel or rosette." },
    { question: "What is the benefit of variety within a unified design?", options: ["It removes all contrast", "It creates useful distinction and prevents monotony", "It guarantees a twelve-column grid", "It reduces line spacing"], answer: 1, explanation: "Controlled variety distinguishes roles and sustains interest while shared rules preserve unity." }
  ],
  summary: {
    takeaways: [
      "Balance distributes perceived visual weight and can be symmetrical, asymmetrical, or radial.",
      "Contrast clarifies difference, while emphasis and hierarchy prioritize attention.",
      "Alignment and proximity make structure and grouping visible.",
      "Repetition supports consistency; pattern and rhythm organize recurrence in different ways.",
      "Movement directs attention, while proportion and scale control size relationships.",
      "Unity makes parts cohere and variety keeps their roles distinct and engaging."
    ],
    nextSteps: "Continue to Typography to apply hierarchy, contrast, rhythm, alignment, and proportion to written language."
  }
};
