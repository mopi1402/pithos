/**
 * Creates a duplicate-free version of an array, using SameValueZero for equality comparisons.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to inspect.
 * @returns The new duplicate free array.
 * @deprecated Use `[...new Set(array)]` or `Array.from(new Set(array))` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set | Set - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_set | Browser support - Can I Use}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from | Array.from() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_from | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 3, 3, 4];
 *
 * // ❌ Deprecated approach
 * const uniqueNumbers = uniq(numbers);
 * console.log(uniqueNumbers); // [1, 2, 3, 4]
 *
 * // ✅ Recommended approach
 * const uniqueNumbersNative = [...new Set(numbers)];
 * console.log(uniqueNumbersNative); // [1, 2, 3, 4]
 *
 * // ✅ Alternative approach
 * const uniqueNumbersFrom = Array.from(new Set(numbers));
 * console.log(uniqueNumbersFrom); // [1, 2, 3, 4]
 * ```
 */
export function uniq<T>(array: T[]): T[] {
  return [...new Set(array)];
}