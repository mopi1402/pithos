/**
 * Gets the first element of array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @returns The first element of the array, or `undefined` if empty.
 * @deprecated Use `array[0]` or `array.at(0)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_at | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const firstElement = first(numbers);
 * console.log(firstElement); // 1
 *
 * // ✅ Recommended approach
 * const firstNative = numbers[0];
 * console.log(firstNative); // 1
 *
 * // ✅ Modern approach with ES2022
 * const firstModern = numbers.at(0);
 * console.log(firstModern); // 1
 * ```
 */
export function first<T>(array: T[]): T | undefined {
  return array[0];
}