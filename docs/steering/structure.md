# Structure

```
CLAUDE.md, docs/                 project context: steering/, specs/, new-site-playbook.md
wp-content/themes/castleford-food-pantry/
  style.css, theme.json, functions.php
  templates/   front-page, index, page, 404, search (.html)
  parts/       header.html, footer.html (each one line, referencing the pattern)
  patterns/    hero, about, get-help, donate, volunteer, sponsors, contact, site-header, site-footer
  assets/      css/ (theme, dark, login), js/hero.js, fonts/, images/, video/
  inc/         helpers, assets, seo, blocks, media, setup, admin, login
tools/         analyzers/ (pure functions), asset scripts, screenshot/axe/mobile checks
tests/         property/ and smoke/ (Vitest)
website-images/, website-videos/   source brand assets (converted by npm run assets:*)
```

## What each `inc/` file owns

| File | Responsibility |
| --- | --- |
| `helpers.php` | `cfp_asset()`, `cfp_image_block()`, `cfp_video_block()`, `cfp_glow_block()`, `cfp_relative_url()` |
| `assets.php` | Enqueue `theme.css`, media-conditioned `dark.css`, `hero.js` (front page only); preloads; `cfp` pattern category; default Site Icon and SVG favicon; skip link; `color-scheme` meta |
| `seo.php` | Meta, Open Graph, JSON-LD, virtual robots.txt |
| `blocks.php` | Block styles (`is-style-cfp-*`) editors pick under Styles |
| `media.php` | SVG upload support with unsafe-content filter, starter media registry (`cfp_starter_media()`), `cfp_media()` lookup, import into the media library |
| `setup.php` | `cfp_run_setup()`: imports media, creates menus, sets Site Logo, builds the Home page from patterns, sets it as the front page. WP-CLI `wp cfp setup`. `CFP_SETUP_VERSION` re-runs it on next admin load |
| `admin.php` | Comments removed completely; admin bar and footer clean-up |
| `login.php` | Branded wp-login |

## Where to change things

| Change | Edit |
| --- | --- |
| Colours, fonts, sizes, spacing, widths | `theme.json` |
| Section markup or starter copy | `patterns/<section>.php`, then bump `CFP_SETUP_VERSION` and run `wp cfp setup --reset-home` on environments that should pick it up |
| Section/card/button looks | `inc/blocks.php` (register) and `assets/css/theme.css` (style), mirrored in `dark.css` |
| Logos, photos, video | Replace the file in `assets/`, update `cfp_starter_media()` in `inc/media.php` |
| Menu items | `cfp_run_setup()` in `inc/setup.php` for defaults; Site Editor for live sites |
| Contact details, JSON-LD, meta description | `patterns/contact.php`, `patterns/site-footer.php`, `inc/seo.php` |
