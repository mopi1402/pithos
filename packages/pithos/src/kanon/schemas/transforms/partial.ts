import { GenericSchema } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { ObjectSchema } from "@kanon/types/composites";
import { ObjectConstraint } from "@kanon/types/constraints";
import { PartialSchema } from "@kanon/types/transforms";

/**
 * Partial transform - makes all properties optional.
 *
 * @param schema - Object schema to make partial.
 * @param message - Custom error message.
 * @returns Schema with all properties optional.
 * @since 3.0.0
 */
export function partial<T extends Record<string, GenericSchema>>(
  schema: ObjectSchema<T> | ObjectConstraint<T> | { entries: T },
  message?: string
): PartialSchema<ObjectSchema<T>> {
  const entries = schema.entries;
  const innerSchema = schema as ObjectSchema<T>;

  return {
    type: "partial" as const,
    message,
    refinements: undefined,
    innerSchema,
    validator: (value: unknown) => {
      // Check that it's an object
      if (typeof value !== "object" || value === null) {
        return message || ERROR_MESSAGES_COMPOSITION.object;
      }

      const obj = value as Record<string, unknown>;

      // Validate only present properties
      for (const [key, val] of Object.entries(obj)) {
        if (key in entries) {
          const propertySchema = entries[key];
          const result = propertySchema.validator(val);
          if (typeof result === "string") {
            return ERROR_MESSAGES_COMPOSITION.propertyError(key, result);
          }
        }
      }

      return true;
    },
  };
}
