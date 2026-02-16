import { get } from "../../arkhe/object/get";

/**
 * Creates an array of values corresponding to paths of object.
 *
 * @param object - The object to iterate over.
 * @param paths - The property paths to pick.
 * @returns An array of resolved values.
 * @deprecated Use `paths.map(p => get(obj, p))` directly instead.
 * @see get
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const object = { a: [{ b: { c: 3 } }, 4] };
 *
 * // ❌ Deprecated approach
 * at(object, ['a[0].b.c', 'a[1]']);
 * // => [3, 4]
 *
 * // ✅ Recommended approach
 * ['a[0].b.c', 'a[1]'].map(p => get(object, p));
 * // => [3, 4]
 * ```
 */
export function at<T>(
  object: T,
  paths: readonly (string | (string | number | symbol)[])[]
): unknown[] {
  return paths.map((path) => get(object, path));
}
