/**
 * Tests for Primitives Code Builder (null, undefined, any, unknown, never, void, symbol)
 */

import { describe, it, expect } from "vitest";
import { createGeneratorContext, pushPath } from "../../context";
import {
  generateNullTypeCheck,
  generateNullValidation,
  generateUndefinedTypeCheck,
  generateUndefinedValidation,
  generateAnyValidation,
  generateUnknownValidation,
  generateNeverTypeCheck,
  generateNeverValidation,
  generateVoidTypeCheck,
  generateVoidValidation,
  generateSymbolTypeCheck,
  generateSymbolValidation,
} from "./others";

describe("Primitives Code Builder", () => {
  describe("generateNullTypeCheck", () => {
    it("generates correct null check code", () => {
      const ctx = createGeneratorContext();
      const result = generateNullTypeCheck("value", ctx);
      expect(result.code).toBe('if (value !== null) return "Expected null";');
    });

    it("includes path in error message when path is set", () => {
      const ctx = pushPath(createGeneratorContext(), "data");
      const result = generateNullTypeCheck("v_0", ctx);
      expect(result.code).toBe('if (v_0 !== null) return "Property \'data\': Expected null";');
    });
  });

  describe("generateNullValidation", () => {
    it("generates null validation code", () => {
      const ctx = createGeneratorContext();
      const result = generateNullValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain("value !== null");
    });
  });

  describe("generateUndefinedTypeCheck", () => {
    it("generates correct undefined check code", () => {
      const ctx = createGeneratorContext();
      const result = generateUndefinedTypeCheck("value", ctx);
      expect(result.code).toBe('if (value !== undefined) return "Expected undefined";');
    });
  });

  describe("generateUndefinedValidation", () => {
    it("generates undefined validation code", () => {
      const ctx = createGeneratorContext();
      const result = generateUndefinedValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain("value !== undefined");
    });
  });

  describe("generateAnyValidation", () => {
    it("generates no validation code for any type", () => {
      const ctx = createGeneratorContext();
      const result = generateAnyValidation("value", ctx);
      expect(result.code).toHaveLength(0);
    });
  });

  describe("generateUnknownValidation", () => {
    it("generates no validation code for unknown type", () => {
      const ctx = createGeneratorContext();
      const result = generateUnknownValidation("value", ctx);
      expect(result.code).toHaveLength(0);
    });
  });

  describe("generateNeverTypeCheck", () => {
    it("generates unconditional error for never type", () => {
      const ctx = createGeneratorContext();
      const result = generateNeverTypeCheck("value", ctx);
      expect(result.code).toBe('return "This value should never exist";');
    });
  });

  describe("generateNeverValidation", () => {
    it("generates never validation code", () => {
      const ctx = createGeneratorContext();
      const result = generateNeverValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain("This value should never exist");
    });
  });

  describe("generateVoidTypeCheck", () => {
    it("generates correct void check code (accepts undefined)", () => {
      const ctx = createGeneratorContext();
      const result = generateVoidTypeCheck("value", ctx);
      expect(result.code).toBe('if (value !== undefined) return "Expected void (undefined)";');
    });
  });

  describe("generateVoidValidation", () => {
    it("generates void validation code", () => {
      const ctx = createGeneratorContext();
      const result = generateVoidValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain("value !== undefined");
    });
  });

  describe("generateSymbolTypeCheck", () => {
    it("generates correct symbol check code", () => {
      const ctx = createGeneratorContext();
      const result = generateSymbolTypeCheck("value", ctx);
      expect(result.code).toBe('if (typeof value !== "symbol") return "Expected symbol";');
    });
  });

  describe("generateSymbolValidation", () => {
    it("generates symbol validation code", () => {
      const ctx = createGeneratorContext();
      const result = generateSymbolValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain('typeof value !== "symbol"');
    });
  });
});

describe("Primitives generated code execution", () => {
  it("null check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateNullTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(null)).toBe(true);
    expect(fn(undefined)).toBe("Expected null");
    expect(fn(0)).toBe("Expected null");
    expect(fn("")).toBe("Expected null");
  });

  it("undefined check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateUndefinedTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(undefined)).toBe(true);
    expect(fn(null)).toBe("Expected undefined");
    expect(fn(0)).toBe("Expected undefined");
  });

  it("never check always fails when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateNeverTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(null)).toBe("This value should never exist");
    expect(fn(undefined)).toBe("This value should never exist");
    expect(fn(42)).toBe("This value should never exist");
    expect(fn("hello")).toBe("This value should never exist");
  });

  it("void check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateVoidTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(undefined)).toBe(true);
    expect(fn(null)).toBe("Expected void (undefined)");
    expect(fn(0)).toBe("Expected void (undefined)");
  });

  it("symbol check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateSymbolTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(Symbol("test"))).toBe(true);
    expect(fn(Symbol.for("test"))).toBe(true);
    expect(fn("symbol")).toBe("Expected symbol");
    expect(fn(123)).toBe("Expected symbol");
  });
});
