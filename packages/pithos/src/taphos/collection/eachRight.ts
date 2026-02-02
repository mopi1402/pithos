/**
 * Iterates over elements of collection from right to left.
 *
 * @template T - The type of elements in the collection.
 * @param collection - The collection to iterate over.
 * @param iteratee - The function invoked per iteration.
 * @deprecated Use `[...array].reverse().forEach()` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach | Array.forEach() - MDN}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * // ❌ Deprecated approach
 * eachRight([1, 2, 3], x => console.log(x));
 * // logs: 3, 2, 1
 *
 * // ✅ Recommended approach
 * [...[1, 2, 3]].reverse().forEach(x => console.log(x));
 * // logs: 3, 2, 1
 * ```
 */
export function eachRight<T>(
  collection: readonly T[],
  iteratee: (value: T, index: number, collection: readonly T[]) => void
): void {
  for (let i = collection.length - 1; i >= 0; i--) {
    iteratee(collection[i], i, collection);
  }
}

/**
 * Alias for `eachRight`.
 *
 * @deprecated Use `[...array].reverse().forEach()` directly instead.
 * @since 1.1.0
 */
export const forEachRight = eachRight;
