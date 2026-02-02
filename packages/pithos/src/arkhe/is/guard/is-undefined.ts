//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is undefined.
 *
 * @param value - The value to check.
 * @returns `true` if the value is undefined, `false` otherwise.
 * @since 1.1.0
 *
 * @note Only checks undefined, not null. Use `isNil` to check both.
 *
 * @see isNil
 * @see isNull
 * @see isNonUndefined
 *
 * @example
 * ```typescript
 * isUndefined(undefined); // => true
 * isUndefined(void 0);    // => true
 * isUndefined(null);      // => false
 * isUndefined('');        // => false
 * isUndefined(0);         // => false
 * ```
 */
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;
