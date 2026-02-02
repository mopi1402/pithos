/**
 * Returns the key of the first element predicate returns truthy for.
 *
 * @template T - The type of the object.
 * @param object - The object to inspect.
 * @param predicate - The function invoked per iteration.
 * @returns The key of the matched element, or `undefined` if not found.
 * @since 1.1.0
 *
 * @performance O(n) where n is the number of own enumerable properties.
 *
 * @example
 * ```typescript
 * const users = {
 *   barney: { age: 36, active: true },
 *   fred: { age: 40, active: false },
 *   pebbles: { age: 1, active: true }
 * };
 *
 * findKey(users, u => u.age < 40);
 * // => 'barney' (iteration order is not guaranteed)
 *
 * findKey(users, u => u.active === false);
 * // => 'fred'
 *
 * findKey(users, u => u.age > 100);
 * // => undefined
 * ```
 */
export function findKey<T extends Record<string, unknown>>(
  object: T,
  predicate: (value: T[keyof T], key: string, object: T) => boolean
): string | undefined {
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      predicate(object[key] as T[keyof T], key, object)
    ) {
      return key;
    }
  }
  return undefined;
}
