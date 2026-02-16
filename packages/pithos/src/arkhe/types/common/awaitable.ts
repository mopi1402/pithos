/**
 * Represents a value that can be awaited (either the value itself or a Promise-like).
 * @template T - The base type.
 * @since 2.0.0
 * @example
 * ```typescript
 * async function processData(data: Awaitable<string>): Promise<string> {
 *   const result = await data; // Works with both string and Promise<string>
 *   return result.toUpperCase();
 * }
 *
 * processData("hello"); // Valid
 * processData(Promise.resolve("world")); // Valid
 * ```
 */
export type Awaitable<T> = T | PromiseLike<T>;
