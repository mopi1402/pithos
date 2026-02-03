/**
 * Checks if a value is null or undefined.
 *
 * @param value - The value to check.
 * @returns `true` if the value is null or undefined, `false` otherwise.
 * @since 1.1.0
 *
 * @see isNull
 * @see isUndefined
 *
 * @example
 * ```typescript
 * isNil(null);      // => true
 * isNil(undefined); // => true
 * isNil(0);         // => false
 * isNil('');        // => false
 * isNil(false);     // => false
 * ```
 */
export const isNil = (value: unknown): value is null | undefined =>
  value == null;
