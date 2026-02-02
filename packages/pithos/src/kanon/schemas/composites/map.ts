import { GenericSchema, isCoerced } from "@kanon/types/base";
import { MapSchema } from "@kanon/types/composites";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addMapConstraints } from "@kanon/schemas/constraints/map";
import { MapConstraint } from "@kanon/types/constraints";

/**
 * Map schema - validates a Map with typed keys and values.
 *
 * @param keySchema - Schema to validate keys.
 * @param valueSchema - Schema to validate values.
 * @param message - Custom error message.
 * @returns Schema that validates a Map with typed keys/values and constraints.
 * @since 3.0.0
 */
export function map<
  KeySchema extends GenericSchema,
  ValueSchema extends GenericSchema
>(
  keySchema: KeySchema,
  valueSchema: ValueSchema,
  message?: string
): MapConstraint<KeySchema, ValueSchema> {
  const baseSchema: MapSchema<KeySchema, ValueSchema> = {
    type: "map" as const,
    message,
    keySchema,
    valueSchema,
    validator: ((value: unknown) => {
      if (!(value instanceof Map)) {
        return message || ERROR_MESSAGES_COMPOSITION.map;
      }

      let coercedMap: Map<unknown, unknown> | null = null;

      for (const [key, val] of value.entries()) {
        const keyResult = keySchema.validator(key);
        let finalKey = key;
        
        if (keyResult === true) {
          // key is valid as-is
        } else if (isCoerced(keyResult)) {
          if (!coercedMap) {
            coercedMap = new Map(value);
          }
          finalKey = keyResult.coerced;
          coercedMap.delete(key);
        } else {
          return message || `Key: ${keyResult}`;
        }

        const valueResult = valueSchema.validator(val);
        if (valueResult === true) {
          if (coercedMap && finalKey !== key) {
            coercedMap.set(finalKey, val);
          }
        } else if (isCoerced(valueResult)) {
          if (!coercedMap) {
            coercedMap = new Map(value);
          }
          coercedMap.set(finalKey, valueResult.coerced);
        } else {
          return message || `Value: ${valueResult}`;
        }
      }

      if (coercedMap) {
        return { coerced: coercedMap };
      }

      return true;
    }) as MapSchema<KeySchema, ValueSchema>["validator"],
  };

  return addMapConstraints(baseSchema);
}
