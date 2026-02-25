// Feature: image-optimization-strategy, Property 3: Invariant d'anti-upscaling (script de génération)
// **Validates: Requirements 2.1, 2.2, 9.1**

import { test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import fc from "fast-check";
import { filterWidthsForGeneration } from "../image-generation-utils";

describe("Property 3: Anti-upscaling invariant (generation script)", () => {
  test.prop(
    [
      fc.integer({ min: 50, max: 5000 }),
      fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 1, maxLength: 10 }),
    ],
    { numRuns: 100 },
  )(
    "no generated variant has width > sourceWidth",
    (sourceWidth, requestedWidths) => {
      const result = filterWidthsForGeneration(requestedWidths, sourceWidth);

      for (const w of result) {
        expect(w).toBeLessThanOrEqual(sourceWidth);
      }
    },
  );

  test.prop(
    [
      fc.integer({ min: 50, max: 5000 }),
      fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 1, maxLength: 10 }),
    ],
    { numRuns: 100 },
  )(
    "when all requested widths exceed sourceWidth, exactly one variant at sourceWidth is produced",
    (sourceWidth, requestedWidths) => {
      // Force all widths to exceed sourceWidth
      const allExceeding = requestedWidths.map((w) => sourceWidth + w);
      const result = filterWidthsForGeneration(allExceeding, sourceWidth);

      expect(result).toEqual([sourceWidth]);
    },
  );

  test.prop(
    [
      fc.integer({ min: 50, max: 5000 }),
      fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 1, maxLength: 10 }),
    ],
    { numRuns: 100 },
  )(
    "result is non-empty for any valid input",
    (sourceWidth, requestedWidths) => {
      const result = filterWidthsForGeneration(requestedWidths, sourceWidth);

      expect(result.length).toBeGreaterThanOrEqual(1);
    },
  );
});
