/**
 * Checks if value is less than or equal to other.
 *
 * @param value - The value to compare.
 * @param other - The other value to compare.
 * @returns `true` if value is less than or equal to other, else `false`.
 * @deprecated Use the `<=` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Less_than_or_equal | Less than or equal (<=) - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * lte(1, 3);   // => true
 * lte(3, 3);   // => true
 * lte(3, 1);   // => false
 *
 * // ✅ Recommended approach
 * 1 <= 3;      // => true
 * 3 <= 3;      // => true
 * 3 <= 1;      // => false
 * ```
 */
export function lte(value: number, other: number): boolean {
  return value <= other;
}
