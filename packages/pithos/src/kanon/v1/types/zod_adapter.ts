/**
 * Zod adapter - Simple type aliases and wrapper
 *
 * @since 1.1.0
 */

import { validation } from "..";

// Simple type aliases for Zod compatibility

/**
 * Zod safe parse result type alias.
 *
 * @since 1.1.0
 */
export type ZodSafeParseResult<T> =
  import("../types/base").PithosSafeParseResult<T>;

/**
 * Zod issue type alias.
 *
 * @since 1.1.0
 */
export type ZodIssue = import("../types/base").PithosIssue;
export { PithosError as ZodError } from "../errors";

// Utility type aliases

/**
 * Output type alias.
 *
 * @since 1.1.0
 */
export type output<T> = T extends import("../types/base").PithosType<infer U>
  ? U
  : unknown;

/**
 * Input type alias.
 *
 * @since 1.1.0
 */
export type input<T> = T extends import("../types/base").PithosType<
  any,
  infer U
>
  ? U
  : unknown;

/**
 * Infer type alias.
 *
 * @since 1.1.0
 */
export type infer<T> = T extends import("../types/base").PithosType<infer U>
  ? U
  : unknown;

// Import the validation object

/**
 * Zod-compatible wrapper.
 *
 * @since 1.1.0
 */
export const z = {
  // Re-export all existing functions (tree-shaking preserved)
  ...validation,

  // Override object with better type inference
  object: <T extends Record<string, import("../types/base").PithosType>>(
    shape: T
  ) => {
    const result = validation.object(shape);
    // Add type information for better inference
    (result as any)._shape = shape;
    return result as typeof result & { _shape: T };
  },

  // Note: pick/omit are available directly from validation object
  // Use validation.pick(shape, keys) and validation.omit(shape, keys)

  // Missing Zod functions (stubs for compatibility)
  nonoptional: <T>(schema: T) => {
    // For objects, use required. For other types, return as-is
    if (typeof schema === "object" && schema !== null && "shape" in schema) {
      return validation.required(schema as any);
    }
    return schema;
  },

  // Add other missing Zod functions as needed
  function: () => validation.any(), // Stub
  promise: <T>(schema: T) => validation.any(), // Stub
  transform: <TInput, TOutput>(transformFn: (data: TInput) => TOutput) =>
    validation.any(), // Stub
  pipe: <T extends any[]>(...schemas: T) => schemas[0], // Stub
  preprocess: <TInput, TOutput>(
    preprocessFn: (data: TInput) => TOutput,
    schema: any
  ) => schema, // Stub
  refine: <T>(schema: T, validator: (data: any) => boolean) =>
    validation.refine(schema as any, { abort: false }), // Stub
} as const;
