/**
 * Adds two numbers.
 *
 * @param augend - The first number in an addition.
 * @param addend - The second number in an addition.
 * @returns The sum.
 * @deprecated Use the `+` operator directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition | Addition (+) - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * add(6, 4);   // => 10
 *
 * // ✅ Recommended approach
 * 6 + 4;       // => 10
 * ```
 */
export function add(augend: number, addend: number): number {
  return augend + addend;
}
