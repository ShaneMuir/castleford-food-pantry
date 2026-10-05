/**
 * Pure CSS length parsing helpers.
 *
 * The theme expresses lengths as `px` and `rem` strings (e.g. "720px",
 * "0.95rem", "6rem"). To compare and do clamp/layout math we normalize every
 * length to pixels.
 *
 * Rem base assumption: 1rem = 16px. This matches the browser default root
 * font size and the theme never overrides the root `font-size`, so a fixed
 * base is a safe, documented simplification for in-memory analysis. Change
 * {@link REM_BASE_PX} here if the theme ever sets a non-default root size.
 */

/** Pixels per rem. Documented assumption: browser default root font size. */
export const REM_BASE_PX = 16;

/**
 * Parse a CSS length string into a numeric pixel value.
 *
 * Supports `px`, `rem`, `em` (treated as rem relative to the root for this
 * token-level analysis), and unitless numbers (interpreted as pixels). Leading
 * and trailing whitespace is tolerated.
 *
 * @param value - A length string such as "720px", "0.95rem", or "6rem".
 * @returns The length in pixels, or `null` if the string is not a parseable
 *   length. Returning `null` (rather than throwing) lets validators report a
 *   named-field failure instead of crashing on malformed input.
 */
export function parseLengthToPx(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  const match = /^(-?\d*\.?\d+)\s*(px|rem|em)?$/i.exec(trimmed);
  if (!match) {
    return null;
  }
  const magnitude = Number.parseFloat(match[1]);
  if (!Number.isFinite(magnitude)) {
    return null;
  }
  const unit = (match[2] ?? "px").toLowerCase();
  switch (unit) {
    case "px":
      return magnitude;
    case "rem":
    case "em":
      return magnitude * REM_BASE_PX;
    default:
      return null;
  }
}

/** True when `value` parses to a finite, non-negative pixel length. */
export function isNonNegativeLength(value: unknown): boolean {
  const px = parseLengthToPx(value);
  return px !== null && px >= 0;
}
