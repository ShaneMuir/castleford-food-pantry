/**
 * Pure fluid-typography clamp math.
 *
 * WordPress fluid type interpolates a font size linearly between a minimum
 * size (at a minimum viewport) and a maximum size (at a maximum viewport),
 * clamped outside that range. This module computes the resolved size for a
 * given viewport so Property 5 can be verified in memory.
 *
 * Supports Property 5 (fluid typography is clamped and monotonic; Req 2.2, 13.2).
 */

import { parseLengthToPx } from "./units.js";
import type { FluidRange, FontSizeToken } from "./types.js";

/**
 * Default viewport bounds used for the linear interpolation, in pixels.
 *
 * WordPress's `clamp()` generation defaults to roughly these breakpoints
 * (min ~320px, max ~1600px). They are exposed so tests can pin the exact
 * boundary viewports they generate against.
 */
export const DEFAULT_MIN_VIEWPORT_PX = 320;
export const DEFAULT_MAX_VIEWPORT_PX = 1600;

/** A normalized, numeric (pixel) description of a fluid size. */
export interface FluidSizePx {
  minPx: number;
  maxPx: number;
  minViewportPx: number;
  maxViewportPx: number;
}

/**
 * Compute the resolved font size (in px) for a fluid size at a viewport width.
 *
 * The result:
 * - lies within `[minPx, maxPx]`,
 * - equals `minPx` when `viewportPx <= minViewportPx`,
 * - equals `maxPx` when `viewportPx >= maxViewportPx`,
 * - is non-decreasing as `viewportPx` increases (given `minPx <= maxPx`).
 *
 * @param size - Normalized pixel bounds for the size and its viewports.
 * @param viewportPx - The viewport width in pixels.
 * @returns The clamped, interpolated size in pixels.
 */
export function clampFluidSize(size: FluidSizePx, viewportPx: number): number {
  const { minPx, maxPx, minViewportPx, maxViewportPx } = size;
  if (viewportPx <= minViewportPx) {
    return minPx;
  }
  if (viewportPx >= maxViewportPx) {
    return maxPx;
  }
  // Guard against a degenerate (zero-width) viewport range.
  const span = maxViewportPx - minViewportPx;
  if (span <= 0) {
    return maxPx;
  }
  const t = (viewportPx - minViewportPx) / span;
  const interpolated = minPx + t * (maxPx - minPx);
  // Clamp defensively so floating-point drift never escapes [min, max].
  return Math.min(maxPx, Math.max(minPx, interpolated));
}

/**
 * Normalize a font-size token's fluid range into pixel bounds for the clamp
 * math. Falls back to the fixed `size` for both min and max when the token has
 * no explicit fluid range.
 *
 * @param token - A font-size Design_Token.
 * @param minViewportPx - Minimum viewport width (defaults to {@link DEFAULT_MIN_VIEWPORT_PX}).
 * @param maxViewportPx - Maximum viewport width (defaults to {@link DEFAULT_MAX_VIEWPORT_PX}).
 * @returns Normalized pixel bounds, or `null` if the sizes cannot be parsed.
 */
export function toFluidSizePx(
  token: FontSizeToken,
  minViewportPx: number = DEFAULT_MIN_VIEWPORT_PX,
  maxViewportPx: number = DEFAULT_MAX_VIEWPORT_PX,
): FluidSizePx | null {
  const base = parseLengthToPx(token.size);
  let minPx = base;
  let maxPx = base;

  if (token.fluid && typeof token.fluid === "object") {
    const range = token.fluid as FluidRange;
    minPx = parseLengthToPx(range.min);
    maxPx = parseLengthToPx(range.max);
  }

  if (minPx === null || maxPx === null) {
    return null;
  }
  return { minPx, maxPx, minViewportPx, maxViewportPx };
}

/**
 * True when a font-size token's fluid range satisfies `min <= max` (and both
 * parse). Fixed sizes (no fluid range) are trivially valid.
 *
 * Supports the `min <= max` clause of Property 5.
 */
export function isFluidRangeOrdered(token: FontSizeToken): boolean {
  const sized = toFluidSizePx(token);
  return sized !== null && sized.minPx <= sized.maxPx;
}
