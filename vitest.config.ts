import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the Castleford Community Food Pantry test layer.
 *
 * Property-based tests (fast-check) and unit tests run under jsdom so the pure
 * analyzer helpers in `tools/analyzers/` and DOM-parsing properties can execute
 * in-memory. Layout/contrast properties that need a real layout engine run
 * under Playwright instead (see playwright.config.ts) and are excluded here.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "tools/**/*.{test,spec}.{ts,mts,js,mjs}",
      "tests/**/*.{test,spec}.{ts,mts,js,mjs}",
    ],
    exclude: [
      "node_modules/**",
      "wp-content/**",
      "wp-admin/**",
      "wp-includes/**",
      "tests/e2e/**",
    ],
    // Each property-based test runs a minimum of 100 generated cases; give
    // generators room without hanging CI.
    testTimeout: 20000,
  },
});
