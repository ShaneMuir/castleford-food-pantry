// Quick axe-core scan of key templates at desktop + mobile widths.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const base = "https://castleford-food-pantry.test";
const pages = ["/", "/nope-nothing/", "/?s=food"];
const b = await chromium.launch();
let total = 0;
for (const [name, w] of [["desktop", 1440], ["mobile", 390]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, ignoreHTTPSErrors: true });
  for (const path of pages) {
    const p = await ctx.newPage();
    await p.goto(base + path, { waitUntil: "networkidle" });
    const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of r.violations) {
      total++;
      console.log(`[${name}] ${path} ${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}\n   e.g. ${v.nodes[0].target.join(" ")}`);
    }
    await p.close();
  }
}
console.log("axe violations:", total);
await b.close();
