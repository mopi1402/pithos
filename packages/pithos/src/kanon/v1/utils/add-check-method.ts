/**
 * Fonction utilitaire pour ajouter la méthode check aux schémas
 *
 * @since 1.1.0
 */

import type { PithosType } from "../types/base";
import { PithosError } from "../errors";
import { PithosString } from "../schemas/primitives/string";
import { PithosNumber } from "../schemas/primitives/number";
import { PithosBoolean } from "../schemas/primitives/boolean";
import { PithosBigInt } from "../schemas/primitives/bigint";
import { PithosDate } from "../schemas/primitives/date";
import { PithosSymbol } from "../schemas/primitives/symbol";
import { PithosUndefined } from "../schemas/primitives/undefined";
import { PithosNull } from "../schemas/primitives/null";
import { PithosAny } from "../schemas/primitives/any";
import { PithosUnknown } from "../schemas/primitives/unknown";
import { PithosNever } from "../schemas/primitives/never";
import { PithosVoid } from "../schemas/primitives/void";
import { PithosArray } from "../schemas/composites/array";
import { PithosObject } from "../schemas/composites/object";
import { PithosUnion } from "../schemas/composites/union";
import { PithosIntersection } from "../schemas/composites/intersection";
import { PithosTuple } from "../schemas/composites/tuple";
import { PithosRecord } from "../schemas/composites/record";
import { PithosMap } from "../schemas/composites/map";
import { PithosSet } from "../schemas/composites/set";
import { PithosLiteral } from "../schemas/concepts/literal";
import { PithosEnum } from "../schemas/concepts/enum/string-enum";
import { PithosOptional } from "../schemas/concepts/wrappers/optional";
import { PithosNullable } from "../schemas/concepts/wrappers/nullable";
import { PithosDefault } from "../schemas/concepts/wrappers/default";
import {
  CheckFunctionWithOptions,
  SchemaWithMetadata,
} from "@kanon/v1/types/utils";

// Fonctions utilitaires pour les propriétés de schéma
const getSchemaType = (schema: PithosType): string => {
  if (schema instanceof PithosString) return "string";
  if (schema instanceof PithosNumber) return "number";
  if (schema instanceof PithosBoolean) return "boolean";
  if (schema instanceof PithosBigInt) return "bigint";
  if (schema instanceof PithosDate) return "date";
  if (schema instanceof PithosSymbol) return "symbol";
  if (schema instanceof PithosUndefined) return "undefined";
  if (schema instanceof PithosNull) return "null";
  if (schema instanceof PithosAny) return "any";
  if (schema instanceof PithosUnknown) return "unknown";
  if (schema instanceof PithosNever) return "never";
  if (schema instanceof PithosVoid) return "void";
  if (schema instanceof PithosArray) return "array";
  if (schema instanceof PithosObject) return "object";
  if (schema instanceof PithosUnion) return "union";
  if (schema instanceof PithosIntersection) return "intersection";
  if (schema instanceof PithosTuple) return "tuple";
  if (schema instanceof PithosRecord) return "record";
  if (schema instanceof PithosMap) return "map";
  if (schema instanceof PithosSet) return "set";
  if (schema instanceof PithosLiteral) return "literal";
  if (schema instanceof PithosEnum) return "enum";
  if (schema instanceof PithosOptional) return "optional";
  if (schema instanceof PithosNullable) return "nullable";
  if (schema instanceof PithosDefault) return "default";
  return "unknown";
};

const getSchemaValues = (schema: PithosType): unknown[] | undefined => {
  if (schema instanceof PithosLiteral) {
    // Utiliser une méthode publique ou accéder via une propriété publique
    return [(schema as any).value];
  }
  if (schema instanceof PithosEnum) {
    return (schema as any).values;
  }
  return undefined;
};

// Extension des schémas avec la méthode check

/**
 * Adds the check method to a schema.
 *
 * @since 1.1.0
 */
export const addCheckMethod = <T extends PithosType>(
  schema: T
): T & {
  check: (
    ...checks: ((data: T["_output"]) => any)[]
  ) => T & { check: (...checks: ((data: T["_output"]) => any)[]) => any };
} => {
  // Ajouter les propriétés def et type
  (schema as SchemaWithMetadata).def = {
    type: getSchemaType(schema),
    values: getSchemaValues(schema),
  };
  (schema as SchemaWithMetadata).type = getSchemaType(schema);

  // Pas de méthode brand pour une version légère

  (schema as any).check = function (
    ...checks: ((data: T["_output"]) => any)[]
  ) {
    // Créer un schéma raffiné qui applique les checks
    const refinedSchema = {
      ...schema,
      safeParse: (data: unknown) => {
        // D'abord valider avec le schéma original
        const result = schema.safeParse(data);
        if (!result.success) return result;

        let transformedData = result.data;
        const issues: any[] = [];

        // Ensuite appliquer les checks
        for (const check of checks) {
          try {
            const checkResult = check(transformedData);

            // Si c'est une fonction retournée par refine, l'exécuter
            if (typeof checkResult === "function") {
              const actualResult = checkResult(transformedData);
              if (!actualResult) {
                issues.push({
                  code: "custom",
                  message: "Validation failed",
                  path: [],
                });

                // Vérifier si c'est un refine avec abort: true
                if (
                  (checkResult as CheckFunctionWithOptions).__abort === true
                ) {
                  break;
                }
              }
            } else if (typeof checkResult !== "boolean") {
              // Si c'est une fonction de transformation (overwrite)
              transformedData = checkResult;
            } else if (!checkResult) {
              // Si c'est une validation qui échoue
              issues.push({
                code: "custom",
                message: "Validation failed",
                path: [],
              });

              // Vérifier si c'est un refine avec abort: true
              if ((check as CheckFunctionWithOptions).__abort === true) {
                break; // Arrêter au premier échec
              }
            }
          } catch (error) {
            issues.push({
              code: "custom",
              message: "Validation failed",
              path: [],
            });

            // Si c'est un refine avec abort: true, arrêter
            if ((check as CheckFunctionWithOptions).__abort === true) {
              break;
            }
          }
        }

        if (issues.length) {
          return {
            success: false,
            error: new PithosError(issues),
          };
        }

        return {
          success: true,
          data: transformedData,
        };
      },
      parse: (data: unknown) => {
        const result = schema.safeParse(data);
        if (!result.success) {
          throw result.error;
        }
        return result.data;
      },
    };
    return refinedSchema;
  };
  return schema as T & {
    check: (
      ...checks: ((data: T["_output"]) => any)[]
    ) => T & { check: (...checks: ((data: T["_output"]) => any)[]) => any };
  };
};
