/**
 * Gets the index at which the last occurrence of value is found in array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to search.
 * @param value - The value to search for.
 * @param fromIndex - The index to search from.
 * @returns The index of the matched value, or `-1` if not found.
 * @deprecated Use `array.lastIndexOf(value)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf | Array.lastIndexOf() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_lastindexof | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 2, 4];
 *
 * // ❌ Deprecated approach
 * const index = lastIndexOf(numbers, 2);
 * console.log(index); // 3
 *
 * // ✅ Recommended approach
 * const indexNative = numbers.lastIndexOf(2);
 * console.log(indexNative); // 3
 * ```
 */
export function lastIndexOf<T>(
  array: T[],
  value: T,
  fromIndex?: number
): number {
  if (fromIndex === undefined) {
    return array.lastIndexOf(value);
  }
  return array.lastIndexOf(value, fromIndex);
}