/**
 * Checks if path is a direct or inherited property of object.
 *
 * @param object - The object to query.
 * @param key - The key to check.
 * @returns `true` if key exists, else `false`.
 * @deprecated Use the `in` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in | in operator - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * hasIn({ a: 1 }, 'a');         // => true
 * hasIn({ a: 1 }, 'toString');  // => true (inherited)
 *
 * // ✅ Recommended approach
 * 'a' in { a: 1 };              // => true
 * 'toString' in { a: 1 };       // => true (inherited)
 * ```
 */
export function hasIn(object: object | null | undefined, key: string): boolean {
  return object != null && key in object;
}
