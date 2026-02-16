/**
 * Replaces matches for pattern in string with replacement.
 *
 * @param str - The string to modify.
 * @param pattern - The pattern to replace.
 * @param replacement - The replacement string.
 * @returns The modified string.
 * @deprecated Use `string.replace()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace | String.replace() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_replace | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * replace('hello world', 'world', 'there');  // => 'hello there'
 * replace('foo bar foo', /foo/g, 'baz');     // => 'baz bar baz'
 *
 * // ✅ Recommended approach
 * 'hello world'.replace('world', 'there');   // => 'hello there'
 * 'foo bar foo'.replace(/foo/g, 'baz');      // => 'baz bar baz'
 * ```
 */
export function replace(
  str: string | null | undefined,
  pattern: string | RegExp,
  replacement: string
): string {
  return (str ?? "").replace(pattern, replacement);
}
