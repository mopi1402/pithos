/**
 * Checks if a string starts with a given prefix.
 *
 * @param str - The string to check.
 * @param prefix - The prefix to search for.
 * @param position - The position to start searching from.
 * @returns `true` if the string starts with the prefix, `false` otherwise.
 * @deprecated Use `string.startsWith()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith | String.startsWith() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_startswith | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * startsWith('hello world', 'hello');    // => true
 * startsWith('hello world', 'world', 6); // => true
 *
 * // ✅ Recommended approach
 * 'hello world'.startsWith('hello');    // => true
 * 'hello world'.startsWith('world', 6); // => true
 * ```
 */
export function startsWith(
  str: string | null | undefined,
  prefix: string | null | undefined,
  position: number = 0
): boolean {
  // Stryker disable next-line ConditionalExpression: Native startsWith converts null to "null" string, so the null check is defensive but not strictly necessary
  if (str == null || prefix == null) return false;
  return str.startsWith(prefix, position);
}