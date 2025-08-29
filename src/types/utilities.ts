/**
 * Defines a typed object entry as a tuple of [key, value]
 * @template T - The object type
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

/**
 * Extracts the key and value types from a Map and converts them to an array of tuples
 * @template MapToConvert - The Map type to convert
 * @example
 * ```typescript
 * const userMap = new Map<string, number>([
 *   ["John", 25],
 *   ["Jane", 30]
 * ]);
 *
 * // MapEntries<typeof userMap> resolves to: [string, number][]
 * const entries: MapEntries<typeof userMap> = Array.from(userMap);
 *
 * entries.forEach(([key, value]) => {
 *   // key is typed as string
 *   // value is typed as number
 *   console.log(`${key}: ${value}`);
 * });
 * ```
 */
export type MapEntries<MapToConvert> = MapToConvert extends Map<
  infer Key,
  infer Value
>
  ? [Key, Value][]
  : never;

/**
 * Creates a type where specified keys remain required while others become optional
 * @template Original - The original object type
 * @template Keys - The keys that should remain required
 * @example
 * ```typescript
 * type User = {
 *   id: string;
 *   name: string;
 *   email?: string;
 *   avatar?: string;
 * };
 *
 * // PartialExcept<User, "id" | "name">
 * // Results in: { id: string; name: string; email?: string; avatar?: string; }
 * type UserUpdate = PartialExcept<User, "id" | "name">;
 *
 * const update: UserUpdate = {
 *   id: "123",        // Required (kept as required)
 *   name: "John",     // Required (kept as required)
 *   // email and avatar are optional (became optional)
 * };
 * ```
 */
export type PartialExcept<Original, Keys extends keyof Original> = Partial<
  Omit<Original, Keys>
> &
  Required<Pick<Original, Keys>>;

/**
 * Creates a type where specified keys become optional while others remain required
 * @template Original - The original object type
 * @template Keys - The keys that should become optional
 * @example
 * ```typescript
 * type User = {
 *   id: string;
 *   name: string;
 *   email: string;
 *   avatar: string;
 * };
 *
 * // PartialKeys<User, "email" | "avatar">
 * // Results in: { id: string; name: string; email?: string; avatar?: string; }
 * type UserForm = PartialKeys<User, "email" | "avatar">;
 *
 * const form: UserForm = {
 *   id: "123",        // Required (unchanged)
 *   name: "John",     // Required (unchanged)
 *   // email and avatar are optional (became optional)
 * };
 * ```
 */
export type PartialKeys<Original, Keys extends keyof Original> = Omit<
  Original,
  Keys
> &
  Partial<Pick<Original, Keys>>;

/**
 * Creates a type where specified keys become required while others remain unchanged
 * @template Original - The original object type
 * @template Keys - The keys that should become required
 * @example
 * ```typescript
 * type User = {
 *   id: string;
 *   name?: string;     // Optional
 *   email?: string;    // Optional
 *   avatar?: string;   // Optional
 * };
 *
 * // RequiredKeys<User, "name" | "email">
 * // Results in: { id: string; name: string; email: string; avatar?: string; }
 * type UserRequired = RequiredKeys<User, "name" | "email">;
 *
 * const user: UserRequired = {
 *   id: "123",        // Required (unchanged)
 *   name: "John",     // Required (became required)
 *   email: "john@example.com", // Required (became required)
 *   // avatar remains optional (unchanged)
 * };
 * ```
 */
export type RequiredKeys<Original, Keys extends keyof Original> = Omit<
  Original,
  Keys
> &
  Required<Pick<Original, Keys>>;

/**
 * Creates a type where all keys become required except the specified ones which remain optional
 * @template Original - The original object type
 * @template Keys - The keys that should remain optional
 * @example
 * ```typescript
 * type User = {
 *   id?: string;      // Optional
 *   name?: string;    // Optional
 *   email?: string;   // Optional
 *   avatar?: string;  // Optional
 * };
 *
 * // RequiredExcept<User, "avatar">
 * // Results in: { id: string; name: string; email: string; avatar?: string; }
 * type UserRequired = RequiredExcept<User, "avatar">;
 *
 * const user: UserRequired = {
 *   id: "123",        // Required (became required)
 *   name: "John",     // Required (became required)
 *   email: "john@example.com", // Required (became required)
 *   // avatar remains optional (kept as optional)
 * };
 * ```
 */
export type RequiredExcept<Original, Keys extends keyof Original> = Required<
  Omit<Original, Keys>
> &
  Partial<Pick<Original, Keys>>;
