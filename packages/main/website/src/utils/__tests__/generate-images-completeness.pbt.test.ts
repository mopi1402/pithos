// Feature: image-optimization-strategy, Property 12: Complétude de la génération
// **Validates: Requirements 9.3**

import { test } from "@fast-check/vitest";
import { describe, expect } from "vitest";
import fc from "fast-check";
import {
  filterWidthsForGeneration,
  countExpectedVariants,
} from "../image-generation-utils";

const formatArb = fc.constantFrom("avif", "webp", "png");

describe("Property 12: Generation completeness", () => {
  test.prop(
    [
      fc.integer({ min: 50, max: 5000 }),
      fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 1, maxLength: 10 }),
      fc.array(formatArb, { minLength: 1, maxLength: 4 }).map((arr) => [...new Set(arr)]),
    ],
    { numRuns: 100 },
  )(
    "variant count equals |valid_widths| × |formats|",
    (sourceWidth, requestedWidths, formats) => {
      const validWidths = filterWidthsForGeneration(requestedWidths, sourceWidth);
      const expected = countExpectedVariants(validWidths, formats);

      expect(expected).toBe(validWidths.length * formats.length);
    },
  );

  test.prop(
    [
      fc.integer({ min: 50, max: 5000 }),
      fc.array(fc.integer({ min: 1, max: 10000 }), { minLength: 1, maxLength: 10 }),
      fc.array(formatArb, { minLength: 1, maxLength: 4 }).map((arr) => [...new Set(arr)]),
    ],
    { numRuns: 100 },
  )(
    "variant count is always > 0 for non-empty formats",
    (sourceWidth, requestedWidths, formats) => {
      const validWidths = filterWidthsForGeneration(requestedWidths, sourceWidth);
      const count = countExpectedVariants(validWidths, formats);

      expect(count).toBeGreaterThan(0);
    },
  );
});
