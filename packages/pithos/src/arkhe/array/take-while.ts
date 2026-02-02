//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-31
/**
 * Creates a slice of array with elements taken from the beginning while predicate returns truthy.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @param predicate - The function invoked per iteration.
 * @returns A new array of taken elements.
 * @since 1.1.0
 *
 * @performance O(n) time, stops at first falsy predicate result.
 *
 * @example
 * ```typescript
 * const users = [
 *   { user: 'barney', active: true },
 *   { user: 'fred', active: true },
 *   { user: 'pebbles', active: false }
 * ];
 *
 * takeWhile(users, u => u.active);
 * // => [{ user: 'barney', active: true }, { user: 'fred', active: true }]
 *
 * takeWhile([1, 2, 3, 4, 5], n => n < 3);
 * // => [1, 2]
 * ```
 */
export function takeWhile<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): T[] {
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i], i, array)) {
      break;
    }
    result.push(array[i]);
  }

  return result;
}
