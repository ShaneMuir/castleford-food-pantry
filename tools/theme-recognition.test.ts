import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * Example tests for task 2.2: WordPress block-theme recognition.
 *
 * WordPress recognizes a directory as a block theme when it contains a
 * `style.css` with a theme header, a `theme.json` file, and a `templates/`
 * directory holding at least one block template (`*.html`). These example
 * tests assert each of those artifacts exists for the Castleford Community
 * Food Pantry theme.
 *
 * Per TDD, some assertions below are expected to FAIL until the tasks that
 * author those artifacts complete:
 *   - `style.css` + `Theme Name:` header   -> satisfied by task 2.1 (passes now)
 *   - `theme.json`                          -> authored by task 3.1 (fails until done)
 *   - `templates/*.html` (>= 1 template)    -> added by task 15   (fails until done)
 *
 * The assertions are real (not skipped) so they go green automatically once
 * those tasks land.
 *
 * Validates: Requirements 1.1
 */

// Resolve the theme directory relative to this test file (tools/ -> repo root).
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const themeDir = join(
  repoRoot,
  "wp-content",
  "themes",
  "castleford-food-pantry",
);

describe("block theme recognition (Req 1.1)", () => {
  it("has a style.css containing a Theme Name header", () => {
    const styleCssPath = join(themeDir, "style.css");
    expect(existsSync(styleCssPath)).toBe(true);

    const header = readFileSync(styleCssPath, "utf8");
    // WordPress parses the theme header from a leading comment block; the
    // `Theme Name:` line is the minimum required field.
    expect(header).toMatch(/^\s*Theme Name:\s*\S+/m);
  });

  it("has a theme.json file", () => {
    // Authored by task 3.1 (theme.json v3). Expected to fail until then.
    const themeJsonPath = join(themeDir, "theme.json");
    expect(existsSync(themeJsonPath)).toBe(true);
  });

  it("has a templates/ directory with at least one block template", () => {
    const templatesDir = join(themeDir, "templates");
    expect(existsSync(templatesDir)).toBe(true);

    // At least one HTML block template is required for block-theme
    // recognition. Templates are added by task 15; expected to fail until then.
    const htmlTemplates = readdirSync(templatesDir).filter((name) =>
      name.toLowerCase().endsWith(".html"),
    );
    expect(htmlTemplates.length).toBeGreaterThanOrEqual(1);
  });
});
