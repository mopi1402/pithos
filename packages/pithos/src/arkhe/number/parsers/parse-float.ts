//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
/**
 * Parses a string to a float, returning default if invalid.
 *
 * @param value - The string value to parse.
 * @param defaultValue - The value to return if parsing fails.
 * @returns The parsed float or default value.
 * @since 1.1.0
 *
 * @note Returns default for NaN, Infinity, and invalid strings. Assumes non-nullish input.
 *
 * @see parseFloatDef
 *
 * @example
 * ```typescript
 * parseFloat('42.99', 0);    // => 42.99
 * parseFloat('invalid', 0);  // => 0
 * parseFloat('Infinity', 0); // => 0
 * parseFloat('NaN', 100);    // => 100
 * ```
 */
export function parseFloat(value: string, defaultValue: number): number {
  const parsed = Number.parseFloat(value);
  return isNaN(parsed) || !isFinite(parsed) ? defaultValue : parsed;
}
