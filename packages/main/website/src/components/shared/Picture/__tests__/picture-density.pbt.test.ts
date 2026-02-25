// Feature: image-optimization-strategy, Property 2b: Calcul adaptatif des densités
// **Validates: Requirements 1.5, 1.7**

import { test } from '@fast-check/vitest';
import { describe, expect } from 'vitest';
import fc from 'fast-check';
import { computeDensities } from '../picture-utils';

describe('Property 2b: Adaptive density calculation', () => {
  test.prop(
    [
      fc.integer({ min: 1, max: 2000 }),
      fc.integer({ min: 1, max: 5000 }),
    ],
    { numRuns: 100 },
  )(
    'auto densities are [1,2,3] when sourceWidth >= displaySize×2, else [1,2]',
    (displaySize, sourceWidth) => {
      const densities = computeDensities(displaySize, sourceWidth);

      if (sourceWidth >= displaySize * 2) {
        expect(densities).toEqual([1, 2, 3]);
      } else {
        expect(densities).toEqual([1, 2]);
      }
    },
  );

  test.prop(
    [
      fc.integer({ min: 1, max: 2000 }),
      fc.integer({ min: 1, max: 5000 }),
      fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 1, maxLength: 5 }),
    ],
    { numRuns: 100 },
  )(
    'explicit densities are respected as-is regardless of sourceWidth',
    (displaySize, sourceWidth, explicitDensities) => {
      const densities = computeDensities(displaySize, sourceWidth, explicitDensities);

      expect(densities).toEqual(explicitDensities);
    },
  );

  test.prop(
    [fc.integer({ min: 1, max: 2000 })],
    { numRuns: 100 },
  )(
    'fallback densities are [1,2] when sourceWidth is absent',
    (displaySize) => {
      const densities = computeDensities(displaySize);

      expect(densities).toEqual([1, 2]);
    },
  );
});
