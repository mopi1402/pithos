import { StringConstraint } from "@kanon/types/constraints";
import { StringSchema } from "@kanon/types/primitives";
import { CoercedResult } from "@kanon/types/base";

/**
 * Adds a refinement to a string schema.
 * Preserves coercion from the base schema.
 * Returns a base StringSchema - the caller is responsible for adding constraints.
 *
 * @since 2.0.0
 */
/*@__INLINE__*/
export const refineString = (
  schema: StringSchema | StringConstraint,
  refinement: (value: string) => true | string
): StringSchema => {
  const newRefinements = schema.refinements
    ? [...schema.refinements, refinement]
    : [refinement];

  return {
    type: "string" as const,
    message: schema.message,
    refinements: newRefinements,
    validator: (value: unknown): true | string | CoercedResult<string> => {
      // First, run the base validator (which may coerce the value and run previous refinements)
      const baseResult = schema.validator(value);

      // If base validation failed, return the error
      if (typeof baseResult === "string") {
        return baseResult;
      }

      // Get the actual string value (either original or coerced)
      let stringValue: string;
      if (baseResult === true) {
        // Value was already a valid string
        stringValue = value as string;
      } else {
        // Value was coerced
        stringValue = baseResult.coerced;
      }

      // Only apply the NEW refinement (previous ones were already run by base validator)
      const result = refinement(stringValue);
      if (result !== true) return result;

      // Return coerced result if coercion happened, otherwise true
      if (baseResult !== true) {
        return { coerced: stringValue };
      }
      return true;
    },
  };
};
