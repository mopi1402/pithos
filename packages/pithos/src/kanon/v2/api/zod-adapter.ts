/**
 * Zod API Adapter
 *
 * This file creates the `z` object with the same signature as Zod
 * but uses our optimized validation functions in the background.
 */

import { string } from "@kanon/v2/schemas/primitives/string.js";
import { number } from "@kanon/v2/schemas/primitives/number.js";
import { boolean } from "@kanon/v2/schemas/primitives/boolean.js";
import { object } from "@kanon/v2/schemas/composites/object.js";
import { array } from "@kanon/v2/schemas/composites/array.js";
import { partial } from "@kanon/v2/schemas/composites/partial.js";
import { safeParse, parse } from "@kanon/v2/core/parser.js";
import type { BaseSchema, PithosConfig } from "@kanon/v2/types/base.js";

/**
 * Interface pour les schémas avec méthodes Zod
 *
 * @since 2.0.0
 */
export interface ZodSchema<T = unknown> extends BaseSchema {
  /**
   * Parse une valeur et lance une erreur si échec
   */
  parse(input: unknown, config?: PithosConfig): T;

  /**
   * Parse une valeur et retourne un résultat
   */
  safeParse(
    input: unknown,
    config?: PithosConfig
  ): {
    success: boolean;
    data?: T;
    error?: {
      issues: any[];
    };
  };

  /**
   * Parse une valeur de manière asynchrone
   */
  parseAsync(input: unknown, config?: PithosConfig): Promise<T>;

  /**
   * Parse une valeur de manière asynchrone et retourne un résultat
   */
  safeParseAsync(
    input: unknown,
    config?: PithosConfig
  ): Promise<{
    success: boolean;
    data?: T;
    error?: {
      issues: any[];
    };
  }>;

  // Méthodes de chaînage pour les strings
  min?(length: number, message?: string): ZodSchema<T>;
  max?(length: number, message?: string): ZodSchema<T>;
  length?(length: number, message?: string): ZodSchema<T>;
  email?(message?: string): ZodSchema<T>;
  url?(message?: string): ZodSchema<T>;
  uuid?(message?: string): ZodSchema<T>;
  regex?(pattern: RegExp, message?: string): ZodSchema<T>;
  includes?(value: string, message?: string): ZodSchema<T>;
  startsWith?(value: string, message?: string): ZodSchema<T>;
  endsWith?(value: string, message?: string): ZodSchema<T>;
  lowercase?(message?: string): ZodSchema<T>;
  uppercase?(message?: string): ZodSchema<T>;
  overwrite?(value: string, message?: string): ZodSchema<T>;

  // Méthodes de chaînage pour les numbers
  int?(message?: string): ZodSchema<T>;
  positive?(message?: string): ZodSchema<T>;
  negative?(message?: string): ZodSchema<T>;
  nonnegative?(message?: string): ZodSchema<T>;
  nonpositive?(message?: string): ZodSchema<T>;
  finite?(message?: string): ZodSchema<T>;
  safe?(message?: string): ZodSchema<T>;

  // Méthodes de chaînage pour les arrays
  min?(length: number, message?: string): ZodSchema<T>;
  max?(length: number, message?: string): ZodSchema<T>;
  length?(length: number, message?: string): ZodSchema<T>;

  // Méthodes de chaînage pour les objects
  strict?(message?: string): ZodSchema<T>;
  strip?(message?: string): ZodSchema<T>;
  passthrough?(message?: string): ZodSchema<T>;

  // Méthodes de chaînage pour les unions
  or?<U extends BaseSchema>(schema: U): ZodSchema<T | any>;

  // Méthodes de chaînage pour les refinements
  refine?<U extends T>(
    check: (value: T) => boolean,
    message?: string | ((issue: any) => string)
  ): ZodSchema<U>;
  refine?<U extends T>(
    check: (value: T) => Promise<boolean>,
    message?: string | ((issue: any) => string)
  ): ZodSchema<U>;

  // Méthodes de chaînage pour les optionnels
  optional?(): ZodSchema<T | undefined>;
  nullable?(): ZodSchema<T | null>;
  nullish?(): ZodSchema<T | null | undefined>;
  default?(value: T | (() => T)): ZodSchema<T>;
}

/**
 * Wrapper pour ajouter les méthodes Zod à un schéma Valibot
 */
function withZodMethods<T extends BaseSchema>(schema: T): ZodSchema<any> {
  return {
    ...schema,
    parse: (input: unknown, config?: PithosConfig) => {
      const result = parse(schema, input, config);
      return result as any;
    },
    safeParse: (input: unknown, config?: PithosConfig) => {
      return safeParse(schema, input, config);
    },
    parseAsync: async (input: unknown, config?: PithosConfig) => {
      // Pour l'instant, on utilise la version synchrone
      // Dans une version future, on pourrait implémenter la vraie version async
      return parse(schema, input, config) as any;
    },
    safeParseAsync: async (input: unknown, config?: PithosConfig) => {
      // Pour l'instant, on utilise la version synchrone
      // Dans une version future, on pourrait implémenter la vraie version async
      return safeParse(schema, input, config);
    },
  };
}

/**
 * Objet z avec l'API Zod familière
 *
 * @since 2.0.0
 */
export const z = {
  /**
   * Crée un schéma string
   */
  string: (message?: string | ((issue: any) => string)): ZodSchema<string> => {
    return withZodMethods(string(message) as BaseSchema) as ZodSchema<string>;
  },

  /**
   * Crée un schéma number
   */
  number: (message?: string | ((issue: any) => string)): ZodSchema<number> => {
    return withZodMethods(number(message)) as ZodSchema<number>;
  },

  /**
   * Crée un schéma boolean
   */
  boolean: (
    message?: string | ((issue: any) => string)
  ): ZodSchema<boolean> => {
    return withZodMethods(boolean(message)) as ZodSchema<boolean>;
  },

  /**
   * Crée un schéma object
   */
  object: <T extends Record<string, BaseSchema>>(
    shape: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<{ [K in keyof T]: any }> => {
    return withZodMethods(object(shape, message)) as ZodSchema<{
      [K in keyof T]: any;
    }>;
  },

  /**
   * Crée un schéma array
   */
  array: <T extends BaseSchema>(
    element: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<any[]> => {
    return withZodMethods(array(element, message)) as ZodSchema<any[]>;
  },

  /**
   * Crée un schéma object avec des propriétés optionnelles
   */
  partial: <T extends Record<string, BaseSchema>>(
    shape: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<{ [K in keyof T]?: any }> => {
    return withZodMethods(partial(shape, message)) as ZodSchema<{
      [K in keyof T]?: any;
    }>;
  },

  /**
   * Crée un schéma object avec des propriétés requises
   */
  required: <T extends Record<string, BaseSchema>>(
    shape: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<{ [K in keyof T]: any }> => {
    return withZodMethods(object(shape, message)) as ZodSchema<{
      [K in keyof T]: any;
    }>;
  },

  /**
   * Crée un schéma array avec une longueur minimale
   */
  minLength: <T extends BaseSchema>(
    element: T,
    min: number,
    message?: string | ((issue: any) => string)
  ): ZodSchema<any[]> => {
    // Pour l'instant, on utilise array() normal
    // Dans une version future, on pourrait implémenter minLength()
    return withZodMethods(array(element, message)) as ZodSchema<any[]>;
  },

  /**
   * Crée un schéma array avec une longueur maximale
   */
  maxLength: <T extends BaseSchema>(
    element: T,
    max: number,
    message?: string | ((issue: any) => string)
  ): ZodSchema<any[]> => {
    // Pour l'instant, on utilise array() normal
    // Dans une version future, on pourrait implémenter maxLength()
    return withZodMethods(array(element, message)) as ZodSchema<any[]>;
  },

  /**
   * Crée un schéma null
   */
  null: (message?: string | ((issue: any) => string)): ZodSchema<null> => {
    return withZodMethods({
      kind: "schema",
      type: "null",
      reference: z.null,
      expects: "null",
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        if (dataset.value !== null) {
          // Ajouter une erreur
          if (!dataset.issues) dataset.issues = [];
          dataset.issues.push({
            kind: "schema",
            type: "null",
            expects: "null",
            message: message || "Expected null",
          });
          return dataset;
        }
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<null>;
  },

  /**
   * Crée un schéma undefined
   */
  undefined: (
    message?: string | ((issue: any) => string)
  ): ZodSchema<undefined> => {
    return withZodMethods({
      kind: "schema",
      type: "undefined",
      reference: z.undefined,
      expects: "undefined",
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        if (dataset.value !== undefined) {
          // Ajouter une erreur
          if (!dataset.issues) dataset.issues = [];
          dataset.issues.push({
            kind: "schema",
            type: "undefined",
            expects: "undefined",
            message: message || "Expected undefined",
          });
          return dataset;
        }
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<undefined>;
  },

  /**
   * Crée un schéma union
   */
  union: <T extends BaseSchema[]>(
    schemas: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<any> => {
    return withZodMethods({
      kind: "schema",
      type: "union",
      reference: z.union,
      expects: "Union",
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        for (const schema of schemas) {
          const result = schema["~run"]({ ...dataset }, config);
          if (result.status === "success") {
            (dataset as any).status = "success";
            (dataset as any).value = result.value;
            return dataset;
          }
        }
        // Aucun schéma n'a validé
        if (!dataset.issues) dataset.issues = [];
        dataset.issues.push({
          kind: "schema",
          type: "union",
          expects: "Union",
          message: message || "Expected union",
        });
        return dataset;
      },
    } as any) as ZodSchema<any>;
  },

  /**
   * Crée un schéma literal
   */
  literal: <T extends string | number | boolean | null>(
    value: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<T> => {
    return withZodMethods({
      kind: "schema",
      type: "literal",
      reference: z.literal,
      expects: `Literal<${value}>`,
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        if (dataset.value !== value) {
          if (!dataset.issues) dataset.issues = [];
          dataset.issues.push({
            kind: "schema",
            type: "literal",
            expects: `Literal<${value}>`,
            message: message || `Expected literal ${value}`,
          });
          return dataset;
        }
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<T>;
  },

  /**
   * Crée un schéma any
   */
  any: (message?: string | ((issue: any) => string)): ZodSchema<any> => {
    return withZodMethods({
      kind: "schema",
      type: "any",
      reference: z.any,
      expects: "any",
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<any>;
  },

  /**
   * Crée un schéma date
   */
  date: (message?: string | ((issue: any) => string)): ZodSchema<Date> => {
    return withZodMethods({
      kind: "schema",
      type: "date",
      reference: z.date,
      expects: "Date",
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        if (
          !(dataset.value instanceof Date) ||
          isNaN(dataset.value.getTime())
        ) {
          if (!dataset.issues) dataset.issues = [];
          dataset.issues.push({
            kind: "schema",
            type: "date",
            expects: "Date",
            message: message || "Expected Date",
          });
          return dataset;
        }
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<Date>;
  },

  /**
   * Crée un schéma bigint
   */
  bigint: (message?: string | ((issue: any) => string)): ZodSchema<bigint> => {
    return withZodMethods({
      kind: "schema",
      type: "bigint",
      reference: z.bigint,
      expects: "bigint",
      async: false,
      message,
      "~run": (dataset: any, config: any) => {
        if (typeof dataset.value !== "bigint") {
          if (!dataset.issues) dataset.issues = [];
          dataset.issues.push({
            kind: "schema",
            type: "bigint",
            expects: "bigint",
            message: message || "Expected bigint",
          });
          return dataset;
        }
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<bigint>;
  },

  /**
   * Crée un schéma strictObject
   */
  strictObject: <T extends Record<string, BaseSchema>>(
    shape: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<{ [K in keyof T]: any }> => {
    return withZodMethods(object(shape, message)) as ZodSchema<{
      [K in keyof T]: any;
    }>;
  },

  /**
   * Crée un schéma looseObject
   */
  looseObject: <T extends Record<string, BaseSchema>>(
    shape: T,
    message?: string | ((issue: any) => string)
  ): ZodSchema<{ [K in keyof T]: any }> => {
    return withZodMethods(object(shape, message)) as ZodSchema<{
      [K in keyof T]: any;
    }>;
  },

  /**
   * Crée un schéma keyof
   */
  keyof: <T extends Record<string, BaseSchema>>(
    schema: T
  ): ZodSchema<keyof T> => {
    const keys = Object.keys(schema);
    return withZodMethods({
      kind: "schema",
      type: "keyof",
      reference: z.keyof,
      expects: "keyof",
      async: false,
      "~run": (dataset: any, config: any) => {
        if (!keys.includes(dataset.value)) {
          if (!dataset.issues) dataset.issues = [];
          dataset.issues.push({
            kind: "schema",
            type: "keyof",
            expects: "keyof",
            message: `Expected one of: ${keys.join(", ")}`,
          });
          return dataset;
        }
        (dataset as any).typed = true;
        return dataset;
      },
    } as any) as ZodSchema<keyof T>;
  },

  /**
   * Crée un schéma coerce
   */
  coerce: {
    string: (
      message?: string | ((issue: any) => string)
    ): ZodSchema<string> => {
      return withZodMethods({
        kind: "schema",
        type: "coerce_string",
        reference: z.coerce.string,
        expects: "string",
        async: false,
        message,
        "~run": (dataset: any, config: any) => {
          (dataset as any).typed = true;
          (dataset as any).value = String(dataset.value);
          return dataset;
        },
      } as any) as ZodSchema<string>;
    },
    number: (
      message?: string | ((issue: any) => string)
    ): ZodSchema<number> => {
      return withZodMethods({
        kind: "schema",
        type: "coerce_number",
        reference: z.coerce.number,
        expects: "number",
        async: false,
        message,
        "~run": (dataset: any, config: any) => {
          const num = Number(dataset.value);
          if (isNaN(num)) {
            if (!dataset.issues) dataset.issues = [];
            dataset.issues.push({
              kind: "schema",
              type: "coerce_number",
              expects: "number",
              message: message || "Expected number",
            });
            return dataset;
          }
          (dataset as any).typed = true;
          (dataset as any).value = num;
          return dataset;
        },
      } as any) as ZodSchema<number>;
    },
    boolean: (
      message?: string | ((issue: any) => string)
    ): ZodSchema<boolean> => {
      return withZodMethods({
        kind: "schema",
        type: "coerce_boolean",
        reference: z.coerce.boolean,
        expects: "boolean",
        async: false,
        message,
        "~run": (dataset: any, config: any) => {
          (dataset as any).typed = true;
          (dataset as any).value = Boolean(dataset.value);
          return dataset;
        },
      } as any) as ZodSchema<boolean>;
    },
    bigint: (
      message?: string | ((issue: any) => string)
    ): ZodSchema<bigint> => {
      return withZodMethods({
        kind: "schema",
        type: "coerce_bigint",
        reference: z.coerce.bigint,
        expects: "bigint",
        async: false,
        message,
        "~run": (dataset: any, config: any) => {
          try {
            (dataset as any).typed = true;
            (dataset as any).value = BigInt(dataset.value);
            return dataset;
          } catch {
            if (!dataset.issues) dataset.issues = [];
            dataset.issues.push({
              kind: "schema",
              type: "coerce_bigint",
              expects: "bigint",
              message: message || "Expected bigint",
            });
            return dataset;
          }
        },
      } as any) as ZodSchema<bigint>;
    },
    date: (message?: string | ((issue: any) => string)): ZodSchema<Date> => {
      return withZodMethods({
        kind: "schema",
        type: "coerce_date",
        reference: z.coerce.date,
        expects: "Date",
        async: false,
        message,
        "~run": (dataset: any, config: any) => {
          try {
            (dataset as any).typed = true;
            (dataset as any).value = new Date(dataset.value);
            return dataset;
          } catch {
            if (!dataset.issues) dataset.issues = [];
            dataset.issues.push({
              kind: "schema",
              type: "coerce_date",
              expects: "Date",
              message: message || "Expected Date",
            });
            return dataset;
          }
        },
      } as any) as ZodSchema<Date>;
    },
  },
};

/**
 * Export par défaut
 */
export default z;
