/**
 * Checks if value is NaN.
 *
 * @param value - The value to check.
 * @returns `true` if value is NaN, else `false`.
 * @deprecated Use `Number.isNaN()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN | Number.isNaN() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_number_isnan | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * isNaN(NaN);       // => true
 * isNaN(0 / 0);     // => true
 * isNaN(3);         // => false
 * isNaN(undefined); // => false
 *
 * // ✅ Recommended approach
 * Number.isNaN(NaN);       // => true
 * Number.isNaN(0 / 0);     // => true
 * Number.isNaN(3);         // => false
 * Number.isNaN(undefined); // => false
 * ```
 */
export function isNaN(value: unknown): boolean {
    return Number.isNaN(value);
}