window.GDLessons = window.GDLessons || {};

window.GDLessons["elements-of-design"] = {
  id: "elements-of-design",
  title: "Elements of Design",
  kicker: "The materials of visual form",
  description: "Learn to recognize and control line, shape, form, space, value, texture, and color. These elements do not carry fixed meanings, but their qualities and relationships give designers a precise vocabulary for making and analyzing compositions.",
  duration: "60 minutes",
  difficulty: "Beginner",
  accent: "#ff9d5c",
  objectives: [
    "Identify the major visual elements in designed artifacts.",
    "Describe how the qualities of a line influence direction, division, and expression.",
    "Distinguish shape from form and positive space from negative space.",
    "Use value and texture to clarify depth, emphasis, and surface character.",
    "Combine elements intentionally in a small composition."
  ],
  terms: [
    { term: "Line", definition: "A mark that connects points or traces a path; its direction, weight, edge, and continuity affect how it functions." },
    { term: "Shape", definition: "A two-dimensional area defined by an edge, boundary, color, or value difference." },
    { term: "Form", definition: "A three-dimensional object, or the visual suggestion of volume in a two-dimensional image." },
    { term: "Positive space", definition: "The area occupied by a subject or active visual form." },
    { term: "Negative space", definition: "The area around and between subjects, including openings enclosed by them." },
    { term: "Value", definition: "The relative lightness or darkness of a color or neutral tone." },
    { term: "Texture", definition: "The physical or represented surface quality of a material or image." },
    { term: "Hue", definition: "A color family identified by names such as red, green, or blue." }
  ],
  misconceptions: [
    { claim: "Every diagonal line communicates speed.", correction: "Direction can suggest movement, but meaning also depends on weight, repetition, subject matter, culture, and surrounding elements." },
    { claim: "Negative space is whatever the designer forgot to fill.", correction: "Negative space is an active compositional element that can group, separate, frame, and even form recognizable shapes." },
    { claim: "Form only exists in sculpture and other physical objects.", correction: "A flat image can imply form through value shifts, perspective, overlap, scale, and other depth cues." },
    { claim: "Texture must be rough or decorative.", correction: "Texture describes any surface quality, from polished glass to coarse paper, and should support the message rather than add noise." }
  ],
  sections: [
    {
      id: "line",
      eyebrow: "01 / Direction",
      title: "Line connects, divides, and guides",
      body: [
        "A line may be drawn, printed, photographed, or implied by aligned objects and eye direction. Its direction, length, thickness, edge, continuity, and rhythm influence what viewers notice and how they move through a layout.",
        "Horizontal lines often feel stable, vertical lines can suggest height or structure, and diagonals can create directional energy. These are tendencies rather than universal meanings; context and composition complete the message."
      ],
      keyPoints: ["Lines may be explicit or implied.", "Line quality matters as much as direction.", "Use lines to connect, separate, frame, or lead."],
      example: "A transit map simplifies routes into colored lines, using intersections and continuity to communicate connection more clearly than geographic detail would."
    },
    {
      id: "shape",
      eyebrow: "02 / Boundaries",
      title: "Shape organizes the flat picture plane",
      body: [
        "Shapes are two-dimensional areas. Geometric shapes such as circles and polygons follow regular constructions; organic shapes use irregular contours associated with living or fluid forms; abstract shapes simplify or transform recognizable subjects.",
        "Categories can overlap. A hand-drawn circle is geometric in concept but organic in edge quality. Instead of labeling alone, ask how contour, proportion, repetition, and cultural association affect the composition."
      ],
      keyPoints: ["A boundary can be drawn or implied.", "Geometric, organic, and abstract are useful but flexible categories.", "Silhouette affects recognition and tone."],
      example: "A safety icon reduces a complex human action to a bold silhouette that remains recognizable at small size."
    },
    {
      id: "form",
      eyebrow: "03 / Volume",
      title: "Form adds physical or implied volume",
      body: [
        "Physical form has height, width, and depth. On a flat surface, designers imply form using light and shadow, value gradients, perspective, contour, overlap, and changes of scale.",
        "A believable form needs a consistent light logic. Highlights, midtones, core shadows, cast shadows, and reflected light are not decorative bands; together they describe how a surface turns and sits in space."
      ],
      keyPoints: ["Shape is two-dimensional; form has or suggests volume.", "Value is a major cue for form.", "Consistent lighting makes volume coherent."],
      example: "A circle becomes a sphere when a controlled value transition and cast shadow suggest a curved surface and contact with the ground."
    },
    {
      id: "space",
      eyebrow: "04 / Relationships",
      title: "Positive and negative space define each other",
      body: [
        "Positive space contains active subjects; negative space surrounds and passes between them. Neither is inherently more important. A clear composition shapes both at the same time.",
        "Space can suggest depth through overlap, placement, scale, atmospheric change, and perspective. In layouts, margins and gaps also create grouping and reading rhythm. Proximity should make related content feel related without crowding it."
      ],
      keyPoints: ["Subject and ground are interdependent.", "Spacing can communicate grouping.", "Depth can be physical or implied."],
      example: "The arrow hidden between letterforms in a logo works because the negative space was designed as carefully as the visible letters."
    },
    {
      id: "value",
      eyebrow: "05 / Light",
      title: "Value builds contrast, hierarchy, and depth",
      body: [
        "Value is relative lightness or darkness. A value scale can move from white through grays to black, while every hue also has a perceived value. Two different hues may become difficult to distinguish when their values are similar.",
        "Value contrast helps separate figure from ground, establish a focal area, represent illumination, and support readable text. Check a composition in grayscale to inspect value structure, but remember that color-vision accessibility needs more than a grayscale test."
      ],
      keyPoints: ["Value is distinct from hue.", "Contrast depends on relationships.", "A clear value pattern supports hierarchy and legibility."],
      example: "A bright call-to-action on a dark field attracts attention because its value difference remains strong even when the hue is removed."
    },
    {
      id: "texture",
      eyebrow: "06 / Surface",
      title: "Texture can be felt or represented",
      body: [
        "Tactile texture is physically present, as in embossed paper, woven fabric, or a matte coating. Visual texture is an image or mark pattern that suggests a surface on a flat screen or print.",
        "Texture can establish material, mood, contrast, and authenticity, but excessive texture competes with text and can weaken reproduction. Scale matters: a pattern that feels subtle on a poster may become noise in an icon."
      ],
      keyPoints: ["Tactile texture is physical.", "Visual texture is represented.", "Match texture scale and contrast to the output."],
      example: "A photograph of recycled fibers can give packaging a natural visual texture, while the actual uncoated stock provides a separate tactile experience."
    },
    {
      id: "color",
      eyebrow: "07 / Perception",
      title: "Color combines hue, value, and intensity",
      body: [
        "Color is perceived through light, surfaces, vision, and context. Hue names a color family; value describes lightness; saturation describes intensity relative to a neutral of similar lightness. Changing any dimension changes the color relationship.",
        "Color can organize categories, emphasize information, support identity, and contribute to mood. Meanings vary across cultures and situations, so color should not be the only carrier of essential information."
      ],
      keyPoints: ["Color is relational and contextual.", "Hue, value, and saturation describe different dimensions.", "Pair color cues with labels, shape, or pattern."],
      example: "A status dashboard combines color with text labels and icons so success and error states remain distinguishable without color alone."
    },
    {
      id: "integration",
      eyebrow: "08 / Synthesis",
      title: "Elements work as a system",
      body: [
        "Real compositions rarely isolate one element. A thick line can become a shape; repeated shapes create texture; value changes imply form; negative space creates a second image. Analysis is strongest when it explains these interactions.",
        "Begin with the communication need, choose one dominant element, and let the remaining elements support it. Reducing unnecessary variation often makes the intended relationship easier to perceive."
      ],
      keyPoints: ["Elements overlap in practice.", "Choose a dominant visual strategy.", "Remove choices that do not support the message."],
      example: "A music poster might use one sweeping line as a path, enlarge it into a shape, and repeat its curve as a background texture."
    }
  ],
  activity: {
    type: "element-lab",
    title: "Element variation laboratory",
    instructions: "Create three versions of the same simple message. In version one, make line the dominant element; in version two, use positive and negative shape; in version three, use value and texture. Keep the words unchanged. Compare how reading order, tone, and depth change, then identify which version best fits the intended audience.",
    legacyPath: "elements-of-design/elements-of-design.html"
  },
  review: [
    { question: "What qualities can distinguish one line from another?", answer: "Direction, length, weight, edge, continuity, curvature, and rhythm are among the useful qualities." },
    { question: "How does form differ from shape?", answer: "Shape is a two-dimensional area; form has physical volume or visually implies three dimensions." },
    { question: "How do positive and negative space interact?", answer: "The subject defines the surrounding space, and the surrounding space affects grouping, emphasis, recognition, and balance." },
    { question: "Why is value different from hue?", answer: "Value describes relative lightness or darkness, while hue names a color family." },
    { question: "What is the difference between tactile and visual texture?", answer: "Tactile texture is physically felt; visual texture represents or suggests surface quality in an image." },
    { question: "Why should color not carry essential meaning alone?", answer: "People perceive color differently and conditions vary, so labels, icons, shapes, or patterns should reinforce the meaning." }
  ],
  quiz: [
    { question: "Which line direction commonly suggests active movement or directional energy?", options: ["Horizontal", "Vertical", "Diagonal", "Perfectly centered"], answer: 2, explanation: "Diagonal direction often suggests movement because it departs from stable horizontal and vertical axes, although context shapes the final meaning." },
    { question: "What is the key difference between shape and form?", options: ["Shape is colored and form is grayscale", "Shape is two-dimensional; form has or implies three dimensions", "Shape is organic and form is geometric", "There is no useful distinction"], answer: 1, explanation: "A shape occupies a flat area, while form has physical volume or creates the visual impression of volume." },
    { question: "What is negative space?", options: ["The area around and between active subjects", "Any area colored black", "A margin created by mistake", "Only the lines of a grid"], answer: 0, explanation: "Negative space is the unoccupied area surrounding and passing between subjects; it actively shapes grouping and attention." },
    { question: "Which element is often described as a point moving through space?", options: ["Shape", "Line", "Value", "Texture"], answer: 1, explanation: "The trace of a moving point is a common foundational definition of line." },
    { question: "What does a vertical line often suggest in a composition?", options: ["Rest along a horizon", "Height, structure, or upright stability", "Rapid lateral action", "A tactile surface"], answer: 1, explanation: "Vertical direction commonly suggests height or upright structure, though other visual cues can modify that association." },
    { question: "Which shapes are constructed from regular mathematical relationships?", options: ["Organic shapes", "Chance shapes", "Geometric shapes", "Tactile shapes"], answer: 2, explanation: "Circles, squares, triangles, and polygons are familiar geometric shapes." },
    { question: "Which description best fits organic shapes?", options: ["Always perfect and symmetrical", "Only computer-generated", "Irregular or freeform contours associated with nature", "Shapes defined only by numbers"], answer: 2, explanation: "Organic shapes use irregular, flowing contours often associated with living or natural forms." },
    { question: "How can a flat image imply three-dimensional form?", options: ["By adding any border", "Through consistent value, highlights, shadows, and depth cues", "By changing the typeface", "By removing all contrast"], answer: 1, explanation: "Lighting and spatial cues describe how a surface turns and occupies implied depth." },
    { question: "Which element describes physical or represented surface quality?", options: ["Value", "Shape", "Texture", "Space"], answer: 2, explanation: "Texture concerns how a surface feels or how that surface quality is visually represented." },
    { question: "What is positive space?", options: ["Only empty margins", "The area occupied by active subjects", "Any brightly colored region", "Only grid gutters"], answer: 1, explanation: "Positive space is the area occupied by the subject or active forms." },
    { question: "Which element describes relative lightness or darkness?", options: ["Value", "Texture", "Line", "Hue name"], answer: 0, explanation: "Value describes the relative lightness or darkness of a color or neutral tone." },
    { question: "What can strong value contrast do in a layout?", options: ["Choose the font automatically", "Separate layers and establish a focal area", "Create responsive code", "Set paragraph line height"], answer: 1, explanation: "Value contrast can distinguish figure from ground, suggest depth, and strengthen hierarchy." },
    { question: "What is tactile texture?", options: ["A simulated pattern on a screen", "A physical surface quality that can be felt", "A grayscale value scale", "A type of negative space"], answer: 1, explanation: "Tactile texture exists materially, as with embossed paper, fabric, or rough stone." },
    { question: "What is visual texture?", options: ["Only a physically raised surface", "An imaged or drawn suggestion of surface quality", "A color-vision filter", "A column guide"], answer: 1, explanation: "Visual texture represents the appearance of a surface on a two-dimensional output." },
    { question: "Which element is a two-dimensional area defined by a boundary?", options: ["Form", "Line", "Shape", "Value"], answer: 2, explanation: "A shape is a flat area defined by an edge, contour, color change, or value change." }
  ],
  summary: {
    takeaways: [
      "Line quality and direction can connect, divide, frame, and guide.",
      "Shape occupies two dimensions, while form has or suggests volume.",
      "Positive and negative spaces are interdependent parts of one composition.",
      "Value describes lightness and helps establish legibility, depth, and hierarchy.",
      "Texture can be tactile or visual, and color should work with redundant information cues.",
      "Elements gain meaning through relationships and context."
    ],
    nextSteps: "Continue to Principles of Design to organize these elements through balance, hierarchy, contrast, proximity, rhythm, and unity."
  }
};
