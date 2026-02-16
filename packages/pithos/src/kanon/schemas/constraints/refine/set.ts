import { SetConstraint } from "@kanon/types/constraints";
import { SetSchema } from "@kanon/types/composites";
import { GenericSchema, Infer, isCoerced } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Adds a refinement to a set schema.
 * Returns a base SetSchema - the caller is responsible for adding constraints.
 *
 * @since 2.0.0
 */
/*@__INLINE__*/
export const refineSet = <ItemSchema extends GenericSchema>(
  schema: SetSchema<ItemSchema> | SetConstraint<ItemSchema>,
  refinement: (value: Set<Infer<ItemSchema>>) => true | string
): SetSchema<ItemSchema> => {
  const itemSchema = (schema as SetSchema<ItemSchema>).itemSchema;
  type ItemType = Infer<ItemSchema>;
  type SetType = Set<ItemType>;

  const newRefinements: Array<(value: SetType) => true | string> = schema.refinements
    ? [...(schema.refinements as Array<(value: SetType) => true | string>), refinement]
    : [refinement];

  return {
    type: "set" as const,
    message: schema.message,
    itemSchema,
    refinements: newRefinements as Array<(value: SetType) => true | string>,
    validator: ((value: unknown) => {
      if (!(value instanceof Set)) {
        return schema.message || ERROR_MESSAGES_COMPOSITION.set;
      }

      let coercedSet: Set<unknown> | null = null;

      for (const item of value) {
        const itemResult = itemSchema.validator(item);
        if (itemResult === true) {
          if (coercedSet) {
            coercedSet.add(item);
          }
        } else if (isCoerced(itemResult)) {
          if (!coercedSet) {
            coercedSet = new Set();
            for (const prev of value) {
              if (prev === item) break;
              coercedSet.add(prev);
            }
          }
          coercedSet.add(itemResult.coerced);
        } else {
          return `Item: ${itemResult}`;
        }
      }

      const finalSet = coercedSet ?? value;

      for (let i = 0; i < newRefinements.length; i++) {
        const result = newRefinements[i](finalSet as SetType);
        if (result !== true) return result;
      }

      if (coercedSet) {
        return { coerced: coercedSet };
      }

      return true;
    }) as SetSchema<ItemSchema>["validator"],
  };
};
