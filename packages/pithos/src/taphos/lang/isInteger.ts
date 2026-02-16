/**
 * Checks if value is an integer.
 *
 * @param value - The value to check.
 * @returns `true` if value is an integer, else `false`.
 * @deprecated Use `Number.isInteger()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger | Number.isInteger() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_number_isinteger | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isInteger(42);      // => true
 * isInteger(42.0);    // => true
 * isInteger(42.5);    // => false
 * isInteger('42');    // => false
 *
 * // ✅ Recommended approach
 * Number.isInteger(42);      // => true
 * Number.isInteger(42.0);    // => true
 * Number.isInteger(42.5);    // => false
 * Number.isInteger('42');    // => false
 * ```
 */
export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}
