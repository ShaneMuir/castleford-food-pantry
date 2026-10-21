# Tech

## Stack

- WordPress block theme (FSE), `theme.json` schema v3, core blocks only, PHP 8.x (theme header declares 7.4 minimum), MySQL 8.
- No build step for the theme: plain PHP, HTML, CSS, JSON, one small JS file. Everything under `tools/` is a developer convenience.
- Tooling and tests: Node 18.19+, TypeScript 5.6, Vitest 1.6 (jsdom), fast-check 3.23, Playwright 1.48 with axe-core, sharp (image conversion), svgo.
- Local environment: HTTPS vhost `castleford-food-pantry.test`, database `castleford-food-pantry` on `localhost:3306`. WP-CLI is available.
- WordPress core, uploads, plugins, other themes and `wp-config.php` are git-ignored. Only `wp-content/themes/castleford-food-pantry/` plus repo-root tooling and docs are tracked.

## Design tokens (`theme.json`)

- Palette: `brand-green #2F7D4F`, `brand-gold #F5B82E`, `brand-navy #1F3A5F`, `brand-cream #FFF8EC`, `brand-accent #E4572E`, plus `glow-g #3B8FE0`, `glow-l #EE3B24`, `glow-o #FFD60A`, `glow-w #B026D0`. Default WordPress palette and gradients are disabled.
- Fonts: Poppins (headings, 600/700/800) and Nunito Sans (body, 400/600/700), self-hosted woff2 in `assets/fonts/`, `fontDisplay: swap`. No external font requests.
- Fluid type sizes `sm, base, lg, xl, display`; spacing sizes `xs, sm, md, lg, xl` (0.5rem to 6rem); content width 720px, wide width 1200px.
- Blocks reference tokens by slug (`var(--wp--preset--color--brand-green)`); never hard-code a brand hex in a pattern or stylesheet when a token exists.

## Performance and accessibility targets

LCP under 2.5s, CLS 0.1 or less, WCAG 2.1 AA, working down to 360px, columns stack at 782px or less. Images are WebP with width/height, `srcset`, lazy loading below the fold; the hero poster is the LCP element (preloaded, high priority).

## SEO

`inc/seo.php` prints title, meta description, canonical, Open Graph, Twitter Card and `NGO` JSON-LD on the front page, and serves a virtual `robots.txt` with the core sitemap URL. It stays silent when an SEO plugin is active.
