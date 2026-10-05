import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  REQUIRED_SETTINGS_KEYS,
  REQUIRED_THEME_VERSION,
  FALLBACK_TOKENS,
  MIN_SPACING_TOKENS,
  clampFluidSize,
  isValidHexColor,
  loadThemeConfig,
  parseLengthToPx,
  resolveToken,
  validateColorPalette,
  validateLayout,
  validateSpacingSizes,
  validateThemeConfig,
  type ThemeConfig,
} from "../../tools/analyzers/index.js";

const RUNS = { numRuns: 100 };

// ---- shared generators ----------------------------------------------------

const hexColor = fc
  .array(fc.constantFrom(..."0123456789abcdefABCDEF".split("")), { minLength: 6, maxLength: 6 })
  .map((d) => `#${d.join("")}`);

const slug = fc.stringMatching(/^[a-z][a-z0-9-]{0,11}$/);

const uniqueSlugs = (min: number, max: number) =>
  fc.uniqueArray(slug, { minLength: min, maxLength: max });

const pxLength = fc.integer({ min: 0, max: 4000 }).map((n) => `${n}px`);

const validSettings = () => ({
  layout: { contentSize: "720px", wideSize: "1200px" },
  color: { palette: [] },
  typography: { fluid: true, fontSizes: [] },
  spacing: { spacingSizes: [] },
});

const validConfig = (): ThemeConfig => ({
  version: REQUIRED_THEME_VERSION,
  settings: validSettings(),
});

// ---------------------------------------------------------------------------

describe("Property 1: Invalid theme configuration is rejected with an identified fault", () => {
  // Feature: castleford-food-pantry-website, Property 1: Invalid theme configuration is rejected with an identified fault
  it("rejects malformed JSON on the root", () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          try {
            JSON.parse(s);
            return false;
          } catch {
            return true;
          }
        }),
        (text) => {
          const r = validateThemeConfig(text);
          expect(r.ok).toBe(false);
          if (!r.ok) expect(r.field).toBe("<root>");
        },
      ),
      RUNS,
    );
  });

  it("rejects a missing or wrong version and names 'version'", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.integer().filter((n) => n !== REQUIRED_THEME_VERSION),
          fc.string(),
          fc.constant(null),
        ),
        (version) => {
          const cfg: Record<string, unknown> = { settings: validSettings() };
          if (version !== undefined) cfg.version = version;
          const r = validateThemeConfig(cfg);
          expect(r.ok).toBe(false);
          if (!r.ok) expect(r.field).toBe("version");
        },
      ),
      RUNS,
    );
  });

  it("rejects a missing required settings key and names it", () => {
    fc.assert(
      fc.property(fc.constantFrom(...REQUIRED_SETTINGS_KEYS), (key) => {
        const cfg = validConfig();
        delete (cfg.settings as Record<string, unknown>)[key];
        const r = validateThemeConfig(cfg);
        expect(r.ok).toBe(false);
        if (!r.ok) expect(r.field).toBe(`settings.${key}`);
      }),
      RUNS,
    );
  });

  it("accepts a well-formed config", () => {
    expect(validateThemeConfig(validConfig()).ok).toBe(true);
  });
});

describe("Property 4: Color tokens are uniquely named and valid", () => {
  // Feature: castleford-food-pantry-website, Property 4: Color tokens are uniquely named and valid
  it("accepts palettes with unique slugs and valid hex colors", () => {
    fc.assert(
      fc.property(
        uniqueSlugs(1, 12).chain((slugs) =>
          fc
            .array(hexColor, { minLength: slugs.length, maxLength: slugs.length })
            .map((colors) => slugs.map((s, i) => ({ slug: s, name: s, color: colors[i] }))),
        ),
        (palette) => {
          expect(validateColorPalette(palette).ok).toBe(true);
        },
      ),
      RUNS,
    );
  });

  it("rejects a duplicated slug", () => {
    fc.assert(
      fc.property(slug, hexColor, hexColor, (s, c1, c2) => {
        const r = validateColorPalette([
          { slug: s, name: s, color: c1 },
          { slug: s, name: s, color: c2 },
        ]);
        expect(r.ok).toBe(false);
      }),
      RUNS,
    );
  });

  it("rejects an invalid color value", () => {
    fc.assert(
      fc.property(
        slug,
        fc.string().filter((s) => !isValidHexColor(s)),
        (s, bad) => {
          const r = validateColorPalette([{ slug: s, name: s, color: bad }]);
          expect(r.ok).toBe(false);
        },
      ),
      RUNS,
    );
  });

  it("the real theme.json palette is valid", () => {
    const cfg = loadThemeConfig();
    expect(validateColorPalette(cfg.settings.color?.palette).ok).toBe(true);
  });
});

describe("Property 5: Fluid typography is clamped and monotonic", () => {
  // Feature: castleford-food-pantry-website, Property 5: Fluid typography is clamped and monotonic
  const fluidSize = fc
    .record({
      a: fc.integer({ min: 8, max: 120 }),
      b: fc.integer({ min: 8, max: 120 }),
      v1: fc.integer({ min: 200, max: 800 }),
      gap: fc.integer({ min: 1, max: 1600 }),
    })
    .map(({ a, b, v1, gap }) => ({
      minPx: Math.min(a, b),
      maxPx: Math.max(a, b),
      minViewportPx: v1,
      maxViewportPx: v1 + gap,
    }));

  // Boundary viewports from the design (359/360/782/783) plus arbitrary widths.
  const viewport = fc.oneof(
    fc.constantFrom(0, 359, 360, 782, 783),
    fc.integer({ min: 0, max: 4000 }),
  );

  it("stays within [min, max] at every viewport", () => {
    fc.assert(
      fc.property(fluidSize, viewport, (size, vp) => {
        const px = clampFluidSize(size, vp);
        expect(px).toBeGreaterThanOrEqual(size.minPx);
        expect(px).toBeLessThanOrEqual(size.maxPx);
      }),
      RUNS,
    );
  });

  it("equals min at or below the min viewport and max at or above the max viewport", () => {
    fc.assert(
      fc.property(fluidSize, (size) => {
        expect(clampFluidSize(size, size.minViewportPx)).toBe(size.minPx);
        expect(clampFluidSize(size, size.minViewportPx - 1)).toBe(size.minPx);
        expect(clampFluidSize(size, size.maxViewportPx)).toBe(size.maxPx);
        expect(clampFluidSize(size, size.maxViewportPx + 1)).toBe(size.maxPx);
      }),
      RUNS,
    );
  });

  it("is non-decreasing as the viewport grows", () => {
    fc.assert(
      fc.property(fluidSize, viewport, viewport, (size, v1, v2) => {
        const [lo, hi] = v1 <= v2 ? [v1, v2] : [v2, v1];
        expect(clampFluidSize(size, lo)).toBeLessThanOrEqual(clampFluidSize(size, hi));
      }),
      RUNS,
    );
  });
});

describe("Property 6: Spacing tokens are sufficient, uniquely named, and non-negative", () => {
  // Feature: castleford-food-pantry-website, Property 6: Spacing tokens are sufficient, uniquely named, and non-negative
  it("accepts enough unique, non-negative tokens", () => {
    fc.assert(
      fc.property(
        uniqueSlugs(MIN_SPACING_TOKENS, 12).chain((slugs) =>
          fc
            .array(pxLength, { minLength: slugs.length, maxLength: slugs.length })
            .map((sizes) => slugs.map((s, i) => ({ slug: s, name: s, size: sizes[i] }))),
        ),
        (tokens) => {
          expect(validateSpacingSizes(tokens).ok).toBe(true);
        },
      ),
      RUNS,
    );
  });

  it("rejects fewer than the minimum number of tokens", () => {
    fc.assert(
      fc.property(
        uniqueSlugs(0, MIN_SPACING_TOKENS - 1),
        (slugs) => {
          const tokens = slugs.map((s) => ({ slug: s, name: s, size: "8px" }));
          expect(validateSpacingSizes(tokens).ok).toBe(false);
        },
      ),
      RUNS,
    );
  });

  it("rejects a negative size", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4000 }), (n) => {
        const tokens = [
          { slug: "a", name: "a", size: "8px" },
          { slug: "b", name: "b", size: `-${n}px` },
          { slug: "c", name: "c", size: "16px" },
        ];
        expect(validateSpacingSizes(tokens).ok).toBe(false);
      }),
      RUNS,
    );
  });

  it("rejects duplicate slugs", () => {
    fc.assert(
      fc.property(slug, (s) => {
        const tokens = [
          { slug: s, name: s, size: "8px" },
          { slug: s, name: s, size: "12px" },
          { slug: "other", name: "other", size: "16px" },
        ];
        expect(validateSpacingSizes(tokens).ok).toBe(false);
      }),
      RUNS,
    );
  });

  it("the real theme.json spacing scale is valid", () => {
    const cfg = loadThemeConfig();
    expect(validateSpacingSizes(cfg.settings.spacing?.spacingSizes).ok).toBe(true);
  });
});

describe("Property 7: Wide width is at least content width", () => {
  // Feature: castleford-food-pantry-website, Property 7: Wide width is at least content width
  it("accepts wide >= content and rejects wide < content", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 3000 }),
        fc.integer({ min: 1, max: 3000 }),
        (content, wide) => {
          const r = validateLayout({ contentSize: `${content}px`, wideSize: `${wide}px` });
          expect(r.ok).toBe(wide >= content);
          if (!r.ok) expect(r.field).toBe("settings.layout.wideSize");
        },
      ),
      RUNS,
    );
  });

  it("rejects missing widths", () => {
    expect(validateLayout({}).ok).toBe(false);
    expect(validateLayout({ contentSize: "720px" }).ok).toBe(false);
  });

  it("the real theme.json layout is valid", () => {
    expect(validateLayout(loadThemeConfig().settings.layout).ok).toBe(true);
  });
});

describe("Property 8: Token changes propagate to all referencing blocks", () => {
  // Feature: castleford-food-pantry-website, Property 8: Token changes propagate to all referencing blocks
  // In-memory model: every reference resolves through the config, so editing a
  // token value changes what every reference to that slug resolves to.
  it("resolving the same slug after an edit returns the new value everywhere", () => {
    fc.assert(
      fc.property(
        slug,
        hexColor,
        hexColor,
        fc.integer({ min: 1, max: 20 }),
        (s, before, after, refs) => {
          const cfg = validConfig();
          cfg.settings.color = { palette: [{ slug: s, name: s, color: before }] };
          const first = Array.from({ length: refs }, () => resolveToken(s, cfg).value);
          expect(new Set(first)).toEqual(new Set([before]));

          cfg.settings.color = { palette: [{ slug: s, name: s, color: after }] };
          const second = Array.from({ length: refs }, () => resolveToken(s, cfg).value);
          expect(new Set(second)).toEqual(new Set([after]));
        },
      ),
      RUNS,
    );
  });
});

describe("Property 10: Undefined or invalid token references resolve to a defined fallback", () => {
  // Feature: castleford-food-pantry-website, Property 10: Undefined or invalid token references resolve to a defined fallback
  const kind = fc.constantFrom("color" as const, "fontSize" as const, "spacing" as const);

  it("an undefined slug resolves to the kind's fallback", () => {
    fc.assert(
      fc.property(fc.string(), kind, (name, k) => {
        const r = resolveToken(name, validConfig(), k);
        expect(r.resolved).toBe(false);
        expect(r.value).toBe(FALLBACK_TOKENS[k].value);
      }),
      RUNS,
    );
  });

  it("a token with an invalid value resolves to the fallback", () => {
    fc.assert(
      fc.property(
        slug,
        fc.string().filter((s) => !isValidHexColor(s)),
        (s, bad) => {
          const cfg = validConfig();
          cfg.settings.color = { palette: [{ slug: s, name: s, color: bad }] };
          const r = resolveToken(s, cfg, "color");
          expect(r.resolved).toBe(false);
          expect(isValidHexColor(r.value)).toBe(true);
        },
      ),
      RUNS,
    );
  });

  it("every fallback value is itself valid for its kind", () => {
    expect(isValidHexColor(FALLBACK_TOKENS.color.value)).toBe(true);
    expect(parseLengthToPx(FALLBACK_TOKENS.fontSize.value)).not.toBeNull();
    expect(parseLengthToPx(FALLBACK_TOKENS.spacing.value)).not.toBeNull();
  });
});
