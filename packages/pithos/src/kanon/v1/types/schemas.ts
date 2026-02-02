/**
 * Types de schémas étendus pour la validation Pithos
 *
 * @since 1.1.0
 */

import type { PithosType } from "../types/base";

/**
 * Schema type with check method
 *
 * @since 1.1.0
 */
export interface PithosTypeWithCheck<Output = unknown, Input = unknown>
  extends PithosType<Output, Input> {
  check(...checks: ((data: Output) => any)[]): this;
}

/**
 * Types pour les schémas avec méthode check
 *
 * @since 1.1.0
 */
export type PithosTypeWithCheckExtended<
  Output = unknown,
  Input = unknown
> = PithosType<Output, Input> & {
  def: {
    type: string;
    values?: unknown[];
  };
  type: string;
  check: (
    ...checks: ((data: Output) => any)[]
  ) => PithosTypeWithCheckExtended<Output, Input>;
};

/**
 * Types pour les schémas littéraux et enums
 *
 * @since 1.1.0
 */
export type PithosLiteralSchema = PithosType & {
  value: unknown;
};

/**
 * Enum schema type.
 *
 * @since 1.1.0
 */
export type PithosEnumSchema = PithosType & {
  values: unknown[];
};
