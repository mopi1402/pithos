/**
 * Like `Omit<T, K>` but enforces that K must be a key of T.
 *
 * TypeScript's built-in `Omit` accepts any string as K, which can hide typos.
 * `StrictOmit` catches these errors at compile time.
 *
 * @template T - The object type
 * @template K - The keys to omit (must exist in T)
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * type User = { id: string; name: string; email: string };
 *
 * type WithoutEmail = StrictOmit<User, "email">;
 * // = { id: string; name: string }
 *
 * type Typo = StrictOmit<User, "emial">;
 * // ❌ Error: Type '"emial"' does not satisfy the constraint 'keyof User'
 * ```
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
