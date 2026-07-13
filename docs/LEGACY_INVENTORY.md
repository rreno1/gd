# Legacy GD lesson inventory

The original files in `gd-presentations/` are the preserved migration source. They were committed before the new portal was created and must remain unchanged until parity is verified.

| Module | Slides | Quiz questions | Distinct interactions |
| --- | ---: | ---: | --- |
| Introduction to Graphic Design | 11 | 15 | Type lab, palette generator, grid overlay, contrast checker, design sandbox, PNG export |
| Elements of Design | 11 | 15 | Line canvas, shape morpher, 3D shading, UI theming, value, texture, and space labs |
| Principles of Design | 19 | 15 | Interactive demonstrations for the 15 design principles |
| Typography | 11 | 15 | Font, anatomy, hierarchy, spacing, line-length, pairing, and legibility labs |
| Color Theory | 11 | 15 | RGB/CMYK mixer, wheel, HSL and harmony tools, psychology, CVD simulator, brand cases |
| Grids & Layout | 11 | 15 | Grid anatomy, spans, modular generator, rule of thirds, responsive and CSS layout labs |
| Contrast & Accessibility | 11 | 15 | Contrast checker, CVD simulator, beyond-color, touch-target, and alt-text tools |

Total: **85 slides** and **105 quiz questions** across **17,678 lines** of HTML, CSS, and JavaScript.

## Shared behavior to replace

All seven decks duplicate slide transitions, previous/next controls, keyboard and swipe input, progress indicators, overview modals, fullscreen behavior, and quiz scoring. The new portal centralizes these responsibilities in one lesson engine.

## Migration policy

- The private `GD_Class_Record_2026.xlsx` is ignored and is never copied into `public/`.
- `npm run build` copies the original decks to generated `public/legacy/` pages so every specialized activity remains available during migration.
- New lesson datasets provide improved explanations, terminology, misconceptions, review prompts, a native activity, and a 15-question assessment.
- ITC is a read-only design reference. Its current modified and untracked files were not changed or copied wholesale.
