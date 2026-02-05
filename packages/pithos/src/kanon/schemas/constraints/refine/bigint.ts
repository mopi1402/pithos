import { BigIntConstraint } from "@kanon/types/constraints";
import { BigIntSchema } from "@kanon/types/primitives";
import { CoercedResult } from "@kanon/types/base";

/**
 * Adds a refinement to a bigint schema.
 * Preserves coercion from the base schema.
 * Returns a base BigIntSchema - the caller is responsible for adding constraints.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export const refineBigInt = (
  schema: BigIntSchema | BigIntConstraint,
  refinement: (value: bigint) => true | string
): BigIntSchema => {
  const newRefinements = schema.refinements
    ? [...schema.refinements, refinement]
    : [refinement];

  return {
    type: "bigint" as const,
    message: schema.message,
    refinements: newRefinements,
    validator: (value: unknown): true | string | CoercedResult<bigint> => {
      // First, run the base validator (which may coerce the value and run previous refinements)
      const baseResult = schema.validator(value);

      // If base validation failed, return the error
      if (typeof baseResult === "string") {
        return baseResult;
      }

      // Get the actual bigint value (either original or coerced)
      let bigintValue: bigint;
      if (baseResult === true) {
        // Value was already a valid bigint
        bigintValue = value as bigint;
      } else {
        // Value was coerced
        bigintValue = baseResult.coerced;
      }

      // Only apply the NEW refinement (previous ones were already run by base validator)
      const result = refinement(bigintValue);
      if (result !== true) return result;

      // Return coerced result if coercion happened, otherwise true
      // Stryker disable next-line ConditionalExpression,BooleanLiteral: baseResult is true or {coerced} here - both paths produce valid parser output
      if (baseResult !== true) {
        return { coerced: bigintValue };
      }
      return true;
    },
  };
};
