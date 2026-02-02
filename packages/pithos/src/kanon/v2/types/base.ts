/**
 * Types de base pour la validation
 *
 * @since 1.1.0
 */

import type {
  OutputDataset,
  PithosConfig,
  UnknownDataset,
} from "@kanon/v2/core/dataset.js";

// Réexporter PithosConfig et OutputDataset pour faciliter les imports
export type { PithosConfig, OutputDataset };

/**
 * BaseIssue - représente une erreur de validation
 *
 * @since 2.0.0
 */
export interface BaseIssue<TInput = unknown> {
  /**
   * Le type d'issue (schema, validation, transformation)
   */
  readonly kind: "schema" | "validation" | "transformation";
  /**
   * Le type de schéma (string, number, object, etc.)
   */
  readonly type: string;
  /**
   * La valeur d'entrée qui a causé l'issue
   */
  readonly input: TInput;
  /**
   * La description de la valeur attendue
   */
  readonly expected?: string;
  /**
   * La description de la valeur reçue
   */
  readonly received?: string;
  /**
   * Le message d'erreur
   */
  readonly message: string;
  /**
   * Le requirement qui a échoué
   */
  readonly requirement?: unknown;
  /**
   * Le chemin vers l'issue
   */
  readonly path?: (string | number)[];
  /**
   * Issues imbriquées
   */
  readonly issues?: BaseIssue<unknown>[];
  /**
   * Langue pour les messages d'erreur
   */
  readonly lang?: string;
  /**
   * Whether to abort early
   */
  readonly abortEarly?: boolean;
}

/**
 * BaseSchema - interface de base pour tous les schémas
 *
 * @since 2.0.0
 */
export interface BaseSchema<
  TInput = unknown,
  TOutput = TInput,
  TIssue extends BaseIssue<TInput> = BaseIssue<TInput>
> {
  /**
   * Le type de schéma
   */
  readonly kind: "schema";
  /**
   * Le type de validation (string, number, object, etc.)
   */
  readonly type: string;

  /**
   * La fonction de référence qui a créé le schéma
   */
  readonly reference: (...args: any[]) => any;
  /**
   * La description du type attendu
   */
  readonly expects: string;
  /**
   * Whether the schema is async
   */
  readonly async: false;
  /**
   * Le message d'erreur personnalisé
   */
  readonly message?: string | ((issue: TIssue) => string);
  /**
   * La fonction de validation
   */
  "~run"(
    dataset: UnknownDataset | OutputDataset<unknown, BaseIssue<unknown>>,
    config: PithosConfig
  ): OutputDataset<TOutput, TIssue>;
}

/**
 * String issue - erreur pour les schémas string
 *
 * @since 2.0.0
 */
export interface StringIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "string";
  readonly expected: "string";
}

/**
 * Number issue - erreur pour les schémas number
 *
 * @since 2.0.0
 */
export interface NumberIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "number";
  readonly expected: "number";
}

/**
 * Boolean issue - erreur pour les schémas boolean
 *
 * @since 2.0.0
 */
export interface BooleanIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "boolean";
  readonly expected: "boolean";
}

/**
 * Object issue - erreur pour les schémas object
 *
 * @since 2.0.0
 */
export interface ObjectIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "object";
  readonly expected: "Object";
}

/**
 * Array issue - erreur pour les schémas array
 *
 * @since 2.0.0
 */
export interface ArrayIssue extends BaseIssue<unknown> {
  readonly kind: "schema";
  readonly type: "array";
  readonly expected: "Array";
}

/**
 * Object entries - pour les schémas object
 *
 * @since 2.0.0
 */
export type ObjectEntries = Record<
  string,
  BaseSchema<unknown, unknown, BaseIssue<unknown>>
>;

/**
 * Object path item - pour les chemins d'objets
 *
 * @since 2.0.0
 */
export interface ObjectPathItem {
  readonly type: "object";
  readonly origin: "value" | "key";
  readonly input: Record<string, unknown>;
  readonly key: string;
  readonly value: unknown;
}

/**
 * Array path item - pour les chemins d'arrays
 *
 * @since 2.0.0
 */
export interface ArrayPathItem {
  readonly type: "array";
  readonly origin: "value";
  readonly input: unknown[];
  readonly key: number;
  readonly value: unknown;
}

/**
 * Path item - union des types de chemins
 *
 * @since 2.0.0
 */
export type PathItem = ObjectPathItem | ArrayPathItem;

/**
 * Infer input type from schema
 *
 * @since 2.0.0
 */
export type InferInput<TSchema extends BaseSchema> = TSchema extends BaseSchema<
  infer TInput,
  any,
  any
>
  ? TInput
  : never;

/**
 * Infer output type from schema
 *
 * @since 2.0.0
 */
export type InferOutput<TSchema extends BaseSchema> =
  TSchema extends BaseSchema<any, infer TOutput, any> ? TOutput : never;

/**
 * Infer issue type from schema
 *
 * @since 2.0.0
 */
export type InferIssue<TSchema extends BaseSchema> = TSchema extends BaseSchema<
  any,
  any,
  infer TIssue
>
  ? TIssue
  : never;
