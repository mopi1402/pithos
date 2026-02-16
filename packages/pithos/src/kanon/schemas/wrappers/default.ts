import { GenericSchema, Infer } from "@kanon/types/base";
import { DefaultSchema } from "@kanon/types/wrappers";

/**
 * Default schema - provides a default value if undefined.
 *
 * @param schema - Base schema.
 * @param defaultValue - Default value or function that returns the default value.
 * @param message - Custom error message.
 * @returns Schema that uses the default value if undefined.
 * @since 2.0.0
 */
export function default_<Inner extends GenericSchema>(
  schema: Inner,
  defaultValue: Infer<Inner> | (() => Infer<Inner>),
  message?: string
): DefaultSchema<Inner> {
  // Validate static default value at creation
  if (typeof defaultValue !== "function") {
    const result = schema.validator(defaultValue);
    if (typeof result === "string") {
      throw new Error(`Invalid default value: ${result}`);
    }
  }

  return {
    type: "default" as const,
    message,
    innerSchema: schema,
    defaultValue,
    validator: (value: unknown) => {
      if (value === undefined) {
        // For functions, we must validate each time
        if (typeof defaultValue === "function") {
          const defaultVal = (defaultValue as () => Infer<Inner>)();
          const result = schema.validator(defaultVal);
          // Stryker disable next-line ConditionalExpression: false positive - when result === true, `message || result` equals `true` (same behavior)
          if (typeof result === "string") {
            return message || result;
          }
        }
        return true;
      }

      const result = schema.validator(value);
      // Stryker disable next-line ConditionalExpression: false positive - when result === true, `message || result` equals `true` (same behavior)
      if (typeof result === "string") {
        return message || result;
      }
      return result;
    },
  };
}

/**
 * Helper to create dynamic default values.
 *
 * @since 2.0.0
 */
export const DefaultValues = {
  /**
   * Returns the current date.
   */
  now: () => new Date(),

  /**
   * Returns a UUID v4 (requires crypto.randomUUID).
   */
  uuid: () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Simple fallback if crypto.randomUUID is not available
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /**
   * Returns a Unix timestamp.
   */
  timestamp: () => Date.now(),

  /**
   * Returns an empty array.
   */
  emptyArray: () => [],

  /**
   * Returns an empty object.
   */
  emptyObject: () => ({}),
} as const;
