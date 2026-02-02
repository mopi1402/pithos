import { GenericSchema } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { ObjectSchema } from "@kanon/v3/types/composites";
import { ObjectConstraint } from "@kanon/v3/types/constraints";
import { PickSchema } from "@kanon/v3/types/transforms";

/**
 * Pick transform - selects specific properties.
 *
 * @param schema - Source object schema.
 * @param keys - Keys to select.
 * @param message - Custom error message.
 * @returns Schema with only selected properties.
 * @since 3.0.0
 */
export function pick<
  T extends Record<string, GenericSchema>,
  K extends keyof T
>(
  schema: ObjectSchema<T> | ObjectConstraint<T> | { entries: T },
  keys: readonly K[],
  message?: string
): PickSchema<ObjectSchema<T>, K> {
  const entries = schema.entries;
  const innerSchema = schema as ObjectSchema<T>;

  return {
    type: "pick" as const,
    message,
    refinements: undefined,
    innerSchema,
    keys,
    validator: (value: unknown) => {
      // Check that it's an object
      if (typeof value !== "object" || value === null) {
        return message || ERROR_MESSAGES_COMPOSITION.object;
      }

      const obj = value as Record<string, unknown>;

      // Validate only selected properties
      for (const key of keys) {
        if (!(key in obj)) {
          return (
            message || ERROR_MESSAGES_COMPOSITION.missingField(String(key))
          );
        }

        const propertySchema = entries[key as string];
        if (propertySchema) {
          const result = propertySchema.validator(obj[String(key)]);
          if (typeof result === "string") {
            return ERROR_MESSAGES_COMPOSITION.propertyError(
              String(key),
              result
            );
          }
        }
      }

      return true;
    },
  };
}
