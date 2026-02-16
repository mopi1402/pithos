/**
 * Splits a string by separator.
 *
 * @param str - The string to split.
 * @param separator - The separator pattern.
 * @param limit - The maximum number of splits.
 * @returns An array of string segments.
 * @deprecated Use `string.split()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split | String.split() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_split | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * split('a-b-c', '-');      // => ['a', 'b', 'c']
 * split('a-b-c', '-', 2);   // => ['a', 'b']
 *
 * // ✅ Recommended approach
 * 'a-b-c'.split('-');       // => ['a', 'b', 'c']
 * 'a-b-c'.split('-', 2);    // => ['a', 'b']
 * ```
 */
export function split(
  str: string | null | undefined,
  separator: string | RegExp,
  limit?: number
): string[] {
  return (str ?? "").split(separator, limit);
}
