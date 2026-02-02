import { GenericSchema } from "@kanon/v3/types/base";
import { ReadonlySchema } from "@kanon/v3/types/wrappers";

/**
 * Readonly schema - makes properties read-only (TypeScript semantics).
 *
 * @param schema - Base schema.
 * @param message - Custom error message.
 * @returns Schema that marks properties as readonly.
 * @since 3.0.0
 */
export function readonly<Inner extends GenericSchema>(
  schema: Inner,
  message?: string
): ReadonlySchema<Inner> {
  return {
    type: "readonly" as const,
    message,
    innerSchema: schema,
    validator: (value: unknown) => {
      // Validation is identical to the base schema
      // readonly is mainly a TypeScript annotation
      const result = schema.validator(value);
      // Stryker disable next-line ConditionalExpression: false positive - when result === true, `message || result` equals `true` (same behavior)
      if (typeof result === "string") {
        return message || result;
      }
      return result;
    },
  };
}
