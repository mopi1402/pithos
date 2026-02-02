/**
 * Returns the value if it's not null, undefined, or NaN; otherwise returns the default value.
 *
 * @template T - The type of the value.
 * @template D - The type of the default value.
 * @param value - The value to check.
 * @param defaultValue - The default value.
 * @returns The value if valid, otherwise the default value.
 * @since 1.1.0
 *
 * @note Unlike `??` (nullish coalescing), this also handles NaN.
 *
 * @example
 * ```typescript
 * defaultTo(1, 10);         // => 1
 * defaultTo(undefined, 10); // => 10
 * defaultTo(null, 10);      // => 10
 * defaultTo(NaN, 10);       // => 10
 *
 * // Compare with ?? operator
 * NaN ?? 10;                // => NaN
 * defaultTo(NaN, 10);       // => 10
 *
 * // Type narrowing
 * const value: string | undefined = getValue();
 * const result = defaultTo(value, 'default'); // => string
 * ```
 */
export function defaultTo<T, D>(
  value: T | null | undefined,
  defaultValue: D
): T | D {
  // Stryker disable next-line ConditionalExpression: Type guard is a performance optimization - Number.isNaN returns false for non-numbers anyway  
  if (value == null || (typeof value === "number" && Number.isNaN(value))) {
    return defaultValue;
  }
  return value;
}
