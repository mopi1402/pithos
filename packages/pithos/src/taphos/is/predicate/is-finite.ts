/**
 * Checks if value is a finite primitive number.
 *
 * @param value - The value to check.
 * @returns `true` if value is a finite number, `false` otherwise.
 * @deprecated Use `Number.isFinite()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite | Number.isFinite() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_number_isfinite | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isFinite(3);        // => true
 * isFinite(Infinity); // => false
 * isFinite(NaN);      // => false
 *
 * // ✅ Recommended approach
 * Number.isFinite(3);        // => true
 * Number.isFinite(Infinity); // => false
 * Number.isFinite(NaN);      // => false
 * ```
 */
export function isFinite(value: unknown): boolean {
    return Number.isFinite(value);
}