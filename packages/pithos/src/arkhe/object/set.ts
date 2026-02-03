import { parsePath } from "../string/parsers/path-parser";
import { deepClone } from "./deep-clone";

/**
 * Sets the value at path of object, returning a new object (immutable).
 * @info Why wrapping native?: We prefer to wrap this method to ensure **Immutability** and safe property access. See [Design Philosophy](/guide/design-principles/design-philosophy/)
 *
 * @template T - The type of the input object.
 * @param object - The object to set the value in.
 * @param path - Property path (dot notation string, symbol, or array of keys).
 * @param value - The value to set.
 * @returns A new object with the value set at the specified path.
 * @since 1.1.0
 *
 * @note Creates intermediate objects/arrays as needed based on path structure.
 * @note Uses structuredClone for performance; falls back to deepClone for symbol keys.
 *
 * @performance O(n + m) time & space where n is object size, m is path length. structuredClone when possible (faster), deepClone only for symbol keys. Early returns for null/empty path.
 *
 * @see get
 *
 * @example
 * ```typescript
 * const obj = { a: { b: { c: 3 } } };
 *
 * set(obj, 'a.b.c', 42);       // => { a: { b: { c: 42 } } }
 * set(obj, ['a', 'b', 'd'], 'new'); // => { a: { b: { c: 3, d: 'new' } } }
 *
 * // Create nested structures automatically
 * set({}, 'user.profile.name', 'John');
 * // => { user: { profile: { name: 'John' } } }
 *
 * // Array creation with bracket notation
 * set({}, 'items[0].value', 42);
 * // => { items: [{ value: 42 }] }
 * ```
 */
// INTENTIONAL: any required for dynamic path access; type inference works at call site via generic T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function set<T = any>(
  object: T,
  path: string | symbol | (string | number | symbol)[],
  // INTENTIONAL: any required for dynamic value assignment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
): T {
  if (object == null) {
    return value as T;
  }

  if (typeof path === "symbol") {
    return { ...object, [path]: value } as T;
  }

  const pathArray = typeof path === "string" ? parsePath(path) : path;

  if (pathArray.length === 0) {
    return value as T;
  }

  // Stryker disable next-line MethodExpression,EqualityOperator,ConditionalExpression,ArrowFunction,StringLiteral: Performance optimization - deepClone vs structuredClone produces identical results when original object has no symbol keys
  const hasSymbol = pathArray.some((k) => typeof k === "symbol");
  const result = (hasSymbol ? deepClone(object) : structuredClone(object)) as T;

  // Navigate to the target location and set the value
  // INTENTIONAL: any required for dynamic nested property traversal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = result;
  const lastIndex = pathArray.length - 1;

  for (let i = 0; i < lastIndex; i++) {
    const key = pathArray[i];

    if (current[key] == null || typeof current[key] !== "object") {
      const nextKey = pathArray[i + 1];
      current[key] =
        typeof nextKey === "number" ||
          // Stryker disable next-line ConditionalExpression: Redundant with typeof === "number" check above    
          (typeof nextKey === "string" && /^\d+$/.test(nextKey))
          ? []
          : {};
    }

    current = current[key];
  }

  const finalKey = pathArray[lastIndex];
  current[finalKey] = value;

  return result;
}
