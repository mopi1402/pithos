/**
 * Checks if a value is an object (excluding null and arrays).
 *
 * @param value - The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 * @since 1.0.0
 *
 * @note Excludes `null` and arrays. Includes plain objects, class instances, Map, Set, Date, etc.
 *
 * @see isPlainObject
 *
 * @example
 * ```typescript
 * isObject({});           // => true
 * isObject({ a: 1 });     // => true
 * isObject(new Map());    // => true
 * isObject(new Date());   // => true
 * isObject([]);           // => false
 * isObject(null);         // => false
 * isObject('string');     // => false
 * ```
 */
// INTENTIONAL: any required for generic object typing; value is validated at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
