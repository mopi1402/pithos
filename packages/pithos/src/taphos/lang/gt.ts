/**
 * Checks if value is greater than other.
 *
 * @param value - The value to compare.
 * @param other - The other value to compare.
 * @returns `true` if value is greater than other, else `false`.
 * @deprecated Use the `>` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than | Greater than (>) - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * gt(3, 1);   // => true
 * gt(3, 3);   // => false
 * gt(1, 3);   // => false
 *
 * // ✅ Recommended approach
 * 3 > 1;      // => true
 * 3 > 3;      // => false
 * 1 > 3;      // => false
 * ```
 */
export function gt(value: number, other: number): boolean {
  return value > other;
}
