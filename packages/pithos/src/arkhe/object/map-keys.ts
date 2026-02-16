/**
 * Creates a new object with keys transformed by a function.
 *
 * @template T - The type of the input object.
 * @template K - The type of the transformed keys.
 * @param object - The object to iterate over.
 * @param transform - Function to generate new keys: `(value, key, object) => newKey`.
 * @returns A new object with transformed keys and original values.
 * @since 2.0.0
 *
 * @note Does not mutate original. Duplicate transformed keys: last value wins.
 * @note Only enumerable string keys are included (Symbol keys are ignored).
 *
 * @performance O(n) time & space.
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2 };
 *
 * mapKeys(obj, (_, key) => key.toUpperCase());
 * // => { A: 1, B: 2 }
 *
 * mapKeys(obj, (value, key) => `${key}_${value}`);
 * // => { a_1: 1, b_2: 2 }
 *
 * // snake_case to camelCase
 * mapKeys({ first_name: 'John' }, (_, key) =>
 *   key.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
 * );
 * // => { firstName: 'John' }
 * ```
 */
export function mapKeys<
  // INTENTIONAL: any for values; type inference preserved via generics T and K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>,
  K extends PropertyKey
>(
  object: T,
  transform: (value: T[keyof T], key: keyof T, object: T) => K
): Record<K, T[keyof T]> {
  const result = {} as Record<K, T[keyof T]>;
  const keys = Object.keys(object) as Array<keyof T>;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    result[transform(value, key, object)] = value;
  }

  return result;
}
