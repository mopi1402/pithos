import { MapConstraint } from "@kanon/types/constraints";
import { refineMap } from "@kanon/schemas/constraints/refine/map";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { MapSchema } from "@kanon/types/composites";
import { GenericSchema, Infer } from "@kanon/types/base";

/**
 * Adds map constraints to a base schema.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export function addMapConstraints<
  KeySchema extends GenericSchema,
  ValueSchema extends GenericSchema
>(
  baseSchema: MapSchema<KeySchema, ValueSchema>
): MapConstraint<KeySchema, ValueSchema> {
  type KeyType = Infer<KeySchema>;
  type ValueType = Infer<ValueSchema>;

  return {
    ...baseSchema,
    minSize: (min: number, errorMessage?: string) =>
      /*@__INLINE__*/ addMapConstraints(
        refineMap(
          baseSchema,
          (value: Map<KeyType, ValueType>) =>
            value.size >= min ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.mapMinSize(min)
        )
      ),
    maxSize: (max: number, errorMessage?: string) =>
      /*@__INLINE__*/ addMapConstraints(
        refineMap(
          baseSchema,
          (value: Map<KeyType, ValueType>) =>
            value.size <= max ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.mapMaxSize(max)
        )
      ),
  };
}
