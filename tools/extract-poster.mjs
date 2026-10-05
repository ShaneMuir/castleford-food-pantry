#!/usr/bin/env node
/**
 * Hero poster extraction + video placement (task 4.3).
 *
 * - Probes the source video's DISPLAY dimensions (rotation aware).
 * - Writes a web-optimised, muted, faststart H.264 copy (rotation baked in)
 *   to `assets/video/castleford-food-pantry-video.mp4`.
 * - Extracts a frame ~1s in and writes `assets/images/poster.webp` at the
 *   video's exact dimensions so the poster never causes layout shift.
 *
 * Idempotent: outputs newer than the source are skipped. Pass `--force` to
 * regenerate. Requires `ffmpeg`/`ffprobe` on PATH.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const theme = path.join(root, "wp-content/themes/castleford-food-pantry");
const SRC = path.join(root, "website-videos/castleford-food-pantry-video.mp4");
const OUT_VIDEO = path.join(theme, "assets/video/castleford-food-pantry-video.mp4");
const OUT_POSTER = path.join(theme, "assets/images/poster.webp");
const force = process.argv.includes("--force");

const fresh = (out) => existsSync(out) && statSync(out).mtimeMs >= statSync(SRC).mtimeMs;
const kb = (f) => `${(statSync(f).size / 1024).toFixed(0)} KB`;

function hasTool(name) {
  try {
    execFileSync(name, ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Display size, accounting for rotation metadata. */
function probe(file) {
  const out = JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=width,height:stream_side_data=rotation", "-of", "json", file],
      { encoding: "utf8" },
    ),
  );
  const s = out.streams[0];
  const rot = Math.abs(Number(s.side_data_list?.find((d) => "rotation" in d)?.rotation ?? 0));
  return rot % 180 === 90 ? { width: s.height, height: s.width } : { width: s.width, height: s.height };
}

async function main() {
  if (!existsSync(SRC)) throw new Error(`Source video not found: ${SRC}`);
  mkdirSync(path.dirname(OUT_VIDEO), { recursive: true });
  mkdirSync(path.dirname(OUT_POSTER), { recursive: true });

  if (!hasTool("ffmpeg") || !hasTool("ffprobe")) {
    console.warn("[assets:poster] ffmpeg not found; copying original video, poster NOT generated.");
    if (force || !fresh(OUT_VIDEO)) copyFileSync(SRC, OUT_VIDEO);
    process.exitCode = 1;
    return;
  }

  if (force || !fresh(OUT_VIDEO)) {
    // ffmpeg autorotates, baking the rotation into pixels; -an mutes; faststart for streaming.
    execFileSync("ffmpeg", ["-y", "-v", "error", "-i", SRC, "-an", "-c:v", "libx264",
      "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      "-metadata:s:v", "rotate=0", OUT_VIDEO]);
    console.log(`[assets:poster] video -> ${path.relative(root, OUT_VIDEO)} (${kb(OUT_VIDEO)}, source ${kb(SRC)})`);
  } else {
    console.log("[assets:poster] video up to date");
  }

  if (force || !fresh(OUT_POSTER) || statSync(OUT_POSTER).mtimeMs < statSync(OUT_VIDEO).mtimeMs) {
    const tmp = mkdtempSync(path.join(tmpdir(), "poster-"));
    try {
      const frame = path.join(tmp, "frame.png");
      execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", "1", "-i", OUT_VIDEO, "-frames:v", "1", frame]);
      await sharp(frame).webp({ quality: 80 }).toFile(OUT_POSTER);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
    console.log(`[assets:poster] poster -> ${path.relative(root, OUT_POSTER)} (${kb(OUT_POSTER)})`);
  } else {
    console.log("[assets:poster] poster up to date");
  }

  const v = probe(OUT_VIDEO);
  const p = await sharp(OUT_POSTER).metadata();
  if (p.width !== v.width || p.height !== v.height) {
    throw new Error(`Poster ${p.width}x${p.height} != video ${v.width}x${v.height}`);
  }
  console.log(`[assets:poster] dimensions match: ${v.width}x${v.height}`);
}

main().catch((err) => {
  console.error(`[assets:poster] ${err.message}`);
  process.exit(1);
});
