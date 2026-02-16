/**
 * Converts all elements in array into a string separated by separator.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to convert.
 * @param separator - The element separator.
 * @returns The joined string.
 * @deprecated Use `array.join(separator)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join | Array.join() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_join | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const joined = join(numbers, '-');
 * console.log(joined); // "1-2-3-4-5"
 *
 * // ✅ Recommended approach
 * const joinedNative = numbers.join('-');
 * console.log(joinedNative); // "1-2-3-4-5"
 * ```
 */
export function join<T>(array: T[], separator: string = ","): string {
  return array.join(separator);
}