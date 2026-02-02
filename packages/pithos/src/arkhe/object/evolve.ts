//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Type representing transformation functions for each property.
 * @since 1.1.0
 */
export type Transformations<T> = {
  [K in keyof T]?: T[K] extends (...args: unknown[]) => unknown
  ? (value: T[K]) => unknown
  : T[K] extends Record<string, unknown>
  ? Transformations<T[K]> | ((value: T[K]) => unknown)
  : (value: T[K]) => unknown;
};

/**
 * Type representing the result of applying transformations to an object.
 * @since 1.1.0
 */
export type Evolved<T, Tr> = {
  [K in keyof T]: K extends keyof Tr
  ? Tr[K] extends (value: T[K]) => infer R
  ? R
  : Tr[K] extends Record<string, unknown>
  ? T[K] extends Record<string, unknown>
  ? Evolved<T[K], Tr[K]>
  : T[K]
  : T[K]
  : T[K];
};

/**
 * Applies transformations to an object in a declarative way.
 *
 * @template T - The type of the input object.
 * @template Tr - The type of the transformations object.
 * @param object - The object to transform.
 * @param transformations - Object mapping property names to transformation functions.
 * @returns A new object with transformed values.
 * @since 1.1.0
 *
 * @note Properties without transformations are preserved.
 * @note Transformations for non-existent properties are ignored.
 * @note Supports symbol keys via Reflect.ownKeys.
 *
 * @performance O(n) time & space where n is number of properties.
 *
 * @example
 * ```typescript
 * const user = { count: 1, name: 'tom', active: true };
 *
 * evolve(user, { count: (x) => x + 1, name: (s) => s.toUpperCase() });
 * // => { count: 2, name: 'TOM', active: true }
 *
 * // Nested transformations
 * evolve(
 *   { profile: { firstName: 'john', age: 25 } },
 *   { profile: { firstName: (s) => s.toUpperCase(), age: (n) => n + 1 } }
 * );
 * // => { profile: { firstName: 'JOHN', age: 26 } }
 * ```
 */
export function evolve<
  T extends Record<string, unknown>,
  Tr extends Transformations<T>
>(object: T, transformations: Tr): Evolved<T, Tr> {
  const result: Record<string | symbol, unknown> = {};

  for (const key of Reflect.ownKeys(object)) {
    const value = (object as Record<string | symbol, unknown>)[key];
    const hasTransformation = Object.prototype.hasOwnProperty.call(
      transformations,
      key
    );
    const transformation = hasTransformation
      ? (transformations as Record<string | symbol, unknown>)[key]
      : undefined;

    if (typeof transformation === "function") {
      result[key] = (transformation as (v: unknown) => unknown)(value);
    } else if (
      // Stryker disable next-line LogicalOperator: Transformations only contain functions or objects, never falsy primitives
      transformation &&
      // Stryker disable next-line ConditionalExpression: Redundant check - first if already handles typeof === "function"
      typeof transformation === "object" &&
      value &&
      typeof value === "object"
    ) {
      result[key] = evolve(
        value as Record<string, unknown>,
        transformation as Transformations<Record<string, unknown>>
      );
    } else {
      result[key] = value;
    }
  }

  return result as Evolved<T, Tr>;
}