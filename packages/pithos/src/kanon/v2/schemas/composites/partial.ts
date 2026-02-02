/**
 * Partial schema implementation
 *
 * This file contains the partial schema for optional object properties.
 */

import type {
  BaseSchema,
  BaseIssue,
  ObjectEntries,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base.js";
import { _addIssue, _isObject } from "@kanon/v2/utils/helpers.js";

/**
 * Fonction utilitaire pour valider les propriétés d'un objet (version partial)
 */
function validatePartialObjectProperties<TEntries extends ObjectEntries>(
  entries: TEntries,
  input: Record<string, unknown>,
  dataset: OutputDataset<unknown, any>,
  config: PithosConfig,
  options: {
    customMessage?: string | ((issue: BaseIssue<unknown>) => string);
  } = {}
): { output: Record<string, unknown>; hasErrors: boolean } {
  const output: Record<string, unknown> = {};
  let hasErrors = false;

  for (const key in entries) {
    if (entries.hasOwnProperty(key)) {
      // Pour partial, on ignore les propriétés manquantes
      if (!(key in input)) {
        continue;
      }

      const schema = entries[key];
      const value = input[key];

      // Créer un dataset pour la propriété
      const propertyDataset = {
        value,
        status: "unknown",
      } as OutputDataset<unknown, any>;

      // Valider la propriété
      const result = schema["~run"](propertyDataset, config);

      if (result.status === "success") {
        output[key] = result.value;
      } else {
        hasErrors = true;
        // Ajouter l'issue avec le path
        if (result.issues) {
          for (const issue of result.issues) {
            _addIssue(
              {
                kind: issue.kind,
                type: issue.type,
                expects: issue.expected,
                message: issue.message,
              },
              "object",
              dataset,
              config,
              {
                path: [key],
                issues: [issue],
              }
            );
          }
        }
      }

      // Early exit si configuré
      if (config.abortEarly && hasErrors) {
        break;
      }
    }
  }

  return { output, hasErrors };
}

/**
 * Crée un schéma object avec des propriétés optionnelles
 *
 * @since 2.0.0
 */
export function partial<TEntries extends ObjectEntries>(
  entries: TEntries,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): BaseSchema<unknown, { [K in keyof TEntries]?: any }, BaseIssue<unknown>> {
  return {
    kind: "schema",
    type: "object",
    reference: partial,
    expects: "Object",
    async: false,
    message,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<{ [K in keyof TEntries]?: any }, BaseIssue<unknown>> {
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
        return dataset as OutputDataset<
          { [K in keyof TEntries]?: any },
          BaseIssue<unknown>
        >;
      }

      const input = dataset.value as Record<string, unknown>;
      const { output, hasErrors } = validatePartialObjectProperties(
        entries,
        input,
        dataset,
        config,
        { customMessage: message }
      );

      if (hasErrors) {
        (dataset as any).status = "failure";
        return dataset as OutputDataset<
          { [K in keyof TEntries]?: any },
          BaseIssue<unknown>
        >;
      }

      // Succès - marquer comme typé et retourner la valeur
      (dataset as any).status = "success";
      (dataset as any).value = output;
      return dataset as OutputDataset<
        { [K in keyof TEntries]?: any },
        BaseIssue<unknown>
      >;
    },
  };
}
