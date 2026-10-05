/**
 * Pure Design_Token resolver with a guaranteed fallback.
 *
 * Supports Property 10 (undefined or invalid token references resolve to a
 * defined fallback; Req 2.7). The resolver NEVER returns an empty or invalid
 * value: when the requested token is missing or malformed it returns a
 * defined fallback token of the same kind.
 */

import { isValidHexColor } from "./color.js";
import { isNonNegativeLength } from "./units.js";
import type {
  ColorToken,
  FontSizeToken,
  SpacingToken,
  ThemeConfig,
  TokenKind,
} from "./types.js";

/** A resolved token: its slug and its (valid) value. */
export interface ResolvedToken {
  slug: string;
  value: string;
  /** True when the requested slug was found and valid; false when a fallback was used. */
  resolved: boolean;
}

/**
 * Guaranteed-valid fallback values per token kind. These are deliberate,
 * neutral, always-valid defaults so the resolver can satisfy Property 10 even
 * when a config declares no tokens of the requested kind at all.
 */
export const FALLBACK_TOKENS: Readonly<Record<TokenKind, { slug: string; value: string }>> = {
  color: { slug: "fallback-color", value: "#1F3A5F" },
  fontSize: { slug: "fallback-font-size", value: "1rem" },
  spacing: { slug: "fallback-spacing", value: "1rem" },
};

/** Pull the token list for a kind out of a (possibly partial) config. */
function tokensFor(kind: TokenKind, config: ThemeConfig): Array<ColorToken | FontSizeToken | SpacingToken> {
  const settings = config?.settings ?? {};
  switch (kind) {
    case "color":
      return settings.color?.palette ?? [];
    case "fontSize":
      return settings.typography?.fontSizes ?? [];
    case "spacing":
      return settings.spacing?.spacingSizes ?? [];
    default:
      return [];
  }
}

/** True when a found token's value is valid for its kind. */
function isValueValid(kind: TokenKind, value: unknown): value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }
  if (kind === "color") {
    return isValidHexColor(value);
  }
  // fontSize and spacing are lengths; a non-negative parseable length is valid.
  return isNonNegativeLength(value);
}

/** Read the raw value field for a token of the given kind. */
function rawValueOf(kind: TokenKind, token: ColorToken | FontSizeToken | SpacingToken): unknown {
  return kind === "color"
    ? (token as ColorToken).color
    : (token as FontSizeToken | SpacingToken).size;
}

/**
 * Resolve a Design_Token by slug within a config, returning a defined fallback
 * when the token is undefined or has an invalid value.
 *
 * @param name - The token slug to resolve (e.g. "brand-green", "lg", "md").
 * @param config - The (possibly partial) Theme_Config to resolve against.
 * @param kind - Which token namespace to search; defaults to `"color"`.
 * @returns A {@link ResolvedToken} whose `value` is always a valid, non-empty
 *   value for the kind. `resolved` is `false` when the fallback was used.
 *
 * Supports Property 10 (Req 2.7).
 */
export function resolveToken(
  name: string,
  config: ThemeConfig,
  kind: TokenKind = "color",
): ResolvedToken {
  const fallback = FALLBACK_TOKENS[kind];
  if (typeof name === "string" && name.length > 0 && config) {
    for (const token of tokensFor(kind, config)) {
      if (token && token.slug === name) {
        const value = rawValueOf(kind, token);
        if (isValueValid(kind, value)) {
          return { slug: token.slug, value, resolved: true };
        }
        // Found but invalid -> fall through to the defined fallback.
        break;
      }
    }
  }
  return { slug: fallback.slug, value: fallback.value, resolved: false };
}
