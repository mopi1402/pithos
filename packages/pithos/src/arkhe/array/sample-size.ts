//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-30
/**
 * Gets n random elements from an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to sample from.
 * @param n - The number of elements to sample.
 * @returns A new array of sampled elements.
 * @throws {RangeError} If n is negative.
 * @since 1.1.0
 *
 * @note Uses Fisher-Yates shuffle algorithm for unbiased sampling.
 *
 * @performance O(n) time & space for the shuffled copy.
 *
 * @example
 * ```typescript
 * sampleSize([1, 2, 3, 4, 5], 3);
 * // => [3, 1, 5] (random)
 *
 * sampleSize(['a', 'b', 'c'], 2);
 * // => ['b', 'a'] (random)
 *
 * sampleSize([1, 2, 3], 5);
 * // => [2, 3, 1] (returns all if n > length)
 * ```
 */
export function sampleSize<T>(array: readonly T[], n: number): T[] {
  if (n < 0) {
    throw new RangeError("n must be non-negative");
  }

  const length = array.length;
  // Stryker disable next-line ConditionalExpression,LogicalOperator: Early return optimization - fallback (count=0, loop 0 times) produces identical result
  if (length === 0 || n === 0) return [];

  const count = Math.min(n, length);
  const copy = [...array];

  // Stryker disable next-line EqualityOperator: i <= count adds one iteration affecting indices not included in slice result
  for (let i = 0; i < count; i++) {
    const randomIndex = i + Math.floor(Math.random() * (length - i));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy.slice(0, count);
}
