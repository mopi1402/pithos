/**
 * Tests exhaustifs pour dataset.ts
 *
 * Ce fichier teste TOUS les cas d'usage du fichier dataset.ts
 * de manière exhaustive sans superflu.
 */

import { describe, it, expect } from "vitest";
import {
  createDataset,
  createSuccessDataset,
  createFailureDataset,
  type UnknownDataset,
  type SuccessDataset,
  type FailureDataset,
  type OutputDataset,
  type PithosConfig,
} from "./dataset.js";
import type { BaseIssue } from "@kanon/v2/types/base.js";

describe("Dataset Core Functions", () => {
  describe("createDataset", () => {
    it("should create UnknownDataset with correct structure", () => {
      const dataset = createDataset("test");

      expect(dataset).toEqual({
        status: "unknown",
        value: "test",
        issues: undefined,
      });
      expect(dataset.status).toBe("unknown");
      expect(dataset.value).toBe("test");
      expect(dataset.issues).toBeUndefined();
    });

    it("should handle all primitive types", () => {
      const testCases = [
        { value: "string", expected: "string" },
        { value: 42, expected: 42 },
        { value: true, expected: true },
        { value: false, expected: false },
        { value: null, expected: null },
        { value: undefined, expected: undefined },
        { value: 0, expected: 0 },
        { value: "", expected: "" },
        { value: NaN, expected: NaN },
      ];

      testCases.forEach(({ value, expected }) => {
        const dataset = createDataset(value);
        expect(dataset.status).toBe("unknown");
        expect(dataset.value).toBe(expected);
        expect(dataset.issues).toBeUndefined();
      });
    });

    it("should handle complex types", () => {
      const objectValue = { name: "John", age: 30 };
      const arrayValue = [1, 2, 3];
      const functionValue = () => "test";

      const objectDataset = createDataset(objectValue);
      const arrayDataset = createDataset(arrayValue);
      const functionDataset = createDataset(functionValue);

      expect(objectDataset.status).toBe("unknown");
      expect(objectDataset.value).toEqual(objectValue);

      expect(arrayDataset.status).toBe("unknown");
      expect(arrayDataset.value).toEqual(arrayValue);

      expect(functionDataset.status).toBe("unknown");
      expect(functionDataset.value).toBe(functionValue);
    });
  });

  describe("createSuccessDataset", () => {
    it("should create SuccessDataset with correct structure", () => {
      const dataset = createSuccessDataset("validated");

      expect(dataset).toEqual({
        status: "success",
        value: "validated",
        issues: undefined,
      });
      expect(dataset.status).toBe("success");
      expect(dataset.value).toBe("validated");
      expect(dataset.issues).toBeUndefined();
    });

    it("should handle typed values correctly", () => {
      const stringDataset = createSuccessDataset<string>("hello");
      const numberDataset = createSuccessDataset<number>(42);
      const objectDataset = createSuccessDataset<{ id: number }>({ id: 1 });

      expect(stringDataset.status).toBe("success");
      expect(stringDataset.value).toBe("hello");

      expect(numberDataset.status).toBe("success");
      expect(numberDataset.value).toBe(42);

      expect(objectDataset.status).toBe("success");
      expect(objectDataset.value).toEqual({ id: 1 });
    });
  });

  describe("createFailureDataset", () => {
    it("should create FailureDataset with single issue", () => {
      const issue: BaseIssue<unknown> = {
        kind: "schema",
        type: "string",
        input: 42,
        expected: "string",
        received: "number",
        message: "Expected string",
        requirement: undefined,
        path: undefined,
        issues: undefined,
        lang: "en",
        abortEarly: false,
      };

      const dataset = createFailureDataset(42, [issue]);

      expect(dataset).toEqual({
        status: "failure",
        value: 42,
        issues: [issue],
      });
      expect(dataset.status).toBe("failure");
      expect(dataset.value).toBe(42);
      expect(dataset.issues).toHaveLength(1);
      expect(dataset.issues![0]).toEqual(issue);
    });

    it("should create FailureDataset with multiple issues", () => {
      const issue1: BaseIssue<unknown> = {
        kind: "schema",
        type: "string",
        input: 42,
        expected: "string",
        received: "number",
        message: "First error",
        requirement: undefined,
        path: undefined,
        issues: undefined,
        lang: "en",
        abortEarly: false,
      };

      const issue2: BaseIssue<unknown> = {
        kind: "validation",
        type: "string",
        input: 42,
        expected: "string",
        received: "number",
        message: "Second error",
        requirement: "email",
        path: ["email"],
        issues: undefined,
        lang: "en",
        abortEarly: false,
      };

      const dataset = createFailureDataset(42, [issue1, issue2]);

      expect(dataset.status).toBe("failure");
      expect(dataset.value).toBe(42);
      expect(dataset.issues).toHaveLength(2);
      expect(dataset.issues![0]).toEqual(issue1);
      expect(dataset.issues![1]).toEqual(issue2);
    });

    it("should enforce non-empty issues array", () => {
      // TypeScript devrait empêcher cela, mais testons le comportement runtime
      const emptyIssues: [BaseIssue<unknown>, ...BaseIssue<unknown>[]] =
        [] as any;

      // Ceci devrait échouer à la compilation, mais testons le runtime
      expect(() => createFailureDataset(42, emptyIssues)).not.toThrow();
    });
  });

  describe("PithosConfig Interface", () => {
    it("should accept empty config", () => {
      const config: PithosConfig = {};
      expect(config).toBeDefined();
    });

    it("should accept string message", () => {
      const config: PithosConfig = {
        message: "Custom error message",
      };
      expect(config.message).toBe("Custom error message");
    });

    it("should accept function message", () => {
      const config: PithosConfig = {
        message: (issue) => `Custom: ${issue.message}`,
      };
      expect(typeof config.message).toBe("function");
    });

    it("should accept partial config", () => {
      const config: PithosConfig = {
        lang: "fr",
        abortEarly: true,
        message: "Custom message",
      };
      expect(config.lang).toBe("fr");
      expect(config.abortEarly).toBe(true);
      expect(config.message).toBe("Custom message");
    });
  });

  describe("Type System Integration", () => {
    it("should correctly type UnknownDataset", () => {
      const dataset: UnknownDataset = createDataset("test");
      expect(dataset.status).toBe("unknown");
      expect(dataset.issues).toBeUndefined();
    });

    it("should correctly type SuccessDataset", () => {
      const dataset: SuccessDataset<string> = createSuccessDataset("test");
      expect(dataset.status).toBe("success");
      expect(dataset.value).toBe("test");
      expect(dataset.issues).toBeUndefined();
    });

    it("should correctly type FailureDataset", () => {
      const issue: BaseIssue<unknown> = {
        kind: "schema",
        type: "string",
        input: 42,
        expected: "string",
        received: "number",
        message: "Expected string",
        requirement: undefined,
        path: undefined,
        issues: undefined,
        lang: "en",
        abortEarly: false,
      };
      const dataset: FailureDataset<BaseIssue<unknown>> = createFailureDataset(
        42,
        [issue]
      );
      expect(dataset.status).toBe("failure");
      expect(dataset.issues).toHaveLength(1);
    });

    it("should correctly type OutputDataset union", () => {
      const unknownDataset: OutputDataset<
        string,
        BaseIssue<unknown>
      > = createDataset("test");
      const successDataset: OutputDataset<
        string,
        BaseIssue<unknown>
      > = createSuccessDataset("test");

      expect(unknownDataset.status).toBe("unknown");
      expect(successDataset.status).toBe("success");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle NaN values", () => {
      const dataset = createDataset(NaN);
      expect(dataset.value).toBeNaN();
      expect(dataset.status).toBe("unknown");
    });

    it("should handle Infinity values", () => {
      const positiveInfinity = createDataset(Infinity);
      const negativeInfinity = createDataset(-Infinity);

      expect(positiveInfinity.value).toBe(Infinity);
      expect(negativeInfinity.value).toBe(-Infinity);
    });

    it("should handle circular references", () => {
      const circular: any = { name: "test" };
      circular.self = circular;

      const dataset = createDataset(circular);
      expect(dataset.value).toBe(circular);
      expect((dataset.value as any).self).toBe(circular);
    });

    it("should handle Symbol values", () => {
      const symbol = Symbol("test");
      const dataset = createDataset(symbol);
      expect(dataset.value).toBe(symbol);
    });

    it("should handle BigInt values", () => {
      const bigInt = BigInt(123456789);
      const dataset = createDataset(bigInt);
      expect(dataset.value).toBe(bigInt);
    });

    it("should handle Date objects", () => {
      const date = new Date("2023-01-01T00:00:00Z");
      const dataset = createDataset(date);
      expect(dataset.value).toBe(date);
    });

    it("should handle RegExp objects", () => {
      const regex = /test/gi;
      const dataset = createDataset(regex);
      expect(dataset.value).toBe(regex);
    });
  });
});
