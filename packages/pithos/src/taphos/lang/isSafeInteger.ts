/**
 * Checks if value is a safe integer.
 *
 * A safe integer is an integer that can be exactly represented as an IEEE-754 double
 * precision number, and whose IEEE-754 representation cannot be the result of rounding
 * any other integer to fit the IEEE-754 representation.
 *
 * @param value - The value to check.
 * @returns `true` if value is a safe integer, else `false`.
 * @deprecated Use `Number.isSafeInteger()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger | Number.isSafeInteger() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_number_issafeinteger | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isSafeInteger(42);                        // => true
 * isSafeInteger(9007199254740991);          // => true (MAX_SAFE_INTEGER)
 * isSafeInteger(9007199254740992);          // => false
 *
 * // ✅ Recommended approach
 * Number.isSafeInteger(42);                 // => true
 * Number.isSafeInteger(9007199254740991);   // => true
 * Number.isSafeInteger(9007199254740992);   // => false
 * ```
 */
export function isSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value);
}
