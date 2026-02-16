/**
 * Creates an object with the same keys as object, with values transformed by iteratee.
 *
 * @template T - The type of the source object.
 * @template R - The type of the transformed values.
 * @param object - The object to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns A new object with transformed values.
 * @since 2.0.0
 *
 * @performance O(n) where n is the number of own enumerable properties.
 *
 * @example
 * ```typescript
 * const users = {
 *   fred: { age: 40 },
 *   pebbles: { age: 1 }
 * };
 *
 * mapValues(users, u => u.age);
 * // => { fred: 40, pebbles: 1 }
 *
 * mapValues({ a: 1, b: 2, c: 3 }, n => n * 2);
 * // => { a: 2, b: 4, c: 6 }
 *
 * mapValues({ x: 'hello', y: 'world' }, s => s.toUpperCase());
 * // => { x: 'HELLO', y: 'WORLD' }
 * ```
 */
export function mapValues<T extends Record<string, unknown>, R>(
  object: T,
  iteratee: (value: T[keyof T], key: string, object: T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key as keyof T] = iteratee(object[key] as T[keyof T], key, object);
    }
  }

  return result;
}
