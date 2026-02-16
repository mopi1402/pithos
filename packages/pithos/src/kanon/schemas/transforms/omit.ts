import { GenericSchema } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { ObjectSchema } from "@kanon/types/composites";
import { ObjectConstraint } from "@kanon/types/constraints";
import { OmitSchema } from "@kanon/types/transforms";

/**
 * Omit transform - excludes specific properties.
 *
 * @param schema - Source object schema.
 * @param keys - Keys to exclude.
 * @param message - Custom error message.
 * @returns Schema without excluded properties.
 * @since 2.0.0
 */
export function omit<
  T extends Record<string, GenericSchema>,
  K extends keyof T
>(
  schema: ObjectSchema<T> | ObjectConstraint<T> | { entries: T },
  keys: readonly K[],
  message?: string
): OmitSchema<ObjectSchema<T>, K> {
  const entries = schema.entries;
  const innerSchema = schema as ObjectSchema<T>;
  const excludedKeys = new Set(keys);

  return {
    type: "omit" as const,
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

      // Validate all properties except excluded ones
      for (const [key, propertySchema] of Object.entries(entries)) {
        if (excludedKeys.has(key as K)) {
          continue; // Skip excluded keys
        }

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
