# Conventions

Lessons baked into this build. Follow them for any change, and carry them to sibling sites.

## Content and editing

- Everything visitors read must be editable in the WordPress editor with core blocks. The only raw HTML allowed is the map embed (core HTML block). No hard-coded copy in templates or `functions.php`.
- Patterns print block markup identical to what the editor serialises, so a pattern round-trips through the editor without "attempt block recovery" warnings. Prefer the `cfp_*_block()` helpers for images, video and the wordmark.
- Save same-site media URLs root-relative (`/wp-content/...`) via `cfp_relative_url()` so the site works on staging, tunnels and Live Links without a database search-replace.
- The setup routine must stay idempotent. It never overwrites an existing Home page, Site Logo or menu unless `--reset-home` is passed. Setup content is trusted theme markup, so KSES filters are removed while saving it.
- Keep pattern slugs and anchors stable when visitor-facing labels change.

## Styling

- Tokens first: use `theme.json` presets and `var(--wp--preset--*)`. Add a token before adding a hard-coded value.
- Editor choices are block styles (`is-style-cfp-*`), registered in `inc/blocks.php`. Every new style needs a dark-scheme counterpart in `dark.css`.
- Dark scheme is a separate stylesheet loaded with a `(prefers-color-scheme: dark)` media condition and a `color-scheme` meta tag. Hero, green section, sponsors and footer keep brand colours; the header stays light so the logo keeps contrast.
- Respect `prefers-reduced-motion`: no autoplay motion, no non-essential animation, smooth scroll off.
- Focus must be visible (3px outline, 3:1 contrast). The skip link is the first focusable element and targets `#main`.

## Performance

- Self-host fonts, `font-display: swap`, preload only the heading font and the hero poster.
- Hero video: muted, looping, `playsinline`, no controls. `hero.js` starts playback only when motion is allowed, not on phones, and removes the video layer after a 5-second timeout or error so the poster remains.
- Content images are WebP with intrinsic width/height, responsive `srcset`, lazy below the fold.

## WordPress hygiene

- Comments are disabled completely (`inc/admin.php`). Do not reintroduce comment blocks or templates.
- SVG uploads are allowed but rejected if they contain script-capable content.
- Use WordPress APIs and filters rather than editing core. Guard output that SEO plugins also emit.
- PHP: tabs, WordPress coding style, `defined( 'ABSPATH' ) || exit;` at the top of every theme PHP file, prefix everything `cfp_`.

## Copy

UK English. "Supported by GLOW", never "run by" or "hosted by". Access terms are stated plainly: £1, no referral, bring a bag. Alt text identifies sponsors by name; decorative images get empty alt.
