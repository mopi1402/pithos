import { SetConstraint } from "@kanon/v3/types/constraints";
import { refineSet } from "@kanon/v3/schemas/constraints/refine/set";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { SetSchema } from "@kanon/v3/types/composites";
import { GenericSchema, Infer } from "@kanon/v3/types/base";

/**
 * Adds set constraints to a base schema.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export function addSetConstraints<ItemSchema extends GenericSchema>(
  baseSchema: SetSchema<ItemSchema>
): SetConstraint<ItemSchema> {
  type ItemType = Infer<ItemSchema>;

  return {
    ...baseSchema,
    minSize: (min: number, errorMessage?: string) =>
      /*@__INLINE__*/ addSetConstraints(
        refineSet(
          baseSchema,
          (value: Set<ItemType>) =>
            value.size >= min ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.setMinSize(min)
        )
      ),
    maxSize: (max: number, errorMessage?: string) =>
      /*@__INLINE__*/ addSetConstraints(
        refineSet(
          baseSchema,
          (value: Set<ItemType>) =>
            value.size <= max ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.setMaxSize(max)
        )
      ),
  };
}
