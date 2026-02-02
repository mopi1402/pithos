/**
 * Returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 *
 * @returns The current Unix timestamp in milliseconds.
 * @deprecated Use `Date.now()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now | Date.now() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_date_now | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * const timestamp = now();
 *
 * // ✅ Recommended approach
 * const timestamp = Date.now();
 * ```
 */
export function now(): number {
  return Date.now();
}
