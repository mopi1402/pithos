/**
 * Object schema implementation
 *
 * This file contains the object schema with optimized performance and JIT compilation.
 */

import type {
  BaseSchema,
  BaseIssue,
  ObjectEntries,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue, _isObject } from "@kanon/v2/utils/helpers";
import { generateObjectJIT, isJITEnabled } from "@kanon/v2/core/jit";

/**
 * Schéma object optimisé
 *
 * @since 2.0.0
 */
export interface ObjectSchema<
  TEntries extends ObjectEntries = ObjectEntries,
  TOutput = { [K in keyof TEntries]: any }
> extends BaseSchema<unknown, TOutput, BaseIssue> {
  readonly type: "object";
  readonly expects: "Object";
  readonly entries: TEntries;
}

/**
 * Fonction utilitaire pour valider les propriétés d'un objet
 */
function validateObjectProperties<TEntries extends ObjectEntries>(
  entries: TEntries,
  input: Record<string, unknown>,
  dataset: OutputDataset<unknown, any>,
  config: PithosConfig,
  options: {
    isPartial?: boolean;
    customMessage?: string | ((issue: BaseIssue) => string);
  } = {}
): { output: Record<string, unknown>; hasErrors: boolean; aborted?: boolean } {
  const output: Record<string, unknown> = {};
  let hasErrors = false;

  for (const key in entries) {
    if (entries.hasOwnProperty(key)) {
      // Pour partial, on ignore les propriétés manquantes
      if (options.isPartial && !(key in input)) {
        continue;
      }

      const schema = entries[key];
      const value = input[key];

      // Dataset simple sans pooling (approche Zod-like)
      const propertyDataset = {
        value,
        status: "unknown" as const,
        issues: undefined,
      };

      // Valider la propriété
      const result = schema["~run"](propertyDataset, config);

      if (result.status === "success") {
        output[key] = result.value;
      } else {
        hasErrors = true;
        // Ajouter l'issue avec le path corrigé
        if (result.issues) {
          for (const issue of result.issues) {
            // Créer une nouvelle issue avec le path correct (sans spread pour de meilleures performances)
            const objectIssue: BaseIssue<unknown> = {
              kind: issue.kind,
              type: issue.type,
              input: issue.input,
              expected: issue.expected,
              received: issue.received,
              message: issue.message,
              requirement: issue.requirement,
              path: [key], // Forcer le path correct
              issues: issue.issues,
              lang: issue.lang,
              abortEarly: issue.abortEarly,
            };

            // Ajouter directement au dataset
            if (dataset.issues) {
              dataset.issues.push(objectIssue);
            } else {
              (dataset as any).issues = [objectIssue];
            }

            // Early exit si configuré - sortir de toutes les boucles
            if (config.abortEarly) {
              return { output, hasErrors, aborted: true };
            }
          }
        }
      }
    }
  }

  return { output, hasErrors };
}

/**
 * Crée un schéma object optimisé
 *
 * @since 2.0.0
 */
export function object<TEntries extends ObjectEntries>(
  entries: TEntries,
  message?: string | ((issue: BaseIssue) => string)
): ObjectSchema<TEntries> {
  // Optimisation Zod : Cache paresseux pour la normalisation
  // const _normalized = cached(() => normalizeObjectDef(entries)); // Code mort supprimé

  return {
    kind: "schema",
    type: "object",
    reference: object,
    expects: "Object",
    entries,
    async: false,
    message,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<{ [K in keyof TEntries]: any }, BaseIssue> {
      // Vérification de type optimisée
      if (!_isObject(dataset.value)) {
        _addIssue(
          {
            kind: "schema",
            type: "object",
            expects: "Object",
            message,
          },
          "object",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<
          { [K in keyof TEntries]: any },
          BaseIssue
        >;
      }

      const input = dataset.value as Record<string, unknown>;

      // Utiliser le JIT si disponible et configuré (mais pas avec abortEarly)
      if (
        isJITEnabled() &&
        Object.keys(entries).length > 1 &&
        !config.abortEarly
      ) {
        try {
          const jitFn = generateObjectJIT(entries, config);
          const result = jitFn(entries, dataset, config);

          if (result.status === "success") {
            return result as OutputDataset<
              { [K in keyof TEntries]: any },
              BaseIssue
            >;
          } else {
            return dataset as OutputDataset<
              { [K in keyof TEntries]: any },
              BaseIssue
            >;
          }
        } catch (error) {
          // Fallback vers l'approche classique en cas d'erreur JIT
          console.warn(
            "JIT compilation failed, falling back to standard validation:",
            error
          );
        }
      }

      // Validation classique (fallback ou quand JIT non disponible)
      const result = validateObjectProperties(entries, input, dataset, config);

      // Si abortEarly a été déclenché, retourner directement le dataset
      if (result.aborted) {
        (dataset as any).status = "failure";
        return dataset as OutputDataset<
          { [K in keyof TEntries]: any },
          BaseIssue
        >;
      }

      const { output, hasErrors } = result;

      if (hasErrors) {
        (dataset as any).status = "failure";
        return dataset as OutputDataset<
          { [K in keyof TEntries]: any },
          BaseIssue
        >;
      }

      // Succès - marquer comme typé et retourner la valeur
      (dataset as any).status = "success";
      (dataset as any).value = output;
      return dataset as OutputDataset<
        { [K in keyof TEntries]: any },
        BaseIssue<unknown>
      >;
    },
  };
}
