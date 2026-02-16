/**
 * Escapes RegExp special characters in a string.
 *
 * @param str - The string to escape.
 * @returns The escaped string safe for use in RegExp.
 * @since 2.0.0
 *
 * @note Escapes: `^`, `$`, `\`, `.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`, `}`, `|`.
 *
 * @performance O(n) time where n is string length. Single regex pass.
 *
 * @example
 * ```typescript
 * escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\\[lodash\\]\\(https://lodash\\.com/\\)'
 *
 * escapeRegExp('$100.00');
 * // => '\\$100\\.00'
 *
 * // Use to create safe regex patterns
 * const userInput = 'hello.*world';
 * const pattern = new RegExp(escapeRegExp(userInput));
 * pattern.test('hello.*world'); // => true
 * pattern.test('helloXworld');  // => false
 * ```
 */
export function escapeRegExp(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string replace returns "" anyway
  if (str.length === 0) return "";

  return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
