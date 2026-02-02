/**
 * Pads the start of a string with a given character until it reaches the specified length.
 *
 * @param str - The string to pad.
 * @param length - The target length of the padded string.
 * @param padString - The string to use for padding.
 * @returns The padded string.
 * @deprecated Use `string.padStart()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart | String.padStart() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_string_padstart | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * padStart('hello', 10);      // => '     hello'
 * padStart('42', 5, '0');     // => '00042'
 *
 * // ✅ Recommended approach
 * 'hello'.padStart(10);      // => '     hello'
 * '42'.padStart(5, '0');     // => '00042'
 * ```
 */
export function padStart(
  str: string | null | undefined,
  length: number | null | undefined,
  padString = " "
): string {
  return (str ?? "").padStart(length ?? 0, padString);
}