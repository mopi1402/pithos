/**
 * Tests for Object Code Builder
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { createGeneratorContext, pushPath, increaseIndent } from "../../context";
import {
  generateObjectTypeCheck,
  generatePropertyValidation,
  generateStrictModeCheck,
  generateMinKeysCheck,
  generateMaxKeysCheck,
  generateObjectValidation,
  createNestedObjectGenerator,
} from "./object";
import { generateStringTypeCheck } from "../primitives/string";
import { generateNumberTypeCheck } from "../primitives/number";

describe("Object Code Builder", () => {
  describe("generateObjectTypeCheck", () => {
    it("generates correct type check code", () => {
      const ctx = createGeneratorContext();
      const result = generateObjectTypeCheck("value", ctx);
      expect(result.code).toBe(
        'if (typeof value !== "object" || value === null) return "Expected object";'
      );
    });

    it("includes path in error message when path is set", () => {
      const ctx = pushPath(createGeneratorContext(), "user");
      const result = generateObjectTypeCheck("v_0", ctx);
      expect(result.code).toBe(
        'if (typeof v_0 !== "object" || v_0 === null) return "Property \'user\': Expected object";'
      );
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateObjectTypeCheck("value", ctx, "Must be an object");
      expect(result.code).toBe(
        'if (typeof value !== "object" || value === null) return "Must be an object";'
      );
    });

    it("adds indentation in debug mode", () => {
      const ctx = increaseIndent(createGeneratorContext({ debug: true }));
      const result = generateObjectTypeCheck("value", ctx);
      // In debug mode, the code includes a comment before the if statement
      expect(result.code).toContain("// Type check: object");
      expect(result.code).toContain("if (typeof value !==");
    });
  });

  describe("generatePropertyValidation", () => {
    it("generates required property validation", () => {
      const ctx = createGeneratorContext();
      const result = generatePropertyValidation("value", { name: "age", optional: false }, ctx);

      // Required property without generateCode just extracts the value
      expect(result.code.length).toBeGreaterThanOrEqual(1);
      expect(result.code[0]).toContain('var v_0 = value["age"]');
    });

    it("generates optional property validation with undefined check", () => {
      const ctx = createGeneratorContext();
      const result = generatePropertyValidation(
        "value",
        {
          name: "nickname",
          optional: true,
          generateCode: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
        ctx
      );

      expect(result.code.some((line) => line.includes("!== undefined"))).toBe(true);
    });

    it("generates property validation with type check", () => {
      const ctx = createGeneratorContext();
      const result = generatePropertyValidation(
        "value",
        {
          name: "name",
          optional: false,
          generateCode: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
        ctx
      );

      expect(result.code.some((line) => line.includes('typeof v_0 !== "string"'))).toBe(true);
    });

    it("escapes property names with special characters", () => {
      const ctx = createGeneratorContext();
      const result = generatePropertyValidation(
        "value",
        { name: 'prop"with"quotes', optional: false },
        ctx
      );

      expect(result.code[0]).toContain('prop\\"with\\"quotes');
    });
  });

  describe("generateStrictModeCheck", () => {
    it("generates strict mode check with allowed keys", () => {
      const ctx = createGeneratorContext();
      const result = generateStrictModeCheck("value", ["name", "age"], ctx);

      expect(result.code.join("\n")).toContain("for (var");
      expect(result.code.join("\n")).toContain("hasOwnProperty");
      expect(result.code.join("\n")).toContain('"name"');
      expect(result.code.join("\n")).toContain('"age"');
      expect(result.code.join("\n")).toContain("Unexpected property");
    });

    it("generates strict mode check with no allowed keys", () => {
      const ctx = createGeneratorContext();
      const result = generateStrictModeCheck("value", [], ctx);

      expect(result.code.join("\n")).toContain("Unexpected property");
      // Should not have key checks, just return error for any key
      expect(result.code.join("\n")).not.toContain('!== "');
    });

    it("uses custom error message", () => {
      const ctx = createGeneratorContext();
      const result = generateStrictModeCheck("value", ["name"], ctx, "Extra key found: ");

      expect(result.code.join("\n")).toContain("Extra key found: ");
    });
  });

  describe("generateMinKeysCheck", () => {
    it("generates correct minKeys check", () => {
      const ctx = createGeneratorContext();
      const result = generateMinKeysCheck("value", 2, ctx);

      expect(result.code).toContain("Object.keys(value).length < 2");
      expect(result.code).toContain("at least 2 keys");
    });

    it("uses custom error message", () => {
      const ctx = createGeneratorContext();
      const result = generateMinKeysCheck("value", 1, ctx, "Need at least one property");

      expect(result.code).toContain("Need at least one property");
    });
  });

  describe("generateMaxKeysCheck", () => {
    it("generates correct maxKeys check", () => {
      const ctx = createGeneratorContext();
      const result = generateMaxKeysCheck("value", 5, ctx);

      expect(result.code).toContain("Object.keys(value).length > 5");
      expect(result.code).toContain("at most 5 keys");
    });
  });

  describe("generateObjectValidation", () => {
    it("generates type check only when no constraints", () => {
      const ctx = createGeneratorContext();
      const result = generateObjectValidation("value", ctx);

      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain('typeof value !== "object"');
    });

    it("generates complete validation with properties", () => {
      const ctx = createGeneratorContext();
      const result = generateObjectValidation("value", ctx, {
        properties: [
          {
            name: "name",
            optional: false,
            generateCode: (varName, innerCtx) => {
              const check = generateStringTypeCheck(varName, innerCtx);
              return { code: [check.code], ctx: check.ctx };
            },
          },
          {
            name: "age",
            optional: false,
            generateCode: (varName, innerCtx) => {
              const check = generateNumberTypeCheck(varName, innerCtx);
              return { code: [check.code], ctx: check.ctx };
            },
          },
        ],
      });

      expect(result.code.length).toBeGreaterThan(1);
      expect(result.code[0]).toContain('typeof value !== "object"');
      expect(result.code.some((line) => line.includes('"name"'))).toBe(true);
      expect(result.code.some((line) => line.includes('"age"'))).toBe(true);
    });

    it("generates strict mode validation", () => {
      const ctx = createGeneratorContext();
      const result = generateObjectValidation("value", ctx, {
        properties: [{ name: "name", optional: false }],
        strict: true,
      });

      expect(result.code.join("\n")).toContain("hasOwnProperty");
      expect(result.code.join("\n")).toContain("Unexpected property");
    });

    it("generates key count constraints", () => {
      const ctx = createGeneratorContext();
      const result = generateObjectValidation("value", ctx, {
        properties: [],
        minKeys: { value: 1 },
        maxKeys: { value: 10 },
      });

      expect(result.code.join("\n")).toContain("Object.keys(value).length < 1");
      expect(result.code.join("\n")).toContain("Object.keys(value).length > 10");
    });
  });

  describe("createNestedObjectGenerator", () => {
    it("creates a generator for nested objects", () => {
      const nestedGenerator = createNestedObjectGenerator({
        properties: [
          {
            name: "street",
            optional: false,
            generateCode: (varName, innerCtx) => {
              const check = generateStringTypeCheck(varName, innerCtx);
              return { code: [check.code], ctx: check.ctx };
            },
          },
        ],
      });

      const ctx = createGeneratorContext();
      const result = nestedGenerator("address", ctx);

      expect(result.code[0]).toContain('typeof address !== "object"');
      expect(result.code.some((line) => line.includes('"street"'))).toBe(true);
    });
  });
});

describe("Object generated code execution", () => {
  it("object type check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateObjectTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);

    expect(fn({ name: "test" })).toBe(true);
    expect(fn({})).toBe(true);
    expect(fn(null)).toBe("Expected object");
    expect(fn("string")).toBe("Expected object");
    expect(fn(123)).toBe("Expected object");
    expect(fn(undefined)).toBe("Expected object");
  });

  it("property validation works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateObjectTypeCheck("value", ctx);
    const propResult = generatePropertyValidation(
      "value",
      {
        name: "name",
        optional: false,
        generateCode: (varName, innerCtx) => {
          const check = generateStringTypeCheck(varName, innerCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      },
      typeCheck.ctx
    );

    const code = [typeCheck.code, ...propResult.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({ name: "John" })).toBe(true);
    expect(fn({ name: 123 })).toContain("Expected string");
    // When property is missing, the type check receives undefined and returns type error
    expect(fn({})).toContain("Expected string");
  });

  it("optional property validation works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateObjectTypeCheck("value", ctx);
    const propResult = generatePropertyValidation(
      "value",
      {
        name: "nickname",
        optional: true,
        generateCode: (varName, innerCtx) => {
          const check = generateStringTypeCheck(varName, innerCtx);
          return { code: [check.code], ctx: check.ctx };
        },
      },
      typeCheck.ctx
    );

    const code = [typeCheck.code, ...propResult.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({ nickname: "Johnny" })).toBe(true);
    expect(fn({})).toBe(true); // Optional, so missing is OK
    expect(fn({ nickname: undefined })).toBe(true); // Explicitly undefined is OK
    expect(fn({ nickname: 123 })).toContain("Expected string");
  });

  it("strict mode check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateObjectTypeCheck("value", ctx);
    const strictCheck = generateStrictModeCheck("value", ["name", "age"], typeCheck.ctx);

    const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({ name: "John", age: 30 })).toBe(true);
    expect(fn({ name: "John" })).toBe(true);
    expect(fn({})).toBe(true);
    expect(fn({ name: "John", extra: "field" })).toContain("Unexpected property");
  });

  it("minKeys check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateObjectTypeCheck("value", ctx);
    const minKeysCheck = generateMinKeysCheck("value", 2, typeCheck.ctx);

    const code = [typeCheck.code, minKeysCheck.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({ a: 1, b: 2 })).toBe(true);
    expect(fn({ a: 1, b: 2, c: 3 })).toBe(true);
    expect(fn({ a: 1 })).toContain("at least 2 keys");
    expect(fn({})).toContain("at least 2 keys");
  });

  it("maxKeys check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateObjectTypeCheck("value", ctx);
    const maxKeysCheck = generateMaxKeysCheck("value", 2, typeCheck.ctx);

    const code = [typeCheck.code, maxKeysCheck.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({})).toBe(true);
    expect(fn({ a: 1 })).toBe(true);
    expect(fn({ a: 1, b: 2 })).toBe(true);
    expect(fn({ a: 1, b: 2, c: 3 })).toContain("at most 2 keys");
  });

  it("complete object validation works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateObjectValidation("value", ctx, {
      properties: [
        {
          name: "name",
          optional: false,
          generateCode: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
        {
          name: "age",
          optional: false,
          generateCode: (varName, innerCtx) => {
            const check = generateNumberTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
      ],
    });

    const code = [...result.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({ name: "John", age: 30 })).toBe(true);
    expect(fn({ name: "John", age: 30, extra: "ignored" })).toBe(true);
    // When property is missing, the type check receives undefined and returns type error
    expect(fn({ name: "John" })).toContain("Expected number");
    expect(fn({ name: 123, age: 30 })).toContain("Expected string");
    expect(fn({ name: "John", age: "thirty" })).toContain("Expected number");
  });

  it("nested object validation works correctly when executed", () => {
    const addressGenerator = createNestedObjectGenerator({
      properties: [
        {
          name: "street",
          optional: false,
          generateCode: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
        {
          name: "city",
          optional: false,
          generateCode: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
      ],
    });

    const ctx = createGeneratorContext();
    const result = generateObjectValidation("value", ctx, {
      properties: [
        {
          name: "name",
          optional: false,
          generateCode: (varName, innerCtx) => {
            const check = generateStringTypeCheck(varName, innerCtx);
            return { code: [check.code], ctx: check.ctx };
          },
        },
        {
          name: "address",
          optional: false,
          generateCode: addressGenerator,
        },
      ],
    });

    const code = [...result.code, "return true;"].join("\n");
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", code);

    expect(fn({ name: "John", address: { street: "123 Main St", city: "NYC" } })).toBe(true);
    // When nested property is missing, the type check receives undefined and returns type error
    expect(fn({ name: "John", address: { street: "123 Main St" } })).toContain("Expected string");
    expect(fn({ name: "John", address: "not an object" })).toContain("Expected object");
    // When address is missing, the nested object type check receives undefined
    expect(fn({ name: "John" })).toContain("Expected object");
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 8: Strict Object Validation
// Validates: Requirements 7.1, 7.2, 7.3, 7.4
// ============================================================================

describe("[🎲] Property 8: Strict Object Validation", () => {
  // Safe key filter: excludes __proto__ which has special behavior in JavaScript
  // Stryker disable next-line all: filter rarely triggered - __proto__ is almost never generated
  const safeKeyArb = fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s) && s !== "__proto__");
  const safeKeyArbLong = fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s) && s !== "__proto__");

  // ============================================================================
  // Property 8.1: strictObject generates extra keys verification
  // Validates: Requirement 7.1
  // ============================================================================
  describe("Requirement 7.1: strictObject generates extra keys verification", () => {
    itProp.prop([
      fc.array(safeKeyArbLong, {
        minLength: 0,
        maxLength: 5,
      }),
    ])(
      "[🎲] strict mode generates for...in loop with hasOwnProperty check",
      (allowedKeys) => {
        const uniqueKeys = [...new Set(allowedKeys)];
        const ctx = createGeneratorContext();
        const result = generateStrictModeCheck("value", uniqueKeys, ctx);

        const code = result.code.join("\n");

        // Must contain for...in loop (Requirement 7.4)
        expect(code).toContain("for (var");
        expect(code).toContain(" in value)");

        // Must use hasOwnProperty check (Requirement 7.4)
        expect(code).toContain("hasOwnProperty");

        // Must return error for unexpected properties
        expect(code).toContain("Unexpected property");
      }
    );

    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 5,
      }),
    ])(
      "[🎲] strict mode includes all allowed keys in the check",
      (allowedKeys) => {
        const uniqueKeys = [...new Set(allowedKeys)];
        const ctx = createGeneratorContext();
        const result = generateStrictModeCheck("value", uniqueKeys, ctx);

        const code = result.code.join("\n");

        // All allowed keys must be present in the generated code
        for (const key of uniqueKeys) {
          expect(code).toContain(`"${key}"`);
        }
      }
    );
  });

  // ============================================================================
  // Property 8.2: Objects with extra keys return error listing invalid keys
  // Validates: Requirement 7.2
  // ============================================================================
  describe("Requirement 7.2: Extra keys return error with key name", () => {
    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 3,
      }),
      safeKeyArb,
    ])(
      "[🎲] strict mode returns error containing the extra key name",
      (allowedKeys, extraKey) => {
        // Ensure extraKey is not in allowedKeys
        const uniqueAllowed = [...new Set(allowedKeys)];
        if (uniqueAllowed.includes(extraKey)) {
          return; // Skip this case
        }

        const ctx = createGeneratorContext();
        const typeCheck = generateObjectTypeCheck("value", ctx);
        const strictCheck = generateStrictModeCheck("value", uniqueAllowed, typeCheck.ctx);

        const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Create object with extra key
        const testObj: Record<string, unknown> = {};
        for (const key of uniqueAllowed) {
          testObj[key] = "value";
        }
        testObj[extraKey] = "extra";

        const result = fn(testObj);

        // Must return error string containing the extra key name
        expect(typeof result).toBe("string");
        expect(result).toContain(extraKey);
        expect(result).toContain("Unexpected property");
      }
    );

    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 5,
      }),
    ])(
      "[🎲] strict mode accepts objects with only allowed keys",
      (allowedKeys) => {
        const uniqueKeys = [...new Set(allowedKeys)];
        const ctx = createGeneratorContext();
        const typeCheck = generateObjectTypeCheck("value", ctx);
        const strictCheck = generateStrictModeCheck("value", uniqueKeys, typeCheck.ctx);

        const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Create object with only allowed keys
        const testObj: Record<string, unknown> = {};
        for (const key of uniqueKeys) {
          testObj[key] = "value";
        }

        const result = fn(testObj);

        // Must return true (valid)
        expect(result).toBe(true);
      }
    );

    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 2,
        maxLength: 5,
      }),
    ])(
      "[🎲] strict mode accepts objects with subset of allowed keys",
      (allowedKeys) => {
        const uniqueKeys = [...new Set(allowedKeys)];
        if (uniqueKeys.length < 2) return; // Need at least 2 keys for subset test

        const ctx = createGeneratorContext();
        const typeCheck = generateObjectTypeCheck("value", ctx);
        const strictCheck = generateStrictModeCheck("value", uniqueKeys, typeCheck.ctx);

        const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Create object with subset of allowed keys (first key only)
        const testObj: Record<string, unknown> = {};
        testObj[uniqueKeys[0]] = "value";

        const result = fn(testObj);

        // Must return true (valid) - subset is allowed
        expect(result).toBe(true);
      }
    );
  });

  // ============================================================================
  // Property 8.3: Loose object ignores extra keys
  // Validates: Requirement 7.3
  // ============================================================================
  describe("Requirement 7.3: Loose object ignores extra keys", () => {
    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 3,
      }),
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 3,
      }),
    ])(
      "[🎲] loose object (strict: false) accepts objects with extra keys",
      (definedKeys, extraKeys) => {
        const uniqueDefined = [...new Set(definedKeys)];
        const uniqueExtra = [...new Set(extraKeys)].filter((k) => !uniqueDefined.includes(k));

        if (uniqueExtra.length === 0) return; // Need at least one extra key

        const ctx = createGeneratorContext();
        const result = generateObjectValidation("value", ctx, {
          properties: uniqueDefined.map((name) => ({ name, optional: true })),
          strict: false, // Loose mode
        });

        const code = [...result.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        // Create object with defined + extra keys
        const testObj: Record<string, unknown> = {};
        for (const key of uniqueDefined) {
          testObj[key] = "value";
        }
        for (const key of uniqueExtra) {
          testObj[key] = "extra";
        }

        const fnResult = fn(testObj);

        // Must return true - extra keys are ignored in loose mode
        expect(fnResult).toBe(true);
      }
    );

    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 3,
      }),
    ])(
      "[🎲] loose object does not generate hasOwnProperty check",
      (definedKeys) => {
        const uniqueKeys = [...new Set(definedKeys)];
        const ctx = createGeneratorContext();
        const result = generateObjectValidation("value", ctx, {
          properties: uniqueKeys.map((name) => ({ name, optional: true })),
          strict: false, // Loose mode
        });

        const code = result.code.join("\n");

        // Loose mode should NOT contain hasOwnProperty check for extra keys
        // (it may contain it for property iteration, but not for strict validation)
        expect(code).not.toContain("Unexpected property");
      }
    );
  });

  // ============================================================================
  // Property 8.4: Uses for...in with hasOwnProperty for key iteration
  // Validates: Requirement 7.4
  // ============================================================================
  describe("Requirement 7.4: for...in with hasOwnProperty iteration", () => {
    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 0,
        maxLength: 5,
      }),
    ])(
      "[🎲] strict mode uses Object.prototype.hasOwnProperty.call pattern",
      (allowedKeys) => {
        const uniqueKeys = [...new Set(allowedKeys)];
        const ctx = createGeneratorContext();
        const result = generateStrictModeCheck("value", uniqueKeys, ctx);

        const code = result.code.join("\n");

        // Must use the safe hasOwnProperty pattern
        expect(code).toContain("Object.prototype.hasOwnProperty.call");
      }
    );

    it("[🎲] strict mode correctly handles objects with inherited properties", () => {
      const ctx = createGeneratorContext();
      const typeCheck = generateObjectTypeCheck("value", ctx);
      const strictCheck = generateStrictModeCheck("value", ["name"], typeCheck.ctx);

      const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      // Create object with prototype chain
      const proto = { inherited: "value" };
      const testObj = Object.create(proto);
      testObj.name = "John";

      const result = fn(testObj);

      // Must return true - inherited properties should be ignored
      expect(result).toBe(true);
    });
  });

  // ============================================================================
  // Combined strict object validation
  // ============================================================================
  describe("Combined strict object validation", () => {
    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 3,
      }),
      fc.boolean(),
    ])(
      "[🎲] generateObjectValidation respects strict flag",
      (definedKeys, strict) => {
        const uniqueKeys = [...new Set(definedKeys)];
        const ctx = createGeneratorContext();
        const result = generateObjectValidation("value", ctx, {
          properties: uniqueKeys.map((name) => ({ name, optional: true })),
          strict,
        });

        const code = result.code.join("\n");

        if (strict) {
          // Strict mode must have hasOwnProperty check
          expect(code).toContain("hasOwnProperty");
          expect(code).toContain("Unexpected property");
        } else {
          // Loose mode must NOT have unexpected property check
          expect(code).not.toContain("Unexpected property");
        }
      }
    );

    itProp.prop([
      fc.array(safeKeyArb, {
        minLength: 1,
        maxLength: 3,
      }),
      safeKeyArb,
    ])(
      "[🎲] strict vs loose mode behavior difference with extra keys",
      (definedKeys, extraKey) => {
        const uniqueKeys = [...new Set(definedKeys)];
        if (uniqueKeys.includes(extraKey)) return; // Skip if extraKey is in defined keys

        // Create test object with extra key
        const testObj: Record<string, unknown> = {};
        for (const key of uniqueKeys) {
          testObj[key] = "value";
        }
        testObj[extraKey] = "extra";

        // Test strict mode
        const strictCtx = createGeneratorContext();
        const strictResult = generateObjectValidation("value", strictCtx, {
          properties: uniqueKeys.map((name) => ({ name, optional: true })),
          strict: true,
        });
        const strictCode = [...strictResult.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const strictFn = new Function("value", strictCode);
        const strictOutput = strictFn(testObj);

        // Test loose mode
        const looseCtx = createGeneratorContext();
        const looseResult = generateObjectValidation("value", looseCtx, {
          properties: uniqueKeys.map((name) => ({ name, optional: true })),
          strict: false,
        });
        const looseCode = [...looseResult.code, "return true;"].join("\n");
        // eslint-disable-next-line no-new-func
        const looseFn = new Function("value", looseCode);
        const looseOutput = looseFn(testObj);

        // Strict mode should reject, loose mode should accept
        expect(typeof strictOutput).toBe("string");
        expect(strictOutput).toContain("Unexpected property");
        expect(looseOutput).toBe(true);
      }
    );
  });

  // ============================================================================
  // Edge cases
  // ============================================================================
  describe("Edge cases", () => {
    it("[🎲] strict mode with empty allowed keys rejects any property", () => {
      const ctx = createGeneratorContext();
      const typeCheck = generateObjectTypeCheck("value", ctx);
      const strictCheck = generateStrictModeCheck("value", [], typeCheck.ctx);

      const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      // Empty object should pass
      expect(fn({})).toBe(true);

      // Any property should fail
      expect(fn({ any: "value" })).toContain("Unexpected property");
    });

    it("[🎲] strict mode accepts empty object when keys are defined", () => {
      const ctx = createGeneratorContext();
      const typeCheck = generateObjectTypeCheck("value", ctx);
      const strictCheck = generateStrictModeCheck("value", ["name", "age"], typeCheck.ctx);

      const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");
      // eslint-disable-next-line no-new-func
      const fn = new Function("value", code);

      // Empty object should pass (no extra keys)
      expect(fn({})).toBe(true);
    });

    itProp.prop([
      fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.includes('"') || s.includes("'")),
    ])(
      "[🎲] strict mode handles property names with special characters",
      (specialKey) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateObjectTypeCheck("value", ctx);
        const strictCheck = generateStrictModeCheck("value", [specialKey], typeCheck.ctx);

        const code = [typeCheck.code, ...strictCheck.code, "return true;"].join("\n");

        // Code should be valid JavaScript
        expect(() => {
          // eslint-disable-next-line no-new-func
          new Function("value", code);
        }).not.toThrow();
      }
    );
  });
});
