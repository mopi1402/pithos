/**
 * Divides two numbers.
 *
 * @param dividend - The first number in a division.
 * @param divisor - The second number in a division.
 * @returns The quotient.
 * @deprecated Use the `/` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Division | Division (/) - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * divide(6, 4);   // => 1.5
 *
 * // ✅ Recommended approach
 * 6 / 4;          // => 1.5
 * ```
 */
export function divide(dividend: number, divisor: number): number {
  return dividend / divisor;
}
