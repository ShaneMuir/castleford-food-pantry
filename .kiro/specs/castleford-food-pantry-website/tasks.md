# Implementation Plan: Castleford Community Food Pantry Website

## Overview

This plan builds the Castleford Community Food Pantry WordPress FSE block theme incrementally, test-first where properties apply. It starts with the environment and version-control foundation, then the theme scaffold and `theme.json` design-token source of truth, then self-hosted fonts and the asset pipeline (WebP conversion, hero poster, SVG optimization). It then builds the reusable GLOW branding fragment, template parts (header/footer), the seven block patterns, and the templates that compose them. The `inc/` layer adds the font/preload/lazy pipeline and SEO/JSON-LD output, followed by robots/sitemap. Testing is woven throughout: pure analyzer helpers (clamp math, token resolution, validators, DOM analyzers) are extracted so the 34 correctness properties can be verified with `fast-check` (min 100 iterations each), complemented by example/snapshot, integration (Core Web Vitals lab), axe-core accessibility, and smoke (env/git/db) tests. Each property test is tagged `// Feature: castleford-food-pantry-website, Property N: ...`.

Implementation languages: the theme ships as PHP/HTML/CSS/JSON (no build step required to run). The test and tooling layer uses TypeScript/JavaScript with `fast-check` + Vitest under jsdom, and Playwright for layout/contrast properties that need a real layout engine. SVG/image/video optimization scripts live in `tools/` with a root `package.json`.

## Tasks

- [ ] 1. Set up environment, version control, and project tooling
  - [-] 1.1 Initialize repository and ignore rules
    - Initialize Git at the repo root; configure remote `git@github.com:ShaneMuir/castleford-food-pantry.git` and the `main` branch
    - Create `.gitignore` excluding WordPress core files, `wp-content/uploads/`, and local environment secrets (e.g. `wp-config.php`, `.env`), while keeping `wp-content/themes/castleford-food-pantry/` tracked
    - Create `README.md` documenting local URL `https://castleford-food-pantry.test/`, MySQL db `castleford-food-pantry` on `localhost:3306`, and setup steps
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [-] 1.2 Set up test and tooling layer
    - Create root `package.json` with devDependencies: `fast-check`, `vitest`, `jsdom`, `@playwright/test`, `axe-core`/`@axe-core/playwright`, image/SVG tooling (`sharp`, `svgo`)
    - Configure Vitest (jsdom environment) and a Playwright config pointing at the local site URL
    - Create `tools/` directory and npm scripts for `test`, `test:pbt`, `lint`, and asset conversion
    - _Requirements: 17.1_

  - [ ]* 1.3 Write smoke tests for environment and version control
    - Assert theme is recognized as a block theme (required files present) — Req 1.1
    - Assert `theme.json` schema version equals 3 — Req 1.2
    - Assert site served at `https://castleford-food-pantry.test/`, MySQL reachable at the named db/host/port, Git remote + `main` branch configured, and `.gitignore` exclusions present
    - _Requirements: 1.1, 1.2, 17.1, 17.2, 17.3, 17.4_

- [ ] 2. Scaffold the block theme
  - [ ] 2.1 Create theme header, directory structure, and functions bootstrap
    - Create `wp-content/themes/castleford-food-pantry/style.css` with the theme header (name, version, text domain)
    - Create the directory structure: `templates/`, `parts/`, `patterns/`, `assets/{fonts,images,video,css}/`, `inc/`
    - Create `functions.php` that requires `inc/assets.php` and `inc/seo.php` and sets up theme supports (title-tag, responsive-embeds, html5)
    - Add a `screenshot.png` placeholder
    - _Requirements: 1.1, 1.4_

  - [ ]* 2.2 Write example tests for theme recognition
    - Assert `style.css` header, `theme.json`, and `templates/` with at least one template exist
    - _Requirements: 1.1_

- [ ] 3. Build the theme.json design-token source of truth
  - [ ] 3.1 Author theme.json v3 tokens
    - Create `theme.json` with `version: 3`
    - Define the Brand_Palette color tokens plus the four GLOW letter colors (glow-g `#3B8FE0`, glow-l `#EE3B24`, glow-o `#FFD60A`, glow-w `#B026D0`), each with a unique slug and valid hex
    - Define `settings.layout` with `contentSize` `720px` and `wideSize` `1200px` (wide ≥ content)
    - Define a fluid typography scale (`fluid: true`, sizes sm/base/lg/xl/display each with min/max) and a spacing scale of at least 5 named tokens
    - Register `templateParts` for header and footer
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.6_

  - [ ] 3.2 Extract pure config/token helper functions for testability
    - Create a `tools/analyzers/` module (TypeScript) exporting pure functions: `validateThemeConfig(json)`, `resolveToken(name, config)` with fallback, `clampFluidSize(size, viewport)`, and palette/spacing/layout validators
    - These load and parse `theme.json` so properties can run in-memory
    - _Requirements: 1.3, 2.2, 2.5, 2.7_

  - [ ]* 3.3 Write property test for invalid theme configuration rejection
    - **Property 1: Invalid theme configuration is rejected with an identified fault**
    - **Validates: Requirements 1.3**
    - Generate malformed JSON, missing `version`, wrong `version`, and missing required settings keys; assert rejection names the invalid field (min 100 iterations)

  - [ ]* 3.4 Write property test for color token validity and uniqueness
    - **Property 4: Color tokens are uniquely named and valid**
    - **Validates: Requirements 2.1**

  - [ ]* 3.5 Write property test for fluid typography clamp and monotonicity
    - **Property 5: Fluid typography is clamped and monotonic**
    - **Validates: Requirements 2.2, 13.2**
    - Generate font sizes × viewport widths including boundaries (359/360/782/783, fluid min/max viewports)

  - [ ]* 3.6 Write property test for spacing tokens
    - **Property 6: Spacing tokens are sufficient, uniquely named, and non-negative**
    - **Validates: Requirements 2.3**

  - [ ]* 3.7 Write property test for layout widths
    - **Property 7: Wide width is at least content width**
    - **Validates: Requirements 2.4**

  - [ ]* 3.8 Write property test for token change propagation
    - **Property 8: Token changes propagate to all referencing blocks**
    - **Validates: Requirements 2.5**

  - [ ]* 3.9 Write property test for token fallback resolution
    - **Property 10: Undefined or invalid token references resolve to a defined fallback**
    - **Validates: Requirements 2.7**

- [ ] 4. Prepare and optimize assets (fonts, images, poster, video, logos)
  - [ ] 4.1 Self-host brand fonts and register @font-face
    - Place brand + metric-matched fallback `woff2` files in `assets/fonts/`
    - Register font families in `theme.json` `fontFamilies` with `src` paths inside the theme and `fontDisplay: swap`
    - _Requirements: 1.8, 14.6_

  - [ ] 4.2 Build the image conversion pipeline
    - Write `tools/` script to convert `website-images/*.jpeg` to WebP into `assets/images/` with recorded intrinsic width/height
    - Capture `srcset`/`sizes` variants for responsive content images
    - _Requirements: 13.4, 14.3_

  - [ ] 4.3 Derive the hero poster and place the video
    - Extract a representative frame from `website-videos/castleford-food-pantry-video.mp4` as `assets/images/poster.webp`
    - Copy the mp4 into `assets/video/` (optional `.webm` alternate)
    - _Requirements: 4.1, 14.5_

  - [ ] 4.4 Optimize and place the SVG logos
    - Run SVGO on `v2-1-castle-sun-glow.svg` (header lockup), `v2-2-badge-glow.svg` (primary badge / favicon / social image), and `v2-3-battlement-glow.svg` (alternate footer banner); place into `assets/images/`
    - _Requirements: 2.6, 3.1, 10.3_

  - [ ]* 4.5 Write property test for no external font requests
    - **Property 3: No external font requests**
    - **Validates: Requirements 1.8**
    - Assert every declared font `src` resolves inside the theme and rendered templates issue zero external font-CDN requests

  - [ ]* 4.6 Write property test for next-generation image format
    - **Property 31: Content images use a next-generation format**
    - **Validates: Requirements 14.3**

- [ ] 5. Build the GLOW_Branding reusable fragment
  - [ ] 5.1 Implement the GLOW wordmark fragment
    - Create the reusable markup (four letter `<span>`s mapped to glow-g/l/o/w tokens, `run by` attribution, `aria-label="run by GLOW"`) and supporting CSS in `assets/css/`
    - Make it includable from both the hero pattern and the footer part
    - _Requirements: 2.6, 10.1, 10.2_

  - [ ]* 5.2 Write property test for GLOW wordmark letter colors
    - **Property 9: GLOW wordmark colors each letter correctly**
    - **Validates: Requirements 2.6**
    - Assert G/L/O/W carry `#3B8FE0`/`#EE3B24`/`#FFD60A`/`#B026D0` bijectively across repeated renders

- [ ] 6. Build template parts (header and footer)
  - [ ] 6.1 Implement Site_Header part
    - Create `parts/header.html`: skip link (first focusable, targets `#main`), logo block (horizontal lockup `v2-1`) linked to home with alt "Castleford Community Food Pantry, run by GLOW", core Navigation block with an entry per section, persistent support CTA to `#donate`, responsive overlay at ≤782px
    - Ensure navigation entries use the core navigation link block so `url` can be an anchor or page URL with no structural change
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 10.3, 12.7, 16.3_

  - [ ] 6.2 Implement Site_Footer part
    - Create `parts/footer.html`: GLOW_Branding fragment, contact summary (email, Laura/Kim/Tracy, venue addresses), social links, secondary navigation mirroring section anchors, attribution/copyright
    - _Requirements: 10.1, 10.2, 11.1_

  - [ ] 6.3 Extract DOM analyzer helpers for navigation and structure
    - In `tools/analyzers/`, add pure functions that parse part/template block markup to extract navigation entries, header/footer references, heading sequence, image role/alt, and link hrefs
    - _Requirements: 1.4, 3.2, 3.6_

  - [ ]* 6.4 Write property test for navigation entry per section
    - **Property 11: Navigation has an entry for every section**
    - **Validates: Requirements 3.2**

  - [ ]* 6.5 Write property test for navigation structure invariance
    - **Property 12: Navigation entry structure is invariant across target types**
    - **Validates: Requirements 3.6, 16.3**
    - Generate anchor vs page-URL targets; assert serialized header node types/positions are identical, only `url` differs

- [ ] 7. Implement the Hero_Section pattern
  - [ ] 7.1 Build hero.php pattern markup
    - Create `patterns/hero.php` (slug `cfp/hero`, anchor `#home`): cover/group with poster image (eager, `fetchpriority="high"`), layered `<video muted playsinline autoplay loop preload="metadata">` with no controls, contrast overlay layer, logo, H1 headline (1–120 chars), GLOW_Branding, primary CTA (Get help) and secondary CTA (Support), each 1–40 chars
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.8, 10.1_

  - [ ] 7.2 Add hero progressive-enhancement script and reduced-motion CSS
    - Enqueue a small script (via `inc/assets.php`) that starts muted playback only when motion is allowed, and removes the video layer on a 5s timeout or `error`/`stalled`, leaving the poster and all other hero elements in place
    - Add `prefers-reduced-motion: reduce` CSS to suppress playback/animation and keep the poster visible
    - _Requirements: 4.6, 4.7, 12.8, 14.5_

  - [ ] 7.3 Implement hero content validators
    - In `tools/analyzers/`, add pure `validateHeadline(s)` (1–120) and `validateCtaLabel(s)` (1–40) functions used by hero validation
    - _Requirements: 4.2, 4.4_

  - [ ]* 7.4 Write property test for hero headline length validation
    - **Property 13: Hero headline length is validated**
    - **Validates: Requirements 4.2**

  - [ ]* 7.5 Write property test for hero CTA count and label length
    - **Property 14: Hero has exactly one of each CTA with valid label length**
    - **Validates: Requirements 4.4**

  - [ ]* 7.6 Write property test for muted video with no controls
    - **Property 15: Hero video is muted and exposes no controls**
    - **Validates: Requirements 4.5**

  - [ ]* 7.7 Write property test for reduced-motion suppression
    - **Property 16: Reduced motion suppresses autoplay and animation**
    - **Validates: Requirements 4.6, 12.8**

  - [ ]* 7.8 Write property test for hero graceful degradation to poster
    - **Property 17: Hero degrades gracefully to the poster**
    - **Validates: Requirements 4.7, 14.5**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement the About_Section pattern
  - [ ] 9.1 Build about.php pattern markup
    - Create `patterns/about.php` (slug `cfp/about`, anchor `#about`): columns with surplus-food mission text, the tagline "Together we can reduce waste, feed people, build community", badge "Saving surplus food from landfill", statement that the pantry operates from GLOW-provided centers and GLOW does not run it, and at least one supporting WebP image with non-empty alt; constrain content to content width on viewports > 782px
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 9.2 Write example test for About content statements
    - Assert mission, tagline, badge, and GLOW-relationship statement are present
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 10. Implement the Get_Help_Section pattern
  - [ ] 10.1 Build get-help.php pattern markup
    - Create `patterns/get-help.php` (slug `cfp/get-help`, anchor `#get-help`): steps to receive food support; the four sessions with day/time/venue/address (Sun 2:00–3:00 PM Airedale Gospel Hall WF10 3LQ; Sun 4:30–5:30 PM Cutsyke WF10 5HA; Fri 9:30–10:30 AM Breakfast £1 Cutsyke; Fri 11:00 AM–12:00 PM Food Pantry £1 Cutsyke); explicit access terms (£1, no referral needed, bring a bag); CTA link to `#contact`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 10.2 Write example test for sessions and access terms
    - Assert all four sessions and the £1/no-referral/bring-a-bag terms are present
    - _Requirements: 6.2, 6.3_

- [ ] 11. Implement the Donate_Section (Support / Get Involved) pattern
  - [ ] 11.1 Build donate.php pattern markup
    - Create `patterns/donate.php` (slug `cfp/donate`, anchor `#donate`, visitor-facing heading "Support / Get Involved"): support methods (surplus-food partnerships, volunteering, spreading the word), surplus-food partner guidance for businesses/retailers, and exactly one primary get-in-touch CTA to `#contact`
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 11.2 Write property test for support section get-in-touch CTA
    - **Property 25: Support section renders a get-in-touch call-to-action**
    - **Validates: Requirements 7.3**

- [ ] 12. Implement the Volunteer_Section pattern
  - [ ] 12.1 Build volunteer.php pattern markup
    - Create `patterns/volunteer.php` (slug `cfp/volunteer`, anchor `#volunteer`): volunteer roles description and how to apply, plus a CTA routing to `#contact` or an external volunteer enquiry destination
    - _Requirements: 8.1, 8.2_

- [ ] 13. Implement the Sponsors_Section pattern
  - [ ] 13.1 Build sponsors.php pattern markup
    - Create `patterns/sponsors.php` (slug `cfp/sponsors`, anchor `#sponsors`): sponsor/brand image grid using the converted brand WebP assets, each with a non-empty alt that identifies the sponsor, plus invite copy for new sponsors
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 13.2 Write property test for image alternative text matching role
    - **Property 20: Image alternative text matches image role**
    - **Validates: Requirements 12.3, 9.3**
    - Include that every sponsor image has a non-empty, sponsor-identifying alt

- [ ] 14. Implement the Contact_Section pattern
  - [ ] 14.1 Build contact.php pattern markup
    - Create `patterns/contact.php` (slug `cfp/contact`, anchor `#contact`): email as `mailto:castlefordcommunityfoodpantry@gmail.com`; named phone contacts Laura 07912 861156, Kim 07401 001200, Tracy 07707 572989 as `tel:` links; both venue addresses; an embedded map (iframe) with static address fallback; social links
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 14.2 Write property test for contact link URL schemes
    - **Property 26: Contact links use the correct URL scheme**
    - **Validates: Requirements 11.4, 11.5**
    - Assert email href is `mailto:` + email and each named contact's href is `tel:` + normalized number (all three contacts)

- [ ] 15. Build templates and wire the front page
  - [ ] 15.1 Implement front-page.html Home_Template
    - Create `templates/front-page.html`: header part → `<main id="main">` composing the seven patterns in order (Hero, About, Get Help, Donate, Volunteer, Sponsors, Contact) → footer part; set exactly one top-level heading on the page
    - _Requirements: 1.6, 1.7, 15.5_

  - [ ] 15.2 Implement index, page, 404, and search templates
    - Create `templates/index.html` (fallback), `templates/page.html` (reusable standalone page with post content), `templates/404.html` (not-found + search + home link), `templates/search.html` (results loop + no-results); each references the same header and footer parts
    - _Requirements: 1.4, 16.1, 16.2, 16.4_

  - [ ]* 15.3 Write property test for header/footer references per template
    - **Property 2: Every template references exactly one header and one footer part**
    - **Validates: Requirements 1.4, 16.2**

  - [ ]* 15.4 Write property test for heading structure
    - **Property 21: Heading structure is well-formed with a single top-level heading**
    - **Validates: Requirements 12.4, 15.5**

  - [ ]* 15.5 Write snapshot/example tests for template composition
    - Snapshot `front-page.html` pattern order and the two parts; assert registered pattern slugs, header logo/CTA, skip link, and `lang` attribute presence
    - _Requirements: 1.5, 1.6, 3.1, 3.5, 12.7, 12.9_

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Implement the inc/ asset and SEO pipeline
  - [ ] 17.1 Implement inc/assets.php
    - Register `@font-face` with `font-display: swap`, preload the hero poster and primary brand `woff2`, set default `loading="lazy"` and `decoding="async"` for content images, and enqueue the hero script and supplemental CSS
    - _Requirements: 14.4, 14.6, 4.6, 4.7_

  - [ ] 17.2 Implement inc/seo.php
    - Output `<title>`, meta description, Open Graph + Twitter Card tags (with sharing image = badge), and a `LocalBusiness`/`CommunityService` JSON-LD block (name, location, contact) on `wp_head`; guard against duplicate output when a known SEO plugin is active
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 17.3 Add robots.txt and XML sitemap exposure
    - Create root `robots.txt` permitting indexing and referencing the sitemap; ensure the WordPress XML sitemap is exposed
    - _Requirements: 15.4_

  - [ ]* 17.4 Write property test for brand font-display swap
    - **Property 33: Brand font faces swap without an invisible-text period**
    - **Validates: Requirements 14.6**

  - [ ]* 17.5 Write property test for below-fold image deferral
    - **Property 32: Below-fold images are deferred**
    - **Validates: Requirements 14.4**

  - [ ]* 17.6 Write property test for structured data validity
    - **Property 34: Structured data is valid and complete**
    - **Validates: Requirements 15.3**

  - [ ]* 17.7 Write example tests for SEO metadata and discovery
    - Assert title, meta description, OG/Twitter tags, robots.txt indexing, and sitemap presence
    - _Requirements: 15.1, 15.2, 15.4_

- [ ] 18. Verify accessibility, contrast, and responsive behavior
  - [ ] 18.1 Add focus-visible styles and keyboard order safeguards
    - Add `assets/css/` focus styles (≥3:1 focus indicator), ensure logical DOM/tab order and no focus traps, confirm the skip link moves focus to `#main`, and set the `lang` attribute on the root element
    - _Requirements: 12.5, 12.6, 12.7, 12.9_

  - [ ]* 18.2 Write property test for text contrast threshold
    - **Property 18: Text contrast meets the size-based threshold**
    - **Validates: Requirements 4.8, 12.1**

  - [ ]* 18.3 Write property test for UI/graphics 3:1 contrast
    - **Property 19: UI components and meaningful graphics meet 3:1 contrast**
    - **Validates: Requirements 12.2**

  - [ ]* 18.4 Write property test for keyboard traversal without trapping
    - **Property 22: Keyboard traversal reaches all interactive elements without trapping**
    - **Validates: Requirements 12.5**

  - [ ]* 18.5 Write property test for focus indicator contrast
    - **Property 23: Focused elements show a sufficient-contrast focus indicator**
    - **Validates: Requirements 12.6**

  - [ ]* 18.6 Write property test for form input labels
    - **Property 24: Every form input has an associated programmatic label**
    - **Validates: Requirements 12.10**

  - [ ]* 18.7 Write property test for About content width on wide viewports
    - **Property 27: About content stays within the content width on wide viewports**
    - **Validates: Requirements 5.4**

  - [ ]* 18.8 Write property test for no horizontal scrolling at ≥360px
    - **Property 28: No horizontal scrolling at or above the layout floor**
    - **Validates: Requirements 13.1**

  - [ ]* 18.9 Write property test for multi-column stacking at ≤782px
    - **Property 29: Multi-column sections stack on narrow viewports**
    - **Validates: Requirements 13.3**

  - [ ]* 18.10 Write property test for images fitting their container
    - **Property 30: Images fit their container at every viewport**
    - **Validates: Requirements 13.4**

  - [ ]* 18.11 Run axe-core accessibility scans
    - Add Playwright + axe-core scans across the front page and the page/404/search templates
    - _Requirements: 12.1, 12.3, 12.4, 12.5, 12.6, 12.10_

- [ ] 19. Integration and Core Web Vitals verification
  - [ ]* 19.1 Write integration tests for runtime wiring
    - Assert front-page routing (root resolves Home_Template), anchor-link scrolling, and the responsive nav overlay at ≤782px
    - _Requirements: 1.7, 3.3, 3.4_

  - [ ]* 19.2 Write Core Web Vitals lab test
    - Run a Lighthouse/lab measurement on the defined connection profile asserting LCP < 2.5s and CLS ≤ 0.1
    - _Requirements: 14.1, 14.2_

- [ ] 20. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional (tests) and can be skipped for a faster MVP, but the 34 property tests, example/snapshot, integration (CWV lab), axe-core, and smoke tests are the project's verification strategy and are recommended.
- Each property test runs a **minimum of 100 generated cases** with `fast-check` and is tagged `// Feature: castleford-food-pantry-website, Property N: <property text>`.
- Pure analyzer helpers (clamp math, token resolution, validators, DOM analyzers) are extracted into `tools/analyzers/` so properties run in-memory under jsdom; layout/contrast properties use Playwright for a real layout engine.
- Each task references specific requirements and, where applicable, a numbered correctness property from the design for traceability.
- The theme runs with no build step; `tools/` scripts (WebP conversion, poster extraction, SVGO) are developer conveniences only.
- All 34 correctness properties are covered: Properties 1,4,5,6,7,8,10 (tokens), 3,31 (assets), 9 (GLOW), 11,12 (nav), 13,14,15,16,17 (hero), 25 (support), 20 (images/alt), 26 (contact), 2,21 (templates), 32,33,34 (assets/SEO), 18,19,22,23,24,27,28,29,30 (a11y/responsive).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "4.5", "4.6", "5.1"] },
    { "id": 5, "tasks": ["5.2", "6.1", "6.2", "6.3"] },
    { "id": 6, "tasks": ["6.4", "6.5", "7.1", "9.1", "10.1", "11.1", "12.1", "13.1", "14.1"] },
    { "id": 7, "tasks": ["7.2", "7.3", "9.2", "10.2", "11.2", "13.2", "14.2"] },
    { "id": 8, "tasks": ["7.4", "7.5", "7.6", "7.7", "7.8"] },
    { "id": 9, "tasks": ["15.1", "15.2"] },
    { "id": 10, "tasks": ["15.3", "15.4", "15.5", "17.1", "17.2", "17.3"] },
    { "id": 11, "tasks": ["17.4", "17.5", "17.6", "17.7", "18.1"] },
    { "id": 12, "tasks": ["18.2", "18.3", "18.4", "18.5", "18.6", "18.7", "18.8", "18.9", "18.10", "18.11"] },
    { "id": 13, "tasks": ["19.1", "19.2"] }
  ]
}
```
