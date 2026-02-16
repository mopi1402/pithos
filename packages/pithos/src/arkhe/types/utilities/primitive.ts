/**
 * Union of all JavaScript primitive types.
 *
 * Useful for type guards and generic constraints.
 *
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * function isPrimitive(value: unknown): value is Primitive {
 *   return value === null || (typeof value !== "object" && typeof value !== "function");
 * }
 *
 * isPrimitive("hello"); // true
 * isPrimitive(42); // true
 * isPrimitive({}); // false
 * isPrimitive([]); // false
 * ```
 */
export type Primitive =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;
