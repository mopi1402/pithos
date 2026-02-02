import { BigIntConstraint } from "@kanon/types/constraints";
import { refineBigInt } from "@kanon/schemas/constraints/refine/bigint";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { BigIntSchema } from "@kanon/types/primitives";

/**
 * Adds bigint constraints to a base schema.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export function addBigIntConstraints(
  baseSchema: BigIntSchema
): BigIntConstraint {
  return {
    ...baseSchema,
    min: (min: bigint, errorMessage?: string) =>
      /*@__INLINE__*/ addBigIntConstraints(
        refineBigInt(
          baseSchema,
          (value: bigint) =>
            value >= min ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.bigintMin(min)
        )
      ),
    max: (max: bigint, errorMessage?: string) =>
      /*@__INLINE__*/ addBigIntConstraints(
        refineBigInt(
          baseSchema,
          (value: bigint) =>
            value <= max ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.bigintMax(max)
        )
      ),
    positive: (errorMessage?: string) =>
      /*@__INLINE__*/ addBigIntConstraints(
        refineBigInt(
          baseSchema,
          (value: bigint) =>
            value > 0n ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.bigintPositive
        )
      ),
    negative: (errorMessage?: string) =>
      /*@__INLINE__*/ addBigIntConstraints(
        refineBigInt(
          baseSchema,
          (value: bigint) =>
            value < 0n ||
            errorMessage ||
            ERROR_MESSAGES_COMPOSITION.bigintNegative
        )
      ),
  };
}
