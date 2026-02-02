//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-18
import { parsePath } from "../string/parsers/path-parser";

/**
 * Gets the value at path of object with optional default.
 *
 * @template T - The type of the default value and return type.
 * @param object - The object to query.
 * @param path - Property path as dot notation string or array of keys (string, number, or symbol).
 * @param defaultValue - Value returned if resolved value is undefined.
 * @returns The resolved value or defaultValue.
 * @since 1.1.0
 *
 * @note Handles null/undefined objects and intermediate properties safely.
 * @note Supports bracket notation for arrays (e.g., 'items[0].name').
 * @note Blocks access to __proto__, constructor, and prototype for security.
 *
 * @performance O(m) time where m is path length.
 *
 * @see set
 *
 * @example
 * ```typescript
 * const obj = { a: { b: { c: 3 } } };
 *
 * get(obj, 'a.b.c');            // => 3
 * get(obj, 'a.b.d');            // => undefined
 * get(obj, 'a.b.d', 'default'); // => 'default'
 * get(obj, ['a', 'b', 'c']);    // => 3
 *
 * const data = { items: [{ name: 'first' }] };
 * get(data, 'items[0].name');   // => 'first'
 *
 * get(null, 'any.path', 'safe'); // => 'safe'
 * get({}, '__proto__');          // => undefined
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function get<T = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  path: string | (string | number | symbol)[],
  defaultValue?: T
): T | undefined {
  if (object == null) {
    return defaultValue;
  }

  const keys = Array.isArray(path) ? path : parsePath(path);
  let current = object;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return defaultValue;
    }

    if (
      // Stryker disable next-line ConditionalExpression: typeof guard is optimization - non-string keys can never equal "__proto__" string literals  
      typeof key === "string" &&
      (key === "__proto__" || key === "constructor" || key === "prototype")
    ) {
      return defaultValue;
    }

    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}
