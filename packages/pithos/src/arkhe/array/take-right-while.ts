/**
 * Creates a slice of array with elements taken from the end while predicate returns truthy.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @param predicate - The function invoked per iteration.
 * @returns A new array of taken elements.
 * @since 1.1.0
 *
 * @performance O(n) time, stops at first falsy predicate result from end.
 *
 * @example
 * ```typescript
 * const users = [
 *   { user: 'barney', active: false },
 *   { user: 'fred', active: true },
 *   { user: 'pebbles', active: true }
 * ];
 *
 * takeRightWhile(users, u => u.active);
 * // => [{ user: 'fred', active: true }, { user: 'pebbles', active: true }]
 *
 * takeRightWhile([1, 2, 3, 4, 5], n => n > 3);
 * // => [4, 5]
 * ```
 */
export function takeRightWhile<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): T[] {
  let endIndex = array.length;

  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i], i, array)) {
      break;
    }
    endIndex = i;
  }

  return array.slice(endIndex);
}
