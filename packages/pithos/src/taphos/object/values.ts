/**
 * Creates an array of the own enumerable property values of an object.
 *
 * @template T - The type of the object.
 * @param object - The object to query.
 * @returns An array of property values.
 * @deprecated Use `Object.values()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values | Object.values() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_values | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * // ❌ Deprecated approach
 * const objValues = values(obj);
 * console.log(objValues); // [1, 2, 3]
 *
 * // ✅ Recommended approach
 * const nativeValues = Object.values(obj);
 * console.log(nativeValues); // [1, 2, 3]
 * ```
 */

export function values<T extends object>(object: T): T[keyof T][];
export function values(object: null | undefined): [];
export function values(object: unknown): unknown[];
// INTENTIONAL: Implementation uses `unknown` with null check - public API is type-safe via overloads
export function values(object: unknown): unknown[] {
  if (object == null) return [];
  return Object.values(object as object);
}