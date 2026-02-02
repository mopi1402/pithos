/**
 * Represents a value that can be either a single item or an array of items.
 * @template T - The base type.
 * @since 1.0.0
 * @example
 * ```typescript
 * function processItems(items: Arrayable<string>): string[] {
 *   return Array.isArray(items) ? items : [items];
 * }
 *
 * processItems("single"); // Returns ["single"]
 * processItems(["a", "b"]); // Returns ["a", "b"]
 * ```
 */
export type Arrayable<T> = T | T[];
