/**
 * Checks if value is greater than or equal to other.
 *
 * @param value - The value to compare.
 * @param other - The other value to compare.
 * @returns `true` if value is greater than or equal to other, else `false`.
 * @deprecated Use the `>=` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than_or_equal | Greater than or equal (>=) - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * gte(3, 1);   // => true
 * gte(3, 3);   // => true
 * gte(1, 3);   // => false
 *
 * // ✅ Recommended approach
 * 3 >= 1;      // => true
 * 3 >= 3;      // => true
 * 1 >= 3;      // => false
 * ```
 */
export function gte(value: number, other: number): boolean {
  return value >= other;
}
