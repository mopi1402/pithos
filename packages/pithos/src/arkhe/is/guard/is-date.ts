/**
 * Checks if a value is a Date instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Date, `false` otherwise.
 * @since 2.0.0
 *
 * @note Does not validate if the Date is valid (use `isValidDate` for that).
 *
 * @example
 * ```typescript
 * isDate(new Date());       // => true
 * isDate(new Date('invalid')); // => true (still a Date instance)
 * isDate('2024-01-01');     // => false
 * isDate(Date.now());       // => false (number)
 * ```
 */
export const isDate = (value: unknown): value is Date => value instanceof Date;
