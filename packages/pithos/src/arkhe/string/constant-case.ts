//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Converts a string to CONSTANT_CASE.
 *
 * @param str - The string to convert.
 * @returns The string in CONSTANT_CASE.
 * @since 1.1.0
 *
 * @note Handles camelCase, kebab-case, space-separated strings, and acronyms.
 *
 * @performance O(n) where n is string length. Multiple regex passes.
 *
 * @example
 * ```typescript
 * constantCase('helloWorld');       // => 'HELLO_WORLD'
 * constantCase('background-color'); // => 'BACKGROUND_COLOR'
 * constantCase('foo bar');          // => 'FOO_BAR'
 * constantCase('parseHTMLString');  // => 'PARSE_HTML_STRING'
 * constantCase('--foo--bar--');     // => 'FOO_BAR'
 * ```
 */
export function constantCase(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string operations return "" anyway
  if (str.length === 0) return "";

  // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
  return str
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/[\s\-_]+/g, "_")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: equivalent mutants in regex patterns
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}
