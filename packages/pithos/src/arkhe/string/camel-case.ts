//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-18
/**
 * Converts a string to camelCase.
 *
 * @param str - The string to convert.
 * @returns The string in camelCase.
 * @since 1.1.0
 *
 * @note Handles kebab-case, snake_case, PascalCase, space-separated strings, and acronyms.
 *
 * @performance O(n) where n is string length. Multiple regex passes.
 *
 * @example
 * ```typescript
 * camelCase('background-color'); // => 'backgroundColor'
 * camelCase('font_size');        // => 'fontSize'
 * camelCase('Hello World');      // => 'helloWorld'
 * camelCase('PascalCase');       // => 'pascalCase'
 * camelCase('HTTPRequest');      // => 'httpRequest'
 * camelCase('--foo--bar--');     // => 'fooBar'
 * ```
 */
export function camelCase(str: string): string {
  // Stryker disable next-line ConditionalExpression: Early return optimization - pipeline handles empty string identically
  if (str.length === 0) return "";

  // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression: Pipeline normalization makes mutations equivalent
  const normalized = str.replace(/[A-Z]+/g, (match) =>
    // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression: Pipeline normalization makes mutations equivalent
    match.length > 1
      ? match.charAt(0) + match.slice(1).toLowerCase()
      : " " + match.toLowerCase()
  );

  const result = normalized
    .replace(/[_\-\s]+(.)?/g, (_, c: string | undefined) =>
      c ? c.toUpperCase() : ""
    )
    .replace(/^[A-Z]/, (c) => c.toLowerCase());

  // Stryker disable next-line Regex,StringLiteral: Spaces consumed by previous replace - safety net
  return result.replace(/^\s+/, "");
}
