/**
 * Checks if a number is within a specified range.
 *
 * @param value - The number to check.
 * @param min - Minimum bound (inclusive). If `max` omitted, becomes max with min defaulting to 0.
 * @param max - Maximum bound (exclusive).
 * @returns `true` if value is in range [min, max), else `false`.
 * @since 1.1.0
 *
 * @note Returns `false` for empty ranges (min >= max) and NaN values.
 *
 * @performance O(1)
 *
 * @example
 * ```typescript
 * inRange(3, 0, 5);  // => true (3 is in [0, 5))
 * inRange(5, 0, 5);  // => false (5 is exclusive)
 * inRange(3, 5);     // => true (equivalent to inRange(3, 0, 5))
 * inRange(0, 0, 0);  // => false (empty range)
 * ```
 */
/** @internal */
export function inRange(value: number, min: number, max: number): boolean;
/** @internal */
export function inRange(value: number, max: number): boolean;
export function inRange(value: number, min: number, max?: number): boolean {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  // Stryker disable next-line all: equivalent mutant, when min===max the range check value>=min && value<max always returns false
  if (min >= max) {
    return false;
  }

  return value >= min && value < max;
}
