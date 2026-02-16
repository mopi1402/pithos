/**
 * Creates a function that returns the value at the given key of object.
 *
 * @template T - The type of the object.
 * @param object - The object to query.
 * @returns A function that returns the property value for a given key.
 * @deprecated Use an inline arrow function `(key) => obj[key]` instead.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const getValue = propertyOf({ a: 1, b: 2 });
 * getValue('a');  // => 1
 * getValue('b');  // => 2
 *
 * // ✅ Recommended approach
 * const obj = { a: 1, b: 2 };
 * const getValue = (key: 'a' | 'b') => obj[key];
 * getValue('a');  // => 1
 * getValue('b');  // => 2
 * ```
 */
export function propertyOf<T extends object>(
  object: T
): <Key extends keyof T>(key: Key) => T[Key] {
  return <Key extends keyof T>(key: Key) => object[key];
}
