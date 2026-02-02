/**
 * Defines a typed object entry as a tuple of [key, value].
 * @template T - The object type.
 * @since 1.0.0
 * @example
 * ```typescript
 * type User = {
 *   name: string;
 *   age: number;
 * };
 *
 * // Entry<User> resolves to: ["name", string] | ["age", number]
 * const entries: Entry<User>[] = Object.entries(user);
 *
 * entries.forEach(([key, value]) => {
 *   // key is typed as "name" | "age"
 *   // value is typed as string | number
 *   console.log(`${key}: ${value}`);
 * });
 * ```
 */
export type Entry<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
