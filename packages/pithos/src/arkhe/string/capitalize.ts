/**
 * Converts the first character to uppercase and the rest to lowercase.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 * @since 1.1.0
 *
 * @note Supports Unicode characters (accents, Cyrillic, etc.).
 *
 * @example
 * ```typescript
 * capitalize('hello');  // => 'Hello'
 * capitalize('HELLO');  // => 'Hello'
 * capitalize('été');    // => 'Été'
 * capitalize('москва'); // => 'Москва'
 * ```
 */
export function capitalize(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - str.charAt(0) on empty string returns "" anyway
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
