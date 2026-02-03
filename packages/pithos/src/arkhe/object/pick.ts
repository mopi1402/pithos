/**
 * Creates a new object with only the specified keys.
 *
 * @template T - The type of the input object.
 * @template K - The type of the keys to pick.
 * @param object - The object to pick keys from.
 * @param keys - Array of keys to pick.
 * @returns A new object with only the specified keys.
 * @since 1.1.0
 *
 * @note Non-existent keys are ignored.
 *
 * @performance O(k) time & space where k is number of keys to pick. Uses for-of loop and hasOwnProperty check.
 *
 * @see omit
 * @see pickBy
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * pick(obj, ['a', 'c']); // => { a: 1, c: 3 }
 * pick(obj, ['b']);      // => { b: 2 }
 *
 * const user = { id: 1, name: 'John', password: 'secret' };
 * pick(user, ['id', 'name']); // => { id: 1, name: 'John' }
 * ```
 */
export function pick<
  // INTENTIONAL: any for values; type inference preserved via generics T and K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>,
  K extends keyof T
>(object: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
  }

  return result;
}
