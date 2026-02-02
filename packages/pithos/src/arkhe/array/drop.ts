//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-30
/**
 * Creates a slice of array with n elements dropped from the beginning.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @param count - The number of elements to drop.
 * @returns A new array with the first `count` elements removed.
 * @throws {RangeError} If count is negative.
 * @since 1.1.0
 *
 * @performance O(n) time & space, single slice operation.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * drop(numbers, 2);
 * // => [3, 4, 5]
 *
 * drop(numbers, 0);
 * // => [1, 2, 3, 4, 5]
 * ```
 */
export function drop<T>(array: readonly T[], count: number): T[] {
  if (count < 0) {
    // Stryker disable next-line StringLiteral: error message content is not critical
    throw new RangeError("count must be non-negative");
  }
  return array.slice(count);
}
