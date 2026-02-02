/**
 * Creates a type where specified keys become optional while others remain required.
 * @template Original - The original object type.
 * @template Keys - The keys that should become optional.
 * @since 1.0.0
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
