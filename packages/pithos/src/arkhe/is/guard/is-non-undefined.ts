//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is not undefined.
 *
 * @template T - The defined type.
 * @param value - The value to check.
 * @returns `true` if the value is not undefined, `false` otherwise.
 * @since 1.1.0
 *
 * @note Only checks undefined, not null. Use `isNonNullable` to check both.
 *
 * @see isNonNullable
 * @see isUndefined
 *
 * @example
 * ```typescript
 * isNonUndefined('hello');   // => true
 * isNonUndefined(0);         // => true
 * isNonUndefined(null);      // => true (only checks undefined)
 * isNonUndefined(undefined); // => false
 * ```
 */
export const isNonUndefined = <T>(value: T | undefined): value is T =>
  value !== undefined;
