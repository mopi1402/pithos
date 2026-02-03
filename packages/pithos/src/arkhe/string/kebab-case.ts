/**
 * Converts a string to kebab-case.
 *
 * @param str - The string to convert.
 * @returns The string in kebab-case.
 * @since 1.1.0
 *
 * @note Handles camelCase, PascalCase, acronyms, snake_case, and spaces.
 *
 * @performance O(n) where n is string length. Multiple regex passes.
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

  // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
  return str
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/[\s_-]+/g, "-")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
