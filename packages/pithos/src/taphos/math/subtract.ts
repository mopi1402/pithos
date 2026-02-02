/**
 * Subtracts two numbers.
 *
 * @param minuend - The first number in a subtraction.
 * @param subtrahend - The second number in a subtraction.
 * @returns The difference.
 * @deprecated Use the `-` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Subtraction | Subtraction (-) - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * subtract(6, 4);   // => 2
 *
 * // ✅ Recommended approach
 * 6 - 4;            // => 2
 * ```
 */
export function subtract(minuend: number, subtrahend: number): number {
  return minuend - subtrahend;
}
