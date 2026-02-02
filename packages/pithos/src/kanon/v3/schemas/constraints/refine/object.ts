import { ObjectConstraint } from "@kanon/v3/types/constraints";
import { ObjectSchema } from "@kanon/v3/types/composites";
import { GenericSchema, Infer, isCoerced } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";

type InferObjectEntries<T extends Record<string, GenericSchema>> = {
  [K in keyof T]: Infer<T[K]>;
};

/**
 * Adds a refinement to an object schema.
 * Returns a base ObjectSchema - the caller is responsible for adding constraints.
 *
 * @since 3.0.0
 */
/*@__INLINE__*/
export const refineObject = <T extends Record<string, GenericSchema>>(
  schema: ObjectSchema<T> | ObjectConstraint<T>,
  refinement: (value: InferObjectEntries<T>) => true | string
): ObjectSchema<T> => {
  const entries = schema.entries;
  const newRefinements = schema.refinements
    ? [...schema.refinements, refinement as (value: InferObjectEntries<T>) => true | string]
    : [refinement];

  return {
    type: "object" as const,
    message: schema.message,
    entries,
    refinements: newRefinements,
    validator: ((value: unknown) => {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return schema.message || ERROR_MESSAGES_COMPOSITION.object;
      }

      const obj = value as Record<string, unknown>;
      let coercedObj: Record<string, unknown> | null = null;

      for (const key in entries) {
        const entryResult = entries[key].validator(obj[key]);
        if (entryResult === true) {
          if (coercedObj) {
            coercedObj[key] = obj[key];
          }
        } else if (isCoerced(entryResult)) {
          if (!coercedObj) {
            coercedObj = { ...obj };
          }
          coercedObj[key] = entryResult.coerced;
        } else {
          return `${key}: ${entryResult}`;
        }
      }

      const finalObj = coercedObj ?? value;

      for (let i = 0; i < newRefinements.length; i++) {
        const result = newRefinements[i](finalObj as InferObjectEntries<T>);
        if (result !== true) return result;
      }

      if (coercedObj) {
        return { coerced: coercedObj };
      }

      return true;
    }) as ObjectSchema<T>["validator"],
  };
};
