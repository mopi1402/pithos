/**
 * Creates an array of unique values that is the symmetric difference of the given arrays.
 *
 * @template T - The type of elements in the arrays.
 * @param arrays - The arrays to inspect.
 * @returns A new array of filtered values.
 * @since 1.1.0
 *
 * @note Returns values from all arrays that appear in exactly one array.
 *
 * @performance O(n) — uses Map for counting occurrences across arrays.
 *
 * @example
 * ```typescript
 * xor([[2, 1], [2, 3]]);
 * // => [1, 3]
 *
 * xor([[1, 2, 3], [3, 4, 5], [5, 6]]);
 * // => [1, 2, 4, 6]
 * ```
 */
export function xor<T>(arrays: readonly (readonly T[])[]): T[] {
  // Stryker disable next-line EqualityOperator,ConditionalExpression: Early return optimization - empty arrays loop produces identical empty result
  if (arrays.length === 0) return [];

  const countMap = new Map<T, number>();
  // Stryker disable next-line ArrayDeclaration: Initial value filtered out by final filter (not in countMap)
  const firstOccurrence: T[] = [];

  for (const array of arrays) {
    const seenInThisArray = new Set<T>();

    for (const item of array) {
      if (!seenInThisArray.has(item)) {
        seenInThisArray.add(item);
        const count = countMap.get(item) ?? 0;
        // Stryker disable next-line ConditionalExpression: Duplicates in firstOccurrence filtered out by final countMap.get(item) === 1
        if (count === 0) {
          firstOccurrence.push(item);
        }
        countMap.set(item, count + 1);
      }
    }
  }

  return firstOccurrence.filter((item) => countMap.get(item) === 1);
}
