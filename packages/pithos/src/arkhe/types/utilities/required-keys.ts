/**
 * Creates a type where specified keys become required while others remain unchanged.
 * @template Original - The original object type.
 * @template Keys - The keys that should become required.
 * @since 1.0.0
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
