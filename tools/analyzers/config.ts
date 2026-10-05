/**
 * Pure Theme_Config validation and a thin file loader.
 *
 * {@link validateThemeConfig} supports Property 1 (invalid theme configuration
 * is rejected with an identified fault; Req 1.3): it rejects malformed JSON,
 * a missing `version`, a `version` other than 3, and missing required
 * settings keys, naming the specific invalid field in each case.
 *
 * The only side effect in this module is {@link loadThemeConfig}, which reads
 * `theme.json` from disk so properties and tests can run against the real file
 * in memory. Everything else is pure.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

import type { ThemeConfig, UnknownRecord, ValidationResult } from "./types.js";

/** The schema version this theme requires (Req 1.2). */
export const REQUIRED_THEME_VERSION = 3;

/** Required `settings` keys a valid Theme_Config must declare (Req 2.x). */
export const REQUIRED_SETTINGS_KEYS = [
  "layout",
  "color",
  "typography",
  "spacing",
] as const;

/** Result of {@link parseThemeConfig}: either a parsed object or a named fault. */
export type ParseResult =
  | { ok: true; value: ThemeConfig }
  | { ok: false; field: string; reason: string };

/**
 * Parse and validate a Theme_Config from either a raw JSON string or an
 * already-parsed object.
 *
 * - A malformed JSON string is rejected on field `"<root>"`.
 * - A non-object (array, null, primitive) is rejected on field `"<root>"`.
 * - A missing or non-numeric `version` is rejected on `"version"`.
 * - A `version` other than 3 is rejected on `"version"`.
 * - A missing/invalid `settings` object is rejected on `"settings"`.
 * - A missing required settings key is rejected on `"settings.<key>"`.
 *
 * Supports Property 1 (Req 1.3).
 *
 * @param input - A JSON string or a parsed value to validate.
 * @returns A {@link ParseResult} with the parsed config or a named fault.
 */
export function parseThemeConfig(input: unknown): ParseResult {
  let parsed: unknown = input;

  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      return { ok: false, field: "<root>", reason: "malformed JSON" };
    }
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, field: "<root>", reason: "theme config must be a JSON object" };
  }

  const obj = parsed as UnknownRecord;

  if (!("version" in obj)) {
    return { ok: false, field: "version", reason: "missing required field \"version\"" };
  }
  if (typeof obj.version !== "number") {
    return { ok: false, field: "version", reason: "\"version\" must be a number" };
  }
  if (obj.version !== REQUIRED_THEME_VERSION) {
    return {
      ok: false,
      field: "version",
      reason: `\"version\" must be ${REQUIRED_THEME_VERSION}, got ${obj.version}`,
    };
  }

  const settings = obj.settings;
  if (typeof settings !== "object" || settings === null || Array.isArray(settings)) {
    return { ok: false, field: "settings", reason: "missing or invalid \"settings\" object" };
  }

  const settingsObj = settings as UnknownRecord;
  for (const key of REQUIRED_SETTINGS_KEYS) {
    const value = settingsObj[key];
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return {
        ok: false,
        field: `settings.${key}`,
        reason: `missing required settings key \"${key}\"`,
      };
    }
  }

  return { ok: true, value: obj as ThemeConfig };
}

/**
 * Validate a Theme_Config and return a {@link ValidationResult}.
 *
 * This is the structural (shape/version/required-keys) gate of Property 1.
 * Deeper token invariants (palette, spacing, layout, fluid) are checked by the
 * dedicated validators in the sibling modules.
 *
 * @param input - A JSON string or a parsed value to validate.
 */
export function validateThemeConfig(input: unknown): ValidationResult {
  const parsed = parseThemeConfig(input);
  if (parsed.ok) {
    return { ok: true };
  }
  return { ok: false, field: parsed.field, reason: parsed.reason };
}

/** Default on-disk location of the theme's `theme.json`, relative to this file. */
const THEME_JSON_PATH = resolvePath(
  dirname(fileURLToPath(import.meta.url)),
  "../../wp-content/themes/castleford-food-pantry/theme.json",
);

/**
 * Load and parse `theme.json` from disk so properties can run in-memory.
 *
 * This is the ONLY side-effecting function in the analyzers module.
 *
 * @param path - Optional override path to a `theme.json` file.
 * @returns The parsed, structurally-valid {@link ThemeConfig}.
 * @throws If the file cannot be read or fails structural validation.
 */
export function loadThemeConfig(path: string = THEME_JSON_PATH): ThemeConfig {
  const raw = readFileSync(path, "utf8");
  const parsed = parseThemeConfig(raw);
  if (!parsed.ok) {
    throw new Error(
      `Invalid theme.json at ${path}: ${parsed.field} - ${parsed.reason}`,
    );
  }
  return parsed.value;
}
