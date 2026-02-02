/**
 * Removes elements from array at specified indexes and returns removed elements.
 *
 * @note **Mutates** the array in place.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to modify.
 * @param indexes - The indexes of elements to remove.
 * @returns An array of removed elements.
 * @deprecated Use `.filter()` with index check for immutable operations.
 * Reason: Pithos design philosophy always favors immutability.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach (mutates array)
 * const array = ['a', 'b', 'c', 'd'];
 * const pulled = pullAt(array, [1, 3]);
 * console.log(pulled); // ['b', 'd']
 * console.log(array);  // ['a', 'c']
 *
 * // ✅ Recommended approach (immutable)
 * const array = ['a', 'b', 'c', 'd'];
 * const indexesToRemove = new Set([1, 3]);
 * const remaining = array.filter((_, i) => !indexesToRemove.has(i));
 * const pulled = array.filter((_, i) => indexesToRemove.has(i));
 * console.log(pulled);    // ['b', 'd']
 * console.log(remaining); // ['a', 'c']
 * console.log(array);     // ['a', 'b', 'c', 'd'] (unchanged)
 * ```
 */
export function pullAt<T>(array: T[], indexes: number[]): T[] {
  const indexSet = new Set(indexes);
  const pulled: T[] = [];

  for (const index of indexes) {
    if (index >= 0 && index < array.length) {
      pulled.push(array[index]);
    }
  }

  let writeIndex = 0;
  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    if (!indexSet.has(readIndex)) {
      array[writeIndex++] = array[readIndex];
    }
  }
  array.length = writeIndex;

  return pulled;
}
