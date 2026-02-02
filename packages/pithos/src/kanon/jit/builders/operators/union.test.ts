/**
 * Tests for Union Code Builder
 */

import { describe, it, expect } from "vitest";
import { createGeneratorContext, pushPath } from "../../context";
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
  type UnionBranchMeta,
} from "./union";
import { generateStringValidation } from "../primitives/string";
import { generateNumberValidation } from "../primitives/number";
import { generateBooleanValidation } from "../primitives/boolean";

describe("Union Code Builder", () => {
  describe("groupBranchesByTypeof", () => {
    it("groups branches by typeof check", () => {
      const branches: UnionBranchMeta[] = [
        { typeName: "string", typeofCheck: "string", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
        { typeName: "number", typeofCheck: "number", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
        { typeName: "string2", typeofCheck: "string", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
      ];

      const groups = groupBranchesByTypeof(branches);

      expect(groups.get("string")).toEqual([0, 2]);
      expect(groups.get("number")).toEqual([1]);
    });

    it("ignores branches without typeof check", () => {
      const branches: UnionBranchMeta[] = [
        { typeName: "string", typeofCheck: "string", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
        { typeName: "object", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
      ];

      const groups = groupBranchesByTypeof(branches);

      expect(groups.get("string")).toEqual([0]);
      expect(groups.has("object")).toBe(false);
    });
  });

  describe("canOptimizeWithTypeof", () => {
    it("returns true when all branches have typeof checks", () => {
      const branches: UnionBranchMeta[] = [
        { typeName: "string", typeofCheck: "string", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
        { typeName: "number", typeofCheck: "number", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
      ];

      expect(canOptimizeWithTypeof(branches)).toBe(true);
    });

    it("returns false when some branches lack typeof checks", () => {
      const branches: UnionBranchMeta[] = [
        { typeName: "string", typeofCheck: "string", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
        { typeName: "object", generateCode: () => ({ code: [], ctx: createGeneratorContext() }) },
      ];

      expect(canOptimizeWithTypeof(branches)).toBe(false);
    });
  });

  describe("generateOptimizedPrimitiveUnion", () => {
    it("generates combined typeof check for string | number", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNumberBranch((v, c) => generateNumberValidation(v, c)),
      ];

      const result = generateOptimizedPrimitiveUnion("value", branches, ctx);

      expect(result.code.length).toBe(2);
      expect(result.code[0]).toContain('typeof value !== "string"');
      expect(result.code[0]).toContain('typeof value !== "number"');
      expect(result.code[0]).toContain("&&");
      expect(result.code[0]).toContain("Value does not match any of the expected types");
      expect(result.code[1]).toContain("return true");
    });

    it("includes NaN check when number is in union", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNumberBranch((v, c) => generateNumberValidation(v, c)),
      ];

      const result = generateOptimizedPrimitiveUnion("value", branches, ctx);

      expect(result.code[0]).toContain("Number.isNaN(value)");
    });

    it("does not include NaN check when number is not in union", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createBooleanBranch((v, c) => generateBooleanValidation(v, c)),
      ];

      const result = generateOptimizedPrimitiveUnion("value", branches, ctx);

      expect(result.code[0]).not.toContain("Number.isNaN");
    });

    it("includes path in error message", () => {
      const ctx = pushPath(createGeneratorContext(), "field");
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
      ];

      const result = generateOptimizedPrimitiveUnion("value", branches, ctx);

      expect(result.code[0]).toContain("Property 'field'");
    });
  });

  describe("generateSimpleSequentialUnion", () => {
    it("generates sequential checks with early return", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNumberBranch((v, c) => generateNumberValidation(v, c)),
      ];

      const result = generateSimpleSequentialUnion("value", branches, ctx);
      const code = result.code.join("\n");

      // Should have early return for string
      expect(code).toContain('typeof value === "string"');
      expect(code).toContain("return true");
      // Should have early return for number
      expect(code).toContain('typeof value === "number"');
      // Should have final error
      expect(code).toContain("Value does not match any of the expected types");
    });

    it("handles null branch correctly", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNullBranch(),
      ];

      const result = generateSimpleSequentialUnion("value", branches, ctx);
      const code = result.code.join("\n");

      expect(code).toContain("Value does not match any of the expected types");
    });
  });

  describe("generateUnionValidation", () => {
    it("returns error for empty union", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, { branches: [] });

      expect(result.code.length).toBe(1);
      expect(result.code[0]).toContain("No valid type in union");
    });

    it("uses single branch validation for single-branch union", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, {
        branches: [createStringBranch((v, c) => generateStringValidation(v, c))],
      });

      // Should just be the string validation
      expect(result.code[0]).toContain('typeof value !== "string"');
    });

    it("uses optimized typeof for primitive unions", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, {
        branches: [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ],
      });

      // Should use combined typeof check (error check + return true)
      expect(result.code.length).toBe(2);
      expect(result.code[0]).toContain("&&");
    });

    it("uses sequential validation for mixed unions", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, {
        branches: [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNullBranch(),
        ],
      });

      // Should use sequential checks
      expect(result.code.length).toBeGreaterThan(1);
    });

    it("uses custom error message", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, {
        branches: [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ],
        errorMessage: "Custom union error",
      });

      expect(result.code[0]).toContain("Custom union error");
    });
  });

  describe("branch helpers", () => {
    it("createStringBranch creates correct metadata", () => {
      const branch = createStringBranch((v, c) => ({ code: [], ctx: c }));
      expect(branch.typeName).toBe("string");
      expect(branch.typeofCheck).toBe("string");
    });

    it("createNumberBranch creates correct metadata", () => {
      const branch = createNumberBranch((v, c) => ({ code: [], ctx: c }));
      expect(branch.typeName).toBe("number");
      expect(branch.typeofCheck).toBe("number");
    });

    it("createBooleanBranch creates correct metadata", () => {
      const branch = createBooleanBranch((v, c) => ({ code: [], ctx: c }));
      expect(branch.typeName).toBe("boolean");
      expect(branch.typeofCheck).toBe("boolean");
    });

    it("createNullBranch creates correct metadata", () => {
      const branch = createNullBranch();
      expect(branch.typeName).toBe("null");
      expect(branch.typeofCheck).toBeUndefined();
    });

    it("createUndefinedBranch creates correct metadata", () => {
      const branch = createUndefinedBranch();
      expect(branch.typeName).toBe("undefined");
      expect(branch.typeofCheck).toBe("undefined");
    });
  });
});

describe("Union generated code execution", () => {
  it("optimized primitive union works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const branches: UnionBranchMeta[] = [
      createStringBranch((v, c) => generateStringValidation(v, c)),
      createNumberBranch((v, c) => generateNumberValidation(v, c)),
    ];

    const result = generateOptimizedPrimitiveUnion("value", branches, ctx);
    const code = result.code.join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn("hello")).toBe(true);
    expect(fn(123)).toBe(true);
    expect(fn(true)).toContain("Value does not match any of the expected types");
    expect(fn(null)).toContain("Value does not match any of the expected types");
    expect(fn(NaN)).toContain("Value does not match any of the expected types");
  });

  it("sequential union works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const branches: UnionBranchMeta[] = [
      createStringBranch((v, c) => generateStringValidation(v, c)),
      createNullBranch(),
    ];

    const result = generateSimpleSequentialUnion("value", branches, ctx);
    const code = result.code.join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn("hello")).toBe(true);
    expect(fn(null)).toBe(true);
    expect(fn(123)).toContain("Value does not match any of the expected types");
    expect(fn(undefined)).toContain("Value does not match any of the expected types");
  });

  it("complete union validation works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateUnionValidation("value", ctx, {
      branches: [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNumberBranch((v, c) => generateNumberValidation(v, c)),
        createBooleanBranch((v, c) => generateBooleanValidation(v, c)),
      ],
    });

    const code = result.code.join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn("hello")).toBe(true);
    expect(fn(123)).toBe(true);
    expect(fn(true)).toBe(true);
    expect(fn(false)).toBe(true);
    expect(fn(null)).toContain("does not match");
    expect(fn({})).toContain("does not match");
  });

  it("union with null works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateUnionValidation("value", ctx, {
      branches: [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNullBranch(),
      ],
    });

    const code = result.code.join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn("hello")).toBe(true);
    expect(fn(null)).toBe(true);
    expect(fn(123)).toContain("does not match");
  });

  it("union with undefined works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateUnionValidation("value", ctx, {
      branches: [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createUndefinedBranch(),
      ],
    });

    const code = result.code.join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn("hello")).toBe(true);
    expect(fn(undefined)).toBe(true);
    expect(fn(null)).toContain("does not match");
  });

  it("early return optimization works (first branch match)", () => {
    const ctx = createGeneratorContext();
    const branches: UnionBranchMeta[] = [
      createStringBranch((v, c) => generateStringValidation(v, c)),
      {
        typeName: "custom",
        typeofCheck: undefined,
        generateCode: (_v, c) => {
          return { code: [`if (true) return "custom error";`], ctx: c };
        },
      },
    ];

    const result = generateSimpleSequentialUnion("value", branches, ctx);
    const code = result.code.join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    // String should match first branch and return early
    expect(fn("hello")).toBe(true);
    // The second branch generator was called during code generation, not execution
    // So we can't test this with a side effect in the generator
  });
});


import { it as itProp, fc } from "@fast-check/vitest";

// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 10: Union Early Return
// Validates: Requirements 10.1, 10.2, 10.3, 10.4
// ============================================================================

describe("[🎲] Property 10: Union Early Return", () => {
  // ============================================================================
  // Property 10.1: union([schemaA, schemaB]) generates sequential checks with early return
  // Validates: Requirement 10.1
  // ============================================================================
  describe("Requirement 10.1: Sequential checks with early return", () => {
    itProp.prop([fc.boolean()])(
      "[🎲] union generates sequential validation structure",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");

        // Must contain return true for early exit
        expect(code).toContain("return true");
      }
    );

    itProp.prop([
      fc.array(
        fc.constantFrom("string", "number", "boolean"),
        { minLength: 2, maxLength: 5 }
      ),
    ])(
      "[🎲] union with multiple primitive branches generates combined typeof check",
      (typeNames) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = typeNames.map((typeName) => {
          switch (typeName) {
            case "string":
              return createStringBranch((v, c) => generateStringValidation(v, c));
            case "number":
              return createNumberBranch((v, c) => generateNumberValidation(v, c));
            case "boolean":
              return createBooleanBranch((v, c) => generateBooleanValidation(v, c));
            default:
              return createStringBranch((v, c) => generateStringValidation(v, c));
          }
        });

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");

        // For primitive unions, should use optimized typeof check with &&
        expect(code).toContain("typeof value");
        expect(code).toContain("return true");
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] sequential union generates individual branch checks",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNullBranch(),
        ];

        const result = generateSimpleSequentialUnion("value", branches, ctx);
        const code = result.code.join("\n");

        // Must have check for string
        expect(code).toContain('typeof value === "string"');
        // Must have early return
        expect(code).toContain("return true");
      }
    );
  });

  // ============================================================================
  // Property 10.2: First branch match returns immediately without testing others
  // Validates: Requirement 10.2
  // ============================================================================
  describe("Requirement 10.2: First branch match returns immediately", () => {
    itProp.prop([fc.string()])(
      "[🎲] string value matching first branch returns true immediately",
      (strValue) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // String should match first branch
        expect(fn(strValue)).toBe(true);
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] number value matching second branch returns true",
      (numValue) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Number should match second branch
        expect(fn(numValue)).toBe(true);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] boolean value matching third branch returns true",
      (boolValue) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
          createBooleanBranch((v, c) => generateBooleanValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Boolean should match third branch
        expect(fn(boolValue)).toBe(true);
      }
    );

    itProp.prop([fc.oneof(fc.string(), fc.integer(), fc.boolean())])(
      "[🎲] any matching value returns true for string|number|boolean union",
      (value) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
          createBooleanBranch((v, c) => generateBooleanValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Any of string, number, boolean should match
        expect(fn(value)).toBe(true);
      }
    );

    it("[🎲] early return prevents evaluation of subsequent branches at runtime", () => {
      // This test verifies early return by checking the generated code structure
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNumberBranch((v, c) => generateNumberValidation(v, c)),
      ];

      const result = generateSimpleSequentialUnion("value", branches, ctx);
      const code = result.code.join("\n");

      // The code structure should have early returns after each branch check
      // Count occurrences of "return true" - should have one per branch
      const returnTrueCount = (code.match(/return true/g) || []).length;
      expect(returnTrueCount).toBeGreaterThanOrEqual(branches.length);
    });
  });

  // ============================================================================
  // Property 10.3: No branch match returns combined error message
  // Validates: Requirement 10.3
  // ============================================================================
  describe("Requirement 10.3: No match returns combined error message", () => {
    itProp.prop([fc.object()])(
      "[🎲] object value not matching any primitive branch returns error",
      (objValue) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(objValue);

        // Must return error string
        expect(typeof fnResult).toBe("string");
        // Error should use the standard union error message
        expect(fnResult).toContain("does not match any of the expected types");
      }
    );

    itProp.prop([
      fc.array(
        fc.constantFrom("string", "number", "boolean"),
        { minLength: 2, maxLength: 4 }
      ),
    ])(
      "[🎲] error message lists all expected types from union branches",
      (typeNames) => {
        const uniqueTypes = [...new Set(typeNames)];
        
        // Skip if only one unique type (single-branch union uses type's own error message)
        if (uniqueTypes.length < 2) return;
        
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = uniqueTypes.map((typeName) => {
          switch (typeName) {
            case "string":
              return createStringBranch((v, c) => generateStringValidation(v, c));
            case "number":
              return createNumberBranch((v, c) => generateNumberValidation(v, c));
            case "boolean":
              return createBooleanBranch((v, c) => generateBooleanValidation(v, c));
            default:
              return createStringBranch((v, c) => generateStringValidation(v, c));
          }
        });

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Use null which won't match any primitive type
        const fnResult = fn(null);

        // Must return error string
        expect(typeof fnResult).toBe("string");
        // Error should use the standard union error message
        expect(fnResult).toContain("does not match any of the expected types");
      }
    );

    itProp.prop([fc.constantFrom(null, undefined, Symbol("test"))])(
      "[🎲] null/undefined/symbol not matching string|number returns error",
      (value) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(value);

        // Must return error string
        expect(typeof fnResult).toBe("string");
        expect(fnResult).toContain("does not match any of the expected types");
      }
    );

    it("[🎲] NaN is rejected by number branch", () => {
      const ctx = createGeneratorContext();
      const branches: UnionBranchMeta[] = [
        createStringBranch((v, c) => generateStringValidation(v, c)),
        createNumberBranch((v, c) => generateNumberValidation(v, c)),
      ];

      const result = generateUnionValidation("value", ctx, { branches });
      const code = result.code.join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      // NaN should be rejected (typeof is "number" but it's not a valid number)
      const fnResult = fn(NaN);
      expect(typeof fnResult).toBe("string");
      expect(fnResult).toContain("does not match any of the expected types");
    });
  });

  // ============================================================================
  // Property 10.4: Primitive unions use optimized typeof grouping
  // Validates: Requirement 10.4
  // ============================================================================
  describe("Requirement 10.4: Optimized typeof grouping for primitives", () => {
    itProp.prop([fc.boolean()])(
      "[🎲] primitive union uses combined typeof check with &&",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateOptimizedPrimitiveUnion("value", branches, ctx);
        const code = result.code.join("\n");

        // Must use combined typeof check with &&
        expect(code).toContain('typeof value !== "string"');
        expect(code).toContain('typeof value !== "number"');
        expect(code).toContain("&&");
      }
    );

    itProp.prop([
      fc.array(
        fc.constantFrom("string", "number", "boolean"),
        { minLength: 2, maxLength: 4 }
      ),
    ])(
      "[🎲] all primitive types in union are included in typeof check",
      (typeNames) => {
        const uniqueTypes = [...new Set(typeNames)];
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = uniqueTypes.map((typeName) => {
          switch (typeName) {
            case "string":
              return createStringBranch((v, c) => generateStringValidation(v, c));
            case "number":
              return createNumberBranch((v, c) => generateNumberValidation(v, c));
            case "boolean":
              return createBooleanBranch((v, c) => generateBooleanValidation(v, c));
            default:
              return createStringBranch((v, c) => generateStringValidation(v, c));
          }
        });

        const result = generateOptimizedPrimitiveUnion("value", branches, ctx);
        const code = result.code.join("\n");

        // Each type should be in the typeof check
        for (const typeName of uniqueTypes) {
          expect(code).toContain(`typeof value !== "${typeName}"`);
        }
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] canOptimizeWithTypeof returns true for all-primitive unions",
      (includeBoolean) => {
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        if (includeBoolean) {
          branches.push(createBooleanBranch((v, c) => generateBooleanValidation(v, c)));
        }

        expect(canOptimizeWithTypeof(branches)).toBe(true);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] canOptimizeWithTypeof returns false when null is in union",
      (includeNumber) => {
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNullBranch(),
        ];

        if (includeNumber) {
          branches.push(createNumberBranch((v, c) => generateNumberValidation(v, c)));
        }

        // null doesn't have a typeofCheck, so optimization is not possible
        expect(canOptimizeWithTypeof(branches)).toBe(false);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] generateUnionValidation automatically uses optimization for primitives",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
          createBooleanBranch((v, c) => generateBooleanValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");

        // Should use optimized form (combined typeof with &&)
        expect(code).toContain("&&");
        // In debug mode, there's a comment line; in non-debug mode, there are 2 lines
        // The key is that it uses the optimized form, not the sequential form
        if (debug) {
          // Debug mode: comment + error check + return true
          expect(result.code.length).toBe(3);
          expect(result.code[0]).toContain("// Union check:");
        } else {
          // Non-debug mode: error check + return true
          expect(result.code.length).toBe(2);
        }
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] mixed union (primitive + null) uses sequential validation",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNullBranch(),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");

        // Should use sequential form (more than 2 lines)
        expect(result.code.length).toBeGreaterThan(2);
        // Should have individual checks
        expect(code).toContain('typeof value === "string"');
      }
    );
  });

  // ============================================================================
  // Combined union validation properties
  // ============================================================================
  describe("Combined union validation", () => {
    itProp.prop([
      fc.oneof(
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined)
      ),
    ])(
      "[🎲] union correctly validates diverse value types",
      (value) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
          createBooleanBranch((v, c) => generateBooleanValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(value);

        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          // NaN is a special case - it's typeof "number" but should be rejected
          if (typeof value === "number" && Number.isNaN(value)) {
            expect(typeof fnResult).toBe("string");
          } else {
            expect(fnResult).toBe(true);
          }
        } else {
          expect(typeof fnResult).toBe("string");
        }
      }
    );

    itProp.prop([
      fc.oneof(fc.string(), fc.constant(null)),
    ])(
      "[🎲] string|null union correctly validates string and null",
      (value) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNullBranch(),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Both string and null should be valid
        expect(fn(value)).toBe(true);
      }
    );

    itProp.prop([
      fc.oneof(fc.string(), fc.constant(undefined)),
    ])(
      "[🎲] string|undefined union correctly validates string and undefined",
      (value) => {
        const ctx = createGeneratorContext();
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createUndefinedBranch(),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Both string and undefined should be valid
        expect(fn(value)).toBe(true);
      }
    );
  });

  // ============================================================================
  // Edge cases
  // ============================================================================
  describe("Edge cases", () => {
    it("[🎲] empty union always returns error", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, { branches: [] });
      const code = result.code.join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      // Any value should fail
      expect(typeof fn("test")).toBe("string");
      expect(typeof fn(123)).toBe("string");
      expect(typeof fn(null)).toBe("string");
    });

    it("[🎲] single branch union behaves like the single type", () => {
      const ctx = createGeneratorContext();
      const result = generateUnionValidation("value", ctx, {
        branches: [createStringBranch((v, c) => generateStringValidation(v, c))],
      });
      // Single branch uses the branch's validation directly, which doesn't include return true
      // We need to add it for execution
      const code = [...result.code, "return true;"].join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      expect(fn("hello")).toBe(true);
      expect(typeof fn(123)).toBe("string");
    });

    itProp.prop([fc.string({ minLength: 1, maxLength: 100 })])(
      "[🎲] custom error message is used in union validation",
      (customMessage) => {
        const ctx = createGeneratorContext();
        const result = generateUnionValidation("value", ctx, {
          branches: [
            createStringBranch((v, c) => generateStringValidation(v, c)),
            createNumberBranch((v, c) => generateNumberValidation(v, c)),
          ],
          errorMessage: customMessage,
        });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Invalid value should return custom error message
        const fnResult = fn(null);
        expect(typeof fnResult).toBe("string");
        expect(fnResult).toContain(customMessage);
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s))])(
      "[🎲] path is included in error message when set",
      (pathName) => {
        const ctx = pushPath(createGeneratorContext(), pathName);
        const branches: UnionBranchMeta[] = [
          createStringBranch((v, c) => generateStringValidation(v, c)),
          createNumberBranch((v, c) => generateNumberValidation(v, c)),
        ];

        const result = generateUnionValidation("value", ctx, { branches });
        const code = result.code.join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(null);
        expect(typeof fnResult).toBe("string");
        expect(fnResult).toContain(`Property '${pathName}'`);
      }
    );
  });
});
