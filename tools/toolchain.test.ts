import { describe, it, expect } from "vitest";
import fc from "fast-check";

/**
 * Toolchain sanity check for task 1.2.
 *
 * Confirms the Vitest + jsdom + fast-check layer is wired and runnable. Real
 * unit and property tests for the theme are added by later tasks; this file
 * only verifies the tooling itself and can be removed once those land.
 */
describe("toolchain", () => {
  it("runs under the jsdom environment", () => {
    expect(typeof document).toBe("object");
    expect(typeof window).toBe("object");
  });

  it("has fast-check available for property-based tests", () => {
    // Minimal property to confirm fast-check executes (addition commutes).
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => a + b === b + a),
      { numRuns: 100 },
    );
  });
});
