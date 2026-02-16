/**
 * Creates an array of the own enumerable property names of an object.
 *
 * @template T - The type of the object.
 * @param object - The object to query.
 * @returns An array of property names.
 * @deprecated Use `Object.keys()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys | Object.keys() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_keys | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * // ❌ Deprecated approach
 * const objKeys = keys(obj);
 * console.log(objKeys); // ['a', 'b', 'c']
 *
 * // ✅ Recommended approach
 * const nativeKeys = Object.keys(obj);
 * console.log(nativeKeys); // ['a', 'b', 'c']
 * ```
 */

export function keys<T extends object>(object: T): (keyof T)[];
export function keys(object: null | undefined): [];
export function keys(object: unknown): string[];
// INTENTIONAL: Implementation uses `unknown` with null check - public API is type-safe via overloads
export function keys(object: unknown): string[] {
  if (object == null) return [];
  return Object.keys(object as object);
}