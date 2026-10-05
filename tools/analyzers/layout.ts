/**
 * Pure layout-width validator.
 *
 * Supports Property 7 (wide width is at least content width; Req 2.4).
 */

import { parseLengthToPx } from "./units.js";
import type { LayoutSettings, ValidationResult } from "./types.js";

/**
 * Validate layout widths: both `contentSize` and `wideSize` must be defined
 * and parseable, and the wide width must be greater than or equal to the
 * content width.
 *
 * Supports Property 7 (Req 2.4).
 */
export function validateLayout(layout: unknown): ValidationResult {
  const l = layout as LayoutSettings | undefined;
  const contentPx = parseLengthToPx(l?.contentSize);
  if (contentPx === null) {
    return {
      ok: false,
      field: "settings.layout.contentSize",
      reason: `contentSize must be a defined px/rem length, got "${String(l?.contentSize)}"`,
    };
  }
  const widePx = parseLengthToPx(l?.wideSize);
  if (widePx === null) {
    return {
      ok: false,
      field: "settings.layout.wideSize",
      reason: `wideSize must be a defined px/rem length, got "${String(l?.wideSize)}"`,
    };
  }
  if (widePx < contentPx) {
    return {
      ok: false,
      field: "settings.layout.wideSize",
      reason: `wideSize (${widePx}px) must be >= contentSize (${contentPx}px)`,
    };
  }
  return { ok: true };
}
