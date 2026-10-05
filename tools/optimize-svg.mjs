#!/usr/bin/env node
/**
 * SVG optimization: runs SVGO over the brand logos and writes them to the
 * theme's assets/images/ with stable names. Idempotent (always rewrites from
 * the untouched sources). Sources are never modified.
 *
 *   v2-1 castle-sun-glow  -> logo-horizontal.svg (header lockup, cropped viewBox)
 *   v2-2 badge-glow       -> logo-badge.svg      (badge / favicon / social)
 *   v2-3 battlement-glow  -> logo-banner.svg     (alternate footer banner)
 *
 * Artwork safety: colors are never rewritten (convertColors / shape-to-path
 * transforms disabled), viewBox / role / aria-label are preserved, and the
 * script verifies GLOW letter colors + a11y attributes after optimizing.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "website-images");
const outDir = join(
  root,
  "wp-content/themes/castleford-food-pantry/assets/images",
);

// Header lockup artwork ends ~x=390 (pill) but "Castleford" text runs
// further right; crop the 580px canvas to 450 to drop the dead space.
const HORIZONTAL_VIEWBOX = { w: 450, h: 200 };

const LOGOS = [
  { src: "v2-1-castle-sun-glow.svg", out: "logo-horizontal.svg", crop: HORIZONTAL_VIEWBOX },
  { src: "v2-2-badge-glow.svg", out: "logo-badge.svg" },
  { src: "v2-3-battlement-glow.svg", out: "logo-banner.svg" },
];

const GLOW = ["#3B8FE0", "#EE3B24", "#FFD60A", "#B026D0"];

const plugins = [
  {
    name: "preset-default",
    params: {
      overrides: {
        removeViewBox: false,
        removeTitle: false,
        convertColors: false,
        convertShapeToPath: false,
        removeUnknownsAndDefaults: false,
        cleanupIds: false,
      },
    },
  },
];

function crop(svg, { w, h }) {
  return svg
    .replace(/viewBox="[^"]*"/, `viewBox="0 0 ${w} ${h}"`)
    .replace(/\swidth="[^"]*"/, ` width="${w}"`)
    .replace(/\sheight="[^"]*"/, ` height="${h}"`);
}

function verify(name, source, output) {
  const errors = [];
  const lower = output.toLowerCase();
  for (const c of GLOW) {
    if (source.toLowerCase().includes(c.toLowerCase()) && !lower.includes(c.toLowerCase())) {
      errors.push(`missing color ${c}`);
    }
  }
  const label = source.match(/aria-label="([^"]*)"/)?.[1];
  if (!/role="img"/.test(output)) errors.push('missing role="img"');
  if (label && !output.includes(`aria-label="${label}"`)) errors.push("missing/changed aria-label");
  if (!/viewBox="/.test(output)) errors.push("missing viewBox");
  if (source.includes("<textPath") && !output.includes("<textPath")) errors.push("textPath lost");
  if (errors.length) throw new Error(`${name}: ${errors.join(", ")}`);
}

mkdirSync(outDir, { recursive: true });
let failed = false;
for (const { src, out, crop: box } of LOGOS) {
  try {
    const source = readFileSync(join(srcDir, src), "utf8");
    let result = optimize(source, { path: src, multipass: true, plugins }).data;
    if (box) result = crop(result, box);
    verify(out, source, result);
    writeFileSync(join(outDir, out), result);
    const before = statSync(join(srcDir, src)).size;
    const after = statSync(join(outDir, out)).size;
    const vb = result.match(/viewBox="([^"]*)"/)[1];
    console.log(`[assets:svg] ${src} -> ${out}: ${before}B -> ${after}B (viewBox "${vb}") OK`);
  } catch (err) {
    failed = true;
    console.error(`[assets:svg] FAILED ${src}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
