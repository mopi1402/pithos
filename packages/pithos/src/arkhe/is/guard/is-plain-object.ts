/**
 * Checks if a value is a plain object (object literal or `Object.create(null)`).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a plain object, `false` otherwise.
 * @since 1.0.0
 *
 * @note Excludes arrays, Date, Map, Set, class instances, etc. Only `{}`, `new Object()`, and `Object.create(null)`.
 *
 * @see isObject
 *
 * @example
 * ```typescript
 * isPlainObject({});                    // => true
 * isPlainObject({ a: 1 });              // => true
 * isPlainObject(new Object());          // => true
 * isPlainObject(Object.create(null));   // => true
 * isPlainObject([]);                    // => false
 * isPlainObject(new Date());            // => false
 * isPlainObject(new Map());             // => false
 * isPlainObject(new (class Foo {})());  // => false
 * isPlainObject(null);                  // => false
 * ```
 */
// INTENTIONAL: any required for generic object typing; value is validated at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPlainObject = (value: unknown): value is Record<string, any> => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
};
