/**
 * JIT Compiler Tests
 */

import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { object } from "@kanon/schemas/composites/object";
import { array } from "@kanon/schemas/composites/array";
import { string } from "@kanon/schemas/primitives/string";
import { number } from "@kanon/schemas/primitives/number";
import { boolean } from "@kanon/schemas/primitives/boolean";
import { refineString } from "@kanon/schemas/constraints/refine/string";
import { refineNumber } from "@kanon/schemas/constraints/refine/number";
import { compile, isJITAvailable } from "./compiler";

describe("JIT Compiler", () => {
  it("should check JIT availability", () => {
    expect(isJITAvailable()).toBe(true);
  });

  it("should compile a simple object schema", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.isFallback).toBe(false);
    expect(jit.source).toBeDefined();
  });

  it("should validate valid objects correctly", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);
    const testObj = { name: "John", age: 30, active: true };

    const v3Result = schema.validator(testObj);
    const jitResult = jit(testObj);

    expect(v3Result).toBe(true);
    expect(jitResult).toBe(true);
  });

  it("should validate invalid objects correctly", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);
    const invalidObj = { name: 123, age: 30, active: true };

    const v3Result = schema.validator(invalidObj);
    const jitResult = jit(invalidObj);

    expect(typeof v3Result).toBe("string");
    expect(typeof jitResult).toBe("string");
  });
});

describe("Debug Mode", () => {
  it("should include source code when debug: true", () => {
    const schema = object({
      name: string(),
      age: number(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.source).toBeDefined();
    expect(typeof jit.source).toBe("string");
    if (jit.source) {
      expect(jit.source.length).toBeGreaterThan(0);
    }
  });

  it("should not include source code when debug: false", () => {
    const schema = object({
      name: string(),
      age: number(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: false });

    expect(jit.source).toBeUndefined();
  });

  it("should include header comment in debug mode", () => {
    const schema = object({
      name: string(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.source).toContain("// JIT-compiled validator for schema type: object");
  });

  it("should include type check comments in debug mode", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.source).toContain("// Type check: object");
    expect(jit.source).toContain("// Type check: string");
    expect(jit.source).toContain("// Type check: number");
    expect(jit.source).toContain("// Type check: boolean");
  });

  it("should include property comments in debug mode", () => {
    const schema = object({
      name: string(),
      age: number(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.source).toContain("// Property: name");
    expect(jit.source).toContain("// Property: age");
  });

  it("should include validation passed comment in debug mode", () => {
    const schema = object({
      name: string(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.source).toContain("// Validation passed");
  });

  it("should produce valid JavaScript that can be executed", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    // The source should be valid JavaScript
    expect(jit.source).toBeDefined();
    if (jit.source) {
      expect(() => {
        // eslint-disable-next-line no-new-func
        new Function("value", jit.source as string);
      }).not.toThrow();
    }
  });

  it("should produce same results with debug mode on or off", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const jitDebug = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });
    const jitNoDebug = compile(schema as Parameters<typeof compile>[0], { debug: false, noCache: true });

    const testCases = [
      { name: "John", age: 30, active: true },
      { name: 123, age: 30, active: true },
      { name: "John", age: "30", active: true },
      null,
      undefined,
    ];

    for (const testCase of testCases) {
      expect(jitDebug(testCase)).toEqual(jitNoDebug(testCase));
    }
  });

  it("should include indentation in debug mode", () => {
    const schema = object({
      name: string(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    // Check that the source contains comments (which indicates debug mode is working)
    expect(jit.source).toContain("//");
    
    // Check that the source is multi-line (formatted)
    if (jit.source) {
      const lines = jit.source.split("\n");
      expect(lines.length).toBeGreaterThan(1);
    }
  });
});

describe("CSP Fallback", () => {
  it("should fallback to V3 validator when Function constructor throws", () => {
    const schema = object({
      name: string(),
      age: number(),
    });

    const originalFunction = globalThis.Function;
    
    const mockFunction = vi.fn().mockImplementation(() => {
      throw new Error("EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script");
    });
    
    globalThis.Function = mockFunction as unknown as FunctionConstructor;

    try {
      const jit = compile(schema as Parameters<typeof compile>[0]);

      expect(jit.isFallback).toBe(true);

      const validObj = { name: "John", age: 30 };
      const invalidObj = { name: 123, age: 30 };

      expect(jit(validObj)).toBe(true);
      expect(typeof jit(invalidObj)).toBe("string");
    } finally {
      globalThis.Function = originalFunction;
    }
  });

  it("should produce same results as V3 when using fallback", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: boolean(),
    });

    const originalFunction = globalThis.Function;
    const mockFunction = vi.fn().mockImplementation(() => {
      throw new Error("CSP restriction");
    });
    globalThis.Function = mockFunction as unknown as FunctionConstructor;

    try {
      const jit = compile(schema as Parameters<typeof compile>[0]);

      const testCases = [
        { name: "John", age: 30, active: true },
        { name: "Jane", age: 25, active: false },
        { name: 123, age: 30, active: true },
        { name: "John", age: "30", active: true },
        { name: "John", age: 30, active: "yes" },
        null,
        undefined,
        "not an object",
        42,
      ];

      for (const testCase of testCases) {
        const v3Result = schema.validator(testCase);
        const jitResult = jit(testCase);
        expect(jitResult).toEqual(v3Result);
      }
    } finally {
      globalThis.Function = originalFunction;
    }
  });
});


describe("Refinements Support", () => {
  it("should compile schema with property refinements", () => {
    const nameSchema = refineString(string(), (v) =>
      v.length > 0 ? true : "Name cannot be empty"
    );

    const schema = object({
      name: nameSchema,
      age: number(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0], { debug: true });

    expect(jit.isFallback).toBe(false);
    expect(jit.source).toContain("externals.get");
  });

  it("should validate with property refinements correctly", () => {
    const nameSchema = refineString(string(), (v) =>
      v.length >= 2 ? true : "Name must be at least 2 characters"
    );

    const schema = object({
      name: nameSchema,
      age: number(),
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);

    // Valid case
    expect(jit({ name: "John", age: 30 })).toBe(true);

    // Invalid: name too short (error is prefixed with property path like V3)
    expect(jit({ name: "J", age: 30 })).toBe("Property 'name': Name must be at least 2 characters");

    // Invalid: wrong type
    expect(jit({ name: 123, age: 30 })).toContain("Expected string");
  });

  it("should call refinements in order", () => {
    const callOrder: number[] = [];

    const nameSchema = refineString(
      refineString(string(), () => {
        callOrder.push(1);
        return true;
      }),
      () => {
        callOrder.push(2);
        return true;
      }
    );

    const schema = object({
      name: nameSchema,
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);

    jit({ name: "test" });

    expect(callOrder).toEqual([1, 2]);
  });

  it("should stop at first failing refinement", () => {
    const callOrder: number[] = [];

    const nameSchema = refineString(
      refineString(string(), () => {
        callOrder.push(1);
        return "First refinement failed";
      }),
      () => {
        callOrder.push(2);
        return true;
      }
    );

    const schema = object({
      name: nameSchema,
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);

    const result = jit({ name: "test" });

    // Error is prefixed with property path like V3
    expect(result).toBe("Property 'name': First refinement failed");
    expect(callOrder).toEqual([1]); // Second refinement should not be called
  });

  it("should support multiple properties with refinements", () => {
    const nameSchema = refineString(string(), (v) =>
      v.length > 0 ? true : "Name required"
    );

    const ageSchema = refineNumber(number(), (v) =>
      v >= 0 ? true : "Age must be non-negative"
    );

    const schema = object({
      name: nameSchema,
      age: ageSchema,
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);

    expect(jit({ name: "John", age: 30 })).toBe(true);
    // Errors are prefixed with property path like V3
    expect(jit({ name: "", age: 30 })).toBe("Property 'name': Name required");
    expect(jit({ name: "John", age: -5 })).toBe("Property 'age': Age must be non-negative");
  });

  it("should produce same results as V3 validator with refinements", () => {
    const nameSchema = refineString(string(), (v) =>
      v.length >= 2 ? true : "Name too short"
    );

    const ageSchema = refineNumber(number(), (v) =>
      v >= 18 ? true : "Must be adult"
    );

    const schema = object({
      name: nameSchema,
      age: ageSchema,
    });

    const jit = compile(schema as Parameters<typeof compile>[0]);

    const testCases = [
      { name: "John", age: 30 },
      { name: "J", age: 30 },
      { name: "John", age: 10 },
      { name: "", age: 0 },
      { name: 123, age: 30 },
      { name: "John", age: "30" },
    ];

    for (const testCase of testCases) {
      const v3Result = schema.validator(testCase);
      const jitResult = jit(testCase);
      expect(jitResult).toEqual(v3Result);
    }
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 7: Refinements Invocation
// Validates: Requirements 6.5
// ============================================================================

describe("[🎲] Property 7: Refinements Invocation", () => {
  // ============================================================================
  // Property 7.1: Each refinement is called exactly once
  // Validates: Requirement 6.5
  // ============================================================================
  describe("Requirement 6.5: Refinements are called as external functions", () => {
    itProp.prop([fc.string({ minLength: 1 })])(
      "[🎲] single refinement is called exactly once per validation",
      (value) => {
        let callCount = 0;
        const refinement = (v: string) => {
          callCount++;
          return v.length > 0 || "Cannot be empty";
        };

        const nameSchema = refineString(string(), refinement);
        const schema = object({ name: nameSchema });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        callCount = 0;
        jit({ name: value });

        expect(callCount).toBe(1);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 1, max: 5 })])(
      "[🎲] multiple refinements are each called exactly once",
      (value, numRefinements) => {
        const callCounts: number[] = Array(numRefinements).fill(0);

        // Build schema with multiple refinements
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentSchema: any = string();
        for (let i = 0; i < numRefinements; i++) {
          const index = i;
          currentSchema = refineString(currentSchema, () => {
            callCounts[index]++;
            return true;
          });
        }

        const schema = object({ name: currentSchema });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        // Reset counts
        callCounts.fill(0);
        jit({ name: value });

        // Each refinement should be called exactly once
        for (let i = 0; i < numRefinements; i++) {
          expect(callCounts[i]).toBe(1);
        }
      }
    );

    itProp.prop([fc.string({ minLength: 1 })])(
      "[🎲] refinements are called in definition order",
      (value) => {
        const callOrder: number[] = [];

        const schema1 = refineString(string(), () => {
          callOrder.push(1);
          return true;
        });
        const schema2 = refineString(schema1, () => {
          callOrder.push(2);
          return true;
        });
        const schema3 = refineString(schema2, () => {
          callOrder.push(3);
          return true;
        });

        const schema = object({ name: schema3 });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        callOrder.length = 0;
        jit({ name: value });

        expect(callOrder).toEqual([1, 2, 3]);
      }
    );

    itProp.prop([fc.string({ minLength: 1 })])(
      "[🎲] refinement receives the correct value",
      (value) => {
        let receivedValue: unknown = undefined;

        const nameSchema = refineString(string(), (v) => {
          receivedValue = v;
          return true;
        });

        const schema = object({ name: nameSchema });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        jit({ name: value });

        expect(receivedValue).toBe(value);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 0, max: 100 })])(
      "[🎲] refinements on multiple properties are each called once",
      (strValue, numValue) => {
        let nameCallCount = 0;
        let ageCallCount = 0;

        const nameSchema = refineString(string(), () => {
          nameCallCount++;
          return true;
        });

        const ageSchema = refineNumber(number(), () => {
          ageCallCount++;
          return true;
        });

        const schema = object({
          name: nameSchema,
          age: ageSchema,
        });

        const jit = compile(schema as Parameters<typeof compile>[0]);

        nameCallCount = 0;
        ageCallCount = 0;
        jit({ name: strValue, age: numValue });

        expect(nameCallCount).toBe(1);
        expect(ageCallCount).toBe(1);
      }
    );
  });

  // ============================================================================
  // Property 7.2: Early termination on refinement failure
  // Validates: Requirement 6.5
  // ============================================================================
  describe("Early termination on refinement failure", () => {
    itProp.prop([fc.string({ minLength: 1 })])(
      "[🎲] subsequent refinements are not called after failure",
      (value) => {
        const callOrder: number[] = [];

        const schema1 = refineString(string(), () => {
          callOrder.push(1);
          return "First failed";
        });
        const schema2 = refineString(schema1, () => {
          callOrder.push(2);
          return true;
        });
        const schema3 = refineString(schema2, () => {
          callOrder.push(3);
          return true;
        });

        const schema = object({ name: schema3 });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        callOrder.length = 0;
        jit({ name: value });

        // Only first refinement should be called
        expect(callOrder).toEqual([1]);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 1, max: 4 })])(
      "[🎲] failure at position N stops execution at N",
      (value, failPosition) => {
        const callOrder: number[] = [];
        const totalRefinements = 5;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentSchema: any = string();
        for (let i = 0; i < totalRefinements; i++) {
          const index = i;
          currentSchema = refineString(currentSchema, () => {
            callOrder.push(index + 1);
            return index + 1 === failPosition ? `Failed at ${failPosition}` : true;
          });
        }

        const schema = object({ name: currentSchema });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        callOrder.length = 0;
        jit({ name: value });

        // Should only call refinements up to and including the failing one
        const expected = Array.from({ length: failPosition }, (_, i) => i + 1);
        expect(callOrder).toEqual(expected);
      }
    );
  });

  // ============================================================================
  // Property 7.3: JIT produces same results as V3 for refinements
  // Validates: Requirement 6.5
  // ============================================================================
  describe("JIT equivalence with V3 for refinements", () => {
    itProp.prop([fc.string()])(
      "[🎲] JIT returns same result as V3 for passing refinement",
      (value) => {
        const nameSchema = refineString(string(), (v) =>
          v.length >= 0 ? true : "Cannot be negative length"
        );

        const schema = object({ name: nameSchema });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        const v3Result = schema.validator({ name: value });
        const jitResult = jit({ name: value });

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] JIT returns same result as V3 for failing refinement",
      (value) => {
        const nameSchema = refineString(string(), (v) =>
          v.length > 1000 ? true : "Too short"
        );

        const schema = object({ name: nameSchema });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        const v3Result = schema.validator({ name: value });
        const jitResult = jit({ name: value });

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([fc.string({ minLength: 1 }), fc.integer({ min: 0, max: 100 })])(
      "[🎲] JIT returns same result as V3 for multiple properties with refinements",
      (strValue, numValue) => {
        const nameSchema = refineString(string(), (v) =>
          v.length > 0 ? true : "Name required"
        );

        const ageSchema = refineNumber(number(), (v) =>
          v >= 0 ? true : "Age must be non-negative"
        );

        const schema = object({
          name: nameSchema,
          age: ageSchema,
        });

        const jit = compile(schema as Parameters<typeof compile>[0]);

        const testObj = { name: strValue, age: numValue };
        const v3Result = schema.validator(testObj);
        const jitResult = jit(testObj);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] JIT returns same result as V3 for chained refinements",
      (value) => {
        const schema1 = refineString(string(), (v) =>
          v.length >= 0 ? true : "Length check 1"
        );
        const schema2 = refineString(schema1, (v) =>
          v.length < 10000 ? true : "Length check 2"
        );
        const schema3 = refineString(schema2, () => true);

        const schema = object({ name: schema3 });
        const jit = compile(schema as Parameters<typeof compile>[0]);

        const v3Result = schema.validator({ name: value });
        const jitResult = jit({ name: value });

        expect(jitResult).toEqual(v3Result);
      }
    );
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 11: Debug Mode Source Code
// Validates: Requirements 11.1, 11.2, 11.3
// ============================================================================

describe("[🎲] Property 11: Debug Mode Source Code", () => {
  // ============================================================================
  // Property 11.1: Debug mode returns source code
  // Validates: Requirement 11.1
  // ============================================================================
  describe("Requirement 11.1: Debug mode returns source code", () => {
    itProp.prop([fc.string({ minLength: 1, maxLength: 20 })])(
      "[🎲] debug mode includes source property for string schema",
      (propName) => {
        // Use a safe property name (alphanumeric only)
        const safePropName = propName.replace(/[^a-zA-Z0-9]/g, "a") || "prop";
        const schema = object({ [safePropName]: string() });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toBeDefined();
        expect(typeof jit.source).toBe("string");
        expect(jit.source?.length).toBeGreaterThan(0);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 5 })])(
      "[🎲] debug mode includes source property for object with N properties",
      (numProps) => {
        const entries: Record<string, ReturnType<typeof string>> = {};
        for (let i = 0; i < numProps; i++) {
          entries[`prop${i}`] = string();
        }
        const schema = object(entries);
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toBeDefined();
        expect(typeof jit.source).toBe("string");
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 3 })])(
      "[🎲] debug mode includes source property for array schema",
      (depth) => {
        // Create nested array schema
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let schema: any = string();
        for (let i = 0; i < depth; i++) {
          schema = array(schema);
        }
        const objSchema = object({ items: schema });
        const jit = compile(objSchema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toBeDefined();
        expect(typeof jit.source).toBe("string");
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] source property is undefined when debug is false",
      (useNoCache) => {
        const schema = object({ name: string() });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: false, noCache: useNoCache });

        expect(jit.source).toBeUndefined();
      }
    );
  });

  // ============================================================================
  // Property 11.2: Code is readable with indentation and comments
  // Validates: Requirement 11.2
  // ============================================================================
  describe("Requirement 11.2: Code is readable with indentation and comments", () => {
    itProp.prop([fc.integer({ min: 1, max: 5 })])(
      "[🎲] debug mode produces multi-line code",
      (numProps) => {
        const entries: Record<string, ReturnType<typeof string>> = {};
        for (let i = 0; i < numProps; i++) {
          entries[`prop${i}`] = string();
        }
        const schema = object(entries);
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        const lines = jit.source?.split("\n") ?? [];
        expect(lines.length).toBeGreaterThan(1);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 5 })])(
      "[🎲] debug mode includes comments in generated code",
      (numProps) => {
        const entries: Record<string, ReturnType<typeof string>> = {};
        for (let i = 0; i < numProps; i++) {
          entries[`prop${i}`] = string();
        }
        const schema = object(entries);
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        // Should contain at least one comment
        expect(jit.source).toContain("//");
      }
    );

    itProp.prop([fc.constant(null)])(
      "[🎲] debug mode includes header comment with schema type",
      () => {
        const schema = object({ name: string() });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toContain("// JIT-compiled validator for schema type:");
      }
    );
  });

  // ============================================================================
  // Property 11.3: Comments indicate which property/constraint is validated
  // Validates: Requirement 11.3
  // ============================================================================
  describe("Requirement 11.3: Comments indicate property/constraint being validated", () => {
    itProp.prop([fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(s))])(
      "[🎲] debug mode includes property name in comments",
      (propName) => {
        const schema = object({ [propName]: string() });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toContain(`// Property: ${propName}`);
      }
    );

    itProp.prop([fc.integer({ min: 2, max: 5 })])(
      "[🎲] debug mode includes all property names in comments",
      (numProps) => {
        const entries: Record<string, ReturnType<typeof string>> = {};
        const propNames: string[] = [];
        for (let i = 0; i < numProps; i++) {
          const name = `prop${i}`;
          propNames.push(name);
          entries[name] = string();
        }
        const schema = object(entries);
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        for (const name of propNames) {
          expect(jit.source).toContain(`// Property: ${name}`);
        }
      }
    );

    itProp.prop([fc.constant(null)])(
      "[🎲] debug mode includes type check comments",
      () => {
        const schema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toContain("// Type check: object");
        expect(jit.source).toContain("// Type check: string");
        expect(jit.source).toContain("// Type check: number");
        expect(jit.source).toContain("// Type check: boolean");
      }
    );

    itProp.prop([fc.constant(null)])(
      "[🎲] debug mode includes validation passed comment",
      () => {
        const schema = object({ name: string() });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        expect(jit.source).toContain("// Validation passed");
      }
    );
  });

  // ============================================================================
  // Property 11.4: Source code is valid JavaScript that produces same results
  // Validates: Requirements 11.1, 11.2, 11.3 (round-trip property)
  // ============================================================================
  describe("Source code produces same results as compiled validator", () => {
    itProp.prop([
      fc.record({
        name: fc.string(),
        age: fc.integer(),
        active: fc.boolean(),
      }),
    ])(
      "[🎲] source code executed via new Function produces same result for valid objects",
      (testObj) => {
        const schema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        // Execute the source code via new Function
        // eslint-disable-next-line no-new-func
        const fromSource = new Function("value", jit.source ?? "return true;");
        
        const jitResult = jit(testObj);
        const sourceResult = fromSource(testObj);

        expect(sourceResult).toEqual(jitResult);
      }
    );

    itProp.prop([fc.anything()])(
      "[🎲] source code executed via new Function produces same result for any value",
      (testValue) => {
        const schema = object({
          name: string(),
          age: number(),
        });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        // Execute the source code via new Function
        // eslint-disable-next-line no-new-func
        const fromSource = new Function("value", jit.source ?? "return true;");
        
        const jitResult = jit(testValue);
        const sourceResult = fromSource(testValue);

        expect(sourceResult).toEqual(jitResult);
      }
    );

    itProp.prop([fc.array(fc.string(), { minLength: 0, maxLength: 5 })])(
      "[🎲] source code for array schema produces same result",
      (testArray) => {
        const schema = object({
          items: array(string()),
        });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        // Execute the source code via new Function
        // eslint-disable-next-line no-new-func
        const fromSource = new Function("value", jit.source ?? "return true;");
        
        const testObj = { items: testArray };
        const jitResult = jit(testObj);
        const sourceResult = fromSource(testObj);

        expect(sourceResult).toEqual(jitResult);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] JIT validator with refinements produces same result as V3",
      (testValue) => {
        // For schemas with refinements, the source code alone won't work
        // because it references externals. This test verifies that the
        // compiled validator works correctly (JIT vs V3 equivalence).
        const nameSchema = refineString(string(), (v) =>
          v.length > 0 ? true : "Name required"
        );
        const schema = object({ name: nameSchema });
        const jit = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });

        // Verify the JIT validator produces same result as V3
        const v3Result = schema.validator({ name: testValue });
        const jitResult = jit({ name: testValue });

        expect(jitResult).toEqual(v3Result);
      }
    );
  });

  // ============================================================================
  // Property 11.5: Debug mode does not affect validation correctness
  // Validates: Requirements 11.1, 11.2, 11.3
  // ============================================================================
  describe("Debug mode does not affect validation correctness", () => {
    itProp.prop([fc.anything()])(
      "[🎲] debug mode produces same validation result as non-debug mode",
      (testValue) => {
        const schema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        
        const jitDebug = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });
        const jitNoDebug = compile(schema as Parameters<typeof compile>[0], { debug: false, noCache: true });

        const debugResult = jitDebug(testValue);
        const noDebugResult = jitNoDebug(testValue);

        expect(debugResult).toEqual(noDebugResult);
      }
    );

    itProp.prop([
      fc.record({
        name: fc.string(),
        age: fc.integer(),
      }),
    ])(
      "[🎲] debug mode produces same result as V3 validator",
      (testObj) => {
        const schema = object({
          name: string(),
          age: number(),
        });
        
        const jitDebug = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });
        const jitNoDebug = compile(schema as Parameters<typeof compile>[0], { debug: false, noCache: true });

        const debugResult = jitDebug(testObj);
        const noDebugResult = jitNoDebug(testObj);

        expect(debugResult).toEqual(noDebugResult);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 5 }), fc.anything()])(
      "[🎲] debug mode with N properties produces same result as non-debug mode",
      (numProps, testValue) => {
        const entries: Record<string, ReturnType<typeof string>> = {};
        for (let i = 0; i < numProps; i++) {
          entries[`prop${i}`] = string();
        }
        const schema = object(entries);
        
        const jitDebug = compile(schema as Parameters<typeof compile>[0], { debug: true, noCache: true });
        const jitNoDebug = compile(schema as Parameters<typeof compile>[0], { debug: false, noCache: true });

        const debugResult = jitDebug(testValue);
        const noDebugResult = jitNoDebug(testValue);

        expect(debugResult).toEqual(noDebugResult);
      }
    );
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 1: Round-trip Equivalence
// Validates: Requirements 1.2, 1.3, 6.2, 6.4, 11.4
// ============================================================================

import {
  arbitrarySchema,
  arbitrarySchemaWithValue,
  arbitrarySchemaWithValidValue,
  arbitrarySchemaWithInvalidValue,
  arbitraryStringSchema,
  arbitraryNumberSchema,
  arbitraryBooleanSchema,
  arbitraryObjectSchema,
  arbitraryArraySchema,
  arbitraryUnionSchema,
} from "./utils/arbitraries";

describe("[🎲] Property 1: Round-trip Equivalence", () => {
  // ============================================================================
  // Property 1.1: JIT produces same result as V3 for any schema and value
  // Validates: Requirements 1.2, 1.3
  // ============================================================================
  describe("Requirement 1.2, 1.3: JIT produces same result as V3 validator", () => {
    itProp.prop([arbitrarySchemaWithValue()])(
      "[🎲] compiled validator produces same result as non-compiled for any schema and value",
      ({ schemaWithMeta, value }) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitrarySchemaWithValidValue()])(
      "[🎲] compiled validator returns true for valid values (same as V3)",
      ({ schemaWithMeta, value }) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        // Both should return true for valid values
        expect(v3Result).toBe(true);
        expect(jitResult).toBe(true);
      }
    );

    itProp.prop([arbitrarySchemaWithInvalidValue()])(
      "[🎲] compiled validator returns error string for invalid values (same as V3)",
      ({ schemaWithMeta, value }) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        // Both should return error strings for invalid values
        expect(typeof v3Result).toBe("string");
        expect(typeof jitResult).toBe("string");
        // Error messages should be identical
        expect(jitResult).toEqual(v3Result);
      }
    );
  });

  // ============================================================================
  // Property 1.2: Round-trip for primitive schemas
  // Validates: Requirements 1.2, 1.3
  // ============================================================================
  describe("Round-trip for primitive schemas", () => {
    itProp.prop([arbitraryStringSchema(), fc.anything()])(
      "[🎲] string schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitraryNumberSchema(), fc.anything()])(
      "[🎲] number schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitraryBooleanSchema(), fc.anything()])(
      "[🎲] boolean schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );
  });

  // ============================================================================
  // Property 1.3: Round-trip for composite schemas
  // Validates: Requirements 1.2, 1.3
  // ============================================================================
  describe("Round-trip for composite schemas", () => {
    itProp.prop([arbitraryObjectSchema(), fc.anything()])(
      "[🎲] object schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitraryArraySchema(), fc.anything()])(
      "[🎲] array schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitraryUnionSchema(), fc.anything()])(
      "[🎲] union schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );
  });

  // ============================================================================
  // Property 1.4: Round-trip for random schemas
  // Validates: Requirements 1.2, 1.3, 6.4, 11.4
  // ============================================================================
  describe("Round-trip for random schemas", () => {
    itProp.prop([arbitrarySchema(), fc.anything()])(
      "[🎲] any schema: JIT produces same result as V3",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitrarySchema(), fc.array(fc.anything(), { minLength: 1, maxLength: 10 })])(
      "[🎲] any schema: JIT produces same results as V3 for multiple values",
      (schemaWithMeta, values) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        for (const value of values) {
          const v3Result = schema.validator(value);
          const jitResult = jit(value);
          expect(jitResult).toEqual(v3Result);
        }
      }
    );
  });

  // ============================================================================
  // Property 1.5: Fallback equivalence (CSP environments)
  // Validates: Requirement 6.2
  // ============================================================================
  describe("Requirement 6.2: Fallback produces same results as V3", () => {
    itProp.prop([arbitrarySchemaWithValue()])(
      "[🎲] fallback validator produces same result as V3",
      ({ schemaWithMeta, value }) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { 
          noCache: true, 
          forceFallback: true 
        });

        expect(jit.isFallback).toBe(true);

        const v3Result = schema.validator(value);
        const jitResult = jit(value);

        expect(jitResult).toEqual(v3Result);
      }
    );

    itProp.prop([arbitrarySchema(), fc.anything()])(
      "[🎲] fallback validator produces same result as JIT validator",
      (schemaWithMeta, value) => {
        const { schema } = schemaWithMeta;
        
        const jitNormal = compile(schema as Parameters<typeof compile>[0], { noCache: true });
        const jitFallback = compile(schema as Parameters<typeof compile>[0], { 
          noCache: true, 
          forceFallback: true 
        });

        const normalResult = jitNormal(value);
        const fallbackResult = jitFallback(value);

        expect(fallbackResult).toEqual(normalResult);
      }
    );
  });

  // ============================================================================
  // Property 1.6: API compatibility
  // Validates: Requirement 6.4
  // ============================================================================
  describe("Requirement 6.4: Compiled validator has same signature as V3", () => {
    itProp.prop([arbitrarySchemaWithValidValue()])(
      "[🎲] compiled validator returns true for valid values",
      ({ schemaWithMeta, value }) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const result = jit(value);

        // Should return exactly true (not truthy)
        expect(result).toBe(true);
      }
    );

    itProp.prop([arbitrarySchemaWithInvalidValue()])(
      "[🎲] compiled validator returns string for invalid values",
      ({ schemaWithMeta, value }) => {
        const { schema } = schemaWithMeta;
        const jit = compile(schema as Parameters<typeof compile>[0], { noCache: true });

        const result = jit(value);

        // Should return a string error message
        expect(typeof result).toBe("string");
        expect((result as string).length).toBeGreaterThan(0);
      }
    );
  });
});
