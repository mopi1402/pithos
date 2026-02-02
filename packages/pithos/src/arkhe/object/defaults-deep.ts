import { isPlainObject } from "@arkhe/is/guard/is-plain-object";

/**
 * Recursively assigns source properties to destination only where destination is undefined.
 *
 * @template T - The type of the destination object.
 * @param object - The destination object.
 * @param sources - The source objects.
 * @returns A new object with deep defaults applied (does not mutate original).
 * @since 1.1.0
 *
 * @note Only `undefined` values are replaced. `null` values are preserved.
 * @note Arrays are replaced, not merged.
 *
 * @performance O(n×m) where n = total properties, m = depth.
 *
 * @example
 * ```typescript
 * const target = { a: { b: undefined, c: 3 } };
 * const source = { a: { b: 2, d: 4 }, e: 5 };
 *
 * defaultsDeep(target, source);
 * // => { a: { b: 2, c: 3, d: 4 }, e: 5 }
 *
 * // null is preserved (not undefined)
 * defaultsDeep({ a: { b: null } }, { a: { b: 'fallback' } });
 * // => { a: { b: null } }
 *
 * // Arrays are replaced, not merged
 * defaultsDeep({ items: undefined }, { items: [1, 2] });
 * // => { items: [1, 2] }
 * ```
 */
export function defaultsDeep<T extends Record<string, unknown>>(
  object: T,
  ...sources: Record<string, unknown>[]
): T {
  const result = deepCloneSimple(object) as Record<string, unknown>;

  for (let i = 0; i < sources.length; i++) {
    assignDeepDefaults(result, sources[i]);
  }

  return result as T;
}

function deepCloneSimple<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    // Stryker disable next-line ArrayDeclaration: Array preallocation - content is overwritten by iteration
    const result: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      result[i] = deepCloneSimple(value[i]);
    }
    return result as T;
  }

  const keys = Object.keys(value);
  const result: Record<string, unknown> = {};
  // Stryker disable next-line EqualityOperator: Bounds check - keys[keys.length] returns undefined which is handled
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = deepCloneSimple((value as Record<string, unknown>)[key]);
  }
  return result as T;
}

function assignDeepDefaults(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  const keys = Object.keys(source);
  // Stryker disable next-line EqualityOperator: Bounds check - keys[keys.length] returns undefined which is handled
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const sourceValue = source[key];
    const targetValue = target[key];

    if (targetValue === undefined) {
      target[key] = deepCloneSimple(sourceValue);
    } else if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      assignDeepDefaults(targetValue, sourceValue);
    }
  }
}
