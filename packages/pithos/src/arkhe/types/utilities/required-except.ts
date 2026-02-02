/**
 * Creates a type where all keys become required except the specified ones which remain optional.
 * @template Original - The original object type.
 * @template Keys - The keys that should remain optional.
 * @since 1.0.0
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
