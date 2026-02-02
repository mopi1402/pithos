/**
 * Represents a value that can be null or undefined.
 * @template T - The base type.
 * @since 1.0.0
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
