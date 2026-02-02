/**
 * Tests unitaires pour les utilitaires optimisés
 *
 * Ce fichier teste toutes les fonctions utilitaires
 * pour s'assurer qu'elles fonctionnent correctement.
 */

import { describe, it, expect } from "vitest";
import {
  _addIssue,
  _isObject,
  _isArray,
  _isString,
  _isNumber,
  _isBoolean,
} from "./helpers.js";
import type { PithosConfig } from "@kanon/v2/types/base.js";
import { createDataset } from "@kanon/v2/core/dataset.js";

describe("Utils optimisés", () => {
  describe("_addIssue", () => {
    it("should add issue to dataset without existing issues", () => {
      const dataset = createDataset("test");
      const config: PithosConfig = {
        lang: "en",
        abortEarly: false,
      };

      const context = {
        kind: "schema" as const,
        type: "string",
        expects: "string",
        message: "Invalid string",
      };

      _addIssue(context, "string", dataset, config);

      expect(dataset.issues).toBeDefined();
      expect((dataset as any).issues.length).toBe(1);
      expect((dataset as any).issues[0].kind).toBe("schema");
      expect((dataset as any).issues[0].type).toBe("string");
      expect((dataset as any).issues[0].message).toBe("Invalid string");
    });

    it("should add issue to dataset with existing issues", () => {
      const dataset = createDataset("test");
      const config: PithosConfig = {
        lang: "en",
        abortEarly: false,
      };

      // Ajouter une première issue
      const context1 = {
        kind: "schema" as const,
        type: "string",
        expects: "string",
        message: "First issue",
      };
      _addIssue(context1, "string", dataset, config);

      // Ajouter une deuxième issue
      const context2 = {
        kind: "validation" as const,
        type: "string",
        expects: "string",
        message: "Second issue",
      };
      _addIssue(context2, "string", dataset, config);

      expect((dataset as any).issues.length).toBe(2);
      expect((dataset as any).issues[0].kind).toBe("schema");
      expect((dataset as any).issues[0].message).toBe("First issue");
      expect((dataset as any).issues[1].kind).toBe("validation");
      expect((dataset as any).issues[1].message).toBe("Second issue");
    });

    it("should generate default message when no message provided", () => {
      const dataset = createDataset(123);
      const config: PithosConfig = {
        lang: "en",
        abortEarly: false,
      };

      const context = {
        kind: "schema" as const,
        type: "string",
        expects: "string",
      };

      _addIssue(context, "string", dataset, config);

      expect((dataset as any).issues[0].message).toBe(
        "Invalid string: Expected string but Received number"
      );
    });

    it("should use custom message function", () => {
      const dataset = createDataset(123);
      const config: PithosConfig = {
        lang: "en",
        abortEarly: false,
      };

      const context = {
        kind: "schema" as const,
        type: "string",
        expects: "string",
        message: (issue: any) =>
          `Custom: ${issue.input} is not a ${issue.expected}`,
      };

      _addIssue(context, "string", dataset, config);

      expect((dataset as any).issues[0].message).toBe(
        "Custom: 123 is not a string"
      );
    });

    it("should use config message when provided", () => {
      const dataset = createDataset(123);
      const config: PithosConfig = {
        lang: "en",
        abortEarly: false,
        message: "Config message override",
      };

      const context = {
        kind: "schema" as const,
        type: "string",
        expects: "string",
        message: "Context message",
      };

      _addIssue(context, "string", dataset, config);

      expect((dataset as any).issues[0].message).toBe(
        "Config message override"
      );
    });
  });

  describe("Type checkers", () => {
    describe("_isObject", () => {
      it("should return true for objects", () => {
        expect(_isObject({})).toBe(true);
        expect(_isObject({ a: 1 })).toBe(true);
        expect(_isObject(new Date())).toBe(true);
        expect(_isObject(/regex/)).toBe(true);
      });

      it("should return false for non-objects", () => {
        expect(_isObject(null)).toBe(false);
        expect(_isObject([])).toBe(false);
        expect(_isObject("string")).toBe(false);
        expect(_isObject(42)).toBe(false);
        expect(_isObject(true)).toBe(false);
        expect(_isObject(undefined)).toBe(false);
      });
    });

    describe("_isArray", () => {
      it("should return true for arrays", () => {
        expect(_isArray([])).toBe(true);
        expect(_isArray([1, 2, 3])).toBe(true);
        expect(_isArray(["a", "b"])).toBe(true);
      });

      it("should return false for non-arrays", () => {
        expect(_isArray({})).toBe(false);
        expect(_isArray("string")).toBe(false);
        expect(_isArray(42)).toBe(false);
        expect(_isArray(true)).toBe(false);
        expect(_isArray(null)).toBe(false);
      });
    });

    describe("_isString", () => {
      it("should return true for strings", () => {
        expect(_isString("hello")).toBe(true);
        expect(_isString("")).toBe(true);
        expect(_isString("123")).toBe(true);
      });

      it("should return false for non-strings", () => {
        expect(_isString(42)).toBe(false);
        expect(_isString(true)).toBe(false);
        expect(_isString({})).toBe(false);
        expect(_isString([])).toBe(false);
        expect(_isString(null)).toBe(false);
      });
    });

    describe("_isNumber", () => {
      it("should return true for valid numbers", () => {
        expect(_isNumber(42)).toBe(true);
        expect(_isNumber(0)).toBe(true);
        expect(_isNumber(-1)).toBe(true);
        expect(_isNumber(3.14)).toBe(true);
        expect(_isNumber(Infinity)).toBe(false); // Infinity is not finite
      });

      it("should return false for invalid numbers", () => {
        expect(_isNumber(NaN)).toBe(false);
        expect(_isNumber(Infinity)).toBe(false);
        expect(_isNumber(-Infinity)).toBe(false);
        expect(_isNumber("42")).toBe(false);
        expect(_isNumber(true)).toBe(false);
        expect(_isNumber({})).toBe(false);
      });
    });

    describe("_isBoolean", () => {
      it("should return true for booleans", () => {
        expect(_isBoolean(true)).toBe(true);
        expect(_isBoolean(false)).toBe(true);
      });

      it("should return false for non-booleans", () => {
        expect(_isBoolean(1)).toBe(false);
        expect(_isBoolean(0)).toBe(false);
        expect(_isBoolean("true")).toBe(false);
        expect(_isBoolean("false")).toBe(false);
        expect(_isBoolean({})).toBe(false);
        expect(_isBoolean([])).toBe(false);
        expect(_isBoolean(null)).toBe(false);
      });
    });
  });
});
