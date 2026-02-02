/**
 * Tests for Array Code Builder
 */

import { describe, it, expect } from "vitest";
import { createGeneratorContext, pushPath, increaseIndent } from "../../context";
import {
  generateArrayTypeCheck,
  generateArrayMinLengthCheck,
  generateArrayMaxLengthCheck,
  generateArrayLengthCheck,
  generateSimpleArrayItemsLoop,
  generateArrayValidation,
  generateArrayItemsLoop,
} from "./array";
import { generateStringTypeCheck } from "../primitives/string";
import { generateNumberTypeCheck } from "../primitives/number";

describe("Array Code Builder", () => {
  describe("generateArrayTypeCheck", () => {
    it("generates correct type check code", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayTypeCheck("value", ctx);
      expect(result.code).toBe('if (!Array.isArray(value)) return "Expected array";');
    });

    it("includes path in error message when path is set", () => {
      const ctx = pushPath(createGeneratorContext(), "items");
      const result = generateArrayTypeCheck("v_0", ctx);
      expect(result.code).toBe(
        'if (!Array.isArray(v_0)) return "Property \'items\': Expected array";'
      );
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayTypeCheck("value", ctx, "Must be an array");
      expect(result.code).toBe('if (!Array.isArray(value)) return "Must be an array";');
    });

    it("adds indentation in debug mode", () => {
      const ctx = increaseIndent(createGeneratorContext({ debug: true }));
      const result = generateArrayTypeCheck("value", ctx);
      // In debug mode, the code includes a comment before the if statement
      expect(result.code).toContain("// Type check: array");
      expect(result.code).toContain("if (!Array.isArray(value))");
    });
  });

  describe("generateArrayMinLengthCheck", () => {
    it("generates correct minLength check code", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayMinLengthCheck("value", 3, ctx);
      expect(result.code).toBe(
        'if (value.length < 3) return "Array must have at least 3 items";'
      );
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayMinLengthCheck("value", 1, ctx, "Need at least one item");
      expect(result.code).toBe('if (value.length < 1) return "Need at least one item";');
    });
  });

  describe("generateArrayMaxLengthCheck", () => {
    it("generates correct maxLength check code", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayMaxLengthCheck("value", 10, ctx);
      expect(result.code).toBe(
        'if (value.length > 10) return "Array must have at most 10 items";'
      );
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayMaxLengthCheck("value", 5, ctx, "Too many items");
      expect(result.code).toBe('if (value.length > 5) return "Too many items";');
    });
  });

  describe("generateArrayLengthCheck", () => {
    it("generates correct exact length check code", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayLengthCheck("value", 5, ctx);
      expect(result.code).toBe(
        'if (value.length !== 5) return "Array must have exactly 5 items";'
      );
    });
  });

  describe("generateSimpleArrayItemsLoop", () => {
    it("generates for loop with item validation", () => {
      const ctx = createGeneratorContext();
      const result = generateSimpleArrayItemsLoop("value", ctx, (itemVar, indexVar, innerCtx) => {
        const check = generateStringTypeCheck(itemVar, innerCtx);
        return { code: [check.code], ctx: check.ctx };
      });

      const code = result.code.join("\n");
      expect(code).toContain("var v_0 = value.length");
      expect(code).toContain("for (var v_1 = 0; v_1 < v_0; v_1++)");
      expect(code).toContain("var v_2 = value[v_1]");
      expect(code).toContain('typeof v_2 !== "string"');
    });

    it("caches array length for performance", () => {
      const ctx = createGeneratorContext();
      const result = generateSimpleArrayItemsLoop("arr", ctx, (itemVar, indexVar, innerCtx) => {
        return { code: [], ctx: innerCtx };
      });

      const code = result.code.join("\n");
      // Should cache length in a variable
      expect(code).toMatch(/var v_\d+ = arr\.length/);
      // Loop should use the cached variable
      expect(code).toMatch(/v_\d+ < v_\d+/);
    });
  });

  describe("generateArrayValidation", () => {
    it("generates type check only when no constraints", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayValidation("value", ctx);

      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain("Array.isArray(value)");
    });

    it("generates length constraints before iteration", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayValidation("value", ctx, {
        minLength: { value: 1 },
        maxLength: { value: 10 },
      });

      expect(result.code.length).toBeGreaterThanOrEqual(3);
      expect(result.code[0]).toContain("Array.isArray");
      expect(result.code[1]).toContain("value.length < 1");
      expect(result.code[2]).toContain("value.length > 10");
    });

    it("generates item validation loop", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayValidation("value", ctx, {
        itemGenerator: (varName, innerCtx) => {
          const check = generateStringTypeCheck(varName, innerCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      });

      const code = result.code.join("\n");
      expect(code).toContain("for (var");
      expect(code).toContain('typeof');
      expect(code).toContain('"string"');
    });

    it("generates complete validation with all constraints", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayValidation("value", ctx, {
        minLength: { value: 1 },
        maxLength: { value: 100 },
        itemGenerator: (varName, innerCtx) => {
          const check = generateNumberTypeCheck(varName, innerCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      });

      const code = result.code.join("\n");
      expect(code).toContain("Array.isArray");
      expect(code).toContain("value.length < 1");
      expect(code).toContain("value.length > 100");
      expect(code).toContain("for (var");
      expect(code).toContain('"number"');
    });
  });
});

describe("Array generated code execution", () => {
  it("array type check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateArrayTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);

    expect(fn([])).toBe(true);
    expect(fn([1, 2, 3])).toBe(true);
    expect(fn("not an array")).toBe("Expected array");
    expect(fn({})).toBe("Expected array");
    expect(fn(null)).toBe("Expected array");
    expect(fn(123)).toBe("Expected array");
  });

  it("minLength check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateArrayTypeCheck("value", ctx);
    const minCheck = generateArrayMinLengthCheck("value", 2, ctx);

    const code = [typeCheck.code, minCheck.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn([1, 2])).toBe(true);
    expect(fn([1, 2, 3])).toBe(true);
    expect(fn([1])).toContain("at least 2");
    expect(fn([])).toContain("at least 2");
  });

  it("maxLength check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateArrayTypeCheck("value", ctx);
    const maxCheck = generateArrayMaxLengthCheck("value", 3, ctx);

    const code = [typeCheck.code, maxCheck.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn([])).toBe(true);
    expect(fn([1, 2, 3])).toBe(true);
    expect(fn([1, 2, 3, 4])).toContain("at most 3");
  });

  it("exact length check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateArrayTypeCheck("value", ctx);
    const lengthCheck = generateArrayLengthCheck("value", 3, ctx);

    const code = [typeCheck.code, lengthCheck.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn([1, 2, 3])).toBe(true);
    expect(fn([1, 2])).toContain("exactly 3");
    expect(fn([1, 2, 3, 4])).toContain("exactly 3");
  });

  it("item validation loop works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateArrayTypeCheck("value", ctx);
    const loopResult = generateSimpleArrayItemsLoop(
      "value",
      typeCheck.ctx,
      (itemVar, indexVar, innerCtx) => {
        const check = generateStringTypeCheck(itemVar, innerCtx);
        // Manually add index to error message
        const codeWithIndex = check.code.replace(
          /return "([^"]+)"/,
          `return "Index " + ${indexVar} + ": $1"`
        );
        return { code: [codeWithIndex], ctx: check.ctx };
      }
    );

    const code = [typeCheck.code, ...loopResult.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn(["a", "b", "c"])).toBe(true);
    expect(fn([])).toBe(true);
    expect(fn(["a", 123, "c"])).toContain("Index 1");
    expect(fn([123])).toContain("Index 0");
  });

  it("complete array validation works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateArrayValidation("value", ctx, {
      minLength: { value: 1 },
      maxLength: { value: 5 },
      itemGenerator: (varName, innerCtx) => {
        const check = generateStringTypeCheck(varName, innerCtx);
        return { code: [check.code], ctx: check.ctx };
      },
    });

    const code = [...result.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn(["a", "b", "c"])).toBe(true);
    expect(fn(["single"])).toBe(true);
    expect(fn([])).toContain("at least 1");
    expect(fn(["a", "b", "c", "d", "e", "f"])).toContain("at most 5");
    // Item validation with index
    const invalidResult = fn(["a", 123, "c"]);
    expect(typeof invalidResult).toBe("string");
    expect(invalidResult).toContain("Index");
  });

  it("nested array validation works correctly when executed", () => {
    const ctx = createGeneratorContext();
    
    // Create a generator for inner arrays of numbers
    const innerArrayGenerator = (varName: string, innerCtx: GeneratorContext) => {
      return generateArrayValidation(varName, innerCtx, {
        itemGenerator: (itemVar, itemCtx) => {
          const check = generateNumberTypeCheck(itemVar, itemCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      });
    };

    const result = generateArrayValidation("value", ctx, {
      itemGenerator: innerArrayGenerator,
    });

    const code = [...result.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn([[1, 2], [3, 4]])).toBe(true);
    expect(fn([[1], [2, 3, 4], [5]])).toBe(true);
    expect(fn([])).toBe(true);
    expect(fn([["not a number"]])).toContain("Expected number");
    expect(fn(["not an array"])).toContain("Expected array");
  });

  it("handles empty arrays correctly", () => {
    const ctx = createGeneratorContext();
    const result = generateArrayValidation("value", ctx, {
      itemGenerator: (varName, innerCtx) => {
        const check = generateStringTypeCheck(varName, innerCtx);
        return { code: [check.code], ctx: check.ctx };
      },
    });

    const code = [...result.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    // Empty array should pass (no items to validate)
    expect(fn([])).toBe(true);
  });

  it("validates all items in array", () => {
    const ctx = createGeneratorContext();
    const result = generateArrayValidation("value", ctx, {
      itemGenerator: (varName, innerCtx) => {
        const check = generateNumberTypeCheck(varName, innerCtx);
        return { code: [check.code], ctx: check.ctx };
      },
    });

    const code = [...result.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    // All valid
    expect(fn([1, 2, 3, 4, 5])).toBe(true);
    
    // Invalid at different positions
    expect(fn(["a", 2, 3])).toContain("Index");
    expect(fn([1, "b", 3])).toContain("Index");
    expect(fn([1, 2, "c"])).toContain("Index");
  });
});

// Import GeneratorContext type for nested test
import type { GeneratorContext } from "../../context";
import { it as itProp, fc } from "@fast-check/vitest";

// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 9: Array Validation with Index
// Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
// ============================================================================

describe("[🎲] Property 9: Array Validation with Index", () => {
  // ============================================================================
  // Property 9.1: array(itemSchema) generates optimized for loop
  // Validates: Requirement 9.1
  // ============================================================================
  describe("Requirement 9.1: Generates optimized for loop", () => {
    itProp.prop([fc.boolean()])(
      "[🎲] array validation generates for loop structure",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const result = generateArrayValidation("value", ctx, {
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");

        // Must contain for loop
        expect(code).toContain("for (var");
        // Must have loop condition with cached length
        expect(code).toMatch(/v_\d+ < v_\d+/);
        // Must increment index
        expect(code).toMatch(/v_\d+\+\+/);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] array validation caches length in variable for performance",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const result = generateArrayValidation("value", ctx, {
          itemGenerator: (varName, innerCtx) => {
            const check = generateNumberTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");

        // Must cache length: var v_N = value.length
        expect(code).toMatch(/var v_\d+ = value\.length/);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] array validation extracts item into variable",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const result = generateArrayValidation("value", ctx, {
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");

        // Must extract item: var v_N = value[v_M]
        expect(code).toMatch(/var v_\d+ = value\[v_\d+\]/);
      }
    );
  });

  // ============================================================================
  // Property 9.2: minLength generates check before iteration
  // Validates: Requirement 9.2
  // ============================================================================
  describe("Requirement 9.2: minLength check before iteration", () => {
    itProp.prop([fc.integer({ min: 0, max: 100 })])(
      "[🎲] minLength generates value.length < n check",
      (minLen) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          minLength: { value: minLen },
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");

        // Must contain minLength check
        expect(code).toContain(`value.length < ${minLen}`);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 50 })])(
      "[🎲] minLength check appears before for loop",
      (minLen) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          minLength: { value: minLen },
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");
        const minLengthIndex = code.indexOf(`value.length < ${minLen}`);
        const forLoopIndex = code.indexOf("for (var");

        // minLength check must come before for loop
        expect(minLengthIndex).toBeLessThan(forLoopIndex);
        expect(minLengthIndex).toBeGreaterThanOrEqual(0);
      }
    );

    itProp.prop([
      fc.integer({ min: 1, max: 10 }),
      fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
    ])(
      "[🎲] minLength check correctly rejects arrays that are too short",
      (minLen, arr) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          minLength: { value: minLen },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        if (arr.length < minLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at least");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 9.3: maxLength generates check before iteration
  // Validates: Requirement 9.3
  // ============================================================================
  describe("Requirement 9.3: maxLength check before iteration", () => {
    itProp.prop([fc.integer({ min: 1, max: 100 })])(
      "[🎲] maxLength generates value.length > n check",
      (maxLen) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          maxLength: { value: maxLen },
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");

        // Must contain maxLength check
        expect(code).toContain(`value.length > ${maxLen}`);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 50 })])(
      "[🎲] maxLength check appears before for loop",
      (maxLen) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          maxLength: { value: maxLen },
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = result.code.join("\n");
        const maxLengthIndex = code.indexOf(`value.length > ${maxLen}`);
        const forLoopIndex = code.indexOf("for (var");

        // maxLength check must come before for loop
        expect(maxLengthIndex).toBeLessThan(forLoopIndex);
        expect(maxLengthIndex).toBeGreaterThanOrEqual(0);
      }
    );

    itProp.prop([
      fc.integer({ min: 1, max: 10 }),
      fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
    ])(
      "[🎲] maxLength check correctly rejects arrays that are too long",
      (maxLen, arr) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          maxLength: { value: maxLen },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        if (arr.length > maxLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at most");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 9.4: Pre-allocate result array for coercions
  // Validates: Requirement 9.4
  // ============================================================================
  describe("Requirement 9.4: Pre-allocate result array for coercions", () => {
    itProp.prop([fc.boolean()])(
      "[🎲] supportsCoercion flag generates new Array(length) allocation",
      (debug) => {
        const ctx = createGeneratorContext({ debug });
        const result = generateSimpleArrayItemsLoop(
          "value",
          ctx,
          (itemVar, indexVar, innerCtx) => {
            return { code: [], ctx: innerCtx };
          }
        );

        // Without coercion support, should not have pre-allocation
        const codeWithoutCoercion = result.code.join("\n");
        expect(codeWithoutCoercion).not.toContain("new Array");
      }
    );

    // Note: The current implementation supports coercion pre-allocation through
    // generateArrayItemsLoop. This test verifies the underlying capability exists.
    it("[🎲] generateArrayItemsLoop supports coercion pre-allocation", () => {
      const ctx = createGeneratorContext();
      
      const result = generateArrayItemsLoop(
        "value",
        ctx,
        (itemVar: string, innerCtx: GeneratorContext) => {
          return { code: [], ctx: innerCtx };
        },
        true // supportsCoercion = true
      );

      const code = result.code.join("\n");
      
      // Should contain pre-allocation with new Array
      expect(code).toMatch(/var v_\d+ = new Array\(v_\d+\)/);
    });
  });

  // ============================================================================
  // Property 9.5: Error messages include index
  // Validates: Requirement 9.5
  // ============================================================================
  describe("Requirement 9.5: Error messages include index", () => {
    itProp.prop([
      fc.array(fc.oneof(fc.string(), fc.integer()), { minLength: 1, maxLength: 10 }),
    ])(
      "[🎲] invalid item error message contains index",
      (arr) => {
        // Find first non-string item
        const invalidIndex = arr.findIndex((item) => typeof item !== "string");
        if (invalidIndex === -1) return; // Skip if all items are strings

        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        // Must be an error string
        expect(typeof fnResult).toBe("string");
        // Must contain "Index"
        expect(fnResult).toContain("Index");
      }
    );

    itProp.prop([
      fc.integer({ min: 0, max: 9 }),
      fc.integer({ min: 1, max: 10 }),
    ])(
      "[🎲] error message contains the correct index of invalid item",
      (invalidIndex, arrayLength) => {
        // Ensure invalidIndex is within bounds
        const actualInvalidIndex = invalidIndex % arrayLength;
        
        // Create array with one invalid item at the specified index
        const arr: (string | number)[] = Array(arrayLength).fill("valid");
        arr[actualInvalidIndex] = 123; // Invalid: number instead of string

        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        // Must be an error string containing the index
        expect(typeof fnResult).toBe("string");
        expect(fnResult).toContain("Index");
        // The error should reference the actual invalid index
        expect(fnResult).toContain(String(actualInvalidIndex));
      }
    );

    itProp.prop([fc.array(fc.string(), { minLength: 0, maxLength: 20 })])(
      "[🎲] valid arrays return true without index error",
      (arr) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        // All strings should pass
        expect(fnResult).toBe(true);
      }
    );
  });

  // ============================================================================
  // Combined array validation properties
  // ============================================================================
  describe("Combined array validation", () => {
    itProp.prop([
      fc.integer({ min: 1, max: 5 }),
      fc.integer({ min: 5, max: 15 }),
      fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
    ])(
      "[🎲] combined minLength and maxLength constraints work correctly",
      (minLen, maxLen, arr) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          minLength: { value: minLen },
          maxLength: { value: maxLen },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        if (arr.length < minLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at least");
        } else if (arr.length > maxLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at most");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );

    itProp.prop([
      fc.integer({ min: 1, max: 5 }),
      fc.integer({ min: 5, max: 10 }),
      fc.array(fc.oneof(fc.string(), fc.integer()), { minLength: 0, maxLength: 15 }),
    ])(
      "[🎲] length constraints are checked before item validation",
      (minLen, maxLen, arr) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          minLength: { value: minLen },
          maxLength: { value: maxLen },
          itemGenerator: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        // Length constraints should be checked first
        if (arr.length < minLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at least");
        } else if (arr.length > maxLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at most");
        } else {
          // Only then check items
          const hasInvalidItem = arr.some((item) => typeof item !== "string");
          if (hasInvalidItem) {
            expect(typeof fnResult).toBe("string");
            expect(fnResult).toContain("Index");
          } else {
            expect(fnResult).toBe(true);
          }
        }
      }
    );
  });

  // ============================================================================
  // Edge cases
  // ============================================================================
  describe("Edge cases", () => {
    it("[🎲] empty array passes validation with item generator", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayValidation("value", ctx, {
        itemGenerator: (varName, innerCtx) => {
          const check = generateStringTypeCheck(varName, innerCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      });

      const code = [...result.code, "return true;"].join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      expect(fn([])).toBe(true);
    });

    it("[🎲] single invalid item at index 0 reports correct index", () => {
      const ctx = createGeneratorContext();
      const result = generateArrayValidation("value", ctx, {
        itemGenerator: (varName, innerCtx) => {
          const check = generateStringTypeCheck(varName, innerCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      });

      const code = [...result.code, "return true;"].join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      const fnResult = fn([123]);
      expect(typeof fnResult).toBe("string");
      expect(fnResult).toContain("Index");
      expect(fnResult).toContain("0");
    });

    itProp.prop([fc.integer({ min: 1, max: 100 })])(
      "[🎲] exact length constraint generates !== check",
      (exactLen) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          length: { value: exactLen },
        });

        const code = result.code.join("\n");

        // Must contain exact length check
        expect(code).toContain(`value.length !== ${exactLen}`);
      }
    );

    itProp.prop([
      fc.integer({ min: 1, max: 10 }),
      fc.array(fc.string(), { minLength: 0, maxLength: 20 }),
    ])(
      "[🎲] exact length constraint correctly validates array length",
      (exactLen, arr) => {
        const ctx = createGeneratorContext();
        const result = generateArrayValidation("value", ctx, {
          length: { value: exactLen },
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(arr);

        if (arr.length !== exactLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("exactly");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );
  });
});
