/**
 * Pure analyzer helpers for the Castleford Community Food Pantry block theme.
 *
 * This barrel re-exports the pure, side-effect-free functions used by the
 * property-based and unit tests: theme.json validation (Property 1), token
 * resolution with fallbacks (Property 10), fluid-typography clamp math
 * (Property 5), and palette/spacing/layout/GLOW validators (Properties 4, 6,
 * 7, 9). The only I/O is `loadThemeConfig`, which reads theme.json.
 */

export * from "./types.js";
export * from "./units.js";
export * from "./config.js";
export * from "./resolve.js";
export * from "./fluid.js";
export * from "./color.js";
export * from "./spacing.js";
export * from "./layout.js";
