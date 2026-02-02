import { range } from "@arkhe/util/range";

/**
 * Creates an array of numbers progressing from start up to, but not including, end,
 * in descending order.
 *
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @param step - The value to increment or decrement by. Defaults to 1.
 * @returns The range of numbers in reverse order.
 * @deprecated Use `range().reverse()` directly instead.
 * @see range
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * rangeRight(4);        // => [3, 2, 1, 0]
 * rangeRight(1, 5);     // => [4, 3, 2, 1]
 * rangeRight(0, 20, 5); // => [15, 10, 5, 0]
 *
 * // ✅ Recommended approach
 * range(4).reverse();        // => [3, 2, 1, 0]
 * range(1, 5).reverse();     // => [4, 3, 2, 1]
 * range(0, 20, 5).reverse(); // => [15, 10, 5, 0]
 * ```
 */

export function rangeRight(end: number): number[];
export function rangeRight(start: number, end: number, step?: number): number[];
export function rangeRight(
  startOrEnd: number,
  end?: number,
  step?: number
): number[] {
  // Stryker disable next-line ConditionalExpression,BlockStatement: range() handles undefined end the same way, so the check is for clarity
  if (end === undefined) {
    return range(startOrEnd).reverse();
  }
  return range(startOrEnd, end, step).reverse();
}
