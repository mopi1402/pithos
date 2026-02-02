import { GenericSchema, isCoerced } from "@kanon/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { addArrayConstraints } from "@kanon/schemas/constraints/array";
import { ArrayConstraint } from "@kanon/types/constraints";
import { ArraySchema } from "@kanon/types/composites";

/**
 * Array schema with composition and constraints.
 *
 * @param item - Schema for array items.
 * @param message - Custom error message (optional).
 * @returns ArrayConstraint with all constraints.
 * @since 3.0.0
 */
export function array<ItemSchema extends GenericSchema>(
  item: ItemSchema,
  message?: string
): ArrayConstraint<ItemSchema> {
  const baseSchema: ArraySchema<ItemSchema> = {
    type: "array" as const,
    message,
    itemSchema: item,
    validator: ((value: unknown) => {
      if (!Array.isArray(value)) {
        return message || ERROR_MESSAGES_COMPOSITION.array;
      }

      let coercedArray: unknown[] | null = null;

      // Fast validation of items
      for (let i = 0; i < value.length; i++) {
        const result = item.validator(value[i]);
        if (result === true) {
          if (coercedArray) {
            coercedArray[i] = value[i];
          }
        } else if (isCoerced(result)) {
          if (!coercedArray) {
            // First coerced value - create array copy
            coercedArray = value.slice(0, i);
          }
          coercedArray[i] = result.coerced;
        } else {
          return `Index ${i}: ${result}`;
        }
      }

      if (coercedArray) {
        return { coerced: coercedArray };
      }

      return true;
    }) as ArraySchema<ItemSchema>["validator"],
  };

  return addArrayConstraints(baseSchema);
}
