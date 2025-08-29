/**
 * Represents a value that can be null
 * @template T - The base type
 * @example
 * ```typescript
 * type User = {
 *   name: string;
 *   avatar: Nullable<string>; // null | string
 * };
 *
 * const user: User = {
 *   name: "John",
 *   avatar: null // Valid
 * };
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Represents a value that can be undefined
 * @template T - The base type
 * @example
 * ```typescript
 * type Config = {
 *   apiKey: string;
 *   timeout: Optional<number>; // number | undefined
 * };
 *
 * const config: Config = {
 *   apiKey: "abc123",
 *   timeout: undefined // Valid
 * };
 * ```
 */
export type Optional<T> = T | undefined;

/**
 * Represents a value that can be null or undefined
 * @template T - The base type
 * @example
 * ```typescript
 * type Settings = {
 *   theme: string;
 *   language: Nullish<string>; // string | null | undefined
 * };
 *
 * const settings: Settings = {
 *   theme: "dark",
 *   language: null // Valid
 * };
 * ```
 */
export type Nullish<T> = T | null | undefined;
