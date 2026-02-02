//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-18
// INTENTIONAL: any required for recursive deep merge; type inference via T & U at call site
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<PropertyKey, any>;

function mergeDeep<T extends AnyRecord, U extends AnyRecord>(
  left: T,
  right: U,
  preferRight: boolean
): T & U {
  if (left == null) return right as T & U;
  if (right == null) return left as T & U;

  if (typeof left !== "object" || typeof right !== "object") {
    return (preferRight ? right : left) as T & U;
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    return (preferRight ? right : left) as T & U;
  }

  // INTENTIONAL: any required for recursive deep merge; type inference via T & U at call site
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = { ...left };

  for (const key of Reflect.ownKeys(right)) {
    const leftVal = result[key];
    const rightVal = (right as AnyRecord)[key];

    if (
      // Stryker disable next-line ConditionalExpression,LogicalOperator: key check is redundant - if key not in result, leftVal is undefined and typeof check fails
      key in result &&
      // Stryker disable next-line ConditionalExpression,LogicalOperator: typeof check is redundant - mergeDeep handles primitives identically via early return  
      typeof leftVal === "object" &&
      leftVal !== null &&
      !Array.isArray(leftVal) &&
      // Stryker disable next-line ConditionalExpression,LogicalOperator: typeof check is redundant - mergeDeep handles primitives identically, else-if preferRight produces same result  
      typeof rightVal === "object" &&
      rightVal !== null &&
      !Array.isArray(rightVal)
    ) {
      result[key] = mergeDeep(leftVal, rightVal, preferRight);
    } else if (!(key in result)) {
      result[key] = rightVal;
    } else if (preferRight) {
      result[key] = rightVal;
    }
  }

  return result as T & U;
}

/**
 * Recursively merges objects, with left values taking precedence.
 *
 * @template T - The type of the left object.
 * @template U - The type of the right object.
 * @param left - The left object (takes precedence).
 * @param right - The right object (fallback values).
 * @returns A new deeply merged object.
 * @since 1.1.0
 *
 * @note Arrays are replaced, not merged.
 * @note Symbol keys are included via Reflect.ownKeys.
 *
 * @performance O(n) time & space where n is total number of properties. Early returns for null/undefined/primitives/arrays. Uses spread operator for shallow copy.
 *
 * @see mergeDeepRight
 *
 * @example
 * ```typescript
 * const left = { user: { name: 'John', age: 30 } };
 * const right = { user: { name: 'Jane', email: 'jane@example.com' } };
 *
 * mergeDeepLeft(left, right);
 * // => { user: { name: 'John', age: 30, email: 'jane@example.com' } }
 *
 * // Arrays: left wins
 * mergeDeepLeft({ items: [1, 2] }, { items: [3, 4] });
 * // => { items: [1, 2] }
 * ```
 */
export function mergeDeepLeft<T extends AnyRecord, U extends AnyRecord>(
  left: T,
  right: U
): T & U {
  return mergeDeep(left, right, false);
}

/**
 * Recursively merges objects, with right values taking precedence.
 *
 * @template T - The type of the left object.
 * @template U - The type of the right object.
 * @param left - The left object (fallback values).
 * @param right - The right object (takes precedence).
 * @returns A new deeply merged object.
 * @since 1.1.0
 *
 * @note Arrays are replaced, not merged.
 * @note Symbol keys are included via Reflect.ownKeys.
 *
 * @performance O(n) time & space where n is total number of properties. Early returns for null/undefined/primitives/arrays. Uses spread operator for shallow copy.
 *
 * @see mergeDeepLeft
 *
 * @example
 * ```typescript
 * const left = { user: { name: 'John', age: 30 } };
 * const right = { user: { name: 'Jane', email: 'jane@example.com' } };
 *
 * mergeDeepRight(left, right);
 * // => { user: { name: 'Jane', age: 30, email: 'jane@example.com' } }
 *
 * // Arrays: right wins
 * mergeDeepRight({ items: [1, 2] }, { items: [3, 4] });
 * // => { items: [3, 4] }
 * ```
 */
export function mergeDeepRight<T extends AnyRecord, U extends AnyRecord>(
  left: T,
  right: U
): T & U {
  return mergeDeep(left, right, true);
}
