import { get } from "../../arkhe/object/get";
import { set } from "../../arkhe/object/set";

/**
 * Updates the value at path of object using an updater function, returning a new object (immutable).
 *
 * @template T - The type of the input object.
 * @param object - The object to modify.
 * @param path - The path of the property to update.
 * @param updater - The function to produce the updated value.
 * @returns A new object with the updated value.
 * @deprecated Use `set(obj, path, fn(get(obj, path)))` directly instead.
 * @see get
 * @see set
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const object = { a: { b: { c: 3 } } };
 *
 * // ❌ Deprecated approach
 * update(object, 'a.b.c', n => n * 2);
 * // => { a: { b: { c: 6 } } }
 *
 * // ✅ Recommended approach
 * set(object, 'a.b.c', get(object, 'a.b.c') * 2);
 * // => { a: { b: { c: 6 } } }
 *
 * // Or with optional chaining for simple cases
 * const value = object.a?.b?.c ?? 0;
 * set(object, 'a.b.c', value * 2);
 * ```
 */
export function update<T extends object>(
  object: T,
  path: string | (string | number | symbol)[],
  updater: (value: unknown) => unknown
): T {
  const currentValue = get(object, path);
  const newValue = updater(currentValue);
  return set(object, path, newValue);
}
