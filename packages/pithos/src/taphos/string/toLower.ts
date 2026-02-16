/**
 * Converts a string to lowercase.
 *
 * @param str - The string to convert to lowercase.
 * @returns The string converted to lowercase.
 * @deprecated Use `string.toLowerCase()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase | String.toLowerCase() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_tolowercase | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toLower('HELLO WORLD'); // => 'hello world'
 *
 * // ✅ Recommended approach
 * 'HELLO WORLD'.toLowerCase(); // => 'hello world'
 * ```
 */
export function toLower(str: string | null | undefined): string {
  return str?.toLowerCase() ?? "";
}