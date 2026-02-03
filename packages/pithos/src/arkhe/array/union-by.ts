/**
 * Creates an array of unique values from multiple arrays, using an iteratee for comparison.
 *
 * @template T - The type of elements in the arrays.
 * @template Key - The type of the comparison key.
 * @param arrays - An array of arrays to combine.
 * @param iteratee - A function that produces the key for each element.
 * @returns A new array with unique elements based on the iteratee key.
 * @since 1.1.0
 *
 * @note First occurrence wins when duplicates are found.
 *
 * @performance O(n) where n = total elements across all arrays — Set provides O(1) lookups.
 *
 * @example
 * ```typescript
 * unionBy(
 *   [[{ id: 1 }, { id: 2 }], [{ id: 1 }, { id: 3 }]],
 *   (item) => item.id
 * );
 * // => [{ id: 1 }, { id: 2 }, { id: 3 }]
 *
 * unionBy([[1.1, 2.5], [2.2, 3.1]], Math.floor);
 * // => [1.1, 2.5, 3.1]
 * ```
 */
export function unionBy<T, Key>(
  arrays: readonly (readonly T[])[],
  iteratee: (item: T) => Key
): T[] {
  // Stryker disable next-line ConditionalExpression: equivalent mutant, loop on empty arrays returns []
  if (arrays.length === 0) return [];

  const result: T[] = [];
  const seen = new Set<Key>();

  for (const array of arrays) {
    for (const item of array) {
      const key = iteratee(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
  }

  return result;
}
