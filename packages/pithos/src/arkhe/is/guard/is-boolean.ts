/**
 * Checks if a value is a boolean.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a boolean, `false` otherwise.
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * isBoolean(true);  // => true
 * isBoolean(false); // => true
 * isBoolean(1);     // => false
 * isBoolean('true'); // => false
 * ```
 */
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
