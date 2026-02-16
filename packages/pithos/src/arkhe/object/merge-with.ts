import { isPlainObject } from "@arkhe/is/guard/is-plain-object";

/**
 * Recursively merges objects using a customizer function to resolve conflicts.
 *
 * @template T - The type of the target object.
 * @template U - The type of the source object.
 * @param object - The destination object.
 * @param source - The source object.
 * @param customizer - The function to customize assigned values.
 * @returns A new deeply merged object.
 * @since 2.0.0
 *
 * @note If customizer returns `undefined`, merging is handled by the default strategy.
 * @note Arrays are replaced by default unless customizer handles them.
 *
 * @performance O(n) where n is total number of properties.
 *
 * @example
 * ```typescript
 * // Concatenate arrays instead of replacing
 * mergeWith(
 *   { items: [1, 2] },
 *   { items: [3, 4] },
 *   (objValue, srcValue) => {
 *     if (Array.isArray(objValue) && Array.isArray(srcValue)) {
 *       return objValue.concat(srcValue);
 *     }
 *     return undefined; // Use default merge
 *   }
 * );
 * // => { items: [1, 2, 3, 4] }
 *
 * // Sum numeric values
 * mergeWith(
 *   { a: 1, b: 2 },
 *   { a: 3, b: 4 },
 *   (objValue, srcValue) => {
 *     if (typeof objValue === 'number' && typeof srcValue === 'number') {
 *       return objValue + srcValue;
 *     }
 *     return undefined;
 *   }
 * );
 * // => { a: 4, b: 6 }
 * ```
 */
export function mergeWith<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  object: T,
  source: U,
  customizer: (
    objValue: unknown,
    srcValue: unknown,
    key: string,
    object: T,
    source: U
  ) => unknown
): T & U {
  return mergeWithDeep(object, source, customizer) as T & U;
}

function mergeWithDeep<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  object: T,
  source: U,
  customizer: (
    objValue: unknown,
    srcValue: unknown,
    key: string,
    object: T,
    source: U
  ) => unknown
): Record<string, unknown> {
  // INTENTIONAL: any required for recursive deep merge
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = { ...object };

  for (const key of Object.keys(source)) {
    const objValue = result[key];
    const srcValue = source[key];

    const customResult = customizer(objValue, srcValue, key, object, source);

    if (customResult !== undefined) {
      result[key] = customResult;
    } else if (
      isPlainObject(objValue) &&
      isPlainObject(srcValue)
    ) {
      result[key] = mergeWithDeep(
        objValue as Record<string, unknown>,
        srcValue as Record<string, unknown>,
        customizer as (
          objValue: unknown,
          srcValue: unknown,
          key: string,
          object: Record<string, unknown>,
          source: Record<string, unknown>
        ) => unknown
      );
    } else {
      result[key] = srcValue;
    }
  }

  return result;
}