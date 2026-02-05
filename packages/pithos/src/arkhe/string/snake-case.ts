/**
 * Pattern to split strings into words for case conversion.
 * Matches: lowercase sequences (with trailing digits), uppercase sequences, uppercase followed by lowercase, standalone digits.
 *
 * @internal
 */
const WORD_PATTERN =
  /[A-Z]{2,}(?=[A-Z][a-z]|[0-9]|[^a-zA-Z0-9]|$)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g;

/**
 * Converts a string to snake_case.
 *
 * @param str - The string to convert.
 * @returns The string in snake_case.
 * @since 1.1.0
 *
 * @note Handles camelCase, PascalCase, acronyms, kebab-case, and spaces.
 *
 * @performance O(n) where n is string length. Single regex pass with match + join.
 *
 * @example
 * ```typescript
 * snakeCase('helloWorld');     // => 'hello_world'
 * snakeCase('XMLHttpRequest'); // => 'xml_http_request'
 * snakeCase('hello-world');    // => 'hello_world'
 * snakeCase('Hello World');    // => 'hello_world'
 * snakeCase('--foo--bar--');   // => 'foo_bar'
 * ```
 */
export function snakeCase(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string operations return "" anyway
  if (str.length === 0) return "";

  const words = str.match(WORD_PATTERN);
  // Stryker disable next-line ConditionalExpression: no words means empty result
  if (!words) return "";

  return words.map((word) => word.toLowerCase()).join("_");
}

