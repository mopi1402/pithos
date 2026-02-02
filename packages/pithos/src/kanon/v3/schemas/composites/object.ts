import { Schema, GenericSchema, isCoerced } from "@kanon/v3/types/base";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/v3/core/consts/messages";
import { addObjectConstraints } from "@kanon/v3/schemas/constraints/object";
import { ObjectConstraint } from "@kanon/v3/types/constraints";
import { ObjectSchema } from "@kanon/v3/types/composites";

// INTENTIONAL: AnySchema - TypeScript needs 'any' here for generic inference with Schema<infer U>
// Using Schema<unknown> causes variance issues with refinements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySchema = Schema<any>;

/**
 * Object schema with composition and constraints.
 *
 * @param entries - Object entries schema definition.
 * @param message - Custom error message (optional).
 * @returns ObjectConstraint with all constraints.
 * @since 3.0.0
 */
export function object<T extends Record<string, AnySchema>>(
  entries: T,
  message?: string
): ObjectConstraint<T> {
  // Stryker disable next-line StringLiteral: Any non-"strict" value behaves identically (only "strict" triggers extra key validation)
  return createObjectSchema(entries, "loose", message);
}

/**
 * Strict object schema - strictly validates defined properties.
 *
 * @note This is equivalent to `object(entries).strict()`. Use `strictObject()` to create
 * a strict object directly, or `object().strict()` for method chaining.
 * @param entries - Object entries schema definition.
 * @param message - Custom error message (optional).
 * @returns ObjectConstraint with all constraints.
 * @since 3.0.0
 */
export function strictObject<T extends Record<string, AnySchema>>(
  entries: T,
  message?: string
): ObjectConstraint<T> {
  return createObjectSchema(
    entries,
    "strict",
    message
  );
}

/**
 * Loose object schema - validates defined properties but ignores others.
 *
 * @remarks Alias for {@link object} - both create loose object schemas by default.
 * @since 3.0.0
 */
export const looseObject = object;

/**
 * Creates an object schema with the specified mode.
 */
function createObjectSchema<T extends Record<string, AnySchema>>(
  entries: T,
  mode: "strict" | "loose",
  message?: string
): ObjectConstraint<T> {
  const baseSchema: ObjectSchema<T> = {
    type: "object" as const,
    message,
    entries: entries as T & Record<string, GenericSchema>,
    validator: ((value: unknown) => {
      if (typeof value !== "object" || value === null) {
        return message || ERROR_MESSAGES_COMPOSITION.object;
      }

      const obj = value as Record<string, unknown>;
      let coercedObj: Record<string, unknown> | null = null;

      // INTENTIONAL: for...in + direct property access is faster than Object.keys() iteration.
      // This allows inherited properties to pass validation, but in practice all real-world
      // inputs (JSON.parse, forms, APIs) create plain objects without custom prototypes.
      for (const key in entries) {
        const schema = entries[key];
        const propertyValue = obj[key];
        const result = schema.validator(propertyValue);

        if (result === true) {
          if (coercedObj) {
            coercedObj[key] = propertyValue;
          }
        } else if (isCoerced(result)) {
          if (!coercedObj) {
            coercedObj = { ...obj };
          }
          coercedObj[key] = result.coerced;
        } else {
          return `Property '${key}': ${result}`;
        }
      }

      if (mode === "strict") {
        for (const key in obj) {
          if (!(key in entries)) {
            return message || ERROR_MESSAGES_COMPOSITION.objectStrict(key);
          }
        }
      }

      if (coercedObj) {
        return { coerced: coercedObj };
      }

      return true;
    }) as ObjectSchema<T>["validator"],
  };

  return addObjectConstraints(baseSchema);
}
