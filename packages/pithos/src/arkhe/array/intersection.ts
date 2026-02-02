//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Computes the intersection of multiple arrays.
 *
 * This function takes multiple arrays and returns a new array containing
 * only the elements that are present in all input arrays.
 *
 * @template T - The type of the elements in the input arrays.
 * @param arrays - Arrays of type T to compute the intersection from.
 * @returns A new array containing the common elements found in all input arrays.
 * @since 1.1.0
 *
 * @performance O(n × m) time & space where n = first array length, m = number of arrays. Uses Set for constant-time lookups.
 *
 * @example
 * ```typescript
 * intersection([1, 2, 3], [2, 3, 4], [3, 4, 5]);
 * // => [3]
 *
 * intersection(['a', 'b'], ['b', 'c'], ['b', 'd']);
 * // => ['b']
 * ```
 */
export function intersection<T>(...arrays: readonly (readonly T[])[]): T[] {
  if (arrays.length === 0) return [];

  const [first, ...rest] = arrays;
  // Stryker disable next-line ConditionalExpression: equivalent mutant, filter on empty array returns []
  if (first.length === 0) return [];

  const sets = rest.map((arr) => new Set(arr));

  return [
    ...new Set(first.filter((item) => sets.every((set) => set.has(item)))),
  ];
}
