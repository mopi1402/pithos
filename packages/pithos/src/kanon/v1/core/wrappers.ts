/**
 * Pithos wrapper validation functions
 *
 * @since 1.1.0
 */

import type { PithosType } from "@kanon/v1/types/base";
import { addCheckMethod } from "@kanon/v1/utils/add-check-method";

// Import wrappers
import { PithosOptional } from "@kanon/v1/schemas/concepts/wrappers/optional";
import { PithosNullable } from "@kanon/v1/schemas/concepts/wrappers/nullable";
import { PithosDefault } from "@kanon/v1/schemas/concepts/wrappers/default";

// Wrapper functions

/**
 * Creates an optional schema.
 *
 * @since 1.1.0
 */
export const optional = <T extends PithosType>(schema: T) =>
  addCheckMethod(new PithosOptional(schema));

/**
 * Creates a nullable schema.
 *
 * @since 1.1.0
 */
export const nullable = <T extends PithosType>(schema: T) =>
  addCheckMethod(new PithosNullable(schema));

/**
 * Creates a default schema.
 *
 * @since 1.1.0
 */
export const default_ = <T extends PithosType>(
  schema: T,
  defaultValue: unknown | (() => unknown)
) => addCheckMethod(new PithosDefault(schema, defaultValue));

/**
 * Creates a readonly schema.
 *
 * @since 1.1.0
 */
export const readonly = <T extends PithosType>(schema: T) => {
  // For now, return the original schema
  // TODO: Implement PithosReadonly
  return addCheckMethod(schema);
};

/**
 * Creates a catch schema.
 *
 * @since 1.1.0
 */
export const catch_ = <T extends PithosType>(
  schema: T,
  fallback: unknown | (() => unknown) | ((ctx: { error: any }) => unknown)
) => {
  // For now, return the original schema
  // TODO: Implement PithosCatch
  return addCheckMethod(schema);
};
