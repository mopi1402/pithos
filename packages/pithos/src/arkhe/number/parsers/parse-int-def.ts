//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
import { Nullish } from "@arkhe/types/common/nullish";

/**
 * Parses a string to an integer with a fallback default value.
 *
 * @param value - The string value to parse (can be nullish or empty).
 * @param defaultValue - The value to return if parsing fails.
 * @param radix - The radix (base 2-36) for parsing.
 * @returns The parsed integer or default value.
 * @since 1.1.0
 *
 * @note Returns default for null, undefined, empty strings, and NaN results.
 *
 * @see parseFloatDef
 *
 * @example
 * ```typescript
 * parseIntDef('42');            // => 42
 * parseIntDef('invalid');       // => null
 * parseIntDef('invalid', 0);    // => 0
 * parseIntDef('1010', null, 2); // => 10 (binary)
 * parseIntDef('FF', null, 16);  // => 255 (hex)
 * ```
 */
export function parseIntDef(
  value: Nullish<string>,
  defaultValue: Nullish<number> = null,
  radix?: number
): number | null {
  // Stryker disable next-line ConditionalExpression: equivalent mutant, parseInt returns NaN for empty/null which triggers defaultValue
  if (!value) return defaultValue;
  const parsed = parseInt(value, radix);
  return isNaN(parsed) ? defaultValue : parsed;
}
