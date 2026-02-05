import { describe, it, expect } from "vitest";
import {
  generateRefinementCall,
  generateRefinementsValidation,
  hasRefinements,
  getRefinements,
  type RefinementFn,
} from "./refinements";
import { createGeneratorContext } from "../context";

describe("refinements builder", () => {
  describe("generateRefinementCall", () => {
    it("should generate code for a single refinement", () => {
      const ctx = createGeneratorContext();
      const refinement: RefinementFn<string> = (v) =>
        v.length > 0 || "Cannot be empty";

      const result = generateRefinementCall("value", refinement, ctx);

      expect(result.code).toContain('externals.get("ref_0")');
      expect(result.code).toContain("ref_result_0");
      expect(result.code).toContain("if (ref_result_0 !== true) return ref_result_0");
      expect(result.ctx.externals.size).toBe(1);
      expect(result.ctx.externals.has("ref_0")).toBe(true);
    });

    it("should add debug comment when index is provided", () => {
      const ctx = createGeneratorContext({ debug: true });
      const refinement: RefinementFn<string> = () => true;

      const result = generateRefinementCall("value", refinement, ctx, 0);

      expect(result.code).toContain("// Refinement 1");
    });

    it("should store the refinement function in externals", () => {
      const ctx = createGeneratorContext();
      const refinement: RefinementFn<number> = (v) => v > 0 || "Must be positive";

      const result = generateRefinementCall("value", refinement, ctx);

      const storedFn = result.ctx.externals.get("ref_0") as RefinementFn<number>;
      expect(storedFn).toBeDefined();
      expect(storedFn(5)).toBe(true);
      expect(storedFn(-1)).toBe("Must be positive");
    });
  });

  describe("generateRefinementsValidation", () => {
    it("should generate code for multiple refinements in order", () => {
      const ctx = createGeneratorContext();
      const refinements: RefinementFn<string>[] = [
        (v) => v.length > 0 || "Cannot be empty",
        (v) => /^[a-z]+$/.test(v) || "Must be lowercase",
        (v) => v.length < 10 || "Too long",
      ];

      const result = generateRefinementsValidation("value", refinements, ctx);

      expect(result.code).toHaveLength(3);
      expect(result.ctx.externals.size).toBe(3);
      expect(result.ctx.externals.has("ref_0")).toBe(true);
      expect(result.ctx.externals.has("ref_1")).toBe(true);
      expect(result.ctx.externals.has("ref_2")).toBe(true);
    });

    it("should return empty code for empty refinements array", () => {
      const ctx = createGeneratorContext();

      const result = generateRefinementsValidation("value", [], ctx);

      expect(result.code).toHaveLength(0);
      expect(result.ctx.externals.size).toBe(0);
    });

    it("should preserve refinement order", () => {
      const ctx = createGeneratorContext();
      const callOrder: number[] = [];
      const refinements: RefinementFn<string>[] = [
        () => {
          callOrder.push(1);
          return true;
        },
        () => {
          callOrder.push(2);
          return true;
        },
        () => {
          callOrder.push(3);
          return true;
        },
      ];

      const result = generateRefinementsValidation("value", refinements, ctx);

      // Execute the refinements to verify order
      const ref0 = result.ctx.externals.get("ref_0") as RefinementFn<string>;
      const ref1 = result.ctx.externals.get("ref_1") as RefinementFn<string>;
      const ref2 = result.ctx.externals.get("ref_2") as RefinementFn<string>;

      ref0("test");
      ref1("test");
      ref2("test");

      expect(callOrder).toEqual([1, 2, 3]);
    });
  });

  describe("hasRefinements", () => {
    it("should return true for schema with refinements", () => {
      const schema = { refinements: [() => true] };
      expect(hasRefinements(schema)).toBe(true);
    });

    it("should return false for schema without refinements", () => {
      const schema = { refinements: undefined };
      expect(hasRefinements(schema)).toBe(false);
    });

    it("should return false for schema with empty refinements array", () => {
      const schema = { refinements: [] };
      expect(hasRefinements(schema)).toBe(false);
    });
  });

  describe("getRefinements", () => {
    it("should return refinements array", () => {
      const refinement: RefinementFn<unknown> = () => true as const;
      const schema = { refinements: [refinement] };
      expect(getRefinements(schema)).toEqual([refinement]);
    });

    it("should return empty array for undefined refinements", () => {
      const schema = { refinements: undefined };
      expect(getRefinements(schema)).toEqual([]);
    });
  });

  describe("integration with compile", () => {
    it("should generate executable code with refinements", () => {
      const ctx = createGeneratorContext();
      const refinement: RefinementFn<string> = (v) =>
        v.length > 2 || "Too short";

      const result = generateRefinementCall("value", refinement, ctx);

      // Build a complete function
      const code = `
        if (typeof value !== "string") return "Expected string";
        ${result.code}
        return true;
      `;

      // eslint-disable-next-line no-new-func
      const fn = new Function("value", "externals", code);

      expect(fn("abc", result.ctx.externals)).toBe(true);
      expect(fn("ab", result.ctx.externals)).toBe("Too short");
      expect(fn(123, result.ctx.externals)).toBe("Expected string");
    });
  });
});


describe("[👾] Mutation: refinements code generation", () => {
  it("[👾] debug comment only appears when both debug=true AND index is provided", () => {
    const refinement: RefinementFn<string> = () => true;

    // debug=false + index provided → no comment
    const ctx1 = createGeneratorContext({ debug: false });
    const r1 = generateRefinementCall("value", refinement, ctx1, 0);
    expect(r1.code).not.toContain("// Refinement");

    // debug=true + no index → no comment
    const ctx2 = createGeneratorContext({ debug: true });
    const r2 = generateRefinementCall("value", refinement, ctx2);
    expect(r2.code).not.toContain("// Refinement");
  });

  it("[👾] prefixPath with path prepends Property prefix to error", () => {
    let ctx = createGeneratorContext();
    ctx = { ...ctx, path: ["user", "name"] };
    const refinement: RefinementFn<string> = () => true;

    const result = generateRefinementCall("value", refinement, ctx, undefined, { prefixPath: true });

    expect(result.code).toContain("Property 'user.name': ");
    expect(result.code).toContain('return "Property');
  });

  it("[👾] prefixPath without path returns raw result (no prefix)", () => {
    const ctx = createGeneratorContext();
    const refinement: RefinementFn<string> = () => true;

    const result = generateRefinementCall("value", refinement, ctx, undefined, { prefixPath: true });

    // No path → should return raw result, not prefixed
    expect(result.code).not.toContain("Property");
    expect(result.code).toContain("return ref_result_0");
  });

  it("[👾] prefixPath with path generates executable error prefix code", () => {
    let ctx = createGeneratorContext();
    ctx = { ...ctx, path: ["items", "0"] };
    const refinement: RefinementFn<string> = (v) => v.length > 0 || "Cannot be empty";

    const result = generateRefinementCall("value", refinement, ctx, undefined, { prefixPath: true });

    const code = `${result.code}\nreturn true;`;
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", "externals", code);

    // Valid value → true
    expect(fn("hello", result.ctx.externals)).toBe(true);
    // Invalid value → prefixed error
    const err = fn("", result.ctx.externals);
    expect(err).toContain("Property 'items[0]'");
    expect(err).toContain("Cannot be empty");
  });

  it("[👾] code lines are joined with newline", () => {
    const ctx = createGeneratorContext();
    const refinement: RefinementFn<string> = () => true;

    const result = generateRefinementCall("value", refinement, ctx);

    expect(result.code).toContain("\n");
  });
});


describe("[👾] Mutation: prefixPath false vs true", () => {
  it("[👾] without prefixPath, error is NOT prefixed even when path exists", () => {
    let ctx = createGeneratorContext();
    ctx = { ...ctx, path: ["user", "name"] };
    const refinement: RefinementFn<string> = (v) => v.length > 0 || "Cannot be empty";

    // No prefixPath option → should NOT prefix
    const result = generateRefinementCall("value", refinement, ctx);

    const code = `${result.code}\nreturn true;`;
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", "externals", code);

    const err = fn("", result.ctx.externals);
    expect(err).toBe("Cannot be empty");
    expect(err).not.toContain("Property");
  });
});
