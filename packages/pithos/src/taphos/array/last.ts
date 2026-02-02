/**
 * Gets the last element of array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @returns The last element of the array, or `undefined` if empty.
 * @deprecated Use `array[array.length - 1]` or `array.at(-1)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_at | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const lastElement = last(numbers);
 * console.log(lastElement); // 5
 *
 * // ✅ Recommended approach
 * const lastNative = numbers[numbers.length - 1];
 * console.log(lastNative); // 5
 *
 * // ✅ Modern approach with ES2022
 * const lastModern = numbers.at(-1);
 * console.log(lastModern); // 5
 * ```
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}