#!/usr/bin/env node
/**
 * Image → WebP conversion pipeline (Task 4.2).
 *
 * Converts `website-images/*.jpeg` to WebP into the theme's
 * `assets/images/` directory, recording intrinsic width/height and generating
 * responsive `srcset`/`sizes` variants with `sharp`.
 *
 * Output per source `<name>.jpeg`:
 *   - `<name>.webp`                 full-size WebP (intrinsic dimensions)
 *   - `<name>-<w>.webp`             width variants (only downscales < source width)
 *
 * A manifest (`assets/images/manifest.json`) maps each source to:
 *   { webp, width, height, variants: [{ file, width }], srcset, sizes }
 *
 * Width/height support CLS avoidance (Req 14.2); WebP is the next-gen format
 * (Req 14.3); srcset/sizes support responsive images (Req 13.4).
 *
 * The script is idempotent and runnable via `npm run assets:convert`.
 *
 * Note: SVG logos (task 4.4) and the hero poster/video (task 4.3) are handled
 * by their own tools and are intentionally NOT touched here.
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const SOURCE_DIR = path.join(REPO_ROOT, "website-images");
const OUTPUT_DIR = path.join(
  REPO_ROOT,
  "wp-content",
  "themes",
  "castleford-food-pantry",
  "assets",
  "images",
);
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

// Candidate responsive widths. A variant is only emitted when it is strictly
// smaller than the source width — we never upscale.
const VARIANT_WIDTHS = [480, 768, 1024, 1600];

// WebP encode settings.
const WEBP_OPTIONS = { quality: 80, effort: 4 };

// Sensible default `sizes`; patterns may override per-usage.
const DEFAULT_SIZES = "(max-width: 782px) 100vw, 720px";

// Theme-relative base used in manifest `src`/`srcset` entries.
const THEME_RELATIVE_BASE = "assets/images";

async function listSourceJpegs() {
  const entries = await fs.readdir(SOURCE_DIR);
  return entries
    .filter((name) => /\.jpe?g$/i.test(name))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Convert a single source JPEG into a full-size WebP plus width variants.
 * Returns a manifest entry describing the generated files.
 */
async function convertOne(fileName) {
  const sourcePath = path.join(SOURCE_DIR, fileName);
  const baseName = fileName.replace(/\.[^.]+$/, "");

  const image = sharp(sourcePath);
  const metadata = await image.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${fileName}`);
  }

  // Full-size WebP keeps intrinsic dimensions.
  const fullFile = `${baseName}.webp`;
  await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(path.join(OUTPUT_DIR, fullFile));

  // Width variants: only downscales strictly smaller than the source.
  const variants = [{ file: fullFile, width }];
  for (const targetWidth of VARIANT_WIDTHS) {
    if (targetWidth >= width) continue; // never upscale, skip equal/larger
    const variantFile = `${baseName}-${targetWidth}.webp`;
    await sharp(sourcePath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp(WEBP_OPTIONS)
      .toFile(path.join(OUTPUT_DIR, variantFile));
    variants.push({ file: variantFile, width: targetWidth });
  }

  // srcset ordered ascending by width, referencing theme-relative paths.
  const srcset = variants
    .slice()
    .sort((a, b) => a.width - b.width)
    .map((v) => `${THEME_RELATIVE_BASE}/${v.file} ${v.width}w`)
    .join(", ");

  return {
    webp: `${THEME_RELATIVE_BASE}/${fullFile}`,
    width,
    height,
    variants: variants
      .slice()
      .sort((a, b) => a.width - b.width)
      .map((v) => ({ file: `${THEME_RELATIVE_BASE}/${v.file}`, width: v.width })),
    srcset,
    sizes: DEFAULT_SIZES,
  };
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const jpegs = await listSourceJpegs();
  if (jpegs.length === 0) {
    console.log(`[assets:convert] No JPEGs found in ${SOURCE_DIR}.`);
    return;
  }

  const manifest = {};
  for (const fileName of jpegs) {
    const entry = await convertOne(fileName);
    manifest[fileName] = entry;
    const variantWidths = entry.variants.map((v) => v.width).join(", ");
    console.log(
      `[assets:convert] ${fileName} -> ${entry.webp} ` +
        `(${entry.width}x${entry.height}; widths: ${variantWidths})`,
    );
  }

  // Stable key order for a deterministic (idempotent) manifest.
  const orderedManifest = {};
  for (const key of Object.keys(manifest).sort((a, b) => a.localeCompare(b))) {
    orderedManifest[key] = manifest[key];
  }

  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(orderedManifest, null, 2) + "\n",
    "utf8",
  );
  console.log(
    `[assets:convert] Wrote manifest for ${jpegs.length} image(s) -> ${path.relative(
      REPO_ROOT,
      MANIFEST_PATH,
    )}`,
  );
}

main().catch((err) => {
  console.error(`[assets:convert] Failed: ${err.message}`);
  process.exit(1);
});
