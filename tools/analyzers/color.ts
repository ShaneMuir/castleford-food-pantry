/**
 * Pure color-token validators.
 *
 * Covers the palette invariants the correctness properties check:
 * - Property 4: color tokens have unique slugs and valid hex values (Req 2.1).
 * - Property 9: the GLOW letters g/l/o/w map to the four brand colors (Req 2.6).
 */

import type { ColorToken, ValidationResult } from "./types.js";

/** The canonical GLOW letter -> color mapping (Req 2.6, design "GLOW_Branding"). */
export const GLOW_LETTER_COLORS: Readonly<Record<"g" | "l" | "o" | "w", string>> =
  {
    g: "#3B8FE0",
    l: "#EE3B24",
    o: "#FFD60A",
    w: "#B026D0",
  };

/**
 * True when `value` is a syntactically valid hex color: `#` followed by 3, 4,
 * 6, or 8 hex digits (RGB, RGBA, RRGGBB, RRGGBBAA). Case-insensitive.
 */
export function isValidHexColor(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
    value.trim(),
  );
}

/**
 * Validate a color palette: every token must have a unique slug and a valid
 * hex color. Returns a named-field failure on the first offending token.
 *
 * Supports Property 4 (Req 2.1).
 */
export function validateColorPalette(palette: unknown): ValidationResult {
  if (!Array.isArray(palette)) {
    return {
      ok: false,
      field: "settings.color.palette",
      reason: "palette must be an array of color tokens",
    };
  }
  const seen = new Set<string>();
  for (let i = 0; i < palette.length; i += 1) {
    const token = palette[i] as Partial<ColorToken> | undefined;
    const where = `settings.color.palette[${i}]`;
    if (typeof token?.slug !== "string" || token.slug.length === 0) {
      return { ok: false, field: `${where}.slug`, reason: "slug must be a non-empty string" };
    }
    if (seen.has(token.slug)) {
      return { ok: false, field: `${where}.slug`, reason: `duplicate slug "${token.slug}"` };
    }
    seen.add(token.slug);
    if (!isValidHexColor(token.color)) {
      return {
        ok: false,
        field: `${where}.color`,
        reason: `invalid hex color "${String(token.color)}" for slug "${token.slug}"`,
      };
    }
  }
  return { ok: true };
}

/**
 * Validate that the palette contains the four GLOW letter tokens
 * (`glow-g`, `glow-l`, `glow-o`, `glow-w`) and that each maps, case-
 * insensitively, to its canonical color.
 *
 * Supports Property 9 (Req 2.6).
 */
export function validateGlowLetterColors(palette: unknown): ValidationResult {
  if (!Array.isArray(palette)) {
    return {
      ok: false,
      field: "settings.color.palette",
      reason: "palette must be an array of color tokens",
    };
  }
  const bySlug = new Map<string, string>();
  for (const token of palette as ColorToken[]) {
    if (token && typeof token.slug === "string" && typeof token.color === "string") {
      bySlug.set(token.slug, token.color);
    }
  }
  for (const letter of ["g", "l", "o", "w"] as const) {
    const slug = `glow-${letter}`;
    const expected = GLOW_LETTER_COLORS[letter];
    const actual = bySlug.get(slug);
    if (actual === undefined) {
      return { ok: false, field: `${slug}`, reason: `missing GLOW token "${slug}"` };
    }
    if (actual.toLowerCase() !== expected.toLowerCase()) {
      return {
        ok: false,
        field: slug,
        reason: `GLOW letter "${letter.toUpperCase()}" must be ${expected}, got ${actual}`,
      };
    }
  }
  return { ok: true };
}
