/**
 * Creates an object composed of properties that predicate doesn't return truthy for.
 *
 * @template T - The type of the object.
 * @param object - The source object.
 * @param predicate - The function invoked per property.
 * @returns A new object with filtered properties.
 * @since 1.1.0
 *
 * @performance O(n) where n is the number of own enumerable properties.
 *
 * @see pickBy
 *
 * @example
 * ```typescript
 * const object = { a: 1, b: '2', c: 3 };
 *
 * omitBy(object, value => typeof value === 'number');
 * // => { b: '2' }
 *
 * // Remove null/undefined values
 * omitBy({ a: 1, b: null, c: undefined, d: 4 }, v => v == null);
 * // => { a: 1, d: 4 }
 *
 * // Remove empty strings
 * omitBy({ name: 'John', email: '', phone: '123' }, v => v === '');
 * // => { name: 'John', phone: '123' }
 * ```
 */
export function omitBy<T extends Record<string, unknown>>(
  object: T,
  predicate: (value: T[keyof T], key: string) => boolean
): Partial<T> {
  const result = {} as Partial<T>;

  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      !predicate(object[key] as T[keyof T], key)
    ) {
      result[key as keyof T] = object[key] as T[keyof T];
    }
  }

  return result;
}
