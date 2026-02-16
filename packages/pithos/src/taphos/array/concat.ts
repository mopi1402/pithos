/**
 * Concatenates arrays and values into a new array.
 *
 * @template T - The type of elements in the arrays.
 * @param array - The initial array.
 * @param values - Additional arrays or values to concatenate.
 * @returns A new array containing all elements from the input arrays.
 * @deprecated Use `array.concat()` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat | Array.concat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_concat | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const arr1 = [1, 2];
 * const arr2 = [3, 4];
 *
 * // ❌ Deprecated approach
 * const concatenated = concat(arr1, arr2);
 * console.log(concatenated); // [1, 2, 3, 4]
 *
 * // ✅ Recommended approach
 * const concatenatedNative = arr1.concat(arr2);
 * console.log(concatenatedNative); // [1, 2, 3, 4]
 * ```
 */
export function concat<T>(array: T[], ...values: (T | T[])[]): T[] {
  return array.concat(...values);
}