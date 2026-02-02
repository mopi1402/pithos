/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 *
 * @param value - The value to compare.
 * @param other - The other value to compare.
 * @returns `true` if the values are equivalent, else `false`.
 * @since 1.1.0
 *
 * @note Supports Date, RegExp, Map, Set, arrays, and plain objects. Uses SameValueZero (NaN === NaN). Handles circular references.
 *
 * @performance O(n) where n is the total number of properties/elements to compare.
 * O(n²) for Sets containing objects (due to deep matching).
 *
 * @example
 * ```typescript
 * // Primitives
 * isEqual(1, 1);                                  // => true
 * isEqual('hello', 'hello');                      // => true
 * isEqual(NaN, NaN);                              // => true
 *
 * // Objects and arrays
 * isEqual({ a: 1 }, { a: 1 });                    // => true
 * isEqual([1, 2, 3], [1, 2, 3]);                  // => true
 * isEqual({ a: { b: 2 } }, { a: { b: 2 } });      // => true
 *
 * // Built-in types
 * isEqual(new Date('2024-01-01'), new Date('2024-01-01')); // => true
 * isEqual(/abc/gi, /abc/gi);                      // => true
 * isEqual(new Map([['a', 1]]), new Map([['a', 1]])); // => true
 * isEqual(new Set([1, 2]), new Set([1, 2]));     // => true
 *
 * // Different values
 * isEqual({ a: 1 }, { a: 2 });                    // => false
 * isEqual([1, 2], [1, 2, 3]);                     // => false
 *
 * // Different types
 * isEqual([], {});                                // => false
 * isEqual(new Date(), {});                        // => false
 * ```
 */
export function isEqual(value: unknown, other: unknown): boolean {
  return isEqualDeep(value, other, new Map());
}

/**
 * Internal recursive comparison with circular reference tracking.
 */
function isEqualDeep(
  value: unknown,
  other: unknown,
  seen: Map<unknown, unknown>
): boolean {
  if (Object.is(value, other)) {
    return true;
  }

  if (
    value === null ||
    other === null ||
    // Stryker disable next-line ConditionalExpression: Optimization - constructor check handles primitives
    typeof value !== "object" ||
    typeof other !== "object"
  ) {
    return false;
  }

  if (value.constructor !== other.constructor) {
    return false;
  }

  if (seen.has(value)) {
    return seen.get(value) === other;
  }
  seen.set(value, other);

  if (value instanceof Date) {
    return value.getTime() === (other as Date).getTime();
  }

  if (value instanceof RegExp) {
    const otherRegExp = other as RegExp;
    return (
      value.source === otherRegExp.source && value.flags === otherRegExp.flags
    );
  }

  if (value instanceof Map) {
    const otherMap = other as Map<unknown, unknown>;
    if (value.size !== otherMap.size) {
      return false;
    }
    for (const [key, val] of value) {
      if (!otherMap.has(key) || !isEqualDeep(val, otherMap.get(key), seen)) {
        return false;
      }
    }
    return true;
  }

  if (value instanceof Set) {
    const otherSet = other as Set<unknown>;
    if (value.size !== otherSet.size) {
      return false;
    }

    const matchedIndices = new Set<number>();
    for (const item of value) {
      let found = false;
      let index = 0;
      for (const otherItem of otherSet) {
        if (!matchedIndices.has(index) && isEqualDeep(item, otherItem, seen)) {
          matchedIndices.add(index);
          found = true;
          break;
        }
        // Stryker disable next-line UpdateOperator: Index direction irrelevant - uniqueness of indices is preserved
        index++;
      }
      if (!found) {
        return false;
      }
    }
    return true;
  }

  // Stryker disable next-line ConditionalExpression,BlockStatement: Optimization - object comparison handles arrays
  if (Array.isArray(value)) {
    const otherArray = other as unknown[];
    if (value.length !== otherArray.length) {
      return false;
    }

    // Stryker disable next-line EqualityOperator: Bounds check - accessing beyond length returns undefined which equals undefined
    for (let i = 0; i < value.length; i++) {
      if (!isEqualDeep(value[i], otherArray[i], seen)) {
        return false;
      }
    }
    return true;
  }

  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) {
    return false;
  }

  for (const key of valueKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(other, key) ||
      !isEqualDeep(
        (value as Record<string, unknown>)[key],
        (other as Record<string, unknown>)[key],
        seen
      )
    ) {
      return false;
    }
  }

  return true;
}