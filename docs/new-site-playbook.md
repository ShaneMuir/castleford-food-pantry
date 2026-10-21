# New site playbook

How to build another site the way Castleford Community Food Pantry was built: a single-page, fully CMS-editable WordPress block theme, spec-first, with a pure-function test layer. Use this when starting a sibling project (for example `adelles-painting-and-decorating-services`).

## 1. What carries over unchanged

| Piece | Where | Notes |
| --- | --- | --- |
| Block theme skeleton | `style.css`, `theme.json` (structure), `functions.php`, `templates/`, `parts/` | Rename and re-token; structure stays |
| `inc/` modules | `helpers`, `assets`, `seo`, `blocks`, `media`, `setup`, `admin`, `login` | Rename the `cfp_` prefix; replace content constants |
| Dark scheme | `assets/css/dark.css`, enqueue in `inc/assets.php` | Re-derive surface colours from the new palette |
| Hero progressive enhancement | `assets/js/hero.js` | Reuse if the new site has a hero video; otherwise drop the video helper and poster preload |
| Setup routine and WP-CLI command | `inc/setup.php` | Rename `wp cfp setup`; change the section list, menu items and `CFP_SETUP_VERSION` |
| Tooling | `package.json`, `vitest.config.ts`, `playwright.config.ts`, `tsconfig.json`, `tools/` | Change the local URL in Playwright config, `tools/axe-scan.mjs` and the screenshot scripts |
| Analyzers and token property tests | `tools/analyzers/`, `tests/property/theme-tokens.property.test.ts` | Reusable as-is |
| Docs structure | `CLAUDE.md`, `docs/steering/*`, `docs/specs/*` | Rewrite `product.md`; keep `conventions.md` and `testing.md` with the prefix changed |
| Image/asset scripts | `tools/convert-images.mjs`, `extract-poster.mjs`, `optimize-svg.mjs` | Point at the new theme path |

## 2. What is Castleford-specific and must be replaced

- Brand: palette, GLOW wordmark colours and `glow-*` tokens, fonts, logos, favicon, OG image, `manifest.json`.
- Copy and structure: the seven sections (hero, about, get help, support, volunteer, sponsors, contact), sessions, access terms, named contacts, venues, map embed, JSON-LD (`NGO`).
- `cfp_glow_block()` and the GLOW attribution (delete, or replace with a partner badge if the new brand needs one).
- Block-style names (`is-style-cfp-*`) and the card colours named after the GLOW letters.
- Starter media list in `cfp_starter_media()`.
- Requirements, design and tasks specs (rewrite for the new site; keep the requirement categories that still apply: block theme foundation, tokens, header/nav, hero, responsive, performance, accessibility, SEO, extensibility, environment, CMS editability, dark scheme, admin clean-up, brand surfaces, media).

## 3. Order of work

1. **Brand discovery.** Gather logos, photos, any existing flyers or site, competitor/reference sites. Decide palette (with contrast pairs checked for 4.5:1 text and 3:1 UI), fonts (self-hostable), logo lockups (horizontal, badge/square, mono), tone of voice. Record decisions in `docs/steering/product.md` and `docs/brand/brand-decisions.md`.
2. **Spec first.** Write `requirements.md`, `design.md`, `tasks.md` under `docs/specs/<site>/` using the Castleford spec as the template, in final-state wording.
3. **Environment.** Create the repo, local vhost (`<site>.test`), database, WordPress install (`wp core download`, `config create`, `core install`), `.gitignore` tracking only the theme, `package.json` tooling, smoke tests.
4. **Theme scaffold.** Copy the Castleford theme folder, rename (see section 4), replace tokens in `theme.json`, self-host the new fonts, remove Castleford content.
5. **Assets.** Convert images to WebP, optimise SVGs, derive poster and OG image, generate favicon set.
6. **Patterns.** Build section patterns with the `*_block()` helpers so they round-trip through the editor. Compose the front page.
7. **Setup routine.** Starter media, menus, Site Logo, Home page, front page. Verify on a fresh database with `wp <prefix> setup`.
8. **Dark scheme, login branding, admin clean-up.**
9. **Verification.** Property tests, smoke tests, axe-core, screenshots (desktop, mobile, light, dark), Lighthouse for LCP/CLS.

## 4. Renaming checklist

Pick one short prefix (for Adelle's: `apds`). Then replace across the theme and tooling:

- Theme folder, `Text Domain`, `Theme Name`, URIs in `style.css`.
- `cfp_` and `CFP_` identifiers, `cfp/` pattern slugs, `cfp` pattern category, `is-style-cfp-*` classes, `.cfp-*` CSS classes, `--cfp-*` custom properties, `cfp_home_page` and `cfp_setup_version` options, `wp cfp` command.
- `castleford-food-pantry` in `.gitignore` (theme allow-list), `playwright.config.ts`, `tools/*`, `tests/smoke/environment.test.ts`, README.
- Search for leftovers: `grep -ri "castleford\|glow\|cfp" .` should return nothing outside docs that deliberately reference the source project.

## 5. Gotchas learned on Castleford

- Make Home page sections full width in the block editor (pattern groups need the right layout/alignment attributes) or the editor view differs from the front end.
- Save media URLs root-relative or content breaks on other hosts.
- Without a `color-scheme` meta tag, browsers force-darken the site and wreck contrast.
- `kses` strips the map iframe when setup runs from WP-CLI; remove KSES filters while saving setup content.
- Keep the mobile menu overlay and hamburger centred and styled; the core navigation block's defaults are not brand-ready.
- Skip the hero video on phones; keep the poster as the LCP element.
- Disable comments completely rather than hiding them.
- Bump the setup version constant whenever pattern defaults change and existing environments should re-run setup.
