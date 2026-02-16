/**
 * Multiplies two numbers.
 *
 * @param multiplier - The first number in a multiplication.
 * @param multiplicand - The second number in a multiplication.
 * @returns The product.
 * @deprecated Use the `*` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Multiplication | Multiplication (*) - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * multiply(6, 4);   // => 24
 *
 * // ✅ Recommended approach
 * 6 * 4;            // => 24
 * ```
 */
export function multiply(multiplier: number, multiplicand: number): number {
  return multiplier * multiplicand;
}
