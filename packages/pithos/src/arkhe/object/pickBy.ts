/**
 * Creates a new object with properties that satisfy the predicate.
 *
 * @template T - The type of the input object.
 * @param object - The object to pick properties from.
 * @param predicate - Function to test each property: `(value, key, object) => boolean`.
 * @returns A new object with only the properties that pass the predicate.
 * @since 2.0.0
 *
 * @note Only enumerable string keys are included (Symbol keys are ignored).
 *
 * @performance O(n) time & space where n is number of properties.
 *
 * @see pick
 * @see omit
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 'hello', c: 3, d: null };
 *
 * // Pick by value type
 * pickBy(obj, (v) => typeof v === 'string');
 * // => { b: 'hello' }
 *
 * // Pick by key pattern
 * pickBy(obj, (_, key) => String(key).startsWith('a'));
 * // => { a: 1 }
 *
 * // Pick non-null values
 * pickBy(obj, (v) => v != null);
 * // => { a: 1, b: 'hello', c: 3 }
 * ```
 */
export function pickBy<
  // INTENTIONAL: any for values; type inference preserved via generic T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<PropertyKey, any>
>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T, object: T) => boolean
): Partial<T> {
  const result: Partial<T> = {};
  const keys = Object.keys(object) as Array<keyof T>;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = object[key];
    if (predicate(value, key, object)) {
      result[key] = value;
    }
  }

  return result;
}
