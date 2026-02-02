/**
 * Removes all given values from array using SameValueZero for equality comparisons.
 *
 * @note **Mutates** the array in place.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to modify.
 * @param values - The values to remove.
 * @returns The mutated array.
 * @deprecated Use `difference` instead.
 * Reason: Pithos design philosophy always favors immutability.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const array = [1, 2, 3, 1, 2, 3];
 * pull(array, 2, 3);
 * console.log(array); // [1, 1]
 * ```
 */
export function pull<T>(array: T[], ...values: T[]): T[] {
  const excludeSet = new Set(values);
  let w = 0;
  for (let r = 0; r < array.length; r++) {
    const item = array[r];
    if (!excludeSet.has(item)) {
      array[w++] = item;
    }
  }
  array.length = w;
  return array;
}