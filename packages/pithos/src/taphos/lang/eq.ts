/**
 * Performs a SameValueZero comparison between two values to determine if they are equivalent.
 *
 * @param value - The value to compare.
 * @param other - The other value to compare.
 * @returns `true` if the values are equivalent, else `false`.
 * @deprecated Use `Object.is()` or `===` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is | Object.is() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_object_is | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * eq(1, 1);         // => true
 * eq('a', 'a');     // => true
 * eq(NaN, NaN);     // => true
 *
 * // ✅ Recommended approach
 * Object.is(1, 1);        // => true
 * Object.is('a', 'a');    // => true
 * Object.is(NaN, NaN);    // => true (unlike ===)
 *
 * // Or simply use === for most cases
 * 1 === 1;          // => true
 * 'a' === 'a';      // => true
 * ```
 */
export function eq(value: unknown, other: unknown): boolean {
  return Object.is(value, other) || (value === other);
}
