/**
 * Checks if a value is a float (finite number that is not an integer).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a float, `false` otherwise.
 * @since 2.0.0
 *
 * @note This checks for numbers that have a decimal part.
 *
 * @example
 * ```typescript
 * isFloat(1.5);       // => true
 * isFloat(1.0);       // => false
 * isFloat(1);         // => false
 * isFloat(Infinity);  // => false
 * isFloat('1.5');     // => false
 * ```
 */
export const isFloat = (value: unknown): boolean =>
    // Stryker disable next-line ConditionalExpression: equivalent mutant, Number.isFinite returns false for all non-numbers
    typeof value === "number" &&
    Number.isFinite(value) &&
    !Number.isInteger(value);
