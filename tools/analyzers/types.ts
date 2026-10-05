/**
 * Shared TypeScript types for the Castleford Community Food Pantry theme
 * analyzers.
 *
 * These describe the fragments of `theme.json` (schema v3) that the pure
 * validators and resolvers in this module operate on, plus the common
 * discriminated-union result shape used to report validation outcomes.
 *
 * The shapes are intentionally permissive (`unknown`-friendly, optional
 * fields) because the validators are the thing that proves a config is
 * well-formed; callers should treat a raw parse as `UnknownRecord` and narrow
 * it via {@link validateThemeConfig}.
 */

/** A plain JSON object whose fields have not yet been validated. */
export type UnknownRecord = Record<string, unknown>;

/**
 * Discriminated-union result for a validation that either succeeds or fails
 * while naming the specific field at fault and a human-readable reason.
 *
 * Supports Property 1 (invalid theme configuration is rejected with an
 * identified fault): the `field` is the dotted path of the offending key.
 */
export type ValidationResult =
  | { ok: true }
  | { ok: false; field: string; reason: string };

/** A single color Design_Token as declared in `settings.color.palette`. */
export interface ColorToken {
  slug: string;
  name: string;
  color: string;
}

/** The fluid min/max pair attached to a fluid font size. */
export interface FluidRange {
  min: string;
  max: string;
}

/** A single font-size Design_Token as declared in `settings.typography.fontSizes`. */
export interface FontSizeToken {
  slug: string;
  name: string;
  size: string;
  /** Present when the size scales fluidly; absent for fixed sizes. */
  fluid?: FluidRange | boolean;
}

/** A single spacing Design_Token as declared in `settings.spacing.spacingSizes`. */
export interface SpacingToken {
  slug: string;
  name: string;
  size: string;
}

/** The `settings.layout` fragment carrying content and wide widths. */
export interface LayoutSettings {
  contentSize?: string;
  wideSize?: string;
}

/** The `settings` fragment of a Theme_Config that this module reads. */
export interface ThemeSettings {
  layout?: LayoutSettings;
  color?: { palette?: ColorToken[] };
  typography?: { fluid?: boolean; fontSizes?: FontSizeToken[] };
  spacing?: { spacingSizes?: SpacingToken[] };
}

/** A validated-enough Theme_Config fragment (schema v3). */
export interface ThemeConfig {
  version: number;
  settings: ThemeSettings;
  [key: string]: unknown;
}

/** The kinds of Design_Token that {@link resolveToken} can resolve. */
export type TokenKind = "color" | "fontSize" | "spacing";
