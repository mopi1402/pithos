/**
 * Gets the value of property from all elements in collection.
 *
 * @template T - The type of elements in the array.
 * @template Key - The key of the property to pluck.
 * @param collection - The collection to iterate over.
 * @param path - The path of the property to pluck.
 * @returns The new array of property values.
 * @deprecated Use `array.map(item => item.property)` directly instead.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map() - MDN}
 * @see {@link https://caniuse.com/mdn-javascript_builtins_array_map | Browser support - Can I Use}
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const users = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 30 },
 *   { name: 'Bob', age: 20 }
 * ];
 *
 * // ❌ Deprecated approach
 * const names = pluck(users, 'name');
 * console.log(names); // ['John', 'Jane', 'Bob']
 *
 * // ✅ Recommended approach
 * const namesNative = users.map(user => user.name);
 * console.log(namesNative); // ['John', 'Jane', 'Bob']
 * ```
 */
export function pluck<T, Key extends keyof T>(collection: T[] | Record<string, T>, path: Key): T[Key][] {
  const items = Array.isArray(collection)
    ? collection
    : Object.values(collection as any) as T[];
  return items.map((item) => item[path]);
}