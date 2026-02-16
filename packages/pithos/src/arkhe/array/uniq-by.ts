/**
 * Creates a duplicate-free version of an array using an iteratee for comparison.
 *
 * @template T - The type of elements in the array.
 * @template Key - The type of the comparison key.
 * @param array - The array to inspect.
 * @param iteratee - A function that produces the key for each element.
 * @returns A new array with unique elements based on the iteratee key.
 * @since 2.0.0
 *
 * @note First occurrence wins when duplicates are found.
 *
 * @performance O(n) — uses Set for constant-time lookups.
 *
 * @example
 * ```typescript
 * uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * uniqBy(
 *   [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }],
 *   item => item.id
 * );
 * // => [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 * ```
 */
export function uniqBy<T, Key>(
  array: readonly T[],
  iteratee: (item: T) => Key
): T[] {
  const result: T[] = [];
  const seen = new Set<Key>();

  for (const item of array) {
    const key = iteratee(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
