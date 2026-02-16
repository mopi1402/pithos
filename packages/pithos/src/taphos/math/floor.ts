/**
 * Computes number rounded down to precision.
 *
 * @param n - The number to round down.
 * @param precision - The precision to round down to. Defaults to 0.
 * @returns The rounded down number.
 * @deprecated Use `Math.floor()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor | Math.floor() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * floor(4.906);      // => 4
 * floor(0.046, 2);   // => 0.04
 * floor(4060, -2);   // => 4000
 *
 * // ✅ Recommended approach
 * Math.floor(4.906);             // => 4
 * Math.floor(0.046 * 100) / 100; // => 0.04
 * Math.floor(4060 / 100) * 100;  // => 4000
 * ```
 */
export function floor(n: number, precision = 0): number {
  // Stryker disable next-line ConditionalExpression: Optimization - when precision=0, factor=1, so Math.floor(n*1)/1 === Math.floor(n)
  if (precision === 0) return Math.floor(n);
  const factor = 10 ** precision;
  return Math.floor(n * factor) / factor;
}
