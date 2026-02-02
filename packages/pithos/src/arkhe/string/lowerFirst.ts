//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Converts the first character of a string to lowercase.
 *
 * @param str - The string to convert.
 * @returns The string with the first character in lowercase.
 * @since 1.1.0
 *
 * @note Supports Unicode characters. Does not modify the rest of the string.
 *
 * @see upperFirst
 *
 * @example
 * ```typescript
 * lowerFirst('Hello'); // => 'hello'
 * lowerFirst('HELLO'); // => 'hELLO'
 * lowerFirst('Été');   // => 'été'
 * ```
 */
export function lowerFirst(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - str.charAt(0) on empty string returns "" anyway
  if (str.length === 0) return str;

  return str.charAt(0).toLowerCase() + str.slice(1);
}
