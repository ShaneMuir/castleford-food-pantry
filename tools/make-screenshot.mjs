// Generates the WordPress theme screenshot (1200x900) from the v2-1 castle-sun
// lockup only, using that logo's own palette (navy, green, gold, cream).
// Usage: node tools/make-screenshot.mjs
import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logo = resolve(root, "website-images/v2-1-castle-sun-glow.svg");
const out = resolve(root, "wp-content/themes/castleford-food-pantry/screenshot.png");

const W = 1200, H = 900;
const FONT = "'Nunito','Poppins','Arial Rounded MT Bold','Helvetica Neue',Arial,sans-serif";

const bg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FFF8EC"/>
  <rect width="${W}" height="24" fill="#2F7D4F"/>
  <rect y="24" width="${W}" height="8" fill="#F5B82E"/>
  <rect y="${H - 150}" width="${W}" height="150" fill="#1F3A5F"/>
  <text x="${W / 2}" y="${H - 84}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="38" fill="#FFF8EC">Reduce waste. Feed people. Build community.</text>
  <text x="${W / 2}" y="${H - 38}" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="22" letter-spacing="5" fill="#F5B82E">SAVING SURPLUS FOOD FROM LANDFILL</text>
</svg>`);

// The SVG viewBox has empty space on the right, so trim transparent padding first,
// then scale, so the visible artwork is truly centred.
const trimmed = await sharp(logo, { density: 400 }).trim().png().toBuffer();
const lockup = await sharp(trimmed).resize({ width: 820 }).png().toBuffer();
const { width: lockupW, height: lockupH } = await sharp(lockup).metadata();

await sharp(bg)
  .composite([{ input: lockup, left: (W - lockupW) / 2, top: Math.round((H - 150 - 32 - lockupH) / 2) + 32 }])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log("wrote", out);
