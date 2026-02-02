/**
 * Types partagés entre les schémas et les pools de données
 * Garantit la cohérence des structures de données dans les benchmarks
 */

export interface SimpleObject {
  name: string;
  age: number;
  active: boolean;
}

export interface ComplexObjectConfig {
  enabled: boolean;
  timeout: number;
  retries: number;
}

export interface ComplexObjectUser {
  id: number;
  name: string;
  active: boolean;
}

export interface ComplexObject {
  id: number;
  name: string;
  tags: string[];
  config: ComplexObjectConfig;
  users: ComplexObjectUser[];
}

export interface BulkObject {
  id: number;
  name: string;
  active: boolean;
}

export interface UserRegistration {
  name: string;
  email: string;
  age: number;
  password: string;
  terms: boolean;
}

export type UserRegistrationPool = UserRegistration[];

/**
 * Types pour les pools de données
 */
export type StringPool = string[];
export type NumberPool = number[];
export type BooleanPool = boolean[];
export type SimpleObjectPool = SimpleObject[];
export type ComplexObjectPool = ComplexObject[];
export type StringArrayPool = string[][];
export type NumberArrayPool = number[][];
export type BulkObjectPool = BulkObject[][];
export type BulkStringPool = string[][];

/**
 * Types pour les données invalides (pour tester les erreurs)
 */
export type InvalidStringPool = number[];
export type InvalidObjectPool = string[];

/**
 * Fonction utilitaire pour vérifier la cohérence des types
 * Utilisée dans les tests pour s'assurer que les pools correspondent aux interfaces
 */
export const typeCheckers = {
  isSimpleObject: (obj: unknown): obj is SimpleObject => {
    if (typeof obj !== "object" || obj === null) return false;
    const o = obj as any;

    // Vérifier que seules les propriétés attendues existent
    const expectedKeys = ["name", "age", "active"];
    const actualKeys = Object.keys(o);

    if (actualKeys.length !== expectedKeys.length) return false;

    return (
      typeof o.name === "string" &&
      typeof o.age === "number" &&
      typeof o.active === "boolean"
    );
  },

  isComplexObject: (obj: unknown): obj is ComplexObject => {
    if (typeof obj !== "object" || obj === null) return false;
    const o = obj as any;

    // Vérifier que seules les propriétés attendues existent
    const expectedKeys = ["id", "name", "tags", "config", "users"];
    const actualKeys = Object.keys(o);

    if (actualKeys.length !== expectedKeys.length) return false;

    // Vérifier les types de base
    if (
      typeof o.id !== "number" ||
      typeof o.name !== "string" ||
      !Array.isArray(o.tags) ||
      typeof o.config !== "object" ||
      o.config === null ||
      !Array.isArray(o.users)
    ) {
      return false;
    }

    // Vérifier la structure de config
    const configKeys = Object.keys(o.config);
    const expectedConfigKeys = ["enabled", "timeout", "retries"];
    if (configKeys.length !== expectedConfigKeys.length) return false;

    if (
      typeof o.config.enabled !== "boolean" ||
      typeof o.config.timeout !== "number" ||
      typeof o.config.retries !== "number"
    ) {
      return false;
    }

    // Vérifier la structure des users
    for (const user of o.users) {
      if (typeof user !== "object" || user === null) return false;
      const userKeys = Object.keys(user);
      const expectedUserKeys = ["id", "name", "active"];
      if (userKeys.length !== expectedUserKeys.length) return false;

      if (
        typeof user.id !== "number" ||
        typeof user.name !== "string" ||
        typeof user.active !== "boolean"
      ) {
        return false;
      }
    }

    return true;
  },

  isBulkObject: (obj: unknown): obj is BulkObject => {
    if (typeof obj !== "object" || obj === null) return false;
    const o = obj as any;

    // Vérifier que seules les propriétés attendues existent
    const expectedKeys = ["id", "name", "active"];
    const actualKeys = Object.keys(o);

    if (actualKeys.length !== expectedKeys.length) return false;

    return (
      typeof o.id === "number" &&
      typeof o.name === "string" &&
      typeof o.active === "boolean"
    );
  },
};
