/**
 * Converts value to an integer.
 *
 * @param value - The value to convert.
 * @returns The converted integer.
 * @deprecated Use `Math.trunc(Number())` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc | Math.trunc() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_math_trunc | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toInteger(3.7);      // => 3
 * toInteger(-3.7);     // => -3
 * toInteger('3.7');    // => 3
 * toInteger(Infinity); // => Infinity
 *
 * // ✅ Recommended approach
 * Math.trunc(3.7);         // => 3
 * Math.trunc(-3.7);        // => -3
 * Math.trunc(Number('3.7')); // => 3
 * ```
 */
export function toInteger(value: unknown): number {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  // Stryker disable next-line ConditionalExpression,LogicalOperator: n === 0 is an optimization; Math.trunc(0) === 0, so removing this check produces equivalent behavior
  if (n === 0 || !Number.isFinite(n)) return n;
  return Math.trunc(n);
}
