import { ObjectConstraint } from "@kanon/v3/types/constraints";
import { refineObject } from "@kanon/v3/schemas/constraints/refine/object";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { ObjectSchema } from "@kanon/v3/types/composites";
import { GenericSchema } from "@kanon/v3/types/base";

/**
 * Adds object constraints to a base schema.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export function addObjectConstraints<T extends Record<string, GenericSchema>>(
  baseSchema: ObjectSchema<T>
): ObjectConstraint<T> {
  return {
    ...baseSchema,
    minKeys: (min: number, errorMessage?: string) =>
      /*@__INLINE__*/ addObjectConstraints(
        refineObject(
          baseSchema,
          (value: Record<string, unknown>) =>
            Object.keys(value).length >= min ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.objectMinKeys(min)
        )
      ),
    maxKeys: (max: number, errorMessage?: string) =>
      /*@__INLINE__*/ addObjectConstraints(
        refineObject(
          baseSchema,
          (value: Record<string, unknown>) =>
            Object.keys(value).length <= max ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.objectMaxKeys(max)
        )
      ),
    strict: (errorMessage?: string) =>
      /*@__INLINE__*/ addObjectConstraints(
        refineObject(baseSchema, (value: Record<string, unknown>) => {
          const allowedKeys = new Set(Object.keys(baseSchema.entries));
          const valueKeys = Object.keys(value);
          for (let i = 0; i < valueKeys.length; i++) {
            const key = valueKeys[i];
            if (!allowedKeys.has(key)) {
              return errorMessage || ERROR_MESSAGES_COMPOSITION.objectStrict(key);
            }
          }
          return true;
        })
      ),
  };
}
