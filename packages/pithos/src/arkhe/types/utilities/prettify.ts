/**
 * Flattens intersection types for better IDE display.
 *
 * When you have `A & B & C`, the IDE often shows the raw intersection.
 * `Prettify<T>` forces TypeScript to expand it into a single object type,
 * making hover tooltips much more readable.
 *
 * @template T - The type to prettify
 * @since 1.0.13
 *
 * @example
 * ```typescript
 * type A = { a: string };
 * type B = { b: number };
 * type C = { c: boolean };
 *
 * type Ugly = A & B & C;
 * // IDE shows: A & B & C
 *
 * type Pretty = Prettify<A & B & C>;
 * // IDE shows: { a: string; b: number; c: boolean }
 * ```
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
