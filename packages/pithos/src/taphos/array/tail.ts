/**
 * Gets all but the first element of array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to query.
 * @returns A new array with all elements except the first.
 * @deprecated Use `array.slice(1)` directly instead.
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
 * const rest = tail(numbers);
 * console.log(rest); // [2, 3, 4, 5]
 *
 * // ✅ Recommended approach
 * const restNative = numbers.slice(1);
 * console.log(restNative); // [2, 3, 4, 5]
 * ```
 */
export function tail<T>(array: T[]): T[] {
    return array.slice(1);
}