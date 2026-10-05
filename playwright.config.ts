import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for layout, contrast, responsive, and axe-core
 * accessibility properties that require a real layout engine. Points at the
 * local development site.
 *
 * The local site is served over TLS with a development certificate, so HTTPS
 * errors are ignored for the dev base URL.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.{test,spec}.{ts,mts,js,mjs}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "https://castleford-food-pantry.test/",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Narrow-viewport project for responsive/stacking properties (≤782px).
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
