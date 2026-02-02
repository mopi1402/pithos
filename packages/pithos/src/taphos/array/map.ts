/**
 * Creates an array of values by running each element in array through iteratee.
 *
 * @template T - The type of elements in the input array.
 * @template Result - The type of elements in the output array.
 * @param array - The array to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns A new mapped array.
 * @deprecated Use `array.map(callback)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_map | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 *
 * // ❌ Deprecated approach
 * const doubled = map(numbers, x => x * 2);
 * console.log(doubled); // [2, 4, 6, 8, 10]
 *
 * // ✅ Recommended approach
 * const doubledNative = numbers.map(x => x * 2);
 * console.log(doubledNative); // [2, 4, 6, 8, 10]
 * ```
 */
export function map<T, Result>(
  array: T[],
  iteratee: (value: T, index: number, array: T[]) => Result
): Result[] {
  return array.map(iteratee);
}