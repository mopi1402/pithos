import { Schema } from "@kanon/types/base";
import { NullishSchema } from "@kanon/types/wrappers";

/**
 * Makes a schema nullish (accepts null or undefined).
 *
 * @param schema - The schema to make nullish.
 * @param message - Custom error message.
 * @returns Schema that accepts the original type, null, or undefined.
 * @since 3.0.0
 */
export function nullish<T>(
  schema: Schema<T>,
  message?: string
): NullishSchema<Schema<T>> {
  return {
    type: "nullish" as const,
    innerSchema: schema,
    message,
    validator: (value: unknown) => {
      if (value === null || value === undefined) {
        return true;
      }
      const result = schema.validator(value);
      // Success case: propagate result (true or CoercedResult)
      // Error case: use custom message or inner schema error
      // Stryker disable next-line ConditionalExpression: false positive - when result === true, `message || result` equals `true` (same behavior)
      if (typeof result === "string") {
        return message || result;
      }
      return result;
    },
  };
}
