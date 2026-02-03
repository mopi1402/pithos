
/**
 * Checks if a value is null.
 *
 * @param value - The value to check.
 * @returns `true` if the value is null, `false` otherwise.
 * @since 1.1.0
 *
 * @note Only checks null, not undefined. Use `isNil` to check both.
 *
 * @see isNil
 * @see isUndefined
 * @see isNonNull
 *
 * @example
 * ```typescript
 * isNull(null);      // => true
 * isNull(undefined); // => false
 * isNull(0);         // => false
 * isNull('');        // => false
 * ```
 */
export const isNull = (value: unknown): value is null => value === null;
