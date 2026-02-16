import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { KeyofSchema } from "@kanon/types/transforms";
import { GenericSchema } from "@kanon/types/base";
import { ObjectConstraint } from "@kanon/types/constraints";
import { ObjectSchema } from "@kanon/types/composites";

/**
 * Keyof schema - validates that the value is a key of an object.
 *
 * @param objectSchema - Object schema whose keys to validate.
 * @param message - Custom error message.
 * @returns Schema that validates the object keys.
 * @since 2.0.0
 */
export function keyof<T extends Record<string, GenericSchema>>(
  objectSchema: ObjectSchema<T> | ObjectConstraint<T> | { entries: T },
  message?: string
): KeyofSchema<ObjectSchema<T>> {
  const entries = objectSchema.entries;
  const schema = objectSchema as ObjectSchema<T>;

  const keys = Object.keys(entries) as readonly (keyof T & string)[];

  if (keys.length === 0) {
    throw new Error(
      "keyof() requires an object schema with at least one property"
    );
  }

  const keySet = new Set(keys);
  const keysString = keys.join(", ");

  return {
    type: "keyof" as const,
    message,
    refinements: undefined,
    objectSchema: schema,
    validator: (value: unknown) => {
      if (typeof value !== "string") {
        return message || ERROR_MESSAGES_COMPOSITION.string;
      }

      if (!keySet.has(value as keyof T & string)) {
        return message || ERROR_MESSAGES_COMPOSITION.keyofExpectedOneOf(keysString);
      }

      return true;
    },
  };
}
