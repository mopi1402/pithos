/**
 * Creates a type where specified keys remain required while others become optional.
 * @template Original - The original object type.
 * @template Keys - The keys that should remain required.
 * @since 1.0.0
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
