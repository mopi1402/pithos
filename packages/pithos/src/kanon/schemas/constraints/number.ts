import { NumberConstraint } from "@kanon/types/constraints";
import { refineNumber } from "@kanon/schemas/constraints/refine/number";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { NumberSchema } from "@kanon/types/primitives";

/**
 * Adds number constraints to a base schema.
 *
 * @since 2.0.0
 */
/*@__INLINE__*/
export function addNumberConstraints(
  baseSchema: NumberSchema
): NumberConstraint {
  return {
    ...baseSchema,
    min: (min: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value >= min || errorMessage || ERROR_MESSAGES_COMPOSITION.min(min)
        )
      ),
    max: (max: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value <= max || errorMessage || ERROR_MESSAGES_COMPOSITION.max(max)
        )
      ),
    int: (errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            Number.isInteger(value) ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.int
        )
      ),
    positive: (errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value > 0 || errorMessage || ERROR_MESSAGES_COMPOSITION.positive
        )
      ),
    negative: (errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value < 0 || errorMessage || ERROR_MESSAGES_COMPOSITION.negative
        )
      ),
    lt: (lessThan: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value < lessThan ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.lt(lessThan)
        )
      ),
    lte: (lessThanOrEqual: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value <= lessThanOrEqual ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.lte(lessThanOrEqual)
        )
      ),
    gt: (greaterThan: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value > greaterThan ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.gt(greaterThan)
        )
      ),
    gte: (greaterThanOrEqual: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value >= greaterThanOrEqual ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.gte(greaterThanOrEqual)
        )
      ),
    multipleOf: (multiple: number, errorMessage?: string) =>
      /*@__INLINE__*/ addNumberConstraints(
        refineNumber(
          baseSchema,
          (value: number) =>
            value % multiple === 0 ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.multipleOf(multiple)
        )
      ),
  };
}
