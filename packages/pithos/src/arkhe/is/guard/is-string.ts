//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is a string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string, `false` otherwise.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * isString('hello');       // => true
 * isString('');            // => true
 * isString(String(123));   // => true
 * isString(123);           // => false
 * isString(null);          // => false
 * isString(new String()); // => false (String object)
 * ```
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string";
