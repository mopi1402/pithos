//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Checks if a value is a function.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a function, `false` otherwise.
 * @since 1.1.0
 *
 * @note Includes arrow functions, regular functions, async functions, and class constructors.
 *
 * @example
 * ```typescript
 * isFunction(() => {});       // => true
 * isFunction(function() {});  // => true
 * isFunction(async () => {}); // => true
 * isFunction(class {});       // => true
 * isFunction({});             // => false
 * ```
 */
// INTENTIONAL: any required for generic function typing; value is validated at runtime
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (value: unknown): value is Function =>
  typeof value === "function";
