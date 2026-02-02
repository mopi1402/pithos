//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Creates an array of values from the first array that are not included in the second array.
 *
 * @template T - The type of elements in the arrays.
 * @param array - The source array to inspect.
 * @param values - The array of values to exclude.
 * @returns A new array of filtered values.
 * @since 1.1.0
 *
 * @note Uses strict equality (===). Preserves duplicates from the source array.
 *
 * @performance O(n + m) — uses Set for constant-time lookups.
 *
 * @example
 * ```typescript
 * difference([1, 2, 3, 4, 5], [2, 4]);
 * // => [1, 3, 5]
 *
 * difference([1, 1, 2, 2, 3], [2]);
 * // => [1, 1, 3]
 * ```
 */
export function difference<T>(array: readonly T[], values: readonly T[]): T[] {
  const excludeSet = new Set(values);
  return array.filter((item) => !excludeSet.has(item));
}
