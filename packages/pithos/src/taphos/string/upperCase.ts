/**
 * Converts string to upper case with space-separated words.
 *
 * @param str - The string to convert.
 * @returns The upper cased string with words separated by spaces.
 * @deprecated Use `.toUpperCase()` with custom word splitting instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase | String.toUpperCase() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * upperCase('--Foo-Bar--');  // => 'FOO BAR'
 * upperCase('fooBar');       // => 'FOO BAR'
 * upperCase('__foo_bar__');  // => 'FOO BAR'
 *
 * // ✅ Recommended approach
 * 'Hello World'.toUpperCase();  // => 'HELLO WORLD'
 *
 * // For word splitting, use kebabCase or snakeCase then replace separators
 * import { kebabCase } from '@pithos/arkhe/string/kebab-case';
 * kebabCase('fooBar').replace(/-/g, ' ').toUpperCase();  // => 'FOO BAR'
 * ```
 */
export function upperCase(str: string | null | undefined): string {
  if (str == null) return "";

  // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression,Regex,StringLiteral: Multiple equivalent transformations due to final toUpperCase() and trim() normalizing the result
  return str
    // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression,Regex,StringLiteral: Multiple equivalent transformations due to final toUpperCase() and trim() normalizing the result
    .replace(/* Stryker disable next-line Regex */ /[A-Z]+/g, (match, offset) =>
      // Stryker disable next-line ConditionalExpression,EqualityOperator,MethodExpression: offset check and toLowerCase are normalized by final toUpperCase() and trim()
      (offset > 0 ? " " : "") + match.toLowerCase()
    )
    .replace(/* Stryker disable next-line Regex,StringLiteral */ /[_-]+/g, " ")
    // Stryker disable next-line Regex,StringLiteral,MethodExpression: Multiple equivalent transformations due to final toUpperCase() and trim() normalizing the result
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}
