// Feature: image-optimization-strategy, Property 4: Filtrage d'upscaling côté composant
// **Validates: Requirements 2.4**

import { test } from '@fast-check/vitest';
import { describe, expect } from 'vitest';
import fc from 'fast-check';
import { computeDensities, computeWidths } from '../picture-utils';

describe('Property 4: Component-side upscaling filtering', () => {
  test.prop(
    [
      fc.integer({ min: 1, max: 2000 }),
      fc.integer({ min: 1, max: 5000 }),
    ],
    { numRuns: 100 },
  )(
    'all computed widths in density mode are ≤ sourceWidth',
    (displaySize, sourceWidth) => {
      const densities = computeDensities(displaySize, sourceWidth);
      const widths = computeWidths(displaySize, densities, sourceWidth);

      for (const w of widths) {
        expect(w).toBeLessThanOrEqual(sourceWidth);
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
    'all computed widths with explicit densities are ≤ sourceWidth',
    (displaySize, sourceWidth, explicitDensities) => {
      const widths = computeWidths(displaySize, explicitDensities, sourceWidth);

      for (const w of widths) {
        expect(w).toBeLessThanOrEqual(sourceWidth);
      }
    },
  );

  test.prop(
    [
      fc.integer({ min: 1, max: 2000 }),
      fc.integer({ min: 1, max: 5000 }),
    ],
    { numRuns: 100 },
  )(
    'computed widths are strictly increasing (deduplication)',
    (displaySize, sourceWidth) => {
      const densities = computeDensities(displaySize, sourceWidth);
      const widths = computeWidths(displaySize, densities, sourceWidth);

      for (let i = 1; i < widths.length; i++) {
        expect(widths[i]).toBeGreaterThan(widths[i - 1]!);
      }
    },
  );
});
