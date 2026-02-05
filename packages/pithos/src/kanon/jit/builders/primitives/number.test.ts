import { describe, it, expect } from "vitest";
import {
  generateNumberTypeCheck,
  generateMinCheck,
  generateMaxCheck,
  generateLtCheck,
  generateLteCheck,
  generateGtCheck,
  generateGteCheck,
  generatePositiveCheck,
  generateNegativeCheck,
  generateIntCheck,
  generateMultipleOfCheck,
  generateNumberValidation,
} from "./number";
import { createGeneratorContext, pushPath } from "../../context";

describe("number builder", () => {
  describe("[🎯] Coverage Tests", () => {
    // ── generateNumberTypeCheck ──

    it("[🎯] generateNumberTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "age");
      const { code } = generateNumberTypeCheck("v", ctx);
      expect(code).toContain("// Type check: number");
      expect(code).toContain("Property 'age'");
      expect(code).toContain("Number.isNaN");
    });

    it("[🎯] generateNumberTypeCheck without debug, no path", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberTypeCheck("v", ctx);
      expect(code).not.toContain("//");
      expect(code).toContain('typeof v !== "number"');
    });

    it("[🎯] generateNumberTypeCheck with custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberTypeCheck("v", ctx, "custom");
      expect(code).toContain("custom");
    });

    // ── generateMinCheck ──

    it("[🎯] generateMinCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "x");
      const { code } = generateMinCheck("v", 5, ctx);
      expect(code).toContain("// Constraint: min(5)");
      expect(code).toContain("Property 'x'");
    });

    it("[🎯] generateMinCheck no debug, custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMinCheck("v", 0, ctx, "too low");
      expect(code).toContain("too low");
    });

    // ── generateMaxCheck ──

    it("[🎯] generateMaxCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "y");
      const { code } = generateMaxCheck("v", 100, ctx);
      expect(code).toContain("// Constraint: max(100)");
      expect(code).toContain("Property 'y'");
    });

    it("[🎯] generateMaxCheck no debug, custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMaxCheck("v", 10, ctx, "too high");
      expect(code).toContain("too high");
    });

    // ── generateLtCheck ──

    it("[🎯] generateLtCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "a");
      const { code } = generateLtCheck("v", 50, ctx);
      expect(code).toContain("// Constraint: lt(50)");
      expect(code).toContain("Property 'a'");
      expect(code).toContain("v >= 50");
    });

    it("[🎯] generateLtCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateLtCheck("v", 50, ctx, "nope");
      expect(code).toContain("nope");
    });

    // ── generateLteCheck ──

    it("[🎯] generateLteCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "b");
      const { code } = generateLteCheck("v", 99, ctx);
      expect(code).toContain("// Constraint: lte(99)");
      expect(code).toContain("Property 'b'");
      expect(code).toContain("v > 99");
    });

    it("[🎯] generateLteCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateLteCheck("v", 99, ctx, "err");
      expect(code).toContain("err");
    });

    // ── generateGtCheck ──

    it("[🎯] generateGtCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "c");
      const { code } = generateGtCheck("v", 0, ctx);
      expect(code).toContain("// Constraint: gt(0)");
      expect(code).toContain("Property 'c'");
      expect(code).toContain("v <= 0");
    });

    it("[🎯] generateGtCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateGtCheck("v", 0, ctx, "gt err");
      expect(code).toContain("gt err");
    });

    // ── generateGteCheck ──

    it("[🎯] generateGteCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "d");
      const { code } = generateGteCheck("v", 1, ctx);
      expect(code).toContain("// Constraint: gte(1)");
      expect(code).toContain("Property 'd'");
      expect(code).toContain("v < 1");
    });

    it("[🎯] generateGteCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateGteCheck("v", 1, ctx, "gte err");
      expect(code).toContain("gte err");
    });

    // ── generatePositiveCheck ──

    it("[🎯] generatePositiveCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "e");
      const { code } = generatePositiveCheck("v", ctx);
      expect(code).toContain("// Constraint: positive()");
      expect(code).toContain("Property 'e'");
      expect(code).toContain("v <= 0");
    });

    it("[🎯] generatePositiveCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generatePositiveCheck("v", ctx, "pos err");
      expect(code).toContain("pos err");
    });

    // ── generateNegativeCheck ──

    it("[🎯] generateNegativeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "f");
      const { code } = generateNegativeCheck("v", ctx);
      expect(code).toContain("// Constraint: negative()");
      expect(code).toContain("Property 'f'");
      expect(code).toContain("v >= 0");
    });

    it("[🎯] generateNegativeCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNegativeCheck("v", ctx, "neg err");
      expect(code).toContain("neg err");
    });

    // ── generateIntCheck ──

    it("[🎯] generateIntCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "g");
      const { code } = generateIntCheck("v", ctx);
      expect(code).toContain("// Constraint: int()");
      expect(code).toContain("Property 'g'");
      expect(code).toContain("Number.isInteger");
    });

    it("[🎯] generateIntCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateIntCheck("v", ctx, "int err");
      expect(code).toContain("int err");
    });

    // ── generateMultipleOfCheck ──

    it("[🎯] generateMultipleOfCheck integer divisor with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "h");
      const { code } = generateMultipleOfCheck("v", 5, ctx);
      expect(code).toContain("// Constraint: multipleOf(5)");
      expect(code).toContain("Property 'h'");
      expect(code).toContain("v % 5 !== 0");
    });

    it("[🎯] generateMultipleOfCheck float divisor (epsilon comparison)", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMultipleOfCheck("v", 0.1, ctx);
      expect(code).toContain("Math.abs");
      expect(code).toContain("1e-10");
    });

    it("[🎯] generateMultipleOfCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMultipleOfCheck("v", 3, ctx, "mult err");
      expect(code).toContain("mult err");
    });

    // ── generateNumberValidation ──

    it("[🎯] generateNumberValidation with all constraints", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "val");
      const { code } = generateNumberValidation("v", ctx, {
        min: { value: 0 },
        max: { value: 100 },
        lt: { value: 101 },
        lte: { value: 100 },
        gt: { value: -1 },
        gte: { value: 0 },
        positive: {},
        negative: { message: "must be neg" },
        int: {},
        multipleOf: { value: 5 },
      });
      const joined = code.join("\n");
      expect(joined).toContain("v < 0");   // min
      expect(joined).toContain("v > 100"); // max
      expect(joined).toContain("v >= 101"); // lt
      expect(joined).toContain("v > 100");  // lte
      expect(joined).toContain("v <= -1");  // gt
      expect(joined).toContain("v < 0");    // gte
      expect(joined).toContain("v <= 0");   // positive
      expect(joined).toContain("must be neg"); // negative custom
      expect(joined).toContain("Number.isInteger"); // int
      expect(joined).toContain("v % 5");    // multipleOf
    });

    it("[🎯] generateNumberValidation without constraints", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx);
      expect(code).toHaveLength(1);
      expect(code[0]).toContain('typeof v !== "number"');
    });

    it("[🎯] generateNumberValidation with empty constraints object", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, {});
      expect(code).toHaveLength(1);
    });

    it("[🎯] generateNumberValidation with only min", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { min: { value: 1 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only max", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { max: { value: 10 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only lt", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { lt: { value: 10 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only lte", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { lte: { value: 10 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only gt", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { gt: { value: 0 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only gte", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { gte: { value: 0 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only positive", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { positive: {} });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only negative", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { negative: {} });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only int", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { int: {} });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with only multipleOf", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, { multipleOf: { value: 3 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateNumberValidation with custom type message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberValidation("v", ctx, undefined, "not a num");
      expect(code[0]).toContain("not a num");
    });

    // ── Mutation tests ──

    it("[👾] generateNumberTypeCheck debug produces comment + newline + code starting with if", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateNumberTypeCheck("v", ctx);
      expect(code).toContain("// Type check: number");
      expect(code).toContain("\n");
      const lines = code.split("\n");
      expect(lines[lines.length - 1]).toMatch(/^\s*if \(/);
    });

    it("[👾] generateNumberTypeCheck no-debug no-path error starts with Expected number", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNumberTypeCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Expected number"');
    });

    it("[👾] generateMinCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateMinCheck("v", 5, ctx);
      expect(code).toContain("// Constraint: min(5)");
      expect(code).toContain("\n");
    });

    it("[👾] generateMinCheck no-debug no-path uses 'at least' not 'at most'", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMinCheck("v", 5, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be at least 5"');
    });

    it("[👾] generateMaxCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateMaxCheck("v", 10, ctx);
      expect(code).toContain("// Constraint: max(10)");
      expect(code).toContain("\n");
    });

    it("[👾] generateMaxCheck no-debug no-path uses 'at most' not 'at least'", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMaxCheck("v", 10, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be at most 10"');
    });

    it("[👾] generateLtCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateLtCheck("v", 50, ctx);
      expect(code).toContain("// Constraint: lt(50)");
      expect(code).toContain("\n");
    });

    it("[👾] generateLtCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateLtCheck("v", 50, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be less than 50"');
    });

    it("[👾] generateLteCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateLteCheck("v", 99, ctx);
      expect(code).toContain("// Constraint: lte(99)");
      expect(code).toContain("\n");
    });

    it("[👾] generateLteCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateLteCheck("v", 99, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be less than or equal to 99"');
    });

    it("[👾] generateGtCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateGtCheck("v", 0, ctx);
      expect(code).toContain("// Constraint: gt(0)");
      expect(code).toContain("\n");
    });

    it("[👾] generateGtCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateGtCheck("v", 0, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be greater than 0"');
    });

    it("[👾] generateGteCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateGteCheck("v", 1, ctx);
      expect(code).toContain("// Constraint: gte(1)");
      expect(code).toContain("\n");
    });

    it("[👾] generateGteCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateGteCheck("v", 1, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be greater than or equal to 1"');
    });

    it("[👾] generatePositiveCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generatePositiveCheck("v", ctx);
      expect(code).toContain("// Constraint: positive()");
      expect(code).toContain("\n");
    });

    it("[👾] generatePositiveCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generatePositiveCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be positive"');
    });

    it("[👾] generateNegativeCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateNegativeCheck("v", ctx);
      expect(code).toContain("// Constraint: negative()");
      expect(code).toContain("\n");
    });

    it("[👾] generateNegativeCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateNegativeCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be negative"');
    });

    it("[👾] generateIntCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateIntCheck("v", ctx);
      expect(code).toContain("// Constraint: int()");
      expect(code).toContain("\n");
    });

    it("[👾] generateIntCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateIntCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be an integer"');
    });

    it("[👾] generateMultipleOfCheck debug produces comment + newline", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateMultipleOfCheck("v", 5, ctx);
      expect(code).toContain("// Constraint: multipleOf(5)");
      expect(code).toContain("\n");
    });

    it("[👾] generateMultipleOfCheck no-debug no-path code starts with if", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMultipleOfCheck("v", 5, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Number must be a multiple of 5"');
    });
  });
});
