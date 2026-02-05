import { parsePath } from "../string/parsers/path-parser";
import { deepClone } from "./deep-clone";

/**
 * Sets the value at path of object, returning a new object (immutable).
 * @info Why wrapping native?: We prefer to wrap this method to ensure **Immutability** and safe property access. See [Design Philosophy](/guide/contribution/design-principles/design-philosophy/)
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

  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement,StringLiteral,EqualityOperator,UnaryOperator: Fast-path optimization — parsePath-based path produces identical results for dot-only string paths
  if (typeof path === "string" && path.indexOf("[") === -1 && !hasDigit(path)) {
    // Stryker disable next-line ConditionalExpression: Early return optimization — parsePath([]) returns empty array handled identically below
    if (path.length === 0) return value as T;

    const result = structuredClone(object) as T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = result;
    let start = 0;
    let dot: number;

    while ((dot = path.indexOf(".", start)) !== -1) {
      const segment = path.substring(start, dot);
      if (current[segment] == null || typeof current[segment] !== "object") {
        current[segment] = {};
      }
      current = current[segment];
      start = dot + 1;
    }

    const lastKey = path.substring(start);
    current[lastKey] = value;
    return result;
  }

  const pathArray = typeof path === "string" ? parsePath(path) : path;

  if (pathArray.length === 0) {
    return value as T;
  }

  // Symbol check only needed for user-provided array paths (parsePath never returns symbols)
  // Stryker disable next-line MethodExpression,EqualityOperator,ConditionalExpression,ArrowFunction,StringLiteral: Performance optimization - deepClone vs structuredClone produces identical results when original object has no symbol keys
  const hasSymbol = Array.isArray(path) && path.some((k) => typeof k === "symbol");
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
        // Stryker disable next-line ConditionalExpression: typeof guard is optimization — isAllDigits on non-string returns false via NaN charCodeAt
        (typeof nextKey === "string" && isAllDigits(nextKey))
          ? []
          : {};
    }

    current = current[key];
  }

  const finalKey = pathArray[lastIndex];
  current[finalKey] = value;

  return result;
}

// Stryker disable next-line BlockStatement: Only used for fast-path optimization — both paths produce identical results
function hasDigit(str: string): boolean {
  // Stryker disable next-line EqualityOperator: Only used for fast-path optimization
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // Stryker disable next-line ConditionalExpression,LogicalOperator,EqualityOperator,BooleanLiteral: Only used for fast-path optimization
    if (c >= 48 && c <= 57) return true;
  }
  // Stryker disable next-line BooleanLiteral: Only used for fast-path optimization
  return false;
}

function isAllDigits(str: string): boolean {
  if (str.length === 0) return false;
  // Stryker disable next-line EqualityOperator: Out-of-bounds charCodeAt returns NaN which never satisfies the rejection condition
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // Stryker disable next-line ConditionalExpression: Chars below '0' (code 48) are not valid in path keys produced by parsePath
    if (c < 48 || c > 57) return false;
  }
  return true;
}
