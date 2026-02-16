/**
 * Checks if value is less than other.
 *
 * @param value - The value to compare.
 * @param other - The other value to compare.
 * @returns `true` if value is less than other, else `false`.
 * @deprecated Use the `<` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Less_than | Less than (<) - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * lt(1, 3);   // => true
 * lt(3, 3);   // => false
 * lt(3, 1);   // => false
 *
 * // ✅ Recommended approach
 * 1 < 3;      // => true
 * 3 < 3;      // => false
 * 3 < 1;      // => false
 * ```
 */
export function lt(value: number, other: number): boolean {
  return value < other;
}
