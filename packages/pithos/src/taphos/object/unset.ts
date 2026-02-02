import { parsePath } from "../../arkhe/string/parsers/path-parser";
import { deepClone } from "../../arkhe/object/deep-clone";

/**
 * Removes the property at path of object, returning a new object (immutable).
 *
 * @template T - The type of the input object.
 * @param object - The object to modify.
 * @param path - The path of the property to unset.
 * @returns A new object with the property removed.
 * @deprecated Use destructuring or `omit` for immutable property removal.
 * @see omit
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * const object = { a: { b: { c: 3 } } };
 *
 * // ❌ Deprecated approach
 * unset(object, 'a.b.c');
 * // => { a: { b: {} } }
 *
 * // ✅ Recommended approach (for shallow properties)
 * const { c, ...rest } = object.a.b;
 * // rest = {}
 *
 * // ✅ Recommended approach (for nested properties)
 * import { omit } from '@pithos/arkhe/object/omit';
 * // or use immutability-helper, immer, etc.
 * ```
 */
export function unset<T extends object>(
  object: T,
  path: string | (string | number | symbol)[]
): T {
  if (object == null) {
    return object;
  }

  const pathArray = typeof path === "string" ? parsePath(path) : path;

  if (pathArray.length === 0) {
    return object;
  }

  const hasSymbol = pathArray.some((k) => typeof k === "symbol");
  const result = (hasSymbol ? deepClone(object) : structuredClone(object)) as T;

  // INTENTIONAL: any required for dynamic nested property traversal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = result;

  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    // Stryker disable next-line ConditionalExpression: typeof check is defensive; accessing property on primitive returns undefined which triggers == null check
    if (current[key] == null || typeof current[key] !== "object") {
      return result;
    }
    current = current[key];
  }

  const lastKey = pathArray[pathArray.length - 1];
  delete current[lastKey];

  return result;
}
