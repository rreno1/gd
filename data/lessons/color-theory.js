window.GDLessons = window.GDLessons || {};

window.GDLessons["color-theory"] = {
  id: "color-theory",
  title: "Color Theory",
  kicker: "Build purposeful and accessible palettes",
  description: "Color is both a physical phenomenon and a design system. This lesson connects light and pigment, RGB and CMYK production, hue relationships, HSL controls, contextual color associations, and accessible palette decisions so designers can choose color with evidence rather than assumption.",
  duration: "65 minutes",
  difficulty: "Beginner",
  accent: "#ff6f91",
  objectives: [
    "Explain how visible light, surfaces, and human vision contribute to color perception.",
    "Distinguish additive RGB color from subtractive CMYK reproduction and select the appropriate model for an output.",
    "Use hue, saturation, and lightness controls to describe and adjust a color.",
    "Construct and evaluate monochromatic, analogous, complementary, split-complementary, and triadic palettes.",
    "Evaluate color associations in relation to audience, culture, content, and brand context.",
    "Design a palette that communicates status without depending on color alone."
  ],
  terms: [
    { term: "Hue", definition: "A color family identified by a name such as red, green, or blue, often represented as an angle around a color wheel." },
    { term: "Saturation", definition: "The degree of chromatic intensity in a color model; reducing saturation moves a color toward a neutral appearance." },
    { term: "Lightness", definition: "The HSL coordinate that ranges from black through a selected hue toward white; it is not a direct measurement of perceived brightness or relative luminance." },
    { term: "Additive color", definition: "Color created by combining emitted light, commonly represented by red, green, and blue channels." },
    { term: "Subtractive color", definition: "Color created when pigments or inks absorb portions of incoming light, commonly represented in process printing by cyan, magenta, yellow, and black." },
    { term: "Complementary colors", definition: "Hues positioned opposite one another on a chosen color wheel; they can create strong hue differentiation when used together." },
    { term: "Tint", definition: "A mixture or variation made lighter by adding white in traditional media, or by moving a color toward white in a digital model." },
    { term: "Shade", definition: "A mixture or variation made darker by adding black in traditional media, or by moving a color toward black in a digital model." },
    { term: "Color vision deficiency", definition: "A variation in color perception that can make some hue differences difficult or impossible to distinguish." }
  ],
  misconceptions: [
    { claim: "Each color has one universal psychological meaning.", correction: "Color associations vary with culture, experience, surrounding colors, wording, product category, and context; designers should research and test with the intended audience." },
    { claim: "A harmonious palette is automatically readable.", correction: "Hue relationships do not guarantee sufficient value contrast, legibility, or distinguishable status cues." },
    { claim: "HSL lightness is the same as perceived brightness or WCAG relative luminance.", correction: "HSL is a convenient editing model, but equal HSL lightness values can look different and can produce very different contrast ratios." },
    { claim: "A color-vision simulation shows exactly what every affected person sees.", correction: "Simulation is an approximate diagnostic aid; color vision varies by person, device, and condition, so designs also need contrast checks and non-color cues." }
  ],
  sections: [
    {
      id: "perceiving-color",
      eyebrow: "01 / Perception",
      title: "Color begins with light, surfaces, and observers",
      body: [
        "Visible light contains a range of wavelengths. A surface absorbs, transmits, and reflects different portions of that light; the light reaching the eye is interpreted by the visual system in relation to its surroundings and viewing conditions.",
        "Human color vision normally depends on three classes of cone photoreceptors with overlapping sensitivities, while rods are especially important in low-light vision. Adaptation, illumination, adjacent colors, displays, inks, and individual vision all affect the result, so color is never perceived in isolation."
      ],
      keyPoints: ["Color perception depends on a light source, a surface or emitter, and an observer.", "Cone sensitivities overlap rather than acting as simple red, green, and blue detectors.", "Context and viewing conditions can change a color's appearance."],
      example: "The same gray swatch can appear lighter on a dark field and darker on a light field even though its digital value does not change."
    },
    {
      id: "color-models",
      eyebrow: "02 / Production",
      title: "RGB and CMYK describe different production systems",
      body: [
        "RGB is an additive model for emitted light. Increasing red, green, and blue channel values adds light; at their maximum in a typical encoded RGB image, they produce the model's white point. Screens and many digital image formats use RGB, but exact appearance depends on device and color profile.",
        "CMYK is a subtractive process model used for printing with cyan, magenta, yellow, and black inks. Ink and paper combinations reproduce a more limited and different gamut than a luminous display, so important print colors should be converted with the intended profile and checked with a proof."
      ],
      keyPoints: ["RGB combines light for screen-oriented work.", "CMYK combines process inks for print reproduction.", "Gamut and profiles affect conversion; a screen preview is not a press proof."],
      example: "A vivid RGB violet in a social graphic may need adjustment for a process-printed brochure because the press cannot reproduce every screen color."
    },
    {
      id: "color-wheel",
      eyebrow: "03 / Relationships",
      title: "A color wheel maps hue relationships",
      body: [
        "A color wheel arranges hues in a circle so designers can compare intervals and build repeatable palette structures. Traditional red-yellow-blue teaching wheels, print-oriented cyan-magenta-yellow relationships, and digital hue wheels are related models, not interchangeable physical laws.",
        "Primary, secondary, and intermediate categories depend on the selected model. The wheel is most useful as a planning interface: it helps describe relationships, but the final palette still requires adjustment for medium, hierarchy, contrast, and audience."
      ],
      keyPoints: ["State which color model a wheel represents.", "Use wheel positions to describe hue intervals.", "Evaluate real swatches in the intended medium."],
      example: "A painter's RYB wheel and a screen-based HSL wheel can suggest similar complementary pairings while locating some named hues differently."
    },
    {
      id: "hsl-properties",
      eyebrow: "04 / Controls",
      title: "Hue, saturation, and lightness provide editable coordinates",
      body: [
        "In HSL, hue selects an angle around a digital color cylinder, saturation controls the distance from the neutral axis, and lightness moves between black, a middle color, and white. The model is intuitive for generating variations in interface code and design tools.",
        "A tint moves a hue toward white, a shade toward black, and a tone traditionally mixes it with gray. These adjustments change hierarchy and atmosphere, but HSL values do not predict visual contrast reliably; inspect the result and calculate contrast when text or essential graphics are involved."
      ],
      keyPoints: ["Hue identifies the color family.", "Saturation controls chromatic intensity within the model.", "Lightness is useful for editing but is not perceptually uniform."],
      example: "Two buttons can both use HSL lightness 50% yet differ substantially in perceived brightness because yellow and blue channels contribute differently to vision and luminance."
    },
    {
      id: "harmonies",
      eyebrow: "05 / Palettes",
      title: "Harmony schemes are starting structures, not guarantees",
      body: [
        "A monochromatic scheme varies one hue; analogous schemes use neighboring hues; complementary schemes use opposing hues; split-complementary schemes pair a base hue with neighbors of its opposite; triadic schemes sample three broadly even intervals. These names give teams a shared way to generate alternatives.",
        "No geometric scheme is inherently beautiful, calm, or accessible. Proportion, value structure, saturation, surrounding neutrals, content, and cultural context determine how a palette performs. Assign roles such as background, text, accent, warning, and success before refining individual swatches."
      ],
      keyPoints: ["Use harmony labels to generate and explain options.", "Control proportion and value as well as hue.", "Assign semantic roles before polishing swatches."],
      example: "A complementary blue-orange palette can reserve orange for a small action accent while dark blue and neutral tones carry most of the interface."
    },
    {
      id: "context-and-association",
      eyebrow: "06 / Meaning",
      title: "Color associations are learned and contextual",
      body: [
        "Designers often observe recurring associations: red may signal heat, urgency, celebration, or danger; green may relate to vegetation, permission, finance, or a political identity. These are possible readings, not meanings contained inside the wavelengths themselves.",
        "Brand color decisions should therefore begin with category conventions, competitor patterns, audience research, cultural context, and the complete identity system. Typography, imagery, language, material, and repeated use teach audiences how to interpret a brand palette."
      ],
      keyPoints: ["Treat associations as hypotheses to test.", "Research the intended audience and region.", "Meaning emerges from color together with content and repeated use."],
      example: "A green symbol may mean 'proceed' in one interface, identify an environmental program in another, and represent a national or religious tradition elsewhere."
    },
    {
      id: "accessible-color",
      eyebrow: "07 / Inclusion",
      title: "Essential meaning must survive without hue",
      body: [
        "Protan, deutan, and tritan color-vision differences can reduce or shift particular hue distinctions. A simulator can reveal possible collisions, but its rendering is approximate and should not be treated as an exact account of any person's vision.",
        "Support color with text, icons, shapes, patterns, position, or line style. Check foreground-background contrast with the final color values and test states such as default, hover, focus, selected, disabled, success, and error rather than evaluating isolated palette chips."
      ],
      keyPoints: ["Never make color the only carrier of essential information.", "Treat CVD simulation as approximate.", "Check contrast and state differentiation in context."],
      example: "A form pairs a red border with an error icon and the message 'Email address is required,' so the error remains identifiable without distinguishing red."
    },
    {
      id: "palette-workflow",
      eyebrow: "08 / Practice",
      title: "A palette is a tested system of roles",
      body: [
        "Start with the communication goal and production medium, then collect contextual references and choose a compact set of functional roles. Explore hue relationships, build lighter and darker steps, and document exact values for screen and print where needed.",
        "Apply colors to realistic content before deciding. Test legibility, grayscale value structure, color-vision differences, output gamut, and edge cases such as charts and alerts. Record usage rules so collaborators can reproduce the system rather than improvising new meanings."
      ],
      keyPoints: ["Design roles, not disconnected swatches.", "Test with realistic copy and components.", "Document values, combinations, and prohibited uses."],
      example: "A brand guide specifies one primary action color, approved text-background pairs, chart patterns, and separate print conversions instead of listing six unlabeled hex values."
    }
  ],
  activity: {
    type: "color-lab",
    title: "Build and stress-test a role-based palette",
    instructions: "Choose a base hue and create a five-color palette with named roles for background, surface, text, primary action, and status. Compare at least two harmony structures, adjust saturation and lightness, then test the palette in grayscale and with the lab's approximate color-vision views. Add a non-color cue to every status and explain how audience, medium, and context shaped your final choices.",
    legacyPath: "color-theory/color-theory.html"
  },
  review: [
    { question: "How do RGB and CMYK differ?", answer: "RGB adds emitted red, green, and blue light for screen-oriented color, while CMYK uses subtractive inks to reproduce color in print." },
    { question: "Why is HSL useful, and what can it not tell you?", answer: "HSL provides intuitive editing coordinates, but its lightness values do not directly predict perceived brightness or WCAG contrast." },
    { question: "What is the value of a color harmony scheme?", answer: "It supplies a repeatable starting structure for selecting hue relationships, which must then be refined for role, value, medium, and context." },
    { question: "Why should color psychology claims be treated cautiously?", answer: "Associations depend on culture, experience, category, wording, adjacent colors, and context rather than being universal properties of hues." },
    { question: "How should essential status information use color?", answer: "Color may reinforce the status, but text, icons, shapes, patterns, or another cue must also communicate it." },
    { question: "What does a color-vision simulator establish?", answer: "It gives an approximate view of possible hue collisions; it does not reproduce every person's perception or replace contrast checks and user testing." }
  ],
  quiz: [
    { question: "Which model combines emitted red, green, and blue light?", options: ["CMYK", "RGB", "RYB", "Spot color"], answer: 1, explanation: "RGB is an additive model used to encode color for screens and other light-emitting systems." },
    { question: "Which model is commonly used for four-color process printing?", options: ["RGB", "HSL", "CMYK", "LAB only"], answer: 2, explanation: "Process printing commonly separates artwork into cyan, magenta, yellow, and black inks." },
    { question: "Why can an intense screen color change when printed in CMYK?", options: ["Paper emits more light", "Every RGB value has an identical CMYK ink", "Screen and print gamuts and production conditions differ", "CMYK cannot print any hue"], answer: 2, explanation: "Displays and process inks reproduce different ranges of color, and paper, ink, profile, and press conditions affect output." },
    { question: "In HSL, what does hue represent?", options: ["The file's resolution", "An angle identifying a color family", "A WCAG contrast score", "The quantity of black ink"], answer: 1, explanation: "Hue is represented as a position around the HSL color circle." },
    { question: "What does reducing HSL saturation toward 0% do?", options: ["Moves the color toward a neutral gray appearance", "Turns every color white", "Increases print resolution", "Guarantees higher contrast"], answer: 0, explanation: "Within HSL, saturation controls chromatic intensity; at 0% the hue component is visually neutralized." },
    { question: "Which statement about HSL lightness is correct?", options: ["It equals WCAG relative luminance", "Equal values always look equally bright", "It is useful for editing but not perceptually uniform", "It applies only to printed ink"], answer: 2, explanation: "HSL lightness is an editing coordinate, not a direct measure of perceived brightness or WCAG relative luminance." },
    { question: "Which harmony uses hues opposite one another on a chosen color wheel?", options: ["Analogous", "Complementary", "Monochromatic", "Triadic"], answer: 1, explanation: "Complementary hues occupy opposing positions on the selected wheel." },
    { question: "Which scheme varies one base hue through lighter, darker, or less saturated versions?", options: ["Monochromatic", "Triadic", "Complementary", "Tetradic"], answer: 0, explanation: "A monochromatic palette develops variations from one hue family." },
    { question: "What is the best way to use a harmony formula?", options: ["As proof the palette is accessible", "As a starting structure to refine and test", "As a universal measure of beauty", "As a replacement for role labels"], answer: 1, explanation: "Harmony structures generate related hues, but value, proportion, purpose, and accessibility still require design judgment and testing." },
    { question: "Which statement about color associations is most accurate?", options: ["Every hue has one fixed emotional meaning", "Associations vary with audience, culture, content, and context", "Brand color works independently of words and images", "Only warm colors carry meaning"], answer: 1, explanation: "Color readings are contextual and learned; they should be researched rather than treated as universal facts." },
    { question: "A form shows errors only by changing fields from green to red. What is missing?", options: ["A second red", "A non-color cue such as a message and icon", "A monochromatic palette", "A CMYK profile"], answer: 1, explanation: "Essential information must not depend on distinguishing colors; an explicit message and icon make the status perceivable in another way." },
    { question: "How should a color-vision-deficiency simulation be interpreted?", options: ["As an exact view shared by all affected users", "As proof that contrast passes", "As an approximate aid for finding possible color collisions", "As a substitute for labels"], answer: 2, explanation: "Simulation is approximate and complements, rather than replaces, non-color cues, contrast measurement, and user evaluation." },
    { question: "What is a tint in traditional color vocabulary?", options: ["A hue mixed toward white", "A hue mixed toward black", "Two opposite hues", "A print registration error"], answer: 0, explanation: "Adding white to a hue creates a tint; digital tools can create a comparable move toward white." },
    { question: "What should be defined before polishing individual palette swatches?", options: ["The emotional meaning of every hue worldwide", "Functional roles such as text, surface, action, and status", "One identical value for screen and every printer", "Fifteen unrelated accent colors"], answer: 1, explanation: "Role definitions connect color choices to content and make the system consistent and testable." },
    { question: "Which test best evaluates whether a palette works in a real interface?", options: ["Viewing isolated chips only", "Checking one color wheel angle", "Applying it to realistic text, controls, states, and output conditions", "Counting how many hues it contains"], answer: 2, explanation: "Color performance depends on combinations, scale, content, interaction states, and medium, so realistic application reveals problems that chips cannot." }
  ],
  summary: {
    takeaways: [
      "Color perception emerges from light, surfaces or emitters, visual context, and the observer.",
      "RGB serves additive screen color, while CMYK describes subtractive process printing with different gamut constraints.",
      "Color wheels and harmony schemes organize hue relationships but do not guarantee beauty, meaning, or accessibility.",
      "Color associations must be researched in cultural, audience, category, and content context.",
      "Accessible palettes combine measured contrast with explicit non-color cues and realistic testing."
    ],
    nextSteps: "Continue to Grids and use alignment, spacing, and repeated structure to coordinate color, type, images, and interface components."
  }
};
