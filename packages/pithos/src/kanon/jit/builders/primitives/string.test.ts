import { describe, it, expect } from "vitest";
import {
  generateStringTypeCheck,
  generateMinLengthCheck,
  generateMaxLengthCheck,
  generateLengthCheck,
  generateEmailCheck,
  generateUrlCheck,
  generateUuidCheck,
  generateRegexCheck,
  generateIncludesCheck,
  generateStartsWithCheck,
  generateEndsWithCheck,
  generateStringValidation,
} from "./string";
import { createGeneratorContext, pushPath } from "../../context";

describe("string builder", () => {
  describe("[🎯] Coverage Tests", () => {
    // ── generateStringTypeCheck ──

    it("[🎯] generateStringTypeCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "name");
      const { code } = generateStringTypeCheck("v", ctx);
      expect(code).toContain("// Type check: string");
      expect(code).toContain("Property 'name'");
    });

    it("[🎯] generateStringTypeCheck no debug, custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringTypeCheck("v", ctx, "custom");
      expect(code).toContain("custom");
      expect(code).not.toContain("//");
    });

    // ── generateMinLengthCheck ──

    it("[🎯] generateMinLengthCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "a");
      const { code } = generateMinLengthCheck("v", 3, ctx);
      expect(code).toContain("// Constraint: minLength(3)");
      expect(code).toContain("Property 'a'");
    });

    it("[🎯] generateMinLengthCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMinLengthCheck("v", 1, ctx, "too short");
      expect(code).toContain("too short");
    });

    // ── generateMaxLengthCheck ──

    it("[🎯] generateMaxLengthCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "b");
      const { code } = generateMaxLengthCheck("v", 10, ctx);
      expect(code).toContain("// Constraint: maxLength(10)");
      expect(code).toContain("Property 'b'");
    });

    it("[🎯] generateMaxLengthCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMaxLengthCheck("v", 5, ctx, "too long");
      expect(code).toContain("too long");
    });

    // ── generateLengthCheck ──

    it("[🎯] generateLengthCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "c");
      const { code } = generateLengthCheck("v", 5, ctx);
      expect(code).toContain("// Constraint: length(5)");
      expect(code).toContain("Property 'c'");
    });

    it("[🎯] generateLengthCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateLengthCheck("v", 5, ctx, "wrong len");
      expect(code).toContain("wrong len");
    });

    // ── generateEmailCheck ──

    it("[🎯] generateEmailCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "d");
      const { code } = generateEmailCheck("v", ctx);
      expect(code).toContain("// Constraint: email()");
      expect(code).toContain("Property 'd'");
    });

    it("[🎯] generateEmailCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateEmailCheck("v", ctx, "bad email");
      expect(code).toContain("bad email");
    });

    // ── generateUrlCheck ──

    it("[🎯] generateUrlCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "e");
      const { code } = generateUrlCheck("v", ctx);
      expect(code).toContain("// Constraint: url()");
      expect(code).toContain("Property 'e'");
    });

    it("[🎯] generateUrlCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUrlCheck("v", ctx, "bad url");
      expect(code).toContain("bad url");
    });

    // ── generateUuidCheck ──

    it("[🎯] generateUuidCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "f");
      const { code } = generateUuidCheck("v", ctx);
      expect(code).toContain("// Constraint: uuid()");
      expect(code).toContain("Property 'f'");
    });

    it("[🎯] generateUuidCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUuidCheck("v", ctx, "bad uuid");
      expect(code).toContain("bad uuid");
    });

    // ── generateRegexCheck ──

    it("[🎯] generateRegexCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "g");
      const { code } = generateRegexCheck("v", /^[a-z]+$/, ctx);
      expect(code).toContain("// Constraint: regex");
      expect(code).toContain("Property 'g'");
    });

    it("[🎯] generateRegexCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateRegexCheck("v", /test/, ctx, "no match");
      expect(code).toContain("no match");
    });

    // ── generateIncludesCheck ──

    it("[🎯] generateIncludesCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "h");
      const { code } = generateIncludesCheck("v", "foo", ctx);
      expect(code).toContain('// Constraint: includes("foo")');
      expect(code).toContain("Property 'h'");
    });

    it("[🎯] generateIncludesCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateIncludesCheck("v", "x", ctx, "missing");
      expect(code).toContain("missing");
    });

    // ── generateStartsWithCheck ──

    it("[🎯] generateStartsWithCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "i");
      const { code } = generateStartsWithCheck("v", "pre", ctx);
      expect(code).toContain('// Constraint: startsWith("pre")');
      expect(code).toContain("Property 'i'");
    });

    it("[🎯] generateStartsWithCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStartsWithCheck("v", "a", ctx, "bad start");
      expect(code).toContain("bad start");
    });

    // ── generateEndsWithCheck ──

    it("[🎯] generateEndsWithCheck with debug + path", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "j");
      const { code } = generateEndsWithCheck("v", "suf", ctx);
      expect(code).toContain('// Constraint: endsWith("suf")');
      expect(code).toContain("Property 'j'");
    });

    it("[🎯] generateEndsWithCheck custom message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateEndsWithCheck("v", "z", ctx, "bad end");
      expect(code).toContain("bad end");
    });

    // ── generateStringValidation ──

    it("[🎯] generateStringValidation with all constraints", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = pushPath(ctx, "val");
      const { code } = generateStringValidation("v", ctx, {
        minLength: { value: 1 },
        maxLength: { value: 100 },
        length: { value: 50 },
        email: {},
        url: {},
        uuid: {},
        regex: { pattern: /^test$/ },
        includes: { value: "abc" },
        startsWith: { value: "start" },
        endsWith: { value: "end" },
      });
      const joined = code.join("\n");
      expect(joined).toContain("v.length < 1");
      expect(joined).toContain("v.length > 100");
      expect(joined).toContain("v.length !== 50");
      expect(joined).toContain(".test(v)"); // email/url/uuid/regex
      expect(joined).toContain('v.includes("abc")');
      expect(joined).toContain('v.startsWith("start")');
      expect(joined).toContain('v.endsWith("end")');
    });

    it("[🎯] generateStringValidation without constraints", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx);
      expect(code).toHaveLength(1);
    });

    it("[🎯] generateStringValidation with empty constraints", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, {});
      expect(code).toHaveLength(1);
    });

    it("[🎯] generateStringValidation with custom type message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, undefined, "not str");
      expect(code[0]).toContain("not str");
    });

    it("[🎯] generateStringValidation with only minLength", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { minLength: { value: 2 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only maxLength", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { maxLength: { value: 10 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only length", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { length: { value: 5 } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only email", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { email: {} });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only url", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { url: {} });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only uuid", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { uuid: {} });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only regex", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { regex: { pattern: /x/ } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only includes", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { includes: { value: "x" } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only startsWith", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { startsWith: { value: "x" } });
      expect(code).toHaveLength(2);
    });

    it("[🎯] generateStringValidation with only endsWith", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringValidation("v", ctx, { endsWith: { value: "x" } });
      expect(code).toHaveLength(2);
    });

    // ── [👾] Mutation tests: no-debug + no-path exact output ──

    it("[👾] generateStringTypeCheck no-debug no-path exact output", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStringTypeCheck("v", ctx);
      expect(code).toBe('if (typeof v !== "string") return "Expected string";');
    });

    it("[👾] generateStringTypeCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateStringTypeCheck("v", ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateMinLengthCheck no-debug no-path exact output", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMinLengthCheck("v", 3, ctx);
      expect(code).toBe('if (v.length < 3) return "String must be at least 3 characters long";');
    });

    it("[👾] generateMinLengthCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateMinLengthCheck("v", 3, ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateMaxLengthCheck no-debug no-path exact output", () => {
      const ctx = createGeneratorContext();
      const { code } = generateMaxLengthCheck("v", 10, ctx);
      expect(code).toBe('if (v.length > 10) return "String must be at most 10 characters long";');
    });

    it("[👾] generateMaxLengthCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateMaxLengthCheck("v", 10, ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateLengthCheck no-debug no-path exact output", () => {
      const ctx = createGeneratorContext();
      const { code } = generateLengthCheck("v", 5, ctx);
      expect(code).toBe('if (v.length !== 5) return "String must be exactly 5 characters long";');
    });

    it("[👾] generateLengthCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateLengthCheck("v", 5, ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateEmailCheck no-debug no-path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateEmailCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Invalid email format"');
    });

    it("[👾] generateEmailCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateEmailCheck("v", ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateUrlCheck no-debug no-path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUrlCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Invalid URL format"');
    });

    it("[👾] generateUrlCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateUrlCheck("v", ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateUuidCheck no-debug no-path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateUuidCheck("v", ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "Invalid UUID format"');
    });

    it("[👾] generateUuidCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateUuidCheck("v", ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateRegexCheck no-debug no-path has no indent and exact error", () => {
      const ctx = createGeneratorContext();
      const { code } = generateRegexCheck("v", /^abc$/, ctx);
      expect(code).toMatch(/^if \(/);
      expect(code).toContain('return "String must match pattern ^abc$"');
    });

    it("[👾] generateRegexCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateRegexCheck("v", /x/, ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateIncludesCheck no-debug no-path exact output", () => {
      const ctx = createGeneratorContext();
      const { code } = generateIncludesCheck("v", "foo", ctx);
      expect(code).toBe('if (!v.includes("foo")) return "String must include \\"foo\\"";');
    });

    it("[👾] generateIncludesCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateIncludesCheck("v", "foo", ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateStartsWithCheck no-debug no-path exact error message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateStartsWithCheck("v", "pre", ctx);
      expect(code).toBe('if (!v.startsWith("pre")) return "String must start with \\"pre\\"";');
    });

    it("[👾] generateStartsWithCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateStartsWithCheck("v", "pre", ctx);
      expect(code).toContain("\n");
    });

    it("[👾] generateEndsWithCheck no-debug no-path exact error message", () => {
      const ctx = createGeneratorContext();
      const { code } = generateEndsWithCheck("v", "suf", ctx);
      expect(code).toBe('if (!v.endsWith("suf")) return "String must end with \\"suf\\"";');
    });

    it("[👾] generateEndsWithCheck debug mode has newline separator", () => {
      const ctx = createGeneratorContext({ debug: true });
      const { code } = generateEndsWithCheck("v", "suf", ctx);
      expect(code).toContain("\n");
    });
  });
});
