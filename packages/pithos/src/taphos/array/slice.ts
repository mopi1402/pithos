/**
 * Creates a slice of array from start up to, but not including, end.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to slice.
 * @param start - The start position.
 * @param end - The end position.
 * @returns A new sliced array.
 * @deprecated Use `array.slice(start, end)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice | Array.slice() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_slice | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const sliced = slice(numbers, 1, 4);
 * console.log(sliced); // [2, 3, 4]
 *
 * // ✅ Recommended approach
 * const slicedNative = numbers.slice(1, 4);
 * console.log(slicedNative); // [2, 3, 4]
 * ```
 */
export function slice<T>(array: T[], start?: number, end?: number): T[] {
  return array.slice(start, end);
}