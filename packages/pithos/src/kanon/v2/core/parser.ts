/**
 * Parser functions
 *
 * This file contains the safeParse and parse functions
 * for schema validation with optimized performance.
 */

import type {
  BaseSchema,
  BaseIssue,
  PithosConfig,
} from "@kanon/v2/types/base.js";

/**
 * SafeParse result interface
 *
 * @since 2.0.0
 */
export interface SafeParseResult<T> {
  success: boolean;
  data?: T;
  error?: {
    issues: BaseIssue<unknown>[];
  };
}

/**
 * SafeParse function
 *
 * This function validates a value with a schema and returns
 * a structured result with success/failure.
 *
 * @since 2.0.0
 */
export function safeParse<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  input: unknown,
  config: PithosConfig = {}
): SafeParseResult<T> {
  const defaultConfig: PithosConfig = {
    lang: config?.lang ?? "en",
    abortEarly: config?.abortEarly ?? false,
  };

  // Créer le dataset initial simple (approche Zod-like)
  const dataset = {
    value: input,
    status: "unknown" as const,
    issues: undefined,
  };

  // Exécuter la validation
  const result = schema["~run"](dataset, defaultConfig);

  // Vérifier si la validation a réussi
  if (result.status === "success") {
    return {
      success: true,
      data: result.value as T,
    };
  }

  // La validation a échoué
  return {
    success: false,
    error: {
      issues: result.issues || [],
    },
  };
}

/**
 * Fonction parse optimisée (version qui lance une erreur)
 *
 * Cette fonction valide une valeur avec un schéma et lance
 * une erreur si la validation échoue, inspiré de Valibot.
 *
 * @since 2.0.0
 */
export function parse<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  input: unknown,
  config: PithosConfig = {}
): T {
  const result = safeParse(schema, input, config);

  if (result.success) {
    return result.data!;
  }

  // Créer une erreur structurée
  const error = new Error("Validation failed");
  (error as any).issues = result.error!.issues;
  throw error;
}

/**
 * Fonction safeParseAsync optimisée pour les schémas async
 *
 * Cette fonction valide une valeur avec un schéma async et retourne
 * une Promise avec un résultat structuré.
 *
 * @since 2.0.0
 */
export async function safeParseAsync<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  input: unknown,
  config: PithosConfig = {}
): Promise<SafeParseResult<T>> {
  // Configuration par défaut optimisée (sans spread operator)
  const defaultConfig: PithosConfig = {
    lang: config?.lang ?? "en",
    abortEarly: config?.abortEarly ?? false,
  };

  // Créer le dataset initial simple (approche Zod-like)
  const dataset = {
    value: input,
    status: "unknown" as const,
    issues: undefined,
  };

  // Exécuter la validation async
  const result = await schema["~run"](dataset, defaultConfig);

  // Vérifier si la validation a réussi
  if (result.status === "success") {
    return {
      success: true,
      data: result.value as T,
    };
  }

  // La validation a échoué
  return {
    success: false,
    error: {
      issues: result.issues || [],
    },
  };
}

/**
 * Fonction parseAsync optimisée (version qui lance une erreur)
 *
 * Cette fonction valide une valeur avec un schéma async et lance
 * une erreur si la validation échoue.
 *
 * @since 2.0.0
 */
export async function parseAsync<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  input: unknown,
  config: PithosConfig = {}
): Promise<T> {
  const result = await safeParseAsync(schema, input, config);

  if (result.success) {
    return result.data!;
  }

  // Créer une erreur structurée
  const error = new Error("Validation failed");
  (error as any).issues = result.error!.issues;
  throw error;
}

/**
 * Fonction utilitaire pour valider plusieurs valeurs (version optimisée)
 *
 * Cette fonction permet de valider plusieurs valeurs avec
 * le même schéma de manière optimisée pour le bulk validation.
 *
 * @since 2.0.0
 */
export function safeParseMany<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  inputs: unknown[],
  config: PithosConfig = {}
): SafeParseResult<T>[] {
  // Configuration par défaut optimisée pour le bulk
  const defaultConfig: PithosConfig = {
    lang: "en",
    abortEarly: false,
    ...config,
  };

  const length = inputs.length;
  // Optimisation 1: Pré-allouer le tableau avec la bonne taille
  const results: SafeParseResult<T>[] = new Array(length);

  // Boucle optimisée avec datasets simples (approche Zod-like)
  for (let i = 0; i < length; i++) {
    const input = inputs[i];

    // Dataset simple sans pooling (comme Zod)
    const dataset = {
      value: input,
      status: "unknown" as const,
      issues: undefined,
    };

    // Exécuter la validation
    const result = schema["~run"](dataset, defaultConfig);

    // Vérifier si la validation a réussi
    if (result.status === "success") {
      results[i] = {
        success: true,
        data: result.value as T,
      };
    } else {
      results[i] = {
        success: false,
        error: {
          issues: result.issues || [],
        },
      };
    }
  }

  return results;
}

/**
 * Fonction bulk validation optimisée (approche Zod)
 *
 * Cette fonction valide un tableau de données en une seule fois,
 * ce qui est plus efficace que safeParseMany pour de gros volumes.
 *
 * @since 2.0.0
 */
export function safeParseBulk<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  inputs: unknown[],
  config: PithosConfig = {}
): SafeParseResult<T[]> {
  // Configuration par défaut optimisée pour le bulk
  const defaultConfig: PithosConfig = {
    lang: "en",
    abortEarly: false,
    ...config,
  };

  const length = inputs.length;
  const output: T[] = new Array(length);
  let hasErrors = false;
  const allIssues: BaseIssue<unknown>[] = [];

  // Approche Zod-like : pas de pooling, datasets simples
  for (let i = 0; i < length; i++) {
    const value = inputs[i];

    // Dataset simple sans pooling (comme Zod)
    const dataset = {
      value,
      status: "unknown" as const,
      issues: undefined,
    };

    const result = schema["~run"](dataset, defaultConfig);

    if (result.status === "success") {
      output[i] = result.value as T;
    } else {
      hasErrors = true;
      if (result.issues) {
        for (const issue of result.issues) {
          allIssues.push({
            ...issue,
            path: [i, ...(issue.path || [])],
          });
        }
      }
      if (defaultConfig.abortEarly) {
        break;
      }
    }
  }

  return hasErrors
    ? {
        success: false,
        error: { issues: allIssues },
      }
    : {
        success: true,
        data: output,
      };
}

/**
 * Fonction utilitaire pour valider plusieurs valeurs (version qui lance des erreurs)
 *
 * Cette fonction permet de valider plusieurs valeurs avec
 * le même schéma et lance des erreurs si la validation échoue.
 *
 * @since 2.0.0
 */
export function parseMany<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  inputs: unknown[],
  config: PithosConfig = {}
): T[] {
  return inputs.map((input) => parse(schema, input, config));
}

/**
 * Fonction utilitaire pour valider plusieurs valeurs de manière async
 *
 * Cette fonction permet de valider plusieurs valeurs avec
 * le même schéma async de manière optimisée.
 *
 * @since 2.0.0
 */
export async function safeParseManyAsync<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  inputs: unknown[],
  config: PithosConfig = {}
): Promise<SafeParseResult<T>[]> {
  return Promise.all(
    inputs.map((input) => safeParseAsync(schema, input, config))
  );
}

/**
 * Fonction utilitaire pour valider plusieurs valeurs de manière async (version qui lance des erreurs)
 *
 * Cette fonction permet de valider plusieurs valeurs avec
 * le même schéma async et lance des erreurs si la validation échoue.
 *
 * @since 2.0.0
 */
export async function parseManyAsync<T>(
  schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
  inputs: unknown[],
  config: PithosConfig = {}
): Promise<T[]> {
  return Promise.all(inputs.map((input) => parseAsync(schema, input, config)));
}
