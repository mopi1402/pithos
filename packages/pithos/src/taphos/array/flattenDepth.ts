/**
 * Recursively flattens array up to depth times.
 *
 * @template T - The type of the leaf elements in the array.
 * @param array - The array to flatten.
 * @param depth - The maximum recursion depth.
 * @returns A new flattened array.
 * @deprecated Use `array.flat(depth)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | Array.flat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_flat | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const nested = [1, [2, [3, [4]]]];
 *
 * // ❌ Deprecated approach
 * const flattened = flattenDepth(nested, 2);
 * console.log(flattened); // [1, 2, 3, [4]]
 *
 * // ✅ Recommended approach
 * const flattenedNative = nested.flat(2);
 * console.log(flattenedNative); // [1, 2, 3, [4]]
 * ```
 */
export function flattenDepth<T>(array: unknown[], depth: number = 1): T[] {
  return array.flat(depth) as T[];
}