/**
 * Parses a comma-separated string using a custom parser function.
 *
 * @template T - The type of parsed values.
 * @param value - The comma-separated string to parse.
 * @param parser - The function to transform each value.
 * @returns The array of parsed values.
 * @since 1.0.0
 *
 * @note Does not trim values automatically. Empty string returns `['']`.
 *
 * @example
 * ```typescript
 * parseCommaSeparated('1,2,3', Number);
 * // => [1, 2, 3]
 *
 * parseCommaSeparated('a,b,c', (x) => x.toUpperCase());
 * // => ['A', 'B', 'C']
 *
 * parseCommaSeparated(' a , b ', (x) => x.trim());
 * // => ['a', 'b']
 * ```
 */
export const parseCommaSeparated = <T>(
  value: string,
  parser: (item: string) => T
): T[] => value.split(",").map(parser);
