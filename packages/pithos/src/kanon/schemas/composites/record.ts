import { GenericSchema, isCoerced } from "@kanon/types/base";
import { RecordSchema } from "@kanon/types/composites";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Record schema - validates an object with typed keys and values.
 *
 * @param keySchema - Schema to validate keys (must be Schema<string>).
 * @param valueSchema - Schema to validate values.
 * @param message - Custom error message.
 * @returns Schema that validates an object with typed keys/values.
 * @since 2.0.0
 */
export function record<
  KeySchema extends GenericSchema,
  ValueSchema extends GenericSchema
>(
  keySchema: KeySchema,
  valueSchema: ValueSchema,
  message?: string
): RecordSchema<KeySchema, ValueSchema> {
  return {
    type: "record" as const,
    message,
    refinements: undefined,
    keySchema,
    valueSchema,
    validator: ((value: unknown) => {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return message || ERROR_MESSAGES_COMPOSITION.object;
      }

      const obj = value as Record<string, unknown>;
      let coercedObj: Record<string, unknown> | null = null;

      for (const key in obj) {
        const keyResult = keySchema.validator(key);
        // Keys are always strings, coercion doesn't make sense here
        if (keyResult !== true && !isCoerced(keyResult)) {
          return message || `Key "${key}": ${keyResult}`;
        }

        const valueResult = valueSchema.validator(obj[key]);
        if (valueResult === true) {
          if (coercedObj) {
            coercedObj[key] = obj[key];
          }
        } else if (isCoerced(valueResult)) {
          if (!coercedObj) {
            coercedObj = { ...obj };
          }
          coercedObj[key] = valueResult.coerced;
        } else {
          return message || `Value for key "${key}": ${valueResult}`;
        }
      }

      if (coercedObj) {
        return { coerced: coercedObj };
      }

      return true;
    }) as RecordSchema<KeySchema, ValueSchema>["validator"],
  };
}
