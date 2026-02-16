/**
 * Removes all elements from array that predicate returns truthy for.
 *
 * @note **Mutates** the array in place.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to modify.
 * @param predicate - The function invoked per iteration.
 * @returns An array of removed elements.
 * @deprecated Use `.filter()` for immutable operations.
 * Reason: Pithos design philosophy always favors immutability.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach (mutates array)
 * const array = [1, 2, 3, 4];
 * const evens = remove(array, n => n % 2 === 0);
 * console.log(evens); // [2, 4]
 * console.log(array); // [1, 3]
 *
 * // ✅ Recommended approach (immutable)
 * const array = [1, 2, 3, 4];
 * const evens = array.filter(n => n % 2 === 0);
 * const odds = array.filter(n => n % 2 !== 0);
 * console.log(evens); // [2, 4]
 * console.log(odds);  // [1, 3]
 * console.log(array); // [1, 2, 3, 4] (unchanged)
 * ```
 */
export function remove<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T[] {
  const removed: T[] = [];
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    const value = array[readIndex];
    if (predicate(value, readIndex, array)) {
      removed.push(value);
    } else {
      array[writeIndex++] = value;
    }
  }

  array.length = writeIndex;
  return removed;
}
