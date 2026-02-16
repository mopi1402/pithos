import { EnumSchema, EnumValue } from "@kanon/types/primitives";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Factory function for creating enum schemas.
 *
 * @param values - Array of allowed values
 * @param message - Custom error message
 * @returns Schema that validates only the enum values
 */
function createEnumSchema<T extends readonly [EnumValue, ...EnumValue[]]>(
  values: T,
  message?: string
): EnumSchema<T[number]> {
  const valueSet = new Set<unknown>(values);
  
  return {
    type: "enum" as const,
    message,
    refinements: undefined,
    enumValues: values,
    validator: (value: unknown) => {
      if (valueSet.has(value)) return true;
      return message || ERROR_MESSAGES_COMPOSITION.enum(values, typeof value);
    },
  };
}

/**
 * Enum schema - accepts only string enumeration values
 *
 * @param values - Array of allowed string values
 * @param message - Custom error message
 * @returns Schema that validates only the string enum values
 * @since 2.0.0
 */
export function enum_<T extends readonly [string, ...string[]]>(
  values: T,
  message?: string
): EnumSchema<T[number]> {
  return createEnumSchema(values, message);
}

/**
 * Number enum schema - enumeration of numbers
 *
 * @param values - Array of allowed number values
 * @param message - Custom error message
 * @returns Schema that validates only the number enum values
 * @since 2.0.0
 */
export function numberEnum<T extends readonly [number, ...number[]]>(
  values: T,
  message?: string
): EnumSchema<T[number]> {
  return createEnumSchema(values, message);
}

/**
 * Boolean enum schema - enumeration of booleans
 *
 * @param values - Array of allowed boolean values
 * @param message - Custom error message
 * @returns Schema that validates only the boolean enum values
 * @since 2.0.0
 */
export function booleanEnum<T extends readonly [boolean, ...boolean[]]>(
  values: T,
  message?: string
): EnumSchema<T[number]> {
  return createEnumSchema(values, message);
}

/**
 * Mixed enum schema - enumeration of mixed types
 *
 * @param values - Array of allowed mixed values (string | number | boolean)
 * @param message - Custom error message
 * @returns Schema that validates only the mixed enum values
 * @since 2.0.0
 */
export function mixedEnum<T extends readonly [EnumValue, ...EnumValue[]]>(
  values: T,
  message?: string
): EnumSchema<T[number]> {
  return createEnumSchema(values, message);
}
