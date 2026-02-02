/**
 * Creates an object from an array of key-value pairs.
 *
 * @template Key - The type of object keys.
 * @template Value - The type of object values.
 * @param pairs - The key-value pairs.
 * @returns A new object composed from the key-value pairs.
 * @deprecated Use `Object.fromEntries(pairs)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries | Object.fromEntries() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_fromentries | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const pairs: [string, number][] = [['a', 1], ['b', 2], ['c', 3]];
 *
 * // ❌ Deprecated approach
 * const obj = fromPairs(pairs);
 * console.log(obj); // { a: 1, b: 2, c: 3 }
 *
 * // ✅ Recommended approach
 * const objNative = Object.fromEntries(pairs);
 * console.log(objNative); // { a: 1, b: 2, c: 3 }
 * ```
 */
export function fromPairs<Key extends PropertyKey, Value>(
  pairs: [Key, Value][]
): Record<Key, Value> {
  return Object.fromEntries(pairs) as Record<Key, Value>;
}