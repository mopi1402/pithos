import { GenericSchema } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { ObjectSchema } from "@kanon/v3/types/composites";
import { ObjectConstraint } from "@kanon/v3/types/constraints";
import { RequiredSchema } from "@kanon/v3/types/transforms";

/**
 * Required transform - makes all properties required.
 *
 * @param schema - Object schema to make required.
 * @param message - Custom error message.
 * @returns Schema with all properties required.
 * @since 3.0.0
 */
export function required<T extends Record<string, GenericSchema>>(
  schema: ObjectSchema<T> | ObjectConstraint<T> | { entries: T },
  message?: string
): RequiredSchema<ObjectSchema<T>> {
  const entries = schema.entries;
  const innerSchema = schema as ObjectSchema<T>;

  return {
    type: "required" as const,
    message,
    refinements: undefined,
    innerSchema,
    validator: (value: unknown) => {
      // Check that it's an object
      if (typeof value !== "object" || value === null) {
        return message || ERROR_MESSAGES_COMPOSITION.object;
      }

      const obj = value as Record<string, unknown>;

      // Validate all required properties
      for (const [key, propertySchema] of Object.entries(entries)) {
        if (!(key in obj)) {
          return message || ERROR_MESSAGES_COMPOSITION.missingField(key);
        }

        const result = propertySchema.validator(obj[key]);
        if (typeof result === "string") {
          return ERROR_MESSAGES_COMPOSITION.propertyError(key, result);
        }
      }

      return true;
    },
  };
}
