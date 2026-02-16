import { ArrayConstraint } from "@kanon/types/constraints";
import { refineArray } from "@kanon/schemas/constraints/refine/array";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { ArraySchema } from "@kanon/types/composites";
import { Infer, GenericSchema } from "@kanon/types/base";

/**
 * Adds array constraints to a base schema.
 *
 * @since 2.0.0
 */
/*@__INLINE__*/
export function addArrayConstraints<ItemSchema extends GenericSchema>(
  baseSchema: ArraySchema<ItemSchema>
): ArrayConstraint<ItemSchema> {
  type ItemType = Infer<ItemSchema>;

  return {
    ...baseSchema,
    minLength: (min: number, errorMessage?: string) =>
      /*@__INLINE__*/ addArrayConstraints(
        refineArray(
          baseSchema,
          (value: ItemType[]) =>
            value.length >= min ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.minLength(min)
        )
      ),
    maxLength: (max: number, errorMessage?: string) =>
      /*@__INLINE__*/ addArrayConstraints(
        refineArray(
          baseSchema,
          (value: ItemType[]) =>
            value.length <= max ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.maxLength(max)
        )
      ),
    length: (length: number, errorMessage?: string) =>
      /*@__INLINE__*/ addArrayConstraints(
        refineArray(
          baseSchema,
          (value: ItemType[]) =>
            value.length === length ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.length(length)
        )
      ),
    unique: (errorMessage?: string) =>
      /*@__INLINE__*/ addArrayConstraints(
        refineArray(baseSchema, (value: ItemType[]) => {
          const uniqueValues = new Set(value);
          return (
            uniqueValues.size === value.length ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.arrayUnique
          );
        })
      ),
  };
}
