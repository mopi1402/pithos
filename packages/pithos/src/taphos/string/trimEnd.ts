/**
 * Removes trailing whitespace from a string.
 *
 * @param str - The string to trim.
 * @returns The trimmed string.
 * @deprecated Use `string.trimEnd()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd | String.trimEnd() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_trimend | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * trimEnd('  hello  ');  // => '  hello'
 *
 * // ✅ Recommended approach
 * '  hello  '.trimEnd();  // => '  hello'
 * ```
 */
export function trimEnd(str: string | null | undefined): string {
  return (str ?? "").trimEnd();
}
