/**
 * Returns the index of the first element predicate returns truthy for.
 *
 * Similar to `find`, but returns the index instead of the element itself.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to search.
 * @param predicate - The function invoked per iteration.
 * @returns The index of the found element, or `-1` if not found.
 * @deprecated Use `array.findIndex(predicate)` directly instead.
 * Reason: Native equivalent method now available
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex | Array.findIndex() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_findindex | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 },
 *   { name: 'Bob', age: 35 }
 * ];
 *
 * // ❌ Deprecated approach
 * const index = findIndex(users, user => user.age > 28);
 * console.log(index); // 1
 *
 * // ✅ Recommended approach
 * const indexNative = users.findIndex(user => user.age > 28);
 * console.log(indexNative); // 1
 * ```
 */
export function findIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): number {
  return array.findIndex(predicate);
}