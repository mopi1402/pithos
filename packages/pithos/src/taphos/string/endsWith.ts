/**
 * Checks if a string ends with a given suffix.
 *
 * @param str - The string to check.
 * @param suffix - The suffix to search for.
 * @param position - The position to search up to.
 * @returns `true` if the string ends with the suffix, `false` otherwise.
 * @deprecated Use `string.endsWith()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith | String.endsWith() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_endswith | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * endsWith('hello world', 'world'); // => true
 * endsWith('hello world', 'lo', 5); // => true
 *
 * // ✅ Recommended approach
 * 'hello world'.endsWith('world'); // => true
 * 'hello world'.endsWith('lo', 5); // => true
 * ```
 */
export function endsWith(
  str: string | null | undefined,
  suffix: string | null | undefined,
  position?: number
): boolean {
  // Stryker disable next-line ConditionalExpression: Native endsWith converts null to "null" string, so the null check is defensive but not strictly necessary
  if (str == null || suffix == null) return false;
  const len = str.length;
  return str.endsWith(suffix, position ?? len);
}