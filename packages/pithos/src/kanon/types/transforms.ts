/**
 * Specialized types for V3 schema transforms (partial, required, pick, omit, keyof).
 *
 * @since 3.0.0
 */

import { Schema, GenericSchema, Infer } from "./base";

/**
 * Schema for keyof transform.
 *
 * @template ObjectSchema - The object schema type
 * @since 3.0.0
 */
export type KeyofSchema<ObjectSchema extends GenericSchema> = Schema<
  keyof Infer<ObjectSchema> & string
> & {
  type: "keyof";
  objectSchema: ObjectSchema;
};

/**
 * Schema for partial transform.
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type PartialSchema<Inner extends GenericSchema> = Schema<
  Partial<Infer<Inner>>
> & {
  type: "partial";
  innerSchema: Inner;
};

/**
 * Schema for required transform.
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type RequiredSchema<Inner extends GenericSchema> = Schema<
  Required<Infer<Inner>>
> & {
  type: "required";
  innerSchema: Inner;
};

/**
 * Schema for pick transform.
 *
 * @template Inner - The inner schema type
 * @template Keys - The keys to pick
 * @since 3.0.0
 */
export type PickSchema<
  Inner extends GenericSchema,
  Keys extends keyof Infer<Inner>
> = Schema<Pick<Infer<Inner>, Keys>> & {
  type: "pick";
  innerSchema: Inner;
  keys: readonly Keys[];
};

/**
 * Schema for omit transform.
 *
 * @template Inner - The inner schema type
 * @template Keys - The keys to omit
 * @since 3.0.0
 */
export type OmitSchema<
  Inner extends GenericSchema,
  Keys extends keyof Infer<Inner>
> = Schema<Omit<Infer<Inner>, Keys>> & {
  type: "omit";
  innerSchema: Inner;
  keys: readonly Keys[];
};