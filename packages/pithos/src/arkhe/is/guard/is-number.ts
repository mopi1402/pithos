/**
 * Checks if a value is a number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number, `false` otherwise.
 * @since 1.0.0
 *
 * @note Includes `NaN` and `Infinity`. Use `Number.isFinite()` for finite numbers only.
 *
 * @see isFinite
 *
 * @example
 * ```typescript
 * isNumber(42);       // => true
 * isNumber(3.14);     // => true
 * isNumber(NaN);      // => true
 * isNumber(Infinity); // => true
 * isNumber('42');     // => false
 * ```
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";
