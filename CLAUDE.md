# Castleford Community Food Pantry

WordPress Full Site Editing (FSE) block theme for a local surplus-food community pantry. One-page site, every section editable in the WordPress editor with core blocks. This repo is both the git root and the local WordPress install root; only the theme and repo-root tooling are tracked.

Local site: https://castleford-food-pantry.test/ (vhost in `/opt/homebrew/etc/httpd/extra/httpd-vhosts.conf`). Theme: `wp-content/themes/castleford-food-pantry/`. Function/class prefix: `cfp_` / `CFP_`. Text domain: `castleford-food-pantry`.

## Steering

@docs/steering/product.md
@docs/steering/tech.md
@docs/steering/structure.md
@docs/steering/conventions.md
@docs/steering/testing.md

## Specs

`docs/specs/<feature>/` holds `requirements.md`, `design.md` and `tasks.md` per feature. Read the relevant spec before changing behaviour it describes, and update it in place when behaviour changes (final-state wording, no changelog notes).

## Starting another site from this one

See `docs/new-site-playbook.md`.

## Commands

```bash
npm test                 # Vitest unit + property tests (jsdom)
npm run test:pbt         # property tests only
npm run test:e2e         # Playwright (needs the local site running)
npm run lint             # tsc --noEmit
npm run assets:all       # WebP conversion, hero poster, SVGO
wp cfp setup             # create missing media, menus, logo, Home page
wp cfp setup --reset-home  # rebuild Home content from patterns (discards edits)
node tools/axe-scan.mjs  # axe-core scan of key templates, desktop + mobile
node tools/screenshot.mjs  # desktop/mobile screenshots into .screenshots/
```

## Working rules

- Do not commit unless asked. Never add co-author or attribution lines to commits or PRs.
- Run `wp`, `npm` and test commands from the repo root.
- Never edit WordPress core, `wp-config.php` or `.htaccess`.
