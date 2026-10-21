# Testing

## Layers

| Layer | Tool | Location | Purpose |
| --- | --- | --- | --- |
| Property tests | Vitest + fast-check (jsdom), 100+ cases each | `tests/property/` | The 34 correctness properties in `docs/specs/castleford-food-pantry-website/design.md` |
| Smoke tests | Vitest | `tests/smoke/`, `tools/*.test.ts` | Block theme recognised, theme.json v3, local URL, MySQL, git remote, `.gitignore` |
| Layout, contrast, responsive | Playwright (chromium + Pixel 5) | `tests/e2e/` | Properties needing a real layout engine |
| Accessibility | axe-core via Playwright | `tools/axe-scan.mjs` | WCAG 2.1 AA scan of `/`, a 404 and a search results page at 1440px and 390px |
| Visual checks | Playwright screenshots | `tools/screenshot.mjs`, `tools/mobile-check.mjs` | Screenshots into `.screenshots/` (git-ignored); mobile menu behaviour |

## Pure analyzers

Logic worth testing lives as pure functions in `tools/analyzers/` (`config`, `color`, `fluid`, `spacing`, `layout`, `resolve`, `units`). Property tests import from there, so extract new logic into an analyzer instead of testing through the browser.

## Conventions

- Tag each property test: `// Feature: castleford-food-pantry-website, Property N: <property text>`.
- One test per property. Generators should hit boundaries (359/360/782/783px, length limits, min/max viewports).
- Playwright and the smoke tests need the local site running at `https://castleford-food-pantry.test/` (self-signed cert, `ignoreHTTPSErrors`).
- Before calling UI work done: run `npm test`, `node tools/axe-scan.mjs`, and check desktop and mobile screenshots in light and dark mode.
- Automated checks do not establish WCAG conformance. Keyboard-only and screen-reader passes are manual.
