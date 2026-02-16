/**
 * Checks if value is a finite number.
 *
 * @param value - The value to check.
 * @returns `true` if value is a finite number, else `false`.
 * @deprecated Use `Number.isFinite()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite | Number.isFinite() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_number_isfinite | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isFinite(42);        // => true
 * isFinite(Infinity);  // => false
 * isFinite(NaN);       // => false
 * isFinite('42');      // => false
 *
 * // ✅ Recommended approach
 * Number.isFinite(42);        // => true
 * Number.isFinite(Infinity);  // => false
 * Number.isFinite(NaN);       // => false
 * Number.isFinite('42');      // => false
 * ```
 */
export function isFinite(value: unknown): value is number {
  return Number.isFinite(value);
}
