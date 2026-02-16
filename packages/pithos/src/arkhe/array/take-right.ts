/**
 * Creates a slice of array with n elements taken from the end.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @param count - The number of elements to take.
 * @returns A new array with the last `count` elements.
 * @throws {RangeError} If count is negative.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * takeRight(numbers, 3);
 * // => [3, 4, 5]
 *
 * takeRight(numbers, 0);
 * // => []
 * ```
 */
export function takeRight<T>(array: readonly T[], count: number): T[] {
  if (count < 0) {
    // Stryker disable next-line StringLiteral: error message content is not critical
    throw new RangeError("count must be non-negative");
  }
  if (count === 0) return [];
  return array.slice(-count);
}