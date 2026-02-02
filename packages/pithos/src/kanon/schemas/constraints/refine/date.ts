import { DateConstraint } from "@kanon/types/constraints";
import { DateSchema } from "@kanon/types/primitives";
import { CoercedResult } from "@kanon/types/base";

/**
 * Adds a refinement to a date schema.
 * Preserves coercion from the base schema.
 * Returns a base DateSchema - the caller is responsible for adding constraints.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export const refineDate = (
  schema: DateSchema | DateConstraint,
  refinement: (value: Date) => true | string
): DateSchema => {
  const newRefinements = schema.refinements
    ? [...schema.refinements, refinement]
    : [refinement];

  return {
    type: "date" as const,
    message: schema.message,
    refinements: newRefinements,
    validator: (value: unknown): true | string | CoercedResult<Date> => {
      // First, run the base validator (which may coerce the value and run previous refinements)
      const baseResult = schema.validator(value);

      // If base validation failed, return the error
      if (typeof baseResult === "string") {
        return baseResult;
      }

      // Get the actual Date value (either original or coerced)
      let dateValue: Date;
      if (baseResult === true) {
        // Value was already a valid Date
        dateValue = value as Date;
      } else {
        // Value was coerced
        dateValue = baseResult.coerced;
      }

      // Only apply the NEW refinement (previous ones were already run by base validator)
      const result = refinement(dateValue);
      if (result !== true) return result;

      // Return coerced result if coercion happened, otherwise true
      if (baseResult !== true) {
        return { coerced: dateValue };
      }
      return true;
    },
  };
};
