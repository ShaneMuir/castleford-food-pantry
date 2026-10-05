import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * Smoke tests for environment and version control (task 1.3).
 *
 * These are coarse "is the world wired up correctly" checks rather than
 * fine-grained property tests. They assert:
 *   - the project theme is recognized as a WordPress block theme (Req 1.1)
 *   - theme.json declares schema version 3 (Req 1.2)
 *   - the site is served at the expected local URL (Req 17.1)
 *   - MySQL is reachable at the named db/host/port (Req 17.2)
 *   - the Git remote and `main` branch are configured (Req 17.3)
 *   - .gitignore excludes core/uploads/secrets (Req 17.4)
 *
 * Design notes:
 *   - The block-theme (1.1) and theme.json-version (1.2) assertions are written
 *     to fail-until-implemented. theme.json is authored by task 3.1 and a first
 *     block template by task 2.1/15.x; these tests fail clearly until those land
 *     and pass once they do (intended TDD behavior).
 *   - Shell/network checks (MySQL, Git, site URL) shell out via child_process.
 *     The user authorized running these commands. Each check that cannot run in
 *     a given environment degrades to a clear skip/annotation rather than a
 *     false failure, except where the requirement is the point of the test.
 */

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const THEME_DIR = resolve(
  REPO_ROOT,
  "wp-content/themes/castleford-food-pantry",
);

const EXPECTED_SITE_URL = "https://castleford-food-pantry.test";
const EXPECTED_DB_NAME = "castleford-food-pantry";
const EXPECTED_DB_HOST = "127.0.0.1";
const EXPECTED_DB_PORT = "3306";
const EXPECTED_GIT_REMOTE =
  "git@github.com:ShaneMuir/castleford-food-pantry.git";
const EXPECTED_BRANCH = "main";

/** Run a command, returning trimmed stdout or null if it is unavailable/fails. */
function tryExec(
  file: string,
  args: string[],
  opts: { cwd?: string } = {},
): string | null {
  try {
    return execFileSync(file, args, {
      cwd: opts.cwd ?? REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 15000,
    }).trim();
  } catch {
    return null;
  }
}

function isCommandAvailable(file: string): boolean {
  return tryExec("sh", ["-c", `command -v ${file}`]) !== null;
}

describe("smoke: block theme recognition (Req 1.1)", () => {
  // WordPress recognizes a block theme when it has a style.css header, a
  // theme.json, and a templates/ directory with at least one block template.
  it("has a style.css theme header", () => {
    const styleCss = resolve(THEME_DIR, "style.css");
    expect(existsSync(styleCss)).toBe(true);
    const header = readFileSync(styleCss, "utf8");
    // The WordPress stylesheet header requires at least a Theme Name line.
    expect(header).toMatch(/^\s*\/\*[\s\S]*Theme Name:\s*.+/m);
  });

  it("has a theme.json file (authored by task 3.1)", () => {
    // Fails until task 3.1 lands; passes once theme.json exists.
    expect(existsSync(resolve(THEME_DIR, "theme.json"))).toBe(true);
  });

  it("has a templates/ directory with at least one block template", () => {
    const templatesDir = resolve(THEME_DIR, "templates");
    expect(existsSync(templatesDir)).toBe(true);
    const htmlTemplates = tryExec("sh", [
      "-c",
      `ls ${JSON.stringify(templatesDir)}/*.html 2>/dev/null | wc -l`,
    ]);
    // Fails until a block template (e.g. templates/index.html / front-page.html)
    // is added by task 2.1 / 15.x; passes once at least one exists.
    expect(Number(htmlTemplates ?? "0")).toBeGreaterThan(0);
  });
});

describe("smoke: theme.json schema version (Req 1.2)", () => {
  it("declares version 3", () => {
    const themeJsonPath = resolve(THEME_DIR, "theme.json");
    // Fail clearly if the file is absent (TDD: becomes a real pass after 3.1).
    expect(
      existsSync(themeJsonPath),
      "theme.json does not exist yet — authored by task 3.1",
    ).toBe(true);
    const parsed = JSON.parse(readFileSync(themeJsonPath, "utf8"));
    expect(parsed.version).toBe(3);
  });
});

describe("smoke: local site URL (Req 17.1)", () => {
  it("resolves the configured site URL to the expected local domain", () => {
    // Prefer the resolvable WordPress config over a live HTTP fetch so the
    // check is deterministic even when the vhost is flaky. If wp-cli is not
    // available we fall back to an HTTP probe, and only then annotate a skip.
    const rawSiteUrl = isCommandAvailable("wp")
      ? tryExec("wp", ["option", "get", "siteurl"])
      : null;

    if (rawSiteUrl !== null) {
      // wp-cli can emit PHP deprecation notices to stdout on some PHP
      // versions; pull the http(s) URL out of whatever it prints.
      const match = rawSiteUrl.match(/https?:\/\/[^\s/]+/);
      const siteUrl = match ? match[0] : rawSiteUrl.trim();
      expect(siteUrl.replace(/\/$/, "")).toBe(EXPECTED_SITE_URL);
      return;
    }

    const httpStatus = tryExec("sh", [
      "-c",
      `curl -k -s -o /dev/null -w "%{http_code}" ${JSON.stringify(
        EXPECTED_SITE_URL + "/",
      )}`,
    ]);
    if (httpStatus === null) {
      // Neither wp-cli nor curl could run in this environment.
      console.warn(
        "[smoke] skipped site-URL check: wp-cli and curl both unavailable",
      );
      return;
    }
    // 2xx/3xx means the vhost answers at the expected URL.
    expect(Number(httpStatus)).toBeGreaterThanOrEqual(200);
    expect(Number(httpStatus)).toBeLessThan(400);
  });
});

describe("smoke: MySQL reachability (Req 17.2)", () => {
  it("connects to the named database on the configured host and port", () => {
    if (!isCommandAvailable("mysql")) {
      console.warn("[smoke] skipped MySQL check: mysql client unavailable");
      return;
    }
    // Credentials for the local dev DB (root/root per the verified env).
    const result = tryExec("mysql", [
      "-h",
      EXPECTED_DB_HOST,
      "-P",
      EXPECTED_DB_PORT,
      "-uroot",
      "-proot",
      "-N",
      "-B",
      "-e",
      "SELECT 1;",
      EXPECTED_DB_NAME,
    ]);
    expect(
      result,
      `could not reach MySQL db '${EXPECTED_DB_NAME}' at ${EXPECTED_DB_HOST}:${EXPECTED_DB_PORT}`,
    ).not.toBeNull();
    expect(result).toContain("1");
  });
});

describe("smoke: Git remote and branch (Req 17.3)", () => {
  it("has the expected origin remote", () => {
    const remote = tryExec("git", ["remote", "get-url", "origin"]);
    expect(remote, "git remote 'origin' is not configured").not.toBeNull();
    expect(remote).toBe(EXPECTED_GIT_REMOTE);
  });

  it("tracks the main branch", () => {
    // Current branch is main, or the branch exists in the repo.
    const current = tryExec("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    const branches = tryExec("git", ["branch", "--list", EXPECTED_BRANCH]);
    const hasMain =
      current === EXPECTED_BRANCH ||
      (branches !== null && branches.includes(EXPECTED_BRANCH));
    expect(hasMain, `branch '${EXPECTED_BRANCH}' not found`).toBe(true);
  });
});

describe("smoke: .gitignore exclusions (Req 17.4)", () => {
  const gitignorePath = resolve(REPO_ROOT, ".gitignore");

  it("exists at the repo root", () => {
    expect(existsSync(gitignorePath)).toBe(true);
  });

  it("excludes WordPress core, uploads, and local secrets", () => {
    const contents = readFileSync(gitignorePath, "utf8");
    const lines = contents
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));

    // WordPress core directories.
    expect(lines).toContain("/wp-admin/");
    expect(lines).toContain("/wp-includes/");
    // Core root PHP files (wildcard).
    expect(lines.some((l) => /^\/wp-\*\.php$/.test(l))).toBe(true);
    // Uploads working directory.
    expect(lines.some((l) => /wp-content\/uploads\/?$/.test(l))).toBe(true);
    // Local environment secrets.
    expect(lines).toContain("wp-config.php");
    expect(lines.some((l) => /^\.env/.test(l))).toBe(true);
  });

  it("keeps the project theme tracked despite ignoring other themes", () => {
    const contents = readFileSync(gitignorePath, "utf8");
    expect(contents).toMatch(/wp-content\/themes\/\*/);
    expect(contents).toMatch(
      /!wp-content\/themes\/castleford-food-pantry\//,
    );
  });
});
