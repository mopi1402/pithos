/**
 * Creates a flattened array of values by running each element in collection
 * thru iteratee and flattening the mapped results.
 *
 * @template T - The type of elements in the collection.
 * @template Result - The type of elements in the result.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns The new flattened array.
 * @deprecated Use `array.flatMap()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap | Array.flatMap() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_flatmap | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * flatMap([1, 2], n => [n, n]);
 * // => [1, 1, 2, 2]
 *
 * // ✅ Recommended approach
 * [1, 2].flatMap(n => [n, n]);
 * // => [1, 1, 2, 2]
 * ```
 */
export function flatMap<T, Result>(
  collection: readonly T[],
  iteratee: (value: T, index: number, collection: readonly T[]) => Result | readonly Result[]
): Result[] {
  return collection.flatMap(iteratee);
}
