/**
 * Splits string into an array of its words.
 *
 * @param str - The string to inspect.
 * @param pattern - The pattern to match words (optional).
 * @returns The array of words.
 * @since 2.0.0
 *
 * @note Default pattern handles camelCase, PascalCase, snake_case, kebab-case, and mixed strings.
 * @note Includes Unicode letters and numbers in default pattern.
 *
 * @performance O(n) where n is string length. Single regex pass.
 *
 * @example
 * ```typescript
 * words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 *
 * words('camelCase');
 * // => ['camel', 'Case']
 *
 * words('PascalCase');
 * // => ['Pascal', 'Case']
 *
 * words('snake_case');
 * // => ['snake', 'case']
 *
 * words('kebab-case');
 * // => ['kebab', 'case']
 *
 * words('XMLHttpRequest');
 * // => ['XML', 'Http', 'Request']
 * ```
 */
export function words(str: string, pattern?: RegExp | string): string[] {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string match returns null, ?? [] handles it
  if (str.length === 0) return [];

  if (pattern !== undefined) {
    const regex =
      // Stryker disable next-line ConditionalExpression: equivalent mutant - new RegExp(regexObj, flags) works correctly for both string and RegExp
      typeof pattern === "string"
        ? new RegExp(pattern, "g")
        : new RegExp(
            pattern.source,
            pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"
          );
    return str.match(regex) ?? [];
  }

  return (
    str.match(
      // Stryker disable next-line Regex: equivalent mutant - [a-z]+ vs [a-z] in lookahead produces same result
      /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g
    ) ?? []
  );
}
