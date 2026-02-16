/**
 * Gets the index at which the first occurrence of value is found in array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to search.
 * @param value - The value to search for.
 * @param fromIndex - The index to search from.
 * @returns The index of the matched value, or `-1` if not found.
 * @deprecated Use `array.indexOf(value)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf | Array.indexOf() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_indexof | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 2, 4];
 *
 * // ❌ Deprecated approach
 * const index = indexOf(numbers, 2);
 * console.log(index); // 1
 *
 * // ✅ Recommended approach
 * const indexNative = numbers.indexOf(2);
 * console.log(indexNative); // 1
 * ```
 */
export function indexOf<T>(array: T[], value: T, fromIndex?: number): number {
  return array.indexOf(value, fromIndex);
}