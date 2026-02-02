import { Schema } from "@kanon/v3/types/base";
import { NullableSchema } from "@kanon/v3/types/wrappers";

/**
 * Makes a schema nullable (accepts null).
 *
 * @param schema - The schema to make nullable
 * @param message - Custom error message
 * @returns Schema that accepts the original type or null
 * @since 3.0.0
 */
export function nullable<T>(
  schema: Schema<T>,
  message?: string
): NullableSchema<Schema<T>> {
  return {
    type: "nullable" as const,
    innerSchema: schema,
    message,
    validator: (value: unknown) => {
      if (value === null) {
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
