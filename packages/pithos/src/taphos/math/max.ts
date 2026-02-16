/**
 * Computes the maximum value of array.
 *
 * @param array - The array to iterate over.
 * @returns The maximum value, or `undefined` if array is empty.
 * @deprecated Use `Math.max(...array)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max | Math.max() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * max([4, 2, 8, 6]);   // => 8
 * max([]);             // => undefined
 *
 * // ✅ Recommended approach
 * Math.max(...[4, 2, 8, 6]);   // => 8
 * Math.max(...[]);             // => -Infinity (handle empty case manually)
 * ```
 */
export function max(array: readonly number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.max(...array);
}
