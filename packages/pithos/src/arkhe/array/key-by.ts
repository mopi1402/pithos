/**
 * Creates an object composed of keys generated from the results of running each element through iteratee.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key returned by the iteratee.
 * @param array - The array to iterate over.
 * @param iteratee - A function that returns the key for each element.
 * @returns An object with keys mapping to elements.
 * @since 1.1.0
 *
 * @note In case of duplicate keys, the last value wins.
 *
 * @performance O(n) time & space.
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 3, name: 'Bob' }
 * ];
 *
 * keyBy(users, (u) => u.id);
 * // => { 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' }, 3: { id: 3, name: 'Bob' } }
 *
 * keyBy(['apple', 'banana', 'cherry'], (s) => s[0]);
 * // => { a: 'apple', b: 'banana', c: 'cherry' }
 * ```
 */
export function keyBy<T, K extends PropertyKey>(
  array: readonly T[],
  iteratee: (value: T) => K
): Partial<Record<K, T>> {
  const result: Partial<Record<K, T>> = {};
  for (let i = 0; i < array.length; i++) {
    result[iteratee(array[i])] = array[i];
  }
  return result;
}
