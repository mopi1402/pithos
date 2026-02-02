/**
 * Converts a string to uppercase.
 *
 * @param str - The string to convert to uppercase.
 * @returns The string converted to uppercase.
 * @deprecated Use `string.toUpperCase()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase | String.toUpperCase() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_touppercase | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toUpper('hello world'); // => 'HELLO WORLD'
 *
 * // ✅ Recommended approach
 * 'hello world'.toUpperCase(); // => 'HELLO WORLD'
 * ```
 */
export function toUpper(str: string | null | undefined): string {
  return str?.toUpperCase() ?? "";
}