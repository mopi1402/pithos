/**
 * Removes leading whitespace from a string.
 *
 * @param str - The string to trim.
 * @returns The trimmed string.
 * @deprecated Use `string.trimStart()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart | String.trimStart() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_trimstart | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * trimStart('  hello  ');  // => 'hello  '
 *
 * // ✅ Recommended approach
 * '  hello  '.trimStart();  // => 'hello  '
 * ```
 */
export function trimStart(str: string | null | undefined): string {
  return (str ?? "").trimStart();
}
