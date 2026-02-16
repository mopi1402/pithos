/**
 * Creates a flattened array of values by running each element in collection
 * thru iteratee and recursively flattening the mapped results.
 *
 * @template T - The type of elements in the collection.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @returns The new flattened array.
 * @deprecated Use `array.flatMap().flat(Infinity)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat | Array.flat() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_flat | Browser support - Can I Use}
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * flatMapDeep([1, 2], n => [[n, n]]);
 * // => [1, 1, 2, 2]
 *
 * // ✅ Recommended approach
 * [1, 2].flatMap(n => [[n, n]]).flat(Infinity);
 * // => [1, 1, 2, 2]
 * ```
 */
export function flatMapDeep<T>(
  collection: readonly T[],
  iteratee: (value: T, index: number, collection: readonly T[]) => unknown
): unknown[] {
  return collection.flatMap(iteratee).flat(Infinity);
}
