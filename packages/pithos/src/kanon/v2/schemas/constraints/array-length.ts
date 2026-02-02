/**
 * Array constraints implementation
 *
 * This file contains array constraints like minLength and maxLength.
 */

import type {
  BaseSchema,
  BaseIssue,
  OutputDataset,
  PithosConfig,
} from "@kanon/v2/types/base.js";
import { _addIssue, _isArray } from "@kanon/v2/utils/helpers.js";
import { validateArrayItems } from "@kanon/v2/schemas/composites/array.js";

/**
 * Crée un schéma array avec une longueur minimale
 *
 * @since 2.0.0
 */
export function minLength<TItem extends BaseSchema>(
  item: TItem,
  min: number,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): BaseSchema<unknown, any[], BaseIssue<unknown>> {
  return {
    kind: "schema",
    type: "array",
    reference: minLength,
    expects: "Array",
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
        return dataset as OutputDataset<any[], BaseIssue<unknown>>;
      }

      const input = dataset.value as unknown[];
      const { output, hasErrors } = validateArrayItems(
        item,
        input,
        dataset,
        config,
        { minLength: min, customMessage: message }
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

/**
 * Crée un schéma array avec une longueur maximale
 *
 * @since 2.0.0
 */
export function maxLength<TItem extends BaseSchema>(
  item: TItem,
  max: number,
  message?: string | ((issue: BaseIssue<unknown>) => string)
): BaseSchema<unknown, any[], BaseIssue<unknown>> {
  return {
    kind: "schema",
    type: "array",
    reference: maxLength,
    expects: "Array",
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
        return dataset as OutputDataset<any[], BaseIssue<unknown>>;
      }

      const input = dataset.value as unknown[];
      const { output, hasErrors } = validateArrayItems(
        item,
        input,
        dataset,
        config,
        { maxLength: max, customMessage: message }
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
