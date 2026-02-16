import { DateConstraint } from "@kanon/types/constraints";
import { refineDate } from "@kanon/schemas/constraints/refine/date";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { DateSchema } from "@kanon/types/primitives";

/**
 * Adds date constraints to a base schema.
 *
 * @since 2.0.0
 */
/*@__INLINE__*/
export function addDateConstraints(baseSchema: DateSchema): DateConstraint {
  return {
    ...baseSchema,
    min: (min: Date, errorMessage?: string) =>
      /*@__INLINE__*/ addDateConstraints(
        refineDate(
          baseSchema,
          (value: Date) =>
            value >= min ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.dateMin(min)
        )
      ),
    max: (max: Date, errorMessage?: string) =>
      /*@__INLINE__*/ addDateConstraints(
        refineDate(
          baseSchema,
          (value: Date) =>
            value <= max ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.dateMax(max)
        )
      ),
    before: (before: Date, errorMessage?: string) =>
      /*@__INLINE__*/ addDateConstraints(
        refineDate(
          baseSchema,
          (value: Date) =>
            value < before ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.dateBefore(before)
        )
      ),
    after: (after: Date, errorMessage?: string) =>
      /*@__INLINE__*/ addDateConstraints(
        refineDate(
          baseSchema,
          (value: Date) =>
            value > after ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.dateAfter(after)
        )
      ),
  };
}
