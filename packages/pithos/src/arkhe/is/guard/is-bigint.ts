//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is a bigint.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a bigint, `false` otherwise.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * isBigint(123n);  // => true
 * isBigint(123);   // => false
 * isBigint('123'); // => false
 * ```
 */
export const isBigint = (value: unknown): value is bigint =>
  typeof value === "bigint";
