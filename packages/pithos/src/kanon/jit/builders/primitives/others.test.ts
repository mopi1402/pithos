import { describe, it, expect } from "vitest";
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
import { createGeneratorContext, pushPath } from "../../context";

describe("others builder", () => {
  describe("[🎯] Coverage Tests", () => {
    // ── Null ──

    it("[🎯] generateNullTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "n");
      const { code } = generateNullTypeCheck("v", ctx);
      expect(code).toContain("Property 'n'");
    });

    it("[🎯] generateNullTypeCheck with custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNullTypeCheck("v", ctx, "custom null");
      expect(code).toContain("custom null");
    });

    it("[🎯] generateNullValidation wraps type check", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNullValidation("v", ctx);
      expect(code).toHaveLength(1);
      expect(code[0]).toContain("v !== null");
    });

    // ── Undefined ──

    it("[🎯] generateUndefinedTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "u");
      const { code } = generateUndefinedTypeCheck("v", ctx);
      expect(code).toContain("Property 'u'");
    });

    it("[🎯] generateUndefinedTypeCheck with custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUndefinedTypeCheck("v", ctx, "custom undef");
      expect(code).toContain("custom undef");
    });

    it("[🎯] generateUndefinedValidation wraps type check", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUndefinedValidation("v", ctx);
      expect(code).toHaveLength(1);
      expect(code[0]).toContain("v !== undefined");
    });

    // ── Any ──

    it("[🎯] generateAnyValidation returns empty code", () => {
      const ctx = createGeneratorContext();
      const { code } = generateAnyValidation("v", ctx);
      expect(code).toHaveLength(0);
    });

    // ── Unknown ──

    it("[🎯] generateUnknownValidation returns empty code", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUnknownValidation("v", ctx);
      expect(code).toHaveLength(0);
    });

    // ── Never ──

    it("[🎯] generateNeverTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "nv");
      const { code } = generateNeverTypeCheck("v", ctx);
      expect(code).toContain("Property 'nv'");
    });

    it("[🎯] generateNeverTypeCheck with custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNeverTypeCheck("v", ctx, "custom never");
      expect(code).toContain("custom never");
    });

    it("[🎯] generateNeverValidation wraps type check", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNeverValidation("v", ctx);
      expect(code).toHaveLength(1);
      expect(code[0]).toContain("return");
    });

    // ── Void ──

    it("[🎯] generateVoidTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "vo");
      const { code } = generateVoidTypeCheck("v", ctx);
      expect(code).toContain("Property 'vo'");
    });

    it("[🎯] generateVoidTypeCheck with custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateVoidTypeCheck("v", ctx, "custom void");
      expect(code).toContain("custom void");
    });

    it("[🎯] generateVoidValidation wraps type check", () => {
      const ctx = createGeneratorContext();
      const { code } = generateVoidValidation("v", ctx);
      expect(code).toHaveLength(1);
      expect(code[0]).toContain("v !== undefined");
    });

    // ── Symbol ──

    it("[🎯] generateSymbolTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "s");
      const { code } = generateSymbolTypeCheck("v", ctx);
      expect(code).toContain("Property 's'");
    });

    it("[🎯] generateSymbolTypeCheck with custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateSymbolTypeCheck("v", ctx, "custom sym");
      expect(code).toContain("custom sym");
    });

    it("[🎯] generateSymbolValidation wraps type check", () => {
      const ctx = createGeneratorContext();
      const { code } = generateSymbolValidation("v", ctx);
      expect(code).toHaveLength(1);
      expect(code[0]).toContain('typeof v !== "symbol"');
    });

    // ── [👾] Mutation tests: no-debug + no-path exact output ──

    it("[👾] generateNullTypeCheck without debug/path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNullTypeCheck("v", ctx);
      expect(code).toBe('if (v !== null) return "Expected null";');
    });

    it("[👾] generateUndefinedTypeCheck without debug/path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUndefinedTypeCheck("v", ctx);
      expect(code).toBe('if (v !== undefined) return "Expected undefined";');
    });

    it("[👾] generateNeverTypeCheck without debug/path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNeverTypeCheck("v", ctx);
      expect(code).toBe('return "This value should never exist";');
    });

    it("[👾] generateVoidTypeCheck without debug/path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateVoidTypeCheck("v", ctx);
      expect(code).toBe('if (v !== undefined) return "Expected void (undefined)";');
    });

    it("[👾] generateSymbolTypeCheck without debug/path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateSymbolTypeCheck("v", ctx);
      expect(code).toBe('if (typeof v !== "symbol") return "Expected symbol";');
    });
  });
});
