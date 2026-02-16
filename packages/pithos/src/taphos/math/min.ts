/**
 * Computes the minimum value of array.
 *
 * @param array - The array to iterate over.
 * @returns The minimum value, or `undefined` if array is empty.
 * @deprecated Use `Math.min(...array)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min | Math.min() - MDN}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * min([4, 2, 8, 6]);   // => 2
 * min([]);             // => undefined
 *
 * // ✅ Recommended approach
 * Math.min(...[4, 2, 8, 6]);   // => 2
 * Math.min(...[]);             // => Infinity (handle empty case manually)
 * ```
 */
export function min(array: readonly number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.min(...array);
}
