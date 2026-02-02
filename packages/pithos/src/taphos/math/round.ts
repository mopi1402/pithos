/**
 * Computes number rounded to precision.
 *
 * @param n - The number to round.
 * @param precision - The precision to round to. Defaults to 0.
 * @returns The rounded number.
 * @deprecated Use `Math.round()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round | Math.round() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * round(4.006);      // => 4
 * round(4.006, 2);   // => 4.01
 * round(4060, -2);   // => 4100
 *
 * // ✅ Recommended approach
 * Math.round(4.006);             // => 4
 * Math.round(4.006 * 100) / 100; // => 4.01
 * Math.round(4060 / 100) * 100;  // => 4100
 * ```
 */
export function round(n: number, precision = 0): number {
  // Stryker disable next-line ConditionalExpression: Optimization - when precision=0, factor=1, so Math.round(n*1)/1 === Math.round(n)
  if (precision === 0) return Math.round(n);
  const factor = 10 ** precision;
  return Math.round(n * factor) / factor;
}
