/**
 * Converts value to a string.
 *
 * @param value - The value to convert.
 * @returns The converted string.
 * @deprecated Use `String()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String | String() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toString(42);        // => '42'
 * toString(null);      // => 'null'
 * toString([1, 2]);    // => '1,2'
 *
 * // ✅ Recommended approach
 * String(42);          // => '42'
 * String(null);        // => 'null'
 * String([1, 2]);      // => '1,2'
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function toString(value: unknown): string {
  if (value == null) return "";
  return String(value);
}
