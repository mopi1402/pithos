/**
 * Array schema implementation
 *
 * This file contains the array schema with optimized performance.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base";
import { _addIssue, _isArray } from "@kanon/v2/utils/helpers";

/**
 * Schéma array optimisé
 *
 * @since 2.0.0
 */
export interface ArraySchema<
  TItem extends BaseSchema = BaseSchema,
  TOutput = any[]
> extends BaseSchema<unknown, TOutput, BaseIssue<unknown>> {
  readonly type: "array";
  readonly expects: "Array";
  readonly item: TItem;
}

/**
 * Fonction utilitaire pour valider les éléments d'un array
 *
 * @since 2.0.0
 */
function validateArrayItems<TItem extends BaseSchema>(
  item: TItem,
  input: unknown[],
  dataset: OutputDataset<unknown, any>,
  config: PithosConfig,
  options: {
    minLength?: number;
    maxLength?: number;
    customMessage?: string | ((issue: BaseIssue<unknown>) => string);
  } = {}
): { output: any[]; hasErrors: boolean } {
  // Vérifier les contraintes de longueur
  if (options.minLength !== undefined && input.length < options.minLength) {
    _addIssue(
      {
        kind: "validation",
        type: "array",
        expects: `Array with at least ${options.minLength} items`,
        message:
          options.customMessage ||
          `Array must have at least ${options.minLength} items`,
      },
      "array",
      dataset,
      config
    );
    return { output: [], hasErrors: true };
  }

  if (options.maxLength !== undefined && input.length > options.maxLength) {
    _addIssue(
      {
        kind: "validation",
        type: "array",
        expects: `Array with at most ${options.maxLength} items`,
        message:
          options.customMessage ||
          `Array must have at most ${options.maxLength} items`,
      },
      "array",
      dataset,
      config
    );
    return { output: [], hasErrors: true };
  }

  const output: any[] = [];
  let hasErrors = false;

  // Validation des éléments de l'array
  for (let i = 0; i < input.length; i++) {
    const value = input[i];

    // Créer un dataset pour l'élément
    const itemDataset = {
      value,
      status: "unknown",
    } as OutputDataset<unknown, any>;

    // Valider l'élément
    const result = item["~run"](itemDataset, config);

    if (result.status === "success") {
      output[i] = result.value;
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
            "array",
            dataset,
            config,
            {
              path: [i],
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

  return { output, hasErrors };
}

/**
 * Crée un schéma array optimisé
 *
 * @since 2.0.0
 */
export function array<TItem extends BaseSchema>(
  item: TItem,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): ArraySchema<TItem> {
  return {
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    item,
    async: false,
    message,
    "~run"(
      dataset: OutputDataset<unknown, any>,
      config: PithosConfig
    ): OutputDataset<any[], BaseIssue<unknown>> {
      // Vérification de type optimisée
      if (!_isArray(dataset.value)) {
        _addIssue(
          {
            kind: "schema",
            type: "array",
            expects: "Array",
            message,
          },
          "array",
          dataset,
          config
        );
        (dataset as any).status = "failure";
        return dataset as OutputDataset<any[], BaseIssue<unknown>>;
      }

      const input = dataset.value as unknown[];
      const { output, hasErrors } = validateArrayItems(
        item,
        input,
        dataset,
        config
      );

      if (hasErrors) {
        (dataset as any).status = "failure";
        return dataset as OutputDataset<any[], BaseIssue<unknown>>;
      }

      // Succès - marquer comme typé et retourner la valeur
      (dataset as any).status = "success";
      (dataset as any).value = output;
      return dataset as OutputDataset<any[], BaseIssue<unknown>>;
    },
  };
}

// Export de la fonction utilitaire pour les contraintes
export { validateArrayItems };
