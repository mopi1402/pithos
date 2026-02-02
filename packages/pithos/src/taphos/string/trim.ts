/**
 * Removes leading and trailing whitespace from a string.
 *
 * @param str - The string to trim.
 * @returns The trimmed string.
 * @deprecated Use `string.trim()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim | String.trim() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_trim | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * trim('  hello world  '); // => 'hello world'
 *
 * // ✅ Recommended approach
 * '  hello world  '.trim(); // => 'hello world'
 * ```
 */
export function trim(str: string | null | undefined): string {
  return str?.trim() ?? "";
}