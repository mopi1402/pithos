/**
 * Pads the end of a string with a given character until it reaches the specified length.
 *
 * @param str - The string to pad.
 * @param length - The target length of the padded string.
 * @param padString - The string to use for padding.
 * @returns The padded string.
 * @deprecated Use `string.padEnd()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd | String.padEnd() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_padend | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * padEnd('hello', 10);      // => 'hello     '
 * padEnd('hello', 10, '0'); // => 'hello00000'
 *
 * // ✅ Recommended approach
 * 'hello'.padEnd(10);      // => 'hello     '
 * 'hello'.padEnd(10, '0'); // => 'hello00000'
 * ```
 */
export function padEnd(
  str: string | null | undefined,
  length: number | null | undefined,
  padString = " "
): string {
  return (str ?? "").padEnd(length ?? 0, padString);
}