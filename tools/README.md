# tools/

Developer-convenience scripts and the extracted pure analyzer helpers for the
Castleford Community Food Pantry block theme. **None of this is required for the
theme to run** — the theme ships as PHP/HTML/CSS/JSON with no build step.

## Contents

- `analyzers/` — pure, testable functions (theme.json validation, token
  resolution, fluid-typography clamp math, DOM/navigation analyzers, content
  validators). Later tasks populate these; the 34 correctness properties import
  from here and run in-memory under jsdom with `fast-check`.
- `convert-images.mjs` — converts `website-images/*.jpeg` to WebP in
  `wp-content/themes/castleford-food-pantry/assets/images/` (task 4.2).
- `extract-poster.mjs` — derives the hero poster frame from the source video
  (task 4.3).
- `optimize-svg.mjs` — runs SVGO over the brand SVG logos (task 4.4).

## npm scripts

| Script | Purpose |
| --- | --- |
| `npm test` | Run the Vitest suite (unit + property tests) under jsdom. |
| `npm run test:pbt` | Run only the property-based tests (filtered by `Property` name). |
| `npm run test:e2e` | Run Playwright layout/contrast/axe-core tests against the local site. |
| `npm run lint` | Type-check the TS tooling/tests. |
| `npm run assets:convert` | Convert source images to WebP. |
| `npm run assets:poster` | Extract the hero poster frame. |
| `npm run assets:svg` | Optimize the brand SVGs. |
| `npm run assets:all` | Run all asset conversion steps. |
