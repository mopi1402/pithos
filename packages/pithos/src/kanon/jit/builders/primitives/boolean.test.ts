/**
 * Tests for Boolean Code Builder
 */

import { describe, it, expect } from "vitest";
import { createGeneratorContext, pushPath } from "../../context";
import {
  generateBooleanTypeCheck,
  generateBooleanValidation,
} from "./boolean";

describe("Boolean Code Builder", () => {
  describe("generateBooleanTypeCheck", () => {
    it("generates correct type check code", () => {
      const ctx = createGeneratorContext();
      const result = generateBooleanTypeCheck("value", ctx);
      expect(result.code).toBe('if (typeof value !== "boolean") return "Expected boolean";');
    });

    it("includes path in error message when path is set", () => {
      const ctx = pushPath(createGeneratorContext(), "active");
      const result = generateBooleanTypeCheck("v_0", ctx);
      expect(result.code).toBe('if (typeof v_0 !== "boolean") return "Property \'active\': Expected boolean";');
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateBooleanTypeCheck("value", ctx, "Must be true or false");
      expect(result.code).toBe('if (typeof value !== "boolean") return "Must be true or false";');
    });

    it("[👾] includes debug comment with newline separator when debug is enabled", () => {
      const ctx = createGeneratorContext({ debug: true });
      const result = generateBooleanTypeCheck("value", ctx);
      // Debug comment on first line, type check on second line, separated by \n
      expect(result.code).toContain("// Type check: boolean");
      expect(result.code).toContain("\n");
    });
  });

  describe("generateBooleanValidation", () => {
    it("generates type check only (no constraints for boolean)", () => {
      const ctx = createGeneratorContext();
      const result = generateBooleanValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain('typeof value !== "boolean"');
    });
  });
});

describe("Boolean generated code execution", () => {
  it("boolean type check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateBooleanTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(true)).toBe(true);
    expect(fn(false)).toBe(true);
    expect(fn(1)).toBe("Expected boolean");
    expect(fn("true")).toBe("Expected boolean");
  });
});
