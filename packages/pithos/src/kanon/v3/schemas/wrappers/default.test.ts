import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { default_, DefaultValues } from "./default";
import { cast } from "@arkhe/test/private-access";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("default_", () => {
  describe("validation", () => {
    it("should accept valid value", () => {
      const schema = default_(string(), "default");

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, "another").success).toBe(true);
    });

    it("should accept undefined and use default value", () => {
      const schema = default_(string(), "default");

      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should reject invalid value", () => {
      const schema = default_(string(), "default");

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Custom error";
      const schema = default_(string(), "default", customMessage);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should validate default value at creation for static values", () => {
      expect(() => default_(string(), cast<string>(123))).toThrow(
        "Invalid default value"
      );
    });

    it("should validate default value at runtime for function values", () => {
      const schema = default_(string(), () => cast<string>(123));

      const result = parse(schema, undefined);
      expect(result.success).toBe(false);
    });

    it("should use function default value when undefined", () => {
      let callCount = 0;
      const schema = default_(string(), () => {
        callCount++;
        return "dynamic";
      });

      expect(parse(schema, undefined).success).toBe(true);
      expect(callCount).toBe(1);

      expect(parse(schema, undefined).success).toBe(true);
      expect(callCount).toBe(2);
    });

    it("should not call function default when value is provided", () => {
      let callCount = 0;
      const schema = default_(string(), () => {
        callCount++;
        return "dynamic";
      });

      expect(parse(schema, "provided").success).toBe(true);
      expect(callCount).toBe(0);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = default_(string(), "default");

      const result = parse(schema, "test");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("string");
        expect(result.data).toBe("test");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty string default", () => {
      const schema = default_(string(), "");

      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, "").success).toBe(true);
    });

    it("should handle zero as default", () => {
      const schema = default_(number(), 0);

      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, 0).success).toBe(true);
    });

    it("should handle false as default", () => {
      const schema = default_(boolean(), false);

      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
    });

    it("should handle null (not undefined)", () => {
      const schema = default_(string(), "default");

      const result = parse(schema, null);
      expect(result.success).toBe(false);
    });

    it("should handle function that returns different values", () => {
      let counter = 0;
      const schema = default_(number(), () => {
        counter++;
        return counter;
      });

      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });
  });
});

describe("[👾] Mutation Tests", () => {
  describe("validator return values", () => {
    it("[👾] should return exactly true for valid input (not a string)", () => {
      // Kills mutant: if (typeof result === "string") → if (true) at line 45
      const schema = default_(string(), "default");
      const result = schema.validator("valid");
      expect(result).toBe(true);
    });

    it("[👾] should return exactly true when undefined with valid static default", () => {
      // Kills mutant: if (typeof result === "string") → if (true) at line 37
      const schema = default_(string(), "default");
      const result = schema.validator(undefined);
      expect(result).toBe(true);
    });

    it("[👾] should return exactly true when undefined with valid function default", () => {
      // Kills mutant: if (typeof result === "string") → if (true) at line 37
      const schema = default_(string(), () => "dynamic");
      const result = schema.validator(undefined);
      expect(result).toBe(true);
    });

    it("[👾] should return error message when function default returns invalid value", () => {
      // Kills mutants: return message || result → return false/return message && result at line 38
      const schema = default_(string(), () => cast<string>(123));
      const result = schema.validator(undefined);
      expect(typeof result).toBe("string");
      expect(result).toBe(ERROR_MESSAGES_COMPOSITION.string);
    });

    it("[👾] should return custom message when function default returns invalid value with custom message", () => {
      // Kills mutants: return message || result → return message && result at line 38
      const customMessage = "Custom error for invalid default";
      const schema = default_(string(), () => cast<string>(123), customMessage);
      const result = schema.validator(undefined);
      expect(result).toBe(customMessage);
    });
  });
});

describe("[🎯] Specification Tests", () => {
  describe("function default behavior", () => {
    it("[🎯] should call function for each missing value (Requirement 9.4)", () => {
      let callCount = 0;
      const schema = default_(string(), () => {
        callCount++;
        return `call-${callCount}`;
      });

      // First undefined - function should be called
      const result1 = parse(schema, undefined);
      expect(result1.success).toBe(true);
      expect(callCount).toBe(1);

      // Second undefined - function should be called again
      const result2 = parse(schema, undefined);
      expect(result2.success).toBe(true);
      expect(callCount).toBe(2);

      // Third undefined - function should be called again
      const result3 = parse(schema, undefined);
      expect(result3.success).toBe(true);
      expect(callCount).toBe(3);
    });

    it("[🎯] should not call function when value is provided", () => {
      let callCount = 0;
      const schema = default_(string(), () => {
        callCount++;
        return "default";
      });

      // Provide a value - function should NOT be called
      const result = parse(schema, "provided");
      expect(result.success).toBe(true);
      expect(callCount).toBe(0);
    });
  });

  describe("static default validation", () => {
    it("[🎯] should validate static default at creation time (Requirement 9.5)", () => {
      // Valid static default - should not throw
      expect(() => default_(string(), "valid")).not.toThrow();

      // Invalid static default - should throw at creation
      expect(() => default_(string(), cast<string>(123))).toThrow(
        "Invalid default value"
      );

      // Invalid static default with number schema
      expect(() => default_(number(), cast<number>("not a number"))).toThrow(
        "Invalid default value"
      );
    });

    it("[🎯] should NOT validate function default at creation time", () => {
      // Function default that returns invalid value - should NOT throw at creation
      expect(() => default_(string(), () => cast<string>(123))).not.toThrow();
    });

    it("[🎯] should validate function default at runtime", () => {
      const schema = default_(string(), () => cast<string>(123));

      // When undefined is passed, function is called and result is validated
      const result = parse(schema, undefined);
      expect(result.success).toBe(false);
    });
  });

  describe("undefined vs null handling", () => {
    it("[🎯] should use default value when undefined (Requirement 9.6)", () => {
      const schema = default_(string(), "default-value");

      const result = parse(schema, undefined);
      expect(result.success).toBe(true);
      // The validator returns true for undefined, meaning default is used
    });

    it("[🎯] should NOT use default value when null (Requirement 9.7)", () => {
      const schema = default_(string(), "default-value");

      // null should be passed to the inner schema, which will reject it
      const result = parse(schema, null);
      expect(result.success).toBe(false);
    });

    it("[🎯] should distinguish undefined from null with number schema", () => {
      const schema = default_(number(), 42);

      // undefined triggers default
      expect(parse(schema, undefined).success).toBe(true);

      // null does NOT trigger default, gets passed to inner schema
      expect(parse(schema, null).success).toBe(false);
    });

    it("[🎯] should distinguish undefined from null with boolean schema", () => {
      const schema = default_(boolean(), true);

      // undefined triggers default
      expect(parse(schema, undefined).success).toBe(true);

      // null does NOT trigger default, gets passed to inner schema
      expect(parse(schema, null).success).toBe(false);
    });
  });
});

describe("DefaultValues", () => {
  describe("now", () => {
    it("should return a Date object", () => {
      const date = DefaultValues.now();
      expect(date instanceof Date).toBe(true);
    });

    it("should return current date", () => {
      const before = Date.now();
      const date = DefaultValues.now();
      const after = Date.now();

      expect(date.getTime()).toBeGreaterThanOrEqual(before);
      expect(date.getTime()).toBeLessThanOrEqual(after);
    });
  });

  describe("uuid", () => {
    let originalCrypto: typeof globalThis.crypto | undefined;

    beforeEach(() => {
      originalCrypto = globalThis.crypto;
    });

    afterEach(() => {
      if (originalCrypto) {
        Object.defineProperty(globalThis, "crypto", {
          value: originalCrypto,
          writable: true,
          configurable: true,
        });
      } else {
        delete (globalThis as { crypto?: typeof globalThis.crypto }).crypto;
      }
    });

    it("should return a string", () => {
      const uuid = DefaultValues.uuid();
      expect(typeof uuid).toBe("string");
    });

    it("should return a valid UUID format", () => {
      const uuid = DefaultValues.uuid();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });

    it("should return different UUIDs on each call", () => {
      const uuid1 = DefaultValues.uuid();
      const uuid2 = DefaultValues.uuid();
      expect(uuid1).not.toBe(uuid2);
    });

    it("should use fallback when crypto.randomUUID is not available", () => {
      // Mock crypto without randomUUID
      Object.defineProperty(globalThis, "crypto", {
        value: {},
        writable: true,
        configurable: true,
      });

      const uuid = DefaultValues.uuid();
      expect(typeof uuid).toBe("string");

      // Verify UUID format (fallback should still produce valid format)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });

    it("should use fallback when crypto is undefined", () => {
      // Remove crypto completely
      delete (globalThis as { crypto?: typeof globalThis.crypto }).crypto;

      const uuid = DefaultValues.uuid();
      expect(typeof uuid).toBe("string");

      // Verify UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });
  });

  describe("timestamp", () => {
    it("should return a number", () => {
      const timestamp = DefaultValues.timestamp();
      expect(typeof timestamp).toBe("number");
    });

    it("should return current timestamp", () => {
      const before = Date.now();
      const timestamp = DefaultValues.timestamp();
      const after = Date.now();

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe("emptyArray", () => {
    it("should return an empty array", () => {
      const arr = DefaultValues.emptyArray();
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).toBe(0);
    });

    it("should return a new array on each call", () => {
      const arr1 = DefaultValues.emptyArray();
      const arr2 = DefaultValues.emptyArray();
      expect(arr1).not.toBe(arr2);
    });
  });

  describe("emptyObject", () => {
    it("should return an empty object", () => {
      const obj = DefaultValues.emptyObject();
      expect(typeof obj).toBe("object");
      expect(Object.keys(obj).length).toBe(0);
    });

    it("should return a new object on each call", () => {
      const obj1 = DefaultValues.emptyObject();
      const obj2 = DefaultValues.emptyObject();
      expect(obj1).not.toBe(obj2);
    });

    it("should accept undefined when default is provided", () => {
      const schema = default_(string(), "default");
      const result = parse(schema, undefined);

      expect(result.success).toBe(true);
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    describe("string schema", () => {
      itProp.prop([fc.string()])(
        "[🎲] should accept any string with default",
        (value) => {
          const schema = default_(string(), "default");
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toBe(value);
          }
        }
      );

      itProp.prop([fc.string()])(
        "[🎲] should use provided default for undefined",
        (defaultValue) => {
          const schema = default_(string(), defaultValue);
          const result = parse(schema, undefined);
          expect(result.success).toBe(true);
        }
      );

      itProp.prop([fc.oneof(fc.integer(), fc.boolean())])(
        "[🎲] should reject non-string, non-undefined values",
        (value) => {
          const schema = default_(string(), "default");
          expect(parse(schema, value).success).toBe(false);
        }
      );
    });

    describe("number schema", () => {
      itProp.prop([fc.double({ noNaN: true })])(
        "[🎲] should accept any number with default",
        (value) => {
          const schema = default_(number(), 0);
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toBe(value);
          }
        }
      );

      itProp.prop([fc.double({ noNaN: true })])(
        "[🎲] should use provided number default for undefined",
        (defaultValue) => {
          const schema = default_(number(), defaultValue);
          const result = parse(schema, undefined);
          expect(result.success).toBe(true);
        }
      );
    });

    describe("boolean schema", () => {
      itProp.prop([fc.boolean()])(
        "[🎲] should accept any boolean with default",
        (value) => {
          const schema = default_(boolean(), false);
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toBe(value);
          }
        }
      );

      itProp.prop([fc.boolean()])(
        "[🎲] should use provided boolean default for undefined",
        (defaultValue) => {
          const schema = default_(boolean(), defaultValue);
          const result = parse(schema, undefined);
          expect(result.success).toBe(true);
        }
      );
    });

    describe("function default", () => {
      itProp.prop([
        fc.array(fc.constant(undefined), { minLength: 1, maxLength: 10 }),
      ])(
        "[🎲] should call function default for each undefined",
        (undefinedValues) => {
          let callCount = 0;
          const schema = default_(string(), () => {
            callCount++;
            return `call-${callCount}`;
          });

          for (const value of undefinedValues) {
            parse(schema, value);
          }

          expect(callCount).toBe(undefinedValues.length);
        }
      );

      itProp.prop([fc.array(fc.string(), { minLength: 1, maxLength: 10 })])(
        "[🎲] should not call function default when value is provided",
        (values) => {
          let callCount = 0;
          const schema = default_(string(), () => {
            callCount++;
            return "default";
          });

          for (const value of values) {
            parse(schema, value);
          }

          expect(callCount).toBe(0);
        }
      );
    });
  });
});
