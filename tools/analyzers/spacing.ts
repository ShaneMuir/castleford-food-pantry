/**
 * Pure spacing-scale validators.
 *
 * Supports Property 6 (spacing tokens are sufficient, uniquely named, and
 * non-negative; Req 2.3).
 */

import { isNonNegativeLength } from "./units.js";
import type { SpacingToken, ValidationResult } from "./types.js";

/** Minimum number of spacing tokens the theme must declare (Req 2.3). */
export const MIN_SPACING_TOKENS = 3;

/**
 * Validate a spacing scale: at least {@link MIN_SPACING_TOKENS} tokens, each
 * with a unique slug and a non-negative, parseable length.
 *
 * Supports Property 6 (Req 2.3).
 */
export function validateSpacingSizes(spacingSizes: unknown): ValidationResult {
  if (!Array.isArray(spacingSizes)) {
    return {
      ok: false,
      field: "settings.spacing.spacingSizes",
      reason: "spacingSizes must be an array of spacing tokens",
    };
  }
  if (spacingSizes.length < MIN_SPACING_TOKENS) {
    return {
      ok: false,
      field: "settings.spacing.spacingSizes",
      reason: `expected at least ${MIN_SPACING_TOKENS} spacing tokens, got ${spacingSizes.length}`,
    };
  }
  const seen = new Set<string>();
  for (let i = 0; i < spacingSizes.length; i += 1) {
    const token = spacingSizes[i] as Partial<SpacingToken> | undefined;
    const where = `settings.spacing.spacingSizes[${i}]`;
    if (typeof token?.slug !== "string" || token.slug.length === 0) {
      return { ok: false, field: `${where}.slug`, reason: "slug must be a non-empty string" };
    }
    if (seen.has(token.slug)) {
      return { ok: false, field: `${where}.slug`, reason: `duplicate slug "${token.slug}"` };
    }
    seen.add(token.slug);
    if (!isNonNegativeLength(token.size)) {
      return {
        ok: false,
        field: `${where}.size`,
        reason: `length must be a non-negative px/rem value, got "${String(token.size)}"`,
      };
    }
  }
  return { ok: true };
}
