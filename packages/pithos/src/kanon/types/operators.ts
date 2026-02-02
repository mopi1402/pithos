/**
 * Specialized types for V3 operators (union, intersection).
 *
 * @since 3.0.0
 */

import { Schema, GenericSchema, Infer } from "./base";
import { LiteralSchema, EnumValue } from "./primitives";

// INTENTIONAL: GenericSchema - needed for union/intersection to accept schemas of different types.
// TypeScript's variance prevents Schema<T1> from being assignable to Schema<unknown>.
// GenericSchema uses Schema<any> which accepts all schema types.
// This is safe because we only use schemas for validation, not modification.

type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

/**
 * Schema for union types.
 *
 * @template Schemas - The union member schemas
 * @template T - The inferred union type
 * @since 3.0.0
 */
export type UnionSchema<
  Schemas extends readonly GenericSchema[],
  T = Infer<Schemas[number]>
> = Schema<T> & {
  type: "union";
  schemas: Schemas;
};

/**
 * Schema for intersection types.
 *
 * @template Schemas - The intersection member schemas
 * @template T - The inferred intersection type
 * @since 3.0.0
 */
export type IntersectionSchema<
  Schemas extends readonly GenericSchema[],
  T = UnionToIntersection<Infer<Schemas[number]>>
> = Schema<T> & {
  type: "intersection";
  schemas: Schemas;
};

/**
 * Base constraint for object schemas that can be discriminated.
 * This is a looser type that accepts both ObjectSchema and ObjectConstraint.
 *
 * @internal
 * @since 3.0.0
 */
export interface DiscriminableObjectBase {
  type: "object";
  entries: Record<string, GenericSchema>;
  validator: (value: unknown) => true | string;
}

/**
 * A discriminated union schema with O(1) lookup based on a discriminator key.
 *
 * @template Discriminator - The key used to discriminate between variants.
 * @template Schemas - Array of object schemas with a literal discriminator field.
 * @since 3.0.0
 */
export type DiscriminatedUnionSchema<
  Discriminator extends string,
  // INTENTIONAL: Using GenericSchema[] instead of DiscriminableObjectBase[]
  // to allow type inference to work correctly with ObjectConstraint returns.
  // Runtime checks ensure schemas are actually object schemas.
  Schemas extends readonly GenericSchema[],
  T = Infer<Schemas[number]>
> = Schema<T> & {
  type: "union";
  discriminator: Discriminator;
  schemas: Schemas;
  schemaMap: Map<EnumValue, GenericSchema>;
};

/**
 * An object schema that can be used in a discriminated union.
 * The discriminator field must be a literal schema.
 *
 * @template Discriminator - The key of the discriminator field.
 * @since 3.0.0
 */
export type DiscriminableSchema<Discriminator extends string> =
  DiscriminableObjectBase & {
    entries: Record<string, GenericSchema> & {
      [K in Discriminator]: LiteralSchema<EnumValue>;
    };
  };