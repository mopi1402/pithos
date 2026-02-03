/**
 * Generates a random number within the specified range.
 *
 * @param min - Minimum bound (inclusive). If `max` omitted, becomes max with min defaulting to 0.
 * @param max - Maximum bound (exclusive).
 * @returns A random number in range [min, max).
 * @since 1.1.0
 *
 * @note Returns `min` if min === max. Swaps bounds automatically if min > max.
 * @note Impure function (uses Math.random()).
 *
 * @performance O(1)
 *
 * @example
 * ```typescript
 * random(0, 10); // => 7.234... (random in [0, 10))
 * random(10);    // => 3.456... (random in [0, 10))
 * random(5, 5);  // => 5 (min equals max)
 * random(10, 5); // => 7.123... (bounds swapped)
 * ```
 */
/** @internal */
export function random(min: number, max: number): number;
/** @internal */
export function random(max: number): number;
export function random(min: number, max?: number): number {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (min === max) {
    return min;
  }

  // Stryker disable next-line all: equivalent mutant, Math.random()*(max-min)+min produces same result with swapped bounds
  if (min > max) {
    [min, max] = [max, min];
  }

  return Math.random() * (max - min) + min;
}
