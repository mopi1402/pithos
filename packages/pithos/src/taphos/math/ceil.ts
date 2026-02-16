/**
 * Computes number rounded up to precision.
 *
 * @param n - The number to round up.
 * @param precision - The precision to round up to. Defaults to 0.
 * @returns The rounded up number.
 * @deprecated Use `Math.ceil()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil | Math.ceil() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * ceil(4.006);      // => 5
 * ceil(6.004, 2);   // => 6.01
 * ceil(6040, -2);   // => 6100
 *
 * // ✅ Recommended approach
 * Math.ceil(4.006);             // => 5
 * Math.ceil(6.004 * 100) / 100; // => 6.01
 * Math.ceil(6040 / 100) * 100;  // => 6100
 * ```
 */
export function ceil(n: number, precision = 0): number {
  // Stryker disable next-line ConditionalExpression: Optimization - when precision=0, factor=1, so Math.ceil(n*1)/1 === Math.ceil(n)
  if (precision === 0) return Math.ceil(n);
  const factor = 10 ** precision;
  return Math.ceil(n * factor) / factor;
}
