/**
 * Converts string to lower case with space-separated words.
 *
 * @param str - The string to convert.
 * @returns The lower cased string with words separated by spaces.
 * @deprecated Use `.toLowerCase()` with custom word splitting or `kebabCase`/`snakeCase` instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase | String.toLowerCase() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * lowerCase('--Foo-Bar--');  // => 'foo bar'
 * lowerCase('fooBar');       // => 'foo bar'
 * lowerCase('__FOO_BAR__');  // => 'foo bar'
 *
 * // ✅ Recommended approach
 * 'Hello World'.toLowerCase();  // => 'hello world'
 *
 * // For word splitting, use kebabCase or snakeCase then replace separators
 * import { kebabCase } from '@pithos/arkhe/string/kebab-case';
 * kebabCase('fooBar').replace(/-/g, ' ');  // => 'foo bar'
 * ```
 */
export function lowerCase(str: string | null | undefined): string {
  if (str == null) return "";

  // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression,Regex,StringLiteral: Multiple equivalent transformations due to final toLowerCase() and trim() normalizing the result
  return str
    // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression,Regex,StringLiteral: Multiple equivalent transformations due to final toLowerCase() and trim() normalizing the result
    .replace(/[A-Z]+/g, (match, offset) =>
      // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression: offset check and toLowerCase are normalized by final toLowerCase() and trim()
      (offset > 0 ? " " : "") + match.toLowerCase()
    )
    .replace(/* Stryker disable next-line Regex,StringLiteral */ /[_-]+/g, " ")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: Multiple equivalent transformations due to final toLowerCase() and trim() normalizing the result
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
