import { ArrayConstraint } from "@kanon/v3/types/constraints";
import { ArraySchema } from "@kanon/v3/types/composites";
import { GenericSchema, Infer, isCoerced } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";

/**
 * Adds a refinement to an array schema.
 * Returns a base ArraySchema - the caller is responsible for adding constraints.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export const refineArray = <ItemSchema extends GenericSchema>(
  schema: ArraySchema<ItemSchema> | ArrayConstraint<ItemSchema>,
  refinement: (value: Infer<ItemSchema>[]) => true | string
): ArraySchema<ItemSchema> => {
  const itemSchema = (schema as ArraySchema<ItemSchema>).itemSchema;
  type ItemType = Infer<ItemSchema>;
  type ArrayType = ItemType[];

  const newRefinements: Array<(value: ArrayType) => true | string> = schema.refinements
    ? [...(schema.refinements as Array<(value: ArrayType) => true | string>), refinement]
    : [refinement];

  return {
    type: "array" as const,
    message: schema.message,
    itemSchema,
    refinements: newRefinements as Array<(value: ArrayType) => true | string>,
    validator: ((value: unknown) => {
      if (!Array.isArray(value)) {
        return schema.message || ERROR_MESSAGES_COMPOSITION.array;
      }

      let coercedArray: unknown[] | null = null;

      for (let i = 0; i < value.length; i++) {
        const itemResult = itemSchema.validator(value[i]);
        if (itemResult === true) {
          if (coercedArray) {
            coercedArray[i] = value[i];
          }
        } else if (isCoerced(itemResult)) {
          if (!coercedArray) {
            coercedArray = value.slice(0, i);
          }
          coercedArray[i] = itemResult.coerced;
        } else {
          return `[${i}]: ${itemResult}`;
        }
      }

      const finalArray = coercedArray ?? value;

      for (let i = 0; i < newRefinements.length; i++) {
        const result = newRefinements[i](finalArray as ArrayType);
        if (result !== true) return result;
      }

      if (coercedArray) {
        return { coerced: coercedArray };
      }

      return true;
    }) as ArraySchema<ItemSchema>["validator"],
  };
};
