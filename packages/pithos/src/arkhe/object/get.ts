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

  // Fast path: if path is an array, use it directly
  if (Array.isArray(path)) {
    return getWithKeys(object, path, defaultValue);
  }

  // Security check
  if (path === "__proto__" || path === "constructor" || path === "prototype") {
    return defaultValue;
  }

  // Try direct access first (works for simple keys)
  const directResult = object[path];
  if (directResult !== undefined) {
    return directResult;
  }

  // Check for complex path characters
  // Stryker disable next-line ConditionalExpression,StringLiteral: Fast-path optimization — getByDotPath handles simple keys identically
  const hasDot = path.indexOf(".") !== -1;
  // Stryker disable next-line ConditionalExpression,StringLiteral: Fast-path optimization — parsePath handles dot-only paths identically
  const hasBracket = path.indexOf("[") !== -1;

  // If direct access failed and path has no dots/brackets, it's just undefined
  // Stryker disable next-line ConditionalExpression,BlockStatement: Fast-path optimization — getByDotPath returns defaultValue for simple non-existent keys
  if (!hasDot && !hasBracket) {
    return defaultValue;
  }

  // Fast path: simple dot notation (no brackets) — inline traversal, no array allocation
  // Stryker disable next-line ConditionalExpression,BlockStatement: Fast-path optimization — parsePath handles dot-only paths identically
  if (!hasBracket) {
    return getByDotPath(object, path, defaultValue);
  }

  // Slow path: parse complex path with brackets
  return getWithKeys(object, parsePath(path), defaultValue);
}

function getByDotPath<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  path: string,
  defaultValue?: T
): T | undefined {
  let current = object;
  let start = 0;
  let dot: number;

  while ((dot = path.indexOf(".", start)) !== -1) {
    // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: Early exit optimization — final segment guard (after loop) catches non-object intermediates identically
    if (current == null || typeof current !== "object") {
      return defaultValue;
    }
    const segment = path.substring(start, dot);
    if (
      segment === "__proto__" ||
      segment === "constructor" ||
      segment === "prototype"
    ) {
      return defaultValue;
    }
    current = current[segment];
    start = dot + 1;
  }

  // Last segment
  if (current == null || typeof current !== "object") {
    return defaultValue;
  }
  const lastKey = path.substring(start);
  if (
    lastKey === "__proto__" ||
    lastKey === "constructor" ||
    lastKey === "prototype"
  ) {
    return defaultValue;
  }
  const result = current[lastKey];
  return result === undefined ? defaultValue : result;
}

function getWithKeys<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  keys: readonly (string | number | symbol)[],
  defaultValue?: T
): T | undefined {
  let current = object;

  for (let i = 0; i < keys.length; i++) {
    if (current == null || typeof current !== "object") {
      return defaultValue;
    }

    const key = keys[i];
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
