import { NumberConstraint } from "@kanon/types/constraints";
import { NumberSchema } from "@kanon/types/primitives";
import { CoercedResult } from "@kanon/types/base";

/**
 * Adds a refinement to a number schema.
 * Preserves coercion from the base schema.
 * Returns a base NumberSchema - the caller is responsible for adding constraints.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export const refineNumber = (
  schema: NumberSchema | NumberConstraint,
  refinement: (value: number) => true | string
): NumberSchema => {
  const newRefinements = schema.refinements
    ? [...schema.refinements, refinement]
    : [refinement];

  return {
    type: "number" as const,
    message: schema.message,
    refinements: newRefinements,
    validator: (value: unknown): true | string | CoercedResult<number> => {
      // First, run the base validator (which may coerce the value and run previous refinements)
      const baseResult = schema.validator(value);

      // If base validation failed, return the error
      if (typeof baseResult === "string") {
        return baseResult;
      }

      // Get the actual number value (either original or coerced)
      let numberValue: number;
      if (baseResult === true) {
        // Value was already a valid number
        numberValue = value as number;
      } else {
        // Value was coerced
        numberValue = baseResult.coerced;
      }

      // Only apply the NEW refinement (previous ones were already run by base validator)
      const result = refinement(numberValue);
      if (result !== true) return result;

      // Return coerced result if coercion happened, otherwise true
      if (baseResult !== true) {
        return { coerced: numberValue };
      }
      return true;
    },
  };
};
