/**
 * Creates an array of key-value pairs from an object.
 *
 * @template T - The type of the object.
 * @param object - The object to convert to pairs.
 * @returns An array of key-value pairs.
 * @deprecated Use `Object.entries()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries | Object.entries() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_entries | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 *
 * // ❌ Deprecated approach
 * const pairs = toPairs(obj);
 * console.log(pairs); // [['a', 1], ['b', 2], ['c', 3]]
 *
 * // ✅ Recommended approach
 * const nativePairs = Object.entries(obj);
 * console.log(nativePairs); // [['a', 1], ['b', 2], ['c', 3]]
 * ```
 */

export function toPairs<T extends Record<string, unknown>>(
  object: T
): Array<[keyof T, T[keyof T]]>;
export function toPairs(object: null | undefined): [];
export function toPairs(object: unknown): Array<[string, unknown]>;
// INTENTIONAL: Implementation uses `unknown` with null check - public API is type-safe via overloads
export function toPairs(object: unknown): Array<[string, unknown]> {
  if (object == null) return [];
  return Object.entries(object as Record<string, unknown>);
}