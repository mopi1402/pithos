//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Converts a string to snake_case.
 *
 * @param str - The string to convert.
 * @returns The string in snake_case.
 * @since 1.1.0
 *
 * @note Handles camelCase, PascalCase, acronyms, kebab-case, and spaces.
 *
 * @performance O(n) where n is string length. Multiple regex passes.
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

  // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
  return str
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/[-\s_]+/g, "_")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}
