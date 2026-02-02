//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-31
/**
 * Creates an array of unique values from all given arrays using SameValueZero for equality.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - The arrays to combine.
 * @returns A new array with unique elements.
 * @since 1.1.0
 *
 * @note First occurrence wins when duplicates are found.
 *
 * @performance O(n) — uses Set for constant-time lookups.
 *
 * @example
 * ```typescript
 * union([[1, 2], [2, 3], [3, 4]]);
 * // => [1, 2, 3, 4]
 *
 * union([['a', 'b'], ['b', 'c']]);
 * // => ['a', 'b', 'c']
 * ```
 */
export function union<T>(arrays: readonly (readonly T[])[]): T[] {
  // Stryker disable next-line ConditionalExpression: equivalent mutant, loop on empty arrays returns []
  if (arrays.length === 0) return [];

  const result: T[] = [];
  const seen = new Set<T>();

  for (const array of arrays) {
    for (const item of array) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
  }

  return result;
}
