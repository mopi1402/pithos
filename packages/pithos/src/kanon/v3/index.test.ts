/**
 * Tests pour le point d'entrée principal de Kanon V3
 *
 * Ce fichier vérifie que tous les exports sont disponibles et fonctionnent correctement.
 * Les tests exhaustifs sont dans les fichiers individuels.
 */

import { describe, it, expect } from "vitest";
import * as K from "./index";

describe("Kanon V3 - Exports", () => {
  describe("Core parser", () => {
    it("exporte parse", () => {
      expect(typeof K.parse).toBe("function");
    });

    it("exporte parseBulk", () => {
      expect(typeof K.parseBulk).toBe("function");
    });

    it("parse fonctionne avec un schéma simple", () => {
      const schema = K.string();
      const result = K.parse(schema, "test");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test");
      }
    });
  });

  describe("Primitives", () => {
    it("exporte toutes les primitives de base", () => {
      expect(typeof K.any).toBe("function");
      expect(typeof K.bigint).toBe("function");
      expect(typeof K.boolean).toBe("function");
      expect(typeof K.date).toBe("function");
      expect(typeof K.int).toBe("function");
      expect(typeof K.never).toBe("function");
      expect(typeof K.null_).toBe("function");
      expect(typeof K.number).toBe("function");
      expect(typeof K.string).toBe("function");
      expect(typeof K.symbol).toBe("function");
      expect(typeof K.undefined_).toBe("function");
      expect(typeof K.unknown).toBe("function");
      expect(typeof K.void_).toBe("function");
    });

    it("exporte la fonction literal", () => {
      expect(typeof K.literal).toBe("function");
    });

    it("exporte les fonctions enum", () => {
      expect(typeof K.enum_).toBe("function");
      expect(typeof K.numberEnum).toBe("function");
      expect(typeof K.booleanEnum).toBe("function");
      expect(typeof K.mixedEnum).toBe("function");
      expect(typeof K.nativeEnum).toBe("function");
    });
  });

  describe("Composites", () => {
    it("exporte les fonctions composites", () => {
      expect(typeof K.object).toBe("function");
      expect(typeof K.strictObject).toBe("function");
      expect(typeof K.looseObject).toBe("function");
      expect(typeof K.array).toBe("function");
      expect(typeof K.record).toBe("function");
      expect(typeof K.tuple).toBe("function");
      expect(typeof K.tupleOf).toBe("function");
      expect(typeof K.tupleOf3).toBe("function");
      expect(typeof K.tupleOf4).toBe("function");
      expect(typeof K.tupleWithRest).toBe("function");
      expect(typeof K.map).toBe("function");
      expect(typeof K.set).toBe("function");
    });
  });

  describe("Operators", () => {
    it("exporte les opérateurs", () => {
      expect(typeof K.unionOf).toBe("function");
      expect(typeof K.unionOf3).toBe("function");
      expect(typeof K.unionOf4).toBe("function");
      expect(typeof K.intersection).toBe("function");
      expect(typeof K.intersection3).toBe("function");
    });
  });

  describe("Wrappers", () => {
    it("exporte les wrappers", () => {
      expect(typeof K.optional).toBe("function");
      expect(typeof K.nullable).toBe("function");
      expect(typeof K.default_).toBe("function");
      expect(typeof K.readonly).toBe("function");
      expect(typeof K.lazy).toBe("function");
    });
  });

  describe("Transforms", () => {
    it("exporte les transforms", () => {
      expect(typeof K.partial).toBe("function");
      expect(typeof K.required).toBe("function");
      expect(typeof K.pick).toBe("function");
      expect(typeof K.omit).toBe("function");
      expect(typeof K.keyof).toBe("function");
    });
  });

  describe("Coercion", () => {
    it("exporte les fonctions de coercion", () => {
      expect(typeof K.coerceString).toBe("function");
      expect(typeof K.coerceNumber).toBe("function");
      expect(typeof K.coerceBoolean).toBe("function");
      expect(typeof K.coerceBigInt).toBe("function");
      expect(typeof K.coerceDate).toBe("function");
    });
  });

  describe("Fonctionnalité basique", () => {
    it("peut créer et utiliser un schéma simple", () => {
      const schema = K.string();
      const result = K.parse(schema, "hello");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("peut créer et utiliser un schéma object", () => {
      const schema = K.object({
        name: K.string(),
        age: K.number(),
      });
      const result = K.parse(schema, { name: "John", age: 30 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        expect(result.data.age).toBe(30);
      }
    });
  });
});
