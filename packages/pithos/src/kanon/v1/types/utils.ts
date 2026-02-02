/**
 * Types utilitaires pour la validation Pithos
 *
 * @since 1.1.0
 */

/**
 * Types pour les fonctions de check avec options
 */
export type CheckFunctionWithOptions = {
  __abort?: boolean;
  (data: unknown): boolean | unknown;
};

/**
 * Types pour les propriétés de schéma
 *
 * @since 1.1.0
 */
export interface PithosDef {
  typeName: string;
  type: string;
  values?: unknown[];
  [key: string]: unknown;
}

/**
 * Types pour les formats de nombres
 *
 * @since 1.1.0
 */
export type PithosNumberFormat = "int" | "float" | "int64" | "uint64";

/**
 * Types pour les formats de chaînes
 *
 * @since 1.1.0
 */
export type PithosStringFormat =
  | "email"
  | "url"
  | "uuid"
  | "cuid"
  | "cuid2"
  | "ulid"
  | "datetime"
  | "date"
  | "time"
  | "duration";

/**
 * Types pour les propriétés de schéma étendues
 *
 * @since 1.1.0
 */
export interface PithosSchemaDef extends PithosDef {
  element?: any;
  key?: any;
  value?: any;
  items?: any[];
  options?: unknown[];
  [key: string]: unknown;
}

/**
 * Types pour les contraintes de validation
 *
 * @since 1.1.0
 */
export type PithosValidationType =
  // Number constraints
  | "min"
  | "max"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "int"
  | "positive"
  | "negative"
  | "finite"
  | "safe"
  // String constraints
  | "minLength"
  | "maxLength"
  | "length"
  | "regex"
  | "email"
  | "url"
  | "uuid"
  | "cuid"
  | "cuid2"
  | "ulid"
  | "datetime"
  | "date"
  | "time"
  | "duration"
  | "startsWith"
  | "endsWith"
  | "includes"
  | "lowercase"
  | "uppercase"
  | "trim"
  // Array constraints
  | "minSize"
  | "maxSize"
  | "size"
  // Custom constraints
  | "custom"
  | "refine";

/**
 * Validation constraint interface.
 *
 * @since 1.1.0
 */
export interface PithosValidationConstraint {
  type: PithosValidationType;
  value: unknown;
  message?: string;
}

/**
 * Types pour les transformations
 *
 * @since 1.1.0
 */
export interface PithosTransform<TInput, TOutput> {
  transform: (data: TInput) => TOutput;
  safeTransform: (
    data: TInput
  ) => { success: true; data: TOutput } | { success: false; error: any };
}

/**
 * Type pour les schémas dynamiques avec propriétés ajoutées
 *
 * @since 1.1.0
 */
export type SchemaWithMetadata = any & {
  def: {
    type: string;
    values?: unknown[];
  };
  type: string;
};

/**
 * Types pour les schémas littéraux et enums
 *
 * @since 1.1.0
 */
export type PithosLiteralSchema = any & {
  value: unknown;
};

/**
 * Enum schema type.
 *
 * @since 1.1.0
 */
export type PithosEnumSchema = any & {
  values: unknown[];
};
