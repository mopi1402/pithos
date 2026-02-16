/**
 * Repeats a string a specified number of times.
 *
 * @param str - The string to repeat.
 * @param count - The number of times to repeat the string.
 * @returns The repeated string.
 * @deprecated Use `string.repeat()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat | String.repeat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_repeat | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * repeat('hello', 3); // => 'hellohellohello'
 * repeat('-', 10);    // => '----------'
 *
 * // ✅ Recommended approach
 * 'hello'.repeat(3); // => 'hellohellohello'
 * '-'.repeat(10);    // => '----------'
 * ```
 */
export function repeat(
  str: string | null | undefined,
  count: number | null | undefined
): string {
  // Stryker disable next-line ConditionalExpression,EqualityOperator: typeof check is defensive; count <= 0 vs count < 0 both return "" (repeat(0) === "")
  if (!str || typeof count !== "number" || count < 0) {
    return "";
  }
  return str.repeat(count);
}