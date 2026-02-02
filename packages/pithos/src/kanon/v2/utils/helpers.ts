/**
 * Utilitaires optimisés pour la validation
 *
 * Ce fichier contient les fonctions utilitaires optimisées
 * inspirées de Valibot pour de meilleures performances.
 */

import type { BaseIssue, OutputDataset, PithosConfig } from "../types/base.js";
import type { UnknownDataset } from "../core/dataset.js";

/**
 * Ajoute une issue au dataset de manière optimisée
 *
 * Cette fonction est inspirée de Valibot's _addIssue mais optimisée
 * pour Kanon avec des performances maximales.
 *
 * @since 2.0.0
 */
export function _addIssue<
  TContext extends {
    kind: "schema" | "validation" | "transformation";
    type: string;
    expects?: string | null;
    requirement?: unknown;
    message?: string | ((issue: BaseIssue<unknown>) => string);
  },
  TDataset extends OutputDataset<unknown, BaseIssue<unknown>> | UnknownDataset
>(
  context: TContext,
  label: string,
  dataset: TDataset,
  config: PithosConfig,
  other?: {
    path?: (string | number)[];
    issues?: BaseIssue<unknown>[];
  }
): void {
  // Générer le message d'erreur optimisé
  let message = "";

  // PRIORITÉ 1: Utiliser config.message si disponible
  if (config.message) {
    if (typeof config.message === "string") {
      message = config.message;
    } else {
      // Créer une issue temporaire pour générer le message
      const tempIssue: BaseIssue<unknown> = {
        kind: context.kind,
        type: context.type,
        input: dataset.value,
        expected: context.expects || undefined,
        received: typeof dataset.value,
        message: "",
        requirement: context.requirement,
        path: other?.path,
        issues: other?.issues,
        lang: config.lang,
        abortEarly: config.abortEarly,
      };
      message = config.message(tempIssue);
    }
  }
  // PRIORITÉ 2: Utiliser context.message (message du schéma)
  else if (context.message) {
    if (typeof context.message === "string") {
      message = context.message;
    } else {
      // Créer une issue temporaire pour générer le message
      const tempIssue: BaseIssue<unknown> = {
        kind: context.kind,
        type: context.type,
        input: dataset.value,
        expected: context.expects || undefined,
        received: typeof dataset.value,
        message: "",
        requirement: context.requirement,
        path: other?.path,
        issues: other?.issues,
        lang: config.lang,
        abortEarly: config.abortEarly,
      };
      message = context.message(tempIssue);
    }
  } else {
    // PRIORITÉ 3: Message par défaut optimisé
    const expected = context.expects
      ? `Expected ${context.expects}`
      : "Expected valid value";
    const received = `Received ${typeof dataset.value}`;
    message = `Invalid ${label}: ${expected} but ${received}`;
  }

  // Créer l'issue finale (sans spread operator pour de meilleures performances)
  const issue: BaseIssue<unknown> = {
    kind: context.kind,
    type: context.type,
    input: dataset.value,
    expected: context.expects || undefined,
    received: typeof dataset.value,
    message,
    requirement: context.requirement,
    path: other?.path,
    issues: other?.issues,
    lang: config.lang,
    abortEarly: config.abortEarly,
  };

  // Ajouter l'issue au dataset de manière optimisée
  if (dataset.issues) {
    // Dataset a déjà des issues, ajouter à la fin
    dataset.issues.push(issue);
  } else {
    // Dataset n'a pas d'issues, créer le tableau
    (dataset as any).issues = [issue];
  }

  // Marquer le dataset comme non-typé si c'est une erreur de type
  if (context.kind === "schema" && context.type !== typeof dataset.value) {
    (dataset as any).typed = false;
  }
}

/**
 * Vérifie si une valeur est un objet valide
 *
 * Optimisé pour éviter les vérifications coûteuses.
 *
 * @since 2.0.0
 */
export function _isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Vérifie si une valeur est un array valide
 *
 * Optimisé pour éviter les vérifications coûteuses.
 *
 * @since 2.0.0
 */
export function _isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Vérifie si une valeur est une string valide
 *
 * Optimisé pour éviter les vérifications coûteuses.
 *
 * @since 2.0.0
 */
export function _isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Vérifie si une valeur est un number valide
 *
 * Optimisé pour éviter les vérifications coûteuses.
 *
 * @since 2.0.0
 */
export function _isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Vérifie si une valeur est un boolean valide
 *
 * Optimisé pour éviter les vérifications coûteuses.
 *
 * @since 2.0.0
 */
export function _isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}
