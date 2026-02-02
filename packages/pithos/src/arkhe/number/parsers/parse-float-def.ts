//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
import { Nullish } from "@arkhe/types/common/nullish";
import { parseFloat } from "./parse-float";

/**
 * Parses a string to a float with a fallback default value.
 *
 * @param value - The string value to parse (can be nullish or empty).
 * @param defaultValue - The value to return if parsing fails.
 * @returns The parsed float or default value.
 * @since 1.1.0
 *
 * @note Returns default for null, undefined, empty strings, and invalid inputs.
 *
 * @see parseFloat
 * @see parseIntDef
 *
 * @example
 * ```typescript
 * parseFloatDef('42.99', 0);   // => 42.99
 * parseFloatDef('invalid', 0); // => 0
 * parseFloatDef('', 10.5);     // => 10.5
 * parseFloatDef(null, 1.0);    // => 1.0
 * ```
 */
export function parseFloatDef(
  value: Nullish<string>,
  defaultValue: number
): number {
  // Stryker disable next-line ConditionalExpression: equivalent mutant, parseFloat returns defaultValue for NaN which includes empty/null
  if (!value) return defaultValue;
  return parseFloat(value, defaultValue);
}
