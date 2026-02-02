import { NativeEnumSchema } from "@kanon/v3/types/primitives";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";

/**
 * Extracts values from a native TypeScript enum.
 * 
 * Numeric TypeScript enums create a bidirectional mapping:
 * enum Status { Active = 0 } → { Active: 0, "0": "Active" }
 * 
 * This function filters reverse mappings to keep only the actual values.
 */
function extractEnumValues<T extends Record<string, string | number>>(
  enumObj: T
): T[keyof T][] {
  // Stryker disable next-line ArrayDeclaration: Empty array initialization - garbage values would only add extra accepted values
  const values: T[keyof T][] = [];

  for (const key in enumObj) {
    const value = enumObj[key];
    // Filter reverse mappings of numeric enums
    // If the value is a number, or if it's a string that's not a key of the enum
    if (typeof value === "number" || !(value in enumObj)) {
      values.push(value as T[keyof T]);
    }
  }
  
  return values;
}

/**
 * NativeEnum schema - validates native TypeScript enums.
 *
 * Supports string, number and mixed enums:
 * - enum StringEnum { A = "a", B = "b" }
 * - enum NumericEnum { A = 0, B = 1 }
 * - enum MixedEnum { A = 0, B = "b" }
 *
 * @param enumObj - TypeScript enum object.
 * @param message - Custom error message.
 * @returns Schema that validates native enum values.
 * @since 3.0.0
 */
export function nativeEnum<T extends Record<string, string | number>>(
  enumObj: T,
  message?: string
): NativeEnumSchema<T[keyof T], T> {
  const enumValues = extractEnumValues(enumObj);
  const valueSet = new Set<unknown>(enumValues);

  const validator = (value: unknown): true | string => {
    if (valueSet.has(value)) {
      return true;
    }
    return message || ERROR_MESSAGES_COMPOSITION.nativeEnum(enumValues, typeof value);
  };

  return Object.freeze({
    type: "nativeEnum" as const,
    message,
    refinements: undefined,
    enumValues,
    enumObj,
    validator,
  });
}