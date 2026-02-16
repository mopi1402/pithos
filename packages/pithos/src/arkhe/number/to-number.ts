/**
 * Converts any value to a number with fallback handling.
 *
 * @param value - The value to convert.
 * @param defaultValue - Default value if conversion fails.
 * @returns A number representation of the value.
 * @since 2.0.0
 *
 * @note Booleans convert to 1/0. Null/undefined/Symbol return default. NaN returns default.
 * @note BigInt values are converted to number (may lose precision for large values).
 *
 * @performance O(1)
 *
 * @example
 * ```typescript
 * toNumber('42');          // => 42
 * toNumber('3.14');        // => 3.14
 * toNumber('invalid');     // => 0 (default)
 * toNumber(true);          // => 1
 * toNumber(false);         // => 0
 * toNumber(null);          // => 0 (default)
 * toNumber('invalid', 10); // => 10 (custom default)
 * toNumber(10n);           // => 10 (BigInt)
 * ```
 */
export function toNumber(value: unknown, defaultValue = 0): number {
  if (value == null) return defaultValue;
  // Stryker disable next-line all: equivalent mutant, Number(true)=1 and Number(false)=0, same as explicit conversion
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "symbol") return defaultValue;

  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
}
