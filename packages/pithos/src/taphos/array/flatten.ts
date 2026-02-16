/**
 * Flattens array a single level deep.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to flatten.
 * @returns A new flattened array.
 * @deprecated Use `array.flat()` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | Array.flat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_flat | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const nested = [1, [2, 3], [4, [5, 6]]];
 *
 * // ❌ Deprecated approach
 * const flattened = flatten(nested);
 * console.log(flattened); // [1, 2, 3, 4, [5, 6]]
 *
 * // ✅ Recommended approach
 * const flattenedNative = nested.flat();
 * console.log(flattenedNative); // [1, 2, 3, 4, [5, 6]]
 * ```
 */
export function flatten<T>(array: (T | T[])[]): (T | T[])[] {
  return array.flat() as (T | T[])[];
}