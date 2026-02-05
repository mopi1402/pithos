import { describe, it, expect } from "vitest";
import {
  groupBranchesByTypeof,
  canOptimizeWithTypeof,
  generateOptimizedPrimitiveUnion,
  generateSimpleSequentialUnion,
  generateUnionValidation,
  createStringBranch,
  createNumberBranch,
  createBooleanBranch,
  createNullBranch,
  createUndefinedBranch,
} from "./union";
import type { UnionBranchMeta } from "./union";
import { createGeneratorContext, pushPath } from "../../context";
import type { GeneratorContext } from "../../context";

const noop = (v: string, ctx: GeneratorContext) => ({ code: [], ctx });

describe("union builder", () => {
  describe("[🎯] Coverage Tests", () => {
    // ── generateOptimizedPrimitiveUnion ──

    it("[🎯] generateOptimizedPrimitiveUnion with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "field");
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNumberBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      const joined = code.join("\n");
      // debug comment present
      expect(joined).toContain("// Union check:");
      // path prefix in error
      expect(joined).toContain("Property 'field'");
      // NaN check for number branch
      expect(joined).toContain("Number.isNaN");
    });

    it("[🎯] generateOptimizedPrimitiveUnion without number (no NaN check)", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      const joined = code.join("\n");
      expect(joined).not.toContain("Number.isNaN");
    });

    it("[🎯] generateOptimizedPrimitiveUnion with custom errorMessage", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNumberBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx, "custom error");
      expect(code.join("\n")).toContain("custom error");
    });

    // ── generateSimpleSequentialUnion ──

    it("[🎯] generateSimpleSequentialUnion with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "item");
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      const joined = code.join("\n");
      expect(joined).toContain("// Union check:");
      expect(joined).toContain("Property 'item'");
    });

    it("[🎯] generateSimpleSequentialUnion with number typeof branch (NaN check)", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createNumberBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      const joined = code.join("\n");
      expect(joined).toContain("Number.isNaN");
    });

    it("[🎯] generateSimpleSequentialUnion with complex branch (no typeofCheck)", () => {
      const ctx = createGeneratorContext();
      const complexBranch: UnionBranchMeta = {
        typeName: "object",
        generateCode: (varName, c) => ({
          code: [`if (typeof ${varName} !== "object") return "Expected object";`],
          ctx: c,
        }),
      };
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        complexBranch,
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      const joined = code.join("\n");
      // complex branch wrapped in IIFE
      expect(joined).toContain("(function()");
      expect(joined).toContain("Expected object");
    });

    it("[🎯] generateSimpleSequentialUnion with custom errorMessage", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx, "my error");
      expect(code.join("\n")).toContain("my error");
    });

    // ── generateUnionValidation ──

    it("[🎯] generateUnionValidation with empty branches", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUnionValidation("v", ctx, { branches: [] });
      expect(code.join("\n")).toContain("No valid type in union");
    });

    it("[🎯] generateUnionValidation with empty branches + debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "x");
      const { code } = generateUnionValidation("v", ctx, { branches: [] });
      const joined = code.join("\n");
      expect(joined).toContain("Property 'x'");
    });

    it("[🎯] generateUnionValidation with empty branches + custom error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUnionValidation("v", ctx, {
        branches: [],
        errorMessage: "nope",
      });
      expect(code.join("\n")).toContain("nope");
    });

    it("[🎯] generateUnionValidation with single branch delegates to branch", () => {
      const ctx = createGeneratorContext();
      const branch = createStringBranch((varName, c) => ({
        code: [`if (typeof ${varName} !== "string") return "err";`],
        ctx: c,
      }));
      const { code } = generateUnionValidation("v", ctx, { branches: [branch] });
      expect(code.join("\n")).toContain('typeof v !== "string"');
    });

    it("[🎯] generateUnionValidation chooses optimized path for all-primitive branches", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateUnionValidation("v", ctx, { branches });
      const joined = code.join("\n");
      // optimized: single if with && checks
      expect(joined).toContain('typeof v !== "string" && typeof v !== "boolean"');
    });

    it("[🎯] generateUnionValidation chooses sequential path for mixed branches", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateUnionValidation("v", ctx, { branches });
      const joined = code.join("\n");
      // sequential: separate if checks
      expect(joined).toContain('typeof v === "string"');
      expect(joined).toContain("v !== null");
    });

    // ── createNullBranch ──

    it("[🎯] createNullBranch with debug", () => {
      const ctx = createGeneratorContext({ debug: true });
      const branch = createNullBranch();
      expect(branch.typeofCheck).toBeUndefined();
      const { code } = branch.generateCode("v", ctx);
      expect(code[0]).toContain("v !== null");
    });

    // ── createUndefinedBranch ──

    it("[🎯] createUndefinedBranch with debug", () => {
      const ctx = createGeneratorContext({ debug: true });
      const branch = createUndefinedBranch();
      expect(branch.typeofCheck).toBe("undefined");
      const { code } = branch.generateCode("v", ctx);
      expect(code[0]).toContain("v !== undefined");
    });

    it("[🎯] createUndefinedBranch without debug", () => {
      const ctx = createGeneratorContext();
      const branch = createUndefinedBranch();
      const { code } = branch.generateCode("v", ctx);
      expect(code[0]).toContain("v !== undefined");
    });

    // ── groupBranchesByTypeof / canOptimizeWithTypeof ──

    it("[🎯] groupBranchesByTypeof groups correctly", () => {
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNumberBranch(noop),
        createNullBranch(), // no typeofCheck
      ];
      const groups = groupBranchesByTypeof(branches);
      expect(groups.get("string")).toEqual([0]);
      expect(groups.get("number")).toEqual([1]);
      expect(groups.has("null")).toBe(false);
    });

    it("[🎯] canOptimizeWithTypeof returns false when a branch lacks typeofCheck", () => {
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      expect(canOptimizeWithTypeof(branches)).toBe(false);
    });

    it("[🎯] canOptimizeWithTypeof returns true when all branches have typeofCheck", () => {
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNumberBranch(noop),
      ];
      expect(canOptimizeWithTypeof(branches)).toBe(true);
    });

    // ── Mutation tests ──

    it("[👾] groupBranchesByTypeof skips branches without typeofCheck", () => {
      const branches: UnionBranchMeta[] = [
        createNullBranch(),
        createNullBranch(),
      ];
      const groups = groupBranchesByTypeof(branches);
      expect(groups.size).toBe(0);
    });

    it("[👾] generateOptimizedPrimitiveUnion without debug has no indentation", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      for (const line of code) {
        expect(line).toBe(line.trimStart());
      }
    });

    it("[👾] generateOptimizedPrimitiveUnion without path has no prefix in error message", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      const ifLine = code.find(l => l.includes("if ("));
      // Without path, error starts directly with "Value" not "Property 'x': Value"
      expect(ifLine).toContain('return "Value does not match');
    });

    it("[👾] generateOptimizedPrimitiveUnion lines array starts empty (no extra elements)", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      // Without debug, no comment line → first line is the if check
      expect(code[0]).toContain("if (");
    });

    it("[👾] generateOptimizedPrimitiveUnion includes type names separated by pipe in debug comment", () => {
      const ctx = createGeneratorContext({ debug: true });
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      expect(code[0]).toContain("string | boolean");
    });

    it("[👾] generateOptimizedPrimitiveUnion without debug omits comment line", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      // No debug → no comment → no undefined pushed
      for (const line of code) {
        expect(line).toBeDefined();
        expect(line).not.toBe("undefined");
      }
    });

    it("[👾] generateOptimizedPrimitiveUnion nanCheck is empty when no number branch", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      const ifLine = code.find(l => l.includes("if ("));
      // No NaN check means condition ends with )) not with ||
      expect(ifLine).toMatch(/\)\) return/);
    });

    it("[👾] generateOptimizedPrimitiveUnion includes return true line", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createBooleanBranch(noop),
      ];
      const { code } = generateOptimizedPrimitiveUnion("v", branches, ctx);
      expect(code.some(l => l === "return true;")).toBe(true);
    });

    it("[👾] generateSimpleSequentialUnion without debug uses empty indent", () => {
      const ctx = createGeneratorContext();
      // Use only typeof branches to avoid IIFE nesting
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNumberBranch(noop),
      ];
      // Need a non-typeof branch to force sequential path
      // Actually string+number are all typeof, so canOptimize would be true
      // and generateUnionValidation would pick optimized path.
      // But generateSimpleSequentialUnion is called directly here.
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      // Without debug, lines start directly with "if" not with whitespace
      expect(code[0]).toMatch(/^if /);
    });

    it("[👾] generateSimpleSequentialUnion without path has no prefix in error", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      const errorLine = code[code.length - 1];
      // Without path, error starts directly with "Value"
      expect(errorLine).toMatch(/^return "Value does not match/);
    });

    it("[👾] generateSimpleSequentialUnion lines array starts empty", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      expect(code[0]).toContain("if (");
    });

    it("[👾] generateSimpleSequentialUnion includes type names in debug comment", () => {
      const ctx = createGeneratorContext({ debug: true });
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      expect(code[0]).toContain("string | null");
    });

    it("[👾] generateSimpleSequentialUnion without debug omits comment", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch(noop),
        createNullBranch(),
      ];
      const { code } = generateSimpleSequentialUnion("v", branches, ctx);
      for (const line of code) {
        expect(line).toBeDefined();
        expect(line).not.toBe("undefined");
      }
    });

    it("[👾] generateSimpleSequentialUnion complex branch trims inner lines", () => {
      const ctx = createGeneratorContext();
      const complexBranch: UnionBranchMeta = {
        typeName: "object",
        generateCode: (varName, c) => ({
          code: [`  if (typeof ${varName} !== "object") return "err";  `],
          ctx: c,
        }),
      };
      const { code } = generateSimpleSequentialUnion("v", [complexBranch], ctx);
      const innerLine = code.find(l => l.includes("Expected object") || l.includes("err"));
      // .trim() removes leading/trailing whitespace from inner lines
      expect(innerLine).not.toMatch(/^\s{4,}/);
    });

    it("[👾] generateSimpleSequentialUnion complex branch has return true and closing IIFE", () => {
      const ctx = createGeneratorContext();
      const complexBranch: UnionBranchMeta = {
        typeName: "object",
        generateCode: (varName, c) => ({
          code: [`if (typeof ${varName} !== "object") return "err";`],
          ctx: c,
        }),
      };
      const { code } = generateSimpleSequentialUnion("v", [complexBranch], ctx);
      const joined = code.join("\n");
      expect(joined).toContain("})();");
      expect(joined).toContain("=== true) return true;");
      // IIFE must contain "return true;" before the closing
      const iifeReturnIdx = code.findIndex(l => l.trim() === "return true;");
      const iifeCloseIdx = code.findIndex(l => l.includes("})();"));
      expect(iifeReturnIdx).toBeGreaterThan(-1);
      expect(iifeReturnIdx).toBeLessThan(iifeCloseIdx);
    });

    it("[👾] generateUnionValidation empty branches without debug starts with return", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUnionValidation("v", ctx, { branches: [] });
      expect(code[0]).toMatch(/^return "/);
    });

    it("[👾] generateUnionValidation empty branches without path error starts with No valid", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUnionValidation("v", ctx, { branches: [] });
      expect(code[0]).toMatch(/return "No valid type/);
    });

    it("[👾] generateUnionValidation single branch returns branch code directly", () => {
      const ctx = createGeneratorContext();
      const branch = createStringBranch((varName, c) => ({
        code: [`if (typeof ${varName} !== "string") return "err";`, `return true;`],
        ctx: c,
      }));
      const { code } = generateUnionValidation("v", ctx, { branches: [branch] });
      // Single branch: code comes directly from branch, not wrapped
      expect(code).toEqual([`if (typeof v !== "string") return "err";`, `return true;`]);
    });

    it("[👾] createStringBranch has typeName 'string'", () => {
      expect(createStringBranch(noop).typeName).toBe("string");
    });

    it("[👾] createNumberBranch has typeName 'number'", () => {
      expect(createNumberBranch(noop).typeName).toBe("number");
    });

    it("[👾] createBooleanBranch has typeName 'boolean'", () => {
      expect(createBooleanBranch(noop).typeName).toBe("boolean");
    });

    it("[👾] createNullBranch has typeName 'null'", () => {
      expect(createNullBranch().typeName).toBe("null");
    });

    it("[👾] createUndefinedBranch has typeName 'undefined'", () => {
      expect(createUndefinedBranch().typeName).toBe("undefined");
    });

    it("[👾] createNullBranch without debug code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = createNullBranch().generateCode("v", ctx);
      expect(code[0]).toMatch(/^if \(/);
    });

    it("[👾] createUndefinedBranch without debug code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = createUndefinedBranch().generateCode("v", ctx);
      expect(code[0]).toMatch(/^if \(/);
    });
  });
});
