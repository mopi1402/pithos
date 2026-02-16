/**
 * Converts value to a safe integer.
 *
 * @param value - The value to convert.
 * @returns The converted safe integer.
 * @deprecated Use manual conversion with `Math.trunc()` and clamping instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER | Number.MAX_SAFE_INTEGER - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toSafeInteger(3.7);                    // => 3
 * toSafeInteger(Infinity);               // => 9007199254740991 (MAX_SAFE_INTEGER)
 * toSafeInteger(-Infinity);              // => -9007199254740991 (MIN_SAFE_INTEGER)
 *
 * // ✅ Recommended approach
 * Math.max(
 *   Number.MIN_SAFE_INTEGER,
 *   Math.min(Number.MAX_SAFE_INTEGER, Math.trunc(Number(value)))
 * );
 * ```
 */
export function toSafeInteger(value: unknown): number {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  // Stryker disable next-line ConditionalExpression,BlockStatement: Infinity handling is tested but mutant survives due to clamping logic below producing same result
  if (!Number.isFinite(n)) {
    // Stryker disable next-line EqualityOperator: n cannot be 0 here (0 is finite), so n > 0 and n >= 0 are equivalent
    return n > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
  }
  const int = Math.trunc(n);
  return Math.max(
    Number.MIN_SAFE_INTEGER,
    Math.min(Number.MAX_SAFE_INTEGER, int)
  );
}
