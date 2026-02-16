/**
 * Pattern to split strings into words for case conversion.
 * Matches: lowercase sequences (with trailing digits), uppercase sequences, uppercase followed by lowercase, standalone digits.
 *
 * @internal
 */
const WORD_PATTERN =
  /[A-Z]{2,}(?=[A-Z][a-z]|[0-9]|[^a-zA-Z0-9]|$)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g;

/**
 * Converts a string to kebab-case.
 *
 * @param str - The string to convert.
 * @returns The string in kebab-case.
 * @since 2.0.0
 *
 * @note Handles camelCase, PascalCase, acronyms, snake_case, and spaces.
 *
 * @performance O(n) where n is string length. Single regex pass with match + join.
 *
 * @example
 * ```typescript
 * kebabCase('backgroundColor'); // => 'background-color'
 * kebabCase('XMLHttpRequest');  // => 'xml-http-request'
 * kebabCase('hello world');     // => 'hello-world'
 * kebabCase('foo_bar');         // => 'foo-bar'
 * kebabCase('--foo--bar--');    // => 'foo-bar'
 * ```
 */
export function kebabCase(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string operations return "" anyway
  if (str.length === 0) return "";

  const words = str.match(WORD_PATTERN);
  // Stryker disable next-line ConditionalExpression: no words means empty result
  if (!words) return "";

  return words.map((word) => word.toLowerCase()).join("-");
}
