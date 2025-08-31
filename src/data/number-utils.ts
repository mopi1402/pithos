import { Nullish, Nullable } from "../types/common";

/**
 * Safely parses a string to a float number with a fallback default value.
 *
 * This function provides a safe way to convert string values to floating-point numbers
 * without throwing errors or returning NaN. It handles null, undefined, and invalid
 * string inputs gracefully by returning the specified default value.
 *
 * @param value - The string value to parse (can be null, undefined, or empty)
 * @param defaultValue - The value to return if parsing fails (default: null)
 * @returns The parsed float number, default value, or null if parsing fails
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Basic parsing
 * parseFloatDef("42.99")           // Returns: 42.99
 * parseFloatDef("invalid")         // Returns: null
 * parseFloatDef("")                // Returns: null
 * parseFloatDef(null)              // Returns: null
 * parseFloatDef(undefined)         // Returns: null
 *
 * // With custom default value
 * parseFloatDef("invalid", 0)      // Returns: 0
 * parseFloatDef("", 10.5)          // Returns: 10.5
 * parseFloatDef(null, 1.0)         // Returns: 1.0
 *
 * // Real-world usage
 * const price = parseFloatDef(userInput.price, 0);        // Never get NaN
 * const quantity = parseFloatDef(formData.quantity, 1);   // Safe fallback
 * const discount = parseFloatDef(apiResponse.discount, 0.1); // Default 10%
 * ```
 */
export function parseFloatDef(
  value: Nullish<string>,
  defaultValue: Nullish<number> = null
): Nullable<number> {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parses a string to an integer number with a fallback default value.
 *
 * This function provides a safe way to convert string values to integers
 * without throwing errors or returning NaN. It handles null, undefined, and invalid
 * string inputs gracefully by returning the specified default value.
 * Supports custom radix (base) for parsing different number systems.
 *
 * @param value - The string value to parse (can be null, undefined, or empty)
 * @param defaultValue - The value to return if parsing fails (default: null)
 * @param radix - The radix (base) to use for parsing (2-36, default: 10)
 * @returns The parsed integer number, default value, or null if parsing fails
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Basic parsing (base 10)
 * parseIntDef("42")                 // Returns: 42
 * parseIntDef("invalid")            // Returns: null
 * parseIntDef("")                   // Returns: null
 * parseIntDef(null)                 // Returns: null
 * parseIntDef(undefined)            // Returns: null
 *
 * // With custom default value
 * parseIntDef("invalid", 0)         // Returns: 0
 * parseIntDef("", 10)               // Returns: 10
 * parseIntDef(null, 1)              // Returns: 1
 *
 * // With custom radix
 * parseIntDef("1010", null, 2)      // Returns: 10 (binary)
 * parseIntDef("FF", null, 16)       // Returns: 255 (hexadecimal)
 * parseIntDef("42", null, 8)        // Returns: 34 (octal)
 *
 * // Real-world usage
 * const age = parseIntDef(userInput.age, 18);           // Default adult age
 * const count = parseIntDef(queryParams.count, 10);     // Default page size
 * const hexColor = parseIntDef(colorCode, 0, 16);       // Parse hex color
 * ```
 */
export function parseIntDef(
  value: Nullish<string>,
  defaultValue: Nullish<number> = null,
  radix?: number
): Nullable<number> {
  if (!value) return defaultValue;
  const parsed = parseInt(value, radix);
  return isNaN(parsed) ? defaultValue : parsed;
}
