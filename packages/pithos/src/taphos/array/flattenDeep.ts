/**
 * Recursively flattens array.
 *
 * @template T - The type of the leaf elements in the array.
 * @param array - The array to flatten.
 * @returns A new deeply flattened array.
 * @deprecated Use `array.flat(Infinity)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | Array.flat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_flat | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const deeplyNested = [1, [2, [3, [4, [5]]]]];
 *
 * // ❌ Deprecated approach
 * const flattened = flattenDeep(deeplyNested);
 * console.log(flattened); // [1, 2, 3, 4, 5]
 *
 * // ✅ Recommended approach
 * const flattenedNative = deeplyNested.flat(Infinity);
 * console.log(flattenedNative); // [1, 2, 3, 4, 5]
 * ```
 */
export function flattenDeep<T>(array: unknown[]): T[] {
  return array.flat(Infinity) as T[];
}