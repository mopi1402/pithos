/**
 * Tests for Number Code Builder
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { createGeneratorContext, pushPath } from "../../context";
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

describe("Number Code Builder", () => {
  describe("generateNumberTypeCheck", () => {
    it("generates correct type check code with NaN check", () => {
      const ctx = createGeneratorContext();
      const result = generateNumberTypeCheck("value", ctx);
      expect(result.code).toBe('if (typeof value !== "number" || Number.isNaN(value)) return "Expected number";');
    });

    it("includes path in error message when path is set", () => {
      const ctx = pushPath(createGeneratorContext(), "age");
      const result = generateNumberTypeCheck("v_0", ctx);
      expect(result.code).toBe('if (typeof v_0 !== "number" || Number.isNaN(v_0)) return "Property \'age\': Expected number";');
    });
  });

  describe("generateMinCheck", () => {
    it("generates correct min check code", () => {
      const ctx = createGeneratorContext();
      const result = generateMinCheck("value", 0, ctx);
      expect(result.code).toBe('if (value < 0) return "Number must be at least 0";');
    });
  });

  describe("generateMaxCheck", () => {
    it("generates correct max check code", () => {
      const ctx = createGeneratorContext();
      const result = generateMaxCheck("value", 100, ctx);
      expect(result.code).toBe('if (value > 100) return "Number must be at most 100";');
    });
  });

  describe("generateLtCheck", () => {
    it("generates correct lt (less than) check code", () => {
      const ctx = createGeneratorContext();
      const result = generateLtCheck("value", 10, ctx);
      expect(result.code).toBe('if (value >= 10) return "Number must be less than 10";');
    });
  });

  describe("generateLteCheck", () => {
    it("generates correct lte (less than or equal) check code", () => {
      const ctx = createGeneratorContext();
      const result = generateLteCheck("value", 10, ctx);
      expect(result.code).toBe('if (value > 10) return "Number must be less than or equal to 10";');
    });
  });

  describe("generateGtCheck", () => {
    it("generates correct gt (greater than) check code", () => {
      const ctx = createGeneratorContext();
      const result = generateGtCheck("value", 0, ctx);
      expect(result.code).toBe('if (value <= 0) return "Number must be greater than 0";');
    });
  });

  describe("generateGteCheck", () => {
    it("generates correct gte (greater than or equal) check code", () => {
      const ctx = createGeneratorContext();
      const result = generateGteCheck("value", 0, ctx);
      expect(result.code).toBe('if (value < 0) return "Number must be greater than or equal to 0";');
    });
  });

  describe("generateNumberValidation", () => {
    it("generates type check only when no constraints", () => {
      const ctx = createGeneratorContext();
      const result = generateNumberValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain('typeof value !== "number"');
    });

    it("generates all constraint checks", () => {
      const ctx = createGeneratorContext();
      const result = generateNumberValidation("value", ctx, {
        min: { value: 0 },
        max: { value: 100 },
        gt: { value: -1 },
        gte: { value: 0 },
        lt: { value: 101 },
        lte: { value: 100 },
      });
      expect(result.code).toHaveLength(7);
      expect(result.code[0]).toContain('typeof value !== "number"');
      expect(result.code[1]).toContain("value < 0");
      expect(result.code[2]).toContain("value > 100");
      expect(result.code[3]).toContain("value >= 101");
      expect(result.code[4]).toContain("value > 100");
      expect(result.code[5]).toContain("value <= -1");
      expect(result.code[6]).toContain("value < 0");
    });
  });
});

describe("Number Code Builder - Advanced Constraints", () => {
  describe("generatePositiveCheck", () => {
    it("generates correct positive check code", () => {
      const ctx = createGeneratorContext();
      const result = generatePositiveCheck("value", ctx);
      expect(result.code).toBe('if (value <= 0) return "Number must be positive";');
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generatePositiveCheck("value", ctx, "Must be > 0");
      expect(result.code).toBe('if (value <= 0) return "Must be > 0";');
    });
  });

  describe("generateNegativeCheck", () => {
    it("generates correct negative check code", () => {
      const ctx = createGeneratorContext();
      const result = generateNegativeCheck("value", ctx);
      expect(result.code).toBe('if (value >= 0) return "Number must be negative";');
    });
  });

  describe("generateIntCheck", () => {
    it("generates correct integer check code", () => {
      const ctx = createGeneratorContext();
      const result = generateIntCheck("value", ctx);
      expect(result.code).toBe('if (!Number.isInteger(value)) return "Number must be an integer";');
    });
  });

  describe("generateMultipleOfCheck", () => {
    it("generates correct multipleOf check code for integers", () => {
      const ctx = createGeneratorContext();
      const result = generateMultipleOfCheck("value", 5, ctx);
      expect(result.code).toBe('if (value % 5 !== 0) return "Number must be a multiple of 5";');
    });

    it("generates epsilon-based check for floating point divisors", () => {
      const ctx = createGeneratorContext();
      const result = generateMultipleOfCheck("value", 0.1, ctx);
      expect(result.code).toContain("Math.abs");
      expect(result.code).toContain("1e-10");
    });
  });

  describe("generateNumberValidation with advanced constraints", () => {
    it("generates all advanced constraint checks", () => {
      const ctx = createGeneratorContext();
      const result = generateNumberValidation("value", ctx, {
        min: { value: 0 },
        positive: {},
        int: {},
        multipleOf: { value: 5 },
      });
      expect(result.code.length).toBe(5);
      expect(result.code[0]).toContain('typeof value !== "number"');
      expect(result.code[1]).toContain("value < 0");
      expect(result.code[2]).toContain("value <= 0");
      expect(result.code[3]).toContain("Number.isInteger");
      expect(result.code[4]).toContain("value % 5");
    });
  });
});

describe("Number generated code execution", () => {
  it("number type check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateNumberTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn(42)).toBe(true);
    expect(fn(0)).toBe(true);
    expect(fn(-5.5)).toBe(true);
    expect(fn("42")).toBe("Expected number");
    expect(fn(NaN)).toBe("Expected number");
  });

  it("number min/max checks work correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateNumberTypeCheck("value", ctx);
    const minCheck = generateMinCheck("value", 0, ctx);
    const maxCheck = generateMaxCheck("value", 100, ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${minCheck.code}\n${maxCheck.code}\nreturn true;`);
    
    expect(fn(50)).toBe(true);
    expect(fn(0)).toBe(true);
    expect(fn(100)).toBe(true);
    expect(fn(-1)).toBe("Number must be at least 0");
    expect(fn(101)).toBe("Number must be at most 100");
  });

  it("positive check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateNumberTypeCheck("value", ctx);
    const positiveCheck = generatePositiveCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${positiveCheck.code}\nreturn true;`);
    
    expect(fn(1)).toBe(true);
    expect(fn(100)).toBe(true);
    expect(fn(0)).toBe("Number must be positive");
    expect(fn(-1)).toBe("Number must be positive");
  });

  it("negative check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateNumberTypeCheck("value", ctx);
    const negativeCheck = generateNegativeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${negativeCheck.code}\nreturn true;`);
    
    expect(fn(-1)).toBe(true);
    expect(fn(-100)).toBe(true);
    expect(fn(0)).toBe("Number must be negative");
    expect(fn(1)).toBe("Number must be negative");
  });

  it("int check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateNumberTypeCheck("value", ctx);
    const intCheck = generateIntCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${intCheck.code}\nreturn true;`);
    
    expect(fn(42)).toBe(true);
    expect(fn(0)).toBe(true);
    expect(fn(-10)).toBe(true);
    expect(fn(3.14)).toBe("Number must be an integer");
    expect(fn(0.5)).toBe("Number must be an integer");
  });

  it("multipleOf check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateNumberTypeCheck("value", ctx);
    const multipleOfCheck = generateMultipleOfCheck("value", 5, ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${multipleOfCheck.code}\nreturn true;`);
    
    expect(fn(0)).toBe(true);
    expect(fn(5)).toBe(true);
    expect(fn(10)).toBe(true);
    expect(fn(15)).toBe(true);
    expect(fn(3)).toBe("Number must be a multiple of 5");
    expect(fn(7)).toBe("Number must be a multiple of 5");
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 3: Number Constraint Code Generation
// Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
// ============================================================================

describe("[🎲] Property 3: Number Constraint Code Generation", () => {
  // ============================================================================
  // Property 3.1: min generates inline code `if (value < n)`
  // Validates: Requirement 3.1
  // ============================================================================
  describe("Requirement 3.1: min inline code generation", () => {
    itProp.prop([fc.double({ min: -1e10, max: 1e10, noNaN: true })])(
      "[🎲] min(n) generates inline `value < n` check",
      (minVal) => {
        const ctx = createGeneratorContext();
        const result = generateMinCheck("value", minVal, ctx);

        // Must contain inline comparison (not a function call)
        expect(result.code).toContain(`value < ${minVal}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
        expect(result.code).not.toContain("validate(");
        // Must be a single if statement with return
        expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
      }
    );

    itProp.prop([
      fc.double({ min: -1000, max: 1000, noNaN: true }),
      fc.double({ min: -1000, max: 1000, noNaN: true }),
    ])(
      "[🎲] min generated code correctly validates numbers",
      (minVal, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const minCheck = generateMinCheck("value", minVal, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${minCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue < minVal) {
          expect(typeof result).toBe("string"); // Error message
        } else {
          expect(result).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 3.2: max generates inline code `if (value > n)`
  // Validates: Requirement 3.2
  // ============================================================================
  describe("Requirement 3.2: max inline code generation", () => {
    itProp.prop([fc.double({ min: -1e10, max: 1e10, noNaN: true })])(
      "[🎲] max(n) generates inline `value > n` check",
      (maxVal) => {
        const ctx = createGeneratorContext();
        const result = generateMaxCheck("value", maxVal, ctx);

        // Must contain inline comparison (not a function call)
        expect(result.code).toContain(`value > ${maxVal}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
        expect(result.code).not.toContain("validate(");
        // Must be a single if statement with return
        expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
      }
    );

    itProp.prop([
      fc.double({ min: -1000, max: 1000, noNaN: true }),
      fc.double({ min: -1000, max: 1000, noNaN: true }),
    ])(
      "[🎲] max generated code correctly validates numbers",
      (maxVal, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const maxCheck = generateMaxCheck("value", maxVal, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${maxCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue > maxVal) {
          expect(typeof result).toBe("string"); // Error message
        } else {
          expect(result).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 3.3: positive generates inline code `if (value <= 0)`
  // Validates: Requirement 3.3
  // ============================================================================
  describe("Requirement 3.3: positive inline code generation", () => {
    it("[🎲] positive() generates inline `value <= 0` check", () => {
      const ctx = createGeneratorContext();
      const result = generatePositiveCheck("value", ctx);

      // Must contain inline comparison (not a function call)
      expect(result.code).toContain("value <= 0");
      // Must not contain external function calls
      expect(result.code).not.toContain("externals");
      expect(result.code).not.toContain("validate(");
      // Must be a single if statement with return
      expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
    });

    itProp.prop([fc.double({ min: -1000, max: 1000, noNaN: true })])(
      "[🎲] positive generated code correctly validates numbers",
      (testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const positiveCheck = generatePositiveCheck("value", ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${positiveCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue <= 0) {
          expect(typeof result).toBe("string"); // Error message
          expect(result).toContain("positive");
        } else {
          expect(result).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 3.4: int generates inline code `if (!Number.isInteger(value))`
  // Validates: Requirement 3.4
  // ============================================================================
  describe("Requirement 3.4: int inline code generation", () => {
    it("[🎲] int() generates inline `Number.isInteger` check", () => {
      const ctx = createGeneratorContext();
      const result = generateIntCheck("value", ctx);

      // Must contain inline Number.isInteger check (not a function call)
      expect(result.code).toContain("Number.isInteger(value)");
      // Must not contain external function calls
      expect(result.code).not.toContain("externals");
      expect(result.code).not.toContain("validate(");
      // Must be a single if statement with return
      expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
    });

    itProp.prop([fc.double({ min: -1000, max: 1000, noNaN: true })])(
      "[🎲] int generated code correctly validates numbers",
      (testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const intCheck = generateIntCheck("value", ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${intCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (!Number.isInteger(testValue)) {
          expect(typeof result).toBe("string"); // Error message
          expect(result).toContain("integer");
        } else {
          expect(result).toBe(true);
        }
      }
    );

    itProp.prop([fc.integer({ min: -1000, max: 1000 })])(
      "[🎲] int generated code accepts all integers",
      (testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const intCheck = generateIntCheck("value", ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${intCheck.code}\nreturn true;`);

        expect(fn(testValue)).toBe(true);
      }
    );
  });

  // ============================================================================
  // Property 3.5: multipleOf generates inline code `if (value % n !== 0)`
  // Validates: Requirement 3.5
  // ============================================================================
  describe("Requirement 3.5: multipleOf inline code generation", () => {
    itProp.prop([fc.integer({ min: 1, max: 100 })])(
      "[🎲] multipleOf(n) generates inline modulo check for integers",
      (divisor) => {
        const ctx = createGeneratorContext();
        const result = generateMultipleOfCheck("value", divisor, ctx);

        // Must contain inline modulo check (not a function call)
        expect(result.code).toContain(`value % ${divisor}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
        expect(result.code).not.toContain("validate(");
        // Must be a single if statement with return
        expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
      }
    );

    itProp.prop([
      fc.integer({ min: 1, max: 50 }),
      fc.integer({ min: -1000, max: 1000 }),
    ])(
      "[🎲] multipleOf generated code correctly validates integers",
      (divisor, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const multipleOfCheck = generateMultipleOfCheck("value", divisor, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "value",
          `${typeCheck.code}\n${multipleOfCheck.code}\nreturn true;`
        );

        const result = fn(testValue);
        if (testValue % divisor !== 0) {
          expect(typeof result).toBe("string"); // Error message
          expect(result).toContain("multiple");
        } else {
          expect(result).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Additional number constraint properties
  // ============================================================================
  describe("Additional number constraints", () => {
    it("[🎲] negative() generates inline `value >= 0` check", () => {
      const ctx = createGeneratorContext();
      const result = generateNegativeCheck("value", ctx);

      // Must contain inline comparison
      expect(result.code).toContain("value >= 0");
      // Must not contain external function calls
      expect(result.code).not.toContain("externals");
      // Must be a single if statement
      expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
    });

    itProp.prop([fc.double({ min: -1000, max: 1000, noNaN: true })])(
      "[🎲] negative generated code correctly validates numbers",
      (testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);
        const negativeCheck = generateNegativeCheck("value", ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${negativeCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue >= 0) {
          expect(typeof result).toBe("string"); // Error message
          expect(result).toContain("negative");
        } else {
          expect(result).toBe(true);
        }
      }
    );

    itProp.prop([fc.double({ min: -1e10, max: 1e10, noNaN: true })])(
      "[🎲] lt(n) generates inline `value >= n` check",
      (ltVal) => {
        const ctx = createGeneratorContext();
        const result = generateLtCheck("value", ltVal, ctx);

        // Must contain inline comparison
        expect(result.code).toContain(`value >= ${ltVal}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
      }
    );

    itProp.prop([fc.double({ min: -1e10, max: 1e10, noNaN: true })])(
      "[🎲] lte(n) generates inline `value > n` check",
      (lteVal) => {
        const ctx = createGeneratorContext();
        const result = generateLteCheck("value", lteVal, ctx);

        // Must contain inline comparison
        expect(result.code).toContain(`value > ${lteVal}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
      }
    );

    itProp.prop([fc.double({ min: -1e10, max: 1e10, noNaN: true })])(
      "[🎲] gt(n) generates inline `value <= n` check",
      (gtVal) => {
        const ctx = createGeneratorContext();
        const result = generateGtCheck("value", gtVal, ctx);

        // Must contain inline comparison
        expect(result.code).toContain(`value <= ${gtVal}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
      }
    );

    itProp.prop([fc.double({ min: -1e10, max: 1e10, noNaN: true })])(
      "[🎲] gte(n) generates inline `value < n` check",
      (gteVal) => {
        const ctx = createGeneratorContext();
        const result = generateGteCheck("value", gteVal, ctx);

        // Must contain inline comparison
        expect(result.code).toContain(`value < ${gteVal}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
      }
    );
  });

  // ============================================================================
  // Multiple constraints generate sequential inline checks
  // ============================================================================
  describe("Multiple constraints generate sequential checks", () => {
    itProp.prop([
      fc.double({ min: -100, max: 0, noNaN: true }),
      fc.double({ min: 0, max: 100, noNaN: true }),
    ])(
      "[🎲] multiple constraints generate all checks sequentially",
      (minVal, maxVal) => {
        // Ensure min <= max
        const actualMin = Math.min(minVal, maxVal);
        const actualMax = Math.max(minVal, maxVal);

        const ctx = createGeneratorContext();
        const result = generateNumberValidation("value", ctx, {
          min: { value: actualMin },
          max: { value: actualMax },
        });

        // Must have type check + min + max = 3 lines
        expect(result.code.length).toBe(3);

        // First line is type check
        expect(result.code[0]).toContain('typeof value !== "number"');
        expect(result.code[0]).toContain("Number.isNaN");

        // Second line is min (inline comparison, not function call)
        expect(result.code[1]).toContain(`value < ${actualMin}`);

        // Third line is max (inline comparison, not function call)
        expect(result.code[2]).toContain(`value > ${actualMax}`);

        // No external function calls in constraint checks
        expect(result.code[1]).not.toContain("externals");
        expect(result.code[2]).not.toContain("externals");
      }
    );

    itProp.prop([
      fc.double({ min: -100, max: 0, noNaN: true }),
      fc.double({ min: 0, max: 100, noNaN: true }),
      fc.double({ min: -150, max: 150, noNaN: true }),
    ])(
      "[🎲] combined constraints correctly validate numbers",
      (minVal, maxVal, testValue) => {
        // Ensure min <= max
        const actualMin = Math.min(minVal, maxVal);
        const actualMax = Math.max(minVal, maxVal);

        const ctx = createGeneratorContext();
        const result = generateNumberValidation("value", ctx, {
          min: { value: actualMin },
          max: { value: actualMax },
        });

        const code = result.code.join("\n") + "\nreturn true;";
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(testValue);

        // Validate behavior matches expected
        if (testValue < actualMin) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at least");
        } else if (testValue > actualMax) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at most");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Type check property
  // ============================================================================
  describe("Type check generation", () => {
    itProp.prop([fc.anything()])(
      "[🎲] type check correctly identifies non-numbers",
      (value) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateNumberTypeCheck("value", ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\nreturn true;`);

        const result = fn(value);
        if (typeof value === "number" && !Number.isNaN(value)) {
          expect(result).toBe(true);
        } else {
          expect(typeof result).toBe("string");
          expect(result).toContain("Expected number");
        }
      }
    );

    it("[🎲] type check rejects NaN", () => {
      const ctx = createGeneratorContext();
      const typeCheck = generateNumberTypeCheck("value", ctx);

      // eslint-disable-next-line no-new-func
      const fn = new Function("value", `${typeCheck.code}\nreturn true;`);

      const result = fn(NaN);
      expect(typeof result).toBe("string");
      expect(result).toContain("Expected number");
    });
  });

  // ============================================================================
  // Complex validation scenarios
  // ============================================================================
  describe("Complex validation scenarios", () => {
    itProp.prop([fc.integer({ min: -1000, max: 1000 })])(
      "[🎲] positive integer validation works correctly",
      (testValue) => {
        const ctx = createGeneratorContext();
        const result = generateNumberValidation("value", ctx, {
          positive: {},
          int: {},
        });

        const code = result.code.join("\n") + "\nreturn true;";
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(testValue);

        if (testValue <= 0) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("positive");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );

    itProp.prop([
      fc.integer({ min: 1, max: 10 }),
      fc.integer({ min: -100, max: 100 }),
    ])(
      "[🎲] multipleOf with positive constraint works correctly",
      (divisor, testValue) => {
        const ctx = createGeneratorContext();
        const result = generateNumberValidation("value", ctx, {
          positive: {},
          multipleOf: { value: divisor },
        });

        const code = result.code.join("\n") + "\nreturn true;";
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(testValue);

        if (testValue <= 0) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("positive");
        } else if (testValue % divisor !== 0) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("multiple");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );
  });
});
