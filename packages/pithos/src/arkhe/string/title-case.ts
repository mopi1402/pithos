//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Converts a string to Title Case.
 *
 * @param str - The string to convert.
 * @returns The string in Title Case.
 * @since 1.1.0
 *
 * @note Capitalizes after spaces, hyphens, and underscores. Supports Unicode.
 *
 * @example
 * ```typescript
 * titleCase('hello world');  // => 'Hello World'
 * titleCase('hello-world');  // => 'Hello-World'
 * titleCase('HELLO WORLD');  // => 'Hello World'
 * titleCase('café résumé');  // => 'Café Résumé'
 * ```
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(
      /(^|\s|-|_)(\p{L})/gu,
      (_, separator, letter) => separator + letter.toUpperCase()
    );
}
