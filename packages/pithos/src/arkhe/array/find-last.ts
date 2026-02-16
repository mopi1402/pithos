/**
 * Iterates over elements from right to left, returning the first element predicate returns truthy for.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to inspect.
 * @param predicate - The function invoked per iteration.
 * @returns The matched element, or `undefined` if not found.
 * @since 2.0.0
 *
 * @note This is a polyfill for Array.prototype.findLast (ES2023).
 *
 * @performance O(n) time, stops at first match from the end.
 *
 * @example
 * ```typescript
 * const users = [
 *   { user: 'barney', active: true },
 *   { user: 'fred', active: false },
 *   { user: 'pebbles', active: true }
 * ];
 *
 * findLast(users, u => u.active);
 * // => { user: 'pebbles', active: true }
 *
 * findLast([1, 2, 3, 4, 5], n => n % 2 === 0);
 * // => 4
 * ```
 */
export function findLast<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
}
