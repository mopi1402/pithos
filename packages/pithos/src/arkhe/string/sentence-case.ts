//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Converts a string to Sentence case.
 *
 * @param str - The string to convert.
 * @returns The string in Sentence case.
 * @since 1.1.0
 *
 * @note First character uppercase, rest lowercase. Alias behavior of `capitalize`.
 *
 * @see capitalize
 *
 * @example
 * ```typescript
 * sentenceCase('HELLO WORLD'); // => 'Hello world'
 * sentenceCase('hELLO wORLD'); // => 'Hello world'
 * sentenceCase('hello');       // => 'Hello'
 * ```
 */
export function sentenceCase(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - str.charAt(0) on empty string returns "" anyway
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
