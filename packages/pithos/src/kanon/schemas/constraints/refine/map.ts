import { MapConstraint } from "@kanon/types/constraints";
import { MapSchema } from "@kanon/types/composites";
import { GenericSchema, Infer, isCoerced } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Adds a refinement to a map schema.
 * Returns a base MapSchema - the caller is responsible for adding constraints.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export const refineMap = <
  KeySchema extends GenericSchema,
  ValueSchema extends GenericSchema
>(
  schema: MapSchema<KeySchema, ValueSchema> | MapConstraint<KeySchema, ValueSchema>,
  refinement: (value: Map<Infer<KeySchema>, Infer<ValueSchema>>) => true | string
): MapSchema<KeySchema, ValueSchema> => {
  const keySchema = (schema as MapSchema<KeySchema, ValueSchema>).keySchema;
  const valueSchema = (schema as MapSchema<KeySchema, ValueSchema>).valueSchema;
  type KeyType = Infer<KeySchema>;
  type ValueType = Infer<ValueSchema>;
  type MapType = Map<KeyType, ValueType>;

  const newRefinements: Array<(value: MapType) => true | string> = schema.refinements
    ? [...(schema.refinements as Array<(value: MapType) => true | string>), refinement]
    : [refinement];

  return {
    type: "map" as const,
    message: schema.message,
    keySchema,
    valueSchema,
    refinements: newRefinements as Array<(value: MapType) => true | string>,
    validator: ((value: unknown) => {
      if (!(value instanceof Map)) {
        return schema.message || ERROR_MESSAGES_COMPOSITION.map;
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
          return `Key: ${keyResult}`;
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
          return `Value: ${valueResult}`;
        }
      }

      const finalMap = coercedMap ?? value;

      for (let i = 0; i < newRefinements.length; i++) {
        const result = newRefinements[i](finalMap as MapType);
        if (result !== true) return result;
      }

      if (coercedMap) {
        return { coerced: coercedMap };
      }

      return true;
    }) as MapSchema<KeySchema, ValueSchema>["validator"],
  };
};
