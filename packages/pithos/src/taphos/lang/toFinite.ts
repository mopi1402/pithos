/**
 * Converts value to a finite number.
 *
 * @param value - The value to convert.
 * @returns The converted finite number.
 * @deprecated Use `Number()` with manual clamping for infinities instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number | Number() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * toFinite(3.7);         // => 3.7
 * toFinite(Infinity);    // => 1.7976931348623157e+308 (MAX_VALUE)
 * toFinite(-Infinity);   // => -1.7976931348623157e+308
 * toFinite(NaN);         // => 0
 *
 * // ✅ Recommended approach
 * const n = Number(value);
 * Number.isFinite(n) ? n : (n > 0 ? Number.MAX_VALUE : (n < 0 ? -Number.MAX_VALUE : 0));
 * ```
 */
export function toFinite(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    if (Number.isNaN(n)) return 0;
    // Stryker disable next-line EqualityOperator: n cannot be 0 here (0 is finite), so n > 0 and n >= 0 are equivalent
    return n > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE;
  }
  return n;
}
