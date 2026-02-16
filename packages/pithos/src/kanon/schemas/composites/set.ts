import { GenericSchema, isCoerced } from "@kanon/types/base";
import { SetSchema } from "@kanon/types/composites";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addSetConstraints } from "@kanon/schemas/constraints/set";
import { SetConstraint } from "@kanon/types/constraints";

/**
 * Set schema - validates a Set with typed elements.
 *
 * @param itemSchema - Schema to validate each item.
 * @param message - Custom error message.
 * @returns Schema that validates a Set with typed items and constraints.
 * @since 2.0.0
 */
export function set<ItemSchema extends GenericSchema>(
  itemSchema: ItemSchema,
  message?: string
): SetConstraint<ItemSchema> {
  const baseSchema: SetSchema<ItemSchema> = {
    type: "set" as const,
    message,
    itemSchema,
    validator: ((value: unknown) => {
      if (!(value instanceof Set)) {
        return message || ERROR_MESSAGES_COMPOSITION.set;
      }

      let coercedSet: Set<unknown> | null = null;

      for (const item of value) {
        const result = itemSchema.validator(item);
        if (result === true) {
          if (coercedSet) {
            coercedSet.add(item);
          }
        } else if (isCoerced(result)) {
          if (!coercedSet) {
            coercedSet = new Set();
            // Copy already validated items
            for (const prev of value) {
              if (prev === item) break;
              coercedSet.add(prev);
            }
          }
          coercedSet.add(result.coerced);
        } else {
          return message || `Item: ${result}`;
        }
      }

      if (coercedSet) {
        return { coerced: coercedSet };
      }

      return true;
    }) as SetSchema<ItemSchema>["validator"],
  };

  return addSetConstraints(baseSchema);
}
