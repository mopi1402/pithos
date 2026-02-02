/**
 * Parses a string into an integer of the specified radix.
 *
 * @param str - The string to parse.
 * @param radix - The radix (base) to use for parsing. Defaults to 10.
 * @returns The parsed integer, or NaN if parsing fails.
 * @deprecated Use `parseInt()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt | parseInt() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_parseint | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * parseInteger('42');       // => 42
 * parseInteger('10', 2);    // => 2 (binary)
 * parseInteger('ff', 16);   // => 255 (hex)
 *
 * // ✅ Recommended approach
 * parseInt('42', 10);       // => 42
 * parseInt('10', 2);        // => 2 (binary)
 * parseInt('ff', 16);       // => 255 (hex)
 * ```
 */
export function parseInteger(
  str: string | null | undefined,
  radix = 10
): number {
  // Stryker disable next-line StringLiteral: parseInt("", radix) and parseInt("any-string", radix) both return NaN for invalid input
  return parseInt(str ?? "", radix);
}
