// INTENTIONAL: Cast to any to access private members in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type testAny = any;

/**
 * Casts a value to a target type for test access to private members.
 *
 * @template T - The target type to cast to.
 * @param obj - The value to cast.
 * @returns The value cast to the target type.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * class MyClass {
 *   private secret = 42;
 * }
 *
 * const instance = new MyClass();
 * const exposed = cast<{ secret: number }>(instance);
 * expect(exposed.secret).toBe(42);
 * ```
 */
export const cast = <T = testAny>(obj: unknown): T => obj as T;

/**
 * Casts a value to an array type for tests.
 *
 * @template T - The array element type.
 * @param obj - The value to cast.
 * @returns The value cast to `T[]`.
 * @since 1.1.0
 */
export const castArray = <T = testAny>(obj: unknown): T[] => obj as T[];

/**
 * Casts a value to a Map type for tests.
 *
 * @template K - The key type.
 * @template V - The value type.
 * @param obj - The value to cast.
 * @returns The value cast to `Map<K, V>`.
 * @since 1.1.0
 */
export const castMap = <K = string, V = testAny>(obj: unknown): Map<K, V> =>
  obj as Map<K, V>;

/** Pre-cast null for test assertions. */
export const testNull = cast(null);

/** Pre-cast undefined for test assertions. */
export const testUndefined = cast(undefined);
