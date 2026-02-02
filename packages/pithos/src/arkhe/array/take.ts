/**
 * Creates a slice of array with n elements taken from the beginning.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @param count - The number of elements to take.
 * @returns A new array with the first `count` elements.
 * @throws {RangeError} If count is negative.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * take(numbers, 3);
 * // => [1, 2, 3]
 *
 * take(numbers, 0);
 * // => []
 *
 * take(numbers, 10);
 * // => [1, 2, 3, 4, 5]
 * ```
 */
export function take<T>(array: readonly T[], count: number): T[] {
  if (count < 0) {
    // Stryker disable next-line StringLiteral: error message content is not critical
    throw new RangeError("count must be non-negative");
  }
  // Stryker disable next-line ConditionalExpression: Early return optimization - slice(0, 0) produces identical empty array
  if (count === 0) return [];
  return array.slice(0, count);
}
