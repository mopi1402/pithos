/**
 * Creates a flattened array of values by running each element in collection
 * thru iteratee and flattening the mapped results up to depth times.
 *
 * @template T - The type of elements in the collection.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @param depth - The maximum recursion depth. Defaults to 1.
 * @returns The new flattened array.
 * @deprecated Use `array.flatMap().flat(depth)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | Array.flat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_flat | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * flatMapDepth([1, 2], n => [[[n, n]]], 2);
 * // => [[1, 1], [2, 2]]
 *
 * // ✅ Recommended approach
 * [1, 2].flatMap(n => [[[n, n]]]).flat(2);
 * // => [[1, 1], [2, 2]]
 * ```
 */
export function flatMapDepth<T>(
  collection: readonly T[],
  iteratee: (value: T, index: number, collection: readonly T[]) => unknown,
  depth = 1
): unknown[] {
  return collection.flatMap(iteratee).flat(depth);
}
